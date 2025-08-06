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

export default function LoadingPage() {
  const router = useRouter()
  const { name, date } = router.query

  const [form, setForm] = useState({
    igType: 'IG White',
    igWhite: '',
    igYellow: '',
    discharge: '',
    internalDischarge: '',
    perIgPrice: '',
    cashPaidToCustomer: '',
    remarks: '',
    customerMoneyCOB: '',
    rob: '',
  })

  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const igW = parseFloat(form.igWhite) || 0
    const igY = parseFloat(form.igYellow) || 0
    const dis = parseFloat(form.discharge) || 0
    const internalDis = parseFloat(form.internalDischarge) || 0
    const perPrice = parseFloat(form.perIgPrice) || 0

    const receivedTotal = igW + igY
    const rob = receivedTotal - dis - internalDis
    const totalCash = rob * perPrice

    setForm(prev => ({
      ...prev,
      rob: rob > 0 ? rob.toFixed(2) : '0',
      customerMoneyCOB: totalCash > 0 ? totalCash.toFixed(0) : '0',
    }))
  }, [form.igWhite, form.igYellow, form.discharge, form.internalDischarge, form.perIgPrice])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/loading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipName: name, date, ...form }),
      })
      setLoading(false)
      if (!res.ok) throw new Error('API failed')
      const result = await res.json()
      alert(result.message || 'Saved!')

      setForm({
        igType: 'IG White',
        igWhite: '',
        igYellow: '',
        discharge: '',
        internalDischarge: '',
        perIgPrice: '',
        cashPaidToCustomer: '',
        remarks: '',
        customerMoneyCOB: '',
        rob: '',
      })
    } catch (err) {
      setLoading(false)
      console.error(err)
      alert('Failed to submit')
    }
  }

  const handleNext = () => router.push(`/discharge?name=${name}&date=${date}`)
  const handleBack = () => router.push(`/ship?name=${name}&date=${date}`)

  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat relative transition-colors duration-700 overflow-hidden ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{ backgroundImage: "url('/loading-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition duration-700" />

      <div className="relative z-40">
        <ArawHeader />

        <div className="absolute top-5 right-5 flex items-center space-x-2 select-none z-50">
          <span className="text-xl text-white">{darkMode ? '🌞' : '🌙'}</span>
          <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-30 max-w-7xl mx-auto p-4 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-3xl shadow-xl mt-16 mb-10 flex flex-col"
        style={{
          maxHeight: '100vh',
          overflowY: 'hidden',
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Loading
        </h1>

        <div className="flex justify-center gap-10 mb-8 text-lg font-semibold text-gray-900 dark:text-white flex-wrap">
          <div>
            Ship: <span className="font-bold">{name}</span>
          </div>
          <div>
            Date: <span className="font-bold">{date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center">
          {/* Input blocks with fixed width */}
          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              IG Type
            </label>
            <select
              name="igType"
              value={form.igType}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option>IG White</option>
              <option>IG Yellow</option>
            </select>
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              PER IG PRICE
            </label>
            <input
              name="perIgPrice"
              type="number"
              value={form.perIgPrice}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Received (IG White)
            </label>
            <input
              name="igWhite"
              type="number"
              value={form.igWhite}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Cash Paid to Customer
            </label>
            <input
              name="cashPaidToCustomer"
              type="number"
              value={form.cashPaidToCustomer}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Received (IG Yellow)
            </label>
            <input
              name="igYellow"
              type="number"
              value={form.igYellow}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Remarks
            </label>
            <input
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Discharge
            </label>
            <input
              name="discharge"
              type="number"
              value={form.discharge}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Customer Money COB (Auto)
            </label>
            <input
              name="customerMoneyCOB"
              value={form.customerMoneyCOB}
              readOnly
              className="w-full p-2 text-sm rounded-lg border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Internal Discharge
            </label>
            <input
              name="internalDischarge"
              type="number"
              value={form.internalDischarge}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-60">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              R.O.B. (Auto)
            </label>
            <input
              name="rob"
              value={form.rob}
              readOnly
              className="w-full p-2 text-sm rounded-lg border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Buttons below form */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Submit
          </button>
          <button
            onClick={handleNext}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
          >
            Next
          </button>
        </div>
      </motion.main>
    </div>
  )
}
