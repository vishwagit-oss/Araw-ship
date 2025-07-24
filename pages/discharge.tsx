import { useRouter } from 'next/router'
import { useState } from 'react'
import ArawHeader from '../components/ArawHeader'

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
  })

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
      })
    } catch (err) {
      console.error(err)
      alert('Failed to submit')
    }
  }

  const handleNext = () => router.push(`/expense?name=${name}&date=${date}`)
  const handleBack = () => router.push('/loading')

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Discharge</h1>

      <div className="text-center mb-6 space-y-1 sm:space-y-0 sm:flex sm:justify-center sm:gap-8">
        <span className="text-lg font-semibold">
          <strong>Ship:</strong> {name}
        </span>
        <span className="text-lg font-semibold">
          <strong>Date:</strong> {date}
        </span>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div>
          <label className="block font-semibold mb-1">IG Type</label>
          <select
            name="igType"
            value={form.igType}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          >
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label className="block font-semibold mb-1">MT</label>
          <input
            name="mtValue"
            value={form.mtValue}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">IG</label>
          <input
            name="igValue"
            value={form.igValue}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Rate USD</label>
          <input
            name="rateUsd"
            value={form.rateUsd}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">Discharge To</label>
          <input
            name="dischargeTo"
            value={form.dischargeTo}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">Internal Discharge</label>
          <input
            name="internalDischarge"
            value={form.internalDischarge}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">IG To (value)</label>
          <input
            name="igToValue"
            value={form.igToValue}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">Discharge to Ship</label>
          <select
            name="shipTarget"
            value={form.shipTarget}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
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
            className="w-full sm:w-auto bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
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
      </form>
    </div>
  )
}
