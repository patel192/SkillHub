import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, BookOpen, Flame } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("my");
  const [myCourses, setMyCourses] = useState([]);
  const [discoverCourses, setDiscoverCourses] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDiscoverCourses();
    fetchMyCourses();
  }, []);

  const fetchDiscoverCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/courses`);
      setDiscoverCourses(res.data.data || []);
    } catch (error) {
      console.error("Error fetching discoverable courses:", error.message);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/enrollment/${userId}`);
      const enrollments = res.data.data || [];

      // Use populated courseId directly
      const mapped = enrollments.map((enrollment) => ({
        ...enrollment.courseId, // course details
        progress: enrollment.progress,
        status: enrollment.status,
      }));

      setMyCourses(mapped);
    } catch (error) {
      console.error("Error fetching my courses:", error.message);
    }
  };

  const activeCourses = activeTab === "my" ? myCourses : discoverCourses;

  return (
    <div className="p-6 text-white">
      <motion.h2
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        {activeTab === "my" ? "My Courses" : "Discover Courses"}
      </motion.h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("my")}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            activeTab === "my"
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <BookOpen className="inline-block mr-2" size={18} />
          My Courses
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            activeTab === "discover"
              ? "bg-gradient-to-r from-pink-500 to-rose-600 shadow-md"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <Flame className="inline-block mr-2" size={18} />
          Discover Courses
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCourses.length > 0 ? (
          activeCourses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-20 h-20 object-cover m-auto"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {course.description}
                </p>

                {activeTab === "my" && course.progress != null && (
                  <div className="mb-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-300">
                      {course.progress}% completed
                    </p>
                  </div>
                )}

                <Link to={`/user/course/${course._id}`}>
                  <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300">
                    <PlayCircle size={18} />
                    {activeTab === "my" ? "Continue" : "Start Learning"}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            No courses found.
          </p>
        )}
      </div>
    </div>
  );
};
