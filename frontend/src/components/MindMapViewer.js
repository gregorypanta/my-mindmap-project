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
    <div className="w-full min-h-[600px] bg-[#050505] p-8 font-sans flex items-center justify-center overflow-hidden relative">

      {/* Central Node */}
      <div className="relative flex items-center justify-center w-full h-full">

        {/* AI Core Circle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-600 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] border-4 border-indigo-400"
        >
          <Brain className="text-white w-10 h-10 md:w-12 md:h-12" />
          <span className="text-white text-[10px] md:text-xs font-black mt-2 tracking-tighter">AI-POWERED MIND</span>
        </motion.div>

        {/* Chapter Nodes */}
        <div className="absolute inset-0 flex items-center justify-center">
          {CHAPTERS.map((ch, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = isMobile ? 140 : 250;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ x, y }}
                className="absolute"
              >
                <button
                  onClick={() => setActive(ch)}
                  className="flex flex-col items-center group transition-all"
                >
                  <div
                    className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 transition-all group-hover:scale-110 shadow-lg"
                    style={{
                        backgroundColor: '#0f0f12',
                        borderColor: active?.id === ch.id ? ch.color : '#27272a',
                        boxShadow: active?.id === ch.id ? `0 0 20px ${ch.color}40` : 'none'
                    }}
                  >
                    <ch.icon size={28} style={{ color: ch.color }} />
                  </div>
                  <span className="text-white text-[10px] md:text-xs font-bold mt-2 bg-black/50 px-2 py-1 rounded tracking-tight">
                    {ch.name}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {CHAPTERS.map((ch, i) => {
                const angle = (i * 60) * (Math.PI / 180);
                const radius = isMobile ? 140 : 250;
                return (
                    <line
                        key={i}
                        x1="50%" y1="50%"
                        x2={`calc(50% + ${Math.cos(angle) * radius}px)`}
                        y2={`calc(50% + ${Math.sin(angle) * radius}px)`}
                        stroke="white" strokeWidth="1"
                    />
                );
            })}
        </svg>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
            className="absolute top-0 right-0 h-full w-full md:w-80 bg-[#0a0a0c] border-l border-zinc-800 p-6 z-50 shadow-2xl overflow-y-auto"
          >
            <button onClick={() => setActive(null)} className="text-zinc-500 hover:text-white mb-6">
              <X size={24} />
            </button>

            <div className="mb-6">
                <div className="p-3 rounded-xl inline-block mb-3" style={{ backgroundColor: `${active.color}20` }}>
                    <active.icon size={24} style={{ color: active.color }} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{active.name}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{active.desc}</p>
            </div>

            <div className="space-y-3">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} /> Key Models
                </h3>
                {active.models.map((m, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between group hover:border-indigo-500/50 transition-colors">
                        <span className="text-zinc-300 text-sm">{m}</span>
                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-indigo-500" />
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-900">
                <div className="text-center">
                    <span className="text-3xl font-black text-white">{active.count}</span>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Total Models in this Chapter</p>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
