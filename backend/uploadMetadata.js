import 'dotenv/config'
import { create } from '@web3-storage/w3up-client'
import fs from 'fs/promises'
import path from 'path'
import { File } from 'formdata-node'

const client = await create()
await client.login(process.env.IPFS_EMAIL)
await client.setCurrentSpace(process.env.IPFS_SPACE)

const metadataDir = './nft_metadata'
const files = await fs.readdir(metadataDir)

const ipfsFiles = []
for (const filename of files) {
  if (!filename.endsWith('.json')) continue
  const filePath = path.join(metadataDir, filename)
  const content = await fs.readFile(filePath)
  ipfsFiles.push(new File([content], filename, { type: 'application/json' }))
}

const cid = await client.uploadDirectory(ipfsFiles)
console.log(`✅ Uploaded folder to IPFS!`)
console.log(`baseURI = ipfs://${cid}/`)
