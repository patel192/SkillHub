import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // Add your signup logic here
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md "
      >
        <div className="bg-gradient-to-br from-[#1e1b4b]/80 to-[#312e81]/80 backdrop-blur-md border border-purple-500/30 shadow-lg rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-300 drop-shadow">
            Create Your SkillHub Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-purple-200">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#1e293b] border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-purple-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#1e293b] border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-purple-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#1e293b] border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700  transition-all rounded-lg font-semibold shadow-md cursor-pointer"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-500 transition-all underline"
            >
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
