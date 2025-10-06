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
  Rocket,
} from "lucide-react";

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring" },
    }),
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Paths", path: "/paths" },
    { label: "Signup", path: "/signup" },
    { label: "Login", path: "/login" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-400 hover:text-blue-500 transition duration-300 cursor-pointer">
            SkillHub
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-sm md:text-base font-medium">
            {navLinks.map(({ label, path }) => (
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-blue-400 focus:outline-none"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-zinc-800">
            <ul className="flex flex-col gap-3 px-6 py-4">
              {navLinks.map(({ label, path }) => (
                <li
                  key={label}
                  className="text-gray-300 hover:text-blue-400 transition text-base"
                >
                  <Link
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 lg:py-28 gap-10 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Upgrade Your Skills.<br />
            <span className="text-blue-400">Track. Learn. Certify.</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Personalized learning paths, real-world projects, and skill
            certifications — all in one platform.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
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

        {/* Features Grid */}
        <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              icon: <BookOpenCheck className="text-cyan-400 w-7 h-7 mb-2" />,
              title: "Learn Modern Skills",
              text: "Master front-end, back-end, and design.",
            },
            {
              icon: <BrainCircuit className="text-purple-400 w-7 h-7 mb-2" />,
              title: "Track Progress",
              text: "Monitor milestones and improve steadily.",
            },
            {
              icon: <UsersRound className="text-yellow-400 w-7 h-7 mb-2" />,
              title: "Peer Support",
              text: "Join learners and mentors globally.",
            },
            {
              icon: <BarChart3 className="text-pink-400 w-7 h-7 mb-2" />,
              title: "Real Results",
              text: "Build real projects and get certified.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-zinc-800/70 hover:bg-zinc-800/90 transition border border-zinc-700 rounded-xl p-5 shadow-lg"
            >
              {feature.icon}
              <h4 className="text-white text-lg font-semibold mb-1">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-300">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 sm:px-10 bg-transparent">
        <motion.h3
          className="text-3xl font-bold text-center mb-12"
          initial={fadeInUp.hidden}
          animate={fadeInUp.visible}
        >
          What Our Learners Say
        </motion.h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: i * 0.2, duration: 0.8 },
              }}
              className="bg-zinc-800/70 hover:bg-zinc-800/90 p-6 rounded-xl shadow-md"
            >
              <Star className="text-yellow-400 w-6 h-6 mb-2" />
              <p className="text-gray-300 text-sm mb-4">
                "SkillHub helped me grow fast and earn real certifications!"
              </p>
              <h4 className="text-white font-semibold">Jane Doe</h4>
              <p className="text-gray-400 text-sm">Frontend Developer</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h3
          className="text-3xl font-bold text-center mb-10"
          initial={fadeInUp.hidden}
          animate={fadeInUp.visible}
        >
          Frequently Asked Questions
        </motion.h3>
        <div className="space-y-5">
          {[
            "How do I start learning?",
            "What are micro-certificates?",
            "Can I track my progress?",
          ].map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { delay: i * 0.2 },
              }}
              className="bg-zinc-800/70 hover:bg-zinc-800/90 p-5 rounded-xl cursor-pointer transition"
            >
              <h4 className="text-white font-semibold">{q}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action (New Section) */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600/20 to-blue-400/10 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={fadeInUp.hidden}
            animate={fadeInUp.visible}
            className="space-y-3"
          >
            <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-4xl font-bold">
              Ready to Boost Your Career?
            </h3>
            <p className="text-gray-300 text-base sm:text-lg">
              Join SkillHub today and start your journey toward professional
              excellence with guided learning and real certifications.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button className="relative group overflow-hidden rounded-lg px-8 py-3 font-semibold text-white bg-blue-600 hover:scale-105 transition shadow-md">
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125"></div>
            </button>

            <button className="relative group overflow-hidden rounded-lg px-8 py-3 font-semibold text-blue-400 border border-blue-500 hover:text-white hover:scale-105 transition">
              <span className="relative z-10">Learn More</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg scale-150"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 px-6 text-center bg-black/50">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white">SkillHub</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Empowering learners with structured, interactive skill growth.
          </p>
          <div className="flex justify-center gap-6 text-gray-300 mt-4 flex-wrap">
            {["About", "Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-blue-400 transition"
              >
                {link}
              </a>
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
