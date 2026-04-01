import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, Share2, ExternalLink, FileText, CheckCircle2, Lock } from "lucide-react";

// ==========================================
// DESIGN TOKENS (Matching Dashboard Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  bg: "#0A0F0D",
  surface: "#111814",
  surface2: "#182219",
  surface3: "#1E2B22",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
  gold: "#FFD700",
};

// ==========================================
// MOCK DATA (Replace with API later)
// ==========================================
const mockCertificates = [
  {
    id: 1,
    title: "JavaScript Mastery",
    issuedBy: "CodeAcademy",
    date: "May 2025",
    certificateUrl: "#",
    verified: true,
    skills: ["ES6+", "Async/Await", "DOM Manipulation"],
  },
  {
    id: 2,
    title: "React Developer",
    issuedBy: "NeoTech Academy",
    date: "June 2025",
    certificateUrl: "#",
    verified: true,
    skills: ["Hooks", "Redux", "Next.js"],
  },
  {
    id: 3,
    title: "Frontend Web Design",
    issuedBy: "FreeCodeCamp",
    date: "July 2025",
    certificateUrl: "#",
    verified: true,
    skills: ["HTML5", "CSS3", "Responsive Design"],
  },
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const GlowCard = ({ children, className = "", onClick, verified = true }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative group cursor-pointer overflow-hidden rounded-2xl ${className}`}
    style={{
      background: "var(--surface)",
      border: `1px solid ${verified ? "var(--border)" : "rgba(255,255,255,0.05)"}`,
    }}
  >
    {/* Ambient Glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: verified
          ? `radial-gradient(circle at 50% 0%, ${C.brand}20, transparent 70%)`
          : "none",
      }}
    />
    
    {/* Bottom Glow Line */}
    <div
      className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        background: `linear-gradient(90deg, transparent, ${verified ? C.brand : "var(--text-muted)"}, transparent)`,
      }}
    />
    
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const Badge = ({ children, type = "default" }) => {
  const styles = {
    default: { bg: `${C.brand}20`, color: C.brand, border: "var(--border)" },
    gold: { bg: "rgba(255,215,0,0.15)", color: C.gold, border: "rgba(255,215,0,0.3)" },
    muted: { bg: "var(--surface)"2, color: "var(--text)"Muted, border: "var(--border)" },
  };
  
  const style = styles[type] || styles.default;
  
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
      style={{ background: style.bg, color: style.color, borderColor: style.border }}
    >
      {children}
    </span>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 px-4"
  >
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
      style={{ background: `${C.brand}15`, border: `1px solid ${"var(--border)"}` }}
    >
      <Award size={40} style={{ color: C.brand }} />
    </div>
    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
      No Certificates Yet
    </h3>
    <p className="text-center max-w-md mb-6" style={{ color: "var(--text)"Muted }}>
      Complete courses and challenges to earn verified certificates and showcase your skills.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
      style={{
        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
        color: "var(--bg)",
        boxShadow: `0 4px 20px ${C.brand}40`,
      }}
    >
      <ExternalLink size={18} />
      Browse Courses
    </motion.button>
  </motion.div>
);

// ==========================================
// CERTIFICATE CARD COMPONENT
// ==========================================

const CertificateCard = ({ cert, index }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <GlowCard verified={cert.verified} className="p-5 sm:p-6">
        {/* Header with Icon & Actions */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{
              background: cert.verified ? `${C.brand}20` : "var(--surface)"2,
              border: `1px solid ${cert.verified ? "var(--border)" : "rgba(255,255,255,0.05)"}`,
            }}
          >
            <FileText size={24} style={{ color: cert.verified ? C.brand : "var(--text-muted)" }} />
          </div>
          
          <div className="flex items-center gap-2">
            {cert.verified && (
              <Badge type="gold">
                <CheckCircle2 size={10} />
                Verified
              </Badge>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text)"Muted }}
              title="Preview"
            >
              <ExternalLink size={18} />
            </motion.button>
          </div>
        </div>

        {/* Title & Issuer */}
        <h3
          className="text-lg sm:text-xl font-bold mb-2 line-clamp-1"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
        >
          {cert.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm" style={{ color: "var(--text)"Muted }}>Issued by</span>
          <span className="text-sm font-medium" style={{ color: C.brand }}>{cert.issuedBy}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <Award size={14} />
          <span>{cert.date}</span>
        </div>

        {/* Skills Tags */}
        {cert.skills && (
          <div className="flex flex-wrap gap-2 mb-4">
            {cert.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-lg text-xs"
                style={{ background: "var(--surface)"2, color: "var(--text)"Muted, border: `1px solid ${"var(--border)"}` }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <motion.a
            href={cert.certificateUrl}
            download
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "var(--surface)"2,
              border: `1px solid ${"var(--border)"}`,
              color: "var(--text)"Muted,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </motion.a>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
              color: "var(--bg)",
            }}
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </motion.button>
        </div>
      </GlowCard>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-bold" style={{ color: "var(--text)" }}>{cert.title}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "var(--text)"Muted }}
                >
                  <Lock size={20} />
                </button>
              </div>
              
              {/* Certificate Preview Placeholder */}
              <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div
                  className="w-full max-w-2xl h-64 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: "var(--surface)"2, border: `2px dashed ${"var(--border)"}` }}
                >
                  <div className="text-center">
                    <FileText size={48} style={{ color: "var(--text-muted)" }} className="mx-auto mb-4" />
                    <p style={{ color: "var(--text)"Muted }}>Certificate Preview</p>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                      Actual certificate will be displayed here
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.a
                    href={cert.certificateUrl}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                      color: "var(--bg)",
                      boxShadow: `0 4px 20px ${C.brand}40`,
                    }}
                  >
                    <Download size={18} />
                    Download PDF
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// STATS COMPONENT
// ==========================================

const StatsBar = ({ certificates }) => {
  const stats = [
    { label: "Certificates", value: certificates.length, icon: Award },
    { label: "Verified", value: certificates.filter(c => c.verified).length, icon: CheckCircle2 },
    { label: "Skills", value: certificates.reduce((acc, c) => acc + (c.skills?.length || 0), 0), icon: FileText },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-3 p-3 sm:p-4 rounded-xl"
          style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
        >
          <div className="p-2 rounded-lg hidden sm:block" style={{ background: `${C.brand}15` }}>
            <stat.icon size={18} style={{ color: C.brand }} />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: "var(--text)"Muted }}>{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const Certificates = () => {
  const [filter, setFilter] = useState("all");

  const filteredCerts = mockCertificates.filter(cert => {
    if (filter === "verified") return cert.verified;
    return true;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-xl"
                style={{ background: `${C.brand}20`, border: `1px solid ${"var(--border)"}` }}
              >
                <Award size={24} style={{ color: C.brand }} />
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  My Certificates
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base max-w-lg" style={{ color: "var(--text)"Muted }}>
              Showcase your achievements and verified skills. Download or share your certificates anytime.
            </p>
          </div>

          {/* Add Certificate Button (Future Feature) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap"
            style={{
              background: "var(--surface)"2,
              border: `1px solid ${"var(--border)"}`,
              color: "var(--text)"Muted,
            }}
          >
            <ExternalLink size={16} />
            Import External
          </motion.button>
        </motion.div>

        {/* Stats */}
        <StatsBar certificates={mockCertificates} />

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          {[
            { id: "all", label: "All Certificates", count: mockCertificates.length },
            { id: "verified", label: "Verified Only", count: mockCertificates.filter(c => c.verified).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === tab.id ? C.brand : "var(--surface)",
                color: filter === tab.id ? "var(--bg)" : "var(--text)"Muted,
                border: `1px solid ${filter === tab.id ? C.brand : "var(--border)"}`,
              }}
            >
              {tab.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  background: filter === tab.id ? "rgba(0,0,0,0.2)" : "var(--surface)"2,
                  color: filter === tab.id ? "var(--bg)" : "var(--text)"Muted,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        {filteredCerts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCerts.map((cert, idx) => (
              <CertificateCard key={cert.id} cert={cert} index={idx} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Future Integration Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-4 rounded-xl text-center"
          style={{ background: "var(--surface)"2, border: `1px dashed ${"var(--border)"}` }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            💡 <strong>Coming Soon:</strong> Automatic certificate generation upon course completion
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificates;