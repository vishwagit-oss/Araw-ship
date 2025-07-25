import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ArawHeader from '../components/ArawHeader'

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
    usdRate: '',
    rob: '',
  })

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
      customerMoneyCOB: totalCash > 0 ? totalCash.toFixed(0) : '0'
    }))
  }, [form.igWhite, form.igYellow, form.discharge, form.internalDischarge, form.perIgPrice])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/loading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipName: name, date, ...form }),
      })
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
        usdRate: '',
        rob: '',
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
        {/* Left */}
        <div>
          <label className="block font-semibold">IG Type</label>
          <select name="igType" value={form.igType} onChange={handleChange} className="w-full border p-2 mb-2 rounded">
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label className="block font-semibold">Received (IG White)</label>
          <input
            name="igWhite"
            type="number"
            value={form.igWhite}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Received (IG Yellow)</label>
          <input
            name="igYellow"
            type="number"
            value={form.igYellow}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Discharge</label>
          <input
            name="discharge"
            type="number"
            value={form.discharge}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Internal Discharge</label>
          <input
            name="internalDischarge"
            type="number"
            value={form.internalDischarge}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
        </div>

        {/* Right */}
        <div>
          <label className="block font-semibold">PER IG PRICE</label>
          <input
            name="perIgPrice"
            type="number"
            value={form.perIgPrice}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Cash Paid to Customer</label>
          <input
            name="cashPaidToCustomer"
            type="number"
            value={form.cashPaidToCustomer}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Remarks</label>
          <input
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <label className="block font-semibold">Customer Money COB (Auto)</label>
          <input
            name="customerMoneyCOB"
            value={form.customerMoneyCOB}
            readOnly
            className="w-full border p-2 mb-2 rounded bg-gray-100"
          />

          <label className="block font-semibold">R.O.B. (Auto)</label>
          <input
            name="rob"
            value={form.rob}
            readOnly
            className="w-full border p-2 mb-2 rounded bg-gray-100"
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
