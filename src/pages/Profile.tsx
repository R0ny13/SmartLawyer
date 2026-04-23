/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut, 
  Moon, 
  Sun,
  Camera,
  Trash2,
  Mail,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Profile({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (v: boolean) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-4">
            <div className="card-white p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 relative overflow-hidden border-2 border-primary/20">
                  <User size={48} />
                </div>
                <button className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-90">
                  <Camera size={14} />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Alex Sterling</h2>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Premium Advocate</p>
              <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all uppercase tracking-widest">
                Edit Account
              </button>
            </div>

            <nav className="card-white overflow-hidden p-2">
              {[
                { icon: User, label: 'Profile Settings', active: true },
                { icon: Shield, label: 'Security & Access', active: false },
                { icon: Bell, label: 'Alert Center', active: false },
                { icon: CreditCard, label: 'Subscription Plan', active: false }
              ].map((item, i) => (
                <button 
                  key={i}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                    item.active 
                      ? "bg-slate-50 dark:bg-slate-800 border-l-4 border-primary text-primary font-bold shadow-sm shadow-slate-100/50 dark:shadow-none" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.active && <ChevronRight size={14} />}
                </button>
              ))}
            </nav>
            
            <button className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-danger rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all shadow-sm">
              <LogOut size={16} />
              Termination (Sign Out)
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section>
              <h3 className="label-caps mb-6 px-1">Global Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-white p-6 flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                      {darkMode ? <Moon size={22} /> : <Sun size={22} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">Terminal Illumination</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight mt-1">{darkMode ? 'Dark Engine Active' : 'Light Engine Active'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      darkMode ? "bg-primary" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: darkMode ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="card-white p-6 flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                      <Mail size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">Insight Notifications</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight mt-1">E-mail summaries</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary relative">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h3 className="label-caps mb-6 px-1">Identity & Communications</h3>
              <div className="card-white p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="label-caps text-slate-400 mb-2 block">Advocate Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Sterling" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label-caps text-slate-400 mb-2 block">Direct E-mail Registry</label>
                    <input 
                      type="email" 
                      defaultValue="alex.sterling@vanguard.legal" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button className="flex items-center gap-2 text-xs font-black uppercase text-danger hover:underline tracking-widest">
                    <Trash2 size={14} />
                    Purge Data Repository
                  </button>
                  <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/25 transition-all">
                    Commit Changes
                  </button>
                </div>
              </div>
            </section>

            {/* Integration Status (Unique professional touch) */}
            <section className="bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative border border-slate-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 font-bold">
                 <div className="flex-1">
                   <h4 className="text-xl mb-2 text-white">Advanced Delta Engine</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-6 italic opacity-80">
                     Leveraging state-of-the-art legal transformers to parse and decode contract hierarchies with 99.4% syntax precision.
                   </p>
                   <div className="flex flex-wrap gap-3">
                     <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-widest">Neural Parse v2.1</span>
                     <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-widest">TLS 1.3 Encryption</span>
                   </div>
                 </div>
                 <div className="md:w-32 h-32 flex items-center justify-center">
                   <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                   <div className="absolute flex items-center justify-center">
                      <span className="text-primary text-xl font-black">99%</span>
                   </div>
                 </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

