// ==========================================
// UserNavbar.jsx - Top Navigation
// ==========================================

import React, { useEffect, useState, useRef } from "react";
import { 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  User,
  ChevronDown,
  X,
  CheckCircle2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const UserNavbar = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const fullname = localStorage.getItem("fullname");

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvatar(res.data.data.avatar);
        setUserName(res.data.data.fullname || fullname);
      } catch (err) {
        setUserName(fullname);
      }
    };
    if (userId) fetchUser();
  }, [userId, token, fullname]);

  // Fetch notifications
  useEffect(() => {
    if (!notifOpen) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notifs = res.data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      } catch (err) {}
    };
    fetchNotifications();
  }, [notifOpen, userId, token]);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const markAllAsRead = async () => {
    try {
      await axios.put(`/notifications/read-all/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors lg:hidden"
          >
            <Menu size={20} />
          </motion.button>

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Menu size={20} className={`transition-transform duration-300 ${isSidebarOpen ? "" : "rotate-180"}`} />
            </button>
          )}

          {/* Breadcrumb / Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-xs text-slate-400">{formattedDate}</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md hidden sm:block" ref={searchRef}>
          <motion.div
            animate={{ width: searchOpen ? "100%" : "100%" }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search courses, lessons, or mentors..."
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl bg-slate-900 border border-white/10 shadow-2xl"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recent</p>
                <div className="space-y-2">
                  {["React Hooks", "Node.js Basics", "Database Design"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-sm text-slate-300">
                      <Clock size={14} className="text-slate-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Time - Desktop */}
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-lg font-mono font-semibold text-white">{formattedTime}</span>
            <span className="text-xs text-slate-400">UTC</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Bell size={20} className="text-slate-300" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500"
                  >
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <motion.div
                          key={n._id || i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                            !n.read ? "bg-indigo-500/10" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-2 rounded-full ${!n.read ? "bg-indigo-400" : "bg-slate-600"}`} />
                            <div className="flex-1">
                              <p className="text-sm text-slate-200">{n.message}</p>
                              <span className="text-xs text-slate-500 mt-1 block">
                                {new Date(n.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <img
                src={avatar || `https://ui-avatars.com/api/?name=${userName}&background=6366f1&color=fff`}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[100px] truncate">
                {userName}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="font-semibold text-white truncate">{userName}</p>
                    <p className="text-xs text-slate-500">Student</p>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to="/user/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/user/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm w-full"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default UserNavbar;