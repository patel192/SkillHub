import React, { useState } from "react";
import { motion } from "framer-motion";

export const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "Other",
    imageUrl: "",
    price: 0,
    duration: "",
    level: "Beginner",
    language: "English",
    tags: "",
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("Course added:", result);
      alert("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">
        Add New Course
      </h1>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-900 p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
            required
          />
        </motion.div>

        {/* Description */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
            required
          />
        </motion.div>

        {/* Instructor */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Instructor</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
            required
          />
        </motion.div>

        {/* Category */}
        <motion.div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:ring focus:ring-cyan-400 outline-none"
          >
            <option>Web Development</option>
            <option>Data Science</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>AI</option>
            <option>Other</option>
          </select>
        </motion.div>

        {/* Duration */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Duration</label>
          <input
            type="text"
            name="duration"
            placeholder="e.g., 10 hours"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
            required
          />
        </motion.div>

        {/* Level */}
        <motion.div>
          <label className="block text-sm font-medium">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:ring focus:ring-cyan-400 outline-none"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </motion.div>

        {/* Language */}
        <motion.div>
          <label className="block text-sm font-medium">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:ring focus:ring-cyan-400 outline-none"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Other</option>
          </select>
        </motion.div>

        {/* Tags */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., React, MongoDB"
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
          />
        </motion.div>

        {/* Image URL */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
          />
        </motion.div>

        {/* Price */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block text-sm font-medium">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-400 outline-none"
          />
        </motion.div>

        {/* Is Published */}
        <motion.div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="h-4 w-4 text-purple-500"
            />
            <span className="text-sm">Publish Course</span>
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 py-2 px-4 rounded-lg font-medium shadow-lg shadow-purple-500/30 transition"
        >
          Add Course
        </motion.button>
      </motion.form>
    </div>
  );
};
