import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, MessageSquare, CheckCircle2, Sparkles, User, ShieldCheck, Clock } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pd-ftools-ecru.vercel.app/api';
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setMessage('');
        navigate('/');
      }, 2500);
    } catch (err) {
      setError(err.message || 'An error occurred while sending your message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* Left Side: Contact Information Cards */}
        <div className="space-y-4 md:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 text-slate-900">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              We'd Love to Hear From You
            </h2>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Have questions, feedback, or feature requests for PDFForge? Drop us a line and our team will get back to you.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3 text-slate-900">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-slate-500 font-bold">Direct Email</div>
              <div className="text-base font-extrabold text-slate-900 truncate">komalshukla23@navgurukul.org</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3 text-slate-900">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold">Response Time</div>
              <div className="text-base font-extrabold text-slate-900">Within 24 Hours</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3 text-slate-900">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold">Privacy First</div>
              <div className="text-base font-extrabold text-slate-900">100% Client-Side</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-slate-900 relative overflow-hidden">

            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto">
                  Thank you for reaching out to PDFForge. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Fill out the form below and we will get back to you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value.replace(/[0-9]/g, ''))}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Message</label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <textarea
                        required
                        rows={5}
                        placeholder="How can we help you today?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 disabled:opacity-70 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
                  >
                    <Send className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
