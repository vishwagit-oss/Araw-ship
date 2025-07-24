import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ArawHeader from '../components/ArawHeader'

export default function LoadingPage() {
  const router = useRouter()
  const { name, date } = router.query

  const [form, setForm] = useState({
    igType: 'IG White',
    igValue: '',
    aedPrice: '',
    totalPaid: '',
    customerMoney: '',
    mtType: 'IG White',
    mtValue: '',
    usdRate: '',
    totalValueAED: '',
  })

  useEffect(() => {
    const usd = parseFloat(form.usdRate)
    if (!isNaN(usd)) {
      const aed = usd * 3.67
      setForm(prev => ({ ...prev, totalValueAED: aed.toFixed(2) }))
    }
  }, [form.usdRate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/loading', {
        method: 'POST',
        body: JSON.stringify({ shipName: name, date, ...form }),
      })
      if (!res.ok) throw new Error('API failed')
      const result = await res.json()
      alert(result.message || 'Saved!')
      setForm({
        igType: 'IG White',
        igValue: '',
        aedPrice: '',
        totalPaid: '',
        customerMoney: '',
        mtType: 'IG White',
        mtValue: '',
        usdRate: '',
        totalValueAED: '',
      })
    } catch (err) {
      console.error(err)
      alert('Failed to submit')
    }
  }

  const handleNext = () => router.push(`/discharge?name=${name}&date=${date}`)
  const handleBack = () => router.push('/ship')

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Loading</h1>

      <div className="text-center mb-4">
        <span className="text-xl font-semibold mr-4"><strong>Ship:</strong> {name}</span>
        <span className="text-xl font-semibold"><strong>Date:</strong> {date}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side */}
        <div>
          <label className="block font-semibold">IG Type</label>
          <select name="igType" value={form.igType} onChange={handleChange} className="w-full border p-2 mb-2 rounded">
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label className="block font-semibold">IG</label>
          <input
            name="igValue"
            type="number"
            value={form.igValue}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">AED Price</label>
          <input
            name="aedPrice"
            type="number"
            value={form.aedPrice}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Total Paid</label>
          <input
            name="totalPaid"
            type="number"
            value={form.totalPaid}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Customer Money Received</label>
          <input
            name="customerMoney"
            value={form.customerMoney}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
        </div>

        {/* Right side */}
        <div>
          <label className="block font-semibold">MT Type</label>
          <select name="mtType" value={form.mtType} onChange={handleChange} className="w-full border p-2 mb-2 rounded">
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label className="block font-semibold">MT</label>
          <input
            name="mtValue"
            type="number"
            value={form.mtValue}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">USD</label>
          <input
            name="usdRate"
            type="number"
            value={form.usdRate}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Total Value in AED</label>
          <input
            name="totalValueAED"
            value={form.totalValueAED}
            readOnly
            className="w-full border p-2 bg-gray-100 rounded"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
        <button
          onClick={handleBack}
          className="w-full sm:w-auto bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          onClick={handleNext}
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  )
}
