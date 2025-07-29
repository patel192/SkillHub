import React, { useState } from "react";
import { motion } from "framer-motion";
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
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1470&q=80')`,
      }}
    >
      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center min-h-screen px-4"
      >
        {/* Signup Card */}
        <div className="relative z-10 bg-[#10172A]/80 backdrop-blur-md border border-blue-500/20 shadow-lg rounded-2xl p-8 w-full max-w-md text-white">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
            Create Your SkillHub Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              <label className="block mb-1 text-sm text-gray-300">
                Password
              </label>
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
              Sign Up
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
