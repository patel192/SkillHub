import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, CheckCircle, XCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.message);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:8000/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/courses/${id}`, {
        isPublished: !currentStatus,
      });
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isPublished: !currentStatus } : c))
      );
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Courses</h2>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(72, 187, 120, 0.7)" }}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-md shadow-md text-white font-semibold"
          onClick={() => navigate("/courses/new")}
        >
          <Plus size={16} />
          Add Course
        </motion.button>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(99, 102, 241, 0.5)" }}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-gray-700"
              onClick={() => navigate(`/admin/courses/${course._id}`)}
            >
              <img
                src={course.imageUrl || "https://via.placeholder.com/400x200"}
                alt={course.title}
                className="w-full h-48"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-bold text-white line-clamp-2">{course.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`px-2 py-1 text-sm rounded-full font-semibold ${
                      course.isPublished
                        ? "bg-gradient-to-r from-green-500 to-green-700"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-700"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Unpublished"}
                  </motion.span>
                  <span className="font-bold text-green-400">₹{course.price}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePublish(course._id, course.isPublished);
                    }}
                    whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 223, 0, 0.7)" }}
                    className={`flex-1 p-2 rounded-md text-white font-semibold flex justify-center items-center gap-1 transition-transform transform ${
                      course.isPublished ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {course.isPublished ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/edit/${course._id}`);
                    }}
                    whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(59, 130, 246, 0.7)" }}
                    className="flex-1 p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold flex justify-center items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course._id);
                    }}
                    whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(220, 38, 38, 0.7)" }}
                    className="flex-1 p-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold flex justify-center items-center gap-1"
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
