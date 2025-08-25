import React, { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { motion } from "framer-motion";

export const LeaderBoard = () => {
  const [activeTab, setActiveTab] = useState("monthly");
  const [users, setUsers] = useState([]);

  // Fetch all users with points
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/users"); // 👈 adjust API
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Sort users by points (descending)
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="bg-[#0F172A] min-h-screen text-white px-6 py-8">
        {/* Title */}
        <div className="flex justify-center items-center mb-6">
          <Award size={35} className="text-yellow-400 animate-bounce" />
          <h2 className="text-4xl font-extrabold text-center w-1/2 text-cyan-400 tracking-wide">
            Leaderboard Rankings
          </h2>
        </div>

        {/* Tabs (still here, but both use the same sorted list) */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === "monthly"
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === "yearly"
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Leaderboard list */}
        <div className="space-y-4">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition">
                  {/* Left side (rank + avatar + name) */}
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-cyan-400 w-10 text-center">
                      #{index + 1}
                    </span>
                    <img
                      src={user.avatar || "/avatars/default.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-cyan-500"
                    />
                    <span className="text-lg font-semibold">{user.name}</span>
                  </div>

                  {/* Right side (points + button) */}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-green-400">
                      {user.points}
                    </span>
                    <button className="text-sm bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded transition">
                      See Activity
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400">No leaderboard data yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
