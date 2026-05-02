import { useSelector,useDispatch } from "react-redux";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Book,
  Users,
  FileText,
  FileArchiveIcon,
  ChevronLeft,
  ChevronRight,
  Code,
  ShieldCheck,
  Settings,
  Bell
} from "lucide-react";
import {logout} from "../../redux/features/auth/authSlice"

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
};

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/admindashboard" },
  { label: "Courses", icon: Book, to: "/admin/courses" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Resources", icon: FileText, to: "/admin/resources" },
  { label: "Reports", icon: FileArchiveIcon, to: "/admin/reports" },
  { label: "Communities", icon: Users, to: "/admin/communities" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

export const AdminSidebar = ({ isOpen, toggle, isMobile }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { logout } = useSelector((state) => state.auth);

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed top-0 left-0 h-full w-72 z-[60] shadow-2xl"
            style={{ background: `var(--surface)`, borderRight: `1px solid var(--border)` }}
          >
            <SidebarContent isOpen={true} toggle={toggle} currentPath={location.pathname} onLogout={logout} isMobile={true} />
          </motion.aside>
        )}
      </AnimatePresence>

      {!isMobile && (
        <motion.aside
          animate={{ width: isOpen ? "16rem" : "5rem" }}
          className="fixed top-0 left-0 h-full z-40"
          style={{ background: `var(--surface)`, borderRight: `1px solid var(--border)` }}
        >
          <SidebarContent isOpen={isOpen} toggle={toggle} currentPath={location.pathname} onLogout={logout} isMobile={false} />
        </motion.aside>
      )}
    </>
  );
};

const SidebarContent = ({ isOpen, toggle, currentPath, onLogout, isMobile }) => {
  const [hovered, setHovered] = useState(null);
  const isActive = (path) => currentPath === path;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link to="/admin/admindashboard" className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 180 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, var(--brand), var(--brand-light))` }}
          >
            <ShieldCheck className="w-5 h-5 text-white" />
          </motion.div>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif", color: 'var(--text)' }}>
                  Admin<span style={{ color: C.brand }}>Hub</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        
        <button onClick={toggle} className="p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity">
           {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {MENU_ITEMS.map((item, idx) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: active ? `rgba(var(--brand-rgb), 0.15)` : hovered === idx ? `var(--surface2)` : 'transparent',
              }}
            >
              {active && <motion.div layoutId="adminActive" className="absolute left-0 w-1 h-5 rounded-r-full" style={{ background: C.brand }} />}
              <Icon size={19} style={{ color: active ? C.brand : 'var(--text-muted)' }} />
              {isOpen && (
                <span className="text-[13px] font-medium transition-colors" style={{ color: active ? 'var(--text)' : 'var(--text-muted)' }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => { dispatch(() => logout()) }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={18} />
          {isOpen && <span className="text-sm font-bold">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
