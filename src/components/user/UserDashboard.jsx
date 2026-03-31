import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Award,
  Target,
  ArrowRight,
  Flame,
  Play,
  TrendingUp,
  Zap,
  ChevronRight,
  Trophy,
  Star,
  Activity,
  Bell,
  BarChart3,
  GraduationCap,
  Code,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
// ==========================================
// DESIGN TOKENS (Matching Your Theme)
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
  error: "#F87171",
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const num = parseInt(value) || 0;
    const duration = 1500;
    const steps = 30;
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

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const ProgressBar = ({ progress, color = C.brand }) => (
  <div
    className="h-2 w-full rounded-full overflow-hidden"
    style={{ background: C.surface3 }}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full rounded-full"
      style={{
        background: `linear-gradient(90deg, ${C.brand}, ${C.brandLight})`,
      }}
    />
  </div>
);

const GlowCard = ({ children, className = "", onClick, gradient = true }) => (
  <motion.div
    whileHover={{ scale: 1.01, y: -2 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`relative group cursor-pointer overflow-hidden rounded-2xl ${className}`}
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
    }}
  >
    {/* Hover Glow Effect */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: gradient
          ? `radial-gradient(circle at top left, ${C.brand}15, transparent 60%)`
          : "none",
      }}
    />

    <div className="relative z-10">{children}</div>
  </motion.div>
);

const StatCard = ({ icon: Icon, label, value, subtext, trend, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative group"
  >
    <div
      className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm"
      style={{
        background: `linear-gradient(135deg, ${C.brand}20, transparent)`,
      }}
    />
    <div
      className="relative p-6 rounded-2xl transition-all duration-300 hover:border-opacity-35"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${C.brand}20, ${C.brand}10)`,
            border: `1px solid ${C.border}`,
          }}
        >
          <Icon size={20} style={{ color: C.brand }} />
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: trend > 0 ? `${C.brand}20` : "rgba(248,113,113,0.2)",
              color: trend > 0 ? C.brand : C.error,
              border: `1px solid ${trend > 0 ? C.border : "rgba(248,113,113,0.3)"}`,
            }}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3
          className="text-2xl font-bold"
          style={{
            color: C.text,
            fontFamily: "'Fraunces', serif",
          }}
        >
          <AnimatedCounter value={value} />
        </h3>
        <p className="text-sm mt-1" style={{ color: C.textMuted }}>
          {label}
        </p>
        {subtext && (
          <p className="text-xs mt-1" style={{ color: C.textDim }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id;
  const [userName, setUserName] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, coursesRes, certRes, actRes, notifRes, recRes] =
          await Promise.all([
            apiClient.get(`/user/${userId}`),
            apiClient.get(`/enrollment/${userId}`),
            apiClient.get(`/certificates/${userId}`),
            apiClient.get(`/activities/${userId}`),
            apiClient.get(`/notifications/${userId}`),
            apiClient.get("/courses"),
          ]);

        setUserName(userRes.data.data.fullname);
        setNotifications(notifRes.data.data || []);

        // Calculate learning time from localStorage
        let totalSec = 0;
        let courseTimes = [];

        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith(`learningTime_${userId}_`)) {
            const sec = parseInt(localStorage.getItem(k)) || 0;
            totalSec += sec;
            const id = k.split("_")[2];
            courseTimes.push({ courseId: id, seconds: sec });
          }
        });

        const totalMinutes = Math.floor(totalSec / 60);

        // Get top course
        let topCourse = null;
        if (courseTimes.length > 0) {
          courseTimes.sort((a, b) => b.seconds - a.seconds);
          const topCourseId = courseTimes[0].courseId;
          try {
            const c = await apiClient.get(`/course/${topCourseId}`);
            topCourse = {
              id: topCourseId,
              name: c.data.data.title,
              image: c.data.data.imageUrl,
              progress: Math.min(
                100,
                Math.floor((courseTimes[0].seconds / 3600) * 100),
              ),
            };
          } catch (err) {}
        }

        setDashboard({
          coursesCount: coursesRes.data.data.length,
          certificatesCount: certRes.data.data.length,
          challenges: 12,
          totalMinutes,
          recentActivity: actRes.data.data.slice(0, 5),
          recommended: recRes.data.data.slice(0, 3),
          topCourse,
          weeklyGoal: 75,
        });
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { hours, mins, total: minutes };
  };

  const timeData = useMemo(() => {
    if (!dashboard) return { hours: 0, mins: 0, total: 0 };
    return formatTime(dashboard.totalMinutes);
  }, [dashboard]);

  if (loading || !dashboard) {
    return (
      <div
        className="flex items-center justify-center h-[calc(100vh-4rem)]"
        style={{ background: C.bg }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 rounded-full"
          style={{ borderColor: C.brand, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8" style={{ color: C.text }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Fraunces', serif", color: C.text }}
          >
            {greeting},{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {userName.split(" ")[0]}
            </span>
          </h1>
          <p style={{ color: C.textMuted }}>
            Here's your learning progress today
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/mycourses")}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              color: C.textMuted,
            }}
          >
            <BookOpen size={16} />
            My Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/leaderboard")}
            className="px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
              color: C.bg,
              boxShadow: `0 4px 20px ${C.brand}40`,
            }}
          >
            <Trophy size={16} />
            Leaderboard
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Courses Enrolled"
          value={dashboard.coursesCount}
          subtext="Active learning"
          delay={0}
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={dashboard.certificatesCount}
          subtext="Earned credentials"
          trend={12}
          delay={0.1}
        />
        <StatCard
          icon={Target}
          label="Challenges"
          value={dashboard.challenges}
          subtext="Completed this month"
          trend={8}
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Learning Time"
          value={timeData.hours}
          subtext={`${timeData.mins} mins total`}
          delay={0.3}
        />
      </div>

      {/* Continue Learning & Weekly Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        {dashboard.topCourse && (
          <GlowCard
            onClick={() => navigate(`/user/learn/${dashboard.topCourse.id}`)}
            className="lg:col-span-2 p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={
                    dashboard.topCourse.image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
                  }
                  alt={dashboard.topCourse.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,15,13,0.8), transparent)",
                  }}
                />
                <div
                  className="absolute bottom-2 left-2 flex items-center gap-1 text-xs"
                  style={{ color: C.text }}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Continue</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: `${C.brand}20`,
                      color: C.brand,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    In Progress
                  </span>
                  <span style={{ color: C.textDim }}>
                    {dashboard.topCourse.progress}% complete
                  </span>
                </div>

                <h3
                  className="text-xl font-bold mb-2 line-clamp-1"
                  style={{ fontFamily: "'Fraunces', serif", color: C.text }}
                >
                  {dashboard.topCourse.name}
                </h3>

                <ProgressBar progress={dashboard.topCourse.progress} />

                <div className="flex items-center justify-between mt-4">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: C.textMuted }}
                  >
                    <Clock size={14} />
                    <span>Resume where you left off</span>
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-1 text-sm font-medium"
                    style={{ color: C.brand }}
                  >
                    Continue <ArrowRight size={16} />
                  </motion.div>
                </div>
              </div>
            </div>
          </GlowCard>
        )}

        {/* Weekly Goal Card */}
        <GlowCard className="p-6" gradient={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{ background: `${C.brand}20` }}
              >
                <Target size={20} style={{ color: C.brand }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: C.text }}>
                  Weekly Goal
                </h3>
                <p className="text-xs" style={{ color: C.textDim }}>
                  5 hours target
                </p>
              </div>
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {dashboard.weeklyGoal}%
            </span>
          </div>

          <ProgressBar progress={dashboard.weeklyGoal} />

          <div
            className="mt-4 flex items-center gap-2 text-sm"
            style={{ color: C.textMuted }}
          >
            <Flame size={16} style={{ color: C.accent }} />
            <span>3 day streak! Keep it up!</span>
          </div>
        </GlowCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold flex items-center gap-2"
                style={{ fontFamily: "'Fraunces', serif", color: C.text }}
              >
                <Star size={20} style={{ color: C.brand }} />
                Recommended for You
              </h2>
              <button
                onClick={() => navigate("/user/mycourses")}
                className="text-sm flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: C.brand }}
              >
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.recommended.map((course, idx) => (
                <GlowCard
                  key={course._id}
                  onClick={() => navigate(`/user/course/${course._id}`)}
                  className="p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold line-clamp-1 mb-1"
                        style={{
                          fontFamily: "'Fraunces', serif",
                          color: C.text,
                        }}
                      >
                        {course.title}
                      </h3>
                      <p
                        className="text-sm line-clamp-2 mb-2"
                        style={{ color: C.textMuted }}
                      >
                        {course.shortDesc ||
                          "Learn essential skills with hands-on projects"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: `${C.brand}20`,
                            color: C.brand,
                            border: `1px solid ${C.border}`,
                          }}
                        >
                          {course.level || "Beginner"}
                        </span>
                        <span
                          className="text-xs flex items-center gap-1"
                          style={{ color: C.textDim }}
                        >
                          <Clock size={12} />
                          {course.duration || "8 weeks"}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2
              className="text-xl font-bold flex items-center gap-2 mb-4"
              style={{ fontFamily: "'Fraunces', serif", color: C.text }}
            >
              <Activity size={20} style={{ color: C.brand }} />
              Recent Activity
            </h2>

            <GlowCard className="p-0 overflow-hidden" gradient={false}>
              <div className="divide-y" style={{ borderColor: C.border }}>
                {dashboard.recentActivity.length > 0 ? (
                  dashboard.recentActivity.map((activity, idx) => (
                    <motion.div
                      key={activity._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${C.brand}20` }}
                      >
                        <Zap size={18} style={{ color: C.brand }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ color: C.text }}>{activity.message}</p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: C.textDim }}
                        >
                          {new Date(activity.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center" style={{ color: C.textDim }}>
                    <Activity size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </GlowCard>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <section>
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "'Fraunces', serif", color: C.text }}
            >
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                {
                  icon: Play,
                  label: "Resume Learning",
                  action: () =>
                    dashboard.topCourse &&
                    navigate(`/user/learn/${dashboard.topCourse.id}`),
                },
                {
                  icon: Trophy,
                  label: "View Achievements",
                  action: () => navigate("/user/certificates"),
                },
                { icon: BarChart3, label: "Progress Report", action: () => {} },
                {
                  icon: GraduationCap,
                  label: "Browse Catalog",
                  action: () => navigate("/user/mycourses"),
                },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group"
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    className="p-2 rounded-lg transition-transform group-hover:scale-110"
                    style={{ background: `${C.brand}20`, color: C.brand }}
                  >
                    <item.icon size={18} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: C.textMuted }}
                  >
                    {item.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="ml-auto transition-colors"
                    style={{ color: C.textDim }}
                  />
                </motion.button>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "'Fraunces', serif", color: C.text }}
              >
                <Bell size={18} style={{ color: C.brand }} />
                Notifications
              </h2>
              {notifications.length > 0 && (
                <span
                  className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: C.brand }}
                >
                  Mark all read
                </span>
              )}
            </div>

            <GlowCard className="p-0 max-h-80 overflow-hidden" gradient={false}>
              <div
                className="divide-y max-h-80 overflow-y-auto"
                style={{ borderColor: C.border }}
              >
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification, idx) => (
                    <motion.div
                      key={notification._id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.read ? "border-l-2" : ""
                      }`}
                      style={{
                        background: !notification.read
                          ? `${C.brand}08`
                          : "transparent",
                        borderColor: !notification.read
                          ? C.brand
                          : "transparent",
                      }}
                    >
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: C.text }}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: C.textDim }}>
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center" style={{ color: C.textDim }}>
                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
            </GlowCard>
          </section>

          {/* Learning Streak */}
          <GlowCard className="p-6" gradient={false}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: `${C.accent}20` }}
              >
                <Flame size={20} style={{ color: C.accent }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: C.text }}>
                  3 Day Streak!
                </h3>
                <p className="text-xs" style={{ color: C.textDim }}>
                  Keep learning daily
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{
                    background: idx < 3 ? C.brand : C.surface2,
                    color: idx < 3 ? C.bg : C.textDim,
                    border: `1px solid ${idx < 3 ? C.brand : C.border}`,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
