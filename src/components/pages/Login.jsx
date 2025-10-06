import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/loginuser", form);
      if (res.status === 200) {
        const { data, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("fullname", data.fullname);
        localStorage.setItem("role", data.role);

        navigate(data.role === "admin" ? "/admin/admindashboard" : "/user/dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1a40] to-[#2d1b69] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/30 via-transparent to-cyan-800/30 blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 150 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gradient-to-br from-[#1e1b4b]/80 to-[#312e81]/80 backdrop-blur-md border border-purple-500/30 shadow-lg rounded-2xl p-8 w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
          Welcome Back 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-purple-200">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1E293B] border border-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 text-sm text-purple-200">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1E293B] border border-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1 right-3 text-gray-400 hover:text-cyan-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all rounded-lg font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Log In"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-all underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
