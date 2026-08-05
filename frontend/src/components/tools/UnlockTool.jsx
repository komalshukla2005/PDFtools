import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Unlock, Eye, EyeOff } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function UnlockTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { unlockPdf } = useTools();

  const handleUnlock = async () => {
    if (files.length === 0) return;
    if (!password) {
      onProcessError('Please enter password to unlock document.');
      return;
    }
    onStartProcess(40, 'Verifying document ownership & unlocking PDF...');
    try {
      const res = await unlockPdf(files[0], password);
      onProcessFinished(res.downloadUrl, res.fileName || `unlocked_${files[0].name}`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to unlock PDF file');
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
        title="Select Password Protected PDF"
        subtitle="Only PDFs locked on PDFForge by your account can be unlocked"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Enter Document Unlock Password
          </h4>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Document Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password used during locking..."
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Validation Note: Only PDFs locked on PDFForge by your user account can be verified and unlocked.
            </p>
          </div>

          <button
            onClick={handleUnlock}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Unlock className="w-5 h-5" />
            <span>Unlock PDF Document</span>
          </button>
        </div>
      )}
    </div>
  );
}
