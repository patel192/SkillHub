import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BadgeCheck, Clock, DollarSign, BookOpen, User } from "lucide-react";
export const CourseDetails = () => {
  const { courseId } = useParams(); // Assuming your route is like /courses/:courseId
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/course/${courseId}`);
      console.log("Course Data:", res.data.data);
      setCourse(res.data.data);
    } catch (error) {
      console.error("Failed to fetch course", error);
    }
  };

  const handleEnroll = () => {
    setEnrolled(true);
    // You can add POST /enroll API here
  };

  if (!course) {
    return <div className="text-white p-6">Loading course...</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-5xl mx-auto text-white"
    >
      {/* Banner */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-6">
        <img
          src={
            course.imageUrl
          }
          alt={course.title}
          className="w-70 h-64 object-cover m-auto"
          
        />
      </div>

      {/* Title + Enroll */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-4xl font-bold">{course.title}</h2>
        <button
          onClick={handleEnroll}
          disabled={enrolled}
          className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
            enrolled
              ? "bg-green-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {enrolled ? "Enrolled" : "Enroll Now"}
        </button>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-gray-300 text-sm">
        <div className="flex items-center gap-2">
          <User size={18} /> <span>Instructor: {course.instructor}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen size={18} /> <span>Category: {course.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} /> <span>Duration: {course.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck size={18} /> <span>Level: {course.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={18} />{" "}
          <span>{course.price > 0 ? `₹${course.price}` : "Free"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            Status: {course.isPublished ? "Published" : "Unpublished"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-3">Course Overview</h3>
        <p className="text-gray-300 leading-relaxed">{course.description}</p>
      </div>
    </motion.div>
  );
};
