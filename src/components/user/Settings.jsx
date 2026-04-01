import React, { useState, useEffect, useCallback } from "react";
import {
  UserCog,
  Lock,
  Palette,
  Bell,
  Trash2,
  Github,
  Mail,
  Shield,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Upload,
  Check,
  X,
  AlertTriangle,
  Save,
  Loader2,
  LogOut,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
// ==========================================
// DESIGN TOKENS (Matching Dashboard Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  danger: "#EF4444",
  bg: "#0A0F0D",
  surface: "#111814",
  surface2: "#182219",
  surface3: "#1E2B22",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
  error: "#F87171",
  success: "#4ADE80"
};

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: "-50%" }}
    animate={{ opacity: 1, y: 0, x: "-50%" }}
    exit={{ opacity: 0, y: -20, x: "-50%" }}
    className="fixed top-6 left-1/2 z-50 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl"
    style={{
      background: type === 'error' ? C.danger : C.brand,
      color: "var(--bg)",
      boxShadow: `0 10px 40px ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(22,168,128,0.3)'}`
    }}
  >
    {type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
      <X size={16} />
    </button>
  </motion.div>
);

const CustomToggle = ({ label, checked, onChange, disabled = false }) => (
  <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
    <input 
      type="checkbox" 
      className="hidden peer" 
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <motion.div 
      className="w-12 h-6 rounded-full relative transition-colors duration-300"
      style={{ 
        background: checked ? C.brand : "var(--surface3)",
        border: `1px solid ${checked ? C.brand : "var(--border)"}`
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.div>
    <span style={{ color: "var(--text)" }}>{label}</span>
  </label>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, error, icon: Icon, disabled = false }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 rounded-xl outline-none transition-all disabled:opacity-50"
        style={{
          background: "var(--surface2)",
          border: `1px solid ${error ? C.error : "var(--border)"}`,
          color: "var(--text)",
          paddingLeft: Icon ? '2.5rem' : '1rem'
        }}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs mt-1"
          style={{ color: C.error }}
        >
          {error}
        </motion.p>
      )}
    </div>
  </div>
);

const SectionCard = ({ children, title, description, danger = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-6 space-y-4"
    style={{
      background: "var(--surface)",
      border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : "var(--border)"}`,
      boxShadow: danger ? 'none' : `0 4px 20px rgba(0,0,0,0.2)`
    }}
  >
    <div>
      <h3 className="text-xl font-bold" style={{ 
        fontFamily: "'Fraunces', serif", 
        color: danger ? C.danger : "var(--text)" 
      }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{description}</p>
      )}
    </div>
    {children}
  </motion.div>
);

const SaveButton = ({ onClick, loading, children, danger = false }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={loading}
    className="px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50"
    style={{
      background: danger ? C.danger : `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
      color: danger ? 'white' : "var(--bg)",
      boxShadow: danger ? 'none' : `0 4px 20px ${C.brand}40`
    }}
  >
    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
    {children}
  </motion.button>
);

// ==========================================
// MAIN SETTINGS COMPONENT
// ==========================================

export const Settings = () => {
  const {userId} = useAuth();
  
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // User Data State
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    username: "",
    phone: "",
    bio: "",
    avatar: "",
    emailVerified: false,
    twoFactorEnabled: false,
    createdAt: ""
  });

  // Settings State
  const [settings, setSettings] = useState({
    // Privacy
    profilePublic: false,
    showActivity: true,
    showProgress: true,
    
    // Appearance
    theme: "dark", // 'light' | 'dark' | 'system'
    animationsEnabled: true,
    compactMode: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievementAlerts: true,
    marketingEmails: false
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false
  });

  // Sessions State
  const [sessions, setSessions] = useState([]);

  // Fetch all settings on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userRes, settingsRes] = await Promise.all([
        apiClient.get(`/user/${userId}`),
        apiClient.get(`/user/${userId}/settings`)
      ]);

      const user = userRes.data.data;
      const prefs = settingsRes.data.data || {};

      setUserData({
        fullname: user.fullname || "",
        email: user.email || "",
        username: user.username || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        emailVerified: user.emailVerified || false,
        twoFactorEnabled: user.twoFactorEnabled || false,
        createdAt: user.createdAt
      });

      setSettings(prev => ({
        ...prev,
        ...prefs
      }));

      // Apply theme immediately on load
      applyTheme(prefs.theme || 'dark');
    } catch (err) {
      showToast("Failed to load settings", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // THEME MANAGEMENT (Critical for App Integration)
  // ==========================================
  
  const applyTheme = (theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && systemDark);
    
    if (isDark) {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', "var(--bg)");
      root.style.setProperty('--text-primary', "var(--text)");
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--text-primary', '#0f172a');
    }
    
    // Store in localStorage for persistence across sessions
    localStorage.setItem('theme', theme);
    localStorage.setItem('animationsEnabled', settings.animationsEnabled);
  };

  const handleThemeChange = (newTheme) => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    applyTheme(newTheme);
  };

  // ==========================================
  // API HANDLERS
  // ==========================================

  const saveAccountDetails = async () => {
    try {
      setSaving(true);
      await apiClient.put(`/user/${userId}`, {
        fullname: userData.fullname,
        username: userData.username,
        phone: userData.phone,
        bio: userData.bio
      });
      showToast("Profile updated successfully");
      
      // Update localStorage display name
      localStorage.setItem("userName", userData.fullname);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setSaving(true);
      await apiClient.put(`/user/${userId}/settings`, {
        profilePublic: settings.profilePublic,
        showActivity: settings.showActivity,
        showProgress: settings.showProgress
      });
      showToast("Privacy settings saved");
    } catch (err) {
      showToast("Failed to save privacy settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveAppearanceSettings = async () => {
    try {
      setSaving(true);
      await apiClient.put(`/user/${userId}/settings`, {
        theme: settings.theme,
        animationsEnabled: settings.animationsEnabled,
        compactMode: settings.compactMode
      });
      applyTheme(settings.theme);
      showToast("Appearance preferences saved");
    } catch (err) {
      showToast("Failed to save appearance", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setSaving(true);
      await apiClient.put(`/user/${userId}/settings`, {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        courseUpdates: settings.courseUpdates,
        achievementAlerts: settings.achievementAlerts,
        marketingEmails: settings.marketingEmails
      });
      showToast("Notification preferences updated");
    } catch (err) {
      showToast("Failed to update notifications", "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
  // Client-side validation
  if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
    showToast("All password fields are required", "error");
    return;
  }

  if (security.newPassword !== security.confirmPassword) {
    showToast("New passwords do not match", "error");
    return;
  }

  if (security.newPassword.length < 8) {
    showToast("Password must be at least 8 characters", "error");
    return;
  }

  // Password strength check
  const hasUpperCase = /[A-Z]/.test(security.newPassword);
  const hasLowerCase = /[a-z]/.test(security.newPassword);
  const hasNumbers = /\d/.test(security.newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(security.newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    showToast("Password must contain uppercase, lowercase, and numbers", "error");
    return;
  }

  try {
    setSaving(true);
    const response = await apiClient.post(`/user/${userId}/change-password`, {
      currentPassword: security.currentPassword,
      newPassword: security.newPassword
    });

    showToast(response.data.message || "Password changed successfully");
    
    // Clear form
    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showCurrent: false,
      showNew: false,
      showConfirm: false
    });

    // Optional: Log out other devices
    const logoutOthers = window.confirm("Keep other devices logged in?");
    if (!logoutOthers) {
      await apiClient.post(`/user/${userId}/logout-all`);
      showToast("Logged out from all other devices");
    }

  } catch (err) {
    const message = err.response?.data?.message || "Failed to change password";
    const status = err.response?.status;
    
    // Specific error messages
    if (status === 401) {
      showToast("Current password is incorrect", "error");
    } else if (status === 429) {
      showToast("Too many attempts. Please try again later.", "error");
    } else if (status === 400 && message.includes("reuse")) {
      showToast("Cannot reuse a previous password", "error");
    } else {
      showToast(message, "error");
    }
  } finally {
    setSaving(false);
  }
};

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setSaving(true);
      const res = await apiClient.post(`/user/${userId}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUserData(prev => ({ ...prev, avatar: res.data.data.avatarUrl }));
      showToast("Avatar updated");
    } catch (err) {
      showToast("Failed to upload avatar", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.prompt("Type 'DELETE' to confirm account deletion:");
    if (confirmed !== 'DELETE') {
      showToast("Deletion cancelled", "error");
      return;
    }

    try {
      setSaving(true);
      await apiClient.delete(`/user/${userId}`);
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      showToast("Failed to delete account", "error");
      setSaving(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      await apiClient.delete(`/user/${userId}/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      showToast("Session terminated");
    } catch (err) {
      showToast("Failed to terminate session", "error");
    }
  };

  // ==========================================
  // TAB CONTENT RENDERERS
  // ==========================================

  const renderAccountTab = () => (
    <div className="space-y-6">
      <SectionCard 
        title="Profile Information" 
        description="Update your personal details and public profile"
      >
        {/* Avatar Upload */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden border-2"
              style={{ borderColor: C.brand }}
            >
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--surface2)" }}>
                  <UserCog size={32} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
            </div>
            <label 
              className="absolute -bottom-1 -right-1 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform"
              style={{ background: C.brand, color: "var(--bg)" }}
            >
              <Upload size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--text)" }}>{userData.fullname || 'User'}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Member since {new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            value={userData.fullname}
            onChange={(e) => setUserData(prev => ({ ...prev, fullname: e.target.value }))}
            icon={UserCog}
          />
          <InputField
            label="Username"
            value={userData.username}
            onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
            icon={Globe}
          />
          <InputField
            label="Email"
            type="email"
            value={userData.email}
            disabled
            icon={Mail}
          />
          <InputField
            label="Phone Number"
            type="tel"
            value={userData.phone}
            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
            icon={Smartphone}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Bio</label>
          <textarea
            value={userData.bio}
            onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full p-3 rounded-xl outline-none resize-none"
            style={{
              background: "var(--surface2)",
              border: `1px solid ${"var(--border)"}`,
              color: "var(--text)"
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <div className={`w-2 h-2 rounded-full ${userData.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
          Email {userData.emailVerified ? 'verified' : 'not verified'}
          {!userData.emailVerified && (
            <button 
              onClick={() => apiClient.post(`/user/${userId}/verify-email`)}
              className="ml-2 underline hover:text-white transition-colors"
            >
              Resend verification
            </button>
          )}
        </div>

        <SaveButton onClick={saveAccountDetails} loading={saving}>
          Save Changes
        </SaveButton>
      </SectionCard>

      {/* Password Change */}
      <SectionCard title="Security" description="Update your password">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <InputField
              label="Current Password"
              type={security.showCurrent ? "text" : "password"}
              value={security.currentPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
              icon={KeyRound}
            />
            <button
              onClick={() => setSecurity(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
              className="absolute right-3 top-8"
              style={{ color: "var(--text-muted)" }}
            >
              {security.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div />
          <div className="relative">
            <InputField
              label="New Password"
              type={security.showNew ? "text" : "password"}
              value={security.newPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
              icon={Lock}
            />
            <button
              onClick={() => setSecurity(prev => ({ ...prev, showNew: !prev.showNew }))}
              className="absolute right-3 top-8"
              style={{ color: "var(--text-muted)" }}
            >
              {security.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <InputField
            label="Confirm New Password"
            type="password"
            value={security.confirmPassword}
            onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
            icon={Lock}
          />
        </div>
        <SaveButton onClick={changePassword} loading={saving}>
          Update Password
        </SaveButton>
      </SectionCard>
    </div>
  );

  const renderPrivacyTab = () => (
    <SectionCard 
      title="Privacy Settings" 
      description="Control who can see your activity and profile"
    >
      <div className="space-y-6">
        <CustomToggle
          label="Make profile public"
          checked={settings.profilePublic}
          onChange={() => setSettings(prev => ({ ...prev, profilePublic: !prev.profilePublic }))}
        />
        <CustomToggle
          label="Show learning activity to others"
          checked={settings.showActivity}
          onChange={() => setSettings(prev => ({ ...prev, showActivity: !prev.showActivity }))}
        />
        <CustomToggle
          label="Show course progress on profile"
          checked={settings.showProgress}
          onChange={() => setSettings(prev => ({ ...prev, showProgress: !prev.showProgress }))}
        />
        
        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <SaveButton onClick={savePrivacySettings} loading={saving}>
            Save Privacy Settings
          </SaveButton>
        </div>
      </div>
    </SectionCard>
  );

  const renderAppearanceTab = () => (
    <SectionCard 
      title="Appearance" 
      description="Customize how the application looks and feels"
    >
      <div className="space-y-6">
        {/* Theme Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'light', icon: Sun, label: 'Light' },
              { key: 'dark', icon: Moon, label: 'Dark' },
              { key: 'system', icon: Monitor, label: 'System' }
            ].map(({ key, icon: Icon, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange(key)}
                className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                style={{
                  background: settings.theme === key ? C.brand : "var(--surface2)",
                  border: `1px solid ${settings.theme === key ? C.brand : "var(--border)"}`,
                  color: settings.theme === key ? "var(--bg)" : "var(--text)"
                }}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <CustomToggle
          label="Enable animations"
          checked={settings.animationsEnabled}
          onChange={() => setSettings(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))}
        />
        
        <CustomToggle
          label="Compact mode (reduced spacing)"
          checked={settings.compactMode}
          onChange={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
        />

        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <SaveButton onClick={saveAppearanceSettings} loading={saving}>
            Save Appearance
          </SaveButton>
        </div>
      </div>
    </SectionCard>
  );

  const renderNotificationsTab = () => (
    <SectionCard 
      title="Notification Preferences" 
      description="Choose what you want to be notified about"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold" style={{ color: "var(--text)" }}>Channels</h4>
          <CustomToggle
            label="Email notifications"
            checked={settings.emailNotifications}
            onChange={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
          />
          <CustomToggle
            label="Push notifications (browser)"
            checked={settings.pushNotifications}
            onChange={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
          />
        </div>

        <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <h4 className="font-semibold" style={{ color: "var(--text)" }}>Content</h4>
          <CustomToggle
            label="Course updates and announcements"
            checked={settings.courseUpdates}
            onChange={() => setSettings(prev => ({ ...prev, courseUpdates: !prev.courseUpdates }))}
          />
          <CustomToggle
            label="Achievement and streak alerts"
            checked={settings.achievementAlerts}
            onChange={() => setSettings(prev => ({ ...prev, achievementAlerts: !prev.achievementAlerts }))}
          />
          <CustomToggle
            label="Marketing and promotional emails"
            checked={settings.marketingEmails}
            onChange={() => setSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
          />
        </div>

        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <SaveButton onClick={saveNotificationSettings} loading={saving}>
            Update Notification Settings
          </SaveButton>
        </div>
      </div>
    </SectionCard>
  );

  const renderIntegrationsTab = () => (
    <SectionCard 
      title="Connected Accounts" 
      description="Link external accounts for easier login"
    >
      <div className="space-y-3">
        {[
          { 
            provider: 'github', 
            icon: Github, 
            label: 'GitHub', 
            connected: false,
            color: '#333'
          },
          { 
            provider: 'google', 
            icon: Mail, // Using Mail as Google icon substitute
            label: 'Google', 
            connected: true,
            color: '#EA4335'
          }
        ].map(({ provider, icon: Icon, label, connected, color }) => (
          <motion.div
            key={provider}
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "var(--surface2)",
              border: `1px solid ${connected ? `${color}40` : "var(--border)"}`
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ background: `${color}20`, color }}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="font-medium" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (connected) {
                  // Disconnect logic
                  showToast(`Disconnected from ${label}`);
                } else {
                  // OAuth connect logic
                  window.location.href = `/api/auth/${provider}`;
                }
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: connected ? 'transparent' : "var(--surface3)",
                border: `1px solid ${connected ? C.danger : "var(--border)"}`,
                color: connected ? C.danger : "var(--text)"
              }}
            >
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );

  const renderDeactivateTab = () => (
    <div className="space-y-6">
      <SectionCard 
        title="Sign Out Everywhere" 
        description="Terminate all active sessions across devices"
      >
        <div className="space-y-3">
          {sessions.map(session => (
            <div 
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: "var(--surface2)" }}
            >
              <div className="flex items-center gap-3">
                <Monitor size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--text)" }}>{session.device}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {session.location} • {new Date(session.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => terminateSession(session.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                style={{ color: C.danger }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
              No active sessions found
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard 
        title="Danger Zone" 
        description="Permanent actions that cannot be undone"
        danger
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <h4 className="font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle size={18} />
              Delete Account
            </h4>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              Once deleted, all your data including courses, certificates, and progress will be permanently removed. This action cannot be undone.
            </p>
          </div>
          
          <SaveButton onClick={deleteAccount} loading={saving} danger>
            <Trash2 size={18} />
            Delete My Account Permanently
          </SaveButton>
        </div>
      </SectionCard>
    </div>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================

  const tabs = [
    { key: "account", label: "Account", icon: UserCog },
    { key: "privacy", label: "Privacy", icon: Lock },
    { key: "appearance", label: "Appearance", icon: Palette },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "integrations", label: "Integrations", icon: Shield },
    { key: "deactivate", label: "Danger Zone", icon: Trash2, danger: true }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96" style={{ background: "var(--bg)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 rounded-full"
          style={{ borderColor: C.brand, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8" style={{ color: "var(--text)", background: "var(--bg)", minHeight: '100vh' }}>
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Manage your account preferences & customization
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? "var(--surface2)" : 'transparent',
              border: `1px solid ${activeTab === tab.key ? (tab.danger ? C.danger : C.brand) : "var(--border)"}`,
              color: activeTab === tab.key ? (tab.danger ? C.danger : C.brand) : "var(--text-muted)"
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "account" && renderAccountTab()}
          {activeTab === "privacy" && renderPrivacyTab()}
          {activeTab === "appearance" && renderAppearanceTab()}
          {activeTab === "notifications" && renderNotificationsTab()}
          {activeTab === "integrations" && renderIntegrationsTab()}
          {activeTab === "deactivate" && renderDeactivateTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Settings;