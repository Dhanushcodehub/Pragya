'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, UploadCloud, FileText, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface UploadedItem {
  id: string;
  name: string;
  size: string;
  timestamp: string;
}

export default function UploadMaterialsPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pragya_uploaded_materials');
      if (saved) setUploadedItems(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading uploaded materials:', e);
    }
  }, []);

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
    setUploadProgress(0);
    if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploaded(false);
    setUploadProgress(0);
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(20);

    try {
      await new Promise(r => setTimeout(r, 250));
      setUploadProgress(55);
      await new Promise(r => setTimeout(r, 300));
      setUploadProgress(85);
      await new Promise(r => setTimeout(r, 250));
      setUploadProgress(100);

      const newItem: UploadedItem = {
        id: Date.now().toString(),
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        timestamp: 'Just now',
      };

      const updated = [newItem, ...uploadedItems];
      setUploadedItems(updated);
      localStorage.setItem('pragya_uploaded_materials', JSON.stringify(updated));

      setUploading(false);
      setUploaded(true);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploading(false);
    }
  };

  const removeItem = (id: string) => {
    const updated = uploadedItems.filter(item => item.id !== id);
    setUploadedItems(updated);
    localStorage.setItem('pragya_uploaded_materials', JSON.stringify(updated));
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-sm p-4 sm:p-6 lg:p-7 flex flex-col lg:flex-row gap-6 lg:gap-8">
      
      {/* Left Column: Peach container with 2 white cards */}
      <div className="w-full lg:w-[420px] bg-[#fff5ea] rounded-[2rem] p-6 flex flex-col gap-6 shrink-0">
        
        {/* Top White Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-xs border border-orange-100/60"
        >
          <h2 className="text-xl font-extrabold text-[#3a2010] font-heading mb-2.5 tracking-tight flex items-center gap-2">
            Build Your Library
          </h2>
          <p className="text-xs font-medium text-orange-950/70 leading-relaxed">
            Upload class worksheets, reading passages, or syllabus PDFs. They're instantly converted into personalized smart-learning assets for your classroom.
          </p>
        </motion.div>

        {/* Bottom White Card with Lucid Interactive Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-3.5 shadow-xs border border-orange-100/60 flex-1 min-h-[280px] flex items-center justify-center relative overflow-hidden group cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full h-full relative rounded-xl overflow-hidden shadow-xs"
          >
            <img 
              src="/images/classroom_upload.png" 
              alt="Classroom students" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Interactive Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/60 shadow-lg flex items-center justify-between text-xs font-bold text-zinc-900 pointer-events-none"
            >
              <span className="flex items-center gap-1.5 text-orange-950 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Active Classroom Intelligence
              </span>
              <span className="text-[10px] text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full font-bold">Smart AI</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column: Upload Area */}
      <div className="flex-1 flex flex-col justify-between py-2 px-2 lg:px-4">
        <div>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-extrabold text-zinc-900 font-heading tracking-tight mb-1.5">
              Upload Materials
            </h1>
            <p className="text-sm font-medium text-zinc-500 mb-8">
              Select or drop a file directly below to begin processing it for your students.
            </p>
          </motion.div>

          {/* Drag & Drop Zone */}
          <motion.div
            layout
            className={`relative border-2 border-dashed rounded-3xl p-10 lg:p-14 flex flex-col items-center justify-center transition-all bg-white
              ${dragActive ? 'border-emerald-400 bg-emerald-50/30 scale-[1.01]' : 'border-zinc-200/90 hover:border-zinc-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploaded ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600 shadow-xs">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1">Uploaded to Library!</h3>
                <p className="text-xs text-zinc-500 mb-5 text-center font-medium">
                  {selectedFile?.name} is ready and indexed for student practice.
                </p>
                <button
                  onClick={() => { setSelectedFile(null); setUploaded(false); setUploadProgress(0); }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors shadow-2xs hover:scale-105 active:scale-95"
                >
                  Upload Another File
                </button>
              </motion.div>
            ) : selectedFile ? (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-full max-w-sm"
              >
                <div className="w-12 h-12 bg-[#dcfce7] rounded-full flex items-center justify-center mb-3.5 text-emerald-600">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 text-center mb-1 truncate max-w-xs">
                  {selectedFile.name}
                </h3>
                <p className="text-xs text-zinc-400 font-medium mb-4 text-center">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
                </p>

                {uploading && (
                  <div className="w-full bg-zinc-100 h-2 rounded-full mb-6 overflow-hidden relative">
                    <motion.div 
                      className="bg-emerald-500 h-full rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedFile(null); setUploadProgress(0); }}
                    disabled={uploading}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-50 hover:scale-105 active:scale-95"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#18181b] hover:bg-black transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 hover:scale-105 active:scale-95"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading {uploadProgress}%
                      </>
                    ) : (
                      'Upload to Library'
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 border border-emerald-100/60">
                  <UploadCloud className="w-7 h-7 stroke-[1.75]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1">
                  Select or drop a file here
                </h3>
                <p className="text-xs text-zinc-400 font-medium mb-6 text-center max-w-xs">
                  Supports PDF, DOCX, TXT, and JPG/PNG up to 50 MB.
                </p>
                <label className="cursor-pointer px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-semibold text-xs shadow-sm hover:bg-black transition-all hover:scale-105 active:scale-95">
                  Browse Files
                  <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
                </label>
              </div>
            )}
          </motion.div>

          {/* Recent Uploaded Materials List */}
          {uploadedItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Recently Added to Library ({uploadedItems.length})
              </h4>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {uploadedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 hover:bg-zinc-100/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-orange-100/80 rounded-lg flex items-center justify-center text-orange-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{item.size} • {item.timestamp}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
