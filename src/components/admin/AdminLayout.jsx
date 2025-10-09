import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // closed by default on small
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Track screen size changes (for responsive behavior)
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto open sidebar for desktop
  useEffect(() => {
    if (isDesktop) setIsSidebarOpen(true);
  }, [isDesktop]);

  return (
    <div className="flex h-screen bg-[#0F172A] text-white relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-[60] transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          w-64 bg-[#1E293B]`}
      >
        <AdminSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Overlay (visible only when sidebar open on mobile) */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content (no shrinking on overlay) */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        {/* Navbar */}
        <AdminNavbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <main className="mt-16 p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
