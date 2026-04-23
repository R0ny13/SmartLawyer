/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  FileUp, 
  History, 
  Layers, 
  User, 
  Settings, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Shield,
  HelpCircle,
  BarChart3,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import HistoryPage from './pages/History';
import Compare from './pages/Compare';
import Profile from './pages/Profile';

function Navbar({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (v: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Analyze', path: '/', icon: FileUp },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass h-16 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
            SmartLawyer<span className="text-primary italic">AI</span>
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold transition-all relative pb-1",
              location.pathname === item.path 
                ? "text-primary border-b-2 border-primary" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            )}
          >
            {item.name}
          </Link>
        ))}
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-500" />}
        </button>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 md:hidden shadow-xl shadow-slate-200/50"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="h-10 bg-slate-800 flex items-center px-4 md:px-8 justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
      <div className="flex items-center space-x-6">
        <span>Session: <span className="text-slate-300">Active</span></span>
        <span className="hidden sm:inline">Model: <span className="text-slate-300">Legal-AI-v2.1</span></span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span>All systems operational</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


