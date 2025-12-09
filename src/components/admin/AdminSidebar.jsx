import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Book,
  Users,
  FileText,
  FileArchiveIcon,
} from "lucide-react";

export const AdminSidebar = ({ isOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/admindashboard" },
    { label: "Courses", icon: Book, path: "/admin/courses" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Resources", icon: FileText, path: "/admin/resources" },
    { label: "Reports", icon: FileArchiveIcon, path: "/admin/reports" },
    { label: "Communities", icon: Users, path: "/admin/communities" },
  ];

  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="
        h-full bg-[#0b0d12]/80 backdrop-blur-xl border-r border-white/10 
        shadow-2xl flex flex-col overflow-hidden relative
      "
    >
      {/* ========== Sidebar Header (Admin Branding) ========== */}
      <div className="
        h-16 flex items-center gap-3 px-4 border-b border-white/10 
        bg-gradient-to-r from-indigo-700/40 to-cyan-500/20
      ">
        <div className="
          w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40
          flex items-center justify-center shadow-md
        ">
          <LayoutDashboard size={20} className="text-indigo-300" />
        </div>

        {isOpen && (
          <span className="font-semibold text-lg bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Admin Panel
          </span>
        )}
      </div>

      {/* ========== Navigation Items ========== */}
      <nav className="flex flex-col mt-4 gap-1 px-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <motion.div key={item.label} className="relative">
              {/* Active glowing bar */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-r-lg"
                />
              )}

              <Link
                to={item.path}
                title={item.label}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-lg relative group
                  transition-all duration-300
                  ${active 
                    ? "bg-indigo-600/30 text-indigo-200 shadow-md shadow-indigo-900/40" 
                    : "text-gray-300 hover:bg-white/10 hover:text-indigo-300"
                  }
                `}
              >
                {/* Icon Container */}
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-lg border
                  transition-all duration-300
                  ${active 
                    ? "border-indigo-400/40 bg-indigo-500/20 shadow-[0_0_10px_#6366f1]" 
                    : "border-white/10 bg-white/5 group-hover:border-indigo-400/40"
                  }
                `}>
                  <Icon size={18} className="text-indigo-300" />
                </div>

                {/* Label */}
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* ========== Logout Button ========== */}
        <button
          onClick={() => navigate("/login")}
          title="Logout"
          className="
            mt-auto flex items-center gap-4 px-4 py-3 mb-4 text-red-400
            hover:bg-red-500/10 rounded-lg transition-all duration-300
          "
        >
          <div className="
            w-10 h-10 rounded-lg flex items-center justify-center 
            border border-red-500/40 bg-red-500/10
          ">
            <LogOut size={18} />
          </div>
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </nav>
    </motion.aside>
  );
};
