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
    "AI",
    "Other",
  ];

  /* ---------------- Fetch Course ---------------- */
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
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Form Change Handler ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCourseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------- Save Changes ---------------- */
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch(`/course/${id}`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/courses");
    } catch (err) {
      console.error("Saving failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Loading Screen ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#1E293B] text-white flex flex-col items-center">

      {/* ---------------- Back Button ---------------- */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition self-start"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* ---------------- Icon Animation ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-5 rounded-full bg-white/10 backdrop-blur-xl border border-purple-500/20 shadow-lg"
        >
          <GraduationCap className="text-purple-400" size={48} />
        </motion.div>
      </motion.div>

      {/* ---------------- Main Card ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl
        border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r 
        from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Edit Course
        </h1>

        {/* ---------------- Inputs Grid ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <InputField
            label="Title"
            name="title"
            value={courseData.title}
            onChange={handleChange}
          />

          {/* Instructor */}
          <InputField
            label="Instructor"
            name="instructor"
            value={courseData.instructor}
            onChange={handleChange}
          />

          {/* Category */}
          <SelectField
            label="Category"
            name="category"
            value={courseData.category}
            options={categories}
            onChange={handleChange}
          />

          {/* Duration */}
          <InputField
            label="Duration"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
          />

          {/* Level */}
          <InputField
            label="Level"
            name="level"
            value={courseData.level}
            onChange={handleChange}
          />

          {/* Price */}
          <InputField
            label="Price (₹)"
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
          />

          {/* Image URL */}
          <InputField
            label="Thumbnail URL"
            name="imageUrl"
            value={courseData.imageUrl}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>

        {/* ---------------- Image Preview ---------------- */}
        {courseData.imageUrl && (
          <motion.img
            src={courseData.imageUrl}
            className="w-56 h-32 rounded-lg object-cover border border-white/20 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* ---------------- Publish Toggle ---------------- */}
        <div className="flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            name="isPublished"
            checked={courseData.isPublished}
            onChange={handleChange}
            className="w-5 h-5 accent-purple-500"
          />
          <span className="text-gray-200">Publish Course</span>
        </div>

        {/* ---------------- Save Button ---------------- */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,85,247,0.8)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 flex justify-center items-center gap-2 
          bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold shadow-lg"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </motion.div>
    </div>
  );
};

/* ---------------- Reusable Input ---------------- */
const InputField = ({ label, name, value, onChange, type = "text", className }) => (
  <div className={className}>
    <label className="block mb-1 text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 rounded-xl bg-[#0F172A] border border-white/10 
      focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 
      outline-none transition"
    />
  </div>
);

/* ---------------- Reusable Select ---------------- */
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-1 text-gray-300">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-xl bg-[#0F172A] border border-white/10 
      focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 
      outline-none transition"
    >
      <option value="">Select</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);
