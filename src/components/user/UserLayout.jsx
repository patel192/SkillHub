// ==========================================
// UserLayout.jsx - Main Layout Component
// ==========================================

import React, { useState, useCallback, useEffect } from "react";
import { UserNavbar } from "./UserNavbar";
import { UserSidebar } from "./UserSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((p) => !p), []);

  // Close sidebar on mobile route change
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div
      className="min-h-screen overflow-hidden selection:bg-teal-500/20"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--brand); opacity: 0.4; border-radius: 99px; }
      `}</style>

      {/* Ambient background glows — theme-aware */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[130px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "var(--glow-primary)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full blur-[110px] translate-x-1/3 translate-y-1/3"
          style={{ background: "var(--glow-secondary)" }}
        />
      </div>

      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "var(--backdrop)", backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <UserSidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content area — shifts with sidebar */}
      <motion.div
        className="flex flex-col min-h-screen relative z-10"
        animate={{ marginLeft: isMobile ? 0 : isSidebarOpen ? "16rem" : "5rem" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        <UserNavbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          style={{ background: "var(--surface-alpha)" }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default UserLayout;