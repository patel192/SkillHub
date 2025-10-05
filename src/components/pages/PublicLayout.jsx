import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  BrainCircuit,
  UsersRound,
  BarChart3,
  Menu,
  X,
  Star,
  Award,
  CheckCircle,
} from "lucide-react";

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring", stiffness: 50 },
    }),
  };

  const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Paths", path: "/paths" },
    { label: "Signup", path: "/signup" },
    { label: "Login", path: "/login" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition duration-300 cursor-pointer">
            SkillHub
          </h1>
          <ul className="hidden md:flex space-x-6 text-sm md:text-base font-medium">
            {navLinks.map(({ label, path }) => (
              <li key={label} className="relative group text-gray-300 hover:text-blue-400 cursor-pointer transition duration-300">
                <Link to={path}>
                  {label}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-blue-400 focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-zinc-800">
            <ul className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map(({ label, path }) => (
                <li key={label} className="text-gray-300 hover:text-blue-400 transition">
                  <Link to={path} onClick={() => setMenuOpen(false)} className="block w-full">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 gap-10">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Upgrade Your Skills.<br />
            <span className="text-blue-400">Track. Learn. Certify.</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Personalized learning paths, real-world projects, micro-certificates, and progress tracking — all in one platform.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="relative group overflow-hidden rounded-lg px-6 py-2 font-semibold text-white bg-blue-600 hover:scale-105 transition shadow-md">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125"></div>
            </button>
            <button className="relative group overflow-hidden rounded-lg px-6 py-2 font-semibold text-blue-400 border border-blue-500 hover:text-white hover:scale-105 transition">
              <span className="relative z-10">Explore Paths</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg scale-150"></span>
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <div className="w-full md:w-1/2 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: <BookOpenCheck className="text-cyan-400 w-7 h-7 mb-2" />, title: "Learn Modern Skills", text: "Master web development, design, and tech skills.", color: "text-cyan-400" },
            { icon: <BrainCircuit className="text-purple-400 w-7 h-7 mb-2" />, title: "Track Progress", text: "Visualize milestones, monitor completion.", color: "text-purple-400" },
            { icon: <UsersRound className="text-yellow-400 w-7 h-7 mb-2" />, title: "Peer Support", text: "Join communities, connect with mentors.", color: "text-yellow-400" },
            { icon: <BarChart3 className="text-pink-400 w-7 h-7 mb-2" />, title: "Real Results", text: "Build real projects and gain certificates.", color: "text-pink-400" },
          ].map((feature, i) => (
            <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={cardVariants} className="bg-zinc-900 hover:bg-zinc-800 transition border border-zinc-700 rounded-xl p-5 shadow-lg group">
              {feature.icon}
              <h4 className={`text-white text-lg font-semibold mb-1 group-hover:${feature.color}`}>{feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <motion.h3 className="text-3xl font-bold text-center mb-12" initial={fadeInUp.hidden} animate={fadeInUp.visible}>
          What Our Learners Say
        </motion.h3>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map((_, i) => (
            <motion.div key={i} initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0, transition:{ delay:i*0.2, duration:0.8 } }} className="bg-zinc-800 p-6 rounded-xl shadow-lg">
              <Star className="text-yellow-400 w-6 h-6 mb-2" />
              <p className="text-gray-300 text-sm mb-4">"SkillHub helped me improve my skills and land a job!"</p>
              <h4 className="text-white font-semibold">Jane Doe</h4>
              <p className="text-gray-400 text-sm">Frontend Developer</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.h3 className="text-3xl font-bold text-center mb-12" initial={fadeInUp.hidden} animate={fadeInUp.visible}>
          Frequently Asked Questions
        </motion.h3>
        <div className="space-y-6">
          {["How do I start?", "What are micro-certificates?", "Can I track my progress?"].map((q,i)=>(
            <motion.div key={i} initial={{opacity:0, x:50}} animate={{opacity:1, x:0, transition:{delay:i*0.2}}} className="bg-zinc-800 p-5 rounded-xl cursor-pointer hover:bg-zinc-700 transition">
              <h4 className="text-white font-semibold">{q}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-zinc-800 py-10 px-6 text-center bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">SkillHub</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Empowering students with structured, gamified learning paths.
          </p>
          <div className="flex justify-center gap-6 text-gray-300 mt-4 flex-wrap">
            <a href="#" className="hover:text-blue-400 transition">About</a>
            <a href="#" className="hover:text-blue-400 transition">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition">Terms</a>
            <a href="#" className="hover:text-blue-400 transition">Contact</a>
          </div>
          <div className="mt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} SkillHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
