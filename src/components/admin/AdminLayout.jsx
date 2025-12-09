import React, { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default closed on small
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // keep a single source of truth for sidebar widths (pixels)
  const SIDEBAR_OPEN_PX = 256; // w-64 = 16rem = 256px
  const SIDEBAR_COLLAPSED_PX = 80; // approximate collapsed width (5rem)

  // responsive resize handler
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // auto-open on desktop
  useEffect(() => {
    if (isDesktop) setIsSidebarOpen(true);
    else setIsSidebarOpen(false);
  }, [isDesktop]);

  // compute left offset applied to header + main so they stay aligned with sidebar
  const leftOffset = isDesktop
    ? isSidebarOpen
      ? SIDEBAR_OPEN_PX
      : SIDEBAR_COLLAPSED_PX
    : 0;

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white relative overflow-hidden">
      {/* Sidebar — still fixed so it overlays on mobile */}
      <div
        className={`fixed top-0 left-0 h-full z-[60] transition-transform duration-300`}
        style={{
          width: isSidebarOpen ? SIDEBAR_OPEN_PX : SIDEBAR_COLLAPSED_PX,
          transform: isDesktop ? "translateX(0)" : isSidebarOpen ? "translateX(0)" : `translateX(-100%)`,
        }}
      >
        <AdminSidebar isOpen={isSidebarOpen} />
      </div>

      {/* optional mobile overlay when sidebar open */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main wrapper — we apply leftOffset to align with sidebar, and top padding for navbar */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: leftOffset,
        }}
      >
        {/* Navbar receives leftOffset so it also visually aligns */}
        <AdminNavbar
          toggleSidebar={() => setIsSidebarOpen((s) => !s)}
          isSidebarOpen={isSidebarOpen}
          leftOffset={leftOffset}
        />

        {/* Page content — add top padding equal to navbar height so Outlet not hidden */}
        <main
          className="flex-1 overflow-y-auto transition-all duration-300"
          style={{
            paddingTop: 64, // matches navbar height (h-16). adjust if navbar height changes
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 24,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
