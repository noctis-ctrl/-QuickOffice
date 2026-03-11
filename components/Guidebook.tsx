
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, X, ChevronRight, Info, Search, Zap, ExternalLink, ArrowRight, HelpCircle, CheckCircle, Sparkles, Target, MousePointer2 } from 'lucide-react';
import { OfficeTool } from '@/types';
import { GUIDEBOOK_DATA, TOOLS_CONFIG } from '@/constants';

const MotionDiv = motion.div as any;

interface GuidebookProps {
  isOpen: boolean;
  onClose: () => void;
  tool: OfficeTool;
}

export const Guidebook: React.FC<GuidebookProps> = ({ isOpen, onClose, tool }) => {
  const [activeRibbon, setActiveRibbon] = useState(0);
  const data = (GUIDEBOOK_DATA[tool as keyof typeof GUIDEBOOK_DATA] as any[]) || [];
  const config = TOOLS_CONFIG[tool as keyof typeof TOOLS_CONFIG];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <MotionDiv 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
      >
        <MotionDiv 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[90dvh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col sm:flex-row relative"
        >
          {/* Close Button Mobile */}
          <button onClick={onClose} className="sm:hidden absolute top-6 right-6 z-20 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
             <X size={20} />
          </button>

          {/* Left Sidebar: Navigation */}
          <div className="w-full sm:w-80 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8 sm:mb-12">
               <div className={`w-12 h-12 ${config.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <Book size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Master Guide</h2>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">MS {tool} Reference</p>
               </div>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pr-2">
               {data.map((item, idx) => (
                 <button 
                  key={idx}
                  onClick={() => setActiveRibbon(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all ${
                    activeRibbon === idx 
                      ? `${config.color} text-white shadow-lg` 
                      : 'text-gray-400 dark:text-gray-500 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                 >
                    <div className="flex items-center gap-3">
                       {item.icon}
                       <span>{item.ribbon}</span>
                    </div>
                    {activeRibbon === idx && <ChevronRight size={14} />}
                 </button>
               ))}
            </div>

            <button onClick={onClose} className="hidden sm:flex mt-8 items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors group">
               <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14}/> Back to roadmap
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 relative bg-white dark:bg-gray-950">
             <AnimatePresence mode="wait">
                <MotionDiv
                  key={activeRibbon}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-10"
                >
                   {/* Ribbon Description */}
                   <div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 ${config.lightColor} dark:bg-gray-800 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4`}>
                         <Zap size={14} className="fill-current"/> Study Guide Section
                      </div>
                      <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
                        The {data[activeRibbon].ribbon} <span className={config.color.replace('bg-', 'text-')}>Ribbon</span>
                      </h1>
                      <p className="text-lg sm:text-2xl font-bold text-gray-400 dark:text-gray-500 leading-relaxed">
                        {data[activeRibbon].description}
                      </p>
                   </div>

                   {/* Practical Drills (The basis for Quiz 2) */}
                   {data[activeRibbon].drills && (
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Target className="text-orange-500" size={20} />
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-200">Practical Study Drills</h3>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-100 dark:border-orange-800 rounded-3xl p-6">
                           <p className="text-xs font-bold text-orange-700 dark:text-orange-400 mb-4">Master these patterns for your Practical Skills challenges:</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {data[activeRibbon].drills.map((drill: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-orange-100 dark:border-orange-800">
                                   <MousePointer2 size={14} className="text-orange-400" />
                                   <span className="text-sm font-black text-gray-700 dark:text-gray-200">{drill}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Tools Reference Key (Quiz Answers) */}
                   <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Core Tools List</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {data[activeRibbon].tools.map((toolName: string, tIdx: number) => (
                           <div key={tIdx} className="p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl group hover:border-blue-100 dark:hover:border-blue-900 transition-all flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                 <CheckCircle size={20} />
                              </div>
                              <div>
                                 <h4 className="font-black text-gray-800 dark:text-white text-lg mb-1">{toolName}</h4>
                                 <p className="text-sm font-bold text-gray-400 leading-snug">
                                    Commonly tested on the {data[activeRibbon].ribbon} tab. Master this for {tool} proficiency.
                                 </p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Pro Hack Section */}
                   <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="text-white fill-current" />
                         </div>
                         <h3 className="text-xl font-black uppercase tracking-widest">Efficiency Hack</h3>
                      </div>
                      <p className="text-xl font-bold text-gray-300 leading-relaxed mb-8">
                        The fastest way to search for any tool on the {data[activeRibbon].ribbon} ribbon is to press <span className="text-yellow-400">Alt + Q</span> and type its name directly!
                      </p>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400">
                         <Info size={14}/> Pro knowledge verified for MS Office 2024
                      </div>
                   </div>
                </MotionDiv>
             </AnimatePresence>
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};
