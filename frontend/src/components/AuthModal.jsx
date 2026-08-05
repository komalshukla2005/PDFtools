import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Toast from './Toast';

export default function AuthModal({ isOpen, mode, onClose, onSwitchMode, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, login, loading, error, setError } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setError(null);
    setToast(null);
  }, [mode, isOpen, setError]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setToast(null);

    try {
      if (mode === 'register') {
        const displayName = fullName.trim() || email.split('@')[0];
        const res = await register(displayName, email, password);
        
        // Show Top Right Toast
        setToast({ type: 'success', message: res.message || 'Account created successfully! Please log in now.' });
        
        // Clear password, keep email filled, and switch to login mode
        setPassword('');
        setTimeout(() => {
          onSwitchMode('login');
        }, 2500);

      } else {
        // Login mode
        const res = await login(email, password);
        
        if (res && res.token) {
          localStorage.setItem('pdfforge_token', res.token);
          localStorage.setItem('pdfforge_user', JSON.stringify(res.user));
        }

        setToast({ type: 'success', message: res.message || 'Login successful!' });
        setSubmitted(true);

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          setSubmitted(false);
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      setToast({ type: 'error', message: err.message });
    }
  };

  const isLogin = mode === 'login';

  return (
    <>
      {/* Top Right Floating Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className={`relative w-full ${isLogin ? 'max-w-md' : 'max-w-xl'} bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 transition-all duration-300`}>
          
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Welcome Back!
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                Successfully logged in to PDFForge. Redirecting...
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold mb-3">
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mandatory Authentication</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isLogin ? 'Sign In to PDFForge' : 'Create an Account'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  {isLogin
                    ? 'Login is required to access tools and process PDF documents'
                    : 'Register for free to unlock all client-side PDF tools'}
                </p>
              </div>



              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin ? (
                  /* Register Mode */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="Jane Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Login Mode */
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl py-2.5 pl-10 pr-10 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In & Access Tools' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch Mode Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
                {isLogin ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onSwitchMode('register')}
                      className="text-rose-600 font-extrabold hover:underline ml-1 cursor-pointer"
                    >
                      Register
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onSwitchMode('login')}
                      className="text-rose-600 font-extrabold hover:underline ml-1 cursor-pointer"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
