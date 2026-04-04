import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Book, Users, CheckCircle, Clock, Award, FileText,
  Layers, Activity, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Globe
} from "lucide-react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { useAuth } from "../../context/AuthContext";

const C = {
  brand: "var(--brand)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#22C55E",
};

export const AdminDashboard = () => {
  const { token, user } = useAuth();

  const [stats, setStats] = useState({});
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState([]);
  const [reports, setReports] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    fetchOverview();
  }, [token]);

  const fetchOverview = async () => {
    try {
      const res = await axios.get("/admin/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data.stats || {});
      setLatestUsers(res.data.latestUsers || []);
      setLatestCourses(res.data.latestCourses || []);
      setEnrollmentTrends(res.data.enrollmentTrends || []);
      setReports(res.data.latestReports || []);
      setTopCourses(res.data.topCourses || []);
    } catch (err) {
      console.error("Overview fetch failed:", err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* ====================== WELCOME HEADER ====================== */}
      <div className="relative p-8 rounded-3xl overflow-hidden border shadow-2xl"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-20 -mr-20 -mt-20 rounded-full"
             style={{ background: 'var(--brand)' }} />
             
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Welcome Back, <span style={{ color: C.brand }}>{user?.fullname?.split(' ')[0] || 'Admin'}</span>
          </h2>
          <p className="text-sm opacity-50 flex items-center gap-2">
            <Globe size={14} /> System status: Optimal • Last backup: 2h ago
          </p>
        </div>
      </div>

      {/* ====================== STAT CARDS ====================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={<Users size={20} />} trend="+12%" color={C.brand} />
        <StatCard label="Total Courses" value={stats.totalCourses} icon={<Book size={20} />} trend="+5%" color={C.accent} />
        <StatCard label="Pending Reports" value={reports.length} icon={<Activity size={20} />} trend="-2%" color={C.error} isNegative />
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue || 0}`} icon={<DollarSign size={20} />} trend="+18%" color={C.success} />
      </div>

      {/* ====================== CHARTS & ANALYTICS ====================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard title="Enrollment Trends" icon={<TrendingUp size={18} />}>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrends}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.brand} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.brand} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: C.brand }}
                  />
                  <Area type="monotone" dataKey="count" stroke={C.brand} fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Top Courses" icon={<Award size={18} />}>
            <div className="space-y-4 mt-2">
              {topCourses.slice(0, 5).map((course, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `rgba(var(--brand-rgb), 0.1)`, color: C.brand }}>{i+1}</div>
                    <span className="text-sm font-medium line-clamp-1">{course.title}</span>
                  </div>
                  <span className="text-xs font-bold opacity-40">{course.count} enrolls</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ====================== LATEST ACTIVITY TABLES ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Recently Joined Users" icon={<Users size={18} />}>
          <div className="mt-2 space-y-3">
             {latestUsers.map((u, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.fullname}&background=random`} className="w-9 h-9 rounded-full object-cover" alt="" />
                    <div>
                      <p className="text-sm font-bold">{u.fullname}</p>
                      <p className="text-[10px] opacity-40">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] opacity-40 tracking-wider">NEW MEMBER</span>
               </div>
             ))}
          </div>
        </SectionCard>

        <SectionCard title="New Courses" icon={<Book size={18} />}>
           <div className="mt-2 space-y-3">
             {latestCourses.map((c, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface3)' }}>
                      <Book size={16} style={{ color: C.brand }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1">{c.title}</p>
                      <p className="text-[10px] opacity-40">{c.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: C.brand }}>₹{c.price}</p>
                    <p className="text-[9px] opacity-40 uppercase tracking-tighter">{c.level}</p>
                  </div>
               </div>
             ))}
           </div>
        </SectionCard>
      </div>
    </div>
  );
};

// ==========================================
// NEO-DESIGN SUB-COMPONENTS
// ==========================================

const StatCard = ({ label, value, icon, trend, color, isNegative }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-5 rounded-2xl border shadow-lg flex flex-col gap-3"
    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
  >
    <div className="flex items-center justify-between">
      <div className="p-2.5 rounded-xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${isNegative ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
        {isNegative ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-widest opacity-40 font-bold">{label}</p>
      <p className="text-2xl font-black mt-1">{value || 0}</p>
    </div>
  </motion.div>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="p-6 rounded-3xl border shadow-xl flex flex-col"
       style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg opacity-40" style={{ background: 'var(--surface2)' }}>
        {icon}
      </div>
      <h3 className="text-sm font-bold tracking-tight opacity-60 uppercase">{title}</h3>
    </div>
    {children}
  </div>
);
