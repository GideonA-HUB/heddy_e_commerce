import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { trainingAPI } from '../api';
import { TrainingPackage } from '../types';

interface TrainingEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData?: TrainingPackage | null;
}

const TrainingEnquiryModal: React.FC<TrainingEnquiryModalProps> = ({
  isOpen,
  onClose,
  packageData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    wants_to_learn: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      wants_to_learn: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setErrorMessage('Name and email are required');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await trainingAPI.submitEnquiry({
        package: packageData?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        wants_to_learn: formData.wants_to_learn,
      });

      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        wants_to_learn: false,
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to submit enquiry:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to submit enquiry. Please try again.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        wants_to_learn: false,
      });
      setStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

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
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary to-red-600 text-white p-4 sm:p-6 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold">Training Enquiry</h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {packageData && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Enquiring about:</p>
                    <p className="font-semibold text-gray-900">{packageData.title}</p>
                  </div>
                )}

                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600">
                      Your enquiry has been submitted successfully. We will contact you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
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
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                        Message
                      </label>
                      <div className="relative">
                        <MessageSquare size={20} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                          placeholder="Tell us about your interest in our training programs..."
                        />
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="wants_to_learn"
                        name="wants_to_learn"
                        checked={formData.wants_to_learn}
                        onChange={handleCheckboxChange}
                        className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="wants_to_learn" className="text-sm text-gray-700 cursor-pointer">
                        I want to learn and register for this training program
                      </label>
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
                      {loading ? 'Submitting...' : 'Submit Enquiry'}
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

export default TrainingEnquiryModal;

