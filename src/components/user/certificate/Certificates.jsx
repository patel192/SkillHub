import React from "react";
import { motion } from "framer-motion";
import { Award, Download } from "lucide-react";

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
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white">

      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <Award size={30} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 text-transparent bg-clip-text">
          My Certificates
        </h1>
      </div>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCertificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ scale: 1.03 }}
            className="
              relative rounded-2xl p-6
              bg-[#15182a]/80 backdrop-blur-xl 
              border border-white/10
              hover:border-purple-400/40 
              transition-all duration-300 shadow-xl
            "
          >
            {/* Glow */}
            <div className="
              absolute inset-0 rounded-2xl opacity-0 
              hover:opacity-30 transition duration-500 
              bg-gradient-to-r from-purple-600 to-cyan-400 blur-2xl
            " />

            {/* Content */}
            <div className="relative z-10">

              {/* Title & Download */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{cert.title}</h3>

                <a
                  href={cert.certificateUrl}
                  download
                  className="text-cyan-300 hover:text-cyan-200 transition"
                  title="Download Certificate"
                >
                  <Download size={20} />
                </a>
              </div>

              <p className="text-gray-300 text-sm">
                Issued by:{" "}
                <span className="text-purple-300 font-medium">{cert.issuedBy}</span>
              </p>

              <p className="text-xs text-gray-500 mt-2">{cert.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
