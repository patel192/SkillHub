import React, { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Shield, Power, Mail, Calendar, 
  User as UserIcon, ShieldCheck, ShieldAlert, 
  Filter, ChevronRight, Activity, Zap, 
  MoreVertical, CheckCircle, XCircle 
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const C = {
  brand: "var(--brand)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#10B981",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  border: "var(--border)"
};

export const Users = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, admin, user, restricted

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Global user sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchUsers();
  }, [token, authLoading]);

  const toggleActive = async (e, id, currentStatus) => {
    e.stopPropagation();
    const toastId = toast.loading(`${currentStatus ? 'Deactivating' : 'Restoring'} access...`);
    try {
      await apiClient.patch(`/user/${id}`, { isActive: !currentStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
      toast.success(`User ${currentStatus ? 'suspended' : 'restored'}`, { id: toastId });
    } catch (error) {
       toast.error("Status update error", { id: toastId });
    }
  };

  const toggleRole = async (e, id, currentRole) => {
    e.stopPropagation();
    const newRole = currentRole === "admin" ? "user" : "admin";
    const toastId = toast.loading(`Reassigning role to ${newRole}...`);
    try {
      await apiClient.patch(`/user/${id}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`, { id: toastId });
    } catch (error) {
       toast.error("Role assignment error", { id: toastId });
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = user.fullname?.toLowerCase().includes(searchLower) || user.email?.toLowerCase().includes(searchLower);
    
    if (filter === "admin") return matchesSearch && user.role === "admin";
    if (filter === "user") return matchesSearch && user.role === "user";
    if (filter === "restricted") return matchesSearch && !user.isActive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats Overview */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-border/50">
        <div>
           <button 
             onClick={() => navigate("/admin")}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-2"
           >
             Admin Dashboard
           </button>
           <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             User <span className="text-brand">Registry</span>
           </h2>
           <p className="text-[11px] font-bold opacity-30 mt-1 uppercase tracking-wider">Access Control • Permission Matrix • Account States</p>
        </div>

        <div className="flex flex-wrap gap-2">
           <FilterBadge label="All Accounts" count={users.length} active={filter === "all"} onClick={() => setFilter("all")} />
           <FilterBadge label="Admins" count={users.filter(u => u.role === 'admin').length} active={filter === "admin"} onClick={() => setFilter("admin")} />
           <FilterBadge label="Users" count={users.filter(u => u.role === 'user').length} active={filter === "user"} onClick={() => setFilter("user")} />
           <FilterBadge label="Restricted" count={users.filter(u => !u.isActive).length} active={filter === "restricted"} onClick={() => setFilter("restricted")} />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center gap-4 bg-surface/50 p-2 rounded-2xl border border-border/50 shadow-inner">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
          <input
            type="text"
            placeholder="Search by ID, Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-none transition-all text-xs font-bold outline-none ring-0 placeholder:opacity-30"
            style={{ background: 'transparent' }}
          />
        </div>
        <div className="h-4 w-[1px] bg-border/40" />
        <button onClick={fetchUsers} className="p-3 hover:bg-surface2 rounded-xl transition-all opacity-40 hover:opacity-100">
           <Zap size={18} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Retrieving security records...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-32 opacity-20">
           <UserIcon size={64} className="mx-auto mb-4" />
           <h3 className="text-lg font-black uppercase tracking-widest">No Matches Found</h3>
           <p className="text-[10px] font-bold">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredUsers.map((user, idx) => (
              <UserCard 
                key={user._id} 
                user={user} 
                idx={idx} 
                onToggleActive={toggleActive} 
                onToggleRole={toggleRole} 
                onClick={() => navigate(`/admin/users/${user._id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const FilterBadge = ({ label, count, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${active ? 'bg-brand/10 border-brand/40 text-brand' : 'bg-surface border-border/50 opacity-40 hover:opacity-100'}`}
  >
     {label} <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${active ? 'bg-brand/20' : 'bg-surface2'}`}>{count}</span>
  </button>
);

const UserCard = ({ user, idx, onToggleActive, onToggleRole, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: idx * 0.03 }}
    onClick={onClick}
    className="group relative p-5 rounded-3xl border bg-surface hover:bg-surface2 transition-all cursor-pointer shadow-xl hover:shadow-2xl overflow-hidden border-border/50 hover:border-brand/30"
  >
    {/* Identity */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=random`} 
            className="w-12 h-12 rounded-2xl object-cover border border-border shadow-sm group-hover:scale-105 transition-transform"
            alt="" 
          />
          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-surface ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
        </div>
        <div>
          <h3 className="font-black text-sm tracking-tight truncate max-w-[120px]">{user.fullname}</h3>
          <p className="text-[10px] font-bold opacity-30 truncate max-w-[120px]">{user.email}</p>
        </div>
      </div>
      
      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] ${user.role === 'admin' ? 'text-amber-400 bg-amber-400/10' : 'text-indigo-400 bg-indigo-400/10'}`}>
        {user.role}
      </div>
    </div>

    {/* Metadata Mesh */}
    <div className="grid grid-cols-2 gap-2 mt-5">
       <div className="flex flex-col gap-1 p-2.5 rounded-2xl bg-surface2/50 border border-border/20">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Status</span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
             {user.isActive ? <CheckCircle size={10} className="text-emerald-500" /> : <XCircle size={10} className="text-red-500" />}
             {user.isActive ? 'Active' : 'Restricted'}
          </div>
       </div>
       <div className="flex flex-col gap-1 p-2.5 rounded-2xl bg-surface2/50 border border-border/20">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Pulse</span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
             <Activity size={10} className="text-indigo-500" />
             {Math.floor(Math.random() * 100)}% Health
          </div>
       </div>
    </div>

    {/* Actions Pop-in */}
    <div className="flex gap-2 mt-5 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
      <button
        onClick={(e) => onToggleActive(e, user._id, user.isActive)}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${user.isActive ? 'border-red-500/20 text-red-400 bg-red-400/5 hover:bg-red-400/10' : 'border-emerald-500/20 text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10'}`}
      >
        <Power size={11} /> {user.isActive ? 'Suspend' : 'Recall'}
      </button>

      <button
        onClick={(e) => onToggleRole(e, user._id, user.role)}
        className="px-3 py-2 rounded-xl bg-surface2 border border-border/50 text-brand hover:bg-brand hover:text-white transition-all flex items-center justify-center"
      >
        {user.role === 'admin' ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
      </button>

      <button className="px-3 py-2 rounded-xl bg-surface2 border border-border/50 opacity-40 hover:opacity-100 transition-all">
         <ChevronRight size={11} />
      </button>
    </div>
  </motion.div>
);

export default Users;

