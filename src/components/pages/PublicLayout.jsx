import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { 
  Menu, X, ArrowRight, Rocket, Map, Bot, Users, Award, BookOpen, 
  GraduationCap, Code, Server, Database, Palette, LayoutDashboard, 
  ChevronRight, Star, Zap, Globe, Shield, Play, Sparkles, 
  TrendingUp, CheckCircle2, ArrowUpRight, MousePointer2, 
  Layers, Target, Clock, Mail, Lock, Bell, Search,
  Terminal, Cpu, Wifi, Cloud, Smartphone, Monitor
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
  useSpring,
  AnimatePresence,
  useScroll,
  useTransform as useFramerTransform,
} from "framer-motion";

// ==========================================
// DATA CONSTANTS
// ==========================================

const FEATURES = [
  {
    title: "AI-Powered Learning",
    desc: "Personalized curriculum that adapts to your pace and style using machine learning.",
    icon: Bot,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    size: "large"
  },
  {
    title: "Real Projects",
    desc: "Build production-grade applications for your portfolio.",
    icon: Rocket,
    gradient: "from-orange-500 via-pink-500 to-rose-500",
    size: "small"
  },
  {
    title: "Live Mentorship",
    desc: "1-on-1 sessions with industry experts from top tech companies.",
    icon: Users,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    size: "small"
  },
  {
    title: "Career Support",
    desc: "Resume reviews, interview prep, and direct referrals to hiring partners.",
    icon: Target,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    size: "medium"
  }
];

const STATS = [
  { value: "120K+", label: "Active Learners", icon: Users },
  { value: "50K+", label: "Projects Shipped", icon: Rocket },
  { value: "98%", label: "Placement Rate", icon: TrendingUp },
  { value: "4.9", label: "Average Rating", icon: Star },
];

const COURSES = [
  {
    id: 1,
    title: "Full Stack Mastery",
    level: "Advanced",
    duration: "16 weeks",
    students: "12.5K",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["React", "Node.js", "PostgreSQL"]
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    level: "Intermediate",
    duration: "12 weeks",
    students: "8.2K",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["Python", "TensorFlow", "OpenAI"]
  },
  {
    id: 3,
    title: "Mobile Development",
    level: "Beginner",
    duration: "10 weeks",
    students: "15K",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    tags: ["React Native", "iOS", "Android"]
  }
];

const TESTIMONIALS = [
  {
    name: "Alex Chen",
    role: "Senior Engineer @ Google",
    content: "SkillHub's project-based approach helped me transition from bootcamp grad to senior engineer in 18 months.",
    avatar: "AC",
    company: "Google"
  },
  {
    name: "Sarah Miller",
    role: "Full Stack Developer",
    content: "The mentorship program is unmatched. Having access to engineers from top companies accelerated my growth exponentially.",
    avatar: "SM",
    company: "Stripe"
  },
  {
    name: "James Wilson",
    role: "Tech Lead @ Meta",
    content: "I recommend SkillHub to everyone asking how to break into tech. The ROI is incredible.",
    avatar: "JW",
    company: "Meta"
  }
];

const TECH_STACK = [
  { name: "React", icon: "⚛️", color: "#61DAFB" },
  { name: "TypeScript", icon: "📘", color: "#3178C6" },
  { name: "Node.js", icon: "🟢", color: "#339933" },
  { name: "Python", icon: "🐍", color: "#3776AB" },
  { name: "AWS", icon: "☁️", color: "#FF9900" },
  { name: "Docker", icon: "🐳", color: "#2496ED" },
  { name: "GraphQL", icon: "◈", color: "#E535AB" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791" },
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.1;
    const y = (clientY - top - height / 2) * 0.1;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const GlowCard = ({ children, className = "", gradient = "from-violet-500 to-fuchsia-500" }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-20 group-hover:opacity-100 transition duration-500 blur-xl group-hover:duration-200`} />
      <div className="relative bg-slate-950 rounded-2xl h-full">
        {children}
      </div>
    </div>
  );
};

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const num = parseInt(value.replace(/[^0-9]/g, ""));
          const duration = 2000;
          const steps = 60;
          const increment = num / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              setCount(num);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {value.includes("K") ? `${count}K` : count}
      {suffix}
    </span>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useFramerTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Spring animations for smooth interactions
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Cursor Glow */}
      <motion.div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SkillHub
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {["Features", "Courses", "Mentors", "Enterprise"].map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  offset={-80}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                </ScrollLink>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Sign in
              </Link>
              <MagneticButton className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-white/25 transition-shadow">
                Get Started
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
              className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5"
            >
              <div className="px-4 py-6 space-y-4">
                {["Features", "Courses", "Mentors", "Enterprise"].map((item) => (
                  <ScrollLink
                    key={item}
                    to={item.toLowerCase()}
                    smooth={true}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-lg font-medium text-slate-300 hover:text-white"
                  >
                    {item}
                  </ScrollLink>
                ))}
                <div className="pt-4 space-y-3">
                  <Link to="/login" className="block w-full py-3 text-center text-slate-400 border border-white/10 rounded-xl">
                    Sign in
                  </Link>
                  <Link to="/signup" className="block w-full py-3 text-center bg-white text-slate-950 rounded-xl font-semibold">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                Now with AI-powered learning paths
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Master coding through{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  real-world projects
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-xl leading-relaxed">
                Join 120,000+ developers learning by building. Get personalized mentorship, ship production-grade projects, and land your dream job.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-white/25 transition-all hover:scale-105"
                >
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                {STATS.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10 backdrop-blur-sm shadow-2xl shadow-indigo-500/10">
                {/* Mock IDE Interface */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="flex-1 text-center text-xs text-slate-500 font-mono">App.tsx</div>
                </div>
                
                <div className="p-6 font-mono text-sm">
                  <div className="flex gap-4">
                    <div className="text-slate-600 select-none">1<br/>2<br/>3<br/>4<br/>5<br/>6</div>
                    <div className="space-y-1">
                      <div className="text-purple-400">import <span className="text-white">React</span> from <span className="text-green-400">'react'</span>;</div>
                      <div className="text-slate-500">// SkillHub Project: E-Commerce Dashboard</div>
                      <div>&nbsp;</div>
                      <div><span className="text-purple-400">export default function</span> <span className="text-yellow-400">Dashboard</span>() {'{'}</div>
                      <div className="pl-4 text-purple-400">const <span className="text-blue-400">sales</span> = <span className="text-yellow-400">useRealTimeData</span>();</div>
                      <div className="pl-4 text-purple-400">return <span className="text-white">(</span></div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 top-20 p-4 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Tests Passing</div>
                      <div className="text-xs text-slate-400">24/24 completed</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-4 bottom-20 p-4 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Mentor Online</div>
                      <div className="text-xs text-slate-400">Available now</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                go pro
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to take you from beginner to industry-ready professional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${feature.size === "large" ? "lg:col-span-2 lg:row-span-2" : ""} ${
                  feature.size === "medium" ? "lg:col-span-2" : ""
                }`}
              >
                <GlowCard gradient={feature.gradient}>
                  <div className="p-6 lg:p-8 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 flex-grow">{feature.desc}</p>
                    
                    {feature.size === "large" && (
                      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                          <Bot className="w-4 h-4 text-indigo-400" />
                          <span>AI Learning Assistant</span>
                        </div>
                        <div className="space-y-2">
                          {["Personalized curriculum", "Smart code reviews", "24/7 Q&A support"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="py-16 border-y border-white/5 bg-slate-950/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
            Learn the technologies that power the world's best products
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          
          <motion.div
            animate={{ x: [0, -1035] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 px-4"
          >
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 whitespace-nowrap hover:border-white/20 transition-colors"
              >
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-medium text-slate-300">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Featured{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Courses
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl">
                Industry-vetted curriculum designed to get you hired at top tech companies.
              </p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium group">
              View all courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      course.level === "Beginner" ? "bg-green-500/20 text-green-400" :
                      course.level === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {course.level}
                    </span>
                    <span className="text-slate-500 text-sm">{course.duration}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students} students
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-slate-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                developers
              </span>{" "}
              worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-slate-950 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden text-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who have transformed their careers with SkillHub. Start learning for free today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/courses"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Explore Courses
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Free forever tier
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SkillHub</span>
              </Link>
              <p className="text-slate-400 text-sm max-w-xs mb-4">
                Empowering the next generation of developers through project-based learning and expert mentorship.
              </p>
              <div className="flex gap-4">
                {["Twitter", "GitHub", "Discord", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <Globe className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {[
              { title: "Product", links: ["Courses", "Mentorship", "Pricing", "Enterprise"] },
              { title: "Resources", links: ["Blog", "Documentation", "Community", "Help Center"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Partners"] }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SkillHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;