import { useRouter } from 'next/router'
import { useState } from 'react'
import ArawHeader from '../components/ArawHeader'

export default function ExpensePage() {
  const router = useRouter()
  const { name, date } = router.query

  const [form, setForm] = useState({
    remainingCash: '',
    receivedAmount: '',
    receivedFrom: '',
    givenTo: '',
    toShip: 'MAHRU',
    newCash: '',
    cargoOnShip: '',
    fromOtherText: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        body: JSON.stringify({ shipName: name, date, ...form }),
      })
      if (!res.ok) throw new Error('API failed')
      const result = await res.json()
      alert(result.message || 'Saved!')
      setForm({
        remainingCash: '',
        receivedAmount: '',
        receivedFrom: '',
        givenTo: '',
        toShip: 'MAHRU',
        newCash: '',
        cargoOnShip: '',
        fromOtherText: '',
      })
    } catch (err) {
      console.error(err)
      alert('Failed to submit')
    }
  }

  const handleNext = () => router.push('/')
  const handleBack = () => router.push('/discharge')

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Expenses</h1>

      <div className="text-center mb-4">
        <span className="text-xl font-semibold mr-4"><strong>Ship:</strong> {name}</span>
        <span className="text-xl font-semibold"><strong>Date:</strong> {date}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold">Remaining Cash</label>
          <input name="remainingCash" value={form.remainingCash} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">Received Amount</label>
          <input name="receivedAmount" value={form.receivedAmount} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">Received From</label>
          <input name="receivedFrom" value={form.receivedFrom} onChange={handleChange} className="w-full border p-2 mb-2" />
        </div>

        <div>
          <label className="block font-semibold">Given To</label>
          <input name="givenTo" value={form.givenTo} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">To Ship</label>
          <select name="toShip" value={form.toShip} onChange={handleChange} className="w-full border p-2 mb-2">
            <option>MAHRU</option>
            <option>PHOENIX31</option>
            <option>KOKO</option>
            <option>APRIL-2</option>
            <option>SEA REGENT</option>
            <option>Others</option>
          </select>

          {form.toShip === 'Others' && (
            <>
              <label className="block font-semibold">Specify Other</label>
              <input name="fromOtherText" value={form.fromOtherText} onChange={handleChange} className="w-full border p-2 mb-2" />
            </>
          )}

          <label className="block font-semibold">New Cash on Ship (AED)</label>
          <input name="newCash" value={form.newCash} onChange={handleChange} className="w-full border p-2 mb-2" />

          <label className="block font-semibold">Cargo on Ship (IG)</label>
          <input name="cargoOnShip" value={form.cargoOnShip} onChange={handleChange} className="w-full border p-2 mb-2" />
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
