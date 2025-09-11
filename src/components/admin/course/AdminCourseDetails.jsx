import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
export const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <div className="bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex gap-6">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-40 h-40 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-400 mb-2">By {course.instructor}</p>
            <p className="text-xl font-semibold mb-4">₹{course.price}</p>
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
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📖 Course Overview</h2>
          {overview.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              {overview.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No overview available for this course.</p>
          )}
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {course.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};
