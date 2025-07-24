import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode'
import ArawHeader from '../components/ArawHeader'

// ✅ Define the expected shape of the decoded JWT
type DecodedToken = {
  email: string
  iat?: number
  exp?: number
}

const ships = ['MAHRU', 'PHOENIX31', 'KOKO', 'APRIL-2', 'SEA REGENT']

export default function Home() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDate(today)

    const cookie = document.cookie
    const match = cookie.match(/token=([^;]+)/)

    if (match) {
      const token = match[1]
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        if (decoded?.email === 'vishwagohil21@gmail.com') {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('❌ Invalid token:', err)
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [])

  const goToShipPage = (shipName: string) => {
    router.push(`/ship?name=${encodeURIComponent(shipName)}&date=${date}`)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <ArawHeader />

      <div className="flex justify-center mb-6">
        <button
          onClick={() => router.push('/results')}
          className="bg-blue-700 text-white px-8 py-3 text-lg font-bold rounded shadow hover:bg-blue-800"
        >
          📊 Result
        </button>
      </div>

      <label className="block mb-2">Date:</label>
      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <h2 className="text-xl font-semibold mb-2">Select a Ship:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ships.map(ship => (
          <button
            key={ship}
            onClick={() => goToShipPage(ship)}
            className="w-full border p-3 bg-blue-100 hover:bg-blue-200 rounded text-center"
          >
            {ship}
          </button>
        ))}
      </div>
    </div>
  )
}
