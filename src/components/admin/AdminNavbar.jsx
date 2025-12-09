import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";
import axios from "axios";

export const AdminNavbar = ({ toggleSidebar, isSidebarOpen, leftOffset = 0 }) => {
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const userId = localStorage.getItem("userId");

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

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed top-0 z-50 left-0 right-0 flex items-center justify-between px-4 sm:px-6 
        h-16 bg-opacity-70 backdrop-blur-md border-b transition-all duration-300`}
      // IMPORTANT: we set left style so navbar aligns with main content when sidebar changes
      style={{
        left: leftOffset,
        right: 0,
        backgroundColor: isScrolled ? "rgba(15,23,42,0.9)" : "rgba(15,23,42,0.7)",
        borderBottom: isScrolled ? "1px solid rgba(59,130,246,0.12)" : "1px solid rgba(59,130,246,0.06)",
        // ensure navbar stretches the remainder of the screen (left offset already applied)
      }}
    >
      {/* left: sidebar toggle */}
      <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-white/8 transition">
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <h1 className="text-base sm:text-lg md:text-xl font-semibold truncate ml-4">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-3 ml-auto">
        <span className="hidden sm:block text-xs text-gray-300">{formattedTime}</span>

        <div className="relative cursor-pointer">
          <Bell size={18} className="hover:text-cyan-400 transition" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping" />
        </div>

        <div className="relative">
          <img
            onClick={() => setDropdownOpen((d) => !d)}
            src={avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full cursor-pointer border border-blue-500 object-cover"
          />

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 mt-2 w-36 bg-[#1E293B] border border-blue-500/30 rounded-lg shadow-md py-2 z-20"
            >
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-blue-600/20"
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

export default AdminNavbar;
