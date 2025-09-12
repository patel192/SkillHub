import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  User,
  Zap,
  Star,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Resources = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/courses");
        const result = await response.json();
        setCourses(result.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">Loading courses...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error fetching data: {error}
      </div>
    );
  }

  // Course Card
  const CourseCard = ({ course }) => {
    const defaultImageUrl =
      "https://via.placeholder.com/400x200?text=Course+Image";
    return (
      <div
        className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden 
        transition-all duration-300 transform hover:scale-105 hover:shadow-2xl 
        hover:shadow-blue-500/30 flex flex-col"
      >
        <img
          src={course.imageUrl || defaultImageUrl}
          alt={course.title}
          className="w-full h-48"
        />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {course.description}
          </p>
          <div className="mt-auto space-y-1 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              {course.instructor}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-400" />
              {course.category}
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-purple-400" />
              {course.level}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              {course.duration}
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              {course.rating.toFixed(1)} ({course.enrollemntCount} enrolled)
            </div>
            <div className="flex items-center gap-2 font-bold text-green-400">
              <DollarSign size={16} />
              ${course.price.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate(`/admin/resources/${course._id}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 
              hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 
              text-white py-2 px-4 rounded-lg text-sm font-medium 
              transition transform duration-200"
            >
              Lessons
            </button>
            <button
              onClick={() => navigate(`/admin/quiz/${course._id}`)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 
              hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 
              text-white py-2 px-4 rounded-lg text-sm font-medium 
              transition transform duration-200"
            >
              Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Select a Course</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};
