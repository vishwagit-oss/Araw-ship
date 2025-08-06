'use client'

import { useEffect, useState } from 'react'
import ArawHeader from '../components/ArawHeader'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Image from 'next/image'

type Entry = {
  id: string
  date: string
  shipName: string
  buyerOrOurShip?: string
  igType?: string
  mt?: number
  usdPrice?: number
  valueAED?: number
  paid?: number
  totalPaid?: number
  remarks?: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<Entry[]>([])
  const [shipFilter, setShipFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [recentlyDeleted, setRecentlyDeleted] = useState<Entry[] | null>(null)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const p = new URLSearchParams()
    if (shipFilter) p.append('ship', shipFilter)
    if (startDate) p.append('start', startDate)
    if (endDate) p.append('end', endDate)

    const res = await fetch(`/api/results?${p.toString()}`)
    if (!res.ok) return alert('Failed to load results')
    const data = await res.json()
    setResults(data.map((e: any) => ({
      ...e,
      mt: Number(e.mt) || 0,
      usdPrice: Number(e.usdPrice) || 0,
      valueAED: Number(e.valueAED) || 0,
      paid: Number(e.paid) || 0,
      totalPaid: Number(e.totalPaid) || 0,
    })))
    setSelectedIds(new Set())
    setRecentlyDeleted(null)
    setSelectionMode(false)
  }

  const totals = results.reduce((acc, e) => {
    acc.mt += e.mt
    acc.valueAED += e.valueAED
    acc.paid += e.paid
    acc.totalPaid += e.totalPaid
    return acc
  }, { mt: 0, valueAED: 0, paid: 0, totalPaid: 0 })

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedIds(next)
  }

  const deleteSelected = async () => {
    if (!selectedIds.size) return
    if (!confirm(`Delete ${selectedIds.size} entr${selectedIds.size > 1 ? 'ies' : 'y'}?`)) return
    const toDel = results.filter(r => selectedIds.has(r.id))
    const res = await fetch('/api/delete-multiple-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) })
    })
    if (res.ok) {
      setRecentlyDeleted(toDel)
      setResults(r => r.filter(r => !selectedIds.has(r.id)))
      setSelectionMode(false)
    } else alert('Delete failed')
  }

  const undoDelete = async () => {
    if (!recentlyDeleted) return
    const res = await fetch('/api/undo-multiple-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: recentlyDeleted })
    })
    res.ok ? fetchData() : alert('Undo failed')
  }

  return (
    <div className="relative min-h-screen overflow-x-auto bg-cover bg-center" style={{ backgroundImage: "url('/results-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto p-4 text-black dark:text-white"
      >
        <ArawHeader />

        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded shadow text-sm"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-700 text-white px-6 py-3 text-lg font-bold rounded shadow hover:bg-gray-800 w-full sm:w-auto"
          >
            🏠 Home
          </button>

          <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-4xl w-full sm:w-auto">
            <select
              value={shipFilter}
              onChange={(e) => setShipFilter(e.target.value)}
              className="border p-2 rounded w-full sm:w-auto text-black dark:text-white dark:bg-gray-700"
            >
              <option value="">All Ships</option>
              <option value="MAHRU">MAHRU</option>
              <option value="PHOENIX31">PHOENIX31</option>
              <option value="KOKO">KOKO</option>
              <option value="APRIL-2">APRIL-2</option>
              <option value="SEA REGENT">SEA REGENT</option>
            </select>

            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded w-full sm:w-auto dark:bg-gray-700 dark:text-white" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded w-full sm:w-auto dark:bg-gray-700 dark:text-white" />

            <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
              Filter
            </button>
          </div>

          {!selectionMode ? (
            <button onClick={() => setSelectionMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
              Select
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={deleteSelected}
                disabled={selectedIds.size === 0}
                className={`flex-1 px-4 py-2 rounded text-white text-center ${
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
                className="flex-1 px-4 py-2 rounded border border-gray-400 text-center"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Undo Button */}
        {recentlyDeleted && (
          <div className="mb-4">
            <button onClick={undoDelete} className="text-blue-400 underline hover:text-blue-600">
              ↩️ Undo Last Delete
            </button>
          </div>
        )}

        {/* Totals */}
        {results.length > 0 && (
          <div className="mt-4 p-3 bg-white bg-opacity-70 dark:bg-gray-800 rounded text-sm font-medium">
            Totals: MT: {totals.mt.toFixed(2)} • AED Value: {totals.valueAED.toFixed(2)} • Paid: {totals.paid.toFixed(2)} • Total Paid: {totals.totalPaid.toFixed(2)}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto mt-4 bg-white bg-opacity-80 dark:bg-gray-800 rounded shadow border border-gray-300 dark:border-gray-600">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                {selectionMode && <th className="p-2 text-center">Select</th>}
                <th className="p-2">Date</th>
                <th className="p-2">Ship</th>
                <th className="p-2">Buyer/Our Ship</th>
                <th className="p-2">IG Type</th>
                <th className="p-2">MT</th>
                <th className="p-2">Price (USD)</th>
                <th className="p-2">Value (AED)</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Total Paid</th>
                <th className="p-2">Remarks</th>
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
                    <tr key={entry.id} className={isSelected ? 'bg-yellow-100 dark:bg-yellow-700/40' : ''}>
                      {selectionMode && (
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(entry.id)}
                          />
                        </td>
                      )}
                      <td className="p-2">{entry.date}</td>
                      <td className="p-2">{entry.shipName}</td>
                      <td className="p-2">{entry.buyerOrOurShip || '-'}</td>
                      <td className="p-2">{entry.igType || '-'}</td>
                      <td className="p-2">{entry.mt.toFixed(2)}</td>
                      <td className="p-2">{entry.usdPrice.toFixed(2)}</td>
                      <td className="p-2">{entry.valueAED.toFixed(2)}</td>
                      <td className="p-2">{entry.paid.toFixed(2)}</td>
                      <td className="p-2">{entry.totalPaid.toFixed(2)}</td>
                      <td className="p-2">{entry.remarks || '-'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
