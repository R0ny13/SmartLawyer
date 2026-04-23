/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileUp, GitCompare, ChevronRight, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ComparisonResult } from '../types';

const COMPARISON_DATA: ComparisonResult[] = [
  {
    title: 'Liability Cap',
    contract1Value: '$500,000 Total',
    contract2Value: '$1,000,000 Total',
    difference: 'Contract B offers 2x higher protection.',
    riskImpact: 'improved'
  },
  {
    title: 'Payment Terms',
    contract1Value: 'Net 30',
    contract2Value: 'Net 90',
    difference: 'Contract B delays payment by 60 additional days.',
    riskImpact: 'declined'
  },
  {
    title: 'Termination for Convenience',
    contract1Value: '30 Days Notice',
    contract2Value: 'Not Permitted',
    difference: 'Contract B locks you in for the full duration.',
    riskImpact: 'declined'
  }
];

export default function Compare() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 h-full overflow-y-auto">
      <div className="text-center mb-16">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="label-caps mb-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
        >
          <Info size={14} />
          Delta Verification Preview
        </motion.div>
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white tracking-tight">Compare Contracts</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Upload two documents to see visual differences and compliance shifts side-by-side.</p>
      </div>

      {/* Comparison Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group hover:border-primary transition-all shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-primary transition-colors">
              <FileUp size={32} />
            </div>
            <h3 className="font-bold text-xl mb-1">Contract {i === 1 ? 'A' : 'B'}</h3>
            <p className="text-xs uppercase font-black text-slate-400 mb-8 tracking-widest leading-none">Draft #12-B</p>
            <button className="px-8 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              Select Document
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mb-20">
        <button className="bg-primary hover:bg-primary-dark text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs inline-flex items-center gap-3 shadow-2xl shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0">
          <GitCompare size={20} />
          Run Delta Analysis
        </button>
      </div>

      {/* Mock Comparison Results */}
      <div className="space-y-8">
        <h2 className="label-caps px-2">Differential Dashboard</h2>
        <div className="grid grid-cols-1 gap-6">
          {COMPARISON_DATA.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-white p-8 overflow-hidden relative group hover:border-primary/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    {item.riskImpact === 'improved' ? (
                      <span className="text-[10px] bg-green-50 text-green-700 font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 tracking-widest">
                        <CheckCircle2 size={12} /> Optimization
                      </span>
                    ) : item.riskImpact === 'declined' ? (
                      <span className="text-[10px] bg-red-50 text-red-700 font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 tracking-widest">
                        <AlertTriangle size={12} /> Regression
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-white dark:group-hover:bg-slate-700">
                      <span className="label-caps block mb-2 opacity-70">Contract A</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-relaxed">{item.contract1Value}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-white dark:group-hover:bg-slate-700">
                      <span className="label-caps block mb-2 opacity-70">Contract B</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-relaxed">{item.contract2Value}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:w-72 bg-blue-50/50 dark:bg-primary/5 rounded-2xl p-6 flex flex-col justify-center border border-blue-100 dark:border-primary/10">
                  <span className="label-caps text-primary mb-3 block opacity-80">AI Insight</span>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">
                    "{item.difference}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

