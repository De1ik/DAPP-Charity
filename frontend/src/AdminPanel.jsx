import { useEffect, useState } from 'react'

// Заміни на свою адресу явно, або отримуй через props
const ADMIN_ADDRESS = "0x51a029d26c832c90970871fa1c836430E60FE190";

export default function AdminPanel({ address }) {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState({})
  const [access, setAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!address) return

      const res = await fetch('http://localhost:8080/auth/check-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })

      const data = await res.json()
      if (data.access && address.toLowerCase() === ADMIN_ADDRESS) {
        setAccess(true)
        const reqs = await fetch('http://localhost:8080/admin/requests')
        const json = await reqs.json()
        setRequests(json)
      }
      setLoading(false)
    }

    checkAccess()
  }, [address])

  const approve = async (address, id) => {
    const res = await fetch('http://localhost:8080/admin/mint-nft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, id })
    })
    const data = await res.json()
    setStatus(prev => ({ ...prev, [id]: data }))
  }

  if (loading) return <p>Checking access...</p>
  if (!access) return <p>❌ Access denied</p>

  return (
    <div>
      <h2>🔐 Admin Verification Panel</h2>
      {requests.map(r => (
        <div key={r.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
          <p><strong>Wallet:</strong> {r.address}</p>
          <p><strong>Status:</strong> {r.status}</p>
          <a href={r.documentUrl} target="_blank" rel="noreferrer">📄 View Document</a><br />
          <button disabled={r.status === 'approved'} onClick={() => approve(r.address, r.id)}>
            ✅ Approve & Mint NFT
          </button>
          {status[r.id] && <pre>{JSON.stringify(status[r.id], null, 2)}</pre>}
        </div>
      ))}
    </div>
  )
}
