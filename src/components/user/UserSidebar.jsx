import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  BadgeCheck,
  MessageSquare,
  Settings,
  LogOut,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MdPeople } from "react-icons/md";

export const UserSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: -300, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info.point.x < -100) onClose(); // swipe left to close
            }}
            className="fixed left-0 top-0 h-full bg-[#10172A]/95 backdrop-blur-md border-r border-blue-500/20 text-white p-6 pt-20 shadow-xl z-50 w-64"
          >
            <nav className="flex flex-col gap-6 text-sm font-medium">
              <Link
                to="/user/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link
                to="/user/mycourses"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <BookOpen size={18} /> My Courses
              </Link>
              <Link
                to="/user/profile"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <User size={18} /> Profile
              </Link>
              <Link
                to="/user/certificates"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <BadgeCheck size={18} /> Certificates
              </Link>
              <Link
                to="/user/messages"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <MessageSquare size={18} /> Messages
              </Link>
              <Link
                to="/user/communities"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <MdPeople size={18} /> Communities
              </Link>
              <Link
                to="/user/settings"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <Settings size={18} /> Settings
              </Link>
              <Link
                to="/user/leaderboard"
                onClick={onClose}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                <Trophy size={18} /> LeaderBoard
              </Link>

              <div className="mt-auto">
                <button
                  className="flex items-center gap-3 hover:text-red-400"
                  onClick={() => {
                    localStorage.removeItem("fullname");
                    localStorage.removeItem("userId");
                    navigate("/login");
                  }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
