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

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/discharge', {
        method: 'POST',
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
    <div className="max-w-4xl mx-auto p-4">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Discharge</h1>

      <div className="text-center mb-4">
        <span className="text-xl font-semibold mr-4"><strong>Ship:</strong> {name}</span>
        <span className="text-xl font-semibold"><strong>Date:</strong> {date}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold">IG Type</label>
          <select name="igType" value={form.igType} onChange={handleChange} className="w-full border p-2 mb-2">
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label className="block font-semibold">MT</label>
          <input name="mtValue" value={form.mtValue} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">IG</label>
          <input name="igValue" value={form.igValue} onChange={handleChange} className="w-full border p-2 mb-2" />
        </div>

        <div>
          <label className="block font-semibold">Rate USD</label>
          <input name="rateUsd" value={form.rateUsd} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">Discharge To</label>
          <input name="dischargeTo" value={form.dischargeTo} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">Internal Discharge</label>
          <input name="internalDischarge" value={form.internalDischarge} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">IG To (value)</label>
          <input name="igToValue" value={form.igToValue} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">Discharge to Ship</label>
          <select name="shipTarget" value={form.shipTarget} onChange={handleChange} className="w-full border p-2 mb-2">
            <option>MAHRU</option>
            <option>PHOENIX31</option>
            <option>KOKO</option>
            <option>APRIL-2</option>
            <option>SEA REGENT</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
        <button onClick={handleBack} className="w-full sm:w-auto bg-gray-300 px-4 py-2 rounded">Back</button>
        <button onClick={handleSubmit} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        <button onClick={handleNext} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  )
}
