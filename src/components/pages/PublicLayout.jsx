import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  Check,
  Zap,
  Rocket,
  ArrowLeft,
} from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

// ====== Hero Section Image =====
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1612831455546-6f1e1d3f2c2d?crop=entropy&cs=tinysrgb&fit=crop&w=1600&q=80";

// ====== Features Cards =====
const FEATURES = [
  {
    title: "Skill-Based Courses",
    desc: "Learn structured lessons curated by domain experts.",
    img: "https://images.unsplash.com/photo-1584697964403-df1c8a88c6d5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Learning Paths",
    desc: "Follow step-by-step guided tracks for each technology.",
    img: "https://images.unsplash.com/photo-1531493241285-3381b0a4e80d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Interactive Notes",
    desc: "Community-powered notes, examples, and explanations.",
    img: "https://images.unsplash.com/photo-1554232456-8727aae0c472?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Progress Tracking",
    desc: "Monitor your skill growth with visual progress analytics.",
    img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "AI Skill Suggestions",
    desc: "Receive personalised course & skill recommendations.",
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Course Bookmarks",
    desc: "Save lessons & courses to revisit anytime.",
    img: "https://images.unsplash.com/photo-1521939094609-93aba1af40d7?auto=format&fit=crop&w=1200&q=80",
  },
];

// ====== Skills =====
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
    name: "Firebase",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  {
    name: "Tailwind",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Git",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Redux",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  },
  {
    name: "Figma",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    name: "Next.js",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
];

// ====== Signup Guide =====
const STEPS = [
  { title: "Create Account", desc: "Sign up quickly and fill your profile." },
  { title: "Choose Path", desc: "Select a learning path or skill assessment." },
  {
    title: "Start Project",
    desc: "Join a mentor-led project and get reviews.",
  },
];

// ====== Benefits =====
const BENEFITS = [
  {
    title: "Hands-on Projects",
    desc: "Practice by building real projects.",
    img: "https://images.unsplash.com/photo-1605902711622-cfb43c4431f5?crop=entropy&cs=tinysrgb&fit=crop&w=1200&q=80",
  },
  {
    title: "Community Support",
    desc: "Peer reviews, study groups, and mentor office hours.",
    img: "https://images.unsplash.com/photo-1581090700221-1f83097e8ed3?crop=entropy&cs=tinysrgb&fit=crop&w=1200&q=80",
  },
  {
    title: "Verified Certificates",
    desc: "Earn shareable certificates trusted by employers.",
    img: "https://images.unsplash.com/photo-1605902711622-1fbcf3c5d3e1?crop=entropy&cs=tinysrgb&fit=crop&w=1200&q=80",
  },
];

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* ===== Navbar ===== */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B1220]/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            SkillHub
          </h1>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <ScrollLink
              to="features"
              smooth
              className="cursor-pointer hover:text-purple-400"
            >
              Features
            </ScrollLink>
            <ScrollLink
              to="skills"
              smooth
              className="cursor-pointer hover:text-purple-400"
            >
              Skills
            </ScrollLink>
            <ScrollLink
              to="signup"
              smooth
              className="cursor-pointer hover:text-purple-400"
            >
              Signup
            </ScrollLink>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col px-6 pb-6 space-y-4 bg-[#0B1220]/95">
            <ScrollLink to="features" smooth onClick={() => setMenuOpen(false)}>
              Features
            </ScrollLink>
            <ScrollLink to="skills" smooth onClick={() => setMenuOpen(false)}>
              Skills
            </ScrollLink>
            <ScrollLink to="signup" smooth onClick={() => setMenuOpen(false)}>
              Signup
            </ScrollLink>
          </div>
        )}
      </header>

      {/* ===== Hero Section ===== */}
      <section className="pt-24 relative w-full h-screen flex items-center bg-[#0B1220] overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between h-full">
          {/* Left: Text */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6 z-10">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Upgrade Your Skills with SkillHub
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              SkillHub is your gateway to{" "}
              <span className="text-white font-semibold">
                mastering modern tech skills
              </span>
              . Engage in{" "}
              <span className="text-white font-semibold">
                hands-on projects
              </span>
              , receive guidance from{" "}
              <span className="text-white font-semibold">expert mentors</span>,
              and follow{" "}
              <span className="text-white font-semibold">
                AI-personalized learning paths
              </span>{" "}
              that adapt to your goals. Explore{" "}
              <span className="text-white font-semibold">
                career-ready courses
              </span>
              , gain{" "}
              <span className="text-white font-semibold">
                real-world experience
              </span>
              , and earn{" "}
              <span className="text-white font-semibold">
                verified certificates
              </span>{" "}
              to showcase your achievements. Whether you’re starting fresh or
              leveling up, SkillHub helps you accelerate your career growth with
              clarity and purpose.
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <ScrollLink
                to="signup"
                smooth
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg cursor-pointer transition"
              >
                Get Started
              </ScrollLink>
              <ScrollLink
                to="features"
                smooth
                className="px-6 py-3 border border-blue-500 hover:bg-blue-500/10 rounded-full cursor-pointer transition"
              >
                Learn More
              </ScrollLink>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 relative">
            <img
              src="public/Untitled.png"
              alt="Intro Illustration"
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-xl filter brightness-75 contrast-90"
            />

            {/* Overlay gradient to blend edges */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B1220] via-transparent to-[#0B1220] pointer-events-none rounded-xl"></div>

            {/* Optional blurred abstract shapes for seamless transition */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* ===== Modern Infinite Scrolling Features ===== */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explore Platform Features
        </h2>

        {/* Left Arrow */}
        <button
          onClick={() =>
            document
              .getElementById("featureTrack")
              .scrollBy({ left: -300, behavior: "smooth" })
          }
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 
               bg-[#0F172A]/70 border border-purple-500/20 text-white 
               p-3 rounded-full backdrop-blur-md hover:bg-purple-600/20"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() =>
            document
              .getElementById("featureTrack")
              .scrollBy({ left: 300, behavior: "smooth" })
          }
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 
               bg-[#0F172A]/70 border border-purple-500/20 text-white 
               p-3 rounded-full backdrop-blur-md hover:bg-purple-600/20"
        >
          <ArrowRight size={20} />
        </button>

        {/* Infinite Scrolling Container */}
        <div className="overflow-hidden relative mt-6">
          <div
            id="featureTrack"
            className="flex gap-6 overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {[...FEATURES, ...FEATURES].map((f, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.04 }}
                className="min-w-[280px] bg-[#12192E]/80 border border-purple-500/10 
                     rounded-2xl shadow-lg flex-shrink-0 overflow-hidden snap-center"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-300 text-sm">{f.desc}</p>
                  <button
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full 
                               bg-purple-600 hover:bg-purple-700 text-sm shadow transition"
                  >
                    Explore
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Infinite Loop Animation */}
        <style>
          {`
      #featureTrack {
        animation: scrollLoop 35s linear infinite;
      }
      #featureTrack:hover {
        animation-play-state: paused;
      }

      @keyframes scrollLoop {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}
        </style>
      </section>

      {/* ===== Signup Guide ===== */}
      <section
        id="signup"
        className="py-20 px-6 max-w-6xl mx-auto bg-gradient-to-b from-transparent to-[#000000]/40"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Quick Signup Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="bg-[#0f1724]/60 border border-green-500/10 rounded-2xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-300 font-bold mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-300 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Benefits ===== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose SkillHub
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-[#12192E]/80 border border-purple-500/10 p-6 rounded-2xl shadow-xl flex flex-col"
            >
              <div className="h-40 overflow-hidden rounded-lg mb-4">
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
              <p className="text-gray-300">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Skills ===== */}
      <section id="skills" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Skills You’ll Acquire
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 flex items-center justify-center bg-[#111827] rounded-xl border border-purple-500/10 shadow-lg hover:scale-105 transition-transform">
                <img src={skill.img} alt={skill.name} className="w-10 h-10" />
              </div>
              <p className="text-sm mt-2">{skill.name}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ===== Footer ===== */}
      <footer className="py-8 text-center text-gray-400 border-t border-purple-500/20">
        © 2025 SkillHub — Empowering Future Innovators.
      </footer>
    </div>
  );
};

export default PublicLayout;
