import { useEffect, useState } from 'react'
import ArawHeader from '../components/ArawHeader'

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [shipFilter, setShipFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [recentlyDeleted, setRecentlyDeleted] = useState<any[] | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const params = new URLSearchParams()
    if (shipFilter) params.append('ship', shipFilter)
    if (startDate) params.append('start', startDate)
    if (endDate) params.append('end', endDate)

    const res = await fetch(`/api/results?${params.toString()}`)
    const data = await res.json()
    setResults(data)
    setSelectedIds(new Set())
    setRecentlyDeleted(null)
    setSelectionMode(false)
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelectedIds(newSelected)
  }

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!window.confirm(`Delete ${selectedIds.size} selected entr${selectedIds.size > 1 ? 'ies' : 'y'}?`)) return

    const toDelete = results.filter(r => selectedIds.has(r.id))
    const res = await fetch('/api/delete-multiple-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    })

    if (res.ok) {
      setRecentlyDeleted(toDelete)
      setResults(results.filter(r => !selectedIds.has(r.id)))
      setSelectedIds(new Set())
      setSelectionMode(false)
    } else {
      alert('Delete failed')
    }
  }

  const undoDelete = async () => {
    if (!recentlyDeleted) return
    const res = await fetch('/api/undo-multiple-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: recentlyDeleted }),
    })

    if (res.ok) {
      fetchData()
    } else {
      alert('Undo failed')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
      <ArawHeader />

      {/* Top controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-700 text-white px-8 py-3 text-lg font-bold rounded shadow hover:bg-gray-800"
        >
          🏠 Home
        </button>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-4xl">
          <select
            value={shipFilter}
            onChange={(e) => setShipFilter(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
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
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />

          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Filter
          </button>
        </div>

        {/* Select Mode Toggle / Action Buttons */}
        {!selectionMode ? (
          <button
            onClick={() => setSelectionMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Select
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={deleteSelected}
              disabled={selectedIds.size === 0}
              className={`px-4 py-2 rounded text-white ${
                selectedIds.size > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              🗑️ Delete Selected
            </button>
            <button
              onClick={() => {
                setSelectionMode(false)
                setSelectedIds(new Set())
              }}
              className="px-4 py-2 rounded border border-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Undo Button */}
      {recentlyDeleted && (
        <div className="mb-4">
          <button
            onClick={undoDelete}
            className="text-blue-700 underline hover:text-blue-900"
          >
            ↩️ Undo Last Delete
          </button>
        </div>
      )}

      {/* Table */}
      <table className="min-w-full text-sm border border-collapse border-gray-400">
        <thead className="bg-gray-200 text-xs">
          <tr>
            {selectionMode && <th className="border p-2 w-12 text-center">Select</th>}
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
              <td colSpan={selectionMode ? 11 : 10} className="text-center py-4">
                No data found.
              </td>
            </tr>
          ) : (
            results.map((entry) => {
              const isSelected = selectedIds.has(entry.id)
              return (
                <tr
                  key={entry.id}
                  className={isSelected ? 'bg-yellow-100' : ''}
                >
                  {selectionMode && (
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(entry.id)}
                      />
                    </td>
                  )}
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
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
