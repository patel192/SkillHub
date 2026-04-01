import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import {
  BookOpen,
  Clock,
  DollarSign,
  User,
  Sparkles,
  Star,
  Bookmark,
  Share2,
  Flag,
  Play,
  ChevronRight,
  Award,
  Target,
  Users,
  CheckCircle2,
  ArrowLeft,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { ReportModal } from "../report/ReportModal";
import { useAuth } from "../../../context/AuthContext";
// ==========================================
// DESIGN TOKENS (Matching MyCourses Theme)
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

const TAB_KEYS = ["about", "instructors", "syllabus", "reviews"];

export const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { token, userId } = useAuth();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [courseRes, overviewRes, enrollRes] = await Promise.all([
          apiClient.get(`/course/${courseId}`),
          apiClient.get(`/overview/${courseId}`),
          apiClient.get(`/enrollment/${userId}`),
        ]);

        if (!mounted) return;

        const c = courseRes.data.data || {};
        setCourse(c);

        let ov = overviewRes.data.data?.overview || [];
        if (typeof ov === "string") {
          ov = ov
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        setOverview(Array.isArray(ov) ? ov : []);

        const enrollments = enrollRes.data.data || [];
        const isEnrolled = enrollments.some(
          (e) => String(e.courseId?._id || e.courseId) === String(courseId),
        );
        setEnrolled(isEnrolled);

        const bookmarkKey = `bookmark_${userId}_${courseId}`;
        setIsBookmarked(!!localStorage.getItem(bookmarkKey));
      } catch (err) {
        console.error("Error loading course details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [courseId, token, userId]);

  const handleEnroll = async () => {
    try {
      await apiClient.post("/enrollment", {
        userId,
        courseId,
        status: "Registered",
        progress: 0,
      });
      setEnrolled(true);
    } catch (error) {
      console.error("Failed to enroll", error);
    }
  };

  const toggleBookmark = async () => {
    setSavingBookmark(true);
    try {
      const key = `bookmark_${userId}_${courseId}`;
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        setIsBookmarked(false);
      } else {
        localStorage.setItem(key, "1");
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "var(--bg)" }}
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

  if (!course) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: "var(--surface)" }}
          >
            <Sparkles className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text)", fontFamily: "Fraunces, serif" }}
          >
            Course not found
          </h2>
          <p style={{ color: "var(--text)"Muted }}>
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/user/courses")}
            className="mt-6 px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              border: `1px solid ${"var(--border)"}`,
            }}
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const instructors =
    Array.isArray(course.instructors) && course.instructors.length > 0
      ? course.instructors
      : course.instructor
        ? [
            {
              name: course.instructor,
              title: "Lead Instructor",
              bio: "Experienced professional and subject matter expert.",
              avatar:
                course.instructorAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  course.instructor,
                )}&background=16A880&color=fff`,
            },
          ]
        : [];

  const rating = course.rating || 4.0;
  const reviewsCount = course.reviewsCount || 1200;

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: "var(--text)", fontFamily: "Fraunces, serif" }}
                  >
                    <Target size={20} style={{ color: C.brand }} />
                    What you'll learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {overview.length > 0 ? (
                      overview.slice(0, 6).map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{ background: "var(--surface)"2 }}
                        >
                          <CheckCircle2
                            size={18}
                            style={{
                              color: C.brand,
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          <span style={{ color: "var(--text)"Muted }}>{item}</span>
                        </motion.div>
                      ))
                    ) : (
                      <p style={{ color: "var(--text-muted)" }}>
                        No learning objectives specified.
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: "var(--text)", fontFamily: "Fraunces, serif" }}
                  >
                    About this course
                  </h3>
                  <p style={{ color: "var(--text)"Muted, lineHeight: 1.7 }}>
                    {course.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  <h4 className="font-semibold mb-4" style={{ color: "var(--text)" }}>
                    Course Details
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Clock,
                        label: "Duration",
                        value: course.duration || "Self-paced",
                      },
                      {
                        icon: Award,
                        label: "Level",
                        value: course.level || "All Levels",
                      },
                      {
                        icon: BookOpen,
                        label: "Category",
                        value: course.category || "General",
                      },
                      {
                        icon: Users,
                        label: "Students",
                        value: `${course.students || "1.2k"} enrolled`,
                      },
                      {
                        icon: Calendar,
                        label: "Last Updated",
                        value: course.updatedAt
                          ? new Date(course.updatedAt).toLocaleDateString()
                          : "Recently",
                      },
                    ].map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="flex items-center gap-3">
                          <detail.icon size={16} style={{ color: "var(--text-muted)" }} />
                          <span style={{ color: "var(--text)"Muted }}>
                            {detail.label}
                          </span>
                        </div>
                        <span style={{ color: "var(--text)" }} className="font-medium">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ color: "var(--text)"Muted }}>Price</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: C.brand, fontFamily: "Fraunces, serif" }}
                    >
                      {course.price > 0 ? `₹${course.price}` : "Free"}
                    </span>
                  </div>
                  {!enrolled ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnroll}
                      className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                        color: "var(--bg)",
                        boxShadow: `0 4px 20px ${C.brand}40`,
                      }}
                    >
                      <Play size={18} fill="currentColor" />
                      Enroll Now
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/user/learn/${courseId}`)}
                      className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                      style={{
                        background: "var(--surface)"2,
                        color: "var(--text)",
                        border: `1px solid ${"var(--border)"}`,
                      }}
                    >
                      <Play size={18} />
                      Continue Learning
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "instructors":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {instructors.map((ins, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl transition-all"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${"var(--border)"}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={ins.avatar}
                    alt={ins.name}
                    className="w-16 h-16 rounded-full object-cover border-2"
                    style={{ borderColor: C.brand }}
                  />
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-lg"
                      style={{ color: "var(--text)" }}
                    >
                      {ins.name}
                    </h4>
                    <p style={{ color: C.brand }} className="text-sm mb-2">
                      {ins.title || "Instructor"}
                    </p>
                    <p
                      style={{ color: "var(--text)"Muted }}
                      className="text-sm leading-relaxed"
                    >
                      {ins.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case "syllabus":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {overview.length > 0 ? (
              overview.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl flex items-center gap-4 group cursor-pointer"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                  whileHover={{ x: 4, borderColor: "var(--border)"Hov }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                    style={{ background: "var(--surface)"2, color: C.brand }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 style={{ color: "var(--text)" }} className="font-medium">
                      Module {i + 1}
                    </h4>
                    <p style={{ color: "var(--text)"Muted }} className="text-sm">
                      {point}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    style={{ color: "var(--text-muted)" }}
                    className="group-hover:text-white transition-colors"
                  />
                </motion.div>
              ))
            ) : (
              <div
                className="text-center py-12 rounded-2xl"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${"var(--border)"}`,
                }}
              >
                <BookOpen
                  size={48}
                  style={{ color: "var(--text-muted)" }}
                  className="mx-auto mb-4"
                />
                <p style={{ color: "var(--text)"Muted }}>Syllabus not available</p>
              </div>
            )}
          </motion.div>
        );

      case "reviews":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div
              className="flex items-center gap-6 p-6 rounded-2xl"
              style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
            >
              <div className="text-center">
                <div
                  className="text-5xl font-bold mb-1"
                  style={{ color: C.brand, fontFamily: "Fraunces, serif" }}
                >
                  {rating}
                </div>
                <div className="flex gap-1 justify-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      style={{
                        color:
                          star <= Math.floor(rating) ? C.accent : "var(--text-muted)",
                      }}
                      fill={
                        star <= Math.floor(rating) ? C.accent : "transparent"
                      }
                    />
                  ))}
                </div>
                <div style={{ color: "var(--text)"Muted }} className="text-sm">
                  {reviewsCount} reviews
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span style={{ color: "var(--text-muted)" }} className="text-sm w-8">
                      {stars}★
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--surface)"2 }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.random() * 60 + 10}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ background: C.brand, height: "100%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Excellent course structure",
                "Great practical examples",
                "Very informative",
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                      style={{ background: "var(--surface)"2, color: C.brand }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div>
                      <div style={{ color: "var(--text)" }} className="font-medium">
                        Student {i + 1}
                      </div>
                      <div style={{ color: "var(--text-muted)" }} className="text-xs">
                        2 days ago
                      </div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={12}
                          style={{ color: C.accent }}
                          fill={C.accent}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "var(--text)"Muted }}>{review}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "var(--bg)", minHeight: "100vh" }}
      className="pb-12"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <button
            onClick={() => navigate("/user/mycourses")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            style={{ color: "var(--text)"Muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.background = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text)"Muted;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Courses</span>
          </button>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleBookmark}
              disabled={savingBookmark}
              className="p-3 rounded-xl transition-all"
              style={{
                background: isBookmarked ? `${C.brand}20` : "var(--surface)",
                border: `1px solid ${isBookmarked ? C.brand : "var(--border)"}`,
                color: isBookmarked ? C.brand : "var(--text)"Muted,
              }}
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? C.brand : "transparent"}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 rounded-xl"
              style={{
                background: "var(--surface)",
                border: `1px solid ${"var(--border)"}`,
                color: "var(--text)"Muted,
              }}
            >
              <Share2 size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReportModal(true)}
              className="p-3 rounded-xl"
              style={{
                background: "var(--surface)",
                border: `1px solid ${"var(--border)"}`,
                color: C.error,
              }}
            >
              <Flag size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ border: `1px solid ${"var(--border)"}` }}
        >
          <div className="absolute inset-0">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div
              style={{
                background: `linear-gradient(to top, ${"var(--bg)"} 0%, ${"var(--bg)"}cc 50%, transparent 100%)`,
              }}
              className="absolute inset-0"
            />
          </div>

          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${C.brand}20`,
                      color: C.brand,
                      border: `1px solid ${"var(--border)"}`,
                    }}
                  >
                    {course.category || "Course"}
                  </span>
                  <div
                    className="flex items-center gap-1"
                    style={{ color: C.accent }}
                  >
                    <Star size={14} fill={C.accent} />
                    <span className="text-sm font-medium">{rating}</span>
                    <span style={{ color: "var(--text-muted)" }}>({reviewsCount})</span>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
                  style={{ color: "var(--text)", fontFamily: "Fraunces, serif" }}
                >
                  {course.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg max-w-2xl mb-6"
                  style={{ color: "var(--text)"Muted }}
                >
                  {course.shortDesc || course.description?.slice(0, 200)}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-6"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={instructors[0]?.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full border-2"
                      style={{ borderColor: C.brand }}
                    />
                    <div>
                      <div style={{ color: "var(--text)"Muted }} className="text-xs">
                        Instructor
                      </div>
                      <div style={{ color: "var(--text)" }} className="font-medium">
                        {instructors[0]?.name}
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-px" style={{ background: "var(--border)" }} />
                  <div
                    className="flex items-center gap-2"
                    style={{ color: "var(--text)"Muted }}
                  >
                    <Users size={18} />
                    <span>{course.students || "1.2k"} students</span>
                  </div>
                  <div className="h-8 w-px" style={{ background: "var(--border)" }} />
                  <div
                    className="flex items-center gap-2"
                    style={{ color: "var(--text)"Muted }}
                  >
                    <Clock size={18} />
                    <span>{course.duration || "Self-paced"}</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-3"
              >
                {!enrolled ? (
                  <>
                    <div className="text-center mb-2">
                      <span
                        className="text-3xl font-bold"
                        style={{
                          color: C.brand,
                          fontFamily: "Fraunces, serif",
                        }}
                      >
                        {course.price > 0 ? `₹${course.price}` : "Free"}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `0 10px 40px ${C.brand}40`,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnroll}
                      className="px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                        color: "var(--bg)",
                      }}
                    >
                      <Play size={20} fill="currentColor" />
                      Enroll Now
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/user/learn/${courseId}`)}
                    className="px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2"
                    style={{
                      background: "var(--surface)"2,
                      color: "var(--text)",
                      border: `1px solid ${C.brand}`,
                    }}
                  >
                    <Play size={20} />
                    Continue Learning
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-1 p-1 rounded-2xl w-fit"
          style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
        >
          {TAB_KEYS.map((key) => {
            const active = activeTab === key;
            const labels = {
              about: "About",
              instructors: "Instructors",
              syllabus: "Syllabus",
              reviews: "Reviews",
            };
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="relative px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ color: active ? "var(--bg)" : "var(--text)"Muted }}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{labels[key]}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {showReportModal && (
          <ReportModal
            courseId={courseId}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </div>
    </motion.div>
  );
};

export default CourseDetails;
