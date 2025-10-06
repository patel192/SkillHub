import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  BrainCircuit,
  UsersRound,
  BarChart3,
  Menu,
  X,
  Star,
} from "lucide-react";

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Privacy", id: "privacy" },
    { label: "Terms", id: "terms" },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring", stiffness: 50 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white font-sans scroll-smooth">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition duration-300"
          >
            SkillHub
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-sm md:text-base font-medium">
            {navLinks.map(({ label, id }) => (
              <li
                key={id}
                className="relative group text-gray-300 hover:text-blue-400 transition duration-300 cursor-pointer"
                onClick={() => scrollToSection(id)}
              >
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full duration-300"></span>
              </li>
            ))}
          </ul>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-blue-400"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-zinc-800">
            <ul className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map(({ label, id }) => (
                <li
                  key={id}
                  className="text-gray-300 hover:text-blue-400 transition cursor-pointer"
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* ===== HOME SECTION ===== */}
      <section id="home" className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Upgrade Your Skills.<br />
            <span className="text-blue-400">Track. Learn. Certify.</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Personalized learning paths, real-world projects, micro-certificates,
            and progress tracking — all in one platform.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <button
              onClick={() => scrollToSection("about")}
              className="relative group overflow-hidden rounded-lg px-6 py-2 font-semibold text-white bg-blue-600 hover:scale-105 transition shadow-md"
            >
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125"></div>
            </button>
            <button
              onClick={() => scrollToSection("privacy")}
              className="relative group overflow-hidden rounded-lg px-6 py-2 font-semibold text-blue-400 border border-blue-500 hover:text-white hover:scale-105 transition"
            >
              <span className="relative z-10">View Privacy</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg scale-150"></span>
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <div className="w-full md:w-1/2 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[ 
            { icon: <BookOpenCheck className="text-cyan-400 w-7 h-7 mb-2" />, title: "Modern Learning", text: "Master new-age tech skills easily." },
            { icon: <BrainCircuit className="text-purple-400 w-7 h-7 mb-2" />, title: "Track Progress", text: "Visualize milestones & achievements." },
            { icon: <UsersRound className="text-yellow-400 w-7 h-7 mb-2" />, title: "Community Support", text: "Engage with learners & mentors." },
            { icon: <BarChart3 className="text-pink-400 w-7 h-7 mb-2" />, title: "Real Results", text: "Work on real projects & get certified." },
          ].map((f, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-zinc-800/70 hover:bg-zinc-800/90 border border-zinc-700 rounded-xl p-5 shadow-lg"
            >
              {f.icon}
              <h4 className="text-white text-lg font-semibold mb-1">{f.title}</h4>
              <p className="text-sm text-gray-300">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-blue-400 mb-6"
        >
          About SkillHub
        </motion.h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          SkillHub is a next-generation platform designed to help learners build
          practical skills through guided paths, interactive lessons, and
          real-world projects. We bridge the gap between theory and practice,
          ensuring learners are job-ready with verified certifications.
        </p>
      </section>

      {/* ===== PRIVACY SECTION ===== */}
      <section id="privacy" className="py-20 px-6 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blue-400 mb-8 text-center"
        >
          Privacy Policy
        </motion.h2>
        <div className="text-gray-300 space-y-6 text-justify">
          <p>
            We value your privacy and collect only essential information such as
            your name, email, and learning activity to personalize your
            experience.
          </p>
          <p>
            Your data is never sold or shared and remains protected with strong
            encryption and best security practices.
          </p>
          <p>
            You can request data removal anytime by contacting our support team.
          </p>
        </div>
      </section>

      {/* ===== TERMS SECTION ===== */}
      <section id="terms" className="py-20 px-6 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blue-400 mb-8 text-center"
        >
          Terms & Conditions
        </motion.h2>
        <div className="text-gray-300 space-y-6 text-justify">
          <p>
            By using SkillHub, you agree to our terms of service. Please use the
            platform responsibly and ethically.
          </p>
          <p>
            Any misuse, unauthorized distribution, or violation may result in
            suspension or legal action.
          </p>
          <p>
            We reserve the right to modify terms periodically. Continued use
            implies acceptance of updates.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-24 border-t border-zinc-800 py-10 px-6 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            SkillHub
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Empowering learners through guided, structured, and gamified
            education.
          </p>
          <div className="flex justify-center gap-6 text-gray-300 mt-4 flex-wrap">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="hover:text-blue-400 transition"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} SkillHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
