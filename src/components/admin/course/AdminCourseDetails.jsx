import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, PlusCircle, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPoint, setNewPoint] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleAddPoint = async () => {
    if (!newPoint.trim()) return;
    try {
      const res = await axios.patch(`http://localhost:8000/overview/${id}`, {
        point: newPoint,
      });
      setOverview(res.data.data.overview);
      setNewPoint("");
    } catch (err) {
      console.error("Failed to add overview point:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-purple-300">
        <Loader2 className="animate-spin mr-2" />
        Loading course overview...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-white">
        <p className="text-red-400">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      {/* Header with More Options */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
          {course.title}
        </h1>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(168,85,247,0.6)" }}
            className="p-2 bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg text-purple-200 hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <MoreHorizontal size={20} />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl shadow-xl overflow-hidden border border-purple-700/40 z-10"
              >
                <button
                  onClick={() => navigate(`/courses/edit/${id}`)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-800/40 transition"
                >
                  ✨ Edit Course Info
                </button>
                <button
                  onClick={() => navigate(`/admin/courses/${id}/lessons`)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-800/40 transition"
                >
                  🎬 Manage Lessons
                </button>
                <button
                  onClick={() => navigate(`/admin/courses/${id}/quiz`)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-800/40 transition"
                >
                  🧩 Manage Quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-800 p-6 rounded-2xl shadow-lg border border-purple-800/30">
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
          <span className="animate-pulse text-purple-400">📖</span> Course Overview
        </h2>

        {/* Input for adding new points */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Add new point..."
            value={newPoint}
            onChange={(e) => setNewPoint(e.target.value)}
            className="flex-1 bg-gray-800/70 p-3 rounded-lg border border-purple-700/40 focus:ring-2 focus:ring-purple-500 outline-none text-purple-200"
          />
          <motion.button
            onClick={handleAddPoint}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147,51,234,0.7)" }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-2 rounded-lg text-white font-medium"
          >
            <PlusCircle size={18} /> Add
          </motion.button>
        </div>

        {overview.length > 0 ? (
          <ul className="space-y-4">
            {overview.map((point, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-start gap-3"
              >
                <motion.div
                  className="w-3 h-3 mt-2 rounded-full bg-purple-500 shadow-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                ></motion.div>
                <span className="text-gray-300">{point}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No overview available for this course.</p>
        )}
      </div>
    </div>
  );
};
