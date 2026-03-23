import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { 
  Menu, X, ArrowRight, Rocket, Map, Bot, Users, Award, BookOpen, 
  GraduationCap, Code, Server, Database, Palette, LayoutDashboard, 
  ChevronRight, Star, Zap, Globe, Shield, Clock, CheckCircle2,
  Play, Sparkles, TrendingUp
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// ==========================================
// DATA CONSTANTS (Unchanged logic)
// ==========================================
const FEATURES = [
  {
    title: "Project-Driven Courses",
    desc: "Hands-on projects that build a portfolio recruiters notice.",
    icon: Rocket,
    color: "from-pink-500 to-orange-500",
    stats: "500+ Projects"
  },
  {
    title: "Guided Learning Paths",
    desc: "Structured progression from fundamentals to mastery.",
    icon: Map,
    color: "from-indigo-500 to-blue-500",
    stats: "50+ Paths"
  },
  {
    title: "AI-Powered Suggestions",
    desc: "Smart recommendations to keep you on track.",
    icon: Bot,
    color: "from-purple-500 to-pink-500",
    stats: "24/7 AI"
  },
];

const STEPS = [
  { title: "Sign Up", desc: "Create your account in 30 seconds.", icon: Users, time: "30 sec" },
  { title: "Pick a Path", desc: "Choose the right path for your goals.", icon: GraduationCap, time: "2 min" },
  { title: "Ship Projects", desc: "Build and publish real apps.", icon: Rocket, time: "Ongoing" },
];

const BENEFITS = [
  {
    title: "Mentor Reviews",
    desc: "Get expert feedback and accelerate progress.",
    img: "https://images.unsplash.com/photo-1522071820081-009",
    icon: BookOpen,
    badge: "1-on-1"
  },
  {
    title: "Community",
    desc: "Join study groups, pair programming and reviews.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    icon: Users,
    badge: "50K+ Members"
  },
  {
    title: "Verified Certificates",
    desc: "Share credentials with employers and LinkedIn.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    icon: Award,
    badge: "Industry Recognized"
  },
];

const SKILLS = [
  { name: "HTML", icon: "html5-original.svg", component: () => <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "CSS", icon: "css3-original.svg", component: () => <Palette className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "JavaScript", icon: "javascript-original.svg", component: () => <Code className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "React", icon: "react-original.svg", component: () => <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Node.js", icon: "nodejs-original.svg", component: () => <Server className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "MongoDB", icon: "mongodb-original.svg", component: () => <Database className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Tailwind CSS", icon: "tailwindcss-plain.svg", component: () => <Palette className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Git", icon: "git-original.svg", component: () => <Code className="w-6 h-6 sm:w-8 sm:h-8" /> },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer at Google",
    content: "SkillHub transformed my career. The project-based approach gave me a portfolio that actually got me hired.",
    avatar: "SC",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Full Stack Engineer",
    content: "Best learning platform I've used. The AI suggestions helped me stay on track when I felt stuck.",
    avatar: "MJ",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Software Engineer at Microsoft",
    content: "The mentor reviews are game-changing. Getting feedback from industry experts accelerated my growth 10x.",
    avatar: "PS",
    rating: 5
  }
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const SkillIcon = ({ name }) => {
  const skill = SKILLS.find(s => s.name === name);
  if (!skill) return null;
  
  const icons = {
    HTML: LayoutDashboard,
    CSS: Palette,
    JavaScript: Code,
    React: LayoutDashboard,
    'Node.js': Server,
    MongoDB: Database,
    'Tailwind CSS': Palette,
    Git: Code,
  };
  
  const IconComponent = icons[name] || Code;
  return <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />;
};

function LottieWrapper({ LottieAnim }) {
  const lottieJsonUrl = "https://assets7.lottiefiles.com/packages/lf20_w51pcehl.json";
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let mounted = true;
    fetch(lottieJsonUrl)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  if (!LottieAnim || !data) return null;
  const Lottie = LottieAnim;
  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [LottieAnim, setLottieAnim] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);

  // Motion values for cursor parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [12, -12]);
  const rotateY = useTransform(x, [-60, 60], [-12, 12]);
  const translateX = useTransform(x, [-60, 60], [-10, 10]);
  const translateY = useTransform(y, [-60, 60], [-10, 10]);
  
  // Smooth spring for mobile performance
  const springConfig = { stiffness: 150, damping: 15 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Scroll-based transform
  const { scrollY } = useViewportScroll();
  const bgParallax = useTransform(scrollY, [0, 900], [0, -140]);

  // Dynamic import of lottie-react
  useEffect(() => {
    let mounted = true;
    import("lottie-react")
      .then((mod) => {
        if (mounted) setLottieAnim(() => mod.default);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  // Scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse move handler with debounce for performance
  const handleMouseMoveHero = useCallback((e) => {
    if (!heroRef.current || window.innerWidth < 1024) return;
    const rect = heroRef.current.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx / 8);
    y.set(my / 8);
  }, [x, y]);

  const handleMouseLeaveHero = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full mix-blend-screen filter blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full mix-blend-screen filter blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px]"
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-2xl" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 via-indigo-600 to-cyan-400 shadow-lg flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                  <path d="M4 12h16M12 4v16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
              <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SkillHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {["features", "how", "skills"].map((item) => (
                <ScrollLink
                  key={item}
                  to={item}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer py-2 group"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full" />
                </ScrollLink>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {["features", "how", "skills"].map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ScrollLink
                      onClick={() => setMenuOpen(false)}
                      to={item}
                      smooth={true}
                      offset={-80}
                      className="block py-3 text-lg font-medium text-gray-300 hover:text-white border-l-4 border-transparent hover:border-pink-500 pl-4 transition-all duration-300"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </ScrollLink>
                  </motion.div>
                ))}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 space-y-3"
                >
                  <Link 
                    to="/login" 
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-3 text-center text-gray-300 hover:text-white font-medium border border-white/20 rounded-xl hover:bg-white/5 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
          {/* Parallax Background Blobs */}
          <motion.div
            style={{ y: bgParallax }}
            className="absolute -left-[20%] top-0 w-[80vw] h-[80vh] rounded-full bg-gradient-to-tr from-pink-500/10 via-violet-500/10 to-cyan-500/10 blur-[120px]"
          />
          <motion.div
            style={{ y: bgParallax }}
            className="absolute right-0 top-1/3 w-[60vw] h-[60vh] rounded-full bg-gradient-to-tr from-cyan-400/10 to-indigo-600/10 blur-[100px]"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6 lg:space-y-8 text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-indigo-500/20 border border-white/20 backdrop-blur-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                  </span>
                  <span className="text-sm font-medium text-pink-200">Join 120K+ learners worldwide</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                  Learn by building{" "}
                  <span className="bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                    projects that matter
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  SkillHub combines guided paths, mentor reviews, and hands-on projects into a single, beautiful learning environment.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link
                    to="/signup"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-indigo-600 to-cyan-500 shadow-2xl hover:shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-lg"
                  >
                    Start Learning Free
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <ScrollLink
                    to="features"
                    smooth={true}
                    offset={-80}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/20 backdrop-blur-sm text-lg font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  >
                    Explore Features
                  </ScrollLink>
                </div>

                {/* Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4"
                >
                  {[
                    { icon: Users, value: "120k+", label: "Learners", color: "from-pink-500 to-orange-500" },
                    { icon: Award, value: "50k+", label: "Certificates", color: "from-emerald-500 to-teal-500" },
                    { icon: Star, value: "4.9", label: "Rating", color: "from-yellow-500 to-amber-500" }
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <stat.icon size={18} />
                      </div>
                      <div>
                        <div className="text-lg font-black text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Content - 3D Card */}
              <motion.div
                ref={heroRef}
                onMouseMove={handleMouseMoveHero}
                onMouseLeave={handleMouseLeaveHero}
                style={{ perspective: 1400 }}
                className="relative lg:ml-auto w-full max-w-md lg:max-w-lg mx-auto"
              >
                <motion.div
                  style={{ 
                    rotateX: smoothRotateX, 
                    rotateY: smoothRotateY, 
                    translateX, 
                    translateY 
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-indigo-500/30 to-cyan-500/30 rounded-[2rem] blur-2xl opacity-50" />
                  
                  {/* Main Card */}
                  <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-white/10 bg-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
                            Active Course
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-white">Full Stack Capstone</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400">62%</div>
                          <div className="text-xs text-gray-400">Complete</div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Preview Area */}
                      <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group">
                        {LottieAnim ? (
                          <LottieWrapper LottieAnim={LottieAnim} />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=1200&q=90"
                            alt="Course preview"
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play size={14} fill="white" />
                          </div>
                          <span className="text-sm font-medium">Continue where you left off</span>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Next Lesson</div>
                          <div className="text-sm sm:text-base font-bold text-white">API Authentication</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Due Date</div>
                          <div className="text-sm sm:text-base font-bold text-orange-300">Tomorrow</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Course Progress</span>
                          <span className="text-cyan-400 font-bold">62%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "62%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-bold text-sm sm:text-base shadow-lg hover:shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                          Continue Learning
                        </button>
                        <button className="px-4 py-3 rounded-xl border-2 border-white/20 font-bold text-sm sm:text-base hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-4 -top-4 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-2xl border border-white/20"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-4 -bottom-4 w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-xl sm:text-2xl shadow-2xl border border-white/20"
                  >
                    ⚡
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight size={20} className="rotate-90" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-4"
              >
                <Zap size={16} />
                Powerful Features
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
              >
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  master coding
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-2xl mx-auto"
              >
                Project-first learning with feedback and analytics that adapt to your pace.
              </motion.p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    
                    <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-300 mb-3">
                      {feature.stats}
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-indigo-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="py-20 lg:py-32 relative bg-slate-900/50 border-y border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12 lg:mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
              >
                How{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  SkillHub
                </span>{" "}
                works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-400 max-w-2xl mx-auto"
              >
                Your journey from beginner to professional in three simple steps.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  {/* Connector Line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                  )}
                  
                  <div className="relative p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-500 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <step.icon size={24} className="text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-400">
                        {step.time}
                      </span>
                    </div>
                    
                    <div className="text-4xl font-black text-white/10 absolute top-6 right-6">
                      0{i + 1}
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
              >
                Learner{" "}
                <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                  benefits
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-400 max-w-2xl mx-auto"
              >
                Support, projects, and career help designed for your success.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ y: -8 }}
                    className="group rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={benefit.img}
                        alt={benefit.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <Icon size={24} className="text-slate-900" />
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-pink-500/90 text-white text-xs font-bold">
                          {benefit.badge}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 lg:p-8">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 lg:py-32 relative bg-slate-900/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium mb-4"
              >
                <Code size={16} />
                Tech Stack
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
              >
                Skills you'll{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  master
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-2xl mx-auto"
              >
                Core tools, frameworks and workflows used by top tech companies.
              </motion.p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {SKILLS.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-indigo-500/25 group-hover:scale-110 transition-all duration-300">
                      <SkillIcon name={skill.name} />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-gray-300 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-gray-400 mb-4">And many more technologies...</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["TypeScript", "Next.js", "GraphQL", "AWS", "Docker", "Kubernetes"].map((tech) => (
                  <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12 lg:mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
              >
                Loved by{" "}
                <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  learners
                </span>{" "}
                worldwide
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {TESTIMONIALS.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 sm:p-12 lg:p-16 rounded-3xl overflow-hidden text-center"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6"
                >
                  <Sparkles size={16} />
                  Start your journey today
                </motion.div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
                  Ready to build real projects?
                </h2>
                <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join SkillHub and start learning with a clear path, expert mentors, and a supportive community.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-lg shadow-2xl hover:shadow-white/25 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                  <ScrollLink
                    to="features"
                    smooth={true}
                    offset={-80}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  >
                    Learn More
                  </ScrollLink>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-12 lg:py-16 border-t border-white/10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-4 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-indigo-600 to-cyan-400 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12h16M12 4v16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-black text-xl text-white">SkillHub</span>
              </Link>
              <p className="text-gray-400 mb-4 max-w-sm">
                Empowering the next generation of developers through project-based learning and expert mentorship.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: Globe, label: "Global" },
                  { icon: Shield, label: "Secure" },
                  { icon: Clock, label: "24/7" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-400">
                    <item.icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                {["Courses", "Mentors", "Community", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Documentation", "Help Center", "API"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Contact", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} SkillHub. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;