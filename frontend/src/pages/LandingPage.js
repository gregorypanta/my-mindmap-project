import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Brain, Zap, Target, Lightbulb, ArrowRight, Star,
  CheckCircle2, BookOpen, Users, TrendingUp, Mail,
  ExternalLink, Menu, X, ChevronDown, Sparkles, Lock
} from "lucide-react";
import MindMapViewer from "../components/MindMapViewer";

const MOCK_TESTIMONIALS = [
 { name: "Alex Rivera", role: "Senior Developer", text: "The mental models here are a game-changer for debugging complex systems." },
  { name: "Sarah Chen", role: "Product Designer", text: "Finally, a framework that bridges the gap between AI and human creativity." },
  { name: "James Wilson", role: "Startup Founder", text: "This is the manual for the next decade of leadership. Simple and profound." },
  { name: "Elena Rossi", role: "Research Scientist", text: "The Bayesian thinking chapter alone is worth 10x the price of the book." },
  { name: "Marcus Thorne", role: "Content Creator", text: "My productivity tripled once I applied the Deep Work engineering models." },
  { name: "Lina Park", role: "Marketing Strategist", text: "Strategic decision-making made easy. The First Principles section is gold." },
  { name: "David Smit", role: "AI Engineer", text: "It's rare to find a book that actually understands how to partner with AI." },
  { name: "Sofia Vega", role: "UX Lead", text: "The mental map visualization is incredible. It makes learning so much faster." },
  { name: "Dr. Aris Makris", role: "Cognitive Psychologist", text: "Surprisingly scientifically grounded. A rare bridge between theory and practice." },
  { name: "Chloe Zheng", role: "Full-stack Engineer", text: "The mental map alone is worth the price. It's my new homepage." },
  { name: "Tom Harris", role: "Operations Manager", text: "Inversion changed how I look at project risks. Saved us weeks of rework." },
  { name: "Layla Al-Farsi", role: "Strategist", text: "The 30-day plan is brutal but effective. My focus has never been sharper." },
  { name: "Oliver Bennett", role: "Founder @ TechFlow", text: "I gift this to every new hire. It aligns the team's thinking process instantly." },
  { name: "Nina Rossi", role: "Design Lead", text: "Beautifully structured. It's like a high-end toolkit for the human brain." },
  { name: "Kenji Tanaka", role: "Performance Coach", text: "Essential reading for anyone looking to optimize their mental hardware." },
  { name: "Maya Patel", role: "Venture Capitalist", text: "The ultimate filter for the noise of the modern world. High signal, zero fluff." },
  { name: "Stefan Weber", role: "Data Scientist", text: "Probabilistic thinking models applied to real life. Simply brilliant." },
  { name: "Rachel Adams", role: "E-commerce Owner", text: "I finally stopped overthinking my business decisions. This book is a relief." },
  { name: "Liam O'Connor", role: "Software Architect", text: "Second-order thinking has saved me from major architectural mistakes." },
  { name: "Isabella Moretti", role: "Philosophy Student", text: "A modern take on ancient wisdom. It’s the upgrade my education was missing." },
  { name: "George Pappas", role: "Stock Trader", text: "Managing emotions and probability is everything in trading. This book nails it." },
  { name: "Sophie Muller", role: "Art Director", text: "The SCAMPER model chapter unlocked a whole new level of creativity for my team." },
  { name: "Daniel Kim", role: "Medical Doctor", text: "Applying systems thinking to diagnostics has been surprisingly effective." },
  { name: "Emma Walsh", role: "Journalist", text: "In an era of misinformation, these mental filters are necessary." },
  { name: "Lucas Silva", role: "Software Engineer", text: "The most practical guide on mental models I've ever read. 10/10." },
  { name: "Ava Dubois", role: "Fashion Designer", text: "Thinking outside the box is easy when you have the right frameworks." },
  { name: "Noah Jensen", role: "University Professor", text: "I've added this to my recommended reading list for all my students." },
  { name: "Mia Yamamoto", role: "Project Manager", text: "The flow state engineering techniques are world-class. Transformative." },
  { name: "Ethan Hunt", role: "Security Analyst", text: "Strategic decision-making under pressure. This book is a tactical masterclass." },
  { name: "Zoe Kastner", role: "Freelance Copywriter", text: "My writing is clearer and my logic is tighter. Best $10 I've spent." },
  { name: "Adrian Popescu", role: "Game Developer", text: "Game theory applied to UX design. Mind-blowing concepts." },
  { name: "Sana Khan", role: "Human Resources", text: "Understanding how people think is key to HR. This is my secret weapon." },
  { name: "Victor Hugo", role: "Logistics Expert", text: "Optimization models that actually work in the real world." },
  { name: "Tess Gallow", role: "Environmentalist", text: "Thinking in systems is the only way to solve global problems." },
  { name: "Ivan Petrov", role: "Backend Developer", text: "Complex systems require complex thinking models. This book delivers." },
  { name: "Clara Benson", role: "Executive Assistant", text: "My organization skills reached a new peak. The time blocking models are elite." },
  { name: "Omar Syed", role: "Fintech Consultant", text: "Mental models for the AI era. Exactly what the industry needs right now." },
  { name: "Bella Swan", role: "Librarian", text: "A beautifully organized collection of human knowledge and logic." },
  { name: "Felix Dahle", role: "Music Producer", text: "Lateral thinking in the studio has led to my best work yet." },
  { name: "Grace Lee", role: "Online Educator", text: "I've started teaching these models to my own students. Total success." },
  { name: "Xavier Moore", role: "Lawyer", text: "Sharper arguments and better logic. A must-have for any professional." },
  { name: "Yara Shahidi", role: "Activist", text: "The Inversion model is perfect for identifying social bottlenecks." },
  { name: "Zane Grey", role: "Architect", text: "Designing spaces requires multi-dimensional thinking. This book is a great aid." },
  { name: "Aria Montgomery", role: "Blogger", text: "The only 'self-help' book that actually focuses on the 'how' for thinkers." },
  { name: "Caleb Rivers", role: "Podcaster", text: "I've dedicated three episodes to these models already. My audience loves it." },
  { name: "Diana Prince", role: "Historian", text: "Comparing historical patterns with these models is fascinating." },
  { name: "Eric Cartman", role: "Student", text: "Even I learned something. Respect my authority!" },
  { name: "Fiona Gallagher", role: "Entrepreneur", text: "Building a business from scratch is hard. These models made it manageable." },
  { name: "Gabe Newell", role: "Tech Visionary", text: "The future belongs to those who can think clearly. This book shows the way." },
  { name: "Hannah Baker", role: "Photographer", text: "Perspective is everything in my job. This book gave me 120 new ones." }
];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const TestimonialCard = ({ t }) => {
  const gradients = [
    "from-blue-600 to-indigo-600",
    "from-purple-600 to-pink-600",
    "from-emerald-600 to-teal-600",
    "from-orange-600 to-red-600",
    "from-indigo-600 to-purple-600"
  ];

  const randomGradient = gradients[t.name ? t.name.length % gradients.length : 0];

  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px] p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-500 group relative">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, idx) => (
          <Star key={idx} className="w-4 h-4 fill-blue-500 text-blue-500" />
        ))}
      </div>
      <p className="text-white/80 leading-relaxed mb-8 text-sm md:text-base italic">
        "{t.text || t.content || "Remarkable insights into the modern mind."}"
      </p>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${randomGradient} flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow-lg`}>
          {t.name ? t.name.charAt(0) : "U"}
        </div>
        <div>
          <p className="text-white font-bold text-sm">{t.name || "Anonymous Reader"}</p>
          <p className="text-xs text-white/40">{t.role || "Thinker"}</p>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    axios.get(`${API}/testimonials`)
      .then(res => setTestimonials(res.data))
      .catch(err => console.log("Using mock testimonials"));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API}/newsletter/subscribe`, { email });
      toast.success(res.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error("Failed to subscribe");
    }
    setIsSubmitting(false);
  };

  const chapters = [
    { icon: Brain, title: "Thinking Smarter", description: "First Principles, Second-Order Thinking, Inversion, Bayesian Thinking", count: "40 Models" },
    { icon: Zap, title: "Productivity & Focus", description: "Deep Work, Time Blocking, Energy Management, Flow State Engineering", count: "40 Models" },
    { icon: Lightbulb, title: "Creativity Mastery", description: "SCAMPER, Lateral Thinking, Design Thinking, Six Thinking Hats", count: "34 Models" },
    { icon: Target, title: "Strategic Decisions", description: "Game Theory, Expected Value, Anti-Fragility, Probabilistic Thinking", count: "40 Models" }
  ];

  const features = [
    { icon: BookOpen, title: "120+ Models", description: "Comprehensive collection of proven frameworks." },
    { icon: Sparkles, title: "AI-Enhanced", description: "Leverage AI as your ultimate thinking partner." },
    { icon: TrendingUp, title: "Actionable", description: "Real-world examples and interactive exercises." },
    { icon: Users, title: "30-Day Plan", description: "Structured program to transform your thinking." }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-400 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Dynamic Background Glows */}
      <div className="fixed top-[-30%] left-[-10%] w-[60%] h-[80%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-30%] right-[-10%] w-[60%] h-[80%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl bg-[#030303]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <a href="#!" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl group-hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 group-hover:scale-105">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              AI-Powered Mind
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {['Chapters', 'Testimonials', 'Author'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <button className="relative group overflow-hidden rounded-full px-7 py-2.5 bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20"
              onClick={() => window.open('https://aipoweredmindebook.gumroad.com/l/Aivio', '_blank')}>
              <span className="relative z-10 text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                Get the Book
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>

          <button className="md:hidden p-2 text-white/80 hover:text-white bg-white/5 rounded-lg border border-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-20 left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-b border-white/5 px-6 py-8 flex flex-col gap-6 shadow-2xl overflow-hidden">
              {['Chapters', 'Testimonials', 'Author'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-blue-400 transition-colors">
                  {item}
                </a>
              ))}
              <button className="w-full mt-2 rounded-xl py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                onClick={() => { window.open('https://aipoweredmindebook.gumroad.com/l/Aivio', '_blank'); setMobileMenuOpen(false); }}>
                Get the Book — $9.99
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8 mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">Interactive E-Book Experience</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter font-extrabold leading-[1.05] mb-6">
              Upgrade Your <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block mt-2">
                Mental OS.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Rewiring the way you think in the age of AI. Master 120+ mental models for smarter thinking, peak productivity, and strategic decision-making.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
              <button onClick={() => window.open('https://aipoweredmindebook.gumroad.com/l/Aivio', '_blank')}
                className="group relative flex items-center justify-center gap-2 rounded-full px-8 py-4 bg-white text-black font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)]">
                Get the Book — $9.99
                <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </button>
              <Link to="/mindmap"
                className="flex items-center justify-center gap-2 rounded-full px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 group">
                Explore Map
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center justify-center lg:justify-start gap-8 text-sm text-white/50 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Instant PDF Access</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>120+ Frameworks</span></div>
            </motion.div>
          </motion.div>

          {/* Enhanced Floating 3D Book Experience */}
          <motion.div initial={{ opacity: 0, scale: 0.8, rotateY: -20 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end perspective-1000 mt-10 lg:mt-0">
            <motion.div animate={{ y: [-10, 10, -10], rotateZ: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-64 md:w-[340px] h-[400px] md:h-[480px] rounded-r-3xl rounded-l-md bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#050505] border border-white/10 shadow-[20px_20px_50px_rgba(0,0,0,0.5),-10px_-10px_30px_rgba(37,99,235,0.1)] group">

              <div className="absolute right-[-8px] top-3 bottom-3 w-2 bg-gradient-to-b from-[#ddd] via-[#fff] to-[#ddd] rounded-r-sm z-[-1] shadow-inner" />
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/20 to-transparent rounded-l-md z-20" />

              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between overflow-hidden rounded-r-3xl rounded-l-md z-10">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent mix-blend-overlay" />
                <div className="mt-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 backdrop-blur-md border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tighter mb-2">AI-Powered</h3>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 leading-tight tracking-tighter">Mind</h3>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-5" />
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3 font-semibold">Gregory Pantazopoulos</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" />)}
                  </div>
                </div>
              </div>

              <div className="absolute -inset-10 bg-blue-600/20 blur-[80px] -z-20 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-y border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleIn}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mind Map Section */}
      <section id="mind-map" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Interactive Knowledge Map
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Click below to explore the exact frameworks included in the book.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
            className="p-2 md:p-4 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 backdrop-blur-sm shadow-[0_0_100px_rgba(37,99,235,0.07)]">
            <div className="relative min-h-[420px] rounded-[2rem] overflow-hidden bg-[#050505] border border-white/5">
              <MindMapViewer />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapters Section */}
      <section id="chapters" className="relative py-32 bg-[#050505] border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.03)_0%,_transparent_100%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Inside the Playbook
            </h2>
            <p className="text-white/50 text-lg">
              Four distinct categories designed to upgrade every aspect of your cognition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {chapters.map((chapter, i) => (
              <motion.article key={chapter.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
                className={`group relative p-8 md:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/40 ${i === 0 || i === 3 ? "md:row-span-2" : ""}`}>
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                  <chapter.icon className="w-48 h-48 text-blue-500" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                      <chapter.icon className="w-6 h-6 text-blue-400" />
                    </div>

                    <span className="text-xs font-mono font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full backdrop-blur-md">
                      {chapter.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 transition-colors group-hover:text-blue-400">
                      {chapter.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm md:text-base">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 relative border-t border-white/5 overflow-hidden bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">What Readers Are Saying</h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              Join <span className="text-blue-400 font-bold">5,000+ thinkers</span> who have already upgraded their Mental OS.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Row 1: Moving Left */}
          <div className="flex overflow-hidden select-none gap-6">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="flex flex-nowrap gap-6"
            >
              {[...MOCK_TESTIMONIALS, ...testimonials, ...MOCK_TESTIMONIALS].map((t, i) => (
                <TestimonialCard key={`row1-${i}`} t={t} />
              ))}
            </motion.div>
          </div>

          {/* Row 2: Moving Right */}
          <div className="flex overflow-hidden select-none gap-6">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
              className="flex flex-nowrap gap-6"
            >
              {[...MOCK_TESTIMONIALS, ...testimonials, ...MOCK_TESTIMONIALS].reverse().map((t, i) => (
                <TestimonialCard key={`row2-${i}`} t={t} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section id="author" className="py-32 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative mx-auto lg:mx-0 order-2 lg:order-1">
            <div className="relative w-72 h-96 md:w-[420px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-xl group">
              <img src="https://images.unsplash.com/photo-1638983752157-052aa1f15bf1?w=800" alt="Gregory Pantazopoulos"
                className="w-full h-full object-cover rounded-[2rem] grayscale-[0.8] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
            </div>
            {/* Stats Badge */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-8 -right-4 md:-right-12 bg-[#050505]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              <div className="flex gap-6 items-center">
                <div><p className="text-3xl md:text-4xl font-extrabold text-white">120+</p><p className="text-xs text-blue-400 font-mono mt-1">MODELS</p></div>
                <div className="w-px h-12 bg-white/10" />
                <div><p className="text-3xl md:text-4xl font-extrabold text-white">30</p><p className="text-xs text-blue-400 font-mono mt-1">DAYS</p></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-1 lg:order-2">
            <p className="text-blue-400 text-sm font-mono tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-400" /> THE CREATOR
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Designed for the Modern Thinker</h2>
            <blockquote className="border-l-4 border-blue-500 pl-6 mb-8 py-2">
              <p className="text-white/70 text-lg md:text-xl leading-relaxed italic">
                "I built this book because traditional thinking methods are failing us in the era of AI. We don't need more information; we need better filters and frameworks to process it. This is your mental toolkit for the next decade."
              </p>
            </blockquote>
            <div className="flex items-center gap-5 bg-white/[0.03] w-fit p-4 rounded-full border border-white/5">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">G</div>
              <div className="pr-4">
                <p className="text-white font-bold text-lg">Gregory Pantazopoulos</p>
                <p className="text-sm text-blue-400 font-medium">Author & Systems Thinker</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter & Final CTA */}
      <section className="py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#030303]" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="p-8 md:p-14 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-md relative overflow-hidden mb-20 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

            <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-8 border border-blue-500/20">
              <Mail className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join 5,000+ Smart Thinkers</h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto text-lg">Get one high-signal mental model delivered to your inbox every Sunday.</p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" placeholder="Enter your best email..." value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-white/10 text-white rounded-2xl h-16 px-6 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/30 text-lg" />
              <button type="submit" disabled={isSubmitting} className="rounded-2xl px-10 h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50">
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </form>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-8">Ready to Upgrade?</h2>
            <button className="group relative inline-flex items-center justify-center gap-3 rounded-full px-12 py-6 bg-white text-black font-extrabold text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(37,99,235,0.5)]"
              onClick={() => window.open('https://aipoweredmindebook.gumroad.com/l/Aivio', '_blank')}>
              Download Now — $9.99
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <p className="mt-8 text-sm text-white/40 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Secure payment via Gumroad. Instant PDF access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Mobile CTA */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 pointer-events-none">
        <button onClick={() => window.open('https://aipoweredmindebook.gumroad.com/l/Aivio', '_blank')}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-[0_10px_40px_rgba(37,99,235,0.5)] pointer-events-auto border border-blue-400/30 flex justify-center items-center gap-2 active:scale-95 transition-transform">
          Get the Book — $9.99 <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 bg-[#030303] pb-28 md:pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold text-white tracking-wide">AI-Powered Mind</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-white/40">© {new Date().getFullYear()} Gregory Pantazopoulos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
