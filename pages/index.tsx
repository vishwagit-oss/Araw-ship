import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ArawHeader from '../components/ArawHeader'
import { motion } from 'framer-motion'

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
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/bg-ship.jpg')" }} // 👈 replace with your image path
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <ArawHeader />
      </div>

      {/* Content Card */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 max-w-lg mx-auto p-6 mt-10 sm:mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
        style={{ maxHeight: 'calc(100vh - 120px)', minHeight: '400px' }}
      >
        {/* Results Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => router.push('/results')}
            className="bg-blue-700 text-white px-6 py-2 text-sm sm:text-base font-bold rounded shadow hover:bg-blue-800 transition"
          >
            📊 View Results
          </button>
        </div>

        {/* Date Picker */}
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Date:
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />

        {/* Ship Buttons (Horizontal) */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Select a Ship:
        </h2>
        <div className="flex justify-between flex-wrap gap-3">
          {ships.map(ship => (
            <button
              key={ship}
              onClick={() => goToShipPage(ship)}
              className="flex-1 min-w-[110px] bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold py-2 px-3 rounded-lg shadow transition text-sm sm:text-base"
            >
              {ship}
            </button>
          ))}
        </div>
      </motion.main>
    </div>
  )
}
