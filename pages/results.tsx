import { useEffect, useState } from 'react'
import ArawHeader from '../components/ArawHeader'

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [shipFilter, setShipFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchData() // Load default past 30 days
  }, [])

  const fetchData = async () => {
    const params = new URLSearchParams()

    if (shipFilter) params.append('ship', shipFilter)
    if (startDate) params.append('start', startDate)
    if (endDate) params.append('end', endDate)

    const res = await fetch(`/api/results?${params.toString()}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
      <ArawHeader />
      <div className="flex justify-center mb-6 gap-4">
  <button
    onClick={() => window.location.href = '/'}
    className="bg-gray-700 text-white px-8 py-3 text-lg font-bold rounded shadow hover:bg-gray-800"
  >
    🏠 Home
  </button>
</div>



      <h1 className="text-3xl font-bold text-center mb-6">Result Summary</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={shipFilter}
          onChange={(e) => setShipFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        >
          <option value="">All Ships</option>
          <option value="MAHRU">MAHRU</option>
          <option value="PHOENIX31">PHOENIX31</option>
          <option value="KOKO">KOKO</option>
          <option value="APRIL-2">APRIL-2</option>
          <option value="SEA REGENT">SEA REGENT</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm border border-collapse border-gray-400">
        <thead className="bg-gray-200 text-xs">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Ship</th>
            <th className="border p-2">Buyer/Our Ship</th>
            <th className="border p-2">IG Type</th>
            <th className="border p-2">MT</th>
            <th className="border p-2">Price (USD)</th>
            <th className="border p-2">Value (AED)</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Total Paid</th>
            <th className="border p-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-4">No data found.</td>
            </tr>
          ) : (
            results.map((entry, index) => (
              <tr key={index}>
                <td className="border p-2">{entry.date}</td>
                <td className="border p-2">{entry.shipName}</td>
                <td className="border p-2">{entry.buyerOrOurShip || '-'}</td>
                <td className="border p-2">{entry.igType || '-'}</td>
                <td className="border p-2">{entry.mt || '-'}</td>
                <td className="border p-2">{entry.usdPrice || '-'}</td>
                <td className="border p-2">{entry.valueAED || '-'}</td>
                <td className="border p-2">{entry.paid || '-'}</td>
                <td className="border p-2">{entry.totalPaid || '-'}</td>
                <td className="border p-2">{entry.remarks || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
