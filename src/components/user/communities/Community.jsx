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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1c2e] to-[#0f172a] text-white p-6">
      {/* Header */}
      <motion.div
        className="mb-10 text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Explore Communities
        </h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          Connect, collaborate, and grow with people like you.
        </p>
      </motion.div>

      {/* Communities Grid */}
      {communities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((c, idx) => (
            <motion.div
              key={c._id}
              onClick={() => navigate(`/${basePath}/community/${c._id}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)",
              }}
              className="
              bg-[#13172a]/70 backdrop-blur-xl rounded-2xl 
              border border-white/10 shadow-xl 
              overflow-hidden cursor-pointer group 
              transition-all duration-300
            "
            >
              {/* Cover Image */}
              <div className="relative">
                <img
                  src={c.coverImage || "/cover-placeholder.png"}
                  alt={c.name}
                  className="w-full h-40 object-cover rounded-t-2xl border-b border-white/10"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>

              {/* Community Content */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-purple-300 truncate">
                  {c.name}
                </h2>

                <p className="text-gray-400 text-sm line-clamp-2 mt-1 mb-4">
                  {c.description}
                </p>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    👥 {c.members?.length || 0} members
                  </span>

                  <button
                    className="
                  text-xs px-3 py-1 rounded-full
                  bg-gradient-to-r from-purple-500 to-cyan-500 
                  shadow-md group-hover:shadow-lg
                "
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg">No communities yet.</p>
        </div>
      )}
    </div>
  );
};
