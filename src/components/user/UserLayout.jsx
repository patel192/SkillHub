import React, { useState } from "react";
import { UserNavbar } from "../user/UserNavbar";
import { UserSidebar } from "../user/UserSidebar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0F172A] text-white relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 transition-all duration-300
          ${isSidebarOpen ? "w-64 h-full" : "w-16 h-16"} bg-[#1E1B4B] flex flex-col`}
      >
        {/* Top icons / menu */}
        <div className="flex items-center justify-center h-16">
          <UserSidebar isOpen={isSidebarOpen} />
        </div>

        {/* Full menu when expanded */}
        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto mt-16">
            {/* full menu items */}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <UserNavbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 mt-2 p-2 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
