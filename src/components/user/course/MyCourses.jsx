import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, BookOpen, Flame } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("my");
  const token = localStorage.getItem("token")
  const [myCourses, setMyCourses] = useState([]);
  const [discoverCourses, setDiscoverCourses] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDiscoverCourses();
    fetchMyCourses();
  }, []);

  const fetchDiscoverCourses = async () => {
    try {
      const res = await axios.get(`/courses`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      setDiscoverCourses(res.data.data || []);
    } catch (error) {
      console.error("Error fetching discoverable courses:", error.message);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`/enrollment/${userId}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      const enrollments = res.data.data || [];

      const mapped = enrollments.map((enrollment) => ({
        ...enrollment.courseId,
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-6 text-white">
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
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px #8B5CF6" }}
          onClick={() => setActiveTab("my")}
          className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            activeTab === "my"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg text-white"
              : "bg-[#1b1b2a]/80 border border-purple-600/40 hover:bg-purple-600/40"
          }`}
        >
          <BookOpen className="inline-block mr-2 text-purple-400" size={18} />
          My Courses
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px #F43F5E" }}
          onClick={() => setActiveTab("discover")}
          className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            activeTab === "discover"
              ? "bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg text-white"
              : "bg-[#1b1b2a]/80 border border-pink-600/40 hover:bg-pink-600/40"
          }`}
        >
          <Flame className="inline-block mr-2 text-pink-400" size={18} />
          Discover Courses
        </motion.button>
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
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 20px #00FFFF",
              }}
              className="bg-[#1b1b2a]/80 backdrop-blur-lg border border-purple-600/50 rounded-xl overflow-hidden p-5"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-24 h-24 object-cover mx-auto rounded-lg mb-4 shadow-md"
              />

              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                {course.title}
              </h3>
              <p className="text-sm text-gray-300 mb-4 text-center">
                {course.description}
              </p>

              {activeTab === "my" && course.progress != null && (
                <div className="mb-4">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.6 }}
                      className="bg-cyan-500 h-2.5 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-300">
                    {course.progress}% completed
                  </p>
                </div>
              )}

              <Link to={`/user/course/${course._id}`}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px #06b6d4" }}
                  className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300"
                >
                  <PlayCircle size={18} className="text-cyan-300" />
                  {activeTab === "my" ? "Continue" : "Start Learning"}
                </motion.button>
              </Link>
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
