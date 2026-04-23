/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle,
  FileText,
  ChevronDown,
  Info,
  ShieldCheck,
  Zap,
  MessageSquare,
  Share2,
  Download,
  Layers,
  Send,
  Loader2,
  Languages,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_CONTRACTS } from '../constants';
import { cn } from '../lib/utils';
import { RiskLevel, ContractRecord } from '../types';
import { askQuestion, translateContractSections } from '../services/aiService';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' }
];

const statusConfig = {
  safe: { color: 'text-success', bg: 'bg-green-50', border: 'border-green-100', dot: 'bg-green-500', label: 'Standard' },
  caution: { color: 'text-warning', bg: 'bg-yellow-50', border: 'border-yellow-100', dot: 'bg-yellow-500', label: 'Caution' },
  risky: { color: 'text-danger', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500', label: 'Risky' }
};

export default function Analysis() {
  const { id } = useParams();
  const location = useLocation();
  const stateContract = location.state?.contract as ContractRecord | undefined;
  
  const contract = stateContract || MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
  const [activeSectionId, setActiveSectionId] = useState(contract.sections[0].id);
  const [userQuery, setUserQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<{question: string, answer: string}[]>([]);
  
  // Translation state
  const [selectedLang, setSelectedLang] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedCache, setTranslatedCache] = useState<Record<string, { original: string, simplified: string }>>({});

  const activeSection = contract.sections.find(s => s.id === activeSectionId) || contract.sections[0];

  // Bulk Translation effect
  React.useEffect(() => {
    async function performBulkTranslation() {
      if (selectedLang === 'English') return;
      
      // Check if we already have some sections for this language
      const needsTranslation = contract.sections.some(s => !translatedCache[`${s.id}-${selectedLang}`]);
      if (!needsTranslation) return;

      setIsTranslating(true);
      try {
        const results = await translateContractSections(contract.sections, selectedLang);
        
        const newCache: Record<string, { original: string, simplified: string }> = {};
        Object.entries(results).forEach(([id, data]) => {
          newCache[`${id}-${selectedLang}`] = data;
        });

        setTranslatedCache(prev => ({
          ...prev,
          ...newCache
        }));
      } catch (err) {
        console.error("Bulk translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    }

    performBulkTranslation();
  }, [selectedLang, contract.id]);

  const displayOriginal = (selectedLang !== 'English' && translatedCache[`${activeSection.id}-${selectedLang}`]) 
    ? translatedCache[`${activeSection.id}-${selectedLang}`].original 
    : activeSection.originalText;
    
  const displaySimplified = (selectedLang !== 'English' && translatedCache[`${activeSection.id}-${selectedLang}`]) 
    ? translatedCache[`${activeSection.id}-${selectedLang}`].simplified 
    : activeSection.simplifiedText;

  const handleAskQuestion = async (q?: string) => {
    const question = q || userQuery;
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    if (!q) setUserQuery('');

    const answer = await askQuestion(contract, question);
    setQaHistory(prev => [...prev, { question, answer }]);
    setIsAsking(false);

    // Scroll to bottom of QA
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  };

  return (
    <div className="flex-1 min-h-0 bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Sub-header / Score Bar */}
      <div className="bg-white dark:bg-slate-900 px-8 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-6">
          <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mr-2">
            <ArrowLeft size={18} className="text-slate-500" />
          </Link>
          <div>
            <h2 className="label-caps mb-1">Current Document</h2>
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">{contract.name}</p>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex items-center space-x-4">
            <span className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-full uppercase",
              statusConfig[contract.overallStatus].bg,
              statusConfig[contract.overallStatus].color
            )}>
              {statusConfig[contract.overallStatus].label}
            </span>
            <div className="w-32 md:w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${contract.overallScore}%` }}
                className={cn(
                  "h-full transition-all duration-1000",
                  contract.overallStatus === 'safe' ? 'bg-success' : 
                  contract.overallStatus === 'caution' ? 'bg-warning' : 'bg-danger'
                )}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{contract.overallScore}/100</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-primary transition-all">
              <Globe size={14} className="text-primary" />
              <span>{selectedLang}</span>
              <ChevronDown size={14} />
              {isTranslating && <Loader2 size={10} className="animate-spin ml-1 text-primary" />}
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.name)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    selectedLang === lang.name 
                      ? "bg-primary/10 text-primary font-bold" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic hidden xl:block">
            Analysis shows {contract.sections.filter(s => s.riskLevel === 'risky').length} risky clauses and {contract.sections.filter(s => s.riskLevel === 'caution').length} caution areas.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar: Sections */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto min-h-0">
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <h3 className="label-caps">Contract Sections</h3>
          </div>
          <nav className="p-2 space-y-1">
            {contract.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={cn(
                  "w-full p-3 text-sm flex justify-between items-center transition-all rounded",
                  activeSectionId === section.id 
                    ? "bg-slate-50 dark:bg-slate-800 border-l-4 border-primary font-bold text-primary" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                )}
              >
                <span>{section.title}</span>
                <span className={cn("w-2 h-2 rounded-full mt-0.5", statusConfig[section.riskLevel].dot)}></span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Center Panel: Simplified Explanation */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col space-y-6 overflow-y-auto min-h-0">
          <div className="card-white overflow-hidden shrink-0">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
              <h4 className="label-caps">Original Text</h4>
            </div>
            <div className="p-6 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeSection.id}-${selectedLang}-${isTranslating}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className={cn(
                    "text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic font-mono",
                    isTranslating && "animate-pulse"
                  )}>
                    "{displayOriginal}"
                  </p>
                </motion.div>
              </AnimatePresence>
              {isTranslating && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center backdrop-blur-[1px] rounded-b-xl">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Loader2 size={12} className="animate-spin" />
                    Translating Legalese...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-primary-light dark:border-primary/20 shadow-md flex-1 flex flex-col overflow-hidden">
            <div className="p-4 bg-primary-light dark:bg-primary/10 border-b border-primary-light dark:border-primary/20 flex items-center justify-between shrink-0">
              <h4 className="text-xs font-bold text-primary dark:text-primary uppercase tracking-widest">SmartLawyer Insight</h4>
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-black tracking-widest">AI GENERATED</span>
            </div>
            <div className="p-8 flex-1 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={`${activeSection.id}-${selectedLang}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "text-xl md:text-2xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed",
                    isTranslating && "opacity-20 transition-opacity"
                  )}
                >
                  {displaySimplified}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Right Panel: Risk Indicators & Questions */}
        <aside className="hidden xl:flex w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col min-h-0">
          <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0" id="chat-container">
            <div>
              <h3 className="label-caps mb-4">Risk Analysis</h3>
              <div className="space-y-4">
                {activeSection.riskExplanation ? (
                  <div className={cn(
                    "p-4 border rounded-lg",
                    statusConfig[activeSection.riskLevel].bg, 
                    statusConfig[activeSection.riskLevel].border,
                    statusConfig[activeSection.riskLevel].color
                  )}>
                    <div className="flex items-center space-x-2 mb-2 font-bold text-xs uppercase tracking-tight">
                      {activeSection.riskLevel === 'risky' ? <AlertCircle size={14} /> : <AlertTriangle size={14} />}
                      <span>{activeSection.riskLevel === 'risky' ? 'Highly Risky Clause' : 'Caution Advised'}</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {activeSection.riskExplanation}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-lg text-green-700 dark:text-green-400">
                    <div className="flex items-center space-x-2 mb-2 font-bold text-xs uppercase tracking-tight">
                      <CheckCircle2 size={14} />
                      <span>Safe Clause</span>
                    </div>
                    <p className="text-xs font-medium">This clause follows industry standards and poses no immediate risk to you.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="label-caps mb-4">Intelligence Archive</h3>
              <AnimatePresence>
                {qaHistory.map((qa, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className="mb-4 bg-slate-50 dark:bg-slate-800 rounded-lg p-3"
                  >
                    <p className="text-[11px] font-bold text-primary mb-1 uppercase tracking-tight">Question</p>
                    <p className="text-xs text-slate-800 dark:text-white font-medium mb-3">{qa.question}</p>
                    <p className="text-[11px] font-bold text-success mb-1 uppercase tracking-tight">AI Insight</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">{qa.answer}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isAsking && (
                <div className="flex items-center gap-2 text-slate-400 italic text-[11px] font-medium py-2">
                  <Loader2 size={12} className="animate-spin" />
                  Processing query...
                </div>
              )}

              <h3 className="label-caps mb-3 mt-4">Suggested Queries</h3>
              <div className="space-y-2">
                {contract.suggestedQuestions.map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAskQuestion(q)}
                    disabled={isAsking}
                    className="w-full text-left p-3 text-[11px] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:text-primary dark:hover:text-primary transition-all font-medium leading-normal disabled:opacity-50"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="relative">
              <input 
                type="text" 
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Ask a custom question..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
              />
              <button 
                onClick={() => handleAskQuestion()}
                disabled={!userQuery.trim() || isAsking}
                className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {isAsking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

