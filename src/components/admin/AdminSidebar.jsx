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
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/admindashboard" },
    { label: "Courses", icon: <Book size={18} />, path: "/admin/courses" },
    { label: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { label: "Resources", icon: <FileText size={18} />, path: "/admin/resources" },
    { label: "Reports", icon: <FileArchiveIcon size={18} />, path: "/admin/reports" },
    { label: "Communities", icon: <Users size={18} />, path: "/admin/communities" },
  ];

  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 64 }}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-[#10172A]/90 backdrop-blur-md border-r border-blue-500/20 text-white shadow-lg flex flex-col overflow-hidden`}
    >
      <nav className="flex flex-col mt-4 gap-2 text-sm font-medium flex-1">
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all whitespace-nowrap overflow-hidden
                ${active ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-blue-400"}
              `}
              title={item.label} // tooltip when collapsed
            >
              {item.icon}
              {isOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        <button
          className="flex items-center gap-3 px-3 py-2 mt-auto mb-4 hover:text-red-400"
          onClick={() => navigate("/login")}
          title="Logout"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </motion.aside>
  );
};
