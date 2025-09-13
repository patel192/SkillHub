import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, PlusCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPoint, setNewPoint] = useState(""); // input for overview point

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
      <div className="flex justify-center items-center h-screen text-white">
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
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <div className="relative group">
          <button className="p-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
            <MoreHorizontal size={18} /> More
          </button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-gray-900 rounded shadow-lg flex flex-col z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              onClick={() => navigate(`/courses/edit/${id}`)}
              className="px-4 py-2 text-left hover:bg-gray-800 transition"
            >
              Edit Course Info
            </button>
            <button
              onClick={() => navigate(`/admin/courses/${id}/lessons`)}
              className="px-4 py-2 text-left hover:bg-gray-800 transition"
            >
              Manage Lessons
            </button>
            <button
              onClick={() => navigate(`/admin/courses/${id}/quiz`)}
              className="px-4 py-2 text-left hover:bg-gray-800 transition"
            >
              Manage Quiz
            </button>
          </motion.div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">📖 Course Overview</h2>

        {/* Input for adding new points */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add new point..."
            value={newPoint}
            onChange={(e) => setNewPoint(e.target.value)}
            className="flex-1 bg-gray-700 p-2 rounded"
          />
          <button
            onClick={handleAddPoint}
            className="flex items-center gap-1 bg-purple-600 px-3 py-2 rounded hover:bg-purple-700 transition"
          >
            <PlusCircle size={18} /> Add
          </button>
        </div>

        {overview.length > 0 ? (
          <ul className="space-y-3">
            {overview.map((point, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-3 h-3 mt-2 rounded-full bg-purple-500 shrink-0"></div>
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
