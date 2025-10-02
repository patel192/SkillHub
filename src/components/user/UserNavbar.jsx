import React, { useEffect, useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export const UserNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");
  const [avatar, setavatar] = useState("")
  const token = localStorage.getItem("token");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ✅ Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/notifications/${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  };
  const fetchUser = async () => {
    try{
    const user = await axios.get(`/user/${userId}`,{
      headers:{ Authorization: `Bearer ${token}` }
    });
    console.log(user.data.data.avatar)
    setavatar(user.data.data.avatar)
    }catch(err){
    console.error(err)
    }
  }
useEffect(() => {
  fetchUser()
})
  useEffect(() => {
    if (notifOpen) {
      fetchNotifications();
    }
  }, [notifOpen]);

  // ✅ Mark as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/read`,{
      headers:{ Authorization: `Bearer ${token}` }
    });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("❌ Error marking as read:", err);
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`z-50 fixed top-0 left-0 right-0 h-16 px-6 bg-[#0F172A]/80 backdrop-blur-md border-b border-blue-500/20 shadow-lg flex items-center justify-between transition-all duration-300 ${
        isSidebarOpen ? "md:ml-64" : "ml-0"
      }`}
    >
      {/* Sidebar Toggle */}
      <button onClick={toggleSidebar} className="text-white focus:outline-none">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Title */}
      <h1 className="text-xl font-bold tracking-wide text-blue-400">SkillHub Dashboard</h1>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-white">
        {/* Time */}
        <span className="text-sm text-gray-300">{formattedTime}</span>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Bell size={20} />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 mt-2 w-80 bg-[#1E293B] border border-blue-600 rounded-lg shadow-md p-3 max-h-96 overflow-y-auto z-50"
            >
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`p-3 rounded-lg mb-2 cursor-pointer ${
                      n.read ? "bg-gray-700" : "bg-indigo-600"
                    }`}
                  >
                    {n.message}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No notifications yet.</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            onClick={() => setDropdownOpen(!dropdownOpen)}
            src={avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full cursor-pointer border border-blue-500"
          />
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 mt-2 w-40 bg-[#1E293B] border border-blue-600 rounded-lg shadow-md py-2 z-10"
            >
              <button
                onClick={() => alert("Logging out...")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-blue-600"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
