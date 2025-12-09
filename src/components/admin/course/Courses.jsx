import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, CheckCircle, XCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.message);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Course delete failed:", err.message);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await axios.patch(
        `/courses/${id}`,
        { isPublished: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isPublished: !currentStatus } : c
        )
      );
    } catch (err) {
      console.error("Publish toggle failed:", err.message);
    }
  };

  return (
    <div
      className="p-8 min-h-screen 
      bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#1E293B]
      text-white"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h2
          className="text-4xl font-extrabold tracking-tight 
          bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 
          bg-clip-text text-transparent"
        >
          Manage Courses
        </h2>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,85,247,0.7)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
          bg-gradient-to-r from-purple-600 to-pink-600 
          font-semibold shadow-lg"
          onClick={() => navigate("/admin/courses/new")}
        >
          <Plus size={18} />
          Add Course
        </motion.button>
      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No courses available.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 35px rgba(168,85,247,0.6)",
              }}
              className="
              bg-white/10 backdrop-blur-xl rounded-2xl 
              border border-white/10 shadow-xl overflow-hidden
              flex flex-col cursor-pointer transition"
              onClick={() => navigate(`/admin/courses/${course._id}`)}
            >
              {/* IMAGE */}
              <div className="w-full h-44 overflow-hidden">
                <img
                  src={course.imageUrl || "https://via.placeholder.com/400x200"}
                  alt="Course"
                  className="w-full h-full object-cover 
                  hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-xl font-bold text-white line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {course.description}
                </p>

                {/* STATUS + PRICE */}
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold shadow-md transition 
                    ${
                      course.isPublished
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Unpublished"}
                  </span>

                  <span className="font-bold text-purple-300 text-lg">
                    ₹{course.price}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 pt-2 mt-auto">
                  {/* Publish / Unpublish */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePublish(course._id, course.isPublished);
                    }}
                    whileHover={{ scale: 1.08 }}
                    className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 font-medium text-white
                    ${
                      course.isPublished
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {course.isPublished ? (
                      <XCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </motion.button>

                  {/* Edit */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/courses/edit/${course._id}`);
                    }}
                    whileHover={{ scale: 1.08 }}
                    className="flex-1 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                    flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <Pencil size={16} /> Edit
                  </motion.button>

                  {/* Delete */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course._id);
                    }}
                    whileHover={{ scale: 1.08 }}
                    className="flex-1 p-2 rounded-lg bg-red-600 hover:bg-red-700 
                    flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <Trash size={16} /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
