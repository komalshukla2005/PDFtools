import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Merge, ArrowUp, ArrowDown, Trash2, FileText } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function MergeTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const { mergePdfs } = useTools();

  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...files];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setFiles(updated);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setFiles(updated);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    onStartProcess(40, 'Sending files to backend API...');
    try {
      const res = await mergePdfs(files);
      onProcessFinished(res.downloadUrl, `pdfforge_merged_${Date.now()}.pdf`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to merge PDF files');
    }
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemoveFile={handleRemoveFile}
        onClearFiles={() => setFiles([])}
        multiple={true}
        acceptedTypes=".pdf,application/pdf"
        title="Select 2 or more PDFs to merge"
        subtitle="Drag and drop your PDF documents here"
        showFileList={false}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-rose-300 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Files to Merge ({files.length})
            </h4>
            <span className="text-xs text-slate-600 font-medium">Merged top-to-bottom</span>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-rose-50/70 border border-rose-200 hover:border-rose-300 transition-colors"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-900 truncate">{file.name}</span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 disabled:opacity-30 text-slate-700 font-bold cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 disabled:opacity-30 text-slate-700 font-bold cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1.5 rounded-lg bg-white border border-rose-200 hover:bg-red-50 text-red-600 hover:border-red-300 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            {files.length >= 2 ? (
              <button
                onClick={handleMerge}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Merge className="w-5 h-5" />
                <span>Merge {files.length} PDF Files Now</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-center text-xs font-bold">
                ⚠️ Please select at least 2 PDF files to enable the Merge button.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
