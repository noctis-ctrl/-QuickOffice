
import React from 'react';
import { User, UserStats, OfficeTool } from '@/types';
import { TOOLS_CONFIG, INITIAL_LESSONS } from '@/constants';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  Settings, 
  LogOut, 
  Camera, 
  Medal, 
  Target,
  Zap,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MotionDiv = motion.div as any;

interface ProfileViewProps {
  user: User;
  stats: UserStats;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date?: string;
  obtained: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, stats, onLogout, onUpdateUser }) => {
  const [showMilestones, setShowMilestones] = React.useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(user.fullname);
  const [editedAvatar, setEditedAvatar] = React.useState(user.avatarUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const GALLERY_AVATARS = [
    'https://picsum.photos/seed/avatar1/200/200',
    'https://picsum.photos/seed/avatar2/200/200',
    'https://picsum.photos/seed/avatar3/200/200',
    'https://picsum.photos/seed/avatar4/200/200',
    'https://picsum.photos/seed/avatar5/200/200',
    'https://picsum.photos/seed/avatar6/200/200',
    'https://picsum.photos/seed/avatar7/200/200',
    'https://picsum.photos/seed/avatar8/200/200',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAvatar(reader.result as string);
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const formattedJoinedDate = React.useMemo(() => {
    try {
      const dateStr = user.joinedDate || new Date().toISOString();
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "February 23, 2026";
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return "February 23, 2026";
    }
  }, [user.joinedDate]);

  const milestones: Milestone[] = [
    { id: 'm1', title: 'First Steps', description: 'Complete your first lesson.', obtained: stats.completedLessons.length > 0, date: stats.completedLessons.length > 0 ? 'Feb 20, 2026' : undefined },
    { id: 'm2', title: 'Power User', description: 'Complete 5 lessons.', obtained: stats.completedLessons.length >= 5, date: stats.completedLessons.length >= 5 ? 'Feb 21, 2026' : undefined },
    { id: 'm3', title: 'Excel Wizard', description: 'Complete all Excel core lessons.', obtained: stats.completedLessons.filter(id => id.includes('excel')).length >= 3, date: stats.completedLessons.filter(id => id.includes('excel')).length >= 3 ? 'Feb 22, 2026' : undefined },
    { id: 'm4', title: 'Word Smith', description: 'Complete all Word core lessons.', obtained: stats.completedLessons.filter(id => id.includes('word')).length >= 3, date: stats.completedLessons.filter(id => id.includes('word')).length >= 3 ? 'Feb 23, 2026' : undefined },
    { id: 'm5', title: 'Slide Master', description: 'Complete all PowerPoint core lessons.', obtained: stats.completedLessons.filter(id => id.includes('ppt')).length >= 3, date: stats.completedLessons.filter(id => id.includes('ppt')).length >= 3 ? 'Feb 24, 2026' : undefined },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <MotionDiv 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 p-8 shadow-sm flex flex-col items-center text-center"
          >
            <div className="relative group mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                {(isEditing ? editedAvatar : user.avatarUrl) ? (
                  <img src={isEditing ? editedAvatar : user.avatarUrl} alt={user.fullname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{(isEditing ? editedName : user.fullname)[0]}</span>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-gray-700 shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="w-full space-y-2 mb-4">
                <input 
                  type="text" 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-blue-500 rounded-xl font-bold outline-none text-center dark:text-white"
                  placeholder="Full Name"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      onUpdateUser({ ...user, fullname: editedName, avatarUrl: editedAvatar });
                      setIsEditing(false);
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8]"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setEditedName(user.fullname);
                      setEditedAvatar(user.avatarUrl);
                      setIsEditing(false);
                    }}
                    className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">{user.fullname}</h2>
            )}
            <p className="text-gray-400 dark:text-gray-500 font-bold mb-6">{user.email}</p>

            <div className="w-full grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="text-lg font-black">{stats.streak}</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Day Streak</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-lg font-black">{stats.xp}</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total XP</p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Joined {formattedJoinedDate}</span>
              </div>
            </div>

            <div className="w-full mt-8">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-left ml-2">Your Badges</h3>
               <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'b1', icon: '🏆', label: 'Starter', earned: stats.completedLessons.length > 0 },
                    { id: 'b2', icon: '🔥', label: 'Streak', earned: stats.streak >= 3 },
                    { id: 'b3', icon: '💎', label: 'Expert', earned: stats.completedLessons.length >= 10 },
                    { id: 'b4', icon: '⚡', label: 'Fast', earned: stats.xp >= 500 },
                  ].map(badge => (
                    <div key={badge.id} className={`aspect-square rounded-xl flex items-center justify-center text-xl shadow-sm border-2 ${
                      badge.earned ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 grayscale opacity-40'
                    }`}>
                      {badge.icon}
                    </div>
                  ))}
               </div>
            </div>

            <hr className="w-full my-8 border-gray-100 dark:border-gray-800" />

            <div className="w-full flex gap-3">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Edit
                </button>
              )}
              <button 
                onClick={onLogout}
                className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Exit
              </button>
            </div>
          </MotionDiv>
        </div>

        {/* Stats & Progress */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-800 dark:text-white">Your Statistics</h2>
            <div className="flex gap-2">
               <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> High Performance
               </div>
            </div>
          </div>

          {/* Detailed Mastery Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Excel', 'Word', 'PowerPoint'] as OfficeTool[]).map(tool => {
              const config = TOOLS_CONFIG[tool as keyof typeof TOOLS_CONFIG];
              const toolLessons = INITIAL_LESSONS.filter(l => l.tool === tool);
              const completed = stats.completedLessons.filter(id => {
                const lesson = INITIAL_LESSONS.find(l => l.id === id);
                return lesson && lesson.tool === tool;
              }).length;
              const progress = toolLessons.length > 0 ? (completed / toolLessons.length) * 100 : 0;

              return (
                <div key={tool} className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {config.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 dark:text-white">{tool}</h4>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Mastery</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-sm font-black text-gray-800 dark:text-gray-200">{completed} Lessons</span>
                    <span className="text-xs font-black text-gray-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700">
                    <MotionDiv 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${config.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievements Section */}
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Trophy className={`w-10 h-10 ${stats.completedLessons.length >= 5 ? 'text-yellow-500' : 'text-gray-200 dark:text-gray-700'}`} />
             </div>
             <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">
               {stats.completedLessons.length >= 5 ? 'Rising Star' : 'No Achievements Yet'}
             </h3>
             <p className="text-gray-400 dark:text-gray-500 font-bold max-w-sm mb-8">
               {stats.completedLessons.length >= 5 
                 ? "You've completed more than 5 lessons! Keep going to unlock the Office Guru badge." 
                 : "Keep learning to earn badges and special office tool honors! Finish your first stage in any tool to get started."}
             </p>
             <button 
               onClick={() => setShowMilestones(true)}
               className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] dark:shadow-[0_4px_0_0_#2563eb] active:scale-95 transition-transform"
             >
                Go to Learning Path
             </button>
          </div>

          {/* Milestones Modal */}
          <AnimatePresence>
            {showMilestones && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <MotionDiv 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMilestones(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <MotionDiv 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-[2.5rem] border-4 border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                  <div className="p-8 border-b-2 border-gray-50 dark:border-gray-900 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                    <div>
                      <h2 className="text-2xl font-black text-gray-800 dark:text-white">Learning Path Milestones</h2>
                      <p className="text-gray-400 font-bold text-sm">Track your progress through the curriculum</p>
                    </div>
                    <button onClick={() => setShowMilestones(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
                    {milestones.map(m => (
                      <div key={m.id} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${
                        m.obtained 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/40' 
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60'
                      }`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          m.obtained ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                        }`}>
                          {m.obtained ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${m.obtained ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                              {m.obtained ? 'Obtained' : 'Not Obtained'}
                            </h4>
                            {m.date && <span className="text-[10px] font-black text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">{m.date}</span>}
                          </div>
                          <h3 className="text-xl font-black text-gray-800 dark:text-white">{m.title}</h3>
                          <p className="text-sm font-bold text-gray-400 dark:text-gray-500">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </MotionDiv>
              </div>
            )}
          </AnimatePresence>

          {/* Avatar Picker Modal */}
          <AnimatePresence>
            {showAvatarPicker && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                <MotionDiv 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAvatarPicker(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <MotionDiv 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-[2.5rem] border-4 border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="p-8 border-b-2 border-gray-50 dark:border-gray-900 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                    <div>
                      <h2 className="text-2xl font-black text-gray-800 dark:text-white">Choose Avatar</h2>
                      <p className="text-gray-400 font-bold text-sm">Select from gallery or upload your own</p>
                    </div>
                    <button onClick={() => setShowAvatarPicker(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    {/* Upload Section */}
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Upload Custom</h3>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        Upload Image
                      </button>
                    </div>

                    {/* Gallery Section */}
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Gallery</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {GALLERY_AVATARS.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setEditedAvatar(url);
                              setShowAvatarPicker(false);
                            }}
                            className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 ${
                              editedAvatar === url ? 'border-blue-600' : 'border-transparent'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
