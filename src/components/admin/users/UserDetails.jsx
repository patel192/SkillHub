import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft,Edit,ShieldAlert,Trash2 } from "lucide-react";
export const UserDetails = ({token}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const buttonVariants = {
    hover: { scale: 1.08, boxShadow: "0px 0px 15px rgba(139, 92, 246, 0.7)" },
    tap: { scale: 0.95 },
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/user/${id}`,{
          headers:{Authorization:`Bearer ${token}`}
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
      <div className="p-6 text-lg text-gray-700">Loading user details...</div>
    );

  if (!user)
    return <div className="p-6 text-red-500 text-lg">User not found.</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-6 py-10 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-2xl shadow-xl border border-white/10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <img
            src={
              user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={user.fullname}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500 shadow-lg"
          />
          <span
            className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
            title={user.isActive ? "Active" : "Inactive"}
          />
        </motion.div>

        {/* Basic Info */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-wide">{user.fullname}</h1>
          <p className="text-md text-purple-300">{user.email}</p>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`${
                  user.isActive ? "text-green-400" : "text-red-400"
                } font-semibold`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-10 border-t border-white/10 pt-6">
        <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          🧾 Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Full Name:</span> {user.fullname}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {user.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Updated At:</span>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 border-t border-white/10 pt-6 flex flex-wrap gap-4">
         <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      {/* Edit User */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg"
      >
        <Edit size={18} /> Edit User
      </motion.button>

      {/* Deactivate */}
      <motion.button
        variants={buttonVariants}
        whileHover={{
          scale: 1.08,
          boxShadow: "0px 0px 15px rgba(234, 179, 8, 0.7)",
        }}
        whileTap="tap"
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-all"
      >
        <ShieldAlert size={18} /> Deactivate
      </motion.button>

      {/* Delete */}
      <motion.button
        variants={buttonVariants}
        whileHover={{
          scale: 1.08,
          boxShadow: "0px 0px 15px rgba(239, 68, 68, 0.7)",
        }}
        whileTap="tap"
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
      >
        <Trash2 size={18} /> Delete
      </motion.button>
      </div>
    </motion.div>
  );
};

export default UserDetails;
