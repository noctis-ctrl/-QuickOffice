import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Users, 
  Zap, 
  Sparkles, 
  ChevronDown,
  Layout,
  ShieldCheck,
  Star,
  Cpu,
  FileText,
  BarChart3,
  CheckCircle2,
  PlayCircle,
  Award,
  BookOpen,
  MousePointer2
} from 'lucide-react';

import { QuickOfficeLogo } from './Logo';

const MotionDiv = motion.div as any;

interface DashboardProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onGetStarted, onLogin }) => {
  const [researcherIndex, setResearcherIndex] = useState(0);
  
  const team = [
    { name: "Ivan Matthew Acosta", role: "Project Leader" },
    { name: "Josh R. Balbin", role: "Member" },
    { name: "John David Casaberde", role: "Member" },
    { name: "Jordan Kyle R. Constantino", role: "Member" },
    { name: "Carl D. Faltado", role: "Member" },
    { name: "John Mark Jimenez", role: "Member" },
    { name: "Judiel Matthew R. Torres", role: "Member" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setResearcherIndex(prev => (prev + 1) % team.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [team.length]);

  return (
    <div className="min-h-screen bg-white font-['Nunito'] text-gray-800 selection:bg-blue-100 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden py-20 z-10">
        {/* Decorative Blobs */}
        <div className="absolute top-[-15%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-400/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-400/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

        <MotionDiv 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl relative z-20"
        >
          {/* Brand Logo & Name */}
          <div className="inline-flex flex-col items-center mb-8 sm:mb-12 pointer-events-none">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse" />
              <div className="relative transition-transform hover:scale-105 duration-300">
                <QuickOfficeLogo className="w-24 h-24 sm:w-32 sm:h-32 shadow-2xl" iconClassName="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Quick<span className="text-blue-600">Office</span>
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mt-2" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tighter leading-[1.1] sm:leading-[0.95]">
            Master Your <span className="text-blue-600">Digital</span> Future
          </h1>
          
          <p className="text-lg sm:text-2xl md:text-3xl text-gray-400 font-bold mb-10 sm:mb-14 leading-relaxed max-w-3xl mx-auto">
            Turn your academic potential into professional power. Master the industry-standard tools of the modern world with interactive, high-impact expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto relative z-30">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onGetStarted();
              }}
              className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-6 bg-blue-600 text-white rounded-2xl sm:rounded-[2.5rem] font-black text-lg sm:text-2xl shadow-[0_6px_0_0_#1d4ed8] sm:shadow-[0_8px_0_0_#1d4ed8] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 sm:gap-4 group cursor-pointer"
            >
              GET STARTED <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLogin();
              }}
              className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-6 bg-white text-blue-600 border-b-4 sm:border-b-8 border-2 border-gray-100 rounded-2xl sm:rounded-[2.5rem] font-black text-lg sm:text-2xl hover:bg-gray-50 active:translate-y-2 active:border-b-0 transition-all cursor-pointer"
            >
              I HAVE AN ACCOUNT
            </button>
          </div>
        </MotionDiv>

        <MotionDiv 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 sm:bottom-10 pointer-events-none"
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-gray-200" />
        </MotionDiv>
      </section>

      {/* Mission Section */}
      <section className="relative py-16 sm:py-32 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="space-y-6 sm:space-y-10">
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 bg-orange-50 text-orange-600 rounded-full text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" /> The Core Mission
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.2] sm:leading-[1.1]">
              Bridging the Digital <span className="text-orange-500">Skills Gap</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-lg sm:text-xl text-gray-500 font-bold leading-relaxed">
              <p>
                In an era where digital literacy is non-negotiable, QuickOffice serves as a catalyst for student success. We provide a structured environment to master Microsoft Office tools—Excel, Word, and PowerPoint—which are essential for both academic excellence and professional readiness.
              </p>
              <p className="bg-gray-50 p-6 sm:p-8 rounded-3xl sm:rounded-[3rem] border-2 border-gray-100 text-gray-700 italic">
                "Our platform is designed specifically for the students of GFIS Laguna, ensuring that every learner has the resources to transition from basic computer users to advanced technical specialists."
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
            {[
              { icon: <ShieldCheck />, label: "Proven Logic", desc: "Structured learning paths" },
              { icon: <Zap />, label: "Bite-Sized", desc: "Master skills in minutes" },
              { icon: <Layout />, label: "Visual Design", desc: "Clean and intuitive UI" },
              { icon: <Star />, label: "Achievement", desc: "Real progress tracking" }
            ].map((feature, i) => (
              <div key={i} className={`bg-white border-2 border-gray-100 p-6 sm:p-8 rounded-3xl sm:rounded-[3rem] shadow-sm hover:shadow-xl transition-all ${i % 2 !== 0 ? 'sm:translate-y-12' : ''}`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2">{feature.label}</h4>
                <p className="text-gray-400 font-bold text-sm sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 sm:py-32 bg-white z-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tight">Tools We <span className="text-blue-600">Master</span></h2>
            <p className="text-gray-400 font-bold text-lg sm:text-xl max-w-2xl mx-auto">We focus on the essential suite that powers the global workforce.</p>
          </div>
          
          <div className="space-y-8 sm:space-y-12">
            {[
              { 
                tool: "Microsoft Excel", 
                desc: "From basic formulas to complex data analysis and visualization.", 
                color: "bg-green-600", 
                icon: <BarChart3 className="w-10 h-10" />,
                features: ["Data Management", "Complex Formulas", "Pivot Tables"]
              },
              { 
                tool: "Microsoft Word", 
                desc: "Master professional document creation, formatting, and collaboration.", 
                color: "bg-blue-600", 
                icon: <FileText className="w-10 h-10" />,
                features: ["Academic Formatting", "Mail Merge", "Review Tools"]
              },
              { 
                tool: "Microsoft PowerPoint", 
                desc: "Create high-impact presentations that captivate and inform.", 
                color: "bg-orange-600", 
                icon: <Layout className="w-10 h-10" />,
                features: ["Slide Design", "Animations", "Presenter Tools"]
              }
            ].map((item, i) => (
              <div key={i} className="group flex flex-col lg:flex-row items-center gap-8 sm:gap-12 p-8 sm:p-12 bg-gray-50 rounded-[3rem] border-2 border-transparent hover:border-blue-100 transition-all">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 ${item.color} rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl sm:text-4xl font-black mb-4">{item.tool}</h3>
                  <p className="text-gray-500 font-bold text-lg mb-8 max-w-2xl">{item.desc}</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    {item.features.map(f => (
                      <span key={f} className="px-4 py-2 bg-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 border border-gray-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Why QuickOffice Section */}
      <section className="py-20 bg-gray-50/50 z-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Why Choose <span className="text-blue-600">QuickOffice?</span></h2>
            <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto">Built by researchers, for students. We've optimized the learning experience for maximum retention.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-4">Interactive Path</h3>
              <p className="text-gray-500 font-bold leading-relaxed">A gamified roadmap that tracks your progress through every tool, making learning feel like an adventure.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-4">Real-World Skills</h3>
              <p className="text-gray-500 font-bold leading-relaxed">Lessons are based on actual workplace scenarios, ensuring you're ready for the demands of the modern office.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-4">Postgres Powered</h3>
              <p className="text-gray-500 font-bold leading-relaxed">Your progress is securely synced to our database, allowing you to pick up exactly where you left off on any device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 bg-white z-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6">How It <span className="text-blue-600">Works</span></h2>
            <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto">Three simple steps to becoming a suite master.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 sm:gap-16">
            {[
              { 
                step: "01", 
                title: "Learn Theory", 
                desc: "Watch high-quality tutorials and master the core concepts of each tool.", 
                icon: <PlayCircle className="w-8 h-8" />,
                color: "text-blue-600"
              },
              { 
                step: "02", 
                title: "Practice Drills", 
                desc: "Apply what you've learned through interactive performance tasks and quizzes.", 
                icon: <MousePointer2 className="w-8 h-8" />,
                color: "text-green-600"
              },
              { 
                step: "03", 
                title: "Earn Badges", 
                desc: "Complete stages to unlock achievements and build your digital portfolio.", 
                icon: <Award className="w-8 h-8" />,
                color: "text-orange-600"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl sm:text-9xl font-black text-gray-50 absolute -top-12 -left-4 group-hover:text-blue-50 transition-colors -z-10">
                  {item.step}
                </div>
                <div className={`w-16 h-16 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-gray-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 sm:py-40 overflow-hidden bg-white z-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
          <div className="flex-1 space-y-6 sm:space-y-10 w-full">
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" /> The Research Team
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 leading-none">
              Meet the <br/> <span className="text-blue-600">Innovators</span>
            </h2>
            <p className="text-gray-500 font-bold text-lg leading-relaxed">
              Our team consists of dedicated researchers from GFIS Laguna, committed to developing educational tools that empower the next generation of digital professionals.
            </p>
            <div className="flex gap-3">
               {team.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setResearcherIndex(i)}
                  className={`h-2 rounded-full transition-all duration-700 ${i === researcherIndex ? 'w-12 sm:w-16 bg-blue-600' : 'w-3 sm:w-4 bg-gray-200'}`}
                 />
               ))}
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center w-full min-h-[400px] sm:min-h-[450px]">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={researcherIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full max-w-lg bg-white border-t-[1px] border-x-[1px] border-b-[8px] sm:border-b-[12px] border-gray-100 rounded-3xl sm:rounded-[4rem] p-8 sm:p-16 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] sm:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex flex-col items-center text-center"
              >
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center text-white mb-6 sm:mb-10 shadow-xl sm:shadow-2xl ${team[researcherIndex].role === 'Project Leader' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                  {team[researcherIndex].role === 'Project Leader' ? <Star className="w-12 h-12 sm:w-16 sm:h-16 fill-current" /> : <Users className="w-12 h-12 sm:w-16 sm:h-16" />}
                </div>
                <h3 className="text-3xl sm:text-5xl font-black text-gray-900 mb-2 sm:mb-4 tracking-tighter leading-tight">
                  {team[researcherIndex].name}
                </h3>
                <div className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-4 sm:mb-6 shadow-sm ${
                  team[researcherIndex].role === 'Project Leader' ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {team[researcherIndex].role}
                </div>
              </MotionDiv>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-32 bg-white z-10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-blue-600 rounded-[3rem] sm:rounded-[4rem] p-10 sm:p-20 text-white shadow-2xl relative overflow-hidden">
             {/* Decorative Background for CTA */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
             
             <div className="relative z-10">
                <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tighter leading-tight">Ready to Start Your <br/> Journey?</h2>
                <p className="text-lg sm:text-xl text-blue-100 font-bold mb-12 max-w-2xl mx-auto">Join hundreds of students mastering the tools of tomorrow. It's free, interactive, and built for your success.</p>
                <button 
                  onClick={onGetStarted}
                  className="px-10 sm:px-16 py-5 sm:py-7 bg-white text-blue-600 rounded-2xl sm:rounded-[2.5rem] font-black text-xl sm:text-2xl shadow-[0_8px_0_0_#d1d5db] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4 mx-auto group"
                >
                  CREATE ACCOUNT <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100 z-10 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 font-bold text-sm">
            © 2025 QuickOffice. Empowering GFIS Laguna students for the digital workplace.
          </p>
        </div>
      </footer>
    </div>
  );
};
