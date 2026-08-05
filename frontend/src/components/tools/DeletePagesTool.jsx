import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Trash2 } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function DeletePagesTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [pagesInput, setPagesInput] = useState('3');
  const { deletePdfPages } = useTools();

  const handleFilesAdded = (newFiles) => {
    setFiles([newFiles[0]]);
  };

  const handleDelete = async () => {
    if (files.length === 0 || !pagesInput.trim()) return;
    onStartProcess(40, 'Deleting pages on backend API...');
    try {
      const res = await deletePdfPages(files[0], pagesInput.trim());
      onProcessFinished(res.downloadUrl, `modified_${files[0].name}`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Page not existing');
    }
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemoveFile={() => setFiles([])}
        onClearFiles={() => setFiles([])}
        multiple={false}
        acceptedTypes=".pdf,application/pdf"
        title="Select a PDF to delete unwanted pages"
        subtitle="Enter page numbers to remove from your document"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block mb-2">
              Enter Page Numbers to Delete
            </label>
            <input
              type="text"
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              placeholder="e.g. 3 or 1, 3, 5"
              className="w-full bg-white border border-rose-300 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
            <p className="text-xs font-bold text-slate-600 mt-1.5">
              Separate multiple page numbers with commas (e.g., 2, 4).
            </p>
          </div>

          <button
            onClick={handleDelete}
            disabled={!pagesInput.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 disabled:opacity-40 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Selected Pages</span>
          </button>
        </div>
      )}
    </div>
  );
}
