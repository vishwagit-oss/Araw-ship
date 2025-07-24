// pages/ship.tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ArawHeader from '../components/ArawHeader'

export default function ShipPage() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [shipName, setShipName] = useState('')
  const [carriedValue, setCarriedValue] = useState('')

  useEffect(() => {
    if (router.isReady) {
      const { name, date } = router.query
      setShipName(name as string)
      setDate(date as string)
    }
  }, [router.isReady])

  const goToPage = (page: string) => {
    router.push(`/${page}?name=${shipName}&date=${date}`)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <ArawHeader />
      <h1 className="text-2xl font-bold mb-4 text-center">{shipName}</h1>

      <label className="block mb-1">Date:</label>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <label className="block mb-1">Carried Forward Value:</label>
      <input
        type="text"
        value={carriedValue}
        onChange={e => setCarriedValue(e.target.value)}
        className="border p-2 w-full mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button onClick={() => goToPage('loading')} className="w-full bg-blue-500 text-white p-3 rounded">Loading</button>
        <button onClick={() => goToPage('discharge')} className="w-full bg-green-500 text-white p-3 rounded">Discharge</button>
        <button onClick={() => goToPage('expense')} className="w-full bg-red-500 text-white p-3 rounded">Expenses</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => router.push('/')} className="w-full sm:w-auto border p-2 rounded">Back</button>
        <button onClick={() => goToPage('loading')} className="w-full sm:w-auto bg-black text-white p-2 rounded">Next</button>
      </div>
    </div>
  )
}
