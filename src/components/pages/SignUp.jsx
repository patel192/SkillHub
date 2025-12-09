import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/user", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#05070b]">

      {/* LEFT SECTION — Branding & messaging */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-b from-[#0c0f16] to-[#0b1220] border-r border-white/10 relative"
      >
        {/* Floating gradient blobs */}
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-gradient-to-br from-pink-500/30 via-indigo-500/30 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500/25 to-cyan-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Join  
            <span className="block bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              SkillHub
            </span>
          </h1>

          <p className="mt-4 text-gray-400 text-lg max-w-md">
            Unlock access to modern skill paths, hands-on projects,  
            and guided learning experiences designed for growth.
          </p>

          <p className="mt-6 text-gray-500 text-sm">
            Build your future — one skill at a time.
          </p>
        </div>
      </motion.div>

      {/* RIGHT SECTION — SignUp Form */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">

        {/* Soft glow background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.3 }}
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 blur-2xl"
        />

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          whileHover={{ scale: 1.02 }}
          className="w-full max-w-md p-8 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            {/* Full Name */}
            <div>
              <label className="text-gray-300 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                required
                value={form.fullname}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-xl bg-[#0f1117] border border-white/10 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-xl bg-[#0f1117] border border-white/10 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-gray-300 text-sm font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-xl bg-[#0f1117] border border-white/10 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Create a password"
              />

              {/* Toggle icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-indigo-400 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 underline transition"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
