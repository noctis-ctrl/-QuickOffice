
import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export const QuickOfficeLogo: React.FC<LogoProps> = ({ 
  className = "w-12 h-12", 
  iconClassName = "w-6 h-6" 
}) => {
  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl overflow-hidden group ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-indigo-400/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500" />
      
      {/* Main Icon */}
      <Zap className={`${iconClassName} text-white fill-current drop-shadow-md relative z-10 transition-transform group-hover:scale-110 duration-300`} />
      
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
