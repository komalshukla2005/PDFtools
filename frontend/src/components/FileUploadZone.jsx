import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Plus, Sparkles } from 'lucide-react';

export default function FileUploadZone({ 
  files, 
  onFilesAdded, 
  onRemoveFile, 
  onClearFiles, 
  multiple = true, 
  acceptedTypes = '.pdf,application/pdf', 
  title = "Drop your PDF files here",
  subtitle = "or click to select files from your computer",
  showFileList = true
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // Helper to generate a sample dummy PDF file for instant testing!
  const generateSamplePdf = (name = "Sample_Document.pdf") => {
    const sampleContent = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <<>> /Contents 4 0 R>> endobj
4 0 obj <</Length 55>> stream
BT /F1 12 Tf 100 700 TD (PDFForge Demo Document Sample) ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000062 00000 n 
00000000117 00000 n 
00000000224 00000 n 
trailer <</Size 5 /Root 1 0 R>>
startxref
330
%%EOF`;
    const blob = new Blob([sampleContent], { type: 'application/pdf' });
    const sampleFile = new File([blob], name, { type: 'application/pdf', lastModified: Date.now() });
    onFilesAdded([sampleFile]);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Big Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-rose-500 bg-rose-100/70 scale-[1.01] shadow-2xl shadow-rose-500/10' 
            : 'border-slate-300 hover:border-rose-500 bg-white hover:bg-rose-50/40 shadow-md hover:shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
            <UploadCloud className="w-7 h-7 animate-bounce text-rose-600" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
              {title}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-medium">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs text-rose-700 font-extrabold">
              Supported Formats: {acceptedTypes.replace(/application\/pdf|image\/\*/g, 'PDF / Images')}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-extrabold">
              Client-Side Encrypted
            </span>
          </div>

          {/* Quick Demo File Trigger */}
          {files.length === 0 && (
            <div className="pt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  generateSamplePdf(`PDFForge_Document_1.pdf`);
                  if (multiple) {
                    setTimeout(() => generateSamplePdf(`PDFForge_Document_2.pdf`), 200);
                  }
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs sm:text-sm font-extrabold transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Need test file? Click to insert sample PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Files List (Only if showFileList is true) */}
      {showFileList && files.length > 0 && (
        <div className="rounded-3xl p-5 border bg-white border-slate-200 space-y-3 shadow-md">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Selected Files ({files.length})
            </span>
            <button
              onClick={onClearFiles}
              className="text-xs sm:text-sm font-extrabold text-rose-600 hover:underline transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-sm sm:text-base hover:border-rose-300 transition-colors"
              >
                <div className="flex items-center space-x-3 truncate mr-2">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-slate-900 font-extrabold truncate text-sm sm:text-base">{file.name}</div>
                    <div className="text-xs text-slate-500 font-bold">{formatFileSize(file.size)}</div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFile(index)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {multiple && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-2xl border border-dashed border-rose-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-sm font-extrabold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add More Files</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
