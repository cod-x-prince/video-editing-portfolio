import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertCircle, Check, AlertTriangle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Commercial');
  const [publish, setPublish] = useState(false);

  // 1. Memory Leak Fix: Revoke ObjectURL when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 2. State Reset: Clear form when opening the modal
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreviewUrl(null);
      setCompleted(false);
      setProgress(0);
      setTitle('');
      setError(null);
      setUploading(false);
    }
  }, [isOpen]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      // 3. Flicker Fix: Ensure we are actually leaving the container, not just entering a child
      if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
      }
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    setError(null);
    // Check type
    if (!file.type.startsWith('video/')) {
      setError('Invalid file type. Only video files are allowed.');
      return false;
    }
    // Check size (150MB limit)
    const MAX_SIZE = 150 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(`File too large. Max size is ${MAX_SIZE / (1024 * 1024)}MB.`);
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const selectedFile = e.target.files[0];
       if (validateFile(selectedFile)) {
         setFile(selectedFile);
         setPreviewUrl(URL.createObjectURL(selectedFile));
       }
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);

    // Simulate upload progress (Placeholder for Step 3: Presigned URL logic)
    let currProgress = 0;
    const interval = setInterval(() => {
      currProgress += Math.random() * 10;
      if (currProgress >= 100) {
        currProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setCompleted(true);
          setUploading(false);
        }, 500);
      }
      setProgress(currProgress);
    }, 200);
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null); // useEffect handles revocation
    setCompleted(false);
    setProgress(0);
    setTitle('');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left: Preview / Dropzone */}
          <div className="w-full md:w-5/12 bg-black flex items-center justify-center border-r border-neutral-800 relative min-h-[300px] md:min-h-full">
            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video 
                  src={previewUrl} 
                  className="max-h-full max-w-full object-contain aspect-[9/16]" 
                  controls 
                  playsInline 
                />
                <button 
                  onClick={reset}
                  className="absolute bottom-4 left-4 text-xs text-red-400 hover:text-red-300 underline"
                >
                  Remove Video
                </button>
              </div>
            ) : (
              <div 
                className={`w-full h-full flex flex-col items-center justify-center p-8 transition-colors ${dragActive ? 'bg-neutral-800/50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                  <Upload className="text-neutral-400" size={24} />
                </div>
                <p className="text-neutral-300 font-medium mb-2 text-center">Drag & Drop Reel</p>
                <p className="text-neutral-500 text-sm mb-6 text-center">9:16 Vertical Video (MP4/WebM)</p>
                <label className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full cursor-pointer hover:bg-neutral-200 transition-colors">
                  Browse Files
                  <input type="file" className="hidden" accept="video/*" onChange={handleChange} />
                </label>
              </div>
            )}
          </div>

          {/* Right: Form / Progress */}
          <div className="w-full md:w-7/12 p-8 flex flex-col relative">
            <div className="mb-6">
              <h2 className="text-2xl font-syne font-bold text-white mb-2">Upload Reel</h2>
              <p className="text-sm text-neutral-400">Add a new vertical video to your portfolio.</p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={18} />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {completed ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Complete</h3>
                <p className="text-neutral-400 mb-6">Your reel has been transcoded and is ready.</p>
                <button onClick={onClose} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors">
                  Done
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6">
                 {/* Title Input */}
                 <div>
                   <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Project Title</label>
                   <input 
                     type="text" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="e.g. Nike Summer Campaign"
                     className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                   />
                 </div>

                 {/* Tags */}
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Category</label>
                    <select 
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                    >
                      <option>Commercial</option>
                      <option>Narrative</option>
                      <option>Music Video</option>
                      <option>Social Media</option>
                    </select>
                 </div>

                 {/* Settings */}
                 <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={18} className="text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-white">Publish Immediately</p>
                        <p className="text-xs text-neutral-500">Make visible on portfolio upon completion</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPublish(!publish)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${publish ? 'bg-orange-500' : 'bg-neutral-700'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${publish ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 {/* Progress Bar (Visible during upload) */}
                 {uploading && (
                   <div className="mt-auto">
                     <div className="flex justify-between text-xs text-neutral-400 mb-2">
                       <span>Uploading & Transcoding...</span>
                       <span>{Math.round(progress)}%</span>
                     </div>
                     <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-orange-500"
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         transition={{ ease: "linear" }}
                       />
                     </div>
                   </div>
                 )}

                 {/* Action Buttons */}
                 {!uploading && (
                    <div className="mt-auto pt-4 flex gap-4">
                      <button onClick={onClose} className="flex-1 px-4 py-3 bg-transparent border border-neutral-700 text-neutral-300 font-bold rounded-lg hover:text-white hover:border-neutral-500 transition-colors">
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpload}
                        disabled={!file || !title}
                        className={`flex-1 px-4 py-3 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${(!file || !title) ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-white text-black hover:bg-neutral-200'}`}
                      >
                        <Upload size={18} />
                        Upload Reel
                      </button>
                    </div>
                 )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
