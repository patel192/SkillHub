import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Info, FileText } from "lucide-react";
import { Link } from "react-scroll";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#10172A] to-black text-white overflow-hidden">
      {/* ===== Navbar ===== */}
      <header className="fixed top-0 left-0 w-full bg-[#0F1629]/80 backdrop-blur-md border-b border-purple-500/20 z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-purple-400">SkillHub</h1>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="about" smooth className="hover:text-purple-400 cursor-pointer">
              About
            </Link>
            <Link to="privacy" smooth className="hover:text-purple-400 cursor-pointer">
              Privacy
            </Link>
            <Link to="terms" smooth className="hover:text-purple-400 cursor-pointer">
              Terms
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-32">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Explore. Learn. Grow.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl text-gray-300 text-sm md:text-base"
        >
          EduVerse is your all-in-one platform for online learning, interactive courses, and community-driven knowledge sharing.  
          We blend technology, creativity, and innovation for a seamless learning experience.
        </motion.p>
        <motion.div
          className="mt-10 flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="about"
            smooth
            className="px-6 py-2 bg-purple-600/80 hover:bg-purple-700 rounded-full shadow-lg text-sm"
          >
            Learn More
          </Link>
          <Link
            to="privacy"
            smooth
            className="px-6 py-2 bg-transparent border border-purple-500 hover:bg-purple-500/20 rounded-full text-sm"
          >
            Our Policy
          </Link>
        </motion.div>
      </section>

      {/* ===== About Section ===== */}
      <section
        id="about"
        className="min-h-screen px-6 py-20 flex flex-col justify-center items-center text-center bg-[#131B3B]/40 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex justify-center mb-6">
            <Info className="text-purple-400" size={40} />
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">About EduVerse</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            EduVerse was created with the vision of making education accessible and engaging for everyone.  
            Our platform enables users to explore curated learning paths, collaborate with mentors, and grow professionally.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {["Interactive Learning", "Community Support", "Real-world Projects"].map((title, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-[#1C2541]/70 p-6 rounded-2xl shadow-lg border border-purple-500/30"
              >
                <h4 className="text-lg font-semibold text-purple-400">{title}</h4>
                <p className="text-gray-400 text-sm mt-2">
                  Experience modern education through collaboration, creativity, and technology.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== Privacy Policy Section ===== */}
      <section
        id="privacy"
        className="min-h-screen px-6 py-20 flex flex-col justify-center items-center text-center bg-[#0E1428]/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex justify-center mb-6">
            <ShieldCheck className="text-green-400" size={40} />
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">Privacy Policy</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Your privacy is our top priority. EduVerse collects minimal user data strictly for providing better educational experiences.  
            We never sell or share your data with third parties.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {["Data Encryption", "Secure Authentication", "User Control", "Transparency"].map((point, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-[#1C2541]/70 p-6 rounded-2xl shadow-lg border border-green-500/30"
              >
                <h4 className="text-lg font-semibold text-green-400">{point}</h4>
                <p className="text-gray-400 text-sm mt-2">
                  We ensure your safety through encrypted connections and privacy-first design.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== Terms Section ===== */}
      <section
        id="terms"
        className="min-h-screen px-6 py-20 flex flex-col justify-center items-center text-center bg-[#131B3B]/40 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex justify-center mb-6">
            <FileText className="text-blue-400" size={40} />
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">Terms & Conditions</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            By using EduVerse, you agree to our guidelines and community standards.  
            We value respectful interactions and encourage knowledge-driven participation.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Respectful Communication", "Authentic Contributions", "Copyright Protection", "Fair Usage"].map(
              (rule, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#1C2541]/70 p-6 rounded-2xl shadow-lg border border-blue-500/30"
                >
                  <h4 className="text-lg font-semibold text-blue-400">{rule}</h4>
                  <p className="text-gray-400 text-sm mt-2">
                    These terms ensure a safe, inclusive, and productive environment for all learners.
                  </p>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#0F1629]/80 border-t border-purple-500/20 py-6 text-center text-gray-400 text-sm">
        © 2025 SkillHub. All rights reserved.
      </footer>
    </div>
  );
};
