import React, { useEffect, useState } from "react";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export const UserNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [avatar, setAvatar] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // =============== TIME UPDATE ===============
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer); // cleanup
  }, []);

  // Format time
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // =============== FETCH USER AVATAR ===============
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvatar(res.data.data.avatar);
      } catch (err) {}
    };
    fetchUser();
  }, []);

  // =============== FETCH NOTIFICATIONS ===============
  useEffect(() => {
    if (!notifOpen) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.data || []);
      } catch (err) {}
    };
    fetchNotifications();
  }, [notifOpen]);

  // Animation presets
  const dropdownAnim = {
    hidden: { opacity: 0, y: -10, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.96 },
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        fixed top-0 right-0 h-16 flex items-center justify-between
        px-6 bg-[#0b0d12]/70 backdrop-blur-xl border-b border-white/10 shadow-lg z-40
      "
      style={{ left: isSidebarOpen ? "16rem" : "5rem" }}
    >
      {/* ============= SIDEBAR TOGGLE ============= */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-white/10 transition"
      >
        <Menu size={22} />
      </button>

      {/* ============= CENTER TITLE ============= */}
      <h1 className="text-lg font-semibold text-indigo-300 tracking-wide hidden md:block">
        SkillHub Dashboard
      </h1>

      {/* ============= RIGHT SIDE ============= */}
      <div className="flex items-center gap-6">

        {/* Time */}
        <span className="text-gray-300 text-sm">{formattedTime}</span>

        {/* ============= NOTIFICATIONS ============= */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/30 transition relative"
          >
            <Bell size={20} />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                variants={dropdownAnim}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="
                  absolute right-0 mt-2 w-80 p-3 bg-[#0f1117] border border-white/10
                  rounded-xl shadow-xl max-h-96 overflow-y-auto backdrop-blur-sm
                "
              >
                <h3 className="text-sm font-semibold mb-2 text-indigo-300">
                  Notifications
                </h3>

                {notifications.length ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 mb-2 rounded-lg ${
                        n.read ? "bg-white/5" : "bg-indigo-600/30"
                      }`}
                    >
                      <p>{n.message}</p>
                      <span className="text-gray-400 text-xs block mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No notifications</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============= USER AVATAR ============= */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <img
              src={avatar}
              className="w-9 h-9 rounded-full border border-indigo-400 cursor-pointer"
            />
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </button>

          {/* Avatar Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                variants={dropdownAnim}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="
                  absolute right-0 mt-2 w-44 py-2 bg-[#0f1117] border border-white/10
                  rounded-xl shadow-xl backdrop-blur-lg
                "
              >
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-white/10 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};
