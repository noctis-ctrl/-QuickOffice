
import React, { useState, useMemo } from 'react';
import { INITIAL_LESSONS, TOOLS_CONFIG } from '@/constants';
import { OfficeTool, Lesson } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  BarChart, 
  Play,
  Zap,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  Layers,
  Rocket,
  ShieldCheck
} from 'lucide-react';

const MotionDiv = motion.div as any;

// Helper to extract YouTube ID for thumbnails
const getYouTubeId = (url: string | undefined) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const TutorialLibrary: React.FC<{ customLessons?: Lesson[] }> = ({ customLessons = [] }) => {
  const [filter, setFilter] = useState<OfficeTool>('Excel');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const combinedLessons = useMemo(() => [...INITIAL_LESSONS, ...customLessons], [customLessons]);
  
  const filteredTutorials = useMemo(() => {
    return combinedLessons.filter(l => {
      const matchesFilter = l.tool === filter;
      const matchesSearch = l.tutorialContent.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.tool.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [combinedLessons, filter, searchQuery]);

  const categories = (['Excel', 'Word', 'PowerPoint'] as OfficeTool[]).filter(t => filter === t);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:gap-8 mb-10 sm:mb-20">
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 fill-current" /> Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] sm:leading-[0.9]">
             Tutorial <span className="text-blue-600">Vault</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm sm:text-xl max-w-2xl leading-snug">
            Deep dive into expert techniques. Master Microsoft Office with cinematic tutorials and pro-level workflow hacks.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by topic or tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 sm:py-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl sm:rounded-[2rem] font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-sm sm:text-base dark:text-white"
            />
          </div>
          
          <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl sm:rounded-[2rem] overflow-x-auto no-scrollbar border border-gray-200 dark:border-gray-700">
            {(['Excel', 'Word', 'PowerPoint'] as const).map(f => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPlayingVideo(null);
                }}
                className={`px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 lg:flex-none ${
                  filter === f 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categorized Content Area */}
      <div className="space-y-16 sm:space-y-32">
        {categories.map((category) => {
          const categoryLessons = filteredTutorials.filter(l => l.tool === category);
          if (categoryLessons.length === 0) return null;
          
          const config = TOOLS_CONFIG[category as keyof typeof TOOLS_CONFIG];

          return (
            <section key={category} className="relative">
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 border-b-2 sm:border-b-4 border-gray-50 dark:border-gray-800 pb-6 sm:pb-8">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className={`w-12 h-12 sm:w-20 sm:h-20 ${config.color} rounded-xl sm:rounded-3xl flex items-center justify-center text-white shadow-lg rotate-3`}>
                    {/* Fixed: Use React.ReactElement<any> to allow className prop injection */}
                    {React.cloneElement(config.icon as React.ReactElement<any>, { className: "w-6 h-6 sm:w-12 sm:h-12" })}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                      Microsoft {category}
                    </h2>
                    <p className="text-gray-400 dark:text-gray-500 font-bold text-[9px] sm:text-sm uppercase tracking-widest mt-0.5 sm:mt-1">
                      {categoryLessons.length} Modules Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Tutorial Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-12">
                {categoryLessons.map((lesson) => {
                  const ytId = getYouTubeId(lesson.tutorialContent.videoUrl);
                  const isPlaying = playingVideo === lesson.id;

                  return (
                    <MotionDiv
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group flex flex-col bg-white dark:bg-gray-900 border-b-[6px] sm:border-b-[8px] border-x border-t border-gray-100 dark:border-gray-800 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Media Area / Thumbnail */}
                      <div className="aspect-video relative overflow-hidden bg-gray-900">
                        {isPlaying && lesson.tutorialContent.videoUrl ? (
                          <iframe
                            className="w-full h-full"
                            src={`${lesson.tutorialContent.videoUrl}${lesson.tutorialContent.videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                            title={lesson.tutorialContent.title}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        ) : (
                          <div 
                            className="w-full h-full relative cursor-pointer"
                            onClick={() => setPlayingVideo(lesson.id)}
                          >
                            {ytId ? (
                              <>
                                <img 
                                  src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} 
                                  alt={lesson.tutorialContent.title}
                                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/0.jpg`;
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                              </>
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${config.color} opacity-20`}>
                                 <BookOpen className="w-12 h-12 sm:w-16 text-white" />
                              </div>
                            )}
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                              <div className="flex items-center justify-between">
                                 <div className="flex gap-2">
                                   <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                      <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider">Lesson</span>
                                   </div>
                                 </div>
                                 <MotionDiv 
                                   whileHover={{ scale: 1.15 }}
                                   whileTap={{ scale: 0.9 }}
                                   className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-900 dark:text-white shadow-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                                 >
                                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                                 </MotionDiv>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info Area */}
                      <div className="p-5 sm:p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2 sm:mb-4">
                           <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${config.color}`} />
                           <span className="text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Digital Proficiency</span>
                        </div>
                        
                        <h3 className="text-lg sm:text-2xl font-black text-gray-800 dark:text-white leading-tight mb-4 sm:mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lesson.tutorialContent.title}
                        </h3>

                        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                          {lesson.tutorialContent.points.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex gap-3 sm:gap-4 items-start">
                               <div className="shrink-0 mt-1">
                                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500/60 dark:text-blue-400/40" />
                               </div>
                               <p className="text-[12px] sm:text-sm font-bold text-gray-500 dark:text-gray-400 leading-snug">{p}</p>
                            </div>
                          ))}
                        </div>

                        {/* Enhanced Pro Tip Section: Office Pro Hack */}
                        <div className="mt-auto relative">
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-5 sm:p-7 pt-9 sm:pt-10 flex flex-col gap-3 group/hack hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-inner">
                             <div className="absolute -top-3.5 left-5 sm:left-8">
                               <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full flex items-center gap-2 shadow-xl shadow-indigo-200 dark:shadow-none">
                                  <Rocket className="w-3 h-3 sm:w-4 sm:h-4 fill-current animate-bounce" />
                                  <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em]">OFFICE PRO HACK</span>
                               </div>
                             </div>
                             
                             <div className="flex items-start gap-4">
                               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-md border border-indigo-50 dark:border-indigo-800">
                                  <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7" />
                               </div>
                               <p className="text-[12px] sm:text-[14px] font-black text-indigo-900 dark:text-indigo-100 leading-relaxed italic opacity-90">
                                 "{lesson.tutorialContent.proTip}"
                               </p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </MotionDiv>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {filteredTutorials.length === 0 && (
        <MotionDiv 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20 sm:py-32 bg-gray-50 dark:bg-gray-900 rounded-3xl sm:rounded-[3rem] border-2 sm:border-4 border-dashed border-gray-100 dark:border-gray-800"
        >
           <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-gray-300 dark:text-gray-700">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12" />
           </div>
           <h3 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white mb-2 sm:mb-4">No tutorials found</h3>
           <p className="text-gray-400 dark:text-gray-500 font-bold text-sm sm:text-lg max-w-xs sm:max-w-md mx-auto">
             Try a different search term or check another category.
           </p>
           <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 sm:mt-8 px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] text-xs sm:text-sm transition-all active:translate-y-1 active:shadow-none"
           >
             Clear Search
           </button>
        </MotionDiv>
      )}
    </div>
  );
};
