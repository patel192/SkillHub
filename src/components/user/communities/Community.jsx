import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export const Community = ({ basePath }) => {
  const [communities, setCommunities] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get("/communities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCommunities(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching communities:", err);
      }
    };
    fetchCommunities();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a0f1f] to-[#1e293b] text-white p-4 sm:p-6">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🌐 Communities
      </motion.h1>

      {communities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {communities.map((c, idx) => (
            <motion.div
              key={c._id}
              onClick={() => navigate(`/${basePath}/community/${c._id}`)}
              className="cursor-pointer rounded-xl p-4 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-lg border border-purple-600 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px #8b5cf6" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <img
                src={c.coverImage || "/cover-placeholder.png"}
                alt={c.name}
                className="w-full h-48 sm:h-40 md:h-32 object-cover rounded-lg mb-3 border border-gray-700"
              />
              <h2 className="text-lg sm:text-xl font-semibold text-purple-400 mb-1 truncate">
                {c.name}
              </h2>
              <p className="text-sm text-gray-300 line-clamp-3 sm:line-clamp-2 mb-2">
                {c.description}
              </p>
              <p className="mt-auto text-xs text-gray-400">
                👥 {c.members?.length || 0} members
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">No communities yet.</p>
      )}
    </div>
  );
};
