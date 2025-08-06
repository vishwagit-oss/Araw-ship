import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import ArawHeader from '../components/ArawHeader'

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full dark:bg-gray-600 transition" />
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
      <style jsx>{`
        .dot {
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </label>
  )
}

export default function ShipPage() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [shipName, setShipName] = useState('')
  const [carriedValue, setCarriedValue] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      const { name, date } = router.query
      setShipName((name as string) || '')
      setDate((date as string) || '')
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const goToPage = async (page: string) => {
    if (!shipName || !date) {
      alert('Please select both ship and date before continuing.')
      return
    }
    setLoading(true)
    await router.push(
      `/${page}?name=${encodeURIComponent(shipName)}&date=${encodeURIComponent(date)}`
    )
    setLoading(false)
  }

  const goBack = async () => {
    setLoading(true)
    await router.push('/')
    setLoading(false)
  }

  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat relative transition-all duration-500 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{ backgroundImage: "url('/ship-bg.jpg')" }}
    >
      {/* Background blur and zoom effect on hover */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-all duration-700 hover:backdrop-blur-md hover:scale-105 origin-center -z-10" />

      {/* ArawHeader with company name and logout button */}
      <div className="relative z-30">
        <ArawHeader />
      </div>

      {/* Dark mode toggle */}
      <div className="absolute top-5 right-5 flex items-center space-x-2 z-40 select-none">
        <span className="text-white text-lg">{darkMode ? '🌞' : '🌙'}</span>
        <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-20 max-w-xl mx-auto p-8 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-3xl shadow-xl mt-20 sm:mt-32"
      >
        <h1 className="text-4xl font-bold mb-8 text-center tracking-wide text-gray-800 dark:text-white">
          {shipName || 'Select Ship'}
        </h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="date"
              className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Date:
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="carriedValue"
              className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Carried Forward Value:
            </label>
            <input
              id="carriedValue"
              type="text"
              value={carriedValue}
              onChange={e => setCarriedValue(e.target.value)}
              placeholder="Enter carried forward value"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => goToPage('loading')}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              aria-label="Go to Loading page"
            >
              Loading
            </button>
            <button
              onClick={() => goToPage('discharge')}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
              aria-label="Go to Discharge page"
            >
              Discharge
            </button>
            <button
              onClick={() => goToPage('expense')}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              aria-label="Go to Expense page"
            >
              Expenses
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={goBack}
              className="w-full sm:w-auto py-3 border border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Go back to home page"
            >
              Back
            </button>
            <button
              onClick={() => goToPage('loading')}
              className="w-full sm:w-auto py-3 rounded-lg bg-black hover:bg-gray-900 text-white font-semibold transition"
              aria-label="Go to next page: Loading"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
