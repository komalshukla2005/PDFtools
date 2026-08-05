import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Archive } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function ZipTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [zipName, setZipName] = useState('PDFForge_Archive');
  const { createZip } = useTools();

  const handleCreateZip = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Generating Zip archive on backend API...');
    try {
      const res = await createZip(files);
      const cleanName = (zipName.trim() || 'PDFForge_Archive').replace(/\.zip$/i, '') + '.zip';
      onProcessFinished(res.downloadUrl, cleanName, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to create ZIP archive');
    }
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        files={files}
        onFilesAdded={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
        onRemoveFile={(idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))}
        onClearFiles={() => setFiles([])}
        multiple={true}
        acceptedTypes=".pdf,image/*,.doc,.docx,.txt"
        title="Select files to package into a ZIP archive"
        subtitle="Combine PDFs, images, or documents into a compressed archive"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-rose-300 shadow-md space-y-4">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block mb-2">
              ZIP Archive Output Name
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={zipName}
                onChange={(e) => setZipName(e.target.value)}
                placeholder="Enter archive name"
                className="w-full bg-rose-50/50 border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
              <span className="text-sm font-extrabold text-rose-700 bg-rose-100 border border-rose-300 px-3.5 py-2.5 rounded-xl">
                .zip
              </span>
            </div>
          </div>

          <button
            onClick={handleCreateZip}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Archive className="w-5 h-5" />
            <span>Generate ZIP File ({files.length} items)</span>
          </button>
        </div>
      )}
    </div>
  );
}
