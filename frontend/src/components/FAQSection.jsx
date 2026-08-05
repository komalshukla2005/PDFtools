import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      q: "Is PDFForge really free and safe to use?",
      a: "Yes! PDFForge processes all your PDF files completely client-side right inside your browser. No files are uploaded to any external server, ensuring 100% privacy and security."
    },
    {
      q: "Can I merge multiple PDFs into a single file?",
      a: "Absolutely. With our 'Merge 2 PDF' tool, you can select two or more PDF documents, re-arrange their sequence, and merge them into one organized PDF file."
    },
    {
      q: "How does the Add Watermark tool work?",
      a: "You can specify custom text (e.g. CONFIDENTIAL or DRAFT), set position, rotation angle, font size, and opacity. PDFForge stamps it directly onto every page of your PDF."
    },
    {
      q: "What is the difference between Lock PDF and Unlock PDF?",
      a: "Lock PDF lets you encrypt your PDF document with a custom password. Unlock PDF allows you to remove password restrictions when authorized."
    },
    {
      q: "Can I extract images or convert images to PDF?",
      a: "Yes! 'PDF to Images' converts every PDF page into PNG/JPG images in a ZIP file, while 'Images to PDF' combines JPG, PNG, and WebP photos into a clean PDF document."
    }
  ];

  // All FAQs closed by default
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 border-t border-white/15 bg-white/5 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Top Gold Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/40 shadow-lg mb-4">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent font-extrabold text-sm sm:text-base tracking-wide">
            Frequently Asked Questions
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-12 drop-shadow-md">
          Got Questions? <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">We Have Answers.</span>
        </h2>

        {/* FAQ Cards */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-rose-200 shadow-md overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between font-extrabold text-slate-900 text-lg sm:text-xl hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-700 text-base leading-relaxed font-medium border-t border-rose-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
