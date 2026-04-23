/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  File, 
  X, 
  Loader2, 
  FileText, 
  ImageIcon, 
  Shield, 
  HelpCircle, 
  BarChart3,
  Zap,
  ChevronRight as ChevronRightIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { analyzeContract } from '../services/aiService';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const result = await analyzeContract(base64Data, file.type, file.name);
        setIsAnalyzing(false);
        navigate(`/analysis/${result.id}`, { state: { contract: result } });
      };
      reader.onerror = (error) => {
        console.error("File reading failed:", error);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6"
          >
            <Zap size={12} />
            AI Legal Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-slate-800 dark:text-white tracking-tight"
          >
            Contracts simplified.<br />
            <span className="text-primary italic">Professionally polished.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium"
          >
            Review legal documents in seconds. Our AI highlights risky clauses and translates jargon into plain English.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-300 flex flex-col items-center justify-center min-h-[380px] shadow-2xl shadow-slate-200/50 dark:shadow-none",
            isDragging 
              ? "border-primary bg-primary/5 scale-[1.01]" 
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
            file ? "border-solid" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary shadow-sm">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">
                  Drag and drop your contract
                </h3>
                <p className="text-slate-400 dark:text-slate-500 mb-10 font-medium">
                  Accepts PDF, JPG, or PNG (Max 20MB)
                </p>
                <label className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold cursor-pointer transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0">
                  Choose Files
                  <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileSelect} />
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full max-w-sm p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-5 relative">
                  <button 
                    onClick={() => setFile(null)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-danger shadow-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    {file.type.includes('pdf') ? <FileText size={28} /> : <ImageIcon size={28} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs font-black uppercase text-slate-400 mt-1 tracking-widest">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • READY
                    </p>
                  </div>
                </div>

                <div className="mt-16 flex flex-col gap-4 w-full max-w-xs">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Synthesizing...
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <ChevronRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    Secure • Encrypted • Private
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}


