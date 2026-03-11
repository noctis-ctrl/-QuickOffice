
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PathNode } from '@/components/PathNode';
import { LessonEngine } from '@/components/LessonEngine';
import { TutorialLibrary } from '@/components/TutorialLibrary';
import { ProfileView } from '@/components/ProfileView';
import { SettingsView } from '@/components/SettingsView';
import { AuthModal } from '@/components/AuthModal';
import { AdminPanel } from '@/components/AdminPanel';
import { Dashboard } from '@/components/Dashboard';
import { LearnSidePanel } from '@/components/LearnSidePanel';
import { Guidebook } from '@/components/Guidebook';
import { QuickOfficeLogo } from '@/components/Logo';
import { UserStats, OfficeTool, Lesson, User } from './types';
import { INITIAL_LESSONS, TOOLS_CONFIG } from './constants';
import { Map as MapIcon, BookOpen, Database as DbIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './services/api';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('learn');
  const [activeTool, setActiveTool] = useState<OfficeTool>('Excel');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [customLessons, setCustomLessons] = useState<Lesson[]>([]);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('quickoffice_theme') === 'dark';
  });
  const [notifications, setNotifications] = useState<{ id: string; title: string; date: string; read: boolean }[]>(() => {
    const saved = localStorage.getItem('quickoffice_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('quickoffice_stats');
    const defaultStats: UserStats = {
      xp: 0,
      streak: 0,
      completedLessons: [],
      currentTool: 'Excel',
      hasTakenPreTest: false,
      lastFreeRestores: {}
    };
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
  });

  // Sync with DB on mount
  useEffect(() => {
    const initData = async () => {
      // Check DB Health
      const isHealthy = await api.checkHealth();
      setDbConnected(isHealthy);

      // Restore User
      const savedUser = localStorage.getItem('quickoffice_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        
        // If DB is up, get fresh stats and lessons
        if (isHealthy) {
          try {
            const dbStats = await api.getStats(user.id);
            if (dbStats) setStats(dbStats);
            
            const dbLessons = await api.getLessons();
            setCustomLessons(dbLessons);
          } catch (e) {
            console.error("Failed to sync with PostgreSQL:", e);
          }
        }
      }

      // Local fallback for lessons
      if (!isHealthy) {
        const savedLessons = JSON.parse(localStorage.getItem('quickoffice_custom_lessons') || '[]');
        setCustomLessons(savedLessons);
      }

      // Ensure splash screen shows for at least 2 seconds for smooth transition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsInitializing(false);
    };
    
    initData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('quickoffice_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('quickoffice_theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('quickoffice_user', JSON.stringify(user));
    setActiveTab('learn');
    setIsAuthModalOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('quickoffice_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quickoffice_user');
    localStorage.removeItem('quickoffice_token');
    setActiveTab('learn');
  };

  const handleAddTutorial = async (lesson: Lesson) => {
    if (dbConnected) {
      try {
        await api.saveLesson(lesson);
      } catch (e) {
        console.error("DB Save Failed, using local storage");
      }
    }
    setCustomLessons(prev => [...prev, lesson]);
    
    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `New Tutorial: ${lesson.title}`,
      date: new Date().toLocaleDateString(),
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 10);
      localStorage.setItem('quickoffice_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteTutorial = async (id: string) => {
    if (dbConnected) {
      try {
        await api.deleteLesson(id);
      } catch (e) {
        console.error("DB Delete Failed");
      }
    }
    setCustomLessons(prev => prev.filter(l => l.id !== id));
  };

  const handleAddAnnouncement = (title: string, message: string) => {
    const newNotif = {
      id: `ann-${Date.now()}`,
      title: `Admin: ${title}`,
      date: new Date().toLocaleDateString(),
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 10);
      localStorage.setItem('quickoffice_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const allLessons = [...INITIAL_LESSONS, ...customLessons];
  const toolLessons = allLessons.filter(l => l.tool === activeTool);

  const handleLessonComplete = async (xp: number) => {
    if (activeLesson) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let newStats: UserStats;
      
      setStats(prev => {
        let newStreak = prev.streak;
        
        if (prev.lastCompletionDate !== today) {
          if (prev.lastCompletionDate === yesterday || !prev.lastCompletionDate) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        const updated = {
          ...prev,
          xp: prev.xp + xp,
          streak: newStreak,
          lastCompletionDate: today,
          completedLessons: [...new Set([...prev.completedLessons, activeLesson.id])],
        };
        
        newStats = updated;
        localStorage.setItem('quickoffice_stats', JSON.stringify(updated));
        
        // Async update to DB
        if (dbConnected && currentUser) {
          api.updateStats(currentUser.id, updated).catch(console.error);
        }
        
        return updated;
      });
      setActiveLesson(null);
    }
  };

  const canUseFreeRestore = useCallback((tool: OfficeTool) => {
    const lastUsedDate = stats.lastFreeRestores?.[tool];
    if (!lastUsedDate) return true;
    return lastUsedDate !== new Date().toDateString();
  }, [stats.lastFreeRestores]);

  const handleUseFreeRestore = useCallback((tool: OfficeTool) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        lastFreeRestores: {
          ...(prev.lastFreeRestores || {}),
          [tool]: new Date().toDateString()
        }
      };
      localStorage.setItem('quickoffice_stats', JSON.stringify(newStats));
      
      if (dbConnected && currentUser) {
        api.updateStats(currentUser.id, newStats).catch(console.error);
      }
      
      return newStats;
    });
  }, [dbConnected, currentUser]);

  const renderRoadmap = () => {
    let currentStage = "";
    return toolLessons.map((lesson, idx) => {
      const isCompleted = stats.completedLessons.includes(lesson.id);
      const isAvailable = idx === 0 || stats.completedLessons.includes(toolLessons[idx-1].id);
      const showHeader = lesson.stageTitle !== currentStage;
      if (showHeader) currentStage = lesson.stageTitle || "";

      return (
        <React.Fragment key={lesson.id}>
          {showHeader && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mb-8 mt-12 flex flex-col items-center">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-6 py-2 rounded-xl border-2 border-gray-100 dark:border-gray-800 shadow-sm">
                 <MapIcon className="w-4 h-4 text-gray-400" />
                 <h2 className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                   {lesson.stageTitle || "Extra Content"}
                 </h2>
              </div>
            </MotionDiv>
          )}
          <PathNode
            id={lesson.id}
            title={lesson.title}
            tool={activeTool}
            index={idx}
            status={isCompleted ? 'completed' : (isAvailable ? 'available' : 'locked')}
            onClick={() => setActiveLesson(lesson)}
          />
        </React.Fragment>
      );
    });
  };

  if (isInitializing) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 ${isDarkMode ? 'dark' : ''}`}>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <QuickOfficeLogo className="w-24 h-24" />
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`relative ${isDarkMode ? 'dark' : ''}`}>
        <Dashboard 
          onGetStarted={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} 
          onLogin={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} 
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={handleLogin} 
        />
      </div>
    );
  }

  const learnClasses = "lg:ml-64 p-4 sm:p-6 lg:p-10 flex flex-col xl:flex-row gap-8 lg:gap-16 justify-center items-start";
  const otherClasses = "lg:ml-64 p-4 sm:p-6 lg:p-10";
  const mainClasses = `relative z-10 flex-1 ${activeTab === 'learn' ? learnClasses : otherClasses} overflow-x-hidden pb-32 lg:pb-10 min-h-screen transition-colors duration-300 bg-white dark:bg-gray-950`;

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row selection:bg-blue-100 dark:selection:bg-blue-900 relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => setActiveTab(id)} 
        currentUser={currentUser} 
        stats={stats} 
        notifications={notifications}
        setNotifications={setNotifications}
      />
      
      {/* DB Sync Indicator (Overlay) */}
      {dbConnected === false && activeTab === 'learn' && (
        <div className="fixed bottom-24 right-8 lg:bottom-8 lg:right-8 z-50 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl animate-pulse">
          <AlertCircle size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Offline Mode: Postgres Disconnected</span>
        </div>
      )}

      <main className={mainClasses}>
        {activeTab === 'learn' && (
          <>
            <div className="w-full max-w-xl flex flex-col items-center">
                <div className="w-full flex gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 sm:p-3 rounded-3xl sm:rounded-[2.5rem] border-4 border-gray-100 dark:border-gray-800 shadow-xl sticky top-4 z-20 overflow-x-auto no-scrollbar">
                  {(['Excel', 'Word', 'PowerPoint'] as OfficeTool[]).map((tool) => {
                    const config = TOOLS_CONFIG[tool as keyof typeof TOOLS_CONFIG];
                    const isActive = activeTool === tool;
                    return (
                        <MotionButton
                          key={tool}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveTool(tool);
                            setIsGuidebookOpen(false);
                          }}
                          className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-2xl sm:rounded-3xl transition-all font-black text-[10px] sm:text-sm uppercase tracking-wider border-4 ${
                            isActive 
                              ? `${config.color} text-white ${config.borderColor} shadow-[0_4px_0_0_rgba(0,0,0,0.1)]` 
                              : 'text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="scale-75 sm:scale-100">{config.icon}</span>
                          <span>{tool}</span>
                        </MotionButton>
                    );
                  })}
                </div>

                {/* Floating Guidebook Button */}
                <div className="w-full flex justify-end mb-6">
                   <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsGuidebookOpen(true)}
                    className="flex items-center gap-3 bg-white dark:bg-gray-900 px-6 py-4 rounded-[1.5rem] border-4 border-gray-100 dark:border-gray-800 shadow-xl group"
                   >
                      <div className={`w-10 h-10 ${TOOLS_CONFIG[activeTool].color} rounded-xl flex items-center justify-center text-white`}>
                        <BookOpen size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tutorial Help</p>
                        <p className="text-sm font-black text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">Guidebook</p>
                      </div>
                   </MotionButton>
                </div>

                <div className="w-full relative flex flex-col items-center py-10">
                  {renderRoadmap()}
                </div>
            </div>
            <LearnSidePanel stats={stats} />
          </>
        )}

        {activeTab === 'tutorials' && <TutorialLibrary customLessons={customLessons} />}
        {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} stats={stats} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'settings' && <SettingsView stats={stats} setStats={setStats} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanel 
            onAddTutorial={handleAddTutorial} 
            onAddAnnouncement={handleAddAnnouncement}
            existingLessons={[...INITIAL_LESSONS, ...customLessons]} 
            onDeleteTutorial={handleDeleteTutorial} 
          />
        )}
      </main>

      <AnimatePresence>
        {activeLesson && (
          <LessonEngine 
            lesson={activeLesson} 
            canRestore={canUseFreeRestore(activeLesson.tool)}
            onRestore={() => handleUseFreeRestore(activeLesson.tool)}
            onComplete={handleLessonComplete} 
            onQuit={() => setActiveLesson(null)} 
          />
        )}
      </AnimatePresence>

      <Guidebook 
        isOpen={isGuidebookOpen} 
        onClose={() => setIsGuidebookOpen(false)} 
        tool={activeTool} 
      />
    </div>
  );
};

export default App;
