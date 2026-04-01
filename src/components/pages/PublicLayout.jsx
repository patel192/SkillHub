import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  Menu,
  X,
  ArrowRight,
  Rocket,
  Map,
  Bot,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  Code,
  Server,
  Database,
  Palette,
  LayoutDashboard,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Shield,
  Play,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  MousePointer2,
  Layers,
  Target,
  Clock,
  Mail,
  Lock,
  Bell,
  Search,
  Terminal,
  Cpu,
  Wifi,
  Cloud,
  Smartphone,
  Monitor,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  useScroll,
  useTransform as useFramerTransform,
} from "framer-motion";
//Imported Icons for tech-stack
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiGraphql,
  SiPostgresql,
} from "react-icons/si";
// ─────────────────────────────────────────
// DESIGN TOKENS  (change once, applies everywhere)
// ─────────────────────────────────────────
const C = {
  brand: "#16A880", // teal-green — SkillHub identity
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B", // amber — CTA pop
  accentHov: "#D97706",
  bg: "#0A0F0D", // near-black with green undertone
  surface: "#111814",
  surface2: "#182219",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
};

// ─────────────────────────────────────────
// DATA CONSTANTS
// ─────────────────────────────────────────
const FEATURES = [
  {
    title: "AI-Powered Learning",
    desc: "Personalized curriculum that adapts to your pace and style using machine learning.",
    icon: Bot,
    accent: C.brand,
    size: "large",
  },
  {
    title: "Real Projects",
    desc: "Build production-grade applications for your portfolio.",
    icon: Rocket,
    accent: C.accent,
    size: "small",
  },
  {
    title: "Live Mentorship",
    desc: "1-on-1 sessions with industry experts from top tech companies.",
    icon: Users,
    accent: "#6366F1",
    size: "small",
  },
  {
    title: "Career Support",
    desc: "Resume reviews, interview prep, and direct referrals to hiring partners.",
    icon: Target,
    accent: C.brandLight,
    size: "medium",
  },
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
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["React", "Node.js", "PostgreSQL"],
    color: C.brand,
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    level: "Intermediate",
    duration: "12 weeks",
    students: "8.2K",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["Python", "TensorFlow", "OpenAI"],
    color: "#6366F1",
  },
  {
    id: 3,
    title: "Mobile Development",
    level: "Beginner",
    duration: "10 weeks",
    students: "15K",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    tags: ["React Native", "iOS", "Android"],
    color: C.accent,
  },
];

const TESTIMONIALS = [
  {
    name: "Alex Chen",
    role: "Senior Engineer @ Google",
    content:
      "SkillHub's project-based approach helped me transition from bootcamp grad to senior engineer in 18 months.",
    avatar: "AC",
    company: "Google",
    color: C.brand,
  },
  {
    name: "Sarah Miller",
    role: "Full Stack Developer",
    content:
      "The mentorship program is unmatched. Having access to engineers from top companies accelerated my growth exponentially.",
    avatar: "SM",
    company: "Stripe",
    color: "#6366F1",
  },
  {
    name: "James Wilson",
    role: "Tech Lead @ Meta",
    content:
      "I recommend SkillHub to everyone asking how to break into tech. The ROI is incredible.",
    avatar: "JW",
    company: "Meta",
    color: C.accent,
  },
];

const TECH_STACK = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "GraphQL", Icon: SiGraphql, color: "#E535AB" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#336791" },
];

const NAV_ITEMS = ["Features", "Courses", "Mentors", "Enterprise"];

const FOOTER_LINKS = [
  {
    title: "Product",
    links: ["Courses", "Mentorship", "Pricing", "Enterprise"],
  },
  {
    title: "Resources",
    links: ["Blog", "Documentation", "Community", "Help Center"],
  },
  { title: "Company", links: ["About", "Careers", "Contact", "Partners"] },
];

// ─────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────

/** Subtle animated ambient glow behind cursor */
const CursorGlow = ({ mouseX, mouseY }) => (
  <motion.div
    className="fixed pointer-events-none z-0"
    style={{
      width: 600,
      height: 600,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${C.brand}22 0%, transparent 65%)`,
      x: mouseX,
      y: mouseY,
      translateX: "-50%",
      translateY: "-50%",
    }}
  />
);

/** Pill badge used in section headers */
const SectionBadge = ({ children }) => (
  <span
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[1.2px] border mb-5"
    style={{
      background: `${C.brand}14`,
      borderColor: "var(--border)",
      color: C.brand,
    }}
  >
    {children}
  </span>
);

/** Heading with gradient accent word */
const GradientHeading = ({
  pre,
  accent,
  post,
  size = "lg",
  className = "",
}) => {
  const sizes = {
    lg: "text-3xl sm:text-4xl lg:text-5xl",
    xl: "text-4xl sm:text-5xl lg:text-6xl",
    "2xl": "text-5xl sm:text-6xl lg:text-7xl",
  };
  return (
    <h2
      className={`font-bold leading-[1.1] tracking-tight ${sizes[size]} ${className}`}
      style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
    >
      {pre && <>{pre} </>}
      <span
        style={{
          background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {accent}
      </span>
      {post && <> {post}</>}
    </h2>
  );
};

/** Animated number counter on scroll into view */
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const num = parseInt(value.replace(/[^0-9]/g, ""));
          const steps = 60;
          let current = 0;
          const increment = num / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              setCount(num);
              clearInterval(timer);
            } else setCount(Math.floor(current));
          }, 2000 / steps);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {value.includes("K") ? `${count}K` : count}
      {value.includes("%") ? "%" : ""}
      {value === "4.9" ? "4.9" : ""}
    </span>
  );
};

/** Magnetic CTA button */
const MagneticButton = ({ children, className = "", onClick, ...props }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - left - width / 2) * 0.12,
      y: (e.clientY - top - height / 2) * 0.12,
    });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/** Glow card — border lights up on hover */
const GlowCard = ({ children, className = "", accentColor = C.brand }) => (
  <div className={`relative group ${className}`}>
    <div
      className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `linear-gradient(135deg, ${accentColor}55, transparent 60%)`,
      }}
    />
    <div
      className="relative rounded-2xl h-full border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useFramerTransform(scrollYProgress, [0, 1], [0, -50]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse tracker
  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Framer variants
  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  };
  const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

  const levelColor = {
    Beginner: { bg: `${C.brand}22`, text: C.brandLight },
    Intermediate: { bg: `${C.accent}22`, text: C.accent },
    Advanced: { bg: "#6366F122", text: "#818CF8" },
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-x-hidden selection:bg-teal-500/20"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts (loaded once) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
        ::selection { background: ${C.brand}33; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${"var(--bg)"}; }
        ::-webkit-scrollbar-thumb { background: ${C.brand}55; border-radius: 99px; }
      `}</style>

      {/* Ambient cursor glow */}
      <CursorGlow mouseX={mouseX} mouseY={mouseY} />

      {/* ── NAVBAR ─────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isScrolled ? `${"var(--bg)"}CC` : "transparent",
          backdropFilter: isScrolled ? "blur(16px)" : "none",
          borderBottom: isScrolled
            ? `1px solid ${"var(--border)"}`
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div
                  className="absolute inset-0 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity blur-md"
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  }}
                />
                <div
                  className="relative w-full h-full rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  }}
                >
                  <Code className="w-5 h-5 text-white" />
                </div>
              </div>
              <span
                className="text-xl font-bold"
                style={{
                  fontFamily: "'Fraunces', serif",
                  background: `linear-gradient(135deg, ${"var(--text)"}, ${"var(--text-muted)"})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SkillHub
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase()}
                  smooth
                  offset={-80}
                  className="text-sm font-medium cursor-pointer relative group transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  activeStyle={{ color: "var(--text)" }}
                >
                  <span className="group-hover:text-white transition-colors">
                    {item}
                  </span>
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 rounded-full"
                    style={{ background: C.brand }}
                  />
                </ScrollLink>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
              >
                Sign in
              </Link>
              <MagneticButton
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-px"
                style={{
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  color: "#fff",
                  boxShadow: `0 0 24px ${C.brand}55`,
                }}
              >
                <Link to="/signup">Get Started</Link>
              </MagneticButton>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: `${"var(--surface)"}F5`,
                borderBottom: `1px solid ${"var(--border)"}`,
              }}
              className="lg:hidden backdrop-blur-xl"
            >
              <div className="px-5 py-6 space-y-4">
                {NAV_ITEMS.map((item) => (
                  <ScrollLink
                    key={item}
                    to={item.toLowerCase()}
                    smooth
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-[17px] font-medium transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item}
                  </ScrollLink>
                ))}
                <div
                  className="pt-4 space-y-3 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Link
                    to="/login"
                    className="block w-full py-3 text-center rounded-xl text-sm font-medium border transition-colors"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full py-3 text-center rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                    }}
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── HERO ───────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      >
        {/* Background: mesh + grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
            style={{ background: `${C.brand}18` }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
            style={{ background: "#6366F118", animationDelay: "1s" }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${C.brand}18 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 40%, black 50%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — copy */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="space-y-8"
            >
              {/* Live badge */}
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                  style={{
                    background: `${C.brand}12`,
                    borderColor: "var(--border)",
                    color: C.brand,
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: C.brand }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: C.brand }}
                    />
                  </span>
                  Now with AI-powered learning paths
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                Master coding through{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight} 60%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  real-world projects
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-xl leading-relaxed max-w-xl"
                style={{ color: "var(--text-muted)" }}
              >
                Join 120,000+ developers learning by building. Get personalized
                mentorship, ship production-grade projects, and land your dream
                job.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-white transition-all hover:-translate-y-px hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                    boxShadow: `0 0 32px ${C.brand}44`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 48px ${C.brand}66`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 32px ${C.brand}44`)
                  }
                >
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all border hover:border-opacity-60"
                  style={{ border: `1px solid ${"var(--border)"}`, color: "var(--text)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = `${C.brand}10`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {STATS.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className="text-2xl sm:text-3xl font-bold"
                      style={{ color: "var(--text)", fontFamily: "'Fraunces', serif" }}
                    >
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — mock IDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div
                className="relative rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl border"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  boxShadow: `0 40px 80px ${C.brand}10, 0 0 0 1px ${"var(--border)"}`,
                }}
              >
                {/* IDE titlebar */}
                <div
                  className="flex items-center gap-2 px-5 py-3.5 border-b"
                  style={{ borderColor: "var(--border)", background: "var(--surface2)" }}
                >
                  <div className="flex gap-1.5">
                    {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                      <div
                        key={c}
                        className="w-3 h-3 rounded-full opacity-60"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <div
                    className="flex-1 text-center text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    dashboard.tsx — SkillHub
                  </div>
                </div>

                {/* Code lines */}
                <div className="p-6 font-mono text-sm leading-7">
                  <div className="flex gap-5">
                    <div
                      className="select-none text-right"
                      style={{ color: "var(--text-muted)", minWidth: 16 }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <div key={n}>{n}</div>
                      ))}
                    </div>
                    <div className="space-y-0 flex-1">
                      <div style={{ color: "#7C9EA5" }}>
                        <span style={{ color: "#78B9C2" }}>import </span>
                        <span style={{ color: "var(--text)" }}>React </span>
                        <span style={{ color: "#78B9C2" }}>from </span>
                        <span style={{ color: `${C.brand}CC` }}>'react'</span>
                        <span style={{ color: "var(--text-muted)" }}>;</span>
                      </div>
                      <div style={{ color: "var(--text-muted)" }}>
                        {"// SkillHub — Live Dashboard"}
                      </div>
                      <div>&nbsp;</div>
                      <div>
                        <span style={{ color: "#78B9C2" }}>
                          export default function{" "}
                        </span>
                        <span style={{ color: C.accent }}>Dashboard</span>
                        <span style={{ color: "var(--text-muted)" }}>() {"{"}</span>
                      </div>
                      <div className="pl-5">
                        <span style={{ color: "#78B9C2" }}>const </span>
                        <span style={{ color: C.brandLight }}>data </span>
                        <span style={{ color: "var(--text-muted)" }}>= </span>
                        <span style={{ color: C.accent }}>useRealTime</span>
                        <span style={{ color: "var(--text-muted)" }}>{"();"}</span>
                      </div>
                      <div className="pl-5">
                        <span style={{ color: "#78B9C2" }}>return </span>
                        <span style={{ color: "var(--text-muted)" }}>{"("}</span>
                      </div>
                      <div className="pl-10">
                        <span style={{ color: C.brand }}>{"<Dashboard "}</span>
                        <span style={{ color: C.accent }}>data</span>
                        <span style={{ color: "var(--text-muted)" }}>=</span>
                        <span style={{ color: "#78B9C2" }}>{"{data}"}</span>
                        <span style={{ color: C.brand }}>{" />"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Typing cursor */}
                  <motion.span
                    className="inline-block w-0.5 h-4 ml-1 rounded-full"
                    style={{ background: C.brand }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  />
                </div>

                {/* Progress bar at bottom */}
                <div className="px-6 pb-5">
                  <div
                    className="flex justify-between text-[11px] mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Module 7 / 12</span>
                    <span>58% complete</span>
                  </div>
                  <div
                    className="h-1 rounded-full"
                    style={{ background: "var(--surface2)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${C.brand}, ${C.brandLight})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: "58%" }}
                      transition={{
                        duration: 1.4,
                        delay: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge — Tests Passing */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-5 top-14 p-3.5 rounded-2xl border backdrop-blur-md shadow-xl hidden sm:flex items-center gap-3"
                style={{ background: `${"var(--surface)"}E8`, borderColor: "var(--border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${C.brand}22` }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: C.brand }}
                  />
                </div>
                <div>
                  <p
                    className="text-[12px] font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    Tests Passing
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    24 / 24 completed
                  </p>
                </div>
              </motion.div>

              {/* Floating badge — Mentor online */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                className="absolute -left-5 bottom-14 p-3.5 rounded-2xl border backdrop-blur-md shadow-xl hidden sm:flex items-center gap-3"
                style={{ background: `${"var(--surface)"}E8`, borderColor: "var(--border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 relative"
                  style={{ background: "#6366F122" }}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span
                    className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full border"
                    style={{ background: C.brand, borderColor: "var(--surface)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-[12px] font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    Mentor Online
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Available now
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ─────────────────────── */}
      <section id="features" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge>✦ Why SkillHub</SectionBadge>
            <GradientHeading pre="Everything you need to" accent="go pro" />
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: "var(--text-muted)" }}
            >
              A comprehensive platform designed to take you from beginner to
              industry-ready professional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={
                  feature.size === "large"
                    ? "lg:col-span-2 lg:row-span-2"
                    : feature.size === "medium"
                      ? "lg:col-span-2"
                      : ""
                }
              >
                <GlowCard accentColor={feature.accent}>
                  <div className="p-7 lg:p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                      style={{ background: `${feature.accent}20` }}
                    >
                      <feature.icon
                        className="w-6 h-6"
                        style={{ color: feature.accent }}
                      />
                    </div>

                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--text)", fontFamily: "'Fraunces', serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="flex-grow" style={{ color: "var(--text-muted)" }}>
                      {feature.desc}
                    </p>

                    {/* Extra detail for large card */}
                    {feature.size === "large" && (
                      <div
                        className="mt-6 p-4 rounded-xl border"
                        style={{
                          background: `${C.brand}08`,
                          borderColor: "var(--border)",
                        }}
                      >
                        <div
                          className="flex items-center gap-2 text-sm mb-3"
                          style={{ color: C.brand }}
                        >
                          <Bot className="w-4 h-4" />
                          <span className="font-semibold">
                            AI Learning Assistant
                          </span>
                        </div>
                        {[
                          "Personalized curriculum",
                          "Smart code reviews",
                          "24/7 Q&A support",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 text-sm py-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <CheckCircle2
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: C.brand }}
                            />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK MARQUEE ─────────────────── */}
      <section
        className="py-14 overflow-hidden border-y"
        style={{ borderColor: "var(--border)", background: `${"var(--surface)"}80` }}
      >
        <p
          className="text-center text-xs font-bold uppercase tracking-[2px] mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Learn the technologies that power the world's best products
        </p>

        <div className="relative">
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-32 z-10"
            style={{
              background: `linear-gradient(to right, ${"var(--surface)"}CC, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-32 z-10"
            style={{
              background: `linear-gradient(to left, ${"var(--surface)"}CC, transparent)`,
            }}
          />

          <motion.div
            animate={{ x: [0, -1035] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 px-4 w-max"
          >
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-5 py-3 rounded-full border whitespace-nowrap transition-all duration-300 group cursor-default"
                style={{ background: `${C.brand}08`, borderColor: "var(--border)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${tech.color}55`;
                  e.currentTarget.style.background = `${tech.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = `${C.brand}08`;
                }}
              >
                {/* Actual brand icon with its official color */}
                <tech.Icon
                  size={20}
                  style={{ color: tech.color, flexShrink: 0 }}
                />
                <span
                  className="font-medium text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {tech.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COURSES ────────────────────────────── */}
      <section id="courses" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <SectionBadge>✦ Top Courses</SectionBadge>
              <GradientHeading accent="Featured" post="Courses" />
              <p
                className="mt-4 text-lg max-w-xl"
                style={{ color: "var(--text-muted)" }}
              >
                Industry-vetted curriculum designed to get you hired at top tech
                companies.
              </p>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
              style={{ color: C.brand }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.brandLight)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.brand)}
            >
              View all courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border transition-all duration-300"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `${course.color}44`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${"var(--surface)"} 0%, transparent 60%)`,
                    }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        background: levelColor[course.level]?.bg,
                        color: levelColor[course.level]?.text,
                      }}
                    >
                      {course.level}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {course.duration}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold mb-2 transition-colors group-hover:text-[var(--c)]"
                    style={{
                      color: "var(--text)",
                      fontFamily: "'Fraunces', serif",
                      "--c": course.color,
                    }}
                  >
                    {course.title}
                  </h3>

                  <div
                    className="flex items-center gap-4 text-sm mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students} students
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm border"
                        style={{
                          background: `${course.color}10`,
                          color: course.color,
                          borderColor: `${course.color}25`,
                        }}
                      >
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

      {/* ── TESTIMONIALS ───────────────────────── */}
      <section
        className="py-24 lg:py-32 border-y"
        style={{ background: `${"var(--surface)"}60`, borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge>✦ Student Stories</SectionBadge>
            <GradientHeading
              pre="Loved by"
              accent="developers"
              post="worldwide"
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl border transition-all duration-300"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `${t.color}44`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{ fill: C.accent, color: C.accent }}
                    />
                  ))}
                </div>
                <p
                  className="mb-6 leading-relaxed italic text-[15px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${C.brand}08, transparent)`,
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-20 text-center"
            style={{
              background: `linear-gradient(135deg, ${C.brand} 0%, #0A7A58 50%, ${C.brandDark} 100%)`,
              boxShadow: `0 40px 80px ${C.brand}30`,
            }}
          >
            {/* Dot pattern overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Ready to start your journey?
              </h2>
              <p
                className="text-lg mb-10 max-w-xl mx-auto"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Join thousands of developers who have transformed their careers
                with SkillHub. Start learning for free today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-9 py-4 bg-white rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-px"
                  style={{ color: C.brand }}
                >
                  Get Started Free
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-9 py-4 rounded-full font-semibold text-lg border-2 text-white transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Explore Courses
                </Link>
              </div>

              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {[
                  "No credit card required",
                  "Free forever tier",
                  "Cancel anytime",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer
        className="py-16 border-t"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
            {/* Brand col */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  }}
                >
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
                >
                  SkillHub
                </span>
              </Link>
              <p
                className="text-sm max-w-xs mb-6 leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Empowering the next generation of developers through
                project-based learning and expert mentorship.
              </p>
              <div className="flex gap-3">
                {["Twitter", "GitHub", "Discord", "LinkedIn"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all border"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.brand;
                      e.currentTarget.style.color = C.brand;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_LINKS.map((section) => (
              <div key={section.title}>
                <h4
                  className="font-bold text-xs uppercase tracking-widest mb-5"
                  style={{ color: "var(--text)" }}
                >
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                        onMouseLeave={(e) =>
                          (e.target.style.color = "var(--text-muted)")
                        }
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <p>© {new Date().getFullYear()} SkillHub. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    className="transition-colors"
                    onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
