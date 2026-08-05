import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Scissors, Layers, Hash } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function SplitTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('single');
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const { splitPdf } = useTools();

  const handleSplit = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Processing PDF split on backend API...');
    try {
      const res = await splitPdf(files[0], { mode, startPage, endPage });
      onProcessFinished(res.downloadUrl, `pdfforge_split_${Date.now()}.pdf`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to split PDF file');
    }
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        files={files}
        onFilesAdded={(newFiles) => setFiles([newFiles[0]])}
        onRemoveFile={() => setFiles([])}
        onClearFiles={() => setFiles([])}
        multiple={false}
        acceptedTypes=".pdf,application/pdf"
        title="Select a PDF to split"
        subtitle="Choose page ranges or split into individual files"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Select Split Mode
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'single'
                  ? 'border-rose-600 bg-rose-50 text-slate-900 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-1.5">
                <div className={`p-2 rounded-lg ${mode === 'single' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600'}`}>
                  <Layers className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">Split All Pages</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Extract every page into individual PDF files.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('range')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'range'
                  ? 'border-rose-600 bg-rose-50 text-slate-900 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-1.5">
                <div className={`p-2 rounded-lg ${mode === 'range' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600'}`}>
                  <Hash className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">Specific Range</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Extract a specific range of pages (e.g., Page 1 to Page 5).
              </p>
            </button>
          </div>

          {mode === 'range' && (
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Page Range Settings
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Page</label>
                  <input
                    type="number"
                    min="1"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="w-full bg-white border border-rose-300 rounded-lg px-3 py-2 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">End Page</label>
                  <input
                    type="number"
                    min="1"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="w-full bg-white border border-rose-300 rounded-lg px-3 py-2 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSplit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Scissors className="w-5 h-5" />
            <span>Split PDF Now</span>
          </button>
        </div>
      )}
    </div>
  );
}
