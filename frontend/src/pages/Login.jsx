import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Wallet } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to Dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Sign in successful.');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Sign in failed. Check your email and password.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070a13] px-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand identity header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-650 bg-gradient-to-tr from-brand-500 to-indigo-500 shadow-xl shadow-brand-500/20">
            <Wallet size={22} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-widest text-slate-100 uppercase">Spently</h2>
          <p className="text-xs text-slate-400">Log and manage your expenses efficiently</p>
        </div>

        {/* glass card panel */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 flex items-center space-x-2">
            <LogIn className="text-brand-400 animate-pulse" size={16} />
            <h3 className="text-base font-bold text-slate-200 tracking-wide uppercase">Sign In</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. support@spently.com"
                className={`w-full rounded-xl border bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all ${
                  errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all ${
                  errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'
                }`}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Action submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white py-3 text-xs font-bold uppercase tracking-wider transition-all duration-205 cursor-pointer shadow-md shadow-brand-600/20 flex items-center justify-center"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Registration Redirect Link */}
          <div className="mt-6 border-t border-slate-850/60 pt-5 text-center">
            <p className="text-xs text-slate-400">
              New to Spently?{' '}
              <Link to="/register" className="font-bold text-brand-400 hover:text-brand-300 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
