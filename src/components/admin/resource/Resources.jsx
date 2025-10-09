import React, { useState, useEffect } from "react";
import { BookOpen, Clock, User, Zap, Star, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Spinner } from "../../../utils/Spinner";

export const Resources = () => {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error fetching data: {error}
      </div>
    );
  }

  const CourseCard = ({ course }) => {
    const defaultImageUrl =
      "https://via.placeholder.com/400x200?text=Course+Image";

    return (
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(0,255,255,0.3)" }}
        className="bg-gray-900/40 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-transform duration-300"
      >
        {/* Image */}
        <div className="relative">
          <img
            src={course.imageUrl || defaultImageUrl}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-2 left-2 bg-indigo-500/80 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
            {course.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{course.description}</p>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-300 mb-4">
            <div className="flex items-center gap-1">
              <User size={14} className="text-cyan-400" /> {course.instructor}
            </div>
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-purple-400" /> {course.level}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" /> {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400" /> {course.rating?.toFixed(1)} (
              {course.enrollemntCount} enrolled)
            </div>
            <div className="flex items-center gap-1 font-semibold text-green-400">
              <DollarSign size={14} /> ${course.price?.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00FFFF" }}
              onClick={() => navigate(`/admin/resources/${course._id}`)}
              className="flex-1 py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
            >
              Lessons
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF00FF" }}
              onClick={() => navigate(`/admin/quiz/${course._id}`)}
              className="flex-1 py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
            >
              Quiz
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
        Select a Course
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};
