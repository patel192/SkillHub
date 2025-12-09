import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, ShieldAlert, Trash2 } from "lucide-react";
import { Spinner } from "../../../utils/Spinner";

export const UserDetails = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );

  if (!user)
    return <div className="p-6 text-red-500 text-lg">User not found.</div>;

  return (
    <div className="p-6 sm:p-8 min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Header */}
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-10">
        User Profile
      </h2>

      {/* Main Card */}
      <div className="mx-auto max-w-4xl bg-[#1E293B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg"
          >
            <img
              src={
                user.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={user.fullname}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
            />
          </motion.div>

          {/* Name + Status */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {user.fullname}
            </h1>
            <p className="text-gray-400 mt-1">{user.email}</p>

            {/* Badges */}
            <div className="flex justify-center sm:justify-start gap-3 mt-3">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  user.isActive
                    ? "bg-green-600/70 text-white"
                    : "bg-red-600/70 text-white"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  user.role === "admin"
                    ? "bg-yellow-500/70 text-white"
                    : "bg-indigo-500/70 text-white"
                }`}
              >
                {user.role}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Joined on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Info Panels */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Left Panel */}
          <div className="bg-[#1E293B]/60 p-5 rounded-xl border border-white/10 shadow-md">
            <h3 className="text-indigo-300 font-semibold mb-3 text-lg">Basic Information</h3>

            <p className="text-sm">
              <span className="font-medium">Full Name:</span> {user.fullname}
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>

          {/* Right Panel */}
          <div className="bg-[#1E293B]/60 p-5 rounded-xl border border-white/10 shadow-md">
            <h3 className="text-indigo-300 font-semibold mb-3 text-lg">Account Details</h3>

            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              {user.isActive ? "Active" : "Inactive"}
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Created At:</span>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Updated At:</span>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold flex items-center justify-center gap-2"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft size={18} /> Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold flex items-center justify-center gap-2"
          >
            <Edit size={18} /> Edit User
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold flex items-center justify-center gap-2"
          >
            <ShieldAlert size={18} /> Deactivate
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
