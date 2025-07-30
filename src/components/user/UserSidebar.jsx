import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  User,
  BadgeCheck,
  MessageSquare,
  Settings,
  LogOut,
  Map,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const UserSidebar = ({ isOpen }) => {
  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: isOpen ? 0 : -260 }}
      transition={{ duration: 0.4 }}
      className={`fixed left-0 top-0 h-full bg-[#10172A]/90 backdrop-blur-md border-r border-blue-500/20 text-white p-6 pt-20 shadow-lg z-50 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      } transition-all duration-300`}
    >
      <nav className="flex flex-col gap-10 text-sm font-medium">
        <Link
          to="/user/dashboard"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link
          to="/user/mycourses"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <BookOpen size={18} /> My Courses
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <User size={18} /> Profile
        </Link>
        <Link
          to="/user/certificates"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <BadgeCheck size={18} /> Certificates
        </Link>
        <Link
          to="/messages"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <MessageSquare size={18} /> Messages
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <Settings size={18} /> Settings
        </Link>
        <Link
          to="/raodmap"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <Map size={18} /> RoadMaps
        </Link>
        <Link
          to="/raodmap"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <Trophy size={18} /> LeaderBoard
        </Link>

        <div className="mt-auto">
          <Link
            to="/logout"
            className="flex items-center gap-3 hover:text-red-400"
          >
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </nav>
    </motion.aside>
  );
};
