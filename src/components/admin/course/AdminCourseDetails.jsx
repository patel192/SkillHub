import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User, IndianRupee, BookOpen } from "lucide-react";

export const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
    fetchOverview();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/course/${id}`);
      setCourse(res.data.data);
    } catch (err) {
      console.error("Failed to fetch course:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/overview/${id}`);
      setOverview(res.data.data?.overview || []);
    } catch (err) {
      console.error("Failed to fetch overview:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="animate-spin mr-2" />
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <p className="text-red-400">Course not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 text-white min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Course Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col items-center"
        >
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-48 h-48  rounded-xl shadow-lg mb-4"
          />
          <h1 className="text-2xl font-bold text-center">{course.title}</h1>
          <p className="flex items-center gap-2 text-gray-400 mt-2">
            <User size={16} /> {course.instructor}
          </p>
          <p className="flex items-center gap-2 text-green-400 font-semibold mt-2">
            <IndianRupee size={16} /> {course.price}
          </p>
          <span
            className={`mt-4 px-4 py-1 rounded-full text-sm font-medium ${
              course.isPublished
                ? "bg-green-600/80 text-white"
                : "bg-yellow-600/80 text-black"
            }`}
          >
            {course.isPublished ? "Published" : "Unpublished"}
          </span>
        </motion.div>

        {/* Right: Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Animated Overview Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-violet-400" /> Course Overview
            </h2>
            {overview.length > 0 ? (
              <div className="relative border-l border-violet-600/50 pl-6 space-y-6">
                {overview.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group pl-8" // <-- shifted text right
                  >
                    {/* Gradient dot with hover glow */}
                    <span
                      className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-lg 
                         transition-transform transform group-hover:scale-125 group-hover:shadow-violet-500/80"
                    ></span>

                    {/* Overview text */}
                    <p className="text-gray-300 transition-colors group-hover:text-violet-300">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No overview available for this course.
              </p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">📝 Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {course.description || "No description available."}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
