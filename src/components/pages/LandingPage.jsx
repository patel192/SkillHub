import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  BrainCircuit,
  UsersRound,
  BarChart3,
} from "lucide-react";
export const LandingPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 50,
      },
    }),
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] cursor-pointer">
            SkillHub
          </h1>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 text-sm md:text-base font-medium">
            {[
              { label: "Home", path: "/" },
              { label: "Paths", path: "/paths" },
              { label: "Signup", path: "/signup" },
              { label: "Login", path: "/login" },
            ].map(({ label, path }) => (
              <li
                key={label}
                className="relative group text-gray-300 hover:text-blue-400 cursor-pointer transition duration-300"
              >
                <Link to={path}>
                  {label}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Upgrade Your Skills.
            <br />
            <span className="text-blue-400">Track. Learn. Certify.</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Discover personalized learning paths, earn micro-certificates, and
            build your portfolio with real-world projects — all in one platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            {/* Get Started Button */}
            <button className="relative group overflow-hidden rounded-lg px-6 py-2 font-semibold text-white bg-blue-600 transition duration-300 ease-in-out hover:scale-105 shadow-md">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125"></div>
            </button>

            {/* Explore Paths Button */}
            <button className="relative group overflow-hidden rounded-lg px-6 py-2 font-semibold text-blue-400 border border-blue-500 transition-all duration-300 ease-in-out hover:text-white hover:scale-105">
              <span className="relative z-10">Explore Paths</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg scale-150"></span>
            </button>
          </div>
        </motion.div>
        <div className="w-full md:w-1/2 mt-12 md:mt-0 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            // Array for mapping the feature content
            {
              icon: <BookOpenCheck className="text-cyan-400 w-7 h-7 mb-2" />,
              title: "Learn Modern Skills",
              text: "Master web development, design, and tech skills with structured paths and bite-sized lessons.",
              color: "text-cyan-400",
            },
            {
              icon: <BrainCircuit className="text-purple-400 w-7 h-7 mb-2" />,
              title: "Track Your Progress",
              text: "Visualize learning milestones, monitor course completion, and stay motivated.",
              color: "text-purple-400",
            },
            {
              icon: <UsersRound className="text-yellow-400 w-7 h-7 mb-2" />,
              title: "Peer Support",
              text: "Join communities, connect with mentors, and share your learning journey.",
              color: "text-yellow-400",
            },
            {
              icon: <BarChart3 className="text-pink-400 w-7 h-7 mb-2" />,
              title: "Real Results",
              text: "Build real projects, gain certificates, and prepare for career opportunities in tech.",
              color: "text-pink-400",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-zinc-900 hover:bg-zinc-800 transition duration-300 border border-zinc-700 rounded-xl p-5 shadow-lg group"
            >
              {feature.icon}
              <h4
                className={`text-white text-lg font-semibold mb-1 group-hover:${feature.color}`}
              >
                {feature.title}
              </h4>
              <p className="text-sm text-gray-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <footer className="mt-24 border-t border-zinc-800 py-10 px-6 text-center bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            SkillHub
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Empowering students and professionals with structured, gamified
            learning paths and real-world skill tracking.
          </p>

          <div className="flex justify-center gap-6 text-gray-300 mt-4">
            <a href="#" className="hover:text-blue-400 transition">
              About
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Terms
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Contact
            </a>
          </div>

          <div className="mt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} SkillHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
