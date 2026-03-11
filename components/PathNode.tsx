
import React from 'react';
import { Lock, Check, Play } from 'lucide-react';
import { OfficeTool } from '@/types';
import { motion } from 'motion/react';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface PathNodeProps {
  id: string;
  title: string;
  tool: OfficeTool;
  status: 'locked' | 'available' | 'completed';
  onClick: () => void;
  index: number;
}

export const PathNode: React.FC<PathNodeProps> = ({ title, tool, status, onClick, index }) => {
  const isAvailable = status === 'available';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  const toolColors = {
    Excel: { bg: 'bg-green-500', shadow: 'shadow-[0_8px_0_0_#15803d]', active: 'active:shadow-none active:translate-y-2', pulseColor: 'rgba(34, 197, 94, 0.4)' },
    Word: { bg: 'bg-blue-500', shadow: 'shadow-[0_8px_0_0_#1d4ed8]', active: 'active:shadow-none active:translate-y-2', pulseColor: 'rgba(59, 130, 246, 0.4)' },
    PowerPoint: { bg: 'bg-orange-500', shadow: 'shadow-[0_8px_0_0_#c2410c]', active: 'active:shadow-none active:translate-y-2', pulseColor: 'rgba(249, 115, 22, 0.4)' },
    Placement: { bg: 'bg-indigo-500', shadow: 'shadow-[0_8px_0_0_#4338ca]', active: 'active:shadow-none active:translate-y-2', pulseColor: 'rgba(99, 102, 241, 0.4)' }
  };

  const colors = toolColors[tool as keyof typeof toolColors] || toolColors.Placement;

  // Snake pattern logic: 0, 1, 2, 1, 0, -1, -2, -1
  const getSnakeOffset = (i: number) => {
    const pattern = [0, 1, 2, 1, 0, -1, -2, -1];
    return pattern[i % pattern.length];
  };

  const offsetMultiplier = getSnakeOffset(index);
  
  // Map multiplier to Tailwind translate classes
  const getTranslateClass = (multiplier: number) => {
    switch (multiplier) {
      case 2: return 'translate-x-16 sm:translate-x-24';
      case 1: return 'translate-x-8 sm:translate-x-12';
      case -1: return '-translate-x-8 sm:-translate-x-12';
      case -2: return '-translate-x-16 sm:-translate-x-24';
      default: return 'translate-x-0';
    }
  };

  const translateClass = getTranslateClass(offsetMultiplier);

  return (
    <div className={`flex flex-col items-center mb-12 sm:mb-16 transition-all duration-500 ease-in-out ${translateClass}`}>
      <div className="relative group">
        {/* Subtle background pulse for Available nodes */}
        {isAvailable && (
          <MotionDiv
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full blur-xl z-0"
            style={{ backgroundColor: colors.pulseColor }}
          />
        )}

        {/* Tooltip on Desktop */}
        {!isLocked && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 lg:group-hover:opacity-100 transition-all duration-200 transform translate-y-2 lg:group-hover:translate-y-0 pointer-events-none hidden sm:block z-20">
            <div className="bg-white border-2 border-gray-200 px-4 py-2 rounded-2xl shadow-xl whitespace-nowrap">
              <p className="text-sm font-black text-gray-800">{title}</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
            </div>
          </div>
        )}

        <MotionButton
          onClick={!isLocked ? onClick : undefined}
          whileHover={!isLocked ? { scale: 1.08, y: -2 } : {}}
          whileTap={!isLocked ? { scale: 0.92, y: 4 } : {}}
          animate={isAvailable ? {
            scale: [1, 1.03, 1],
          } : {}}
          transition={isAvailable ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all ${
            isLocked 
              ? 'bg-gray-200 shadow-[0_8px_0_0_#d1d5db] cursor-not-allowed opacity-80' 
              : isCompleted
                ? 'bg-yellow-400 shadow-[0_8px_0_0_#ca8a04] ring-4 ring-yellow-100'
                : `${colors.bg} ${colors.shadow} ${colors.active}`
          } ${isCompleted ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : ''}`}
        >
          {isLocked ? (
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          ) : isCompleted ? (
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[4px]" />
          ) : (
            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-current ml-1" />
          )}
        </MotionButton>

        {isAvailable && (
          <MotionDiv 
            animate={{ 
              y: [0, -6, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-white px-2 py-0.5 sm:py-1 rounded-lg text-[8px] sm:text-[10px] font-black shadow-[0_2px_0_0_#ca8a04] pointer-events-none z-20"
          >
            NEW
          </MotionDiv>
        )}
      </div>
      <p className={`mt-3 sm:mt-4 font-black text-sm sm:text-lg text-center transition-colors duration-300 ${
        isLocked ? 'text-gray-300' : isCompleted ? 'text-yellow-600' : 'text-gray-700'
      }`}>
        {isLocked ? '???' : title}
      </p>
    </div>
  );
};
