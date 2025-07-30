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
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1e293b] text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Award className="text-blue-500" /> My Certificates
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCertificates.map((cert) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: cert.id * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1e293b] rounded-2xl p-5 shadow-lg border border-blue-500/30 hover:border-blue-400 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-white">{cert.title}</h3>
              <a
                href={cert.certificateUrl}
                download
                className="text-blue-400 hover:text-blue-300 transition"
              >
                <Download />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Issued by <span className="text-blue-300">{cert.issuedBy}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">{cert.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
