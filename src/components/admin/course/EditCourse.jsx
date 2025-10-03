import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Spinner } from "../../../utils/Spinner";
export const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [courseData, setCourseData] = useState({
    title: "",
    instructor: "",
    category: "",
    price: "",
    duration: "",
    level: "",
    imageUrl: "",
    isPublished: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    "Web Development",
    "Data Science",
    "Design",
    "Marketing",
    "Other",
    "AI",
  ];

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch course:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch(`/course/${id}`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/courses");
    } catch (err) {
      console.error("Save failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 p-6 text-white flex flex-col items-center">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition self-start"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0px 0px 10px rgba(168,85,247,0.7)",
                "0px 0px 20px rgba(168,85,247,0.9)",
                "0px 0px 10px rgba(168,85,247,0.7)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 rounded-full bg-purple-700/20"
          >
            <GraduationCap size={48} className="text-purple-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400 drop-shadow">
          Edit Course
        </h1>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition shadow-inner"
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block mb-1 text-gray-300">Instructor</label>
            <input
              type="text"
              name="instructor"
              value={courseData.instructor}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-gray-300">Category</label>
            <select
              name="category"
              value={courseData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition"
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1 text-gray-300">Duration</label>
            <input
              type="text"
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block mb-1 text-gray-300">Level</label>
            <input
              type="text"
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-gray-300">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 text-gray-300">Thumbnail URL</label>
            <input
              type="text"
              name="imageUrl"
              value={courseData.imageUrl}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Preview */}
          {courseData.imageUrl && (
            <motion.img
              src={courseData.imageUrl}
              alt="Preview"
              className="w-48 h-28 rounded-lg border border-gray-700 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Publish toggle */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="isPublished"
              checked={courseData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 accent-purple-600"
            />
            <span>Publish Course</span>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(168,85,247,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl transition shadow-lg font-semibold"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
