import React, { useEffect } from 'react';
import { Download, CheckCircle2, RefreshCw, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProcessingModal({
  isOpen,
  isProcessing,
  progress,
  statusText,
  downloadUrl,
  downloadFilename,
  onReset,
  toolTitle
}) {
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
    if (!isProcessing && downloadUrl && isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isProcessing, downloadUrl, isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = downloadFilename || 'pdfforge_result.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!downloadUrl) return;

    if (downloadUrl.startsWith('blob:')) {
      window.open(downloadUrl, '_blank');
      return;
    }

    try {
      const parts = downloadUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const binary = atob(parts[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error(err);
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-lg w-full rounded-3xl border border-rose-200 shadow-2xl p-6 sm:p-8 text-center space-y-6 bg-white">
        
        {isProcessing ? (
          <div className="space-y-6 py-4">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-rose-100" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" 
              />
              <Loader2 className="w-8 h-8 text-red-600 animate-pulse" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Processing {toolTitle}...
              </h3>
              <p className="text-slate-500 text-sm mt-1">{statusText || 'Please wait a moment'}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Progress</span>
                <span className="text-red-600">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-rose-50 rounded-full overflow-hidden border border-rose-200 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 rounded-full transition-all duration-300 shadow-md"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Task Complete</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Your File is Ready!
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Processed completely in your browser. Click below to download.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-base shadow-xl shadow-red-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Processed File</span>
            </button>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handlePreview}
                className="py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-red-600" />
                <span>Preview File</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-red-600" />
                <span>Process Another</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
