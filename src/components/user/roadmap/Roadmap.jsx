import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaPaintBrush, FaDatabase } from "react-icons/fa";

const roadmapData = [
  {
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, React, and more.",
    icon: <FaPaintBrush className="text-pink-500 text-3xl" />,
    source: "https://roadmap.sh/frontend",
  },
  {
    title: "Backend Developer",
    description: "Learn Node.js, Express, databases, APIs, and more.",
    icon: <FaDatabase className="text-green-400 text-3xl" />,
    source: "https://roadmap.sh/backend",
  },
  {
    title: "Full Stack Developer",
    description: "Become proficient in both frontend and backend development.",
    icon: <FaCode className="text-blue-400 text-3xl" />,
    source: "https://roadmap.sh/full-stack",
  },
];
export const RoadMap = () => {
    const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    // For future: fetch roadmap content from an API
    setRoadmaps(roadmapData);
  }, []);
  return (
   <div className="p-6 bg-[#0F172A] min-h-screen text-white">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Developer Roadmaps
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadmaps.map((roadmap, index) => (
          <motion.div
            key={index}
            className="bg-[#1E293B] rounded-xl p-5 shadow-md hover:shadow-blue-500/40 transition-shadow duration-300 border border-blue-900"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              {roadmap.icon}
              <h2 className="ml-4 text-xl font-semibold">{roadmap.title}</h2>
            </div>
            <p className="mb-4 text-gray-300">{roadmap.description}</p>
            <a
              href={roadmap.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Full Roadmap →
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
