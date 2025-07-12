import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ArawHeader from '../components/ArawHeader';

export default function LoadingPage() {
  const router = useRouter();
  const { name, date } = router.query;

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
  });

  useEffect(() => {
    const usd = parseFloat(form.usdRate);
    if (!isNaN(usd)) {
      const aed = usd * 3.67;
      setForm((prev) => ({ ...prev, totalValueAED: aed.toFixed(2) }));
    }
  }, [form.usdRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/loading', {
        method: 'POST',
        body: JSON.stringify({ shipName: name, date, ...form }),
      });

      if (!res.ok) throw new Error('API failed');

      const result = await res.json();
      alert(result.message || 'Saved!');

      // ✅ Reset the form
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
      });
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit. Check console.');
    }
  };

  const handleNext = () => {
    router.push(`/discharge?name=${name}&date=${date}`);
  };

  const handleBack = () => {
    router.push('/ship');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ArawHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Loading</h1>

      <div className="flex justify-between mb-4">
        <span className="text-xl font-semibold">
          <strong>Ship:</strong> {name}
        </span>
        <span className="text-xl font-semibold">
          <strong>Date:</strong> {date}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Loading</h2>

          <label>IG Type</label>
          <select name="igType" value={form.igType} onChange={handleChange} className="w-full border p-2 mb-2">
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label>IG</label>
          <input
            name="igValue"
            type="number"
            value={form.igValue}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <label>AED Price</label>
          <input
            name="aedPrice"
            type="number"
            value={form.aedPrice}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <label>Total Paid</label>
          <input
            name="totalPaid"
            type="number"
            value={form.totalPaid}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <label>Customer Money Received</label>
          <input
            name="customerMoney"
            value={form.customerMoney}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Discharge</h2>

          <label>MT Type</label>
          <select name="mtType" value={form.mtType} onChange={handleChange} className="w-full border p-2 mb-2">
            <option>IG White</option>
            <option>IG Yellow</option>
          </select>

          <label>MT</label>
          <input
            name="mtValue"
            type="number"
            value={form.mtValue}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <label>USD</label>
          <input
            name="usdRate"
            type="number"
            value={form.usdRate}
            onChange={handleChange}
            className="w-full border p-2 mb-2"
          />

          <label>Total Value in AED</label>
          <input
            name="totalValueAED"
            value={form.totalValueAED}
            readOnly
            className="w-full border p-2 bg-gray-100"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        <button onClick={handleNext} className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}
