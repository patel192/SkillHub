import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Search,
  X,
  Settings,
} from "lucide-react";
import apiClient from "../../api/axiosConfig";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
const C = {
  brand: "var(--brand)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
};

export const AdminNavbar = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId, token, loading: authLoading } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    navigate("/login");
  };
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId || !token || authLoading) return;
    apiClient
      .get(`/user/${userId}`)
      .then((res) => {
        setAvatar(res.data?.data?.avatar || res.data?.avatar);
      })
      .catch((err) => console.error("Admin user fetch error:", err));
  }, [userId, token]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 h-16"
      style={{
        background: `var(--surface-alpha)`,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid var(--border)`,
      }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl transition-colors"
            style={{
              background: `rgba(var(--brand-rgb), 0.1)`,
              border: `1px solid var(--border)`,
            }}
          >
            <Menu size={19} style={{ color: C.brand }} />
          </motion.button>

          <div className="hidden md:block">
            <h1
              className="text-[17px] font-bold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Admin Console
            </h1>
            <p className="text-[10px] uppercase tracking-wider opacity-50">
              System Management
            </p>
          </div>
        </div>

        {/* Center - Simple Search Placeholder or info */}
        <div className="flex-1 max-w-xs hidden lg:block">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border opacity-40 cursor-not-allowed"
            style={{
              background: "var(--surface2)",
              borderColor: "var(--border)",
            }}
          >
            <Search size={14} />
            <span className="text-xs">Search logs, users...</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span
              className="text-sm font-mono font-bold"
              style={{ color: "var(--text)" }}
            >
              {formattedTime}
            </span>
            <span className="text-[9px] uppercase tracking-widest opacity-40">
              Server Local
            </span>
          </div>

          <button
            className="p-2.5 rounded-xl border relative"
            style={{
              background: "var(--surface2)",
              borderColor: "var(--border)",
            }}
          >
            <Bell size={18} style={{ color: "var(--text-muted)" }} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: C.error }}
            />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all"
              style={{
                background: "var(--surface2)",
                borderColor: "var(--border)",
              }}
            >
              <img
                src={
                  avatar ||
                  `https://ui-avatars.com/api/?name=Admin&background=16A880&color=fff`
                }
                alt="admin"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand/20 transition-all"
              />
              <ChevronDown
                size={14}
                className={`transition-transform opacity-50 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 rounded-2xl shadow-2xl border overflow-hidden p-2"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-40">
                    Administrator
                  </p>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-surface2"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-red-400 hover:bg-red-400/10"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminNavbar;
