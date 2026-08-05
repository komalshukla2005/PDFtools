import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { Presentation, ArrowRight } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function PdfToPptTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const { pdfToPpt } = useTools();

  const handleConvert = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Converting PDF pages into PowerPoint slides (.pptx)...');
    try {
      const res = await pdfToPpt(files[0]);
      onProcessFinished(res.downloadUrl, res.fileName || 'converted_presentation.pptx', res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to convert PDF to PowerPoint presentation');
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
        title="Select a PDF to Convert to PowerPoint (.pptx)"
        subtitle="Extract PDF pages and content into formatted PowerPoint slides"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <div className="flex items-center space-x-3 bg-rose-50 border border-rose-200 p-4 rounded-xl">
            <Presentation className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Output Format: PowerPoint Presentation (.pptx)</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Creates 16:9 widescreen presentation slides from PDF document content.</p>
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Convert PDF to PowerPoint</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
