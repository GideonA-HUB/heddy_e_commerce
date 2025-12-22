import React, { useEffect, useState } from 'react';
import { cateringAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

interface CateringPackage {
  id: number;
  title: string;
  tier: string;
  description: string;
  min_guests: number;
  max_guests: number;
  price_per_head: number | null;
  price_min: number | null;
  price_max: number | null;
  menu_options: string[] | any[];
  gallery: Array<{
    id: number;
    image_url: string;
    caption: string;
  }>;
  category_name: string;
}

const CateringPage: React.FC = () => {
  const [packages, setPackages] = useState<CateringPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null);
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [enquireForm, setEnquireForm] = useState({
    name: '',
    email: '',
    phone: '',
    event_date: '',
    number_of_guests: '',
    message: '',
    tasting_session_requested: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await cateringAPI.getPackages();
        setPackages(response.data.results || []);
      } catch (err) {
        console.error('Failed to load catering packages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleEnquireClick = (pkg: CateringPackage) => {
    setSelectedPackage(pkg);
    setShowEnquireModal(true);
    setEnquireForm({
      name: '',
      email: '',
      phone: '',
      event_date: '',
      number_of_guests: pkg.min_guests?.toString() || '',
      message: '',
      tasting_session_requested: false,
    });
    setSubmitMessage(null);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      await cateringAPI.enquire({
        package: selectedPackage.id,
        name: enquireForm.name,
        email: enquireForm.email,
        phone: enquireForm.phone,
        message: enquireForm.message,
        event_date: enquireForm.event_date,
        number_of_guests: parseInt(enquireForm.number_of_guests),
        tasting_session_requested: enquireForm.tasting_session_requested,
      });

      setSubmitMessage({ type: 'success', text: 'Your enquiry has been submitted successfully! We will contact you soon.' });
      setTimeout(() => {
        setShowEnquireModal(false);
        setSubmitMessage(null);
      }, 2000);
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: err.response?.data?.error || err.response?.data?.message || 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (pkg: CateringPackage) => {
    if (pkg.price_per_head) {
      return `₦${Number(pkg.price_per_head).toLocaleString()} / head`;
    }
    if (pkg.price_min && pkg.price_max) {
      return `₦${Number(pkg.price_min).toLocaleString()} - ₦${Number(pkg.price_max).toLocaleString()}`;
    }
    if (pkg.price_min) {
      return `From ₦${Number(pkg.price_min).toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  const formatMenuOptions = (menuOptions: any[]) => {
    if (!menuOptions || menuOptions.length === 0) return null;
    
    // If it's an array of strings
    if (typeof menuOptions[0] === 'string') {
      return menuOptions;
    }
    
    // If it's an array of objects with groups
    return menuOptions.flatMap((group: any) => {
      if (group.items && Array.isArray(group.items)) {
        return group.items;
      }
      return [];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Event Catering Packages</h1>
        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image Gallery */}
                {pkg.gallery && pkg.gallery.length > 0 && (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={pkg.gallery[0].image_url}
                      alt={pkg.gallery[0].caption || pkg.title}
                      className="w-full h-full object-cover"
                    />
                    {pkg.gallery.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        +{pkg.gallery.length - 1} more
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  {/* Title and Tier */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                    <span className="text-sm text-gray-500 capitalize">({pkg.tier})</span>
                  </div>

                  {/* Category */}
                  {pkg.category_name && (
                    <p className="text-sm text-gray-600 mb-3 capitalize">{pkg.category_name}</p>
                  )}

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>
                  )}

                  {/* Capacity */}
                  {(pkg.min_guests || pkg.max_guests) && (
                    <div className="mb-3 text-sm text-gray-700">
                      <strong>Capacity:</strong> {pkg.min_guests && `${pkg.min_guests}`}
                      {pkg.min_guests && pkg.max_guests && ' - '}
                      {pkg.max_guests && `${pkg.max_guests}`} guests
                    </div>
                  )}

                  {/* Menu Options Preview */}
                  {pkg.menu_options && pkg.menu_options.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Menu Options:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {formatMenuOptions(pkg.menu_options)?.slice(0, 3).map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                        {formatMenuOptions(pkg.menu_options) && formatMenuOptions(pkg.menu_options)!.length > 3 && (
                          <li className="text-gray-500">+{formatMenuOptions(pkg.menu_options)!.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="font-bold text-lg text-primary mb-4">
                    {formatPrice(pkg)}
                  </div>

                  {/* Enquire Button */}
                  <button
                    onClick={() => handleEnquireClick(pkg)}
                    className="w-full btn-primary py-2"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enquire Modal */}
      {showEnquireModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Enquire About {selectedPackage.title}</h2>
              <button
                onClick={() => setShowEnquireModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="p-6">
              {submitMessage && (
                <div
                  className={`mb-4 p-3 rounded ${
                    submitMessage.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={enquireForm.name}
                    onChange={(e) => setEnquireForm({ ...enquireForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={enquireForm.email}
                    onChange={(e) => setEnquireForm({ ...enquireForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={enquireForm.phone}
                    onChange={(e) => setEnquireForm({ ...enquireForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={enquireForm.event_date}
                    onChange={(e) => setEnquireForm({ ...enquireForm, event_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={selectedPackage.min_guests || 1}
                    max={selectedPackage.max_guests || undefined}
                    value={enquireForm.number_of_guests}
                    onChange={(e) => setEnquireForm({ ...enquireForm, number_of_guests: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {selectedPackage.min_guests && selectedPackage.max_guests && (
                    <p className="text-xs text-gray-500 mt-1">
                      Capacity: {selectedPackage.min_guests} - {selectedPackage.max_guests} guests
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={enquireForm.message}
                    onChange={(e) => setEnquireForm({ ...enquireForm, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={enquireForm.tasting_session_requested}
                      onChange={(e) =>
                        setEnquireForm({ ...enquireForm, tasting_session_requested: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Request a tasting session</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnquireModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringPage;
