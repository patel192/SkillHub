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

  const CustomToggle = ({ label }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" className="hidden peer" />

      <div className="w-5 h-5 rounded-md border border-white/20 peer-checked:bg-indigo-500 peer-checked:border-indigo-400 transition-all" />

      <span className="text-gray-300">{label}</span>
    </label>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Account Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="p-3 bg-[#0f1117] border border-white/10 rounded-xl outline-none focus:border-indigo-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 bg-[#0f1117] border border-white/10 rounded-xl outline-none focus:border-indigo-400"
              />

              <input
                type="text"
                placeholder="Username"
                className="p-3 bg-[#0f1117] border border-white/10 rounded-xl outline-none focus:border-indigo-400"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="p-3 bg-[#0f1117] border border-white/10 rounded-xl outline-none focus:border-indigo-400"
              />
            </div>

            <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition">
              Save Changes
            </button>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Privacy Settings</h3>

            <CustomToggle label="Make profile public" />
            <CustomToggle label="Activity tracking" />

            <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition">
              Save Privacy Settings
            </button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Appearance</h3>

            <select className="p-3 w-full rounded-xl bg-[#0f1117] border border-white/10 focus:border-indigo-400 outline-none">
              <option>System Default</option>
              <option>Light</option>
              <option>Dark</option>
            </select>

            <CustomToggle label="Enable animations" />

            <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition">
              Save Appearance
            </button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Notifications</h3>

            <CustomToggle label="Email Notifications" />
            <CustomToggle label="Push Notifications" />
            <CustomToggle label="Activity Alerts" />

            <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition">
              Update Notification Settings
            </button>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Connected Accounts</h3>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-[#0f1117] rounded-xl border border-white/10 hover:border-indigo-400 transition">
                <FaGithub /> Connect GitHub
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-[#0f1117] rounded-xl border border-white/10 hover:border-indigo-400 transition">
                <FaGoogle /> Connect Google
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-[#0f1117] rounded-xl border border-white/10 hover:border-indigo-400 transition">
                <FaDiscord /> Connect Discord
              </button>
            </div>
          </div>
        );

      case "deactivate":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>

            <p className="text-gray-400 text-sm">
              Once deleted, your account cannot be recovered.
            </p>

            <button className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition flex items-center gap-2">
              <FaTrashAlt /> Delete My Account
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account preferences & customization.
        </p>
      </motion.div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: "account", label: "Account", icon: <FaUserCog /> },
          { key: "privacy", label: "Privacy", icon: <FaLock /> },
          { key: "appearance", label: "Appearance", icon: <FaPalette /> },
          { key: "notifications", label: "Notifications", icon: <FaBell /> },
          { key: "integrations", label: "Integrations", icon: <FaLink /> },
          { key: "deactivate", label: "Deactivate", icon: <FaTrashAlt /> },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition
              ${
                activeTab === tab.key
                  ? "bg-[#1a1d26] border-white/20"
                  : "bg-[#0f1117] border-white/10 hover:border-white/20"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* CONTENT CARD */}
      <motion.div
        className="bg-[#11141b] border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};
