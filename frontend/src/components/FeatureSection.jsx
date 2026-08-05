import React from 'react';
import { ShieldCheck, Zap, Lock, Infinity as InfinityIcon } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Client-Side Privacy",
      description: "Your files never leave your browser or device. All rendering and PDF processing happens locally in WebAssembly & JS.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      icon: Zap,
      title: "Lightning Fast Engine",
      description: "Zero waiting for upload or download server latency. Merge, split, lock, and watermark instantly.",
      color: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
      icon: InfinityIcon,
      title: "No Limits, No Fees",
      description: "No hidden subscriptions, file count caps, or file size paywalls. Completely free PDF toolkit for everyone.",
      color: "text-rose-600 bg-rose-50 border-rose-200"
    },
    {
      icon: Lock,
      title: "AES Encryption Security",
      description: "Password protect your confidential financial, legal, or personal documents with military-grade encryption flags.",
      color: "text-rose-600 bg-rose-50 border-rose-200"
    }
  ];

  return (
    <section className="py-16 border-t border-white/15 bg-white/5 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-md">
            Why Professionals Choose <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">PDFForge</span>
          </h2>
          <p className="text-rose-100 text-lg font-medium">
            Built with modern client-side standards to give you total control over document privacy and speed.
          </p>
        </div>

        {/* 2 cards per row grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-7 border border-rose-200 shadow-md hover:shadow-xl transition-all space-y-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${f.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-slate-700 text-base leading-relaxed font-medium">{f.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
