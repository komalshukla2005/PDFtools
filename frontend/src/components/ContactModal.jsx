import React, { useState } from 'react';
import { X, Mail, Send, MessageSquare, CheckCircle2, Sparkles, User } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-rose-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Message Sent!</h3>
            <p className="text-sm text-slate-600 font-medium max-w-xs mx-auto">
              Thank you for reaching out to PDFForge. We'll get back to you shortly.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Contact Us
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Have a feature request, feedback, or question? Send us a message below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-rose-300 focus:border-rose-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-rose-300 focus:border-rose-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Message</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-rose-300 focus:border-rose-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 placeholder-slate-400 outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
