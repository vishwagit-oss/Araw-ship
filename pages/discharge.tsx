import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
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
      <div className="w-14 h-7 bg-gray-300 rounded-full dark:bg-gray-600 transition" />
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? 'translate-x-7' : 'translate-x-0'
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

export default function DischargePage() {
  const router = useRouter()
  const { name, date } = router.query

  const [form, setForm] = useState({
    igType: 'IG White',
    mtValue: '',
    igValue: '',
    rateUsd: '',
    dischargeTo: '',
    internalDischarge: '',
    igToValue: '',
    shipTarget: 'MAHRU',
    usdPerMT: '',
    difference: '',
    moneySent: '',
  })

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const mt = parseFloat(form.mtValue)
    const usd = parseFloat(form.rateUsd)

    if (!isNaN(mt) && !isNaN(usd)) {
      const usdPerMT = usd * 3.67
      const moneySent = mt * usdPerMT

      setForm(prev => ({
        ...prev,
        usdPerMT: usdPerMT.toFixed(2),
        moneySent: moneySent.toFixed(2),
      }))
    }
  }, [form.mtValue, form.rateUsd])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/discharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipName: name, date, ...form }),
      })
      if (!res.ok) throw new Error('API failed')
      const result = await res.json()
      alert(result.message || 'Saved!')
      setForm({
        igType: 'IG White',
        mtValue: '',
        igValue: '',
        rateUsd: '',
        dischargeTo: '',
        internalDischarge: '',
        igToValue: '',
        shipTarget: 'MAHRU',
        usdPerMT: '',
        difference: '',
        moneySent: '',
      })
    } catch (err) {
      console.error(err)
      alert('Failed to submit')
    }
  }

  const handleNext = () => router.push(`/expense?name=${name}&date=${date}`)
  const handleBack = () => router.push(`/loading?name=${name}&date=${date}`)

  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat relative transition-colors duration-700 overflow-hidden ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{ backgroundImage: "url('/discharge-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition duration-700" />

      <div className="relative z-40">
        <ArawHeader />

        <div className="absolute top-5 right-5 flex items-center space-x-2 select-none z-50">
          <span className="text-xl text-white">{darkMode ? '🌞' : '🌙'}</span>
          <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
        </div>
      </div>

      <AnimatePresence>
        <motion.main
          key="main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-30 max-w-4xl mx-auto p-6 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-3xl shadow-xl mt-16 mb-10 overflow-hidden"
          style={{ maxHeight: '100vh' }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Discharge</h1>

          <div className="text-center mb-6 space-y-1 sm:space-y-0 sm:flex sm:justify-center sm:gap-8 text-gray-900 dark:text-white">
            <span className="text-lg font-semibold">
              <strong>Ship:</strong> {name}
            </span>
            <span className="text-lg font-semibold">
              <strong>Date:</strong> {date}
            </span>
          </div>

          <motion.form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">IG Type</label>
              <select
                name="igType"
                value={form.igType}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option>IG White</option>
                <option>IG Yellow</option>
              </select>

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">MT</label>
              <input
                name="mtValue"
                value={form.mtValue}
                onChange={handleChange}
                type="number"
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">IG</label>
              <input
                name="igValue"
                value={form.igValue}
                onChange={handleChange}
                type="number"
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Rate USD</label>
              <input
                name="rateUsd"
                value={form.rateUsd}
                onChange={handleChange}
                type="number"
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">USD per MT (Auto)</label>
              <input
                name="usdPerMT"
                value={form.usdPerMT}
                readOnly
                className="w-full border rounded p-2 mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              />

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Money Sent (Auto)</label>
              <input
                name="moneySent"
                value={form.moneySent}
                readOnly
                className="w-full border rounded p-2 mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              />

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Discharge To</label>
              <input
                name="dischargeTo"
                value={form.dischargeTo}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Internal Discharge</label>
              <input
                name="internalDischarge"
                value={form.internalDischarge}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Discharge to Ship</label>
              <select
                name="shipTarget"
                value={form.shipTarget}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option>MAHRU</option>
                <option>PHOENIX31</option>
                <option>KOKO</option>
                <option>APRIL-2</option>
                <option>SEA REGENT</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 justify-between mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Next
              </button>
            </div>
          </motion.form>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
