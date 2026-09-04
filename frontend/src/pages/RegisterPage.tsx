import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authAPI } from '../api';
import SEO from '../components/SEO';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const siteLogo = localStorage.getItem('heddiekitchen_logo');

  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register({
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      });
      if (res.data.user && res.data.token) {
        const profile = res.data.profile || null;
        setUser(res.data.user, profile, res.data.token);
        navigate('/');
      }
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: Record<string, unknown> } })
        ?.response?.data;
      if (errorData?.username) {
        const u = errorData.username;
        setError(`Username: ${Array.isArray(u) ? u[0] : u}`);
      } else if (errorData?.email) {
        const em = errorData.email;
        setError(`Email: ${Array.isArray(em) ? em[0] : em}`);
      } else {
        setError(
          (errorData?.detail as string) || 'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary';
  const inputClassNoIcon =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#f7f7f8] px-4 py-8 sm:py-10">
      <SEO title="Create Account" description="Join HEDDIEKITCHEN and start ordering." />

      <div className="w-full max-w-[22rem] sm:max-w-sm">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-5 text-center">
            {siteLogo ? (
              <img
                src={siteLogo}
                alt=""
                className="mx-auto mb-3 h-12 w-12 rounded-xl object-contain"
              />
            ) : null}
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Create account
            </h1>
            <p className="mt-1 text-sm text-gray-500">Join and start ordering</p>
          </div>

          {error && (
            <div className="mb-4 flex gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 shrink-0 text-primary" size={16} />
              <p className="text-xs text-red-700 sm:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  First name
                </label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First"
                  required
                  autoComplete="given-name"
                  className={inputClassNoIcon}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Last name
                </label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last"
                  required
                  autoComplete="family-name"
                  className={inputClassNoIcon}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  type="password"
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password2"
                  value={form.password2}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-1 w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500 sm:text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center">
          <Link to="/" className="text-xs font-medium text-gray-500 hover:text-gray-800">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
