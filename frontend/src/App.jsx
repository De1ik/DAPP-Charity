import { useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const [address, setAddress] = useState(null)
  const [response, setResponse] = useState(null)
  const navigate = useNavigate()

  const checkNft = async (userAddress) => {
    const res = await fetch('http://localhost:8080/auth/check-nft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: userAddress })
    })
    return await res.json()
  }

  const loginWithMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      const message = `Login attempt at ${new Date().toISOString()}`
      const signature = await signer.signMessage(message)

      const res = await fetch('http://localhost:8080/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress, message, signature })
      })

      const verifyResult = await res.json()
      setAddress(userAddress)

      if (verifyResult.success) {
        const nftResult = await checkNft(userAddress)

        if (nftResult.access) {
          setResponse({ verified: true, hasAccessNFT: true, message: '✅ Access granted.' })
        } else {
          navigate(`/upload/${userAddress}`) // ➜ переходимо на сторінку завантаження документа
        }
      } else {
        setResponse({ verified: false, message: verifyResult.message })
      }
    } catch (err) {
      console.error(err)
      setResponse({ error: err.message })
    }
  }

  return (
    <div className="App">
      <h1>MetaMask Login</h1>
      <button onClick={loginWithMetaMask}>Login with MetaMask</button>

      {address && <p><strong>Address:</strong> {address}</p>}
      {response && (
        <pre style={{ textAlign: 'left', background: '#eee', padding: '1rem' }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App
