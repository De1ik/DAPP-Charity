import { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function UploadDocument() {
  const { address } = useParams()
  const [file, setFile] = useState(null)
  const [response, setResponse] = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('address', address)
    formData.append('document', file)

    const res = await fetch('http://localhost:8080/auth/upload-doc', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    setResponse(data)
  }

  return (
    <div>
      <h2>Submit Document for Verification</h2>
      <p><strong>Wallet:</strong> {address}</p>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  )
}
