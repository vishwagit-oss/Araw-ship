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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Expenses</h1>

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
          <label className="block font-semibold mb-1">Remaining Cash</label>
          <input
            name="remainingCash"
            value={form.remainingCash}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">Received Amount</label>
          <input
            name="receivedAmount"
            value={form.receivedAmount}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">Received From</label>
          <input
            name="receivedFrom"
            value={form.receivedFrom}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Given To</label>
          <input
            name="givenTo"
            value={form.givenTo}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">To Ship</label>
          <select
            name="toShip"
            value={form.toShip}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          >
            <option>MAHRU</option>
            <option>PHOENIX31</option>
            <option>KOKO</option>
            <option>APRIL-2</option>
            <option>SEA REGENT</option>
            <option>Others</option>
          </select>

          {form.toShip === 'Others' && (
            <>
              <label className="block font-semibold mb-1">Specify Other</label>
              <input
                name="fromOtherText"
                value={form.fromOtherText}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4"
                type="text"
              />
            </>
          )}

          <label className="block font-semibold mb-1">New Cash on Ship (AED)</label>
          <input
            name="newCash"
            value={form.newCash}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />

          <label className="block font-semibold mb-1">Cargo on Ship (IG)</label>
          <input
            name="cargoOnShip"
            value={form.cargoOnShip}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            type="text"
          />
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
