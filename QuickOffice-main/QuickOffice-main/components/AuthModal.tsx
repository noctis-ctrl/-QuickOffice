
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, UserPlus, LogIn, ChevronLeft, CheckCircle2, Zap } from 'lucide-react';
import { User } from '@/types';
import { api } from '@/services/api';
import { QuickOfficeLogo } from './Logo';

const MotionDiv = motion.div as any;

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ fullname?: string; email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrors({});
      setShowPassword(false);
      setFormData({ fullname: '', email: '', password: '' });
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    setErrors({});
  }, [mode]);

  const validate = () => {
    const e: typeof errors = {};
    
    if (mode === 'signup') {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!formData.fullname.trim()) {
        e.fullname = 'Full name is required';
      } else if (!nameRegex.test(formData.fullname)) {
        e.fullname = 'Names cannot contain numbers or symbols';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      e.email = 'Email address is required';
    } else if (!formData.email.includes('@')) {
      e.email = 'Email must include the "@" symbol';
    } else if (!emailRegex.test(formData.email)) {
      e.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      e.password = 'Password is required';
    } else if (formData.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});

    try {
      const health = await api.checkHealth();
      if (!health.ok) {
        setErrors({ general: health.message });
        setIsLoading(false);
        return;
      }

      if (mode === 'login') {
        const response = await api.login({ email: formData.email, password: formData.password });
        if (response.user) {
          if (response.token) localStorage.setItem('quickoffice_token', response.token);
          onLogin(response.user);
          onClose();
        }
      } else {
        const response = await api.signup(formData);
        if (response.user) {
          if (response.token) localStorage.setItem('quickoffice_token', response.token);
          onLogin(response.user);
          onClose();
        }
      }
    } catch (err: any) {
      // If server is not running, provide local fallback or helpful message
      const isConnectionError = err.message.includes('Network response') || err.message.includes('fetch');
      
      if (isConnectionError) {
        // Fallback to local storage mock for development purposes if server is down
        const db = JSON.parse(localStorage.getItem('quickoffice_mock_db') || '[]');
        if (mode === 'login') {
          const found = db.find((u: any) => u.email === formData.email && u.password === formData.password);
          if (found) {
            onLogin(found);
            onClose();
            return;
          }
        }
        setErrors({ general: 'Could not connect to PostgreSQL. Is your backend server running?' });
      } else {
        setErrors({ general: err.message || 'Authentication failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  function ErrorDisplay({ message }: { message?: string }) {
    return (
      <div className="h-6 flex items-center pointer-events-none">
        {message && (
          <p className="text-[11px] font-bold text-red-500 ml-2 flex items-center gap-1.5">
            <AlertCircle size={12} className="shrink-0" /> 
            <span>{message}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 overflow-y-auto">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-colors">
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <MotionDiv key="login" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="text-center">
                    <QuickOfficeLogo className="w-20 h-20 mx-auto mb-6 shadow-2xl" iconClassName="w-10 h-10" />
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">Welcome Back</h1>
                  </div>
                  
                  {errors.general && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 font-bold text-xs border border-red-100 dark:border-red-900/40 mb-4">
                      <AlertCircle size={18}/>
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-1">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Email Address <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                      <input 
                        type="email" 
                        placeholder="e.g. carl@example.com" 
                        value={formData.email} 
                        onChange={(e) => {
                          setFormData({...formData, email: e.target.value});
                          if(errors.email) setErrors(prev => ({...prev, email: undefined}));
                        }} 
                        className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all dark:text-white ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700'}`} 
                      />
                      <ErrorDisplay message={errors.email} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Password <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={formData.password} 
                          onChange={(e) => {
                            setFormData({...formData, password: e.target.value});
                            if(errors.password) setErrors(prev => ({...prev, password: undefined}));
                          }} 
                          className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all dark:text-white ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700'}`} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                      </div>
                      <ErrorDisplay message={errors.password} />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-[0_6px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                      {isLoading ? <Loader2 className="animate-spin" /> : <>LOG IN <LogIn size={20}/></>}
                    </button>
                  </form>
                  <p className="text-center font-bold text-gray-400 text-sm italic">New to QuickOffice? <button onClick={() => setMode('signup')} className="text-blue-600 font-black hover:underline">Create Account</button></p>
                </MotionDiv>
              ) : (
                <MotionDiv key="signup" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-8">
                  <div className="text-center">
                    <button onClick={() => setMode('login')} className="absolute top-8 left-8 flex items-center gap-1 font-black text-xs text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                      <ChevronLeft size={16}/> Back
                    </button>
                    <QuickOfficeLogo className="w-20 h-20 mx-auto mb-6 shadow-2xl" iconClassName="w-10 h-10" />
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create your profile</h1>
                  </div>

                  {errors.general && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 font-bold text-xs border border-red-100 dark:border-red-900/40 mb-4">
                      <AlertCircle size={18}/>
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-1">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Full Name <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. Carl Faltado" 
                        value={formData.fullname} 
                        onChange={(e) => {
                          setFormData({...formData, fullname: e.target.value});
                          if(errors.fullname) setErrors(prev => ({...prev, fullname: undefined}));
                        }} 
                        className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all dark:text-white ${errors.fullname ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700'}`} 
                      />
                      <ErrorDisplay message={errors.fullname} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Email Address <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                      <input 
                        type="email" 
                        placeholder="e.g. carl@example.com" 
                        value={formData.email} 
                        onChange={(e) => {
                          setFormData({...formData, email: e.target.value});
                          if(errors.email) setErrors(prev => ({...prev, email: undefined}));
                        }} 
                        className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all dark:text-white ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700'}`} 
                      />
                      <ErrorDisplay message={errors.email} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Create Password <span className="text-red-600 font-bold ml-0.5" style={{ color: '#dc2626' }}>*</span></label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Min. 6 characters" 
                          value={formData.password} 
                          onChange={(e) => {
                            setFormData({...formData, password: e.target.value});
                            if(errors.password) setErrors(prev => ({...prev, password: undefined}));
                          }} 
                          className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all dark:text-white ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-100 dark:border-gray-700'}`} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                      </div>
                      <ErrorDisplay message={errors.password} />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-[0_6px_0_0_#4338ca] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                      {isLoading ? <Loader2 className="animate-spin" /> : <>SIGN UP <ArrowRight size={20}/></>}
                    </button>
                  </form>
                  <p className="text-center font-bold text-gray-400 text-sm">Already have an account? <button onClick={() => setMode('login')} className="text-indigo-600 font-black hover:underline">Log In</button></p>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};
