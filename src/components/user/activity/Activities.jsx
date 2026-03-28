import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../api/axiosConfig";
import {
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  Filter,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

// ==========================================
// DESIGN TOKENS (Matching Dashboard Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  success: "#22C55E",
  warning: "#EAB308",
  info: "#3B82F6",
  bg: "#0A0F0D",
  surface: "#111814",
  surface2: "#182219",
  surface3: "#1E2B22",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
};

// ==========================================
// ACTIVITY CONFIGURATION
// ==========================================
const ACTIVITY_TYPES = {
  ENROLLED: {
    icon: BookOpen,
    color: C.info,
    bg: "rgba(59,130,246,0.15)",
    label: "Enrolled",
  },
  COMPLETED: {
    icon: CheckCircle2,
    color: C.success,
    bg: "rgba(34,197,94,0.15)",
    label: "Completed",
  },
  CERTIFICATE: {
    icon: Award,
    color: C.accent,
    bg: "rgba(245,158,11,0.15)",
    label: "Certificate",
  },
  PROGRESS: {
    icon: TrendingUp,
    color: C.brand,
    bg: `${C.brand}15`,
    label: "Progress",
  },
  DEFAULT: {
    icon: Clock,
    color: C.textMuted,
    bg: C.surface2,
    label: "Activity",
  },
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(value) || 0;
    const duration = 1000;
    const steps = 20;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}</span>;
};

const GlowCard = ({ children, className = "", onClick }) => (
  <motion.div
    whileHover={{ scale: 1.01, x: 4 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`relative group cursor-pointer overflow-hidden rounded-xl ${className}`}
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
    }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        background: `linear-gradient(90deg, ${C.brand}05, transparent)`,
      }}
    />
    <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-transparent via-[${C.brand}] to-transparent" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const EmptyState = ({ onRefresh }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 px-4"
  >
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ background: `${C.brand}15`, border: `1px solid ${C.border}` }}
    >
      <Clock size={32} style={{ color: C.brand }} />
    </div>
    <h3
      className="text-lg font-bold mb-2"
      style={{ fontFamily: "'Fraunces', serif", color: C.text }}
    >
      No Activity Yet
    </h3>
    <p className="text-center max-w-sm mb-6 text-sm" style={{ color: C.textMuted }}>
      Your learning journey is just beginning. Enroll in courses and start tracking your progress!
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRefresh}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
      style={{
        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
        color: C.bg,
      }}
    >
      <Zap size={16} />
      Browse Courses
    </motion.button>
  </motion.div>
);

const ActivityIcon = ({ type }) => {
  const config = ACTIVITY_TYPES[type] || ACTIVITY_TYPES.DEFAULT;
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ background: config.bg, border: `1px solid ${config.color}30` }}
    >
      <Icon size={22} style={{ color: config.color }} />
    </motion.div>
  );
};

// ==========================================
// ACTIVITY ITEM COMPONENT
// ==========================================

const ActivityItem = ({ activity, index, onDelete }) => {
  const type = activity.action || "DEFAULT";
  const config = ACTIVITY_TYPES[type] || ACTIVITY_TYPES.DEFAULT;
  
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <GlowCard>
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <ActivityIcon type={type} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base leading-relaxed" style={{ color: C.text }}>
                {activity.message}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.color}30`,
                  }}
                >
                  <config.icon size={12} />
                  {config.label}
                </span>
                
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: C.textDim }}
                >
                  <Calendar size={12} />
                  {formatDate(activity.createdAt)}
                </span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(activity._id);
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              style={{ color: C.textDim }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </GlowCard>
  );
};

// ==========================================
// STATS COMPONENT
// ==========================================

const StatsBar = ({ activities }) => {
  const stats = [
    { 
      label: "Total Activities", 
      value: activities.length, 
      icon: Zap,
      color: C.brand 
    },
    { 
      label: "Completed", 
      value: activities.filter(a => a.action === "COMPLETED").length, 
      icon: CheckCircle2,
      color: C.success 
    },
    { 
      label: "Certificates", 
      value: activities.filter(a => a.action === "CERTIFICATE").length, 
      icon: Award,
      color: C.accent 
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-3 p-3 sm:p-4 rounded-xl"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div 
            className="p-2 rounded-lg flex-shrink-0"
            style={{ background: `${stat.color}15` }}
          >
            <stat.icon size={18} style={{ color: stat.color }} />
          </div>
          <div className="min-w-0">
            <p 
              className="text-lg sm:text-xl font-bold"
              style={{ fontFamily: "'Fraunces', serif", color: C.text }}
            >
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="text-xs truncate" style={{ color: C.textMuted }}>
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const userId = localStorage.getItem("userId");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/activities/${userId}`);
      const data = res.data?.data || res.data || [];
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching activities:", err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchActivities();
  }, [userId]);

  const handleDelete = async (activityId) => {
    // Optional: Implement delete functionality
    console.log("Delete activity:", activityId);
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === "ALL") return true;
    return activity.action === filter;
  });

  const filters = [
    { id: "ALL", label: "All", count: activities.length },
    { id: "ENROLLED", label: "Enrolled", count: activities.filter(a => a.action === "ENROLLED").length },
    { id: "COMPLETED", label: "Completed", count: activities.filter(a => a.action === "COMPLETED").length },
    { id: "CERTIFICATE", label: "Certificates", count: activities.filter(a => a.action === "CERTIFICATE").length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.bg }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={32} style={{ color: C.brand }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: C.bg, color: C.text }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-xl"
                style={{ background: `${C.brand}20`, border: `1px solid ${C.border}` }}
              >
                <Zap size={24} style={{ color: C.brand }} />
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                style={{ fontFamily: "'Fraunces', serif", color: C.text }}
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Your Activity
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base max-w-lg" style={{ color: C.textMuted }}>
              Track your learning journey, course completions, and achievements in one place.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchActivities}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium self-start sm:self-auto"
            style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              color: C.textMuted,
            }}
          >
            <Clock size={16} />
            Refresh
          </motion.button>
        </motion.div>

        {/* Stats */}
        <StatsBar activities={activities} />

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === f.id ? C.brand : C.surface,
                color: filter === f.id ? C.bg : C.textMuted,
                border: `1px solid ${filter === f.id ? C.brand : C.border}`,
              }}
            >
              {f.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  background: filter === f.id ? "rgba(0,0,0,0.2)" : C.surface2,
                  color: filter === f.id ? C.bg : C.textMuted,
                }}
              >
                <AnimatedCounter value={f.count} />
              </span>
            </button>
          ))}
        </motion.div>

        {/* Activity List */}
        <AnimatePresence mode="wait">
          {filteredActivities.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredActivities.map((activity, idx) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ActivityItem 
                    activity={activity} 
                    index={idx} 
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState onRefresh={() => window.location.href = "/user/mycourses"} />
          )}
        </AnimatePresence>

        {/* Load More / End */}
        {filteredActivities.length > 0 && filteredActivities.length < activities.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-sm" style={{ color: C.textDim }}>
              Showing {filteredActivities.length} of {activities.length} activities
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Activities;