import React from "react";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
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
      <nav className="flex flex-col gap-6 text-sm font-medium">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link
          to="/courses"
          className="flex items-center gap-3 hover:text-blue-400"
        >
          <BookOpen size={18} /> My Courses
        </Link>
        <Link
          to="/logout"
          className="flex items-center gap-3 hover:text-red-400 mt-auto"
        >
          <LogOut size={18} /> Logout
        </Link>
      </nav>
    </motion.aside>
  );
};
