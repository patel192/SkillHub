import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from "framer-motion";

/**
 * PublicLayout - Option C (3D Hero + Scroll Animations)
 *
 * Notes:
 * - Optional Lottie: dynamically imported (won't crash if not installed)
 * - Uses framer-motion for all animations
 * - Uses Tailwind utility classes (Tailwind v2+/v3+)
 */

const FEATURES = [
  {
    title: "Project-Driven Courses",
    desc: "Hands-on projects that build a portfolio recruiters notice.",
    icon: "🚀",
  },
  {
    title: "Guided Learning Paths",
    desc: "Structured progression from fundamentals to mastery.",
    icon: "🧭",
  },
  {
    title: "AI-Powered Suggestions",
    desc: "Smart recommendations to keep you on track.",
    icon: "🤖",
  },
];

const STEPS = [
  { title: "Sign Up", desc: "Create your account in 30 seconds." },
  { title: "Pick a Path", desc: "Choose the right path for your goals." },
  { title: "Ship Projects", desc: "Build and publish real apps." },
];

const BENEFITS = [
  {
    title: "Mentor Reviews",
    desc: "Get expert feedback and accelerate progress.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Community",
    desc: "Join study groups, pair programming and reviews.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Verified Certificates",
    desc: "Share credentials with employers and LinkedIn.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
];

const SKILLS = [
  {
    name: "HTML",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "JavaScript",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "React",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "MongoDB",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Tailwind CSS",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  },
  {
    name: "Git",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
];

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [LottieAnim, setLottieAnim] = useState(null);
  const heroRef = useRef(null);

  // Motion values for cursor parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [15, -15]);
  const rotateY = useTransform(x, [-60, 60], [-15, 15]);
  const translateX = useTransform(x, [-60, 60], [-12, 12]);
  const translateY = useTransform(y, [-60, 60], [-12, 12]);

  // Scroll-based transform for subtle parallax on background layers
  const { scrollY } = useViewportScroll();
  const bgParallax = useTransform(scrollY, [0, 900], [0, -120]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06070a] via-[#0a0b0f] to-[#071018] text-white antialiased">
      {/* NAV */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-indigo-600 to-cyan-400 shadow-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12h16M12 4v16"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">SkillHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <ScrollLink
              to="features"
              smooth
              className="hover:text-white cursor-pointer"
            >
              Features
            </ScrollLink>
            <ScrollLink
              to="how"
              smooth
              className="hover:text-white cursor-pointer"
            >
              How it works
            </ScrollLink>
            <ScrollLink
              to="skills"
              smooth
              className="hover:text-white cursor-pointer"
            >
              Skills
            </ScrollLink>
            <Link to="/login" className="hover:text-white">
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black font-medium shadow"
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="toggle menu"
              className="p-2"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2 bg-[#05060a] border-t border-white/6">
            <div className="flex flex-col gap-3 text-gray-300">
              <ScrollLink
                onClick={() => setMenuOpen(false)}
                to="features"
                smooth
              >
                Features
              </ScrollLink>
              <ScrollLink onClick={() => setMenuOpen(false)} to="how" smooth>
                How it works
              </ScrollLink>
              <ScrollLink onClick={() => setMenuOpen(false)} to="skills" smooth>
                Skills
              </ScrollLink>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-block px-4 py-2 rounded-md bg-white text-black"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <main className="pt-24">
        <section className="relative overflow-hidden">
          {/* background soft gradient blobs (parallax) */}
          <motion.div
            style={{ y: bgParallax }}
            className="pointer-events-none absolute -left-[10%] -top-32 w-[60vw] h-[60vh] rounded-full bg-gradient-to-tr from-pink-500/20 via-violet-600/18 to-cyan-400/10 blur-3xl"
          />
          <motion.div
            style={{ y: bgParallax }}
            className="pointer-events-none absolute right-0 top-0 w-[40vw] h-[40vh] rounded-full bg-gradient-to-tr from-cyan-400/12 to-indigo-600/14 blur-3xl"
          />

          <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
            {/* left column: heading & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 z-10"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Learn by building —{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-300">
                  projects that matter
                </span>
              </h1>

              <p className="text-gray-300 text-lg max-w-xl">
                SkillHub combines guided paths, mentor reviews, and hands-on
                projects into a single, beautiful learning environment. Build
                portfolio-grade projects while learning modern tools.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 shadow-lg transform-gpu hover:scale-[1.02] transition"
                >
                  Start Free <ArrowRight size={14} />
                </Link>

                <ScrollLink
                  to="features"
                  smooth
                  className="px-4 py-2 rounded-full border border-white/10 text-gray-200 hover:border-white/30 cursor-pointer"
                >
                  Explore features
                </ScrollLink>
              </div>

              {/* micro stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#0b0b0d] flex items-center justify-center border border-white/6">
                    🔥
                  </div>
                  <div>
                    <div className="text-white font-semibold">120k+</div>
                    <div className="text-gray-400">Learners</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#0b0b0d] flex items-center justify-center border border-white/6">
                    🏆
                  </div>
                  <div>
                    <div className="text-white font-semibold">50k+</div>
                    <div className="text-gray-400">Certificates</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* right column: 3D-ish product mockup with layered elements */}
            <motion.div
              ref={heroRef}
              onMouseMove={handleMouseMoveHero}
              onMouseLeave={handleMouseLeaveHero}
              style={{ perspective: 1200 }}
              className="relative"
            >
              {/* layered floating cards */}
              <motion.div
                style={{ rotateX, rotateY, translateX, translateY }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="relative w-full max-w-xl mx-auto"
              >
                {/* back glass plate */}
                <div className="absolute -left-8 -top-10 w-[360px] h-[220px] rounded-2xl bg-white/2 blur-[46px] opacity-10 transform-gpu rotate-6" />

                {/* main card */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#07070a]/80 to-[#0b0b0d]/85 border border-white/6 shadow-2xl overflow-hidden">
                  <div className="p-5 flex items-center justify-between border-b border-white/6">
                    <div>
                      <div className="text-xs text-gray-400">Course</div>
                      <div className="text-lg font-semibold">
                        Full Stack Capstone
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      Progress{" "}
                      <span className="text-white font-medium">62%</span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Lottie or fallback animated SVG */}
                    <div className="h-44 rounded-md overflow-hidden bg-gradient-to-br from-[#0b0d12] to-[#061018] flex items-center justify-center">
                      {LottieAnim ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full h-full"
                        >
                          {/* small example Lottie JSON URL: (you can replace with your own JSON) */}
                          <LottieWrapper LottieAnim={LottieAnim} />
                        </motion.div>
                      ) : (
                        <motion.img
                          src="https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=1200&q=80"
                          alt="preview"
                          className="object-cover w-full h-full opacity-95"
                          initial={{ scale: 1.02 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-md bg-[#07080a] border border-white/6">
                        <div className="text-xs text-gray-400">Next</div>
                        <div className="text-sm text-white font-medium mt-1">
                          API Authentication
                        </div>
                      </div>
                      <div className="p-3 rounded-md bg-[#07080a] border border-white/6">
                        <div className="text-xs text-gray-400">Due</div>
                        <div className="text-sm text-white font-medium mt-1">
                          Tomorrow
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button className="flex-1 px-4 py-3 rounded-md bg-gradient-to-r from-pink-500 to-indigo-600">
                        Continue
                      </button>
                      <button className="px-4 py-3 rounded-md border border-white/8 text-gray-200">
                        View
                      </button>
                    </div>
                  </div>
                </div>

                {/* floating icon bubbles */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -right-8 -top-6 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-sm shadow-lg"
                >
                  ✦
                </motion.div>
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="absolute left-3 -bottom-6 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-sm shadow-lg"
                >
                  ⚡
                </motion.div>
              </motion.div>

              {/* subtle 3D reflection layer */}
              <motion.div
                style={{ translateY: useTransform(y, (v) => v * 0.06) }}
                className="w-full h-2 mt-6 rounded-full bg-gradient-to-r from-white/6 to-transparent opacity-6"
              />
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="px-6 py-20">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              Powerful tools that help you ship
            </motion.h2>
            <p className="text-gray-400 mt-2">
              Project-first learning with feedback and analytics.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => (
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#07080a] to-[#0b0b0d] border border-white/6 shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center mb-3 text-lg">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="text-gray-400 mt-2 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="px-6 py-20 bg-[#06070a] border-t border-white/6"
        >
          <div className="max-w-6xl mx-auto text-center mb-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-bold"
            >
              How SkillHub works
            </motion.h2>
            <p className="text-gray-400 mt-2">
              A focused path to real outcomes.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#07080a] to-[#0b0b0d] border border-white/6"
              >
                <div className="text-2xl text-indigo-400 font-bold mb-3">
                  {i + 1}
                </div>
                <h3 className="text-white font-semibold">{s.title}</h3>
                <p className="text-gray-400 mt-2 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-bold"
            >
              Learner benefits
            </motion.h2>
            <p className="text-gray-400 mt-2">
              Support, projects, and career help.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden border border-white/6 bg-[#07080a] shadow-lg"
              >
                <div className="h-44 w-full overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold">{b.title}</h3>
                  <p className="text-gray-400 mt-2 text-sm">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="px-6 py-20 bg-[#06070a] border-t border-white/6"
        >
          <div className="max-w-6xl mx-auto text-center mb-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-bold"
            >
              Skills you'll master
            </motion.h2>
            <p className="text-gray-400 mt-2">
              Core tools, frameworks and workflows.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {SKILLS.map((skill, idx) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.1, y: -6 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-4 rounded-xl bg-[#0b0b0d] border border-white/10 shadow-lg
               hover:border-indigo-500/40 hover:shadow-indigo-500/20
               flex flex-col items-center justify-center cursor-pointer"
              >
                {/* Skill Icon */}
                <img
                  src={skill.img}
                  alt={skill.name}
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
                />

                {/* Label */}
                <span className="text-gray-300 text-sm mt-3 group-hover:text-white transition">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              Ready to build real projects?
            </motion.h2>
            <p className="text-gray-400 mt-3">
              Join SkillHub and start learning with a clear path and mentors.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 shadow-lg"
              >
                Get Started
              </Link>
              <ScrollLink
                to="features"
                smooth
                className="px-6 py-3 rounded-full border border-white/10 text-gray-200"
              >
                Explore features
              </ScrollLink>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-white/8 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-600" />
            <div>
              <div className="font-semibold">SkillHub</div>
              <div className="text-gray-400 text-sm">Learn • Build • Ship</div>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} SkillHub. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-gray-300">
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Contact
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
