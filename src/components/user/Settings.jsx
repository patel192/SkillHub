import React, { useState } from "react";
import {
  FaUserCog,
  FaLock,
  FaPalette,
  FaBell,
  FaTrashAlt,
  FaGithub,
  FaGoogle,
  FaDiscord,
  FaLink,
} from "react-icons/fa";
import { motion } from "framer-motion";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  // ✅ Custom glowing checkbox/toggle
  const CustomToggle = ({ label }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <input type="checkbox" className="hidden peer" />
      <div
        className="w-6 h-6 rounded-md border-2 border-gray-400 dark:border-gray-600 
        peer-checked:border-green-400 flex items-center justify-center 
        transition-all duration-300 peer-checked:bg-green-500 
        peer-checked:shadow-[0_0_10px_2px_rgba(34,197,94,0.8)]"
      >
        <svg
          className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-800 dark:text-gray-200 group-hover:text-green-400 transition">
        {label}
      </span>
    </label>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                type="text"
                placeholder="Full Name"
                className="p-3 rounded bg-zinc-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded bg-zinc-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Username"
                className="p-3 rounded bg-zinc-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="p-3 rounded bg-zinc-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white rounded px-6 py-2 hover:scale-110 duration-300 hover:bg-green-500 shadow-lg">
              Save Changes
            </button>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
            <CustomToggle label="Make profile public" />
            <CustomToggle label="Enable activity tracking" />
            <button className="bg-blue-600 text-white rounded px-6 py-2 hover:scale-110 duration-300 hover:bg-green-500 shadow-lg">
              Save Privacy Preferences
            </button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Theme & Appearance</h3>
            <select className="p-3 rounded bg-zinc-800 text-white w-full">
              <option value="system">System Default</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
            <CustomToggle label="Enable animations" />
            <button className="bg-blue-600 text-white rounded px-6 py-2 hover:scale-110 duration-300 hover:bg-green-500 shadow-lg">
              Save Appearance Settings
            </button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <CustomToggle label="Email Notifications" />
            <CustomToggle label="Push Notifications" />
            <CustomToggle label="Activity Alerts" />
            <button className="bg-blue-600 text-white rounded px-6 py-2 hover:scale-110 duration-300 hover:bg-green-500 shadow-lg">
              Update Preferences
            </button>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connected Accounts</h3>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <button className="bg-black text-white px-4 py-2 rounded flex items-center hover:scale-105 duration-300">
                <FaGithub className="mr-2" /> Connect GitHub
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:scale-105 duration-300">
                <FaGoogle className="mr-2" /> Connect Google
              </button>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center hover:scale-105 duration-300">
                <FaDiscord className="mr-2" /> Connect Discord
              </button>
            </div>
          </div>
        );

      case "deactivate":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <p>Deleting your account is permanent and cannot be undone.</p>
            <button className="bg-red-600 text-white px-6 py-2 rounded flex items-center hover:scale-110 duration-300 hover:bg-red-700 shadow-lg">
              <FaTrashAlt className="mr-2" /> Delete My Account
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        ⚙️ User Settings
      </h2>

      {/* ✅ Glowing tab options with purple-cyan gradient */}
      <div className="flex flex-wrap gap-6 mb-6 justify-center">
        {[
          { key: "account", icon: <FaUserCog />, label: "Account" },
          { key: "privacy", icon: <FaLock />, label: "Privacy" },
          { key: "appearance", icon: <FaPalette />, label: "Appearance" },
          { key: "notifications", icon: <FaBell />, label: "Notifications" },
          { key: "integrations", icon: <FaLink />, label: "Integrations" },
          { key: "deactivate", icon: <FaTrashAlt />, label: "Deactivate" },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="w-28"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`flex flex-col justify-center items-center rounded-2xl h-20 
              bg-gradient-to-r from-purple-600 to-cyan-400 cursor-pointer 
              transition-transform duration-500 shadow-lg 
              ${activeTab === tab.key ? "shadow-[0_0_25px_4px_rgba(128,0,255,0.7)]" : ""}`}
            >
              {tab.icon}
              <span className="text-sm font-medium mt-1">{tab.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div>{renderTabContent()}</div>
    </div>
  );
};
