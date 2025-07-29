import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Adjust based on your routing setup
export const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // Add login logic here
  };
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative">
      {/* Soft blur background layer */}
      <div className="absolute inset-0 bg-[#0f172a] backdrop-blur-sm z-0" />

      {/* Animated Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 150 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 bg-gradient-to-br from-[#1e1b4b]/80 to-[#312e81]/80 backdrop-blur-md border border-purple-500/30 shadow-lg rounded-2xl p-8 w-full max-w-md text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg font-semibold shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Bottom line with link */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-500 transition-all underline"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
