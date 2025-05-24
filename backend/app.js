import 'dotenv/config'
import express from 'express'
import Gun from 'gun'
import http from 'http'
import cors from 'cors'
import multer from 'multer'
import {ethers} from "ethers"
import { create } from '@web3-storage/w3up-client'
import { File, Blob } from 'formdata-node'
import { verifyMessage } from 'ethers'
import { readFile } from 'fs/promises'


const app = express()
const upload = multer()
const server = http.createServer(app)

const abiText = await readFile('./abi/accessNftAbi.json', 'utf-8')
const accessNftAbi = JSON.parse(abiText)

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const nftContract = new ethers.Contract(
  process.env.NFT_CONTRACT_ADDRESS,
  accessNftAbi,
  signer
)


const gun = Gun({
  web: server,
  peers: ['https://gun-manhattan.herokuapp.com/gun'],
  file: 'data.json'
})

const PORT = 8080
const client = await create()

const initializeConnectionIpfs = async () => {
  await client.login(process.env.IPFS_EMAIL);
  await client.setCurrentSpace(process.env.IPFS_SPACE)
}

const isAdmin = async (req, res, next) => {
  const {address} = req.body;

  if (!address || address.toLowerCase() !== process.env.ADMIN_ADDRESS.toLowerCase()) {
    return res.status(403).json({ success: false, error: 'Not authorized (not admin)' })
  }

  try {
    const balance = await nftContract.balanceOf(address);
    if (balance > 0)
      next()
    else
    return res.status(403).json({success: false, error: "Not authorized (no NFT)"})
  } catch(err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Admin check failed"})
  }
}

app.use(cors())
app.use(express.json())

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, description, goal, ended_at, address, videoUrl } = req.body;
    let imageCid = null, imageUrl = null;

    if (req.file) {
      const imageFile = new File([req.file.buffer], req.file.originalname, {
        type: req.file.mimetype
      });
      imageCid = await client.uploadFile(imageFile);
      imageUrl = `ipfs://${imageCid}`;
    }
    const metadata = {
      name,
      description,
      goal: parseFloat(goal),
      ended_at,
      image: `ipfs://${imageCid}`,
      videoUrl: videoUrl,
      createdAt: new Date().toISOString(),
      owner: address ? address.toLowerCase() : null
    }

    const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    const jsonFile = new File([jsonBlob], 'bank-metadata.json')
    const jsonCid = await client.uploadFile(jsonFile)

    const id = Date.now().toString()
    gun.get('banks').get(id).put({ cid: jsonCid.toString(), owner: address ? address.toLowerCase() : null })

    res.json({
      success: true,
      metadataCID: jsonCid.toString(),
      metadataUrl: `https://ipfs.io/ipfs/${jsonCid}`,
      imageCID: imageCid.toString(),
      imageUrl: `https://ipfs.io/ipfs/${imageCid}`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Upload failed' })
  }
})

app.get("/banks", (req, res) => {
  const banks = []
  gun.get('banks').map().once((data, key) => {
    if (data) banks.push({ id: key, cid: data.cid })
  })
  setTimeout(() => res.json(banks), 500)
})

app.post("/auth/verify", (req, res) => {
    const {address, message, signature } = req.body;

    try {
        const recovered = verifyMessage(message, signature);
        if (recovered.toLowerCase() === address.toLowerCase())
            return res.json({success: true, message: "Signature valid", address})
        else
            return res.status(401).json({success: false, message: "Invalid signature"})
    } catch (err) {
        console.error(err)
        return res.status(400).json({success: false, message: "Verification failed"})
    }
})

app.post("/auth/check-nft", async (req, res) => {
    const {address} = req.body;

    try {
        const balance = await nftContract.balanceOf(address);
        if (balance > 0)
            return res.json({success: true, access: true})
        else
            return res.json({success: true, access: false})
    } catch(err) {
        console.error(err)
        res.status(500).json({ success: false, error: 'NFT check failed' })
    }
})

app.post("/auth/upload-doc", upload.single("document"), async (req, res) => {
  try {
    const { address } = req.body
    const documentBuffer = req.file.buffer

    const documentFile = new File([documentBuffer], req.file.originalname, {
      type: req.file.mimetype
    })

    const documentCid = await client.uploadFile(documentFile)
    const documentUrl = `https://ipfs.io/ipfs/${documentCid}`

    const id = Date.now().toString()
    gun.get('verification_requests').get(id).put({
      address,
      documentCid: documentCid.toString(),
      documentUrl,
      createdAt: new Date().toISOString(),
      status: "pending"
    })

    res.json({
      success: true,
      documentCid: documentCid.toString(),
      documentUrl
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Document upload failed' })
  }
})

app.get("/admin/verification-requests", isAdmin, (req, res) => {
  const list = []
  gun.get('verification_requests').map().once((data, key) => {
    if (data) list.push({ id: key, ...data })
  })
  setTimeout(() => res.json(list), 500)
})

app.post('/auth/mint-nft', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ success: false, error: "Missing address" });
  try {
    const tx = await nftContract.mint(address);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'NFT mint failed' });
  }
});



server.listen(PORT, async () => {
  try {
    await initializeConnectionIpfs()
    console.log(`Server running at http://localhost:${PORT}`)
  } catch (err) {
    console.error('IPFS init failed:', err)
  }
})

app.post("/user/banks", (req, res) => {
  const { address } = req.body
  const banks = []

  gun.get('users')
     .get(address.toLowerCase())
     .get('banks')
     .map()
     .once((data) => {
        if (data) banks.push(data)
     })

  setTimeout(() => res.json(banks), 500)
})


