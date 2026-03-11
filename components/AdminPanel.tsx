
import React, { useState, useEffect } from 'react';
import { Lesson, OfficeTool } from '@/types';
import { 
  Plus, 
  Trash2, 
  Save,
  Loader2,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/services/api';

const MotionDiv = motion.div as any;

interface AdminPanelProps {
  onAddTutorial: (lesson: Lesson) => void;
  onAddAnnouncement: (title: string, message: string) => void;
  existingLessons: Lesson[];
  onDeleteTutorial: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddTutorial, onAddAnnouncement, existingLessons, onDeleteTutorial }) => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbStats, setDbStats] = useState<{users: number, tutorials: number, stats: number} | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    tool: 'Excel' as OfficeTool,
    videoUrl: '',
    points: ['', '', ''],
    proTip: '',
    description: ''
  });

  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);

  useEffect(() => {
    const check = async () => {
      const isHealthy = await api.checkHealth();
      setDbStatus(isHealthy ? 'connected' : 'error');
      if (isHealthy) {
        try {
          const stats = await api.getDbStats();
          setDbStats(stats);
        } catch (e) {
          console.error("Failed to fetch DB stats");
        }
      }
    };
    check();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.videoUrl.trim()) newErrors.videoUrl = 'YouTube URL is required';
    if (!formData.proTip.trim()) newErrors.proTip = 'Pro Hack is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      description: formData.description || `Learning ${formData.tool} from tutorial.`,
      tool: formData.tool,
      xpReward: 20,
      questions: [], 
      performanceSteps: [],
      tutorialContent: {
        title: formData.title,
        points: formData.points.filter(p => p.trim() !== ''),
        proTip: formData.proTip,
        videoUrl: formData.videoUrl
      }
    };

    // Save locally for fallback
    const savedLessons = JSON.parse(localStorage.getItem('quickoffice_custom_lessons') || '[]');
    localStorage.setItem('quickoffice_custom_lessons', JSON.stringify([...savedLessons, newLesson]));
    
    // Call the API for PostgreSQL persistence
    onAddTutorial(newLesson);
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setFormData({ title: '', tool: 'Excel', videoUrl: '', points: ['', '', ''], proTip: '', description: '' });
    
    setIsSubmitting(false);
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementData.title.trim() || !announcementData.message.trim()) return;
    
    setIsAnnouncing(true);
    onAddAnnouncement(announcementData.title, announcementData.message);
    
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
    setAnnouncementData({ title: '', message: '' });
    setIsAnnouncing(false);
  };

  const handleDeleteClick = (lesson: Lesson) => {
    if (window.confirm(`Delete "${lesson.title}" from Database?`)) {
      const savedLessons = JSON.parse(localStorage.getItem('quickoffice_custom_lessons') || '[]');
      const filtered = savedLessons.filter((l: any) => l.id !== lesson.id);
      localStorage.setItem('quickoffice_custom_lessons', JSON.stringify(filtered));
      onDeleteTutorial(lesson.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white">Admin Console</h1>
              <p className="text-gray-500 font-bold">Manage tutorials and Postgres data.</p>
            </div>
            
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 transition-all ${
              dbStatus === 'connected' ? 'bg-green-50 border-green-100 text-green-600' :
              dbStatus === 'error' ? 'bg-red-50 border-red-100 text-red-600' :
              'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
               {dbStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin" />}
               {dbStatus === 'connected' && <CheckCircle className="w-4 h-4" />}
               {dbStatus === 'error' && <AlertTriangle className="w-4 h-4" />}
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Server Status</span>
                  <span className="text-xs font-black">{dbStatus === 'connected' ? 'PostgreSQL Active' : dbStatus === 'error' ? 'No Backend' : 'Syncing...'}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add New Tutorial
            </h2>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Title <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                  <input 
                    type="text" 
                    className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold outline-none transition-all dark:text-white ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                    value={formData.title}
                    onChange={e => {
                      setFormData({...formData, title: e.target.value});
                      if(errors.title) setErrors((prev: any) => ({...prev, title: undefined}));
                    }}
                  />
                  {errors.title && <p className="text-[10px] font-bold text-red-500 ml-2 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Tool <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                  <select 
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold outline-none dark:text-white"
                    value={formData.tool}
                    onChange={e => setFormData({...formData, tool: e.target.value as OfficeTool})}
                  >
                    <option value="Excel">Excel</option>
                    <option value="Word">Word</option>
                    <option value="PowerPoint">PowerPoint</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">YouTube Embed URL <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="url" 
                  className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold outline-none transition-all dark:text-white ${errors.videoUrl ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                  value={formData.videoUrl}
                  onChange={e => {
                    setFormData({...formData, videoUrl: e.target.value});
                    if(errors.videoUrl) setErrors((prev: any) => ({...prev, videoUrl: undefined}));
                  }}
                />
                {errors.videoUrl && <p className="text-[10px] font-bold text-red-500 ml-2 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {errors.videoUrl}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Pro Hack Description</label>
                <textarea 
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold outline-none focus:border-blue-500 dark:text-white min-h-[100px]"
                  value={formData.proTip}
                  onChange={e => setFormData({...formData, proTip: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none ${
                  success ? 'bg-green-600' : 'bg-blue-600'
                }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : success ? 'POSTED TO DB!' : 'PUBLISH TO POSTGRES'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              <Save className="w-5 h-5 text-purple-600" /> Admin Announcement
            </h2>
            <form onSubmit={handleAnnouncementSubmit} className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Announcement Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. New Feature Update!"
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white transition-all"
                  value={announcementData.title}
                  onChange={e => setAnnouncementData({...announcementData, title: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Message</label>
                <textarea 
                  placeholder="What do you want to tell the students?"
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white min-h-[100px] transition-all"
                  value={announcementData.message}
                  onChange={e => setAnnouncementData({...announcementData, message: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={isAnnouncing}
                className={`w-full py-4 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none ${
                  annSuccess ? 'bg-green-600' : 'bg-purple-600'
                }`}
              >
                {isAnnouncing ? <Loader2 className="animate-spin" /> : annSuccess ? 'ANNOUNCEMENT SENT!' : 'SEND TO ALL USERS'}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 space-y-6">
          {dbStats && (
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Database Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600">{dbStats.users}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-purple-600">{dbStats.tutorials}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-green-600">{dbStats.stats}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Records</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
               <Database className="w-5 h-5 text-purple-500" /> PostgreSQL Entries
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
              {existingLessons.filter(l => l.id.startsWith('custom-')).map(lesson => (
                <div key={lesson.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <p className="font-black text-sm text-gray-800 dark:text-white truncate">{lesson.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lesson.tool}</p>
                  </div>
                  <button onClick={() => handleDeleteClick(lesson)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {existingLessons.filter(l => l.id.startsWith('custom-')).length === 0 && (
                <p className="text-center py-10 text-gray-400 font-bold text-xs uppercase italic tracking-widest">No custom entries found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
