import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Save,
  X,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    instructor: "",
    price: "",
  });

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

      setEditData({
        instructor: res.data.data.instructor,
        price: res.data.data.price,
      });
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

  const handleSave = async () => {
    try {
      const res = await axios.patch(`http://localhost:8000/course/${id}`, {
        instructor: editData.instructor,
        price: editData.price,
      });
      setCourse(res.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err.message);
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
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <p className="text-red-400">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-gray-900 p-6 rounded-xl shadow-md">
        <div className="flex gap-6">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-40 h-40 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>

            {isEditing ? (
              <input
                type="text"
                value={editData.instructor}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, instructor: e.target.value }))
                }
                className="bg-gray-700 p-2 rounded w-full mb-2"
              />
            ) : (
              <p className="text-gray-400 mb-2">By {course.instructor}</p>
            )}

            {isEditing ? (
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="bg-gray-700 p-2 rounded w-full mb-2"
              />
            ) : (
              <p className="text-xl font-semibold mb-4">₹{course.price}</p>
            )}

            <span
              className={`px-4 py-1 rounded-full text-sm ${
                course.isPublished ? "bg-green-600" : "bg-yellow-600"
              }`}
            >
              {course.isPublished ? "Published" : "Unpublished"}
            </span>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-8">
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
              className="flex items-center gap-1 bg-purple-600 px-3 py-2 rounded hover:bg-purple-700"
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

        {/* Edit / Save buttons */}
        <div className="flex gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              <Pencil size={18} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
