import { useSelector, useDispatch } from "react-redux";
import { fetchUserById, toggleUserStatus, toggleUserRole } from "../../../redux/features/users/usersSlice";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Edit, ShieldAlert, Trash2, 
  Mail, Calendar, MapPin, Phone, 
  BookOpen, Award, CheckCircle, Clock, 
  Shield, Zap, Activity, MoreHorizontal,
  Power, Key, User as UserIcon, XCircle
} from "lucide-react";
import toast from "react-hot-toast";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  accent: "var(--accent)",
  success: "#10B981",
  error: "var(--error)",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  border: "var(--border)"
};

export const UserDetails = () => {
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser: user, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      await dispatch(fetchUserById(id)).unwrap();
    } catch (err) {
      toast.error("Failed to sync user profile");
      navigate("/admin/users");
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchUser();
  }, [id, token, authLoading]);

  const handleToggleStatus = async () => {
    const toastId = toast.loading(`${user.isActive ? 'Deactivating' : 'Restoring'} profile...`);
    try {
      await dispatch(toggleUserStatus({ id, isActive: !user.isActive })).unwrap();
      toast.success(user.isActive ? "Access Restricted" : "Access Restored", { id: toastId });
    } catch (err) {
      toast.error("Status update failed", { id: toastId });
    }
  };

  const handleToggleRole = async () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const toastId = toast.loading(`Promoting to ${newRole}...`);
    try {
      await dispatch(toggleUserRole({ id, role: newRole })).unwrap();
      toast.success(`Role escalated to ${newRole}`, { id: toastId });
    } catch (err) {
      toast.error("Role update failed", { id: toastId });
    }
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Decrypting user profile...</p>
      </div>
    );
  }

  if (!user) return <div className="text-center py-20 opacity-40">User record not found.</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* ====================== HEADER / CONTROL BAR ====================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col">
           <button 
             onClick={() => navigate("/admin/users")}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-2"
           >
             <ArrowLeft size={14} /> Back to Registry
           </button>
           <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             User <span className="text-brand">360 View</span>
           </h1>
           <div className="flex items-center gap-4 mt-2">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {user.isActive ? 'Verified Account' : 'Manual Restriction'}
              </span>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-1.5"><Shield size={12} /> {user.role} Authorization</span>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={handleToggleStatus}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${user.isActive ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
           >
             {user.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
             {user.isActive ? 'Suspend Access' : 'Restore Access'}
           </button>
           <button className="p-2.5 rounded-2xl bg-surface border border-border opacity-30 hover:opacity-100 transition-all">
             <MoreHorizontal size={18} />
           </button>
        </div>
      </div>

      {/* ====================== PROFILE BENTO GRID ====================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Identity (4 units) */}
        <div className="xl:col-span-4 space-y-6">
           <div className="p-8 rounded-[3rem] bg-surface border border-border shadow-2xl flex flex-col items-center text-center">
              <div className="relative group">
                 <div className="absolute inset-0 rounded-[2.5rem] bg-brand/20 blur-2xl group-hover:blur-3xl transition-all" />
                 <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=random`} 
                    className="relative w-40 h-40 rounded-[2.5rem] border-4 border-surface shadow-2xl object-cover"
                    alt="" 
                 />
                 <div className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-brand text-white shadow-xl">
                    <Zap size={20} />
                 </div>
              </div>

              <h2 className="text-2xl font-black mt-8 tracking-tight">{user.fullname}</h2>
              <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                 <div className="p-4 rounded-3xl bg-surface2 border border-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">Rank</p>
                    <span className="text-xs font-black text-brand uppercase">{user.role}</span>
                 </div>
                 <div className="p-4 rounded-3xl bg-surface2 border border-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">Auth ID</p>
                    <span className="text-xs font-black opacity-60">#{user._id.slice(-6)}</span>
                 </div>
              </div>

              <div className="w-full pt-8 mt-8 border-t border-border/50 space-y-4">
                 <IdentityDetail icon={<Mail size={14} />} label="Primary Email" value={user.email} />
                 <IdentityDetail icon={<Calendar size={14} />} label="Joined Platform" value={new Date(user.createdAt).toLocaleDateString()} />
                 <IdentityDetail icon={<Activity size={14} />} label="Last Session" value="2 hours ago" />
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-surface2/50 border border-border border-dashed space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 text-center">Security Vault</h4>
              <div className="space-y-3">
                 <SecurityAction icon={<Key />} label="Reset Credentials" sub="Send reset link to user" />
                 <SecurityAction icon={<ShieldAlert />} label="Escalate Privileges" sub="Grant administrative rights" onClick={handleToggleRole} />
                 <SecurityAction icon={<Trash2 />} label="Purge Identity" sub="Irreversibly delete account" color={C.error} />
              </div>
           </div>
        </div>

        {/* Right Col: Stats & Activity (8 units) */}
        <div className="xl:col-span-8 space-y-6">
           
           {/* Section: Pulse Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<BookOpen />} value="12" label="Courses Enrolled" delta="+2 this month" color={C.brand} />
              <StatCard icon={<CheckCircle />} value="08" label="Modules Completed" delta="75% success" color={C.success} />
              <StatCard icon={<Award />} value="04" label="Global Certs" delta="Top 10th percentile" color={C.accent} />
           </div>

           {/* Section: Interaction Analytics */}
           <div className="p-8 rounded-[3rem] bg-surface border border-border shadow-2xl space-y-8">
              <div className="flex items-center justify-between border-b border-border/50 pb-6">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Platform Activity</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-tight">Timeline of user interactions & learning</p>
                 </div>
                 <button className="text-[10px] font-black uppercase tracking-widest text-brand px-4 py-2 bg-brand/10 rounded-xl">View Detailed Logs</button>
              </div>

              <div className="space-y-6">
                 <ActivityItem icon={<Zap />} title="Enrolled in 'Mastering React 18'" time="2 hours ago" status="Action Required" />
                 <ActivityItem icon={<Award />} title="Earned certificate in 'Web3 Fundamentals'" time="Yesterday" status="Credential Verified" isSuccess />
                 <ActivityItem icon={<Key />} title="Changed account password" time="3 days ago" status="Security Event" />
                 <ActivityItem icon={<Zap />} title="Created account on SkillHub" time={new Date(user.createdAt).toLocaleDateString()} status="System Event" />
              </div>
           </div>

           {/* Section: Connected Systems */}
           <div className="p-8 rounded-[2.5rem] bg-surface border border-border space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30">Identity Integrations</h3>
              <div className="flex flex-wrap gap-4">
                 <SystemLink label="Google Auth" active />
                 <SystemLink label="Discord Sync" />
                 <SystemLink label="GitHub Connect" active />
                 <SystemLink label="Slack Integration" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const IdentityDetail = ({ icon, label, value }) => (
  <div className="flex items-center justify-between w-full">
     <div className="flex items-center gap-3 opacity-40">
        <div className="p-1.5 rounded-lg bg-surface2">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
     </div>
     <span className="text-[11px] font-black truncate max-w-[150px]">{value}</span>
  </div>
);

const SecurityAction = ({ icon, label, sub, onClick, color }) => (
  <motion.button
    whileHover={{ x: 5 }}
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 rounded-2xl bg-surface border border-border/50 text-left hover:border-brand/30 transition-all group"
  >
     <div className={`p-2.5 rounded-xl bg-surface2 transition-colors group-hover:bg-brand/10`} style={{ color: color || C.brand }}>
        {React.cloneElement(icon, { size: 18 })}
     </div>
     <div>
        <h5 className="text-xs font-black uppercase tracking-tight">{label}</h5>
        <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{sub}</p>
     </div>
  </motion.button>
);

const StatCard = ({ icon, value, label, delta, color }) => (
  <div className="p-6 rounded-[2.5rem] bg-surface border border-border shadow-xl space-y-3">
     <div className="p-3 rounded-2xl bg-surface2 inline-block" style={{ color }}>
        {React.cloneElement(icon, { size: 20 })}
     </div>
     <div>
        <h4 className="text-4xl font-black">{value}</h4>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">{label}</p>
        <p className="text-[9px] font-bold mt-2" style={{ color }}>{delta}</p>
     </div>
  </div>
);

const ActivityItem = ({ icon, title, time, status, isSuccess }) => (
  <div className="flex items-start gap-4">
     <div className={`p-2.5 rounded-xl border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-surface2 border-border/50 opacity-40'}`}>
        {React.cloneElement(icon, { size: 16 })}
     </div>
     <div className="flex-1">
        <div className="flex items-center justify-between">
           <h5 className="text-xs font-black uppercase tracking-tight">{title}</h5>
           <span className="text-[9px] font-bold opacity-30">{time}</span>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isSuccess ? 'text-emerald-500/60' : 'opacity-20'}`}>{status}</p>
     </div>
  </div>
);

const SystemLink = ({ label, active }) => (
  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${active ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-surface2 border-border/50 opacity-30 cursor-not-allowed grayscale'}`}>
     <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-indigo-400' : 'bg-border'}`} /> {label}
  </div>
);
