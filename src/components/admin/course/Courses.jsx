import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, CheckCircle, XCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
      console.error("Delete failed:", err.message);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await axios.patch(
        `/courses/${id}`,
        {
          isPublished: !currentStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isPublished: !currentStatus } : c
        )
      );
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-900">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Manage Courses
        </h2>
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 20px rgba(168,85,247,0.7)",
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 rounded-xl shadow-lg text-white font-semibold"
          onClick={() => navigate("/admin/courses/new")}
        >
          <Plus size={18} />
          Add Course
        </motion.button>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 120,
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 0px 30px rgba(168,85,247,0.6)",
              }}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-purple-800/50 shadow-lg cursor-pointer"
              onClick={() => navigate(`/admin/courses/${course._id}`)}
            >
              <img
                src={course.imageUrl || "https://via.placeholder.com/400x200"}
                alt={course.title}
                className="w-full h-48"
              />
              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-white line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 250 }}
                    className={`px-3 py-1 text-xs rounded-full font-semibold shadow-md ${
                      course.isPublished
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-yellow-400 to-amber-600"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Unpublished"}
                  </motion.span>
                  <span className="font-bold text-purple-400 text-lg drop-shadow-md">
                    ₹{course.price}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePublish(course._id, course.isPublished);
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0px 0px 15px rgba(250, 204, 21, 0.8)",
                    }}
                    className={`flex-1 p-2 rounded-lg text-white font-medium flex justify-center items-center gap-2 ${
                      course.isPublished
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {course.isPublished ? (
                      <XCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/courses/edit/${course._id}`);
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0px 0px 15px rgba(99, 102, 241, 0.8)",
                    }}
                    className="flex-1 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex justify-center items-center gap-2"
                  >
                    <Pencil size={16} /> Edit
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course._id);
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0px 0px 15px rgba(239, 68, 68, 0.8)",
                    }}
                    className="flex-1 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex justify-center items-center gap-2"
                  >
                    <Trash size={16} /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
