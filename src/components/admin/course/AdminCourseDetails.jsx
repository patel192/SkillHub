import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
export const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
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

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {course.description || "No description available."}
          </p>
        </div>

        {/* Future sections like lessons, reviews, enrolled users */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Lessons</h2>
          <ul className="list-disc ml-6 text-gray-300">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, idx) => (
                <li key={idx}>{lesson.title}</li>
              ))
            ) : (
              <li>No lessons available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
