import React, { useState } from 'react';
import FileUploadZone from '../FileUploadZone';
import { FileCode, ArrowRight } from 'lucide-react';
import { useTools } from '../../hooks/useTools';

export default function WordToPdfTool({ onStartProcess, onProcessFinished, onProcessError }) {
  const [files, setFiles] = useState([]);
  const { wordToPdf } = useTools();

  const handleConvert = async () => {
    if (files.length === 0) return;
    onStartProcess(40, 'Converting Word document (.docx) to PDF format...');
    try {
      const res = await wordToPdf(files[0]);
      onProcessFinished(res.downloadUrl, res.fileName || 'converted_document.pdf', res.message);
    } catch (err) {
      console.error(err);
      onProcessError(err.message || 'Failed to convert Word document to PDF');
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
        acceptedTypes=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        title="Select Word Document (.docx / .doc)"
        subtitle="Convert Microsoft Word documents into standard high-resolution PDF"
        showFileList={true}
      />

      {files.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-300 shadow-md space-y-5">
          <div className="flex items-center space-x-3 bg-rose-50 border border-rose-200 p-4 rounded-xl">
            <FileCode className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Output Format: PDF Document (.pdf)</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">High precision PDF rendering with standard typography and layout.</p>
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Convert Word to PDF</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
