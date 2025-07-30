import React, { useState } from "react";
import { UserNavbar } from "../user/UserNavbar";
import { UserSidebar } from "../user/UserSidebar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A] text-white">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <UserSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <UserNavbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <main className=" mt-10 p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
