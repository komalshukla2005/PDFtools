import React from 'react';
import { Search, Shield, Zap, Lock, Sparkles, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';

export default function Hero({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  return (
    <div className="relative pt-8 pb-6 overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-white/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-rose-200 shadow-lg mb-6 animate-pulse-slow">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide">
            All 9 Powerful PDF Tools Ready • 100% Free Frontend & Browser Execution
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.15] drop-shadow-lg">
          Every PDF Tool You Need, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-md">
            Forged in Your Browser.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white text-base sm:text-xl max-w-3xl mx-auto mb-7 font-extrabold leading-relaxed drop-shadow-md tracking-wide">
          Merge files, split pages, create ZIP archives, add watermarks, delete unwanted pages, lock or unlock PDFs, and convert images seamlessly.
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-6">
          <div className="relative bg-white rounded-2xl p-1 flex items-center border-2 border-white/60 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/30 transition-all shadow-2xl">
            <Search className="w-5 h-5 text-rose-600 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF tools (e.g. merge, split, watermark, lock)..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none font-bold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 text-xs bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl mr-1 border border-rose-300 font-extrabold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-md ${
                selectedCategory === cat.id
                  ? 'bg-white text-rose-950 shadow-xl scale-105 ring-2 ring-amber-300'
                  : 'bg-white/20 hover:bg-white/35 text-white border border-white/40 backdrop-blur-md'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-1 text-xs sm:text-sm font-extrabold text-slate-900">
          <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-rose-100 shadow-lg">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Zero Data Upload</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-rose-100 shadow-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-rose-100 shadow-lg">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>AES Password Lock</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-rose-100 shadow-lg">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>9+ Suite Tools</span>
          </div>
        </div>

      </div>
    </div>
  );
}
