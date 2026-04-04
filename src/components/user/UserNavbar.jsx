// ==========================================
// UserNavbar.jsx - Top Navigation Bar
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
  Code,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
// ─────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────
const C = {
  brand: "#16A880",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  error: "#F87171",
};

// Route label map for the page title
const ROUTE_LABELS = {
  "/user/dashboard": "Dashboard",
  "/user/mycourses": "My Courses",
  "/user/communities": "Communities",
  "/user/messages": "Messages",
  "/user/certificates": "Certificates",
  "/user/leaderboard": "Leaderboard",
  "/user/profile": "Profile",
  "/user/settings": "Settings",
  "/user/notifications": "Notifications",
  "/user/report": "Report",
  "/user/help": "Help & Support",
  "/user/view-profile": "User Profile",
};

export const UserNavbar = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const dropdownRef = useRef(null);
  const { userId, token, user, logout } = useAuth();
  
  // Dynamic page title logic
  const getPageTitle = () => {
    if (location.pathname.startsWith("/user/view-profile/")) return "User Profile";
    if (location.pathname.startsWith("/user/community/"))   return "Community Details";
    return ROUTE_LABELS[location.pathname] || "SkillHub";
  };
  const pageTitle = getPageTitle();

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Click-outside to close dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch user data
  useEffect(() => {
    if (!userId || !token) return;
    axios
      .get(`/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setAvatar(res.data?.data?.avatar || res.data?.avatar);
        setUserName(res.data?.data?.fullname || res.data?.fullname || user?.fullname || "User");
      })
      .catch(() => setUserName(user?.fullname || "User"));
  }, [userId, token, user]);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (!notifOpen || !userId) return;
    axios
      .get(`/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const notifs = res.data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
      })
      .catch(() => {});
  }, [notifOpen, userId, token]);

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `/notifications/read-all/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications((p) => p.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleLogout = () => {
    logout();
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 h-16"
      style={{
        background: `${"var(--surface)"}CC`,
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${"var(--border)"}`,
      }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* ── LEFT ──────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl transition-colors lg:hidden"
            style={{
              background: `${C.brand}12`,
              border: `1px solid ${"var(--border)"}`,
            }}
          >
            <Menu size={19} style={{ color: C.brand }} />
          </motion.button>

          {/* Hamburger — desktop */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2.5 rounded-xl transition-colors"
              style={{
                background: `${C.brand}12`,
                border: `1px solid ${"var(--border)"}`,
              }}
            >
              <Menu
                size={19}
                style={{
                  color: C.brand,
                  transform: `rotate(${!isSidebarOpen ? "180deg" : "0deg"})`,
                  transition: "transform 0.3s",
                }}
              />
            </button>
          )}

          {/* Page title + date */}
          <div className="hidden md:block">
            <h1
              className="text-[17px] font-bold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
            >
              {pageTitle}
            </h1>
            <p
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              {formattedDate}
            </p>
          </div>
        </div>

        {/* ── CENTER — Search ───────────────── */}
        <div className="flex-1 max-w-md hidden sm:block">
          <motion.div
            animate={{
              boxShadow: searchFocused
                ? `0 0 0 1.5px ${C.brand}88, 0 0 20px ${C.brand}14`
                : `0 0 0 1px ${"var(--border)"}`,
            }}
            className="relative rounded-xl overflow-hidden"
            style={{ background: "var(--surface)" }}
          >
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
              size={16}
              style={{ color: searchFocused ? C.brand : "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search courses, lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-9 py-2.5 bg-transparent outline-none text-[14px] placeholder-[#3D5C4E]"
              style={{ color: "var(--text)" }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── RIGHT ─────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live clock — desktop only */}
          <div className="hidden lg:flex flex-col items-end mr-1">
            <span
              className="text-[17px] font-mono font-semibold tabular-nums"
              style={{ color: "var(--text)" }}
            >
              {formattedTime}
            </span>
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Local Time
            </span>
          </div>

          {/* ── Notifications ─────────────── */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2.5 rounded-xl transition-colors"
              style={{
                background: `${C.brand}10`,
                border: `1px solid ${"var(--border)"}`,
              }}
            >
              <Bell size={18} style={{ color: "var(--text-muted)" }} />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full ring-2"
                    style={{ background: C.error, ringColor: "var(--surface)" }}
                  >
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-70"
                      style={{ background: C.error }}
                    />
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
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden z-50"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-4 flex items-center justify-between border-b"
                    style={{
                      background: "var(--surface2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <h3
                      className="font-semibold text-[15px]"
                      style={{ color: "var(--text)" }}
                    >
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[12px] font-semibold transition-colors"
                        style={{ color: C.brand }}
                        onMouseEnter={(e) =>
                          (e.target.style.color = C.brandLight)
                        }
                        onMouseLeave={(e) => (e.target.style.color = C.brand)}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <motion.div
                          key={n._id || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="p-4 border-b cursor-pointer transition-colors"
                          style={{
                            borderColor: "var(--border)",
                            background: !n.read
                              ? `${C.brand}08`
                              : "transparent",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = `${C.brand}10`)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = !n.read
                              ? `${C.brand}08`
                              : "transparent")
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                              style={{
                                background: !n.read
                                  ? C.brand
                                  : "var(--text-muted)",
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[13px] leading-relaxed"
                                style={{ color: "var(--text)" }}
                              >
                                {n.message}
                              </p>
                              <span
                                className="text-[11px] mt-1 block"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell
                          size={30}
                          className="mx-auto mb-3 opacity-20"
                          style={{ color: "var(--text-muted)" }}
                        />
                        <p
                          className="text-[13px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── User dropdown ─────────────── */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 p-1.5 pr-3 rounded-full transition-colors border"
              style={{
                background: `${C.brand}10`,
                borderColor: "var(--border)",
              }}
            >
              <img
                src={
                  avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=16A880&color=fff`
                }
                alt={userName}
                className="w-8 h-8 rounded-full object-cover ring-2"
                style={{ ringColor: "var(--border)" }}
              />
              <span
                className="hidden sm:block text-[13px] font-medium max-w-[100px] truncate"
                style={{ color: "var(--text)" }}
              >
                {userName}
              </span>
              <ChevronDown
                size={15}
                style={{
                  color: "var(--text-muted)",
                  transform: `rotate(${dropdownOpen ? "180deg" : "0deg"})`,
                  transition: "transform 0.2s",
                }}
              />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl overflow-hidden z-50"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${"var(--border)"}`,
                  }}
                >
                  {/* User info */}
                  <div
                    className="p-4 border-b"
                    style={{
                      background: "var(--surface2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="font-semibold text-[14px] truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {userName}
                    </p>
                    <p
                      className="text-[12px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Student Account
                    </p>
                  </div>

                  {/* Links */}
                  <div className="p-2">
                    {[
                      { to: "/user/profile", Icon: User, label: "Profile" },
                      {
                        to: "/user/settings",
                        Icon: Settings,
                        label: "Settings",
                      },
                    ].map(({ to, Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${C.brand}12`;
                          e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                      >
                        <Icon size={15} />
                        {label}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div
                    className="p-2 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors"
                      style={{ color: C.error }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(248,113,113,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <LogOut size={15} />
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
