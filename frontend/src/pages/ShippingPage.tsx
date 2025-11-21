import React, { useEffect, useState } from 'react';
import { shippingAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

const ShippingPage: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<number | null>(null);
  const [selectedDest, setSelectedDest] = useState<number | ''>('');
  const [weight, setWeight] = useState<number>(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await shippingAPI.getDestinations();
        setDestinations(res.data.results || []);
      } catch (err) {
        console.error('Failed to load destinations', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDest) return;
    try {
      const res = await shippingAPI.calculateQuote({ destination_id: selectedDest as number, weight_kg: weight });
      setQuote(res.data.amount || res.data.quote || res.data.total || null);
    } catch (err) {
      console.error('Quote failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Shipping & Delivery</h1>
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                >
                  <option value="">Select destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} - {d.zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <button className="btn-primary">Calculate Quote</button>
              </div>

              {quote !== null && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <strong className="text-primary">Estimated Cost:</strong> ₦{Number(quote).toLocaleString()}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingPage;
