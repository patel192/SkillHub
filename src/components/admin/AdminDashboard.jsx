import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book, Users, CheckCircle, Clock, Award, FileText,
  Layers, Activity, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Globe,
  Plus, Zap, Bell, Shield, Database, Cpu, HardDrive, RefreshCcw, 
  ChevronRight, Filter, Download, MoreVertical, Search, Heart, MessageSquare
} from "lucide-react";
import apiClient from "../../api/axiosConfig";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

import { useNavigate } from "react-router-dom";

// ==========================================
// DESIGN TOKENS
// ==========================================
const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#10B981",
  warning: "#F59E0B",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  surface3: "var(--surface3)",
  border: "var(--border)",
  textMuted: "var(--text-muted)"
};

const COLORS = [C.brand, C.accent, "#6366F1", "#EC4899", "#8B5CF6"];

export const AdminDashboard = () => {
  const { token, user, loading: authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState([]);
  const [reports, setReports] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mocked for density if missing from API
  const [systemHealth] = useState({
    api: "Healthy",
    db: "Optimal",
    storage: "45% Used",
    uptime: "99.99%"
  });

  const [activityFeed] = useState([
    { id: 1, type: "user", user: "John Doe", event: "Enrolled in React 101", time: "2 min ago" },
    { id: 2, type: "course", user: "Admin", event: "Published 'Advanced Node.js'", time: "15 min ago" },
    { id: 3, type: "report", user: "Jane Smith", event: "Reported a bug in Quiz module", time: "1h ago" },
    { id: 4, type: "user", user: "Sarah Connor", event: "Completed 'Python for AI'", time: "3h ago" },
  ]);

  useEffect(() => {
    if (!token || authLoading) return;
    fetchOverview();
  }, [token, authLoading]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/admin/overview");
      setStats(res.data.stats || {});
      setLatestUsers(res.data.latestUsers || []);
      setLatestCourses(res.data.latestCourses || []);
      setEnrollmentTrends(res.data.enrollmentTrends || []);
      setReports(res.data.latestReports || []);
      setTopCourses(res.data.topCourses || []);
    } catch (err) {
      console.error("Overview fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats.totalUsers) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ====================== COMMAND CENTER HEADER ====================== */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Admin <span style={{ color: C.brand }}>Insight</span>
          </h1>
          <p className="text-sm opacity-40 font-bold mt-1 uppercase tracking-widest">Platform Command & Control Dashboard</p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          <ActionPulse icon={<harddrive size={14} />} label={systemHealth.storage} color={C.warning} />
          <ActionPulse icon={<Activity size={14} />} label={systemHealth.uptime} color={C.success} />
          <div className="h-6 w-[1px] bg-border mx-2" />
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border hover:bg-surface2 transition-all bg-surface" style={{ borderColor: C.border }}>
             <Filter size={14} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border hover:bg-surface2 transition-all bg-surface" style={{ borderColor: C.border }}>
             <Download size={14} /> Report
          </button>
        </div>
      </div>

      {/* ====================== QUICK ACTIONS BAR ====================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction color={C.brand} icon={<Plus />} label="Course" onClick={() => navigate("/admin/courses/new")} />
        <QuickAction color={C.accent} icon={<Users />} label="Users" onClick={() => navigate("/admin/users")} />
        <QuickAction color={C.error} icon={<Bell />} label="BroadCast" />
        <QuickAction color={C.success} icon={<Shield />} label="Security" onClick={() => navigate("/admin/settings")} />
      </div>

      {/* ====================== MAIN DATA GRID (BENTO) ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 units) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main 4 Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
             <StatCard label="Total Users" value={stats.totalUsers} trend="+12" icon={<Users size={18} />} color={C.brand} />
             <StatCard label="Revenue" value={`₹${stats.totalRevenue || 0}`} trend="+24" icon={<DollarSign size={18} />} color={C.success} />
             <StatCard label="Active Courses" value={stats.totalCourses} trend="+5" icon={<Book size={18} />} color={C.accent} />
             <StatCard label="Pending Tasks" value={reports.length} trend="-2" icon={<Zap size={18} />} color={C.error} isNegative />
          </div>

          {/* Area Chart: Enrollments */}
          <SectionCard title="Platform Growth" subtitle="Trends in student enrollment over time" icon={<TrendingUp size={16} />}>
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.brand} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={C.brand} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                    itemStyle={{ color: C.brand, fontWeight: 'bold' }}
                    labelStyle={{ color: 'var(--text-muted)', fontSize: '10px' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <Area type="monotone" dataKey="count" stroke={C.brand} fillOpacity={1} fill="url(#colorEnroll)" strokeWidth={4} 
                        animationDuration={2000} dot={{ r: 4, fill: C.brand, strokeWidth: 2, stroke: 'var(--surface)' }}
                        activeDot={{ r: 7, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Latest Users Table (Compact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Recent Onboarding" icon={<Users size={16} />}>
               <div className="mt-2 space-y-1">
                  {latestUsers.slice(0, 5).map((u, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-surface2 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.fullname}&background=random`} className="w-10 h-10 rounded-full border shadow-sm" alt="" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface bg-emerald-500" />
                          </div>
                          <div>
                             <p className="text-sm font-bold tracking-tight">{u.fullname}</p>
                             <p className="text-[10px] opacity-40 truncate max-w-[120px]">{u.email}</p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  ))}
               </div>
               <button onClick={() => navigate("/admin/users")} className="w-full mt-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all" style={{ border: '1px dashed var(--border)' }}>View All Users</button>
            </SectionCard>

            <SectionCard title="New Courses" icon={<Book size={16} />}>
               <div className="mt-2 space-y-1">
                  {latestCourses.slice(0, 5).map((c, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-surface2 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2" style={{ background: 'var(--surface3)' }}>
                             <Book size={18} style={{ color: C.brand }} />
                          </div>
                          <div>
                             <p className="text-sm font-bold tracking-tight line-clamp-1">{c.title}</p>
                             <p className="text-[10px] opacity-40 uppercase font-black">{c.category}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black" style={{ color: C.brand }}>₹{c.price}</p>
                          <p className="text-[9px] opacity-30 font-bold">{c.level}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button onClick={() => navigate("/admin/courses")} className="w-full mt-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all" style={{ border: '1px dashed var(--border)' }}>Course Inventory</button>
            </SectionCard>
          </div>
        </div>

        {/* Right Column (4 units) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* System Status (Dense) */}
           <SectionCard title="System Performance" icon={<Zap size={16} />}>
              <div className="grid grid-cols-2 gap-3 mt-2">
                 <HealthMeter icon={<Database />} label="Database" value={systemHealth.db} color={C.success} />
                 <HealthMeter icon={<Cpu />} label="API Status" value={systemHealth.api} color={C.success} />
                 <HealthMeter icon={<Globe />} label="Uptime" value={systemHealth.uptime} color={C.brand} />
                 <HealthMeter icon={<Shield />} label="Firewall" value="Active" color={C.accent} />
              </div>
           </SectionCard>

           {/* Pie Chart: Popularity Distribution */}
           <SectionCard title="Top Enrolled Courses" icon={<Award size={16} />}>
              <div className="h-[240px] mt-2 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={topCourses.slice(0, 5).map((c, i) => ({ name: c.title, value: c.count }))}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                       >
                          {topCourses.slice(0, 5).map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip 
                         contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                         itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                       />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-black" style={{ color: C.brand }}>{topCourses.length}</p>
                    <p className="text-[9px] font-black opacity-30 uppercase">Leaders</p>
                 </div>
              </div>
              <div className="mt-4 space-y-2">
                 {topCourses.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold">
                       <span className="flex items-center gap-2 opacity-50"><div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} /> {c.title}</span>
                       <span>{c.count}</span>
                    </div>
                 ))}
              </div>
           </SectionCard>

           {/* Live Feed */}
           <SectionCard title="Activity Stream" icon={<RefreshCcw size={16} />}>
              <div className="mt-4 relative space-y-4">
                 <div className="absolute left-4 top-2 bottom-0 w-[1px]" style={{ background: 'var(--border)' }} />
                 {activityFeed.map((item, i) => (
                    <div key={i} className="relative pl-10">
                       <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-surface bg-brand"
                            style={{ background: item.type === 'user' ? C.brand : item.type === 'report' ? C.error : C.accent }} />
                       <div className="p-3 rounded-2xl bg-surface2 border border-border/50">
                          <p className="text-xs font-bold">
                             <span style={{ color: C.brand }}>{item.user}</span> {item.event}
                          </p>
                          <p className="text-[10px] opacity-30 mt-1 flex items-center gap-1"><Clock size={10} /> {item.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </SectionCard>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const StatCard = ({ label, value, trend, icon, color, isNegative }) => (
  <motion.div 
    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
    className="relative p-5 rounded-3xl border shadow-xl flex flex-col overflow-hidden transition-all bg-surface"
    style={{ borderColor: 'var(--border)' }}
  >
    <div className="absolute top-0 right-0 p-3 opacity-[0.03]" style={{ color }}>
       {React.cloneElement(icon, { size: 60 })}
    </div>
    
    <div className="flex items-center justify-between mb-3">
      <div className="p-2.5 rounded-2xl bg-surface2 border border-border/50" style={{ color }}>{icon}</div>
      <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${isNegative ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
        {isNegative ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
        {trend}%
      </div>
    </div>
    
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</p>
      <p className="text-2xl font-black mt-1 tabular-nums">{value || 0}</p>
    </div>
  </motion.div>
);

const SectionCard = ({ title, subtitle, icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 rounded-[2.5rem] border shadow-2xl bg-surface flex flex-col"
    style={{ borderColor: 'var(--border)' }}
  >
    <div className="flex items-center justify-between mb-4">
       <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-surface2 text-brand/60">{icon}</div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight">{title}</h3>
            {subtitle && <p className="text-[10px] opacity-40 font-bold">{subtitle}</p>}
          </div>
       </div>
       <button className="p-1.5 opacity-20 hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
    </div>
    {children}
  </motion.div>
);

const QuickAction = ({ icon, label, color, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.05, background: color, color: 'var(--bg)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center gap-3 p-4 rounded-3xl border shadow-lg bg-surface text-sm font-bold transition-all"
    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
  >
    <div className="p-2 rounded-xl" style={{ background: `${color}20` }}>{icon}</div>
    {label}
  </motion.button>
);

const HealthMeter = ({ icon, label, value, color }) => (
  <div className="p-3 rounded-2xl bg-surface2 border border-border/50 flex flex-col gap-1">
     <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-30">
        <div style={{ color }}>{React.cloneElement(icon, { size: 10 })}</div>
        {label}
     </div>
     <p className="text-xs font-black truncate">{value}</p>
  </div>
);

const ActionPulse = ({ icon, label, color }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-surface text-[10px] font-bold" style={{ borderColor: 'var(--border)' }}>
     <div className="relative">
        <div className="absolute inset-0 blur-sm rounded-full animate-ping" style={{ background: color }} />
        <div className="relative w-2 h-2 rounded-full" style={{ background: color }} />
     </div>
     <div className="opacity-40">{icon}</div>
     {label}
  </div>
);

