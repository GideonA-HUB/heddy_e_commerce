import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authAPI } from '../api';
import SEO from '../components/SEO';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const siteLogo = localStorage.getItem('heddiekitchen_logo');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });

      if (response.data.user && response.data.token) {
        const profile = response.data.profile || null;
        setUser(response.data.user, profile, response.data.token);
        navigate(from, { replace: true });
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { detail?: string; non_field_errors?: string[] } };
      };
      setError(
        ax.response?.data?.detail ||
          ax.response?.data?.non_field_errors?.[0] ||
          'Invalid username or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#f7f7f8] px-4 py-8 sm:py-10">
      <SEO title="Login" description="Sign in to your HEDDIEKITCHEN account." />

      <div className="w-full max-w-[22rem] sm:max-w-sm">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-6 text-center">
            {siteLogo ? (
              <img
                src={siteLogo}
                alt=""
                className="mx-auto mb-3 h-12 w-12 rounded-xl object-contain"
              />
            ) : null}
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-4 flex gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 shrink-0 text-primary" size={16} />
              <p className="text-xs text-red-700 sm:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Username or Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className={inputClass}
                  placeholder="Username or email"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className={inputClass}
                  placeholder="Your password"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500 sm:text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Sign up
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

export default LoginPage;
