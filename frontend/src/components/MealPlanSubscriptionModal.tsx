import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, MapPin, Calendar, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { mealplansAPI } from '../api';
import { MealPlan } from '../types';

interface MealPlanSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  planData?: MealPlan | null;
}

const MealPlanSubscriptionModal: React.FC<MealPlanSubscriptionModalProps> = ({
  isOpen,
  onClose,
  planData,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postal_code: '',
    start_date: '',
    special_instructions: '',
    dietary_preferences: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone || !formData.address) {
      setErrorMessage('Please fill in all required fields (Name, Email, Phone, Address)');
      setStatus('error');
      return;
    }

    if (!planData?.id) {
      setErrorMessage('Meal plan information is missing');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await mealplansAPI.subscribe({
        meal_plan_id: planData.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code,
        start_date: formData.start_date || undefined,
        special_instructions: formData.special_instructions,
        dietary_preferences: formData.dietary_preferences,
      });

      setStatus('success');
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postal_code: '',
        start_date: '',
        special_instructions: '',
        dietary_preferences: '',
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 3000);
    } catch (err: any) {
      console.error('Failed to subscribe:', err);
      setErrorMessage(err.response?.data?.detail || err.response?.data?.error || 'Failed to subscribe. Please try again.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postal_code: '',
        start_date: '',
        special_instructions: '',
        dietary_preferences: '',
      });
      setStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 bg-gradient-to-r from-primary to-red-600 text-white p-4 sm:p-6 flex items-center justify-between rounded-t-xl z-10">
                <h2 className="text-xl font-bold">Subscribe to Meal Plan</h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {planData && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Subscribing to:</p>
                    <p className="font-semibold text-gray-900">{planData.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {planData.plan_type_display} • {planData.period_display} • ₦{planData.price.toLocaleString()}
                    </p>
                  </div>
                )}

                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Subscription Successful!</h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for subscribing to our meal plan. We've received your subscription request and will contact you soon to confirm your delivery schedule.
                    </p>
                    <p className="text-sm text-gray-500">
                      You can check your subscription status in your account dashboard.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                        Delivery Address <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          rows={2}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                          placeholder="Enter your complete delivery address"
                        />
                      </div>
                    </div>

                    {/* City, State, Country in a row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        >
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Postal Code and Start Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="postal_code" className="block text-sm font-semibold text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Postal/Zip Code"
                        />
                      </div>
                      <div>
                        <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-1">
                          Preferred Start Date
                        </label>
                        <div className="relative">
                          <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            min={today}
                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dietary Preferences */}
                    <div>
                      <label htmlFor="dietary_preferences" className="block text-sm font-semibold text-gray-700 mb-1">
                        Dietary Preferences or Restrictions
                      </label>
                      <textarea
                        id="dietary_preferences"
                        name="dietary_preferences"
                        value={formData.dietary_preferences}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Vegetarian, No nuts, Gluten-free, etc."
                      />
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label htmlFor="special_instructions" className="block text-sm font-semibold text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <div className="relative">
                        <MessageSquare size={20} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          id="special_instructions"
                          name="special_instructions"
                          value={formData.special_instructions}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                          placeholder="Any additional instructions for delivery or meal preparation..."
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {status === 'error' && errorMessage && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertCircle size={20} />
                        <span className="text-sm">{errorMessage}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Complete Subscription'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MealPlanSubscriptionModal;

