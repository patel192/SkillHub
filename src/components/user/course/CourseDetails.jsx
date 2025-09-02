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
} from "lucide-react";

export const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [enrolled, setEnrolled] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseOverview();
    checkIfEnrolled();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/course/${courseId}`);
      setCourse(res.data.data);
    } catch (error) {
      console.error("Failed to fetch course", error);
    }
  };

  const fetchCourseOverview = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/overview/${courseId}`);
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
      const res = await axios.get(`http://localhost:8000/enrollment/${userId}`);
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
      await axios.post("http://localhost:8000/enrollment", {
        userId,
        courseId,
        status: "Registered",
        progress: 0,
      });
      setEnrolled(true);
      toast.success("🎉 Successfully enrolled in this course!");
    } catch (error) {
      console.error("Failed to enroll", error);
      toast.error("❌ Enrollment failed. Please try again.");
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
      className="p-6 max-w-6xl mx-auto text-white"
    >
      {/* Hero Banner */}
      <div className="w-100 h-100 rounded-xl overflow-hidden shadow-xl mb-6 m-auto">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Title + Enroll */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Sparkles size={28} className="text-indigo-400" />
            {course.title}
          </h1>
          <p className="text-gray-400 max-w-2xl">{course.description}</p>
        </div>
        <button
          onClick={handleEnroll}
          disabled={enrolled}
          className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 shadow-lg ${
            enrolled
              ? "bg-green-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
          }`}
        >
          {enrolled ? "🎓 Enrolled" : "🚀 Enroll Now"}
        </button>
      </div>

      {/* Metadata Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-8">
        <CourseMeta icon={<User size={18} />} label="Instructor" value={course.instructor} />
        <CourseMeta icon={<BookOpen size={18} />} label="Category" value={course.category} />
        <CourseMeta icon={<Clock size={18} />} label="Duration" value={course.duration} />
        <CourseMeta icon={<BadgeCheck size={18} />} label="Level" value={course.level} />
        <CourseMeta icon={<DollarSign size={18} />} label="Price" value={course.price > 0 ? `₹${course.price}` : "Free"} />
        <CourseMeta
          icon={<BadgeCheck size={18} />}
          label="Status"
          value={
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                course.isPublished ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              {course.isPublished ? "Published" : "Unpublished"}
            </span>
          }
        />
      </div>

      {/* Course Overview */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
          📘 Course Overview
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
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              window.location.href = `/user/learn/${courseId}`;
            }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white font-semibold rounded-full shadow-lg transition duration-300"
          >
            <div className="flex gap-3">
              <Book size={20} /> Continue Learning
            </div>
          </button>
        </div>
      )}
    </motion.div>
  );
};

const CourseMeta = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-[#1f2937] p-4 rounded-lg shadow">
    <div className="text-indigo-400">{icon}</div>
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  </div>
);
