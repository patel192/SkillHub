import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, BookOpen, Flame } from "lucide-react";
const myCourses = [
  {
    id: 1,
    title: "Modern JavaScript Bootcamp",
    description: "Master ES6+ features, DOM manipulation & more.",
    progress: 65,
    image: "https://source.unsplash.com/featured/?javascript",
  },
  {
    id: 2,
    title: "React for Beginners",
    description: "Build responsive SPAs using React.",
    progress: 40,
    image: "https://source.unsplash.com/featured/?reactjs",
  },
];
const discoverCourses = [
  {
    id: 1,
    title: "CSS Animations Masterclass",
    description: "Create engaging UI with CSS and animations.",
    image: "https://source.unsplash.com/featured/?css",
  },
  {
    id: 2,
    title: "Node.js API Development",
    description: "Learn RESTful APIs with Express & MongoDB.",
    image: "https://source.unsplash.com/featured/?nodejs",
  },
];
export const MyCourses = () => {
      const [activeTab, setActiveTab] = useState("my");
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

      {/* Tab Toggle */}
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
        {(activeTab === "my" ? myCourses : discoverCourses).map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{course.description}</p>

              {activeTab === "my" && (
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

              <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300">
                <PlayCircle size={18} />
                {activeTab === "my" ? "Continue" : "Start Learning"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
