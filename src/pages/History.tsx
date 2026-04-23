/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  ChevronRight, 
  Calendar, 
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_CONTRACTS } from '../constants';
import { cn } from '../lib/utils';

const statusConfig = {
  safe: { color: 'text-success', bg: 'bg-green-50', dot: 'bg-green-500', label: 'Standard' },
  caution: { color: 'text-warning', bg: 'bg-yellow-50', dot: 'bg-yellow-500', label: 'Caution' },
  risky: { color: 'text-danger', bg: 'bg-red-50', dot: 'bg-red-500', label: 'Risky' }
};

export default function History() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="label-caps mb-2"
            >
              Archive
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">Contract History</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary transition-all w-full md:w-72 text-sm font-medium"
              />
            </div>
            <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_CONTRACTS.map((contract, i) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={`/analysis/${contract.id}`}
                className="group flex flex-col md:flex-row items-center gap-4 md:gap-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shrink-0">
                  <FileText size={24} />
                </div>

                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">
                      {contract.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar size={12} />
                      {contract.uploadDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <HardDrive size={12} />
                      {contract.fileSize}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 pl-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex flex-col items-start md:items-end">
                    <div className={cn(
                      "px-3 py-0.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                      statusConfig[contract.overallStatus].bg,
                      statusConfig[contract.overallStatus].color
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", statusConfig[contract.overallStatus].dot)} />
                      {statusConfig[contract.overallStatus].label}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-black mt-1.5 tracking-tight">
                      Compliance: <span className="text-slate-700 dark:text-slate-300">{contract.overallScore}%</span>
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


function StatusIcon({ riskLevel, size }: { riskLevel: 'safe' | 'caution' | 'risky', size: number }) {
  if (riskLevel === 'safe') return <CheckCircle2 size={size} />;
  if (riskLevel === 'caution') return <AlertTriangle size={size} />;
  return <AlertCircle size={size} />;
}
