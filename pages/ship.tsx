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
    router.push(`/${page.toLowerCase()}?name=${shipName}&date=${date}&value=${carriedValue}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <ArawHeader />
      <div className="mb-4">
        <label className="block mb-1">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Ship Name:</label>
        <input
          type="text"
          value={shipName}
          disabled
          className="border p-2 w-full bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Carried Forward Value:</label>
        <input
          type="text"
          value={carriedValue}
          onChange={(e) => setCarriedValue(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <button onClick={() => goToPage('loading')} className="bg-blue-500 text-white px-4 py-2 rounded">Loading</button>
        <button onClick={() => goToPage('discharge')} className="bg-green-500 text-white px-4 py-2 rounded">Discharge</button>
        <button onClick={() => goToPage('expense')} className="bg-red-500 text-white px-4 py-2 rounded">Expense</button>
      </div>
      <div className="flex justify-between">
        <button onClick={() => router.push('/')} className="border px-4 py-2 rounded">Back</button>
        <button onClick={() => goToPage('loading')} className="bg-black text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  )
}
