import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Stamp, Type, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function WatermarkTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const [watermarkType, setWatermarkType] = useState('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.4);
  const [imageScale, setImageScale] = useState(1.0);
  const [fitMode, setFitMode] = useState('cover');
  const [watermarkImageFile, setWatermarkImageFile] = useState(null);
  const { addWatermark } = useTools();

  const presetTexts = ['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'INTERNAL ONLY', 'APPROVED'];

  const handleSwitchToText = () => {
    setWatermarkType('text');
    setWatermarkImageFile(null);
    if (!text) setText('CONFIDENTIAL');
  };

  const handleSwitchToImage = () => {
    setWatermarkType('image');
    setText('');
    setFontSize(48);
  };

  const handleApply = async () => {
    if (files.length === 0) return;
    if (watermarkType === 'image' && !watermarkImageFile) {
      onProcessError('Please select a watermark image file.');
      return;
    }
    if (watermarkType === 'text' && !text.trim()) {
      onProcessError('Please enter watermark text.');
      return;
    }

    onStartProcess(40, 'Applying watermark on backend API...');
    try {
      const res = await addWatermark(
        files[0],
        { watermarkType, text: text.trim(), fontSize, opacity, imageScale, fitMode },
        watermarkImageFile
      );
      onProcessFinished(res.downloadUrl, `watermarked_${files[0].name}`, res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to add watermark');
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
        title="Select a PDF to watermark"
        subtitle="Add custom text stamps or logo images onto all pages of your PDF"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Watermark Type
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleSwitchToText}
              className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 font-extrabold text-sm transition-all cursor-pointer ${
                watermarkType === 'text'
                  ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Text Watermark</span>
            </button>

            <button
              type="button"
              onClick={handleSwitchToImage}
              className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 font-extrabold text-sm transition-all cursor-pointer ${
                watermarkType === 'image'
                  ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image / Logo Watermark</span>
            </button>
          </div>

          {watermarkType === 'text' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {presetTexts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setText(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                        text === p
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Watermark Text</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter watermark text..."
                  className="w-full bg-white border border-rose-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Font Size</span>
                    <span className="text-rose-600 font-extrabold">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="96"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Opacity</span>
                    <span className="text-rose-600 font-extrabold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Watermark Image (PNG / JPG)</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => setWatermarkImageFile(e.target.files[0])}
                  className="w-full bg-rose-50/50 border border-rose-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none"
                />
                {watermarkImageFile && (
                  <p className="text-xs font-bold text-emerald-600 mt-1">
                    Selected Image: {watermarkImageFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Image Display Fit</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`py-2 rounded-xl text-xs font-extrabold border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      fitMode === 'cover'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                        : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Full Page Cover (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`py-2 rounded-xl text-xs font-extrabold border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      fitMode === 'contain'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                        : 'border-rose-200 bg-white text-slate-700 hover:border-rose-300'
                    }`}
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Original Aspect Ratio</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Image Size / Scale</span>
                    <span className="text-rose-600 font-extrabold">{Math.round(imageScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={imageScale}
                    onChange={(e) => setImageScale(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Image Opacity</span>
                    <span className="text-rose-600 font-extrabold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleApply}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Stamp className="w-5 h-5" />
            <span>Apply Watermark to PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
