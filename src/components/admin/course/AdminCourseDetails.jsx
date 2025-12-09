import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "../../../utils/Spinner";

export const AdminCourseDetails = () => {
  const token = localStorage.getItem("token");
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
      const res = await axios.get(`/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data.data);
    } catch (err) {
      console.error("Failed to fetch course:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await axios.get(`/overview/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOverview(res.data.data?.overview || []);
    } catch (err) {
      console.error("Failed to fetch overview:", err.message);
    }
  };

  const handleAddPoint = async () => {
    if (!newPoint.trim()) return;

    try {
      const res = await axios.patch(
        `/overview/${id}`,
        { point: newPoint },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOverview(res.data.data.overview);
      setNewPoint("");
    } catch (err) {
      console.error("Failed to add overview point:", err.message);
    }
  };

  // -------------------- Loading States --------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-purple-300">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  // ==========================================================
  // FULL COMPONENT UI
  // ==========================================================
  return (
    <div className="p-6 text-white max-w-4xl mx-auto">

      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          {course.title}
        </h1>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.07 }}
            className="p-2 bg-purple-900/50 rounded-lg text-purple-200 hover:text-white"
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
                className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-gray-900 to-purple-900 border border-purple-700/40 rounded-xl shadow-xl overflow-hidden z-20"
              >
                <button
                  onClick={() => navigate(`/admin/courses/edit/${id}`)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-800/40 transition"
                >
                  ✨ Edit Course Info
                </button>

                <button
                  onClick={() => navigate(`/admin/resources/${id}`)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-800/40 transition"
                >
                  🎬 Manage Lessons
                </button>

                <button
                  onClick={() => navigate(`/admin/quiz/${id}`)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-800/40 transition"
                >
                  🧩 Manage Quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ==========================================================
          3D FLOATING NODES — OVERVIEW SECTION
      ========================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          🌌 Course Overview — 3D Mode
        </h2>

        {/* -------- Add point input -------- */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newPoint}
            placeholder="Add new learning outcome..."
            onChange={(e) => setNewPoint(e.target.value)}
            className="flex-1 bg-black/30 border border-purple-600/40 p-3 rounded-lg text-purple-200 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <motion.button
            onClick={handleAddPoint}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-2 rounded-lg text-white"
          >
            <PlusCircle size={18} /> Add
          </motion.button>
        </div>

        {/* -------- Floating nodes list -------- */}
        {overview.length > 0 ? (
          <div className="flex flex-col gap-6">
            {overview.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  rotateX: 6,
                  rotateY: -6,
                  boxShadow:
                    "0 15px 40px rgba(168,85,247,0.35), 0 0 20px rgba(147,51,234,0.5)",
                }}
                className="flex items-start gap-5 bg-white/5 p-5 rounded-xl border border-white/10 shadow-xl relative"
                style={{ transformStyle: "preserve-3d", perspective: 900 }}
              >
                {/* Floating neon node */}
                <motion.div
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-400 shadow-[0_0_25px_rgba(168,85,247,0.9)]"
                  animate={{
                    y: [0, -6, 0],
                    boxShadow: [
                      "0 0 20px rgba(168,85,247,0.8)",
                      "0 0 30px rgba(236,72,153,0.9)",
                      "0 0 20px rgba(168,85,247,0.8)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transform: "translateZ(35px)" }}
                />

                {/* Text */}
                <motion.p
                  className="text-gray-200 leading-relaxed"
                  style={{ transform: "translateZ(45px)" }}
                >
                  {point}
                </motion.p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No overview available for this course.</p>
        )}
      </motion.div>
    </div>
  );
};
