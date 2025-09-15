import React from "react";
import { motion } from "framer-motion";
import { Download, Award } from "lucide-react";

const mockCertificates = [
  {
    id: 1,
    title: "JavaScript Mastery",
    issuedBy: "CodeAcademy",
    date: "May 2025",
    certificateUrl: "#",
  },
  {
    id: 2,
    title: "React Developer",
    issuedBy: "NeoTech Academy",
    date: "June 2025",
    certificateUrl: "#",
  },
  {
    id: 3,
    title: "Frontend Web Design",
    issuedBy: "FreeCodeCamp",
    date: "July 2025",
    certificateUrl: "#",
  },
];

export const Certificates = () => {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E1B3A] text-white">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <Award className="text-purple-400 animate-bounce" size={32} />
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          My Certificates
        </h2>
      </div>

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCertificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(139, 92, 246, 0.7)" }}
            className="relative bg-[#141627] rounded-2xl p-6 border border-purple-600/40 hover:border-cyan-400/70 transition-all shadow-lg"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition duration-500 blur-xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                <a
                  href={cert.certificateUrl}
                  download
                  className="text-cyan-400 hover:text-cyan-300 transition"
                >
                  <Download size={22} />
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                Issued by{" "}
                <span className="text-purple-300 font-medium">
                  {cert.issuedBy}
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-1">{cert.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
