import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { 
  Menu, X, ArrowRight, Rocket, Map, Bot, Users, Award, BookOpen, 
  GraduationCap, Code, Server, Database, Palette, Git, LayoutDashboard 
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from "framer-motion";

const FEATURES = [
  {
    title: "Project-Driven Courses",
    desc: "Hands-on projects that build a portfolio recruiters notice.",
    icon: Rocket,
    color: "from-pink-500 to-orange-500"
  },
  {
    title: "Guided Learning Paths",
    desc: "Structured progression from fundamentals to mastery.",
    icon: Map,
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "AI-Powered Suggestions",
    desc: "Smart recommendations to keep you on track.",
    icon: Bot,
    color: "from-purple-500 to-pink-500"
  },
];

const STEPS = [
  { title: "Sign Up", desc: "Create your account in 30 seconds.", icon: Users },
  { title: "Pick a Path", desc: "Choose the right path for your goals.", icon: GraduationCap },
  { title: "Ship Projects", desc: "Build and publish real apps.", icon: Rocket },
];

const BENEFITS = [
  {
    title: "Mentor Reviews",
    desc: "Get expert feedback and accelerate progress.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    icon: BookOpen
  },
  {
    title: "Community",
    desc: "Join study groups, pair programming and reviews.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    icon: Users
  },
  {
    title: "Verified Certificates",
    desc: "Share credentials with employers and LinkedIn.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    icon: Award
  },
];

const SKILLS = [
  {
    name: "HTML",
    icon: "html5-original.svg",
    component: () => <LayoutDashboard className="w-8 h-8" />
  },
  {
    name: "CSS",
    icon: "css3-original.svg",
    component: () => <Palette className="w-8 h-8" />
  },
  {
    name: "JavaScript",
    icon: "javascript-original.svg",
    component: () => <Code className="w-8 h-8" />
  },
  {
    name: "React",
    icon: "react-original.svg",
    component: () => <LayoutDashboard className="w-8 h-8" />
  },
  {
    name: "Node.js",
    icon: "nodejs-original.svg",
    component: () => <Server className="w-8 h-8" />
  },
  {
    name: "MongoDB",
    icon: "mongodb-original.svg",
    component: () => <Database className="w-8 h-8" />
  },
  {
    name: "Tailwind CSS",
    icon: "tailwindcss-plain.svg",
    component: () => <Palette className="w-8 h-8" />
  },
  {
    name: "Git",
    icon: "git-original.svg",
    component: () => <Git className="w-8 h-8" />
  },
];

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [LottieAnim, setLottieAnim] = useState(null);
  const heroRef = useRef(null);

  // Motion values for cursor parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [12, -12]);
  const rotateY = useTransform(x, [-60, 60], [-12, 12]);
  const translateX = useTransform(x, [-60, 60], [-10, 10]);
  const translateY = useTransform(y, [-60, 60], [-10, 10]);

  // Scroll-based transform for subtle parallax on background layers
  const { scrollY } = useViewportScroll();
  const bgParallax = useTransform(scrollY, [0, 900], [0, -140]);

  // Try dynamic import of lottie-react (optional)
  useEffect(() => {
    let mounted = true;
    import("lottie-react")
      .then((mod) => {
        if (mounted) setLottieAnim(() => mod.default);
      })
      .catch(() => {
        // lottie-react not installed; fallback will be used
      });
    return () => (mounted = false);
  }, []);

  // mouse move for hero area
  const handleMouseMoveHero = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx / 8);
    y.set(my / 8);
  };

  // Reset on leave
  const handleMouseLeaveHero = () => {
    x.set(0);
    y.set(0);
  };

  const SkillIcon = ({ name }) => {
    const skill = SKILLS.find(s => s.name === name);
    if (!skill) return null;
    
    // For now, use Lucide icons as fallback - replace with actual devicon SVGs later
    const icons = {
      HTML: LayoutDashboard,
      CSS: Palette,
      JavaScript: Code,
      React: LayoutDashboard,
      'Node.js': Server,
      MongoDB: Database,
      'Tailwind CSS': Palette,
      Git
    };
    
    const IconComponent = icons[name] || Code;
    return <IconComponent className="w-10 h-10" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white antialiased overflow-x-hidden">
      {/* Enhanced Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* NAV */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 lg:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-indigo-600 to-cyan-400 shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                <path
                  d="M4 12h16M12 4v16"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-black text-xl lg:text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent tracking-tight">
              SkillHub
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              className="group relative text-gray-300 hover:text-white cursor-pointer py-2 transition-all duration-300 hover:before:w-full"
              before={<div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 w-0 group-hover:w-full transition-all duration-300 rounded-full" />}
            >
              Features
            </ScrollLink>
            <ScrollLink
              to="how"
              smooth={true}
              duration={500}
              className="group relative text-gray-300 hover:text-white cursor-pointer py-2 transition-all duration-300 hover:before:w-full"
              before={<div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 w-0 group-hover:w-full transition-all duration-300 rounded-full" />}
            >
              How it works
            </ScrollLink>
            <ScrollLink
              to="skills"
              smooth={true}
              duration={500}
              className="group relative text-gray-300 hover:text-white cursor-pointer py-2 transition-all duration-300 hover:before:w-full"
              before={<div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 w-0 group-hover:w-full transition-all duration-300 rounded-full" />}
            >
              Skills
            </ScrollLink>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
              Login
            </Link>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-white via-gray-100 to-gray-200 text-black font-bold shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
            >
              Get Started 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </nav>

          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="toggle menu"
              className="p-2 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden px-6 pb-8 pt-2 bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col gap-4 text-gray-300">
              <ScrollLink
                onClick={() => setMenuOpen(false)}
                to="features"
                smooth={true}
                className="py-3 border-r-4 border-transparent hover:border-pink-500 hover:text-white transition-all duration-300"
              >
                Features
              </ScrollLink>
              <ScrollLink 
                onClick={() => setMenuOpen(false)} 
                to="how" 
                smooth={true}
                className="py-3 border-r-4 border-transparent hover:border-pink-500 hover:text-white transition-all duration-300"
              >
                How it works
              </ScrollLink>
              <ScrollLink 
                onClick={() => setMenuOpen(false)} 
                to="skills" 
                smooth={true}
                className="py-3 border-r-4 border-transparent hover:border-pink-500 hover:text-white transition-all duration-300"
              >
                Skills
              </ScrollLink>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="py-3 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* HERO */}
      <main className="pt-28 lg:pt-32">
        <section className="relative overflow-hidden pb-20 lg:pb-32">
          {/* background soft gradient blobs (parallax) */}
          <motion.div
            style={{ y: bgParallax }}
            className="pointer-events-none absolute -left-[15%] -top-32 w-[70vw] h-[70vh] rounded-full bg-gradient-to-tr from-pink-400/25 via-violet-500/20 to-cyan-400/25 blur-3xl"
          />
          <motion.div
            style={{ y: bgParallax }}
            className="pointer-events-none absolute right-0 top-1/4 w-[50vw] h-[50vh] rounded-full bg-gradient-to-tr from-cyan-400/20 to-indigo-600/25 blur-3xl"
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* left column: heading & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 lg:space-y-10 z-10"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-indigo-500/20 border border-white/20 backdrop-blur-sm mb-6"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-ping" />
                  <span className="text-sm font-medium text-pink-200">Join 120K+ learners</span>
                </motion.div>
                
                <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] lg:leading-[0.88] tracking-tight">
                  Learn by building —{" "}
                  <span className="bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                    projects that matter
                  </span>
                </h1>
              </div>

              <p className="text-xl lg:text-2xl text-gray-300 max-w-xl leading-relaxed">
                SkillHub combines guided paths, mentor reviews, and hands-on
                projects into a single, beautiful learning environment. Build
                portfolio-grade projects while learning modern tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 lg:px-10 py-4 lg:py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-indigo-600 to-cyan-500 shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-lg"
                >
                  Start Free 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <ScrollLink
                  to="features"
                  smooth={true}
                  className="px-8 lg:px-10 py-4 lg:py-5 rounded-2xl border-2 border-white/20 backdrop-blur-sm text-lg font-semibold hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                >
                  Explore features
                </ScrollLink>
              </div>

              {/* enhanced micro stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-8 text-sm"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Rocket size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">120k+</div>
                    <div className="text-gray-400 font-medium">Learners</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">50k+</div>
                    <div className="text-gray-400 font-medium">Certificates</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* right column: Enhanced 3D-ish product mockup */}
            <motion.div
              ref={heroRef}
              onMouseMove={handleMouseMoveHero}
              onMouseLeave={handleMouseLeaveHero}
              style={{ perspective: 1400 }}
              className="relative lg:ml-auto"
            >
              <motion.div
                style={{ rotateX, rotateY, translateX, translateY }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="relative w-full max-w-lg lg:max-w-xl mx-auto"
              >
                {/* Enhanced back glass plate */}
                <div className="absolute -left-12 -top-16 w-[420px] h-[260px] rounded-3xl bg-gradient-to-br from-white/3 to-white/1 blur-[60px] opacity-20 transform-gpu rotate-3 shadow-2xl" />

                {/* Enhanced main card */}
                <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden group/card">
                  <div className="p-6 lg:p-8 border-b border-white/10 bg-white/2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-pink-400 font-bold bg-pink-500/10 px-3 py-1 rounded-full inline-block">
                          Course
                        </div>
                        <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mt-2">
                          Full Stack Capstone
                        </div>
                      </div>
                      <div className="text-lg font-mono text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/30 font-bold">
                        Progress 62%
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    {/* Enhanced preview area */}
                    <div className="h-48 lg:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                      {LottieAnim ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full h-full"
                        >
                          <LottieWrapper LottieAnim={LottieAnim} />
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ scale: 1.05, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full h-full rounded-xl overflow-hidden"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=1200&q=90"
                            alt="Course preview"
                            className="object-cover w-full h-full"
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 lg:p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
                        <div className="text-xs uppercase text-gray-400 font-bold tracking-wider">Next</div>
                        <div className="text-lg font-bold text-white mt-1.5">API Authentication</div>
                      </div>
                      <div className="p-4 lg:p-5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-200">
                        <div className="text-xs uppercase text-gray-400 font-bold tracking-wider">Due</div>
                        <div className="text-lg font-bold text-orange-300 mt-1.5">Tomorrow</div>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button className="flex-1 group relative px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-white overflow-hidden">
                        <span className="relative z-10">Continue Learning</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                      <button className="px-6 py-4 rounded-xl border-2 border-white/20 backdrop-blur-sm text-gray-200 hover:border-white/40 hover:bg-white/10 font-bold transition-all duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced floating icon bubbles */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -right-12 -top-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/90 to-orange-500 flex items-center justify-center text-lg shadow-2xl border border-yellow-400/50 backdrop-blur-sm"
                >
                  ✨
                </motion.div>
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="absolute left-8 -bottom-8 w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400/90 to-indigo-500 flex items-center justify-center text-lg shadow-2xl border border-cyan-400/50 backdrop-blur-sm"
                >
                  ⚡
                </motion.div>
              </motion.div>

              {/* Enhanced 3D reflection layer */}
              <motion.div
                style={{ translateY: useTransform(y, (v) => v * 0.08) }}
                className="w-full h-3 mt-8 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-60 shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="max-w-6xl mx-auto text-center mb-16 lg:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
            >
              Powerful tools that help you ship
            </motion.h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Project-first learning with feedback and analytics.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 lg:gap-10">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  whileHover={{ y: -12, scale: 1.03 }}
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="group relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl hover:border-white/20 transition-all duration-500 overflow-hidden"
                >
                  {/* Background shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-[100%] group-hover:translate-x-[120%] transition-transform duration-1000" />
                  
                  <div className={`w-20 h-20 rounded-2xl ${f.color} flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-all duration-300 mx-auto`}>
                    <Icon size={32} className="drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-center text-lg">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="px-6 lg:px-8 py-24 lg:py-32 bg-gradient-to-b from-slate-900/50 to-slate-900 border-t border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="max-w-6xl mx-auto text-center mb-16 lg:mb-20 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
            >
              How SkillHub works
            </motion.h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A focused path to real outcomes.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 lg:gap-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="relative p-8 lg:p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl hover:border-white/20 transition-all duration-500 group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 rounded-3xl -z-10 group-hover:opacity-100 opacity-0 group-hover:animate-ping transition-all duration-700" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl font-black text-white drop-shadow-lg">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 text-center">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed text-center text-lg">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section className="px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="max-w-6xl mx-auto text-center mb-16 lg:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
            >
              Learner benefits
            </motion.h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Support, projects, and career help.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 lg:gap-10">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -12 }}
                  className="group rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-700"
                >
                  <div className="relative h-52 lg:h-60 w-full overflow-hidden group-hover:scale-[1.03] transition-transform duration-700">
                    <img
                      src={b.img}
                      alt={b.title}
                      className="object-cover w-full h-full brightness-75 group-hover:brightness-100 transition-all duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-white/100 transition-all duration-300">
                        <Icon size={24} className="text-slate-900" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10">
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                      {b.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-lg">{b.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="px-6 lg:px-8 py-24 lg:py-32 bg-gradient-to-b from-slate-900/50 to-slate-900 border-t border-b border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern-white opacity-5" />
          <div className="max-w-6xl mx-auto text-center mb-16 lg:mb-20 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
            >
              Skills you'll master
            </motion.h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Core tools, frameworks and workflows.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-8">
            {SKILLS.map((skill, idx) => (
              <motion.div
                key={skill.name}
                whileHover={{ 
                  scale: 1.15, 
                  y: -12,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="group relative p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/15 shadow-xl hover:shadow-3xl hover:border-indigo-500/50 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[120%] transition-transform duration-1000" />
                
                {/* Skill Icon */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-400 border-4 border-white/20">
                  <SkillIcon name={skill.name} />
                </div>

                {/* Label */}
                <span className="text-center block text-gray-300 text-base lg:text-lg font-bold mt-4 group-hover:text-white transition-all duration-300">
                  {skill.name}
                </span>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-8 py-24 lg:py-32 text-center relative">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-white via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-8"
            >
              Ready to build real projects?
            </motion.h2>
            <p className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join SkillHub and start learning with a clear path and mentors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-8">
              <Link
                to="/signup"
                className="group px-12 lg:px-16 py-6 lg:py-7 rounded-3xl bg-gradient-to-r from-pink-500 via-indigo-600 to-cyan-500 shadow-3xl hover:shadow-4xl hover:scale-[1.05] active:scale-[0.98] transition-all duration-500 font-black text-xl text-white"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <ScrollLink
                to="features"
                smooth={true}
                className="px-12 lg:px-16 py-6 lg:py-7 rounded-3xl border-2 border-white/30 backdrop-blur-xl text-xl font-bold text-gray-200 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
              >
                Explore Features
              </ScrollLink>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced FOOTER */}
      <footer className="py-16 lg:py-20 px-6 lg:px-8 border-t border-white/8 bg-gradient-to-t from-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-indigo-600 to-cyan-400 shadow-2xl flex items-center justify-center p-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12h16M12 4v16"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                SkillHub
              </div>
              <div className="text-gray-500 text-lg font-medium">Learn • Build • Ship</div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SkillHub. All rights reserved.
          </div>

          <div className="flex items-center gap-6 lg:gap-8 text-gray-400 hover:text-white transition-colors">
            <a href="#" className="group hover:text-pink-400 font-medium transition-colors duration-300">
              Terms
            </a>
            <a href="#" className="group hover:text-indigo-400 font-medium transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="group hover:text-cyan-400 font-medium transition-colors duration-300">
              Contact
            </a>
            <a href="#" className="group hover:text-emerald-400 font-medium transition-colors duration-300">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * LottieWrapper - dynamically render a Lottie animation if lottie-react is available.
 * - If lottie-react isn't installed, it returns null and the parent falls back to an image.
 * - You can replace the lottieJsonUrl with any Lottie JSON URL or local JSON import.
 */
function LottieWrapper({ LottieAnim }) {
  // small sample animation json url (replace with your own if you want)
  const lottieJsonUrl =
    "https://assets7.lottiefiles.com/packages/lf20_w51pcehl.json"; // generic loader animation

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

export default PublicLayout;
