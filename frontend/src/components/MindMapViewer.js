import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Lightbulb, Compass, BookOpen, Cpu, X, ChevronRight, Sparkles } from 'lucide-react';

const CHAPTERS = [
  { id: 1, name: "Thinking Smarter", icon: Brain, color: "#6366f1", count: 40, desc: "Frameworks for clearer reasoning and sharper analysis.", models: ["First Principles", "Inversion", "Second-Order Thinking", "Bayesian Thinking"] },
  { id: 2, name: "Productivity & Focus", icon: Target, color: "#ec4899", count: 40, desc: "Systems for eliminating waste and sustaining energy.", models: ["The Pareto Principle", "Deep Work", "Time Blocking", "Parkinson's Law"] },
  { id: 3, name: "Creativity", icon: Lightbulb, color: "#eab308", count: 34, desc: "Techniques for generating ideas and breaking patterns.", models: ["SCAMPER", "Lateral Thinking", "The 5 Whys", "Design Thinking"] },
  { id: 4, name: "Strategy", icon: Compass, color: "#22c55e", count: 40, desc: "Tools for evaluating options and managing risk.", models: ["Game Theory", "Opportunity Cost", "Margin of Safety", "OODA Loop"] },
  { id: 5, name: "Learning", icon: BookOpen, color: "#3b82f6", count: 30, desc: "Methods for deeper understanding and faster retention.", models: ["Feynman Technique", "Spaced Repetition", "Active Recall", "Metacognition"] },
  { id: 6, name: "AI-Powered", icon: Cpu, color: "#a855f7", count: 20, desc: "Leveraging AI as a thinking amplifier.", models: ["Prompt Engineering", "Chain-of-Thought", "Meta-Learning", "Few-Shot Learning"] }
];

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function MindMapViewer() {
  const [active, setActive] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#050505] p-4 md:p-8 font-sans flex items-center justify-center overflow-hidden relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex items-center justify-center w-full h-[600px] md:h-[800px]">

        {/* --- SVG CONNECTIONS & ANIMATED BEAMS --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            {CHAPTERS.map((ch, i) => (
              <linearGradient key={`grad-${i}`} id={`beam-grad-${i}`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor={ch.color} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            ))}
          </defs>

          {CHAPTERS.map((ch, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = isMobile ? 140 : 250;
            const x2 = `calc(50% + ${Math.cos(angle) * radius}px)`;
            const y2 = `calc(50% + ${Math.sin(angle) * radius}px)`;

            return (
              <React.Fragment key={`beam-group-${i}`}>
                {/* Static Background Path */}
                <line
                  x1="50%" y1="50%"
                  x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />

                {/* Animated Flowing Beam */}
                <motion.line
                  x1="50%" y1="50%"
                  x2={x2} y2={y2}
                  stroke={`url(#beam-grad-${i})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                  animate={{ 
                    pathOffset: [0, 1.2],
                    opacity: [0, 1, 1, 0] 
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4
                  }}
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* --- CENTRAL NODE --- */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 40px rgba(79,70,229,0.3)",
              "0 0 70px rgba(79,70,229,0.5)",
              "0 0 40px rgba(79,70,229,0.3)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="z-20 w-32 h-32 md:w-44 md:h-44 rounded-full bg-indigo-600 flex flex-col items-center justify-center border-4 border-indigo-400/50 backdrop-blur-xl"
        >
          <Brain className="text-white w-10 h-10 md:w-14 md:h-14" />
          <span className="text-white text-[10px] md:text-xs font-black mt-2 tracking-widest px-2 text-center leading-tight">
            AI-POWERED<br/>MIND
          </span>
        </motion.div>

        {/* --- CHAPTER NODES --- */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          {CHAPTERS.map((ch, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = isMobile ? 140 : 250;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ x, y }}
                className="absolute"
              >
                <button
                  onClick={() => setActive(ch)}
                  className="flex flex-col items-center group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300"
                    style={{
                      backgroundColor: '#0f0f12',
                      borderColor: active?.id === ch.id ? ch.color : '#27272a',
                      boxShadow: active?.id === ch.id ? `0 0 30px ${ch.color}60` : '0 10px 20px rgba(0,0,0,0.4)'
                    }}
                  >
                    <ch.icon size={28} style={{ color: ch.color }} />
                  </motion.div>
                  
                  <div className="absolute -bottom-10 whitespace-nowrap">
                    <span className="text-white text-[10px] md:text-xs font-bold bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full shadow-xl">
                      {ch.name}
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- DETAIL PANEL (SIDEBAR) --- */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0a0a0c]/95 backdrop-blur-2xl border-l border-zinc-800 p-8 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <Brain size={18} className="text-indigo-500" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Chapter Details</span>
                </div>
                <button 
                  onClick={() => setActive(null)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-10">
                <div className="inline-flex p-4 rounded-3xl mb-6" style={{ backgroundColor: `${active.color}15`, border: `1px solid ${active.color}30` }}>
                  <active.icon size={32} style={{ color: active.color }} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{active.name}</h2>
                <p className="text-zinc-400 text-base leading-relaxed">{active.desc}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-indigo-400" /> Mental Models
                </h3>
                <div className="grid gap-3">
                  {active.models.map((m, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
                    >
                      <span className="text-zinc-300 font-medium">{m}</span>
                      <ChevronRight size={16} className="text-zinc-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-gradient-to-b from-zinc-900 to-transparent border border-zinc-800/50">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{active.count}</span>
                  <span className="text-zinc-500 font-bold text-sm uppercase">Principles</span>
                </div>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                  This chapter contains {active.count} specialized frameworks to reprogram your cognitive workflow.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
