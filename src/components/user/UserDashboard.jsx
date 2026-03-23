import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
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
  Calendar,
  Zap,
  ChevronRight,
  MoreHorizontal,
  Trophy,
  Star,
  Activity,
  Bell,       
  BarChart3,
  GraduationCap
} from "lucide-react";

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

  return <span>{count}{suffix}</span>;
};

const ProgressBar = ({ progress, color = "from-indigo-500 to-purple-500" }) => (
  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full bg-gradient-to-r ${color} rounded-full`}
    />
  </div>
);

const GlowCard = ({ children, className = "", onClick, gradient = "from-indigo-500/10 to-purple-500/10" }) => (
  <motion.div
    whileHover={{ scale: 1.01, y: -2 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-white/5 ${className}`}
  >
    {/* Glow Effect */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const StatCard = ({ icon: Icon, label, value, subtext, trend, color = "indigo", delay = 0 }) => {
  const colorVariants = {
    indigo: "from-indigo-500 to-purple-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
      <div className="relative p-6 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariants[color]} shadow-lg`}>
            <Icon size={20} className="text-white" />
          </div>
          {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
            }`}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-white">
            <AnimatedCounter value={value} />
          </h3>
          <p className="text-sm text-slate-400 mt-1">{label}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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
        
        // Parallel data fetching
        const [userRes, coursesRes, certRes, actRes, notifRes, recRes] = await Promise.all([
          axios.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/enrollment/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/certificates/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/activities/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/notifications/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/courses", { headers: { Authorization: `Bearer ${token}` } })
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
            const c = await axios.get(`/course/${topCourseId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            topCourse = {
              id: topCourseId,
              name: c.data.data.title,
              image: c.data.data.imageUrl,
              progress: Math.min(100, Math.floor((courseTimes[0].seconds / 3600) * 100))
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
          weeklyGoal: 75 // percentage
        });
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  // Format time
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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {userName.split(" ")[0]}
            </span>
          </h1>
          <p className="text-slate-400 mt-1">Here's your learning progress today</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/mycourses")}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <BookOpen size={16} />
            My Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/leaderboard")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2"
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
          color="indigo"
          delay={0}
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={dashboard.certificatesCount}
          subtext="Earned credentials"
          trend={12}
          color="emerald"
          delay={0.1}
        />
        <StatCard
          icon={Target}
          label="Challenges"
          value={dashboard.challenges}
          subtext="Completed this month"
          trend={8}
          color="amber"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Learning Time"
          value={timeData.hours}
          subtext={`${timeData.mins} mins total`}
          color="rose"
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
            gradient="from-indigo-500/20 to-purple-500/20"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={dashboard.topCourse.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"}
                  alt={dashboard.topCourse.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white/80">
                  <Play size={12} fill="currentColor" />
                  <span>Continue</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                    In Progress
                  </span>
                  <span className="text-xs text-slate-500">{dashboard.topCourse.progress}% complete</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                  {dashboard.topCourse.name}
                </h3>
                
                <ProgressBar progress={dashboard.topCourse.progress} />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock size={14} />
                    <span>Resume where you left off</span>
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-1 text-indigo-400 text-sm font-medium"
                  >
                    Continue <ArrowRight size={16} />
                  </motion.div>
                </div>
              </div>
            </div>
          </GlowCard>
        )}

        {/* Weekly Goal Card */}
        <GlowCard className="p-6" gradient="from-emerald-500/10 to-teal-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Target size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Weekly Goal</h3>
                <p className="text-xs text-slate-400">5 hours target</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-400">{dashboard.weeklyGoal}%</span>
          </div>
          
          <ProgressBar progress={dashboard.weeklyGoal} color="from-emerald-500 to-teal-500" />
          
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Flame size={16} className="text-orange-400" />
            <span>3 day streak! Keep it up!</span>
          </div>
        </GlowCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Star size={20} className="text-indigo-400" />
                Recommended for You
              </h2>
              <button 
                onClick={() => navigate("/user/mycourses")}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
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
                  delay={idx * 0.1}
                >
                  <div className="flex gap-4">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white line-clamp-1 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                        {course.shortDesc || "Learn essential skills with hands-on projects"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
                          {course.level || "Beginner"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
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
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity size={20} className="text-indigo-400" />
              Recent Activity
            </h2>
            
            <GlowCard className="p-0 overflow-hidden">
              <div className="divide-y divide-white/5">
                {dashboard.recentActivity.length > 0 ? (
                  dashboard.recentActivity.map((activity, idx) => (
                    <motion.div
                      key={activity._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap size={18} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200">{activity.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(activity.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Activity size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </GlowCard>
          </section>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: Play, label: "Resume Learning", color: "indigo", action: () => dashboard.topCourse && navigate(`/user/learn/${dashboard.topCourse.id}`) },
                { icon: Trophy, label: "View Achievements", color: "amber", action: () => navigate("/user/certificates") },
                { icon: BarChart3, label: "Progress Report", color: "emerald", action: () => {} },
                { icon: GraduationCap, label: "Browse Catalog", color: "purple", action: () => navigate("/user/mycourses") }
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group"
                >
                  <div className={`p-2 rounded-lg bg-${item.color}-500/20 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                  <ChevronRight size={16} className="ml-auto text-slate-500 group-hover:text-white transition-colors" />
                </motion.button>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell size={18} className="text-indigo-400" />
                Notifications
              </h2>
              {notifications.length > 0 && (
                <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">
                  Mark all read
                </span>
              )}
            </div>
            
            <GlowCard className="p-0 max-h-80 overflow-hidden">
              <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification, idx) => (
                    <motion.div
                      key={notification._id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.read ? "bg-indigo-500/5 border-l-2 border-indigo-500" : ""
                      }`}
                    >
                      <p className="text-sm text-slate-200 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
            </GlowCard>
          </section>

          {/* Learning Streak */}
          <GlowCard className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame size={20} className="text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">3 Day Streak!</h3>
                <p className="text-xs text-slate-400">Keep learning daily</p>
              </div>
            </div>
            <div className="flex gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                    idx < 3 
                      ? "bg-orange-500 text-white" 
                      : "bg-white/5 text-slate-500"
                  }`}
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