import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, ShieldCheck, FileText, ArrowRight, Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

export const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = ["about", "privacy", "terms"];
  const pageLinks = ["signup", "login"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0B1220] to-black text-white overflow-x-hidden">
      {/* ===== Navbar ===== */}
      <header className="fixed top-0 left-0 w-full bg-[#0B1220]/80 backdrop-blur-md border-b border-purple-500/20 z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-purple-400 tracking-wide"
          >
            SkillHub
          </motion.h1>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            {navLinks.map((item) => (
              <ScrollLink
                key={item}
                to={item}
                smooth
                duration={600}
                offset={-70}
                className="hover:text-purple-400 transition-colors cursor-pointer capitalize"
              >
                {item}
              </ScrollLink>
            ))}
            {pageLinks.map((page) => (
              <Link
                key={page}
                to={`/${page}`}
                className="hover:text-purple-400 transition-colors cursor-pointer capitalize"
              >
                {page}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden bg-[#0B1220]/90 border-t border-purple-500/20"
        >
          <div className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map((item) => (
              <ScrollLink
                key={item}
                to={item}
                smooth
                duration={600}
                offset={-70}
                onClick={() => setMenuOpen(false)}
                className="hover:text-purple-400 transition-colors cursor-pointer capitalize text-lg"
              >
                {item}
              </ScrollLink>
            ))}
            {pageLinks.map((page) => (
              <Link
                key={page}
                to={`/${page}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-purple-400 transition-colors cursor-pointer capitalize text-lg"
              >
                {page}
              </Link>
            ))}
          </div>
        </motion.div>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-32">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Learn Smarter. Build Better. Grow Faster.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-3xl text-gray-300 text-base md:text-lg leading-relaxed"
        >
          SkillHub is the next-generation learning ecosystem empowering learners, professionals, and organizations to upskill with interactive experiences, real-world challenges, and AI-powered learning insights — all in one place.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <ScrollLink
            to="about"
            smooth
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg text-sm flex items-center gap-2 transition cursor-pointer"
          >
            Discover More <ArrowRight size={16} />
          </ScrollLink>
          <ScrollLink
            to="privacy"
            smooth
            className="px-6 py-3 border border-purple-500 hover:bg-purple-500/10 rounded-full text-sm transition cursor-pointer"
          >
            Our Promise
          </ScrollLink>
        </motion.div>
      </section>

      {/* ===== About Section ===== */}
      <section
        id="about"
        className="px-6 py-24 flex flex-col justify-center items-center text-center max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <Info className="text-purple-400" size={48} />
          </div>
          <h3 className="text-4xl md:text-5xl font-semibold mb-6">
            About <span className="text-purple-400">SkillHub</span>
          </h3>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mx-auto max-w-3xl">
            SkillHub redefines how you learn and grow in the digital age. From technical bootcamps and creative workshops to AI-powered career tracking, we connect learners with mentors and real-world opportunities that accelerate success.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "AI-Driven Learning Paths",
                desc: "Personalized course recommendations designed by AI to suit your pace, goals, and industry needs.",
              },
              {
                title: "Collaborative Projects",
                desc: "Build, share, and showcase real-world projects with peers and mentors to stand out in your career.",
              },
              {
                title: "Progress Analytics",
                desc: "Gain deep insights into your learning journey with advanced analytics and milestone tracking.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-[#12192E]/80 border border-purple-500/20 p-8 rounded-3xl shadow-xl text-left hover:shadow-purple-900/30"
              >
                <h4 className="text-xl font-semibold mb-3 text-purple-400">{card.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== Privacy Section ===== */}
      <section
        id="privacy"
        className="px-6 py-24 flex flex-col justify-center items-center text-center max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <ShieldCheck className="text-green-400" size={48} />
          </div>
          <h3 className="text-4xl md:text-5xl font-semibold mb-6">
            Our <span className="text-green-400">Privacy Commitment</span>
          </h3>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mx-auto max-w-3xl">
            Your trust is our greatest asset. SkillHub ensures complete data confidentiality through advanced encryption, transparent practices, and user-first privacy design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {[
              { title: "Data Encryption", desc: "We use industry-grade AES-256 encryption to protect your information at every step." },
              { title: "User Control", desc: "You decide how your data is stored, used, and shared. We empower transparency." },
              { title: "No Third-Party Sharing", desc: "Your data stays with us — no resale, no sharing, no compromise." },
              { title: "24/7 Security Audits", desc: "Continuous monitoring and compliance checks to keep your privacy uncompromised." },
            ].map((card, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-[#12192E]/80 border border-green-500/20 p-8 rounded-3xl shadow-xl text-left hover:shadow-green-900/30">
                <h4 className="text-xl font-semibold mb-3 text-green-400">{card.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== Terms Section ===== */}
      <section
        id="terms"
        className="px-6 py-24 flex flex-col justify-center items-center text-center max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <FileText className="text-blue-400" size={48} />
          </div>
          <h3 className="text-4xl md:text-5xl font-semibold mb-6">
            Terms & <span className="text-blue-400">Conditions</span>
          </h3>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mx-auto max-w-3xl">
            We promote respectful communication, fair use, and originality across the SkillHub community. By engaging with our platform, you agree to uphold professional standards and maintain integrity in all collaborations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {[
              { title: "Respectful Conduct", desc: "Collaborate professionally and foster a positive learning environment." },
              { title: "Authentic Submissions", desc: "Only submit your original work — plagiarism is strictly prohibited." },
              { title: "Copyright Compliance", desc: "Respect intellectual property and follow content usage rules." },
              { title: "Fair Usage Policy", desc: "Maintain integrity by using resources responsibly and ethically." },
            ].map((rule, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-[#12192E]/80 border border-blue-500/20 p-8 rounded-3xl shadow-xl text-left hover:shadow-blue-900/30">
                <h4 className="text-xl font-semibold mb-3 text-blue-400">{rule.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#0B1220]/80 border-t border-purple-500/20 py-8 text-center text-gray-400 text-sm">
        © 2025 SkillHub — Empowering Future Innovators.
      </footer>
    </div>
  );
};
