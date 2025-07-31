import React, { useState } from "react";
import { Award } from "lucide-react";
import { motion } from "framer-motion";
const monthlyData = [
  { id: 1, name: "Alice", score: 950, image: "/avatars/avatar1.png" },
  { id: 2, name: "Bob", score: 850, image: "/avatars/avatar2.png" },
  { id: 3, name: "Charlie", score: 800, image: "/avatars/avatar3.png" },
];

const yearlyData = [
  { id: 1, name: "Alice", score: 10800, image: "/avatars/avatar1.png" },
  { id: 2, name: "Charlie", score: 10200, image: "/avatars/avatar3.png" },
  { id: 3, name: "Bob", score: 9800, image: "/avatars/avatar2.png" },
];

export const LeaderBoard = () => {
  const [activeTab, setActiveTab] = useState("monthly");

  const data = activeTab === "monthly" ? monthlyData : yearlyData;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="bg-[#0F172A] min-h-screen text-white px-6 py-8">
        <div className="flex justify-center items-center mb-6">
          <Award size={35} />
          <h2 className="text-4xl font-extrabold text-center w-1/2 text-cyan-400 tracking-wide">
            Leaderboard Rankings
          </h2>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === "monthly"
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === "yearly"
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="space-y-4">
          {data.map((user, index) => (
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div
                key={user.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-cyan-400 w-10 text-center">
                    #{index + 1}
                  </span>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-cyan-500"
                  />
                  <span className="text-lg font-semibold">{user.name}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-400">
                    {user.score}
                  </span>
                  <button className="text-sm bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded transition">
                    See Activity
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
