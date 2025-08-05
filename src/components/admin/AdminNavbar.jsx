import { motion } from "framer-motion";
import React from "react";
import { Menu, X ,Bell} from "lucide-react";
import { useState, useEffect } from "react";
export const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
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
      className={`z-50 fixed top-0 left-0 right-0 h-16 px-6 bg-[#0F172A]/80 backdrop-blur-md border-b border-blue-500/20 shadow-lg flex items-center justify-between transition-all duration-300 ${
        isSidebarOpen ? "md:ml-64" : "ml-0"
      }`}
    >
      {/* Sidebar Toggle */}
      <button onClick={toggleSidebar} className="text-white focus:outline-none">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Title */}
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="text-sm text-gray-300">Welcome, Admin</div>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-white">
        {/* Time */}
        <span className="text-sm text-gray-300">{formattedTime}</span>

        {/* Notification Icon */}
        <div className="relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            onClick={() => setDropdownOpen(!dropdownOpen)}
            src="https://i.pravatar.cc/30"
            alt="Avatar"
            className="w-8 h-8 rounded-full cursor-pointer border border-blue-500"
          />
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 mt-2 w-40 bg-[#1E293B] border border-blue-600 rounded-lg shadow-md py-2 z-10"
            >
              <button
                onClick={() => alert("Logging out...")}
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
