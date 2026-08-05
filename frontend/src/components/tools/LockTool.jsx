import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function LockTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { lockPdf } = useTools();

  const handleLock = async () => {
    if (files.length === 0 || !password) return;
    if (password !== confirmPassword) {
      onProcessError('Passwords do not match! Please check again.');
      return;
    }
    onStartProcess(40, 'Encrypting PDF & saving lock record to database...');
    try {
      const res = await lockPdf(files[0], password);
      onProcessFinished(res.downloadUrl, res.fileName || `locked_${files[0].name}`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to encrypt PDF');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: 'None', color: 'text-slate-500', width: '0%' };
    if (password.length < 6) return { text: 'Weak', color: 'text-rose-600', width: '33%' };
    if (password.length < 10) return { text: 'Medium', color: 'text-amber-600', width: '66%' };
    return { text: 'Strong', color: 'text-emerald-600', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-5">
      <FileUploadZone
        files={files}
        onFilesAdded={(newFiles) => setFiles([newFiles[0]])}
        onRemoveFile={() => setFiles([])}
        onClearFiles={() => setFiles([])}
        multiple={false}
        acceptedTypes=".pdf,application/pdf"
        title="Select a PDF to Lock with Password"
        subtitle="Encrypt confidential document with AES password security"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Set Security Password
            </h4>
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES Encryption</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Set Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password..."
                  className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password..."
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            {password && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Password Strength:</span>
                  <span className={strength.color}>{strength.text}</span>
                </div>
                <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    strength.text === 'Weak' ? 'bg-rose-600' : strength.text === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} style={{ width: strength.width }} />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLock}
            disabled={!password || password !== confirmPassword}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 disabled:opacity-40 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Lock className="w-5 h-5" />
            <span>Encrypt & Password Protect PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
