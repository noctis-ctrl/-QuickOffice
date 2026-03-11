import React from 'react';
import { NAV_ITEMS, TOOLS_CONFIG, INITIAL_LESSONS } from '@/constants';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Sparkles, Mail, Notebook, BarChart3, LogIn, ShieldCheck, Settings, Zap, Bell } from 'lucide-react';
import { User, UserStats } from '@/types';
import { QuickOfficeLogo } from './Logo';

const MotionDiv = motion.div as any;

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative flex items-center w-full" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl pointer-events-none whitespace-nowrap z-[100] shadow-2xl border border-gray-800 dark:border-gray-700"
          >
            {text}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  currentUser?: User | null;
  stats?: UserStats;
  notifications: { id: string; title: string; date: string; read: boolean }[];
  setNotifications: React.Dispatch<React.SetStateAction<{ id: string; title: string; date: string; read: boolean }[]>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, stats, notifications, setNotifications }) => {
  const isAdmin = currentUser?.role === 'admin';
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('quickoffice_notifications', JSON.stringify(updated));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r-2 border-gray-100 dark:border-gray-800 h-screen fixed left-0 top-0 bg-white dark:bg-gray-950 p-4 flex-col z-30 transition-colors duration-300">
        <div className="mb-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MotionDiv 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`transition-all ${isAdmin ? 'text-purple-600' : 'text-blue-600'}`}
            >
              <QuickOfficeLogo className="w-12 h-12" iconClassName="w-6 h-6" />
            </MotionDiv>
            <div>
              <h1 className="text-xl font-black text-gray-800 dark:text-white tracking-tight leading-none">QuickOffice</h1>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isAdmin ? 'text-purple-500' : 'text-blue-500'}`}>
                {isAdmin ? 'Admin Console' : 'Suite Master'}
              </p>
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) markAllAsRead();
              }}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <MotionDiv
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 p-4 max-h-80 overflow-y-auto no-scrollbar"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notifications</h3>
                    {notifications.length > 0 && (
                      <button onClick={() => { setNotifications([]); localStorage.removeItem('quickoffice_notifications'); }} className="text-[8px] font-black uppercase text-red-500 hover:underline">Clear All</button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-black text-gray-800 dark:text-white leading-tight mb-1">{n.title}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{n.date}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] font-bold text-gray-400 text-center py-4 italic">No new announcements</p>
                    )}
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="space-y-1.5 px-2">
          {NAV_ITEMS.map((item) => (
            <Tooltip key={item.id} text={item.label}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-extrabold group ${
                  activeTab === item.id 
                    ? (isAdmin && item.id === 'admin' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400') 
                    : 'bg-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                {activeTab === item.id && (
                  <MotionDiv 
                    layoutId="activeTabPill"
                    className={`absolute left-0 w-1.5 h-6 rounded-r-full ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`}
                  />
                )}
                <span className={`shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="uppercase tracking-wide text-xs">{item.label}</span>
              </button>
            </Tooltip>
          ))}

          {/* Admin Specific Nav */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t-2 border-gray-50 dark:border-gray-900">
              <div className="px-4 mb-3">
                <h3 className="text-[10px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={12} /> Administration
                </h3>
              </div>
              <Tooltip text="Admin Panel">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`w-full relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-extrabold group ${
                    activeTab === 'admin' 
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                      : 'bg-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {activeTab === 'admin' && (
                    <MotionDiv 
                      layoutId="activeTabPill"
                      className="absolute left-0 w-1.5 h-6 bg-purple-600 rounded-r-full"
                    />
                  )}
                  <ShieldCheck className={`w-6 h-6 shrink-0 transition-transform ${activeTab === 'admin' ? 'scale-110 text-purple-600' : 'group-hover:scale-110'}`} />
                  <span className="uppercase tracking-wide text-xs">Admin Panel</span>
                </button>
              </Tooltip>
            </div>
          )}
        </nav>

        {/* Related Suite Apps (Proficiency) */}
        {!isAdmin && stats && (
          <div className="mt-8 px-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Suite Proficiency</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(TOOLS_CONFIG).map(([name, config]) => {
                const totalLessons = INITIAL_LESSONS.filter(l => l.tool === name).length;
                const completedCount = stats.completedLessons.filter(id => {
                  const lesson = INITIAL_LESSONS.find(l => l.id === id);
                  return lesson && lesson.tool === name;
                }).length;
                const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
                const level = Math.floor(progress / 20) + 1;

                return (
                  <div key={name} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-gray-500 dark:text-gray-400">{name}</span>
                      <span className="text-gray-400 dark:text-gray-600">Lv. {level}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                       <MotionDiv 
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         className={`h-full ${config.color} rounded-full opacity-60`} 
                       />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          {currentUser ? (
            <Tooltip text="View Profile">
              <MotionDiv 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveTab('profile')}
                className={`p-4 rounded-3xl cursor-pointer transition-all border-2 w-full ${
                  activeTab === 'profile' 
                    ? (isAdmin ? 'bg-purple-600 border-purple-600 shadow-xl text-white' : 'bg-blue-600 border-blue-600 shadow-xl text-white')
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 text-gray-800 dark:text-gray-200'
                } overflow-hidden group`}
              >
                <div className="flex items-center gap-3 relative z-10">
                   <div className={`w-10 h-10 ${activeTab === 'profile' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/40'} rounded-full flex items-center justify-center overflow-hidden border border-white/20`}>
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt="" />
                      ) : (
                        <UserIcon className={`w-6 h-6 ${activeTab === 'profile' ? 'text-white' : (isAdmin ? 'text-purple-600' : 'text-blue-600 dark:text-blue-400')}`} />
                      )}
                   </div>
                   <div>
                      <p className="text-sm font-black leading-tight truncate w-32">{currentUser.fullname}</p>
                      <p className={`text-[10px] font-bold uppercase ${activeTab === 'profile' ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                        {isAdmin ? 'ADMIN' : 'VIEW PROFILE'}
                      </p>
                   </div>
                </div>
              </MotionDiv>
            </Tooltip>
          ) : (
            <Tooltip text="Sign In">
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </Tooltip>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t-2 border-gray-100 dark:border-gray-800 px-2 py-3 flex justify-around items-center z-40 safe-area-bottom">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex-1 flex flex-col items-center py-1 outline-none group"
            >
              <AnimatePresence>
                {isActive && (
                  <MotionDiv
                    layoutId="mobileActivePill"
                    className="absolute inset-x-2 inset-y-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </AnimatePresence>

              <span className={`transition-all duration-300 ${
                isActive ? 'text-blue-600 dark:text-blue-400 scale-110 -translate-y-1' : 'text-gray-400 dark:text-gray-600 scale-100'
              }`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'text-gray-400 dark:text-gray-600 opacity-70'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
        {isAdmin && (
           <button
              onClick={() => setActiveTab('admin')}
              className={`relative flex-1 flex flex-col items-center py-1 outline-none group ${activeTab === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-600'}`}
           >
              <Settings className={`w-5 h-5 transition-transform ${activeTab === 'admin' ? 'scale-110 -translate-y-1' : ''}`} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Admin</span>
           </button>
        )}
      </nav>
    </>
  );
};
