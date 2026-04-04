import React, { useState, useEffect } from "react";
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
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/axiosConfig";

// ==========================================
// DESIGN TOKENS
// ==========================================
const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  danger: "var(--error)",
  bg: "var(--bg)",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  surface3: "var(--surface3)",
  border: "var(--border)",
  text: "var(--text)",
  textMuted: "var(--text-muted)",
  textDim: "var(--text-dim)",
  error: "var(--error)",
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
  const { userId } = useAuth();
  const { settings, loading: settingsLoading, updateSettings, refreshSettings } = useSettings();
  
  const [activeTab, setActiveTab] = useState("account");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Local state for form editing (synced with context settings)
  const [localSettings, setLocalSettings] = useState({
    profilePublic: false,
    showActivity: true,
    showProgress: true,
    theme: "dark",
    animationsEnabled: true,
    compactMode: false,
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievementAlerts: true,
    marketingEmails: false
  });

  // User profile data (separate from settings document)
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    username: "",
    phone: "",
    bio: "",
    avatar: "",
    emailVerified: false,
    createdAt: ""
  });

  // Security state (handled separately, not in settings doc)
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false
  });

  const [sessions, setSessions] = useState([]);

  // Sync local settings with context settings when loaded
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        profilePublic: settings.profilePublic ?? false,
        showActivity: settings.showActivity ?? true,
        showProgress: settings.showProgress ?? true,
        theme: settings.theme ?? "dark",
        animationsEnabled: settings.animationsEnabled ?? true,
        compactMode: settings.compactMode ?? false,
        emailNotifications: settings.emailNotifications ?? true,
        pushNotifications: settings.pushNotifications ?? true,
        courseUpdates: settings.courseUpdates ?? true,
        achievementAlerts: settings.achievementAlerts ?? true,
        marketingEmails: settings.marketingEmails ?? false
      });
    }
  }, [settings]);

  // Fetch user profile data (separate from settings)
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUserData = async () => {
    try {
      const res = await apiClient.get(`/user/${userId}`);
      const user = res.data.data;
      setUserData({
        fullname: user.fullname || "",
        email: user.email || "",
        username: user.username || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // ==========================================
  // SETTINGS UPDATE HANDLERS (Using Context)
  // ==========================================

  const handlePrivacySave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        profilePublic: localSettings.profilePublic,
        showActivity: localSettings.showActivity,
        showProgress: localSettings.showProgress
      });
      showToast("Privacy settings saved");
    } catch (err) {
      showToast("Failed to save privacy settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAppearanceSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        theme: localSettings.theme,
        animationsEnabled: localSettings.animationsEnabled,
        compactMode: localSettings.compactMode
      });
      showToast("Appearance preferences saved");
    } catch (err) {
      showToast("Failed to save appearance", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        emailNotifications: localSettings.emailNotifications,
        pushNotifications: localSettings.pushNotifications,
        courseUpdates: localSettings.courseUpdates,
        achievementAlerts: localSettings.achievementAlerts,
        marketingEmails: localSettings.marketingEmails
      });
      showToast("Notification preferences updated");
    } catch (err) {
      showToast("Failed to update notifications", "error");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PROFILE & SECURITY HANDLERS (Separate API)
  // ==========================================

  const saveAccountDetails = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/user/${userId}`, {
        fullname: userData.fullname,
        username: userData.username,
        phone: userData.phone,
        bio: userData.bio
      });
      showToast("Profile updated successfully");
      localStorage.setItem("userName", userData.fullname);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
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

    setSaving(true);
    try {
      const response = await apiClient.post(`/user/${userId}/change-password`, {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      });
      showToast(response.data.message || "Password changed successfully");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrent: false,
        showNew: false
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to change password";
      showToast(message, "error");
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

    setSaving(true);
    try {
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

    setSaving(true);
    try {
      await apiClient.delete(`/user/${userId}`);
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      showToast("Failed to delete account", "error");
      setSaving(false);
    }
  };

  // ==========================================
  // TAB CONTENT RENDERERS
  // ==========================================

  const renderAccountTab = () => (
    <div className="space-y-6">
      <SectionCard title="Profile Information" description="Update your personal details">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2" style={{ borderColor: C.brand }}>
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--surface2)" }}>
                  <UserCog size={32} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{ background: C.brand, color: "var(--bg)" }}>
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
          <InputField label="Full Name" value={userData.fullname} onChange={(e) => setUserData(prev => ({ ...prev, fullname: e.target.value }))} icon={UserCog} />
          <InputField label="Username" value={userData.username} onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))} icon={Globe} />
          <InputField label="Email" type="email" value={userData.email} disabled icon={Mail} />
          <InputField label="Phone Number" type="tel" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} icon={Smartphone} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Bio</label>
          <textarea value={userData.bio} onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={3}
            className="w-full p-3 rounded-xl outline-none resize-none" style={{ background: "var(--surface2)", border: `1px solid ${"var(--border)"}`, color: "var(--text)" }} />
        </div>

        <SaveButton onClick={saveAccountDetails} loading={saving}>Save Changes</SaveButton>
      </SectionCard>

      <SectionCard title="Security" description="Update your password">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <InputField label="Current Password" type={security.showCurrent ? "text" : "password"} value={security.currentPassword} onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))} icon={KeyRound} />
            <button onClick={() => setSecurity(prev => ({ ...prev, showCurrent: !prev.showCurrent }))} className="absolute right-3 top-8" style={{ color: "var(--text-muted)" }}>
              {security.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div />
          <div className="relative">
            <InputField label="New Password" type={security.showNew ? "text" : "password"} value={security.newPassword} onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))} icon={Lock} />
            <button onClick={() => setSecurity(prev => ({ ...prev, showNew: !prev.showNew }))} className="absolute right-3 top-8" style={{ color: "var(--text-muted)" }}>
              {security.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <InputField label="Confirm New Password" type="password" value={security.confirmPassword} onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))} icon={Lock} />
        </div>
        <SaveButton onClick={changePassword} loading={saving}>Update Password</SaveButton>
      </SectionCard>
    </div>
  );

  const renderPrivacyTab = () => (
    <SectionCard title="Privacy Settings" description="Control who can see your activity">
      <div className="space-y-6">
        <CustomToggle label="Make profile public" checked={localSettings.profilePublic} onChange={() => setLocalSettings(prev => ({ ...prev, profilePublic: !prev.profilePublic }))} />
        <CustomToggle label="Show learning activity to others" checked={localSettings.showActivity} onChange={() => setLocalSettings(prev => ({ ...prev, showActivity: !prev.showActivity }))} />
        <CustomToggle label="Show course progress on profile" checked={localSettings.showProgress} onChange={() => setLocalSettings(prev => ({ ...prev, showProgress: !prev.showProgress }))} />
        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <SaveButton onClick={handlePrivacySave} loading={saving}>Save Privacy Settings</SaveButton>
        </div>
      </div>
    </SectionCard>
  );

  const renderAppearanceTab = () => (
    <SectionCard title="Appearance" description="Customize how the application looks">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Application Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[ 
              { key: 'emerald', label: 'Emerald', primary: '#16A880', bg: '#0A0F0D' }, 
              { key: 'royal', label: 'Royal', primary: '#6366F1', bg: '#0A0E1A' }, 
              { key: 'midnight', label: 'Midnight', primary: '#8B5CF6', bg: '#030303' }, 
              { key: 'sunset', label: 'Sunset', primary: '#F97316', bg: '#0F0D0C' },
              { key: 'light', label: 'Light', primary: '#16A880', bg: '#FAFAF9' }
            ].map(({ key, label, primary, bg }) => (
              <motion.button 
                key={key} 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => {
                  setLocalSettings(prev => ({ ...prev, theme: key }));
                  // Immediate feedback
                  document.documentElement.setAttribute('data-theme', key);
                }}
                className="group relative h-24 rounded-2xl overflow-hidden border-2 transition-all"
                style={{ 
                  background: bg, 
                  borderColor: localSettings.theme === key ? primary : "var(--border)",
                  boxShadow: localSettings.theme === key ? `0 0 20px ${primary}30` : 'none'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center" style={{ background: primary }}>
                    {localSettings.theme === key && <Check size={16} className="text-white" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: localSettings.theme === key ? primary : '#888' }}>
                    {label}
                  </span>
                </div>
                {localSettings.theme === key && (
                  <motion.div layoutId="active-theme" className="absolute inset-0 border-2" style={{ borderColor: primary }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>
        <CustomToggle label="Enable animations" checked={localSettings.animationsEnabled} onChange={() => setLocalSettings(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))} />
        <CustomToggle label="Compact mode" checked={localSettings.compactMode} onChange={() => setLocalSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))} />
        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <SaveButton onClick={handleAppearanceSave} loading={saving}>Save Appearance</SaveButton>
        </div>
      </div>
    </SectionCard>
  );

  const renderNotificationsTab = () => (
    <SectionCard title="Notification Preferences" description="Choose what you want to be notified about">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold" style={{ color: "var(--text)" }}>Channels</h4>
          <CustomToggle label="Email notifications" checked={localSettings.emailNotifications} onChange={() => setLocalSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))} />
          <CustomToggle label="Push notifications" checked={localSettings.pushNotifications} onChange={() => setLocalSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))} />
        </div>
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <h4 className="font-semibold" style={{ color: "var(--text)" }}>Content</h4>
          <CustomToggle label="Course updates and announcements" checked={localSettings.courseUpdates} onChange={() => setLocalSettings(prev => ({ ...prev, courseUpdates: !prev.courseUpdates }))} />
          <CustomToggle label="Achievement and streak alerts" checked={localSettings.achievementAlerts} onChange={() => setLocalSettings(prev => ({ ...prev, achievementAlerts: !prev.achievementAlerts }))} />
          <CustomToggle label="Marketing and promotional emails" checked={localSettings.marketingEmails} onChange={() => setLocalSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))} />
        </div>
        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <SaveButton onClick={handleNotificationsSave} loading={saving}>Update Notification Settings</SaveButton>
        </div>
      </div>
    </SectionCard>
  );

  const renderIntegrationsTab = () => (
    <SectionCard title="Connected Accounts" description="Link external accounts">
      <div className="space-y-3">
        {[ { provider: 'github', icon: Github, label: 'GitHub', connected: false, color: '#333' }, { provider: 'google', icon: Mail, label: 'Google', connected: true, color: '#EA4335' } ].map(({ provider, icon: Icon, label, connected, color }) => (
          <motion.div key={provider} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--surface2)", border: `1px solid ${connected ? `${color}40` : "var(--border)"}` }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: `${color}20`, color }}><Icon size={20} /></div>
              <div>
                <p className="font-medium" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{connected ? 'Connected' : 'Not connected'}</p>
              </div>
            </div>
            <button onClick={() => showToast(connected ? `Disconnected from ${label}` : `Connected to ${label}`)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: connected ? 'transparent' : "var(--surface3)", border: `1px solid ${connected ? C.danger : "var(--border)"}`, color: connected ? C.danger : "var(--text)" }}>
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );

  const renderDeactivateTab = () => (
    <div className="space-y-6">
      <SectionCard title="Sign Out Everywhere" description="Terminate all active sessions">
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No active sessions found</p>
          ) : sessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--surface2)" }}>
              <div className="flex items-center gap-3">
                <Monitor size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--text)" }}>{session.device}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{session.location} • {new Date(session.lastActive).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => {}} className="p-2 rounded-lg hover:bg-red-500/20 transition-colors" style={{ color: C.danger }}><LogOut size={16} /></button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone" description="Permanent actions" danger>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <h4 className="font-semibold text-red-400 flex items-center gap-2"><AlertTriangle size={18} />Delete Account</h4>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Once deleted, all your data will be permanently removed.</p>
          </div>
          <SaveButton onClick={deleteAccount} loading={saving} danger><Trash2 size={18} />Delete My Account</SaveButton>
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

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-96" style={{ background: "var(--bg)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 rounded-full" style={{ borderColor: C.brand, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8" style={{ color: "var(--text)", background: "var(--bg)", minHeight: '100vh' }}>
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage your account preferences</p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <motion.button key={tab.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: activeTab === tab.key ? "var(--surface2)" : 'transparent', border: `1px solid ${activeTab === tab.key ? (tab.danger ? C.danger : C.brand) : "var(--border)"}`, color: activeTab === tab.key ? (tab.danger ? C.danger : C.brand) : "var(--text-muted)" }}>
            <tab.icon size={16} />{tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
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