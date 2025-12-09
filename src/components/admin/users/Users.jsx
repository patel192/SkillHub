import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Users = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(
        `/user/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleRole = async (id, currentRole) => {
    try {
      await axios.patch(
        `/user/${id}`,
        { role: currentRole === "admin" ? "user" : "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-[#05070f] via-[#0f172a] to-[#1e293b] text-white">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-gray-400 mt-1">Manage users • Permissions • Account states</p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full md:w-1/3 px-4 py-3 rounded-xl
            bg-white/10 backdrop-blur-md border border-white/10
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500
          "
        />
      </div>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-400 text-center">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredUsers.map((user, index) => (
            <Link key={user._id} to={`${user._id}`}>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.06,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{
                  rotateX: 6,
                  rotateY: -6,
                  scale: 1.05,
                  boxShadow: "0px 0px 30px rgba(139,92,246,0.5)",
                }}
                className="
                  relative rounded-2xl p-6 cursor-pointer
                  bg-white/10 backdrop-blur-2xl border border-white/10
                  shadow-lg hover:shadow-purple-500/30
                "
              >
                {/* Floating neon glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 blur-2xl opacity-0 hover:opacity-40 transition duration-500 rounded-2xl"></div>

                {/* Avatar + Basic Info */}
                <div className="relative flex items-center gap-4 mb-4 z-10">
                  {user.avatar ? (
                    <motion.img
                      src={user.avatar}
                      alt={user.fullname}
                      className="w-14 h-14 rounded-full object-cover border border-purple-500 shadow-md"
                      animate={{ boxShadow: ["0 0 10px #8b5cf6", "0 0 15px #22d3ee", "0 0 10px #8b5cf6"] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                      {user.fullname?.[0] || "U"}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-semibold">{user.fullname}</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>

                {/* Status + Role Badges */}
                <div className="flex justify-between mb-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      user.isActive
                        ? "bg-green-600/70 text-white"
                        : "bg-red-600/70 text-white"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      user.role === "admin"
                        ? "bg-yellow-500/70 text-white"
                        : "bg-purple-500/70 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Created Date */}
                <p className="text-gray-400 text-sm mb-5">
                  Created:{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* Action Buttons */}
                <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleActive(user._id, user.isActive);
                    }}
                    whileHover={{ scale: 1.07 }}
                    className={`py-2 rounded-xl font-medium flex-1 transition ${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleRole(user._id, user.role);
                    }}
                    whileHover={{ scale: 1.07 }}
                    className="py-2 rounded-xl font-medium flex-1 
                               bg-gradient-to-r from-indigo-500 to-purple-600 
                               hover:from-indigo-600 hover:to-purple-700"
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
                  </motion.button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
