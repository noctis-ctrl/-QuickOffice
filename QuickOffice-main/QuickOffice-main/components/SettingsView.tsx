
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  User, 
  Bell, 
  Volume2, 
  Database, 
  ChevronRight, 
  Trash2, 
  Save,
  Shield,
  HelpCircle,
  Smartphone,
  Info,
  Moon,
  Sun,
  CheckCircle2,
  Languages,
  Type
} from 'lucide-react';
import { UserStats } from '@/types';

const MotionDiv = motion.div as any;

interface SettingsViewProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ stats, setStats, isDarkMode, setIsDarkMode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleResetProgress = () => {
    const freshStats: UserStats = {
      xp: 0,
      streak: 0,
      completedLessons: [],
      currentTool: 'Excel',
      hasTakenPreTest: false
    };
    setStats(freshStats);
    setShowConfirmReset(false);
    alert("Progress has been reset. Fresh start!");
  };

  const SettingRow = ({ icon: Icon, label, description, children }: any) => (
    <div className="flex items-center justify-between py-6 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h4 className="font-black text-gray-800 dark:text-gray-200 text-sm sm:text-base">{label}</h4>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-[10px] sm:text-xs leading-tight mt-0.5">{description}</p>
        </div>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ active, onToggle, icons }: { active: boolean; onToggle: () => void; icons?: { active: React.ReactNode; inactive: React.ReactNode } }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative ${active ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-all flex items-center justify-center overflow-hidden ${active ? 'left-7 sm:left-8' : 'left-1'}`}>
        {icons && (active ? icons.active : icons.inactive)}
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 pb-32">
      <div className="space-y-4 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">
          <Settings className="w-3.5 h-3.5" /> Preferences
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Application Preferences */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm"
        >
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Smartphone className="w-3 h-3" /> App Experience
          </h3>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            <SettingRow 
              icon={isDarkMode ? Moon : Sun} 
              label="Appearance" 
              description="Switch between light and dark themes."
            >
              <Toggle 
                active={isDarkMode} 
                onToggle={() => setIsDarkMode(!isDarkMode)} 
                icons={{ 
                  active: <Moon className="w-2.5 h-2.5 text-gray-800" />, 
                  inactive: <Sun className="w-2.5 h-2.5 text-yellow-500" /> 
                }}
              />
            </SettingRow>
            <SettingRow 
              icon={Volume2} 
              label="Sound Effects" 
              description="Play fun sounds during lessons and for feedback."
            >
              <Toggle active={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
            </SettingRow>
            <SettingRow 
              icon={Bell} 
              label="Daily Reminders" 
              description="Keep your streak alive with gentle push notifications."
            >
              <Toggle active={remindersEnabled} onToggle={() => setRemindersEnabled(!remindersEnabled)} />
            </SettingRow>
          </div>
        </MotionDiv>

        {/* Privacy & Security */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm"
        >
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Shield className="w-3 h-3" /> Privacy & Security
          </h3>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            <SettingRow 
              icon={User} 
              label="Public Profile" 
              description="Allow other users to see your progress and badges."
            >
              <Toggle active={true} onToggle={() => {}} />
            </SettingRow>
            <SettingRow 
              icon={Bell} 
              label="Marketing Emails" 
              description="Receive updates about new features and tutorials."
            >
              <Toggle active={false} onToggle={() => {}} />
            </SettingRow>
          </div>
        </MotionDiv>

        {/* Data & Storage */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm"
        >
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Database className="w-3 h-3" /> Data & Storage
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-100 dark:border-red-900/30">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-red-800 dark:text-red-300">Danger Zone</h4>
                    <p className="text-red-600 dark:text-red-400 font-bold text-xs">Permanently erase your training history.</p>
                  </div>
               </div>
               
               {!showConfirmReset ? (
                 <button 
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all"
                 >
                   Reset My Progress
                 </button>
               ) : (
                 <div className="flex flex-col sm:flex-row gap-3">
                   <button 
                    onClick={handleResetProgress}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_0_#b91c1c]"
                   >
                     Yes, Reset Everything
                   </button>
                   <button 
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-black text-xs uppercase tracking-widest"
                   >
                     Cancel
                   </button>
                 </div>
               )}
            </div>
          </div>
        </MotionDiv>

        {/* About / Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-8 text-gray-400 dark:text-gray-600 gap-4">
          <div className="flex items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Help Hub</span>
          </div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60">QuickOffice v2.5.0</p>
        </div>
      </div>
    </div>
  );
};
