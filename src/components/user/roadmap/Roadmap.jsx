import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaPaintBrush, FaDatabase } from "react-icons/fa";

const roadmapData = [
  {
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, React, and more.",
    icon: <FaPaintBrush className="text-purple-400 text-3xl" />,
    source: "https://roadmap.sh/frontend",
  },
  {
    title: "Backend Developer",
    description: "Learn Node.js, Express, databases, APIs, and more.",
    icon: <FaDatabase className="text-cyan-400 text-3xl" />,
    source: "https://roadmap.sh/backend",
  },
  {
    title: "Full Stack Developer",
    description: "Become proficient in both frontend and backend development.",
    icon: <FaCode className="text-pink-400 text-3xl" />,
    source: "https://roadmap.sh/full-stack",
  },
];

export const RoadMap = () => {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    setRoadmaps(roadmapData);
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <motion.h1
        className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Developer Roadmaps
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roadmaps.map((roadmap, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-cyan-500/20 transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(128,0,255,0.4)]"
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
              className="text-purple-300 hover:text-cyan-300 hover:underline font-semibold"
            >
              View Full Roadmap →
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
