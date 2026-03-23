// ==========================================
// UserSidebar.jsx - Navigation Sidebar
// ==========================================

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  BadgeCheck,
  MessageSquare,
  Settings,
  Trophy,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  HelpCircle,
  Moon,
  Sun,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const UserSidebar = ({ isOpen, toggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/user/dashboard", badge: null },
    { label: "My Courses", icon: BookOpen, to: "/user/mycourses", badge: "3" },
    { label: "Communities", icon: Users, to: "/user/communities", badge: "New" },
    { label: "Messages", icon: MessageSquare, to: "/user/messages", badge: "5" },
    { label: "Certificates", icon: BadgeCheck, to: "/user/certificates", badge: null },
    { label: "Leaderboard", icon: Trophy, to: "/user/leaderboard", badge: null },
    { label: "Profile", icon: User, to: "/user/profile", badge: null },
    { label: "Settings", icon: Settings, to: "/user/settings", badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40"
          >
            <SidebarContent 
              isOpen={true} 
              toggle={toggle} 
              menuItems={menuItems} 
              isActive={isActive}
              onLogout={handleLogout}
              isMobile={true}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: isOpen ? "16rem" : "5rem" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full bg-slate-900/80 backdrop-blur-xl border-r border-white/10 z-40"
        >
          <SidebarContent 
            isOpen={isOpen} 
            toggle={toggle} 
            menuItems={menuItems} 
            isActive={isActive}
            onLogout={handleLogout}
            isMobile={false}
          />
        </motion.aside>
      )}
    </>
  );
};

// Sidebar Content Component
const SidebarContent = ({ isOpen, toggle, menuItems, isActive, onLogout, isMobile }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-4">
        <Link to="/user/dashboard" className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
                  SkillHub
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {!isMobile && (
          <button
            onClick={toggle}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        
        {isMobile && (
          <button
            onClick={toggle}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => isMobile && toggle()}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
            >
              {/* Active Background */}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Hover Background */}
              {!active && (
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0,
                    scale: hoveredIndex === index ? 1 : 0.8
                  }}
                  className="absolute inset-0 bg-white/5 rounded-xl"
                />
              )}

              {/* Icon */}
              <div className={`relative z-10 ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`}>
                <Icon size={20} />
              </div>

              {/* Label */}
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className={`relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden ${
                      active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}
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
                  className={`relative z-10 ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.badge === "New" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-indigo-500/20 text-indigo-400"
                  }`}
                >
                  {item.badge}
                </motion.span>
              )}

              {/* Tooltip for collapsed state */}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl">
                  {item.label}
                  {item.badge && <span className="ml-2 text-indigo-400">{item.badge}</span>}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* Help */}
        <Link
          to="/help"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <HelpCircle size={20} className="text-slate-400 group-hover:text-slate-200" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-slate-400 group-hover:text-slate-200"
              >
                Help & Support
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors group"
        >
          <LogOut size={20} className="text-red-400 group-hover:text-red-300" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400 group-hover:text-red-300 font-medium"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Mini Profile (when expanded) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    Pro
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 font-medium truncate">Pro Plan</p>
                    <p className="text-[10px] text-slate-500">Valid until Dec 2025</p>
                  </div>
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