import { useSelector, useDispatch } from "react-redux";
import { fetchAllCourses, fetchMyCourses } from "../../../redux/features/courses/coursesSlice";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import apiClient from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Flame,
  Play,
  Search,
  Clock,
  ChevronRight,
  Star,
  Users,
  Award,
  TrendingUp,
  Grid3X3,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Target
} from "lucide-react";

// ==========================================
// DESIGN TOKENS (Matching Your Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  error: "#F87171",
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

const ProgressRing = ({ progress, size = 44, strokeWidth = 4 }) => {
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
          style={{ color: "var(--surface3)" }}
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
          strokeLinecap="round"
          style={{ color: C.brand }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{progress}%</span>
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
        className="group relative flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer"
        style={{ 
          background: "var(--surface)",
          border: `1px solid ${"var(--border)"}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = "var(--surface2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = "var(--surface)";
        }}
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'linear-gradient(to top, rgba(10,15,13,0.8), transparent)' }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 
                className="font-semibold line-clamp-1 transition-colors"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                {course.title}
              </h3>
              <p className="text-sm mt-1 line-clamp-1" style={{ color: "var(--text-muted)" }}>{course.description}</p>
            </div>
            {isMyCourse && course.progress !== undefined && (
              <ProgressRing progress={course.progress} />
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Clock size={12} />
              {course.duration || "8 weeks"}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Users size={12} />
              {course.students || "1.2k"} students
            </span>
            <span 
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ 
                background: `${C.brand}20`,
                color: C.brand,
                border: `1px solid ${"var(--border)"}`,
              }}
            >
              {course.level || "Beginner"}
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
          style={{ 
            background: `${C.brand}15`,
            color: C.brand,
          }}
        >
          <ChevronRightIcon size={20} />
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
      className="group relative rounded-2xl overflow-hidden transition-all cursor-pointer"
      style={{ 
        background: "var(--surface)",
        border: `1px solid ${"var(--border)"}`,
      }}
      onClick={() => navigate(`/user/course/${course._id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = `0 20px 40px ${C.brand}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = 'none';
      }}
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
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #111814, transparent)' }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.level && (
            <span 
              className="px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-medium"
              style={{ 
                background: 'rgba(10,15,13,0.8)',
                color: "var(--text)",
                border: `1px solid ${"var(--border)"}`,
              }}
            >
              {course.level}
            </span>
          )}
          {!isMyCourse && course.isNew && (
            <span 
              className="px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-medium"
              style={{ 
                background: `${C.brand}30`,
                color: C.brandLight,
                border: `1px solid ${"var(--border)"}`,
              }}
            >
              New
            </span>
          )}
        </div>

        {/* Progress Ring */}
        {isMyCourse && course.progress !== undefined && (
          <div className="absolute bottom-3 right-3">
            <ProgressRing progress={course.progress} size={48} strokeWidth={5} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 
          className="text-lg font-semibold mb-2 line-clamp-1 transition-colors group-hover:text-emerald-300"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
        >
          {course.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-muted)" }}>
          {course.description || "Master the fundamentals with hands-on projects and expert guidance."}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {course.duration || "8 weeks"}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {course.students || "1.2k"}
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} style={{ color: C.accent }} />
            {course.rating || "4.8"}
          </span>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
          style={isMyCourse ? {
            background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
            color: "var(--bg)",
            boxShadow: `0 4px 20px ${C.brand}40`,
          } : {
            background: "var(--surface2)",
            color: "var(--text)",
            border: `1px solid ${"var(--border)"}`,
          }}
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
  const [myCourses, setMyCourses] = useState([]);
  const [discoverCourses, setDiscoverCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, hours: 0 });
  const {user,loading:authLoading} = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    if(!userId || authLoading) return;
    fetchData();
  }, [userId,authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [myRes, discoverRes] = await Promise.all([
        apiClient.get(`/enrollment/${userId}`),
        apiClient.get("/courses")
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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]" style={{ background: "var(--bg)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 rounded-full"
          style={{ borderColor: C.brand, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8" style={{ color: "var(--text)" }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
          >
            {activeTab === "my" ? "My Learning" : "Discover Courses"}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            {activeTab === "my" 
              ? `You have ${stats.total} courses in your library`
              : "Explore new skills and expand your knowledge"
            }
          </p>
        </div>

        {/* Stats Cards */}
        {activeTab === "my" && (
          <div className="flex gap-3">
            {[
              { label: "Completed", value: stats.completed, icon: Award, color: C.brand },
              { label: "In Progress", value: stats.inProgress, icon: Target, color: C.accent },
              { label: "Hours", value: stats.hours, icon: Clock, color: "var(--text-muted)" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="px-4 py-3 rounded-xl"
                style={{ 
                  background: "var(--surface)",
                  border: `1px solid ${"var(--border)"}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} style={{ color: stat.color }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
                </div>
                <div 
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
                >
                  <AnimatedCounter value={stat.value} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Controls Bar */}
      <div 
        className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl"
        style={{ 
          background: "var(--surface)",
          border: `1px solid ${"var(--border)"}`,
        }}
      >
        {/* Tab Switcher */}
        <LayoutGroup>
          <div 
            className="relative flex rounded-xl p-1"
            style={{ 
              background: "var(--surface2)",
              border: `1px solid ${"var(--border)"}`,
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: isActive ? "var(--bg)" : "var(--text-muted)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                        boxShadow: `0 4px 20px ${C.brand}40`,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    {tab.label}
                    {tab.count !== null && (
                      <span 
                        className="px-1.5 py-0.5 rounded-md text-xs"
                        style={{ 
                          background: isActive ? 'rgba(10,15,13,0.2)' : "var(--surface3)",
                          color: isActive ? "var(--bg)" : "var(--text-muted)",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2" 
              size={16} 
              style={{ color: "var(--text-muted)" }} 
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ 
                background: "var(--surface2)",
                border: `1px solid ${"var(--border)"}`,
                color: "var(--text)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.brand;
                e.target.style.boxShadow = `0 0 0 3px ${C.brand}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div 
            className="flex rounded-xl p-1"
            style={{ 
              background: "var(--surface2)",
              border: `1px solid ${"var(--border)"}`,
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                background: viewMode === "grid" ? "var(--surface3)" : 'transparent',
                color: viewMode === "grid" ? "var(--text)" : "var(--text-muted)",
              }}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                background: viewMode === "list" ? "var(--surface3)" : 'transparent',
                color: viewMode === "list" ? "var(--text)" : "var(--text-muted)",
              }}
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
            filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isMyCourse={activeTab === "my"}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "var(--surface2)" }}
              >
                <Sparkles className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
              </div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                No courses found
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
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