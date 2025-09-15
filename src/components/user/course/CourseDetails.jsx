import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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

export const CourseDetails = ({token}) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseOverview();
    checkIfEnrolled();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/course/${courseId}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      setCourse(res.data.data);
    } catch (error) {
      console.error("Failed to fetch course", error);
    }
  };

  const fetchCourseOverview = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/overview/${courseId}`,{
        headers:{Authorization:`Bearer ${token}`}
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
      const res = await axios.get(`http://localhost:8000/enrollment/${userId}`,{
        headers:{Authorization:`Bearer ${token}`}
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
      await axios.post("http://localhost:8000/enrollment",{
        headers:{Authorization:`Bearer ${token}`}
      }, {
        userId,
        courseId,
        status: "Registered",
        progress: 0,
      });
      setEnrolled(true);
      toast.success("Successfully enrolled in this course!");
    } catch (error) {
      console.error("Failed to enroll", error);
      toast.error("Enrollment failed. Please try again.");
    }
  };

  if (!course) {
    return (
      <div className="text-white p-6 text-center text-xl animate-pulse">
        Loading course...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-6 max-w-6xl mx-auto text-white"
    >
      {/* Hero Banner */}
      <div className="rounded-xl overflow-hidden shadow-2xl mb-8 border border-purple-600/40">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-100 h-100 rounded-lg m-auto"
        />
      </div>

      {/* Title + Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
            <Sparkles size={30} className="text-cyan-400" />
            {course.title}
          </h1>
          <p className="text-gray-300 max-w-2xl">{course.description}</p>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #06b6d4" }}
            onClick={handleEnroll}
            disabled={enrolled}
            className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 shadow-lg ${
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
            className="px-6 py-2 rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg"
          >
            <Flag size={18} className="inline-block mr-2" />
            Report
          </motion.button>
        </div>
      </div>

      {/* Metadata Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm mb-10">
        <CourseMeta icon={<User size={18} />} label="Instructor" value={course.instructor} />
        <CourseMeta icon={<BookOpen size={18} />} label="Category" value={course.category} />
        <CourseMeta icon={<Clock size={18} />} label="Duration" value={course.duration} />
        <CourseMeta icon={<BadgeCheck size={18} />} label="Level" value={course.level} />
        <CourseMeta
          icon={<DollarSign size={18} />}
          label="Price"
          value={course.price > 0 ? `₹${course.price}` : "Free"}
        />
        <CourseMeta
          icon={<BadgeCheck size={18} />}
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

      {/* Course Overview */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 border-b border-purple-600/50 pb-2">
          Course Overview
        </h3>
        {overview.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-300 leading-relaxed text-base space-y-2">
            {overview.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No overview available.</p>
        )}
      </div>

      {enrolled && (
        <div className="mt-10 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #06b6d4" }}
            onClick={() => {
              window.location.href = `/user/learn/${courseId}`;
            }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transition duration-300 flex items-center gap-3"
          >
            <Book size={20} /> Continue Learning
          </motion.button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal courseId={courseId} onClose={() => setShowReportModal(false)} />
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
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  </motion.div>
);
