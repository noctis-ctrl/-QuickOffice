
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Lesson, Question, QuestionType, Difficulty } from '@/types';
import { CheckCircle2, XCircle, Loader2, Trophy, Sparkles, BookOpen, ChevronRight, Lightbulb, Clock, Heart, AlertCircle, RotateCcw, MousePointer2, RefreshCw, Layers, Monitor, ChevronLeft, GripVertical, Check, Info, ArrowRight, Star, Play, LogOut } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface LessonEngineProps {
  lesson: Lesson;
  canRestore: boolean;
  onRestore: () => void;
  onComplete: (xp: number) => void;
  onQuit: () => void;
}

type EnginePhase = 'quiz1' | 'review' | 'quiz2' | 'wrongReviewIntro' | 'wrongReview' | 'completed';

export const LessonEngine: React.FC<LessonEngineProps> = ({ lesson, canRestore, onRestore, onComplete, onQuit }) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledSkills, setShuffledSkills] = useState<Question[]>([]);
  const [missedQuestions, setMissedQuestions] = useState<Question[]>([]);
  
  const [phase, setPhase] = useState<EnginePhase>('quiz1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [draggedSteps, setDraggedSteps] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  
  const [hearts, setHearts] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);
  const [wrongAnswersHistory, setWrongAnswersHistory] = useState<Record<string, string[]>>({});
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  const [hasInteractedWithVideo, setHasInteractedWithVideo] = useState(false);

  // Dynamic initial time based on phasedifficulty. Quiz 2 gets 5 mins (300s).
  const getInitialTime = (p: EnginePhase) => {
    if (p === 'quiz2' || p === 'wrongReview') return 300; // 5 minutes for Practical and Redemption
    return 180; // 3 minutes for Concept Mastery
  };
  const [seconds, setSeconds] = useState(getInitialTime('quiz1'));

  // Function to prepare the dynamic quiz pools - ensuring they shuffle every time
  const prepareQuizPool = (pool: Question[], count: number) => {
    if (pool.length === 0) return [];
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  };

  // Phase change logic - reset hearts and prepare data
  useEffect(() => {
    if (phase === 'quiz1') {
      const qSelected = prepareQuizPool(lesson.questions, 15);
      setShuffledQuestions(qSelected);
      setCurrentIndex(0);
      setHearts(5); // Reset hearts for Phase 1
      setSeconds(getInitialTime('quiz1'));
      setWrongAnswersHistory({});
      setIsTimeUp(false);
    }
    if (phase === 'quiz2') {
      const sSelected = prepareQuizPool(lesson.performanceSteps, 15);
      setShuffledSkills(sSelected);
      setCurrentIndex(0);
      setHearts(3); // Quiz 2 is harder: Reset hearts to 3 instead of 5
      setSeconds(getInitialTime('quiz2'));
      setIsTimeUp(false);
    }
    if (phase === 'wrongReview') {
      setCurrentIndex(0);
      setHearts(3); // Redemption also limited to 3 hearts
      setSeconds(getInitialTime('wrongReview'));
      setIsTimeUp(false);
    }
  }, [lesson.id, phase]);

  const currentQuestion = useMemo(() => {
    if (phase === 'quiz1') return shuffledQuestions[currentIndex];
    if (phase === 'quiz2') return shuffledSkills[currentIndex];
    if (phase === 'wrongReview') return missedQuestions[currentIndex];
    return null;
  }, [phase, currentIndex, shuffledQuestions, shuffledSkills, missedQuestions]);

  // Initialize dragged steps for practical tasks
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === QuestionType.DRAG_DROP) {
      const initialSteps = [...(currentQuestion.correctOrder || [])].sort(() => Math.random() - 0.5);
      setDraggedSteps(initialSteps);
    }
  }, [currentIndex, phase, currentQuestion]);

  useEffect(() => {
    let interval: any;
    if ((phase === 'quiz1' || phase === 'quiz2' || phase === 'wrongReview') && !feedback && !isGameOver && !isTimeUp) {
      interval = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setIsTimeUp(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, feedback, isGameOver, isTimeUp]);

  const handleCheck = () => {
    if (!currentQuestion || isTimeUp) return;
    
    const isPractical = currentQuestion.type === QuestionType.DRAG_DROP;
    if (!isPractical && !selectedOption) return;
    
    setIsEvaluating(true);

    let isCorrect = false;
    if (isPractical) {
      isCorrect = JSON.stringify(draggedSteps) === JSON.stringify(currentQuestion.correctOrder);
    } else {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    }
    
    if (!isCorrect) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      
      if (phase !== 'wrongReview') {
        setMissedQuestions(prev => {
          if (prev.find(q => q.id === currentQuestion.id)) return prev;
          return [...prev, currentQuestion];
        });
      }

      if (phase === 'quiz1' && selectedOption) {
        setWrongAnswersHistory(prev => ({
          ...prev,
          [currentQuestion.id]: [...(prev[currentQuestion.id] || []), selectedOption]
        }));
      }
      
      if (newHearts <= 0) setIsGameOver(true);
    }

    setFeedback({ 
      isCorrect, 
      text: isCorrect ? 'Great job!' : `Not quite. ${currentQuestion.explanation}` 
    });
    setIsEvaluating(false);
  };

  const handleNext = () => {
    const wasCorrect = feedback?.isCorrect;
    setFeedback(null);
    setSelectedOption(null);
    setIsTimeUp(false);

    if (phase === 'wrongReview' && wasCorrect && currentQuestion) {
      const remainingMissed = missedQuestions.filter(q => q.id !== currentQuestion.id);
      setMissedQuestions(remainingMissed);
      
      if (remainingMissed.length === 0) {
        setPhase('completed');
        return;
      }
      setCurrentIndex(0); 
      return;
    }

    const totalInPhase = phase === 'quiz1' ? shuffledQuestions.length : shuffledSkills.length;

    if (currentIndex < totalInPhase - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (phase === 'quiz1') {
        setPhase('review');
      } else if (phase === 'quiz2') {
        if (missedQuestions.length > 0) {
          setPhase('wrongReviewIntro');
        } else {
          setPhase('completed');
        }
      }
    }
  };

  const handleUseDailyRestore = () => {
    onRestore();
    // Restore to the phase-specific max hearts
    setHearts(phase === 'quiz1' ? 5 : 3);
    setIsGameOver(false);
    setFeedback(null);
  };

  if (phase === 'completed') {
    return (
      <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white dark:bg-gray-950 z-[100] flex flex-col items-center justify-center p-6 text-center">
        <MotionDiv initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-xl ring-4 ring-yellow-50">
          <Trophy className="w-12 h-12 text-white" />
        </MotionDiv>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Mastery Achieved!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold text-sm">You passed all phases and corrected all mistakes for <br/> <span className="text-blue-600">"{lesson.title}"</span>.</p>
        <div className="flex gap-4 mb-10">
           <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-3 rounded-2xl border-2 border-blue-100 shadow-sm">
              <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">XP Bonus</p>
              <p className="text-2xl font-black text-blue-600">+{lesson.xpReward}</p>
           </div>
        </div>
        <MotionButton whileTap={{ scale: 0.95 }} onClick={() => onComplete(lesson.xpReward)} className="w-full max-w-sm py-4 bg-green-500 text-white rounded-2xl font-black text-lg shadow-[0_5px_0_0_#15803d]">
          FINISH LESSON
        </MotionButton>
      </MotionDiv>
    );
  }

  if (phase === 'wrongReviewIntro') {
    return (
      <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white dark:bg-gray-950 z-[95] flex flex-col items-center justify-center p-6 text-center">
        <MotionDiv initial={{ y: 20 }} animate={{ y: 0 }} className="w-24 h-24 bg-blue-100 dark:bg-blue-900/40 rounded-3xl flex items-center justify-center mb-8">
           <RefreshCw className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin-slow" />
        </MotionDiv>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Let's review the exercises you missed!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold text-lg max-w-sm leading-snug">
          You have <span className="text-blue-600">{missedQuestions.length} remaining tasks</span> to clear before finishing the lesson.
        </p>
        <MotionButton 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setPhase('wrongReview')} 
          className="w-full max-w-xs py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-[0_5px_0_0_#1d4ed8] flex items-center justify-center gap-3"
        >
          START REDEMPTION <ArrowRight />
        </MotionButton>
      </MotionDiv>
    );
  }

  if (phase === 'review') {
    const videoUrl = lesson.tutorialContent.videoUrl;
    // Add autoplay parameter on interaction
    const finalVideoUrl = videoUrl ? `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=${hasInteractedWithVideo ? '1' : '0'}` : '';

    return (
      <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white dark:bg-gray-950 z-[90] flex flex-col overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full p-6 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><BookOpen size={24} /></div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Theory Checkpoint</h2>
              <p className="text-blue-500 font-black uppercase text-[10px] tracking-widest">Master the content before continuing</p>
            </div>
          </div>
          
          <div className="mb-10 text-center">
             <MotionDiv 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-red-200"
             >
                Mandatory: Watch Tutorial Video
             </MotionDiv>
             {videoUrl && (
              <div className="relative group">
                <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-black border-[6px] border-gray-100 dark:border-gray-800 shadow-2xl transition-all group-hover:shadow-blue-200/50">
                  <iframe 
                    className="w-full h-full" 
                    src={finalVideoUrl} 
                    allowFullScreen 
                    title="Tutorial" 
                  />
                  {!hasInteractedWithVideo && (
                    <div 
                      onClick={() => setHasInteractedWithVideo(true)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/40 transition-all z-10"
                    >
                       <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.7)] group-hover:scale-110 transition-transform">
                          <Play size={40} className="fill-current ml-1" />
                       </div>
                       <div className="mt-8 text-white text-center">
                          <p className="font-black text-xl uppercase tracking-widest mb-2">Watch to Unlock</p>
                          <p className="font-bold text-sm text-white/70 uppercase tracking-widest">Must be played before skills check</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-[2rem] border-2 border-blue-100 dark:border-blue-900/40">
              <h3 className="font-black text-blue-800 dark:text-blue-300 text-sm mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Mastery Points
              </h3>
              <ul className="space-y-5">
                {lesson.tutorialContent.points.map((p, i) => (
                  <li key={i} className="flex gap-4 text-sm font-bold text-blue-900 dark:text-blue-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black">{i+1}</div>
                    <span className="leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[2rem] border-2 border-amber-100 dark:border-amber-900/40 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
                <Lightbulb className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-amber-900 dark:text-amber-200 text-lg font-black italic px-4 leading-relaxed">
                "{lesson.tutorialContent.proTip}"
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {!hasInteractedWithVideo && (
              <p className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <AlertCircle size={14} /> Video interaction required to proceed
              </p>
            )}
            <MotionButton 
              whileTap={hasInteractedWithVideo ? { scale: 0.95 } : {}} 
              disabled={!hasInteractedWithVideo}
              onClick={() => setPhase('quiz2')} 
              className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all ${
                hasInteractedWithVideo 
                  ? 'bg-blue-600 text-white shadow-[0_8px_0_0_#1d4ed8] hover:-translate-y-1' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              START STEP-BY-STEP SKILLS <ChevronRight />
            </MotionButton>
          </div>
        </div>
      </MotionDiv>
    );
  }

  if (isGameOver) {
    return (
      <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white dark:bg-gray-950 z-[110] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
           <Heart className="w-24 h-24 text-gray-100 dark:text-gray-800 fill-current" />
           <MotionDiv 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }} 
             transition={{ type: 'spring', delay: 0.2 }}
             className="absolute inset-0 flex items-center justify-center"
           >
              <XCircle className="w-10 h-10 text-red-500 bg-white rounded-full" />
           </MotionDiv>
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Out of Hearts!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold text-lg max-w-xs leading-tight">Don't give up! Use your free daily restore to keep learning.</p>
        
        <div className="w-full max-w-sm space-y-4">
          {canRestore && (
            <MotionButton 
              whileTap={{ scale: 0.95 }}
              onClick={handleUseDailyRestore} 
              className="w-full py-5 bg-green-500 text-white rounded-[2rem] font-black text-xl shadow-[0_6px_0_0_#15803d] hover:brightness-105 flex items-center justify-center gap-3 transition-all"
            >
              <RotateCcw className="w-6 h-6" /> FREE DAILY RESTORE
            </MotionButton>
          )}
          <MotionButton 
            whileTap={{ scale: 0.95 }}
            onClick={onQuit} 
            className="w-full py-5 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-[0_4px_0_0_#f3f4f6] dark:shadow-none flex items-center justify-center gap-3"
          >
            <LogOut size={18} /> EXIT TO ROADMAP
          </MotionButton>
        </div>
      </MotionDiv>
    );
  }

  const isPractical = currentQuestion?.type === QuestionType.DRAG_DROP;
  const totalStepsInPhase = phase === 'quiz1' ? shuffledQuestions.length : phase === 'quiz2' ? shuffledSkills.length : missedQuestions.length;
  const progressPercent = (currentIndex / totalStepsInPhase) * 100;

  // Dynamically determine heart visibility based on max for the phase
  const maxHearts = (phase === 'quiz2' || phase === 'wrongReview') ? 3 : 5;

  return (
    <MotionDiv initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full p-4 flex items-center gap-4">
        <button onClick={() => setShowQuitConfirmation(true)} className="p-2 text-gray-300 hover:text-gray-500 transition-colors"><ChevronLeft size={28} /></button>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
             <div className="flex items-center gap-1.5"><Clock size={12} /> {Math.floor(seconds/60)}:{(seconds%60).toString().padStart(2, '0')}</div>
             <div>
               {phase === 'quiz1' && `Concept Mastery (${currentIndex + 1}/${shuffledQuestions.length})`}
               {phase === 'quiz2' && `Step-by-Step Skills (${currentIndex + 1}/${shuffledSkills.length})`}
               {phase === 'wrongReview' && `Redemption (${missedQuestions.length} remaining)`}
             </div>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border-2 border-gray-50">
             <MotionDiv animate={{ width: `${progressPercent}%` }} className={`h-full ${phase === 'wrongReview' ? 'bg-orange-500' : isPractical ? 'bg-indigo-500' : 'bg-green-500'}`} />
          </div>
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(h => {
            const isVisible = h <= maxHearts;
            if (!isVisible) return null;
            return (
              <Heart key={h} className={`w-7 h-7 ${h <= hearts ? 'text-red-500 fill-current' : 'text-gray-100 dark:text-gray-800'}`} />
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <AnimatePresence mode="wait">
            <MotionDiv 
              key={`${phase}-${currentIndex}-${currentQuestion?.id}`} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className={`flex flex-col h-full items-center justify-center`}
            >
              
              {isPractical && currentQuestion ? (
                <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-3">
                       <div className="flex items-center justify-center gap-3">
                          <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${phase === 'wrongReview' ? 'text-orange-500' : 'text-indigo-500'}`}>
                            {phase === 'wrongReview' ? 'Redemption Task' : 'Practical Drill'}
                          </span>
                       </div>
                       <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">{currentQuestion.prompt}</h2>
                       <div className="flex justify-center gap-3">
                          {currentQuestion.category && (
                             <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400">
                                {currentQuestion.category} Ribbon
                             </div>
                          )}
                          {currentQuestion.difficulty && (
                             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                currentQuestion.difficulty === Difficulty.EASY ? 'bg-green-50 text-green-600' :
                                currentQuestion.difficulty === Difficulty.INTERMEDIATE ? 'bg-yellow-50 text-yellow-600' :
                                'bg-red-50 text-red-600'
                             }`}>
                                <Star size={10} className="fill-current"/> {currentQuestion.difficulty}
                             </div>
                          )}
                       </div>
                       <p className="text-gray-400 font-bold text-xs pt-2">Drag the steps into the correct order below:</p>
                    </div>

                    <div className="relative mt-4 max-h-[55vh] overflow-y-auto px-2 no-scrollbar">
                      <Reorder.Group axis="y" values={draggedSteps} onReorder={setDraggedSteps} className="space-y-3">
                        {draggedSteps.map((step, idx) => (
                          <Reorder.Item 
                            key={step} 
                            value={step}
                            /* Fixed: Reorder.Item does not support 'disabled'. Use 'dragListener' instead. */
                            dragListener={!feedback}
                            whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
                            className={`p-4 sm:p-5 bg-white dark:bg-gray-900 border-2 rounded-2xl flex items-center gap-4 shadow-sm select-none ${
                              feedback ? (feedback.isCorrect ? 'border-green-200 opacity-60' : 'border-red-200 opacity-60') : 'border-gray-100 dark:border-gray-800 cursor-grab active:cursor-grabbing hover:border-indigo-100'
                            }`}
                          >
                            <GripVertical className="text-gray-300 shrink-0 w-5 h-5" />
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
                               {idx + 1}
                            </div>
                            <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-200 leading-tight flex-1">{step}</span>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                </div>
              ) : (
                <div className="w-full max-w-xl text-center space-y-6">
                   <div className="flex items-center justify-center gap-3">
                      {currentQuestion?.category && (
                        <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          phase === 'wrongReview' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                           {currentQuestion.category} Ribbon
                        </div>
                      )}
                      {currentQuestion?.difficulty && (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          currentQuestion.difficulty === Difficulty.EASY ? 'bg-green-50 text-green-600' :
                          currentQuestion.difficulty === Difficulty.INTERMEDIATE ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                           <Star size={12} className="fill-current"/> {currentQuestion.difficulty}
                        </div>
                      )}
                   </div>
                   <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">{currentQuestion?.prompt}</h2>
                   <div className="grid gap-3">
                      {currentQuestion?.options?.map((opt, i) => {
                         const isWrongInHistory = currentQuestion && wrongAnswersHistory[currentQuestion.id]?.includes(opt);
                         return (
                           <button 
                            key={opt} 
                            disabled={isWrongInHistory || !!feedback} 
                            onClick={() => setSelectedOption(opt)} 
                            className={`p-5 text-left border-2 rounded-2xl font-bold text-base transition-all relative ${
                              isWrongInHistory
                                ? 'opacity-40 border-gray-100 bg-gray-50 line-through text-gray-300'
                                : selectedOption === opt
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_4px_0_0_#1d4ed8] -translate-y-0.5'
                                  : 'border-gray-100 dark:border-gray-800 hover:border-blue-100 bg-white dark:bg-gray-900 shadow-[0_4px_0_0_#f3f4f6]'
                           }`}
                           >
                              {opt}
                           </button>
                         );
                      })}
                   </div>
                </div>
              )}
            </MotionDiv>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showQuitConfirmation && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
          >
            <MotionDiv 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl text-center border-4 border-gray-100 dark:border-gray-800"
            >
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600 dark:text-amber-400">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Wait, don’t go!</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-8 leading-relaxed">
                You’ll lose your progress if you quit now. Are you sure you want to exit?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowQuitConfirmation(false)}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-[0_5px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest"
                >
                  Keep Learning
                </button>
                <button 
                  onClick={onQuit}
                  className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  End Session
                </button>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className={`p-6 sm:p-8 border-t-2 transition-all duration-300 ${
        feedback ? (feedback.isCorrect ? 'bg-green-100 border-green-300 dark:bg-green-900/40' : 'bg-red-100 border-red-300 dark:bg-red-900/40') : isTimeUp ? 'bg-amber-100 border-amber-300 dark:bg-amber-900/40' : 'bg-white dark:bg-gray-950 border-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            {feedback ? (
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {feedback.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                   <h3 className={`text-xl font-black ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>{feedback.isCorrect ? 'Spectacular!' : 'Needs Review:'}</h3>
                   <p className="text-sm font-bold opacity-80 dark:text-gray-300">{feedback.text}</p>
                </div>
              </div>
            ) : isTimeUp ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 bg-amber-500">
                  <Clock size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-amber-800">Time's Up!</h3>
                   <p className="text-sm font-bold opacity-80 dark:text-gray-300">The timer ran out. You cannot answer this question anymore.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Info size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">Tip: Earn XP by completing all phases of this lesson!</p>
              </div>
            )}
          </div>
          <button 
            onClick={feedback ? handleNext : (isTimeUp ? handleNext : handleCheck)} 
            disabled={(phase !== 'quiz2' && phase !== 'wrongReview' && !selectedOption && !isPractical && !isTimeUp) || isEvaluating} 
            className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-lg text-white transition-all ${
            feedback 
              ? (feedback.isCorrect ? 'bg-green-500 shadow-[0_5px_0_0_#15803d]' : 'bg-red-500 shadow-[0_5px_0_0_#b91c1c]') 
              : isTimeUp
                ? 'bg-amber-500 shadow-[0_5px_0_0_#b45309]'
                : (selectedOption || isPractical)
                  ? (isPractical ? 'bg-indigo-600 shadow-[0_5px_0_0_#4338ca]' : 'bg-blue-600 shadow-[0_5_0_0_#1d4ed8]') 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}>
             {isEvaluating ? <Loader2 className="animate-spin mx-auto" size={24} /> : feedback ? 'CONTINUE' : isTimeUp ? 'SKIP QUESTION' : (isPractical ? 'VERIFY DRILL' : 'CHECK')}
          </button>
        </div>
      </div>
    </MotionDiv>
  );
};
