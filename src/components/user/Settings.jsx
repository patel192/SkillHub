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
} from "react-icons/fa";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="input" />
              <input type="email" placeholder="Email" className="input" />
              <input type="text" placeholder="Username" className="input" />
              <input type="tel" placeholder="Phone Number" className="input" />
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="toggle" />
              <span>Make profile public</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="toggle" />
              <span>Enable activity tracking</span>
            </label>
            <button className="btn-primary">Save Privacy Preferences</button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Theme & Appearance</h3>
            <select className="input">
              <option value="system">System Default</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="toggle" />
              <span>Enable animations</span>
            </label>
            <button className="btn-primary">Save Appearance Settings</button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="toggle" />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="toggle" />
              <span>Push Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="toggle" />
              <span>Activity Alerts</span>
            </label>
            <button className="btn-primary">Update Preferences</button>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connected Accounts</h3>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <button className="btn-social bg-black text-white">
                <FaGithub className="mr-2" /> Connect GitHub
              </button>
              <button className="btn-social bg-red-600 text-white">
                <FaGoogle className="mr-2" /> Connect Google
              </button>
              <button className="btn-social bg-indigo-500 text-white">
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
            <button className="btn-danger">
              <FaTrashAlt className="mr-2" /> Delete My Account
            </button>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        ⚙️ User Settings
      </h2>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("account")}
          className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
        >
          <FaUserCog className="mr-1" /> Account
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
        >
          <FaLock className="mr-1" /> Privacy
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`tab-btn ${activeTab === "appearance" ? "active" : ""}`}
        >
          <FaPalette className="mr-1" /> Appearance
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
        >
          <FaBell className="mr-1" /> Notifications
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`tab-btn ${activeTab === "integrations" ? "active" : ""}`}
        >
          🔗 Integrations
        </button>
        <button
          onClick={() => setActiveTab("deactivate")}
          className={`tab-btn ${activeTab === "deactivate" ? "active" : ""}`}
        >
          🗑️ Deactivate
        </button>
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
};
