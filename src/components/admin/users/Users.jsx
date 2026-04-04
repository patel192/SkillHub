import React, { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Shield, Power, Trash2, Mail, Calendar, User as UserIcon, ShieldCheck, ShieldAlert } from "lucide-center";
import { useAuth } from "../../../context/AuthContext";

const C = {
  brand: "var(--brand)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#22C55E",
};

export const Users = () => {
  const { token, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchUsers();
  }, [token, authLoading]);

  const toggleActive = async (id, currentStatus) => {
    try {
      await apiClient.patch(`/user/${id}`, { isActive: !currentStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await apiClient.patch(`/user/${id}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             User <span style={{ color: C.brand }}>Management</span>
           </h2>
           <p className="text-sm opacity-50 mt-1">Manage global user accounts, permissions, and security states.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border transition-all text-sm outline-none focus:ring-2"
            style={{ 
              background: 'var(--surface)', 
              borderColor: 'var(--border)',
              '--tw-ring-color': 'rgba(var(--brand-rgb), 0.2)'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: C.brand }} />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 opacity-40">
           <UserIcon size={48} className="mx-auto mb-4" />
           <p>No users found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredUsers.map((user, idx) => (
              <UserCard 
                key={user._id} 
                user={user} 
                idx={idx} 
                onToggleActive={toggleActive} 
                onToggleRole={toggleRole} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const UserCard = ({ user, idx, onToggleActive, onToggleRole }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.05 }}
    className="group relative p-6 rounded-3xl border shadow-xl flex flex-col gap-5 overflow-hidden"
    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
  >
    {/* Gradient Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity rounded-full pointer-events-none"
         style={{ background: C.brand }} />

    {/* Identity Section */}
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <div className="relative">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=random`} 
            className="w-14 h-14 rounded-2xl object-cover border-2 shadow-lg"
            style={{ borderColor: 'var(--surface2)' }}
            alt="" 
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface shadow-sm ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">{user.fullname}</h3>
          <p className="text-xs opacity-40 flex items-center gap-1 mt-1">
            <Mail size={12} /> {user.email}
          </p>
        </div>
      </div>
      
      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-amber-400 bg-amber-400/10' : 'text-indigo-400 bg-indigo-400/10'}`}>
        {user.role}
      </div>
    </div>

    {/* Metatdata */}
    <div className="grid grid-cols-2 gap-4">
       <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
          <p className="text-[9px] uppercase tracking-wider opacity-40 font-bold mb-1">Joined Date</p>
          <div className="flex items-center gap-2 text-xs font-medium">
             <Calendar size={14} className="opacity-40" />
             {new Date(user.createdAt).toLocaleDateString()}
          </div>
       </div>
       <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
          <p className="text-[9px] uppercase tracking-wider opacity-40 font-bold mb-1">Account State</p>
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: user.isActive ? '#22C55E' : C.error }}>
             {user.isActive ? 'Active' : 'Restricted'}
          </div>
       </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3 mt-auto">
      <button
        onClick={() => onToggleActive(user._id, user.isActive)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border"
        style={{ 
          background: user.isActive ? 'transparent' : 'var(--surface2)',
          borderColor: user.isActive ? C.error : 'var(--border)',
          color: user.isActive ? C.error : 'var(--text)'
        }}
      >
        <Power size={14} />
        {user.isActive ? 'Suspend' : 'Restore'}
      </button>

      <button
        onClick={() => onToggleRole(user._id, user.role)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
        style={{ background: user.role === 'admin' ? 'var(--surface2)' : C.brand, color: user.role === 'admin' ? 'var(--text)' : 'white' }}
      >
        {user.role === 'admin' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
        {user.role === 'admin' ? 'Demote' : 'Promote'}
      </button>
    </div>
  </motion.div>
);

export default Users;
