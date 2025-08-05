import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut,FileText,Users,Book} from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
export const AdminSidebar = ({ isOpen }) => {
   const { pathname } = useLocation();

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/admindashboard" },
    { label: "Courses", icon: <Book size={18} />, path: "/admin/courses" },
    { label: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { label: "Resources", icon: <FileText size={18} />, path: "/admin/resources" },
  ];
  const navigate = useNavigate();
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
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              pathname === item.path
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:text-blue-400"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

       
          <button
            className=" ml-4 mt-3 flex items-center gap-3 hover:text-red-400"
            onClick={() => {
              navigate("/login");
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        
      </nav>
    </motion.aside>
  );
};
