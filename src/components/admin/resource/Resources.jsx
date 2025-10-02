import React, { useState, useEffect } from "react";
import { BookOpen, Clock, User, Zap, Star, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export const Resources = () => {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.data); // assuming backend returns { data: [...] }
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
      <div className="p-6 text-center text-gray-400">Loading courses...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error fetching data: {error}
      </div>
    );
  }

  // Course Card
  const CourseCard = ({ course }) => {
    const defaultImageUrl =
      "https://via.placeholder.com/400x200?text=Course+Image";
    return (
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FFFF" }}
        className="bg-[#1b1b2a]/80 backdrop-blur-lg rounded-xl overflow-hidden border border-purple-600/50 flex flex-col transition transform duration-300"
      >
        <img
          src={course.imageUrl || defaultImageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">
            {course.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {course.description}
          </p>

          <div className="mt-auto space-y-1 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <User size={16} className="text-cyan-400" />
              {course.instructor}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-400" />
              {course.category}
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-purple-400" />
              {course.level}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              {course.duration}
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              {course.rating?.toFixed(1)} ({course.enrollemntCount} enrolled)
            </div>
            <div className="flex items-center gap-2 font-bold text-green-400">
              <DollarSign size={16} />${course.price?.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00FFFF" }}
              onClick={() => navigate(`/admin/resources/${course._id}`)}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition transform"
            >
              Lessons
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF00FF" }}
              onClick={() => navigate(`/admin/quiz/${course._id}`)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition transform"
            >
              Quiz
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Select a Course</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};
