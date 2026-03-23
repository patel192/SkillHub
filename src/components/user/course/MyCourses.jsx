import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Flame,
  Play,
  Search,
  Filter,
  Clock,
  BarChart3,
  MoreVertical,
  ChevronRight,
  Star,
  Users,
  Award,
  TrendingUp,
  Grid3X3,
  List,
  Sparkles
} from "lucide-react";

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

const ProgressRing = ({ progress, size = 40, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-indigo-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{progress}%</span>
      </div>
    </div>
  );
};

// ==========================================
// COURSE CARD COMPONENT
// ==========================================

const CourseCard = ({ course, isMyCourse, viewMode = "grid" }) => {
  const navigate = useNavigate();
  
  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01, x: 4 }}
        onClick={() => navigate(`/user/course/${course._id}`)}
        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all cursor-pointer"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {course.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-1">{course.description}</p>
            </div>
            {isMyCourse && course.progress !== undefined && (
              <div className="flex items-center gap-3">
                <ProgressRing progress={course.progress} size={44} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} />
              {course.duration || "8 weeks"}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Users size={12} />
              {course.students || "1.2k"} students
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
              {course.level || "Beginner"}
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer"
      onClick={() => navigate(`/user/course/${course._id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.level && (
            <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
              {course.level}
            </span>
          )}
          {!isMyCourse && course.isNew && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-sm text-emerald-300 text-xs font-medium border border-emerald-500/20">
              New
            </span>
          )}
        </div>

        {/* Progress Ring (for my courses) */}
        {isMyCourse && course.progress !== undefined && (
          <div className="absolute bottom-3 right-3">
            <ProgressRing progress={course.progress} size={48} strokeWidth={5} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {course.description || "Master the fundamentals with hands-on projects and expert guidance."}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {course.duration || "8 weeks"}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {course.students || "1.2k"}
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} className="text-amber-400" />
            {course.rating || "4.8"}
          </span>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            isMyCourse
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
              : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Play size={16} fill="currentColor" />
          {isMyCourse ? (course.progress > 0 ? "Continue" : "Start") : "Start Learning"}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("my");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [discoverCourses, setDiscoverCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, hours: 0 });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [myRes, discoverRes] = await Promise.all([
        axios.get(`/enrollment/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/courses", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const mappedMyCourses = (myRes.data.data || []).map((e) => ({
        ...e.courseId,
        progress: e.progress || 0,
        enrolledAt: e.enrolledAt
      }));

      setMyCourses(mappedMyCourses);
      setDiscoverCourses(discoverRes.data.data || []);

      // Calculate stats
      const completed = mappedMyCourses.filter(c => c.progress === 100).length;
      const inProgress = mappedMyCourses.filter(c => c.progress > 0 && c.progress < 100).length;
      const totalHours = mappedMyCourses.reduce((acc, c) => acc + (c.durationHours || 0), 0);
      
      setStats({
        total: mappedMyCourses.length,
        completed,
        inProgress,
        hours: totalHours
      });
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const courses = activeTab === "my" ? myCourses : discoverCourses;
    if (!searchQuery) return courses;
    return courses.filter(c => 
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, myCourses, discoverCourses, searchQuery]);

  const tabs = [
    { id: "my", label: "My Courses", icon: BookOpen, count: stats.total },
    { id: "discover", label: "Discover", icon: Flame, count: null }
  ];

  if (loading) {
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
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {activeTab === "my" ? "My Learning" : "Discover Courses"}
          </h1>
          <p className="text-slate-400">
            {activeTab === "my" 
              ? `You have ${stats.total} courses in your library`
              : "Explore new skills and expand your knowledge"
            }
          </p>
        </div>

        {/* Stats Cards - Only show on My Courses tab */}
        {activeTab === "my" && (
          <div className="flex gap-4">
            {[
              { label: "Completed", value: stats.completed, icon: Award, color: "emerald" },
              { label: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "indigo" },
              { label: "Hours", value: stats.hours, icon: Clock, color: "amber" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="px-4 py-3 rounded-xl bg-slate-900/50 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} className={`text-${stat.color}-400`} />
                  <span className="text-xs text-slate-500">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-white">
                  <AnimatedCounter value={stat.value} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-white/5">
        {/* Tab Switcher */}
        <LayoutGroup>
          <div className="relative flex bg-slate-900/50 rounded-xl p-1 border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-500/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.5 rounded-md text-xs ${
                      activeTab === tab.id ? "bg-white/20" : "bg-white/5"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
            />
          </div>
          
          <div className="flex bg-slate-900/50 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${viewMode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-3"
          }
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, idx) => (
              <CourseCard
                key={course._id}
                course={course}
                isMyCourse={activeTab === "my"}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-900/50 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No courses found</h3>
              <p className="text-slate-400 text-sm">
                {searchQuery ? "Try adjusting your search terms" : "Start exploring to find your next learning adventure"}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyCourses;