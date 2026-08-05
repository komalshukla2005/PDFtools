import React from 'react';
import { Flame, ShieldCheck } from 'lucide-react';
import { TOOLS } from '../data/toolsData';

export default function Footer({ onSelectTool }) {
  return (
    <footer className="bg-white border-t border-rose-200 pt-14 pb-10 text-slate-900 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-600/20">
                <Flame className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-slate-900">
                PDF<span className="text-rose-600">Forge</span>
              </span>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium max-w-sm">
              PDFForge is the ultimate, privacy-focused online suite for all your PDF editing, conversion, and security needs.
            </p>
            <div className="flex items-center space-x-2 text-sm text-emerald-700 font-extrabold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Zero server upload • 100% Client side</span>
            </div>
          </div>

          {/* Core Tools */}
          <div className="md:col-span-4 md:pl-16">
            <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 mb-4">Popular Tools</h4>
            <ul className="space-y-2.5 text-sm sm:text-base font-bold text-slate-700">
              {TOOLS.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <button onClick={() => onSelectTool(t.id)} className="hover:text-rose-600 transition-colors text-left">
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div className="md:col-span-4 md:pl-12">
            <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 mb-4">Security & Convert</h4>
            <ul className="space-y-2.5 text-sm sm:text-base font-bold text-slate-700">
              {TOOLS.slice(5).map((t) => (
                <li key={t.id}>
                  <button onClick={() => onSelectTool(t.id)} className="hover:text-rose-600 transition-colors text-left">
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Centered Copyright Line */}
        <div className="pt-8 border-t border-rose-200 text-center text-sm sm:text-base font-bold text-slate-600">
          © {new Date().getFullYear()} PDFForge. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
