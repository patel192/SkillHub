import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../api/axiosConfig";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Bell,
  Mail,
  MailOpen,
  Trash2,
  Check,
  Loader2,
  Filter,
  MoreHorizontal,
  Zap,
  Clock,
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
};

// ==========================================
// NOTIFICATION CONFIGURATION
// ==========================================
const NOTIFICATION_TYPES = {
  COURSE_ENROLLMENT: {
    icon: BookOpen,
    color: C.info,
    bg: "rgba(59,130,246,0.15)",
    label: "Course",
  },
  CERTIFICATE_AWARDED: {
    icon: Award,
    color: C.accent,
    bg: "rgba(245,158,11,0.15)",
    label: "Certificate",
  },
  LESSON_COMPLETED: {
    icon: CheckCircle2,
    color: C.success,
    bg: "rgba(34,197,94,0.15)",
    label: "Progress",
  },
  DEFAULT: {
    icon: Bell,
    color: "var(--text-muted)",
    bg: "var(--surface2)",
    label: "Notification",
  },
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(value) || 0;
    const duration = 800;
    const steps = 15;
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

const GlowCard = ({ children, className = "", unread = false, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.01, x: unread ? 2 : 0 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`relative group cursor-pointer overflow-hidden rounded-xl ${className}`}
    style={{
      background: "var(--surface)",
      border: `1px solid ${unread ? C.brand : "var(--border)"}`,
      borderLeft: unread ? `3px solid ${C.brand}` : undefined,
    }}
  >
    {/* Unread Glow */}
    {unread && (
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 0% 50%, ${C.brand}10, transparent 60%)`,
        }}
      />
    )}
    
    {/* Hover Line */}
    <div
      className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{
        background: `linear-gradient(to bottom, transparent, ${C.brand}, transparent)`,
      }}
    />
    
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
      style={{ background: `${C.brand}15`, border: `1px solid ${"var(--border)"}` }}
    >
      <MailOpen size={32} style={{ color: C.brand }} />
    </div>
    <h3
      className="text-lg font-bold mb-2"
      style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
    >
      All Caught Up!
    </h3>
    <p className="text-center max-w-sm mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
      You have no new notifications. Check back later for updates on your courses and achievements.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRefresh}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
      style={{
        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
        color: "var(--bg)",
      }}
    >
      <Zap size={16} />
      Browse Courses
    </motion.button>
  </motion.div>
);

const NotificationIcon = ({ type, unread }) => {
  const config = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.DEFAULT;
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
      style={{ 
        background: unread ? config.bg : "var(--surface2)", 
        border: `1px solid ${unread ? config.color : "var(--border)"}` 
      }}
    >
      <Icon size={22} style={{ color: unread ? config.color : "var(--text-muted)" }} />
      
      {/* Unread Dot */}
      {unread && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ background: C.brand, border: `2px solid ${"var(--surface)"}` }}
        />
      )}
    </motion.div>
  );
};

// ==========================================
// NOTIFICATION ITEM COMPONENT
// ==========================================

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const type = notification.type || "DEFAULT";
  const config = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.DEFAULT;
  const unread = !notification.read;
  
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
    <GlowCard unread={unread}>
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <NotificationIcon type={type} unread={unread} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p 
                className={`font-medium text-sm sm:text-base leading-relaxed ${unread ? "" : "line-clamp-2"}`}
                style={{ color: unread ? "var(--text)" : "var(--text-muted)" }}
              >
                {notification.message}
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
                  style={{ color: "var(--text-muted)" }}
                >
                  <Clock size={12} />
                  {formatDate(notification.createdAt)}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {unread && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(notification._id);
                  }}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: C.brand }}
                  title="Mark as read"
                >
                  <Check size={18} />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification._id);
                }}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-muted)" }}
                title="Delete"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  );
};

// ==========================================
// STATS COMPONENT
// ==========================================

const StatsBar = ({ notifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const stats = [
    { 
      label: "Total", 
      value: notifications.length, 
      icon: Mail,
      color: C.brand 
    },
    { 
      label: "Unread", 
      value: unreadCount, 
      icon: Bell,
      color: C.accent 
    },
    { 
      label: "Read", 
      value: notifications.length - unreadCount, 
      icon: MailOpen,
      color: C.success 
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
          style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
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
              style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
            >
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
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

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD, READ
  
  const {userId} = useSelector((state) => state.auth);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/notifications/${userId}`);
      const data = res.data?.data || res.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const handleMarkRead = async (id) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    );
    
    // API call (implement endpoint)
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await apiClient.patch(`/notifications/mark-all-read`, { userId });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDelete = async (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    if (filter === "READ") return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
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
                className="p-2 rounded-xl relative"
                style={{ background: `${C.brand}20`, border: `1px solid ${"var(--border)"}` }}
              >
                <Bell size={24} style={{ color: C.brand }} />
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: C.accent, color: "var(--bg)", border: `2px solid ${"var(--surface)"}` }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
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
                  Notifications
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base max-w-lg" style={{ color: "var(--text-muted)" }}>
              Stay updated with your course progress, achievements, and important announcements.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: "var(--surface2)",
                  border: `1px solid ${"var(--border)"}`,
                  color: "var(--text-muted)",
                }}
              >
                <Check size={16} />
                Mark all read
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchNotifications}
              className="p-2.5 rounded-xl"
              style={{
                background: "var(--surface2)",
                border: `1px solid ${"var(--border)"}`,
                color: "var(--text-muted)",
              }}
            >
              <Loader2 size={16} className={loading ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsBar notifications={notifications} />

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          {[
            { id: "ALL", label: "All", count: notifications.length },
            { id: "UNREAD", label: "Unread", count: unreadCount },
            { id: "READ", label: "Read", count: notifications.length - unreadCount },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === f.id ? C.brand : "var(--surface)",
                color: filter === f.id ? "var(--bg)" : "var(--text-muted)",
                border: `1px solid ${filter === f.id ? C.brand : "var(--border)"}`,
              }}
            >
              {f.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  background: filter === f.id ? "rgba(0,0,0,0.2)" : "var(--surface2)",
                  color: filter === f.id ? "var(--bg)" : "var(--text-muted)",
                }}
              >
                <AnimatedCounter value={f.count} />
              </span>
            </button>
          ))}
        </motion.div>

        {/* Notification List */}
        <AnimatePresence mode="wait">
          {filteredNotifications.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredNotifications.map((notification, idx) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NotificationItem 
                    notification={notification}
                    onMarkRead={handleMarkRead}
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
        {filteredNotifications.length > 0 && filteredNotifications.length < notifications.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;