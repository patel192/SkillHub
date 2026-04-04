import React, { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Auth Guard - Only admins allowed
  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      navigate("/login");
    }
  }, [user, role, authLoading, navigate]);

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

  if (authLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
         <div className="w-12 h-12 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: "var(--brand)" }} />
       </div>
     );
  }

  // If not admin, don't render content (useEffect will handle redirect)
  if (!user || role !== "admin") return null;

  return (
    <div
      className="min-h-screen overflow-hidden selection:bg-indigo-500/20"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--brand); opacity: 0.4; border-radius: 99px; }
      `}</style>

      {/* Ambient background glows — Admin specific colors or synced themes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[140px] -translate-x-1/3 -translate-y-1/3 opacity-30"
          style={{ background: "var(--brand)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 opacity-20"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-50 lg:hidden backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.4)" }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <motion.div
        className="flex flex-col min-h-screen relative z-10"
        animate={{ marginLeft: isMobile ? 0 : isSidebarOpen ? "16rem" : "5rem" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
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

export default AdminLayout;
