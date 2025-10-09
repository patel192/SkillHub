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

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(139, 92, 246, 0.4)" },
    tap: { scale: 0.95 },
  };

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl shadow-2xl border border-white/5"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative group rounded-full overflow-hidden ring-4 ring-purple-500 shadow-xl"
        >
          <img
            src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt={user.fullname}
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
          />
          <span
            className={`absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
            title={user.isActive ? "Active" : "Inactive"}
          />
        </motion.div>

        {/* Basic Info */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold tracking-wide truncate bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            {user.fullname}
          </h1>
          <p className="text-sm sm:text-md md:text-md text-gray-400 truncate">{user.email}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                user.isActive ? "bg-green-600/80 text-white" : "bg-red-600/80 text-white"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                user.role === "admin" ? "bg-yellow-500/80 text-white" : "bg-indigo-500/80 text-white"
              }`}
            >
              {user.role}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          🧾 Account Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
          {/* Left */}
          <div className="bg-gray-800/50 p-4 rounded-xl shadow-md space-y-2">
            <p>
              <span className="font-semibold">Full Name:</span> {user.fullname}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>

          {/* Right */}
          <div className="bg-gray-800/50 p-4 rounded-xl shadow-md space-y-2">
            <p>
              <span className="font-semibold">Status:</span> {user.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <span className="font-semibold">Created At:</span> {new Date(user.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Updated At:</span> {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate("/admin/users")}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all flex-1 sm:flex-auto"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg flex-1 sm:flex-auto"
        >
          <Edit size={18} /> Edit User
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 0px 15px rgba(234, 179, 8, 0.7)",
          }}
          whileTap="tap"
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-all flex-1 sm:flex-auto"
        >
          <ShieldAlert size={18} /> Deactivate
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 0px 15px rgba(239, 68, 68, 0.7)",
          }}
          whileTap="tap"
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all flex-1 sm:flex-auto"
        >
          <Trash2 size={18} /> Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserDetails;
