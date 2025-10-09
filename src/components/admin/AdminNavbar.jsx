import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";
import axios from "axios";

export const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const userId = localStorage.getItem("userId");

  // ✅ Fetch user avatar once
  const fetchUser = async () => {
    try {
      const res = await axios.get(`/user/${userId}`);
      setAvatar(res.data.data?.avatar || "/avatars/default.png");
    } catch (err) {
      console.error("Error fetching user:", err);
      setAvatar("/avatars/default.png");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // ✅ Auto-update time every minute
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Scroll listener for navbar shrink/blur
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`z-50 fixed top-0 left-0 right-0 h-14 sm:h-16 px-4 sm:px-6 
        flex items-center justify-between backdrop-blur-md border-b 
        transition-all duration-300 
        ${
          isScrolled
            ? "bg-[#0F172A]/90 border-blue-500/30 shadow-lg"
            : "bg-[#0F172A]/70 border-blue-500/10"
        } 
        ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
    >
      {/* ===== Sidebar Toggle (Left) ===== */}
      <button
        onClick={toggleSidebar}
        className="text-white focus:outline-none flex items-center justify-center"
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ===== Center Title ===== */}
      <h1 className="text-base sm:text-lg md:text-xl font-semibold truncate text-white ml-5">
        Admin Dashboard
      </h1>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-3 sm:gap-5 text-white ml-auto">
        {/* Time */}
        <span className="hidden sm:block text-xs sm:text-sm text-gray-300 whitespace-nowrap">
          {formattedTime}
        </span>

        {/* Notification Icon */}
        <div className="relative cursor-pointer">
          <Bell size={18} className="hover:text-cyan-400 transition" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            onClick={() => setDropdownOpen((prev) => !prev)}
            src={avatar}
            alt="Avatar"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer border border-blue-500 object-cover"
          />

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 mt-2 w-36 sm:w-40 bg-[#1E293B] border border-blue-600 
                         rounded-lg shadow-md py-2 z-20"
            >
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-blue-600"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
