import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { FileText, ArrowRight } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function PdfToWordTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const { pdfToWord } = useTools();

  const handleConvert = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Converting PDF text & layout to editable Word document (.docx)...');
    try {
      const res = await pdfToWord(files[0]);
      onProcessFinished(res.downloadUrl, res.fileName || 'converted_document.docx', res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to convert PDF to Word document');
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
        title="Select a PDF to Convert to Word (.docx)"
        subtitle="Convert PDF text and structure into editable Microsoft Word documents"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <div className="flex items-center space-x-3 bg-rose-50 border border-rose-200 p-4 rounded-xl">
            <FileText className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Output Format: Microsoft Word (.docx)</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Extracts text and paragraphs directly into editable Word format.</p>
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Convert PDF to Word</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
