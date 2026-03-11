
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Trophy, Target, TrendingUp, Cpu, Timer, Info } from 'lucide-react';
import { UserStats } from '@/types';

const MotionDiv = motion.div as any;

interface LearnSidePanelProps {
  stats: UserStats;
}

export const LearnSidePanel: React.FC<LearnSidePanelProps> = ({ stats }) => {
  const [timeLeft, setTimeLeft] = useState('');

  // Daily reset timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(interval);
  }, []);

  const leaderboard = [
    { name: 'OfficeBot Alpha', xp: 1450, avatar: '🤖', isBot: true },
    { name: 'PivotSage', xp: 1120, avatar: '⚡', isBot: true },
    { name: 'SlideMaster AI', xp: 950, avatar: '✨', isBot: true },
    { name: 'You', xp: stats.xp, avatar: '👤', isUser: true },
    { name: 'MacroBot v2', xp: 480, avatar: '🦾', isBot: true },
  ].sort((a, b) => b.xp - a.xp);

  const questProgress = stats.xp % 50;
  const progressPercent = (questProgress / 50) * 100;

  return (
    <div className="hidden xl:flex flex-col gap-6 w-80 sticky top-10 pb-10">
      {/* Stats Summary Card */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border-b-4 border-orange-100 dark:border-orange-900/40">
            <Flame className="w-6 h-6 text-orange-500 fill-current" />
            <div>
              <p className="text-lg font-black text-orange-600 dark:text-orange-400 leading-none">{stats.streak}</p>
              <p className="text-[10px] font-black text-orange-400 dark:text-orange-600 uppercase tracking-widest">Streak</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border-b-4 border-blue-100 dark:border-blue-900/40">
            <Sparkles className="w-6 h-6 text-blue-500 fill-current" />
            <div>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 leading-none">{stats.xp}</p>
              <p className="text-[10px] font-black text-blue-400 dark:text-blue-600 uppercase tracking-widest">Total XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quest Card */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
             <h3 className="font-black text-gray-800 dark:text-white uppercase text-xs tracking-widest">Daily Quest</h3>
             <div className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 mt-0.5">
                <Timer className="w-3 h-3" />
                <span className="text-[9px] font-black font-mono">Resets in {timeLeft}</span>
             </div>
          </div>
          <Target className="w-4 h-4 text-gray-300 dark:text-gray-600" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#ca8a04] shrink-0">
             <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
             <div className="flex justify-between mb-1">
                <p className="text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase">Earn 50 XP</p>
                <p className="text-[11px] font-black text-gray-400">{questProgress}/50</p>
             </div>
             <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700">
                <MotionDiv 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-yellow-400"
                />
             </div>
          </div>
        </div>
      </div>

      {/* Weekly League */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-gray-800 dark:text-white uppercase text-xs tracking-widest">Weekly League</h3>
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </div>
        <div className="space-y-3">
          {leaderboard.map((item, idx) => (
            <div 
              key={item.name} 
              className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                item.isUser ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-100 dark:ring-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <span className={`w-5 text-xs font-black text-center ${
                idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-300 dark:text-gray-600'
              }`}>
                {idx + 1}
              </span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                item.isUser ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
              }`}>
                {item.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-black truncate ${item.isUser ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {item.name}
                  </p>
                  {item.isBot && (
                    <span className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[8px] font-black rounded uppercase tracking-tighter">
                      BOT
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">{item.xp} XP</p>
              </div>
              {idx === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
             <Cpu className="w-4 h-4" />
             <p className="text-[10px] font-black uppercase tracking-wider">Practice Mode Active</p>
          </div>
        </div>
      </div>

      {/* XP Guide Note */}
      <div className="bg-blue-600 dark:bg-blue-500 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Sparkles size={60} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
             <Info size={16} className="text-blue-200" />
             <h3 className="text-xs font-black uppercase tracking-widest">How to earn XP?</h3>
          </div>
          <p className="text-xs font-bold text-blue-100 leading-relaxed">
            Complete lessons on your roadmap to earn XP. Each lesson has multiple phases: Concept Mastery, Theory Checkpoint, and Step-by-Step Skills. Finishing all phases grants you the full XP reward!
          </p>
        </div>
      </div>
    </div>
  );
};
