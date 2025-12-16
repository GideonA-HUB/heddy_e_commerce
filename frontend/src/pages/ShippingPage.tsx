import React, { useEffect, useState } from 'react';
import { shippingAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

const ShippingPage: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<number | null>(null);
  const [quoteDetails, setQuoteDetails] = useState<any | null>(null);
  const [selectedDest, setSelectedDest] = useState<number | ''>('');
  const [weight, setWeight] = useState<number>(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await shippingAPI.getDestinations();
        setDestinations(res.data.results || res.data || []);
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
      const res = await shippingAPI.calculateQuote({
        destination_id: selectedDest as number,
        weight_kg: weight,
      });
      setQuote(res.data.amount ?? res.data.total_fee ?? res.data.total ?? null);
      setQuoteDetails(res.data);
    } catch (err) {
      console.error('Quote failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Shipping &amp; Delivery</h1>
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <div>
              <p className="text-gray-700 text-sm">
                <strong>International shipping (UK, Canada, USA):</strong> weight‑based pricing for dried foods,
                packaged cooked foods and swallows. Rates depend on destination country, weight and current
                rate settings in our system.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Nigeria‑wide shipping:</strong> 36 states + FCT. Pricing can use flat rates and/or weight‑based
                fees per location. Pickup options are available where specified.
              </p>
            </div>

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
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.zone || d.destination_type})
                    </option>
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
                <div className="mt-4 p-4 bg-gray-100 rounded space-y-2 text-sm text-gray-800">
                  <div>
                    <strong className="text-primary">Estimated Cost:</strong>{' '}
                    ₦{Number(quote).toLocaleString()}
                  </div>
                  {quoteDetails && (
                    <>
                      <div>
                        <strong>Destination:</strong> {quoteDetails.destination_name}{' '}
                        {quoteDetails.zone && `(${quoteDetails.zone})`}
                      </div>
                      <div>
                        <strong>Weight:</strong> {quoteDetails.weight_kg} kg
                      </div>
                      <div>
                        <strong>Delivery time:</strong>{' '}
                        {quoteDetails.delivery_time_days
                          ? `${quoteDetails.delivery_time_days} day(s)`
                          : 'See details below'}
                      </div>
                    </>
                  )}
                </div>
              )}
            </form>

            {selectedDest && (
              <div className="border-t pt-4 text-sm text-gray-800 space-y-2">
                {(() => {
                  const dest = destinations.find((d) => d.id === selectedDest);
                  if (!dest) return null;
                  return (
                    <>
                      {dest.allowed_items && (
                        <p>
                          <strong>Items we can ship here:</strong> {dest.allowed_items}
                        </p>
                      )}
                      {dest.packaging_standards && (
                        <p>
                          <strong>Packaging standards:</strong> {dest.packaging_standards}
                        </p>
                      )}
                      {dest.customs_notice && (
                        <p>
                          <strong>Customs &amp; food safety:</strong> {dest.customs_notice}
                        </p>
                      )}
                      {dest.is_pickup_available && (
                        <p>
                          <strong>Pickup option:</strong> {dest.pickup_location || 'See schedule'}{' '}
                          {dest.pickup_schedule && `– ${dest.pickup_schedule}`}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingPage;
