import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Image as ImageIcon, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function ImagesToPdfTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const { convertImagesToPdf } = useTools();

  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const moveItem = (from, to) => {
    if (to < 0 || to >= files.length) return;
    const copy = [...files];
    const item = copy.splice(from, 1)[0];
    copy.splice(to, 0, item);
    setFiles(copy);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Converting images to PDF on backend API...');
    try {
      const res = await convertImagesToPdf(files);
      onProcessFinished(res.downloadUrl, `images_converted_${Date.now()}.pdf`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to convert images to PDF');
    }
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemoveFile={(idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))}
        onClearFiles={() => setFiles([])}
        multiple={true}
        acceptedTypes="image/*"
        title="Select Images (JPG, PNG, WEBP)"
        subtitle="Combine your photos or scanned pages into a clean PDF document"
        showFileList={false}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-rose-300 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Arrange Images Order ({files.length})
            </h4>
            <span className="text-xs text-slate-600 font-medium">Order corresponds to PDF pages</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl border border-rose-200 bg-rose-50/50 overflow-hidden flex flex-col justify-between p-2 hover:border-rose-300 transition-colors"
              >
                <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {idx + 1}
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden my-1">
                  {file.type?.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-rose-600" />
                  )}
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg p-1 border border-rose-200 text-xs">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, idx - 1)}
                    disabled={idx === 0}
                    className="p-1 hover:bg-rose-100 text-slate-700 disabled:opacity-30 rounded font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="p-1 text-red-600 hover:bg-red-50 rounded font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, idx + 1)}
                    disabled={idx === files.length - 1}
                    className="p-1 hover:bg-rose-100 text-slate-700 disabled:opacity-30 rounded font-bold"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Convert {files.length} Image(s) to PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
