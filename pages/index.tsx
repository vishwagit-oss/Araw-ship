import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ArawHeader from '../components/ArawHeader'

const ships = ['MAHRU', 'PHOENIX31', 'KOKO', 'APRIL-2', 'SEA REGENT']

export default function Home() {
  const router = useRouter()
  const [date, setDate] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDate(today)
  }, [])

  const goToShipPage = (shipName: string) => {
    router.push(`/ship?name=${encodeURIComponent(shipName)}&date=${date}`)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <ArawHeader />
      <label className="block mb-2">Date:</label>
      <div className="flex justify-center mb-6">
      <button
         onClick={() => window.location.href = '/results'}
         className="bg-blue-700 text-white px-8 py-3 text-lg font-bold rounded shadow hover:bg-blue-800"
      >
    
      </button>
      </div>



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
