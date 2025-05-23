import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import { create } from '@web3-storage/w3up-client'
import { File, Blob } from 'formdata-node'



const app = express()
const upload = multer()

const PORT = 8080;
const client = await create()


const initializeConnectionIpfs = async () => {
    await client.login(process.env.IPFS_EMAIL);
    await client.setCurrentSpace(process.env.IPFS_SPACE)
}

app.listen(PORT, (error) => {
    if (!error) {
        console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
        );
        initializeConnectionIpfs();
    } else {
        console.log("Error occurred, server can't start", error);
    }
})

app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const { name, description, goal, ended_at } = req.body
        const imageBuffer = req.file.buffer
        const imageFile = new File([imageBuffer], req.file.originalname, {
            type: req.file.mimetype
        });
        
        const imageCid = await client.uploadFile(imageFile)
        const imageIpfsUrl = `ipfs://${imageCid}`

        const metadata = {
            name,
            description,
            goal: parseFloat(goal),
            ended_at,
            image: imageIpfsUrl,
            createdAt: new Date().toISOString()
        }   

        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        const jsonFile = new File([jsonBlob], 'bank-metadata.json')
        
        const jsonCid = await client.uploadFile(jsonFile)
        const jsonIpfsUrl = `ipfs://${jsonCid}`
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