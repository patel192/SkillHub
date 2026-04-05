import React, { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, User, BookOpen, MessageSquare, 
  ChevronRight, Search, Clock, ShieldCheck, 
  Filter, ArrowLeft, MoreVertical, Flag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#10B981",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  border: "var(--border)"
};

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { token, authLoading } = useAuth();

  useEffect(() => {
    if (!token || authLoading) return;
    fetchReports();
  }, [token, authLoading]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/reports");
      setReports(res.data?.reports || []);
    } catch (err) {
      toast.error("Telemetry link failure");
    } finally {
      setLoading(false);
    }
  };

  const getTargetIcon = (type) => {
    switch (type) {
      case "User": return <User size={14} />;
      case "Course": return <BookOpen size={14} />;
      case "Post": return <MessageSquare size={14} />;
      default: return <Flag size={14} />;
    }
  };

  const filteredReports = reports.filter(r => {
    const search = searchTerm.toLowerCase();
    const reporterName = r.reporter?.fullname?.toLowerCase() || "";
    const targetName = (r.targetType === "User" ? r.targetId?.fullname : r.targetType === "Course" ? r.targetId?.title : "Post")?.toLowerCase() || "";
    return reporterName.includes(search) || targetName.includes(search);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
      <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Analyzing protocol reports...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Search Suite */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand text-[8px] font-black uppercase tracking-widest border border-brand/20">Operational Telemetry</span>
           </div>
           <h2 className="text-4xl font-black tracking-tighter" style={{ fontFamily: "'Fraunces', serif" }}>
             Registry <span className="text-brand">Reports</span>
           </h2>
           <p className="text-[11px] font-medium opacity-40 uppercase tracking-widest mt-1">Global audit log for user-submitted content flags.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
           <div className="relative group w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
              <input 
                type="text" 
                placeholder="Search registry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-surface border border-border focus:ring-2 focus:ring-brand/20 outline-none transition-all font-black text-[12px] uppercase tracking-widest placeholder:opacity-30"
              />
           </div>
           <div className="flex items-center gap-2 p-4 rounded-2xl bg-surface2 border border-border shadow-inner">
              <Filter size={16} className="opacity-30" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: ALL</span>
           </div>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-32 rounded-[3rem] bg-surface2/30 border border-dashed border-border/50">
           <div className="w-20 h-20 rounded-[2.5rem] bg-surface border border-border shadow-inner flex items-center justify-center mx-auto mb-8 opacity-20">
              <ShieldCheck size={32} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Registry Empty</p>
           <p className="text-[11px] font-bold uppercase mt-2 opacity-50">No content flags detected in current filtered view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReports.map((r, idx) => (
              <ReportCard 
                key={r._id} 
                report={r} 
                idx={idx} 
                icon={getTargetIcon(r.targetType)}
                onClick={() => navigate(`/admin/reports/${r._id}`)} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const ReportCard = ({ report: r, idx, icon, onClick }) => {
  const isResolved = r.status === 'resolved';
  const targetLabel = r.targetType === "User" ? r.targetId?.fullname : r.targetType === "Course" ? r.targetId?.title : "Distributed Node";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      onClick={onClick}
      className="group relative p-6 rounded-[2.5rem] bg-surface border border-border hover:border-brand/40 shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col gap-5"
    >
      {/* Visual Identity Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Card Header */}
      <div className="flex items-start justify-between">
         <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border border-border group-hover:border-brand/30 group-hover:bg-brand/5 transition-colors`}>
               {icon}
            </div>
            <div>
               <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Object: {r.targetType}</span>
               </div>
               <h3 className="font-black text-sm tracking-tight line-clamp-1 group-hover:text-brand transition-colors">{targetLabel || 'Anonymous Object'}</h3>
            </div>
         </div>
         <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${isResolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-400/10 text-amber-400 border-amber-400/20'}`}>
            {r.status || 'pending'}
         </span>
      </div>

      {/* Description Payload */}
      <div className="p-4 rounded-2xl bg-surface2 border border-border/50 shadow-inner group-hover:border-brand/10 transition-colors">
         <p className="text-[12px] opacity-60 font-medium italic leading-relaxed line-clamp-3">
            "{r.description || "No logic payload provided for this report."}"
         </p>
      </div>

      {/* Footer Audit Trailing */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[1rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
               {r.reporter?.fullname?.[0] || 'U'}
            </div>
            <div>
               <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Reporter</p>
               <p className="text-[10px] font-bold opacity-60">{r.reporter?.fullname || 'Anonymous Node'}</p>
            </div>
         </div>
         <div className="flex flex-col items-end">
            <p className="text-[10px] font-black uppercase opacity-20">Audit Stamp</p>
            <div className="flex items-center gap-1.5 opacity-40 text-[9px] font-bold">
               <Clock size={10} />
               {new Date(r.createdAt).toLocaleDateString()}
            </div>
         </div>
      </div>
    </motion.div>
  );
};
