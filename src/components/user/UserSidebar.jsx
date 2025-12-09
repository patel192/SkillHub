import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

export const UserSidebar = ({ isOpen, toggle }) => {
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/user/dashboard" },
    { label: "My Courses", icon: BookOpen, to: "/user/mycourses" },
    { label: "Profile", icon: User, to: "/user/profile" },
    { label: "Certificates", icon: BadgeCheck, to: "/user/certificates" },
    { label: "Messages", icon: MessageSquare, to: "/user/messages" },
    { label: "Communities", icon: Users, to: "/user/communities" },
    { label: "Settings", icon: Settings, to: "/user/settings" },
    { label: "Leaderboard", icon: Trophy, to: "/user/leaderboard" },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40
        bg-[#0b0d12]/80 backdrop-blur-xl border-r border-white/10
        transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Top — logo + toggle */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
        <h1
          className={`text-xl font-bold bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent transition-all ${
            !isOpen && "opacity-0 w-0 overflow-hidden"
          }`}
        >
          SkillHub
        </h1>

        <button
          onClick={toggle}
          className="p-2 rounded-md hover:bg-white/10 transition"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="mt-6 flex flex-col gap-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              to={item.to}
              className="
                flex items-center gap-4 mx-3 px-3 py-3 rounded-lg
                hover:bg-white/10 transition group
              "
            >
              <Icon
                size={20}
                className="text-indigo-400 group-hover:text-indigo-300"
              />
              {isOpen && (
                <span className="text-gray-200 group-hover:text-white text-sm">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="absolute bottom-6 w-full px-4">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="
            flex items-center gap-4 px-3 py-3 mx-1 w-[90%]
            rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition
          "
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
