import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner } from "../../../utils/Spinner";
import {
  BadgeCheck,
  Clock,
  DollarSign,
  BookOpen,
  User,
  Sparkles,
  Star,
  Bookmark,
  Share2,
  Flag,
} from "lucide-react";
import { ReportModal } from "../report/ReportModal";

/**
 * CourseDetails (modern / tabbed)
 * - Option A: functional tabs
 * - Keeps all backend logic (enroll/check/enrollment)
 * - Uses course.instructors if provided; otherwise fallback to sample built from course.instructor
 */

const TAB_KEYS = ["about", "instructors", "syllabus", "reviews"];

export const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [savingBookmark, setSavingBookmark] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch course, overview and enrollment status
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        // parallel calls
        const courseReq = axios.get(`/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const overviewReq = axios.get(`/overview/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const enrollReq = axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const [courseRes, overviewRes, enrollRes] = await Promise.all([
          courseReq,
          overviewReq,
          enrollReq,
        ]);

        if (!mounted) return;

        const c = courseRes.data.data || {};
        setCourse(c);

        // Normalize overview: array of lines or array already
        let ov = overviewRes.data.data?.overview || [];
        if (typeof ov === "string") {
          ov = ov.split("\n").map((s) => s.trim()).filter(Boolean);
        }
        setOverview(Array.isArray(ov) ? ov : []);

        // check enrollment
        const enrollments = enrollRes.data.data || [];
        const isEnrolled = enrollments.some(
          (e) =>
            String(e.courseId?._id || e.courseId) === String(courseId)
        );
        setEnrolled(isEnrolled);
      } catch (err) {
        console.error("Error loading course details:", err);
        toast.error("Failed to load course data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [courseId, token, userId]);

  // enroll action (preserves your existing logic)
  const handleEnroll = async () => {
    try {
      await axios.post(
        "/enrollment",
        { userId, courseId, status: "Registered", progress: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      toast.success("Successfully enrolled in this course!");
    } catch (error) {
      console.error("Failed to enroll", error);
      toast.error("Enrollment failed. Please try again.");
    }
  };

  // Bookmark action (client-side demo)
  const toggleBookmark = async () => {
    setSavingBookmark(true);
    try {
      // Example: POST /bookmarks (if you have one). Fallback: localStorage toggle
      // await axios.post('/bookmarks', { userId, courseId }, { headers:{ Authorization:`Bearer ${token}` } });
      const key = `bookmark_${userId}_${courseId}`;
      if (localStorage.getItem(key)) localStorage.removeItem(key);
      else localStorage.setItem(key, "1");
      toast.success("Bookmark updated");
    } catch (err) {
      console.error(err);
      toast.error("Could not update bookmark");
    } finally {
      setSavingBookmark(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gradient-to-br from-[#0f172a] to-[#111827]">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 bg-gradient-to-br from-[#0f172a] to-[#111827] p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">Course not found</h2>
          <p className="text-sm">The course you are looking for couldn't be found.</p>
        </div>
      </div>
    );
  }

  // build instructors array — prefer course.instructors, else fall back to course.instructor string
  const instructors = Array.isArray(course.instructors) && course.instructors.length > 0
    ? course.instructors
    : (course.instructor ? [
        {
          name: course.instructor,
          title: "Lead Instructor",
          bio: "Experienced professional and subject matter expert.",
          avatar: course.instructorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`,
        }
      ] : []);

  // rating placeholder (if you have rating in course object use that)
  const rating = course.rating || 4.0;
  const reviewsCount = course.reviewsCount || 1200;

  // tab content renderers
  const renderAbout = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#11121a] p-4 rounded-xl border border-purple-600/20">
          <h4 className="text-sm text-gray-300 mb-2">What you'll learn</h4>
          <ul className="list-disc pl-5 text-gray-300 space-y-1">
            {overview.length > 0 ? (
              overview.slice(0, 6).map((o, i) => <li key={i}>{o}</li>)
            ) : (
              <li>No specifics provided for this course.</li>
            )}
          </ul>
        </div>

        <div className="bg-[#11121a] p-4 rounded-xl border border-purple-600/20">
          <h4 className="text-sm text-gray-300 mb-2">Course details</h4>
          <div className="text-gray-300 text-sm space-y-2">
            <div><strong>Duration:</strong> {course.duration || "—"}</div>
            <div><strong>Level:</strong> {course.level || "—"}</div>
            <div><strong>Category:</strong> {course.category || "—"}</div>
            <div><strong>Language:</strong> {course.language || "English"}</div>
            <div><strong>Price:</strong> {course.price > 0 ? `₹${course.price}` : "Free"}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1116] p-4 rounded-xl border border-purple-600/20">
        <h4 className="text-lg font-semibold mb-2">About this course</h4>
        <p className="text-gray-300 leading-relaxed">{course.description || "No description provided."}</p>
      </div>
    </div>
  );

  const renderInstructors = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {instructors.map((ins, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="flex gap-4 items-start bg-[#0f1116] p-4 rounded-xl border border-purple-600/20">
          <img src={ins.avatar} alt={ins.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-white font-semibold">{ins.name}</h5>
                <div className="text-xs text-gray-400">{ins.title || "Instructor"}</div>
              </div>
              <div className="text-sm text-gray-400">10+ yrs</div>
            </div>
            <p className="mt-2 text-sm text-gray-300">{ins.bio || "Experienced instructor with strong domain knowledge and practical experience in delivering high quality learning."}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSyllabus = () => (
    <div className="space-y-4">
      {overview.length > 0 ? overview.map((point, i) => (
        <div key={i} className="bg-[#0f1116] p-4 rounded-xl border border-purple-600/10 flex items-start gap-3">
          <div className="mt-1 text-indigo-300">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="font-semibold text-white">Module {i + 1}</div>
            <div className="text-sm text-gray-300">{point}</div>
          </div>
          <div className="ml-auto text-sm text-gray-400">{Math.floor(Math.random() * 10) + 5} mins</div>
        </div>
      )) : (
        <div className="text-gray-400">Syllabus is not available.</div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Star size={18} className="text-yellow-400" />
          <span className="font-semibold text-white">{rating}</span>
        </div>
        <div className="text-sm text-gray-400">({reviewsCount} reviews)</div>
      </div>

      {/* simple review examples */}
      <div className="space-y-3">
        {["Fantastic course — very practical.", "Well structured and great instructor.", "Loved the real world projects."].map((r, i) => (
          <div key={i} className="bg-[#0f1116] p-4 rounded-xl border border-purple-600/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-400/20 flex items-center justify-center text-white font-semibold">
                  {String.fromCharCode(65 + i)}
                </div>
                <div>
                  <div className="font-medium text-white">User {i + 1}</div>
                  <div className="text-xs text-gray-400">2 days ago</div>
                </div>
              </div>
              <div className="text-sm text-yellow-400">★ ★ ★ ★ ☆</div>
            </div>
            <div className="mt-2 text-sm text-gray-300">{r}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // UI: Hero and metadata
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-6 bg-gradient-to-br from-[#0f172a] via-[#121226] to-[#0b0f17] text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Breadcrumb + header area */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-400">Courses › <span className="text-gray-200">{course.title}</span></div>

          <div className="flex items-center gap-3">
            <button onClick={toggleBookmark} disabled={savingBookmark} className="p-2 rounded-full bg-[#0f1116] border border-white/6 hover:bg-white/5 transition">
              <Bookmark size={18} />
            </button>
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} className="p-2 rounded-full bg-[#0f1116] border border-white/6 hover:bg-white/5 transition">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* HERO CARD */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl overflow-hidden shadow-2xl border border-white/8">
          <div className="relative">
            <img src={course.imageUrl} alt={course.title} className="w-full h-64 object-cover mix-blend-overlay opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b1220]/60"></div>

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{course.title}</h1>
                <p className="mt-2 text-gray-100/90 max-w-2xl">{course.shortDesc || course.description?.slice(0, 140)}</p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                    <Star size={16} className="text-yellow-400" /> <span className="text-white font-semibold">{rating}</span>
                    <span className="text-gray-200 text-xs ml-2">({reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={handleEnroll} disabled={enrolled} className={`px-4 py-2 rounded-full font-semibold transition ${enrolled ? "bg-green-600 text-white cursor-not-allowed" : "bg-white text-indigo-700 hover:scale-[1.02]"}`}>
                      {enrolled ? "Enrolled" : "Enroll this course"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f1116] p-3 rounded-xl border border-white/6 flex items-center gap-3">
            <div className="p-2 rounded bg-indigo-500/10"><BookOpen size={18} className="text-indigo-300" /></div>
            <div>
              <div className="text-xs text-gray-400">Learn by Doing</div>
              <div className="text-sm text-white">Hands-on projects</div>
            </div>
          </div>

          <div className="bg-[#0f1116] p-3 rounded-xl border border-white/6 flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-400/10"><BadgeCheck size={18} className="text-cyan-300" /></div>
            <div>
              <div className="text-xs text-gray-400">End-to-end</div>
              <div className="text-sm text-white">Syllabus & projects</div>
            </div>
          </div>

          <div className="bg-[#0f1116] p-3 rounded-xl border border-white/6 flex items-center gap-3">
            <div className="p-2 rounded bg-violet-400/10"><Clock size={18} className="text-violet-300" /></div>
            <div>
              <div className="text-xs text-gray-400">Duration</div>
              <div className="text-sm text-white">{course.duration || "—"}</div>
            </div>
          </div>

          <div className="bg-[#0f1116] p-3 rounded-xl border border-white/6 flex items-center gap-3">
            <div className="p-2 rounded bg-amber-400/10"><DollarSign size={18} className="text-amber-300" /></div>
            <div>
              <div className="text-xs text-gray-400">Price</div>
              <div className="text-sm text-white">{course.price > 0 ? `₹${course.price}` : "Free"}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#07101a]/40 rounded-xl border border-white/6 p-1">
          <div className="flex gap-1 px-1">
            {TAB_KEYS.map((key) => {
              const label = key[0].toUpperCase() + key.slice(1);
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-black shadow" : "text-gray-300 hover:text-white"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {activeTab === "about" && renderAbout()}
          {activeTab === "instructors" && renderInstructors()}
          {activeTab === "syllabus" && renderSyllabus()}
          {activeTab === "reviews" && renderReviews()}
        </div>

        {/* Continue Button + Report */}
        <div className="flex items-center justify-between gap-4">
          <div />
          <div className="flex items-center gap-3">
            <button onClick={() => setShowReportModal(true)} className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              <Flag size={16} /> Report
            </button>

            {enrolled && (
              <button onClick={() => window.location.href = `/user/learn/${courseId}`} className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold">
                Continue Learning
              </button>
            )}
          </div>
        </div>

        {showReportModal && (
          <ReportModal courseId={courseId} onClose={() => setShowReportModal(false)} />
        )}

      </div>
    </motion.div>
  );
};

export default CourseDetails;
