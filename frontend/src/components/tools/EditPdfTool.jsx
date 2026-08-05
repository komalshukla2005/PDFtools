import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Edit3, RotateCw, Type } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function EditPdfTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [rotation, setRotation] = useState('0');
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#dc2626');
  const { editPdf } = useTools();

  const handleEdit = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Applying PDF annotations and layout edits...');
    try {
      const res = await editPdf(files[0], {
        headerText,
        footerText,
        overlayText,
        rotation,
        fontSize,
        textColor
      });
      const baseName = files[0].name.replace(/\.[^/.]+$/, "");
      onProcessFinished(res.downloadUrl, `edited_${baseName}.pdf`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to edit PDF document');
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
        title="Select a PDF to Edit & Annotate"
        subtitle="Add custom text headers, footers, notes, and rotate page orientation"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-rose-600" />
            <span>PDF Editor & Annotation Controls</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Page Header Text</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="e.g. OFFICIAL CONFIDENTIAL"
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Page Footer Text</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Page Note / Copyright 2026"
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Center Text Overlay</label>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="e.g. APPROVED FOR RELEASE"
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1">
                <RotateCw className="w-3.5 h-3.5 text-rose-600" />
                <span>Page Rotation</span>
              </label>
              <select
                value={rotation}
                onChange={(e) => setRotation(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              >
                <option value="0">0° (Original Orientation)</option>
                <option value="90">90° Clockwise</option>
                <option value="180">180° Flip</option>
                <option value="270">270° Counter-Clockwise</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1">
                <Type className="w-3.5 h-3.5 text-rose-600" />
                <span>Text Size & Color</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  min="8"
                  max="72"
                  className="w-1/2 bg-white border border-rose-300 rounded-xl px-3 py-2 text-sm font-extrabold text-slate-900"
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-1/2 h-10 border border-rose-300 rounded-xl cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleEdit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Edit3 className="w-5 h-5" />
            <span>Apply Edits to PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
