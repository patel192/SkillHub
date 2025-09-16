import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
    avatar: "",
    isActive: "true",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user", form);

      // ✅ Save token & user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account created successfully!");
      navigate("/login"); // redirect where you want
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0F172A] to-[#1a1f3c]">
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-purple-900/70 to-cyan-900/70 backdrop-blur-lg border border-cyan-400/30 shadow-[0_0_25px_rgba(139,92,246,0.6)] rounded-2xl p-8 text-white"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold mb-6 text-center text-cyan-300 drop-shadow"
          >
            Create Your SkillHub Account
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Name", name: "fullname", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
            ].map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <label className="block mb-1 text-sm text-purple-200">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[#1e293b] border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white shadow-md transition duration-300"
                />
              </motion.div>
            ))}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px #22d3ee" }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 mt-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold shadow-lg transition-all"
            >
              Sign Up
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-sm text-gray-400"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 transition-all underline"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
