import React, { useState, useCallback } from "react";
import { UserNavbar } from "../user/UserNavbar";
import { UserSidebar } from "../user/UserSidebar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Stable callback → does NOT get recreated every render
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-[#05070b] text-white overflow-hidden">

      {/* Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* Main */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <UserNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 bg-[#080b12] border-t border-white/5 rounded-tl-2xl shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
