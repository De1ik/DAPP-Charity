import 'dotenv/config'
import express from 'express'
import Gun from 'gun'
import http from 'http'
import multer from 'multer'
import { create } from '@web3-storage/w3up-client'
import { File, Blob } from 'formdata-node'

const app = express()
const upload = multer()
const server = http.createServer(app)

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

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, description, goal, ended_at } = req.body
    const imageBuffer = req.file.buffer
    const imageFile = new File([imageBuffer], req.file.originalname, {
      type: req.file.mimetype
    })

    const imageCid = await client.uploadFile(imageFile)
    const metadata = {
      name,
      description,
      goal: parseFloat(goal),
      ended_at,
      image: `ipfs://${imageCid}`,
      createdAt: new Date().toISOString()
    }

    const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    const jsonFile = new File([jsonBlob], 'bank-metadata.json')
    const jsonCid = await client.uploadFile(jsonFile)

    const id = Date.now().toString()
    gun.get('banks').get(id).put({ cid: jsonCid.toString() })

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

app.get("/", (req, res) => {
  res.send("🚀 IPFS + Gun.js Bank backend is running")
})

server.listen(PORT, async () => {
  try {
    await initializeConnectionIpfs()
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  } catch (err) {
    console.error('❌ IPFS init failed:', err)
  }
})
