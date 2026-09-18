'use client';
import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';

export default function UploadMaterialsPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploaded(false);
    if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploaded(false);
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    // Cloudinary upload will be wired here when SDK is ready
    await new Promise(r => setTimeout(r, 1200)); // Simulated delay
    setUploading(false);
    setUploaded(true);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden mt-4">
      
      {/* Left panel: Full-bleed classroom illustration */}
      <div className="hidden lg:block lg:w-5/12 relative overflow-hidden">
        <img 
          src="/images/classroom_upload.png" 
          alt="Teacher in classroom" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 via-orange-900/20 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-10">
          <h2 className="text-3xl font-extrabold text-white font-heading mb-3 leading-tight">Build Your Classroom Library</h2>
          <p className="text-sm font-medium text-orange-100 leading-relaxed max-w-xs">
            Upload worksheets, reading passages, or syllabus PDFs. They're instantly made available as smart-learning assets for your students.
          </p>
        </div>
      </div>

      {/* Right panel: Upload Area */}
      <div className="flex-1 flex flex-col p-8 md:p-16 justify-center">
        <div className="max-w-xl mx-auto w-full">

          <h1 className="text-3xl font-extrabold text-zinc-900 font-heading mb-2">Upload Materials</h1>
          <p className="text-zinc-500 font-medium mb-10">Drop or select a file below to add it to your library.</p>

          {/* Drag-and-Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all
              ${dragActive ? 'border-orange-400 bg-orange-50 scale-[1.01]' : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploaded ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Uploaded Successfully!</h3>
                <p className="text-sm text-zinc-500 mb-6 text-center">{selectedFile?.name} has been added to your library.</p>
                <button
                  onClick={() => { setSelectedFile(null); setUploaded(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-zinc-600 bg-zinc-200 hover:bg-zinc-300 transition-colors"
                >
                  Upload Another
                </button>
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 text-center mb-1">{selectedFile.name}</h3>
                <p className="text-sm text-zinc-500 mb-6 text-center">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFile(null)}
                    disabled={uploading}
                    className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 bg-zinc-200 hover:bg-zinc-300 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-zinc-900 hover:bg-black transition-colors shadow-md flex items-center gap-2 disabled:opacity-70"
                  >
                    {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : 'Upload to Library'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-200 mb-6">
                  <UploadCloud className="w-9 h-9 text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Drag and drop your file here</h3>
                <p className="text-sm text-zinc-500 mb-6 text-center max-w-sm">Supports PDF, DOCX, TXT, and JPG/PNG — up to 50 MB.</p>
                <label className="cursor-pointer px-6 py-3 bg-white border border-zinc-200 rounded-xl font-bold text-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  Browse Files
                  <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
