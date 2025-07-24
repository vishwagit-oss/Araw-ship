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
      setShipName(name as string || '')
      setDate(date as string || '')
    }
  }, [router.isReady, router.query])

  const goToPage = (page: string) => {
    if (!shipName || !date) {
      alert('Please select both ship and date before continuing.')
      return
    }
    router.push(`/${page}?name=${encodeURIComponent(shipName)}&date=${encodeURIComponent(date)}`)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <ArawHeader />

      <h1 className="text-2xl font-bold mb-6 text-center">{shipName || 'Select Ship'}</h1>

      <label htmlFor="date" className="block mb-1 font-semibold">Date:</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <label htmlFor="carriedValue" className="block mb-1 font-semibold">Carried Forward Value:</label>
      <input
        id="carriedValue"
        type="text"
        value={carriedValue}
        onChange={e => setCarriedValue(e.target.value)}
        className="border p-2 w-full mb-6 rounded"
        placeholder="Enter carried forward value"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => goToPage('loading')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded transition"
          aria-label="Go to Loading page"
        >
          Loading
        </button>
        <button
          onClick={() => goToPage('discharge')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded transition"
          aria-label="Go to Discharge page"
        >
          Discharge
        </button>
        <button
          onClick={() => goToPage('expense')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold p-3 rounded transition"
          aria-label="Go to Expense page"
        >
          Expenses
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push('/')}
          className="w-full sm:w-auto border border-gray-400 p-2 rounded hover:bg-gray-100 transition"
          aria-label="Go back to home page"
        >
          Back
        </button>
        <button
          onClick={() => goToPage('loading')}
          className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white p-2 rounded font-semibold transition"
          aria-label="Go to next page: Loading"
        >
          Next
        </button>
      </div>
    </div>
  )
}
