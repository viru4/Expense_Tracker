import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Wallet } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser(data.username, data.email, data.password);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      // Backend validation error payload parsing
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        toast.error(backendErrors[firstKey]);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed. Try a different username/email.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070a13] px-4 py-8 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand identity header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 shadow-xl shadow-brand-500/20">
            <Wallet size={22} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-widest text-slate-100 uppercase">Spently</h2>
          <p className="text-xs text-slate-400">Join Spently today and manage your budget</p>
        </div>

        {/* glass card panel */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 flex items-center space-x-2">
            <UserPlus className="text-brand-400 animate-pulse" size={16} />
            <h3 className="text-base font-bold text-slate-200 tracking-wide uppercase">Sign Up</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. janesmith"
                className={`w-full rounded-xl border bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all ${
                  errors.username ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'
                }`}
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Alphanumeric letters, numbers, and underscores only',
                  },
                })}
              />
              {errors.username && (
                <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.username.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. jane.smith@gmail.com"
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

            {/* Password Input */}
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
                  minLength: { value: 6, message: 'Password must be between 6 and 20 characters long' },
                  maxLength: { value: 20, message: 'Password must be between 6 and 20 characters long' },
                  validate: {
                    uppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                    lowercase: (v) => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
                    digit: (v) => /[0-9]/.test(v) || 'Password must contain at least one digit',
                    special: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all ${
                  errors.confirmPassword ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'
                }`}
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white py-3 text-xs font-bold uppercase tracking-wider transition-all duration-205 cursor-pointer shadow-md shadow-brand-600/20 flex items-center justify-center"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login redirect link */}
          <div className="mt-6 border-t border-slate-850/60 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-400 hover:text-brand-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
