import React, { useState } from "react";
import { UserNavbar } from "../user/UserNavbar";
import { UserSidebar } from "../user/UserSidebar";

export const UserLayout = ({ children }) => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
     <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <UserNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
