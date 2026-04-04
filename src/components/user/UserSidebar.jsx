// ==========================================
// UserSidebar.jsx - Navigation Sidebar
// ==========================================

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, User, BadgeCheck,
  MessageSquare, Settings, Trophy, ChevronLeft, ChevronRight,
  LogOut, Users, HelpCircle, Code, Activity, Bell, Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────
const C = {
  brand:      "#16A880",
  brandDark:  "#0D7A5F",
  brandLight: "#1FC99A",
  accent:     "#F59E0B",
  error:      "#F87171",
};

// ─────────────────────────────────────────
// MENU ITEMS — matches App.jsx routes
// ─────────────────────────────────────────
const MENU_ITEMS = [
  { label: "Dashboard",    icon: LayoutDashboard, to: "/user/dashboard",    badge: null    },
  { label: "My Courses",   icon: BookOpen,        to: "/user/mycourses",    badge: "3"     },
  { label: "Communities",  icon: Users,           to: "/user/communities",  badge: "New"   },
  { label: "Messages",     icon: MessageSquare,   to: "/user/messages",     badge: "5"     },
  { label: "Certificates", icon: BadgeCheck,      to: "/user/certificates", badge: null    },
  { label: "Leaderboard",  icon: Trophy,          to: "/user/leaderboard",  badge: null    },
  { label: "Activities",   icon: Activity,        to: "/user/activities",   badge: null    },
  { label: "Notifications",icon: Bell,            to: "/user/notifications",badge: null    },
  { label: "Profile",      icon: User,            to: "/user/profile",      badge: null    },
  { label: "Settings",     icon: Settings,        to: "/user/settings",     badge: null    },
];

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export const UserSidebar = ({ isOpen, toggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); };

  return (
    <>
      {/* ── Mobile Drawer ───────────────── */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 h-full w-72 z-40 shadow-2xl"
            style={{ background: `${"var(--surface)"}`, backdropFilter: "blur(20px)", borderRight: `1px solid ${"var(--border)"}` }}
          >
            <SidebarContent
              isOpen={true}
              toggle={toggle}
              currentPath={location.pathname}
              onLogout={handleLogout}
              isMobile={true}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ─────────────── */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: isOpen ? "16rem" : "5rem" }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="fixed top-0 left-0 h-full z-40"
          style={{
            background: `${"var(--surface)"}`,
            backdropFilter: "blur(20px)",
            borderRight: `1px solid ${"var(--border)"}`,
          }}
        >
          <SidebarContent
            isOpen={isOpen}
            toggle={toggle}
            currentPath={location.pathname}
            onLogout={handleLogout}
            isMobile={false}
          />
        </motion.aside>
      )}
    </>
  );
};

// ─────────────────────────────────────────
// INTERNAL SIDEBAR CONTENT
// ─────────────────────────────────────────
const SidebarContent = ({ isOpen, toggle, currentPath, onLogout, isMobile }) => {
  const [hovered, setHovered] = useState(null);

  const isActive = (path) => currentPath === path;

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo / Header ───────────────── */}
      <div
        className="h-16 flex items-center justify-between px-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <Link to="/user/dashboard" className="flex items-center gap-3 overflow-hidden min-w-0">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.08 }}
            transition={{ duration: 0.45 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
              boxShadow: `0 0 18px ${C.brand}44`,
            }}
          >
            <Code className="w-4 h-4 text-white" />
          </motion.div>

          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0,  x: -10 }}
                transition={{ duration: 0.18 }}
                className="text-[19px] font-bold whitespace-nowrap overflow-hidden"
                style={{
                  fontFamily: "'Fraunces', serif",
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SkillHub
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${C.brand}18`; e.currentTarget.style.color = C.brand; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          {isOpen
            ? <ChevronLeft size={17} />
            : <ChevronRight size={17} />
          }
        </button>
      </div>

      {/* ── Navigation ──────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {MENU_ITEMS.map((item, idx) => {
          const active = isActive(item.to);
          const Icon   = item.icon;
          const isNew  = item.badge === "New";

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => isMobile && toggle()}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
              style={{
                background: active
                  ? `${C.brand}18`
                  : hovered === idx
                  ? `${C.brand}0C`
                  : "transparent",
                border: active ? `1px solid ${"var(--border)"}` : "1px solid transparent",
              }}
            >
              {/* Active left accent bar */}
              {active && (
                <motion.div
                  layoutId="activeSidebarBar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: `linear-gradient(to bottom, ${C.brand}, ${C.brandLight})` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div
                className="relative z-10 flex-shrink-0 transition-colors duration-150"
                style={{ color: active ? C.brand : hovered === idx ? "var(--text-muted)" : "var(--text-muted)" }}
              >
                <Icon size={19} />
                {/* Active icon glow */}
                {active && (
                  <div
                    className="absolute inset-0 rounded-full blur-md -z-10"
                    style={{ background: `${C.brand}40` }}
                  />
                )}
              </div>

              {/* Label */}
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0,  width: 0  }}
                    transition={{ duration: 0.16 }}
                    className="relative z-10 text-[13px] font-medium whitespace-nowrap overflow-hidden flex-1 transition-colors duration-150"
                    style={{ color: active ? "var(--text)" : hovered === idx ? "var(--text-muted)" : "var(--text-muted)" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Badge */}
              {isOpen && item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                    isNew
                      ? { background: `${C.brand}20`, color: C.brand,  border: `1px solid ${"var(--border)"}` }
                      : { background: `${C.accent}20`, color: C.accent, border: `1px solid rgba(245,158,11,0.2)` }
                  }
                >
                  {item.badge}
                </motion.span>
              )}

              {/* Tooltip when collapsed */}
              {!isOpen && !isMobile && (
                <div
                  className="absolute left-full ml-3 px-3 py-2 rounded-xl text-[12px] font-medium whitespace-nowrap z-50 shadow-xl border pointer-events-none
                    opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                  style={{
                    background: "var(--surface2)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {/* Arrow */}
                  <div
                    className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 border-l border-b"
                    style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
                  />
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 font-bold" style={{ color: isNew ? C.brand : C.accent }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ───────────────── */}
      <div className="p-2.5 border-t space-y-0.5" style={{ borderColor: "var(--border)" }}>

        {/* Help */}
        <Link
          to="/user/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${C.brand}0C`; e.currentTarget.style.color = "var(--text-muted)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <HelpCircle size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] font-medium"
              >
                Help & Support
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
          style={{ color: C.error }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] font-semibold"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Pro plan card — expanded only */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0,  height: 0 }}
              className="pt-1 overflow-hidden"
            >
              <div
                className="p-3 rounded-xl border"
                style={{
                  background: `linear-gradient(135deg, ${C.brand}10, ${C.brandLight}08)`,
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                      boxShadow: `0 0 12px ${C.brand}44`,
                    }}
                  >
                    Pro
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate" style={{ color: "var(--text)" }}>
                      Pro Plan
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Valid until Dec 2025
                    </p>
                  </div>
                  {/* Active dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: C.brand, boxShadow: `0 0 6px ${C.brand}` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserSidebar;