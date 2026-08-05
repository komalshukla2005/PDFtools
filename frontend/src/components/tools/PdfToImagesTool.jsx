import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { FileImage } from 'lucide-react';
import { convertPdfToImagesClient } from '../../utils/pdfToImageRenderer';

export default function PdfToImagesTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('300');

  const handleConvert = async () => {
    if (files.length === 0) return;
    onStartProcess(30, 'Rendering PDF pages to high-resolution images...');
    try {
      const res = await convertPdfToImagesClient(files[0], format, quality);
      const baseName = files[0].name.replace(/\.[^/.]+$/, "");

      if (res.count > 1) {
        res.images.forEach((img, idx) => {
          setTimeout(() => {
            const link = document.createElement('a');
            link.href = img.dataUrl;
            link.download = `${baseName}_page${img.pageNum || idx + 1}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, idx * 250);
        });
      }

      onProcessFinished(
        res.downloadUrl,
        `${baseName}_page1.${format}`,
        `Successfully converted ${res.count} page(s) directly to real ${format.toUpperCase()} image(s)!`
      );
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to convert PDF pages to images');
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
        title="Select a PDF to Convert into Images"
        subtitle="Extract every PDF page as high-resolution PNG or JPG image files"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Image Output Settings
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Image Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    format === 'png'
                      ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                      : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
                  }`}
                >
                  PNG (Lossless)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('jpg')}
                  className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    format === 'jpg'
                      ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                      : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
                  }`}
                >
                  JPG (Compact)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Target Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              >
                <option value="150">Standard Quality (150 DPI)</option>
                <option value="300">High Quality (300 DPI)</option>
                <option value="600">Ultra Print Quality (600 DPI)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <FileImage className="w-5 h-5" />
            <span>Convert PDF to {format.toUpperCase()} Images</span>
          </button>
        </div>
      )}
    </div>
  );
}
