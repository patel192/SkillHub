import React, { useState, useEffect } from 'react';
import { BookOpen, Star, DollarSign, Clock, User, Zap, Hash } from 'lucide-react';

export const Resources = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/courses");
        const data = await response.data.data
        setCourses(data);
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
      <div className="p-6 text-center text-gray-400">
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error fetching data: {error}. Please ensure your server is running.
      </div>
    );
  }

  // A helper component to render a single course card
  const CourseCard = ({ course }) => {
    const defaultImageUrl = 'https://via.placeholder.com/400x200?text=Course+Image';
    return (
      <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col">
        <img src={course.imageUrl || defaultImageUrl} alt={course.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold line-clamp-2">{course.title}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              course.isPublished ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">{course.description}</p>
          
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User size={16} className="text-gray-400" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <BookOpen size={16} className="text-blue-400" />
              <span>{course.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Zap size={16} className="text-purple-400" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock size={16} className="text-gray-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Star size={16} className="text-yellow-400" />
              <span>{course.rating.toFixed(1)} ({course.enrollemntCount} enrolled)</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-green-500" />
                <span className="text-lg font-bold text-green-400">${course.price.toFixed(2)}</span>
              </div>
            </div>
            {course.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {course.tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Hash size={10} /> {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
   <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};
