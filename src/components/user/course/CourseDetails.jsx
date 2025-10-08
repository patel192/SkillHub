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
  Book,
  Flag,
} from "lucide-react";
import { ReportModal } from "../report/ReportModal";

export const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseOverview();
    checkIfEnrolled();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data.data);
    } catch (error) {
      console.error("Failed to fetch course", error);
    }
  };

  const fetchCourseOverview = async () => {
    try {
      const res = await axios.get(`/overview/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data.data?.overview || [];
      if (typeof data === "string") {
        data = data.split("\n").filter(Boolean);
      }
      setOverview(data);
    } catch (error) {
      console.error("Failed to fetch course overview", error);
    }
  };

  const checkIfEnrolled = async () => {
    try {
      const res = await axios.get(`/enrollment/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrollments = res.data.data || [];
      const isAlreadyEnrolled = enrollments.some(
        (enroll) =>
          String(enroll.courseId?._id || enroll.courseId) === String(courseId)
      );
      setEnrolled(isAlreadyEnrolled);
    } catch (error) {
      console.error("Failed to check enrollment", error);
    }
  };

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

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-4 sm:p-6 md:p-8 text-white max-w-5xl mx-auto"
    >
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl mb-6 border border-purple-600/40">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-52 sm:h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles size={22} className="text-cyan-400" />
            {course.title}
          </h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-6">
        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-xl">
          {course.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #06b6d4" }}
            onClick={handleEnroll}
            disabled={enrolled}
            className={`px-4 sm:px-6 py-2 rounded-full text-white font-semibold transition duration-300 shadow-lg w-full sm:w-auto ${
              enrolled
                ? "bg-green-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            }`}
          >
            {enrolled ? "Enrolled" : "Enroll Now"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #f43f5e" }}
            onClick={() => setShowReportModal(true)}
            className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Flag size={16} />
            Report
          </motion.button>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <CourseMeta
          icon={<User size={16} />}
          label="Instructor"
          value={course.instructor}
        />
        <CourseMeta
          icon={<BookOpen size={16} />}
          label="Category"
          value={course.category}
        />
        <CourseMeta
          icon={<Clock size={16} />}
          label="Duration"
          value={course.duration}
        />
        <CourseMeta
          icon={<BadgeCheck size={16} />}
          label="Level"
          value={course.level}
        />
        <CourseMeta
          icon={<DollarSign size={16} />}
          label="Price"
          value={course.price > 0 ? `₹${course.price}` : "Free"}
        />
        <CourseMeta
          icon={<BadgeCheck size={16} />}
          label="Status"
          value={
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                course.isPublished ? "bg-green-600" : "bg-yellow-500 text-black"
              }`}
            >
              {course.isPublished ? "Published" : "Unpublished"}
            </span>
          }
        />
      </div>

      {/* Overview */}
      <div className="mb-6 bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-purple-600/40 shadow-md">
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 border-b border-purple-600/50 pb-1">
          Course Overview
        </h3>
        {overview.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-300 text-sm sm:text-base leading-relaxed space-y-2">
            {overview.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic text-sm sm:text-base">
            No overview available.
          </p>
        )}
      </div>

      {/* Continue Learning Button */}
      {enrolled && (
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => (window.location.href = `/user/learn/${courseId}`)}
            className="relative overflow-hidden px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg group"
          >
            {/* Animated background gradient */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></span>

            <span className="relative z-10">Continue Learning</span>
          </motion.button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          courseId={courseId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </motion.div>
  );
};

const CourseMeta = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02, boxShadow: "0 0 15px #8B5CF6" }}
    className="flex items-center gap-3 bg-[#1b1b2a]/80 backdrop-blur-lg border border-purple-600/40 p-4 rounded-xl shadow-md"
  >
    <div className="text-cyan-400">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
      <p className="font-medium text-white text-sm sm:text-base">{value}</p>
    </div>
  </motion.div>
);
