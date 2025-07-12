import { useRouter } from 'next/router';
import { useState } from 'react';
import ArawHeader from '../components/ArawHeader';

export default function ExpensePage() {
  const router = useRouter();
  const { name, date } = router.query;

  const [form, setForm] = useState({
    remainingCash: '',
    receivedAmount: '',
    receivedFrom: '',
    givenTo: '',
    toShip: 'MAHRU',
    newCash: '',
    cargoOnShip: '',
    fromOtherText: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        body: JSON.stringify({ shipName: name, date, ...form }),
      });

      if (!res.ok) throw new Error('API failed');

      const result = await res.json();
      alert(result.message || 'Saved!');

      // ✅ Reset form
      setForm({
        remainingCash: '',
        receivedAmount: '',
        receivedFrom: '',
        givenTo: '',
        toShip: 'MAHRU',
        newCash: '',
        cargoOnShip: '',
        fromOtherText: '',
      });
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit. Check console.');
    }
  };

  const handleNext = () => {
    router.push(`/`);
  };

  const handleBack = () => {
    router.push(`/discharge?name=${name}&date=${date}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Expenses</h1>  

      <div className="flex justify-between mb-4">
        <span className="text-xl font-semibold">
          <strong>Ship:</strong> {name}
        </span>
        <span className="text-xl font-semibold">
          <strong>Date:</strong> {date}
        </span>
      </div>

      <label>Remaining Cash</label>
      <input name="remainingCash" value={form.remainingCash} onChange={handleChange} className="w-full border p-2 mb-2" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Received Amount</label>
          <input name="receivedAmount" value={form.receivedAmount} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label>From</label>
          <input name="receivedFrom" value={form.receivedFrom} onChange={handleChange} className="w-full border p-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label>Given To</label>
          <input name="givenTo" value={form.givenTo} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label>To Ship</label>
          <select name="toShip" value={form.toShip} onChange={handleChange} className="w-full border p-2">
            <option>MAHRU</option>
            <option>PHOENIX31</option>
            <option>KOKO</option>
            <option>APRIL-2</option>
            <option>SEA REGENT</option>
            <option>Others</option>
          </select>
        </div>
      </div>

      {form.toShip === 'Others' && (
        <div className="mt-4">
          <label>Specify Other</label>
          <input name="fromOtherText" value={form.fromOtherText} onChange={handleChange} className="w-full border p-2" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label>New Cash on Ship (AED)</label>
          <input name="newCash" value={form.newCash} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label>Cargo on Ship (IG)</label>
          <input name="cargoOnShip" value={form.cargoOnShip} onChange={handleChange} className="w-full border p-2" />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        <button onClick={handleNext} className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}
