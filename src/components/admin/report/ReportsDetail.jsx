import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, Trash2, AlertTriangle, 
  Mail, User, FileText, Tag, Clock, Info, 
  ExternalLink, Shield, ShieldCheck, Activity,
  Calendar, Layers, Globe, MoreVertical
} from "lucide-react";
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

export const ReportsDetail = () => {
  const { token, authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token || authLoading) return;
    fetchReport();
  }, [id, token, authLoading]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/reports/${id}`);
      setReport(res.data.report);
    } catch (err) {
      toast.error("Failed to fetch protocol data");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    const tid = toast.loading("Resolving protocol flag...");
    try {
      await apiClient.patch(`/reports/${id}`, { status: "resolved" });
      setReport((prev) => ({ ...prev, status: "resolved" }));
      toast.success("Flag resolved", { id: tid });
    } catch (err) {
      toast.error("Resolution failure", { id: tid });
    } finally {
      setResolving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const tid = toast.loading("Purging flag record...");
    try {
      await apiClient.delete(`/report/${id}`);
      toast.success("Record purged", { id: tid });
      setTimeout(() => navigate("/admin/reports"), 1000);
    } catch (err) {
      toast.error("Purge failure", { id: tid });
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
      <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Decrypting target telemetry...</p>
    </div>
  );

  if (!report) return (
    <div className="text-center py-32 rounded-[3.5rem] bg-surface2/30 border border-dashed border-error/20">
       <AlertTriangle size={48} className="mx-auto mb-4 text-error" />
       <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>Node Not Found</h2>
       <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">The requested protocol flag does not exist or has been purged.</p>
       <button onClick={() => navigate("/admin/reports")} className="mt-8 px-8 py-3 rounded-2xl bg-surface border border-border text-[10px] font-black uppercase">Return to Registry</button>
    </div>
  );

  const getTargetLink = () => {
    if (!report.targetId) return "#";
    switch (report.targetType) {
      case "User": return `/admin/users/${report.targetId._id}`;
      case "Course": return `/admin/resources/${report.targetId._id}`;
      case "Post": return `/admin/communities`;
      default: return "#";
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Suite */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
         <div className="space-y-4">
            <button 
              onClick={() => navigate("/admin/reports")}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft size={14} /> Back to Registry
            </button>
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-[2rem] bg-surface border border-border shadow-2xl flex items-center justify-center">
                  <AlertTriangle size={32} className="text-brand opacity-80" />
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-1">
                     <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${report.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-400/10 text-amber-400 border-amber-400/20'}`}>
                        {report.status || 'Pending Review'}
                     </span>
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Flag ID: {report._id.slice(-8)}</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tighter" style={{ fontFamily: "'Fraunces', serif" }}>
                    Detail <span className="text-brand">Protocol</span>
                  </h1>
               </div>
            </div>
         </div>

         <div className="flex flex-wrap gap-4">
            {report.status !== "resolved" && (
               <button 
                 onClick={handleResolve} 
                 disabled={resolving}
                 className="px-8 py-4 rounded-2xl bg-brand text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3"
               >
                 <CheckCircle size={16} /> Mark as Resolved
               </button>
            )}
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="px-8 py-4 rounded-2xl bg-surface border border-border font-black uppercase tracking-[0.2em] text-[10px] opacity-60 hover:opacity-100 hover:text-error hover:border-error/30 transition-all active:scale-95 flex items-center gap-3"
            >
              <Trash2 size={16} /> Purge Record
            </button>
         </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* Main Content Side */}
         <div className="xl:col-span-8 space-y-8">
            <BentoSection icon={<FileText size={20} />} title="Report Payload" subtitle="User-submitted description and context">
               <div className="p-8 rounded-[2.5rem] bg-surface2 border border-border shadow-inner group">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand group-hover:animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Raw Observation</span>
                     </div>
                     <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">{report.type}</span>
                  </div>
                  <p className="text-lg font-medium leading-relaxed italic opacity-80" style={{ fontFamily: "'Fraunces', serif" }}>
                    "{report.description || "No specific logic payload provided for this protocol flag."}"
                  </p>
               </div>
            </BentoSection>

            <BentoSection icon={<Globe size={20} />} title="Target Object" subtitle="Content referenced in this observation">
               <div className="p-8 rounded-[2.5rem] bg-surface border border-border shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 group">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 rounded-[2.5rem] bg-surface2 border border-border shadow-inner flex items-center justify-center">
                        {report.targetType === "User" ? <User size={32} /> : report.targetType === "Course" ? <BookOpen size={32} /> : <Layers size={32} />}
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1">Target Identity</p>
                        <h3 className="text-2xl font-black tracking-tight">{report.targetType === "User" ? report.targetId?.fullname : report.targetId?.title || "System Object"}</h3>
                        <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mt-1">{report.targetType} NODE</p>
                     </div>
                  </div>
                  <Link 
                    to={getTargetLink()}
                    className="w-full md:w-auto px-10 py-5 rounded-2xl bg-brand/5 text-brand border border-brand/20 hover:bg-brand text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    View Target <ExternalLink size={16} />
                  </Link>
               </div>
            </BentoSection>
         </div>

         {/* Sidebar Metadata Side */}
         <div className="xl:col-span-4 space-y-8">
            <BentoSection icon={<User size={20} />} title="Reporter Identity" subtitle="Origin of the observation node">
               <div className="p-6 rounded-[2.5rem] bg-surface border border-border shadow-xl space-y-6">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 rounded-3xl bg-surface2 flex items-center justify-center text-2xl font-black text-brand shadow-inner border border-border">
                        {report.reporter?.fullname?.[0] || 'A'}
                     </div>
                     <div>
                        <h4 className="font-black text-lg line-clamp-1">{report.reporter?.fullname || "Anonymous Node"}</h4>
                        <div className="flex items-center gap-2 mt-1 opacity-40 hover:opacity-100 transition-opacity">
                           <Mail size={12} />
                           <span className="text-[11px] font-bold">{report.reporter?.email || "Encrypted Entry"}</span>
                        </div>
                     </div>
                  </div>
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                     <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-surface2 border border-border shadow-inner">
                        <Activity size={14} className="opacity-30" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Auth Level: USER</span>
                     </div>
                     <button className="p-2 rounded-xl border border-border hover:bg-surface2 transition-all opacity-20">
                        <MoreVertical size={16} />
                     </button>
                  </div>
               </div>
            </BentoSection>

            <BentoSection icon={<Calendar size={20} />} title="Protocol Metadata" subtitle="Audit timeline and state tracking">
               <div className="p-6 rounded-[2.5rem] bg-surface2 border border-border/50 shadow-inner space-y-4">
                  <AuditItem icon={<Clock size={14} />} label="Creation Stamp" value={new Date(report.createdAt).toLocaleString()} />
                  <AuditItem icon={<Clock size={14} />} label="Last Activity" value={new Date(report.updatedAt).toLocaleString()} />
                  <AuditItem icon={<Shield size={14} />} label="Security Level" value="Verified Audit" />
               </div>
            </BentoSection>

            <div className="p-8 rounded-[3rem] bg-brand text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
               <ShieldCheck size={48} className="opacity-20 mb-6 group-hover:scale-110 transition-transform" />
               <h4 className="text-xl font-black tracking-tight mb-2">Audit Compliance</h4>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-relaxed">All observation nodes are permanently recorded in the distributed system audit log for security purposes.</p>
            </div>
         </div>

      </div>
    </div>
  );
};

const BentoSection = ({ icon, title, subtitle, children }) => (
  <div className="space-y-4">
     <div className="flex items-center gap-4 px-4">
        <div className="w-10 h-10 rounded-xl bg-surface2 border border-border shadow-inner flex items-center justify-center opacity-60">{icon}</div>
        <div>
           <h3 className="text-xs font-black uppercase tracking-widest">{title}</h3>
           <p className="text-[9px] font-bold uppercase opacity-30 tracking-tight">{subtitle}</p>
        </div>
     </div>
     {children}
  </div>
);

const AuditItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-2">
     <div className="flex items-center gap-3">
        <div className="opacity-20">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</span>
     </div>
     <span className="text-[11px] font-bold opacity-60">{value}</span>
  </div>
);
