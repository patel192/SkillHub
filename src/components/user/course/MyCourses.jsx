import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Flame, Play } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("my");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [myCourses, setMyCourses] = useState([]);
  const [discoverCourses, setDiscoverCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses();
    fetchDiscover();
  }, []);

  const fetchDiscover = async () => {
    try {
      const res = await axios.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscoverCourses(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`/enrollment/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = (res.data.data || []).map((e) => ({
        ...e.courseId,
        progress: e.progress,
      }));

      setMyCourses(mapped);
    } catch (err) {
      console.log(err);
    }
  };

  const activeCourses = activeTab === "my" ? myCourses : discoverCourses;

  // ------------------------------------------
  // Premium Glass UI Course Card
  // ------------------------------------------
  const CourseCard = ({ course, isMy }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
      className="
        bg-[#111827]/60 backdrop-blur-xl rounded-2xl 
        border border-white/10 p-5 
        shadow-xl hover:shadow-purple-900/30 
        hover:border-purple-500/40
        transition-all duration-300
      "
    >
      <div className="rounded-xl overflow-hidden mb-4 relative">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <h3 className="text-lg font-semibold text-white">{course.title}</h3>
      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
        {course.description}
      </p>

      {/* Progress Section */}
      {isMy && course.progress !== undefined && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-[#1e2230] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500"
            />
          </div>

          <p className="text-xs text-gray-500 mt-1 text-right">
            {course.progress}% completed
          </p>
        </div>
      )}

      <Link to={`/user/course/${course._id}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="
            mt-5 w-full py-2 rounded-xl
            bg-gradient-to-r from-purple-600 to-indigo-600
            text-white font-medium shadow-lg
            hover:shadow-purple-800/30
            flex items-center justify-center gap-2
            transition
          "
        >
          <Play size={18} /> {isMy ? "Continue" : "Start Learning"}
        </motion.button>
      </Link>
    </motion.div>
  );

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-12 text-white">

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold">
          {activeTab === "my" ? "My Courses" : "Discover New Courses"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Continue your journey or explore something new.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="relative flex bg-[#111827]/40 backdrop-blur-xl border border-white/10 rounded-full w-fit px-1 py-1 shadow-lg">
        <motion.div
          layout
          className="absolute top-1 bottom-1 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 rounded-full"
          animate={{
            left: activeTab === "my" ? "4px" : "50%",
            width: "calc(50% - 6px)"
          }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        />

        <button
          onClick={() => setActiveTab("my")}
          className={`relative z-10 px-6 py-2 flex items-center gap-2 text-sm font-semibold transition
            ${activeTab === "my" ? "text-white" : "text-gray-400 hover:text-purple-300"}
          `}
        >
          <BookOpen size={16} /> My Courses
        </button>

        <button
          onClick={() => setActiveTab("discover")}
          className={`relative z-10 px-6 py-2 flex items-center gap-2 text-sm font-semibold transition
            ${activeTab === "discover" ? "text-white" : "text-gray-400 hover:text-indigo-300"}
          `}
        >
          <Flame size={16} /> Discover
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {activeCourses.length > 0 ? (
          activeCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isMy={activeTab === "my"}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            No courses available.
          </p>
        )}
      </div>
    </div>
  );
};
