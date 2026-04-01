import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/axiosConfig"
import toast from "react-hot-toast";
import { 
  User, 
  Activity, 
  Award, 
  Edit3, 
  Save, 
  Camera, 
  Mail, 
  FileText, 
  Loader2,
  MapPin,
  Link as LinkIcon,
  Calendar,
  CheckCircle2,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
// ==========================================
// DESIGN TOKENS (Matching Dashboard Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
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
};

// ==========================================
// CLOUDINARY UPLOAD
// ==========================================
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "My_Images");
  data.append("cloud_name", "dfaou6haj");

  try {
    const upload = await fetch(
      "https://api.cloudinary.com/v1_1/dfaou6haj/image/upload",
      { method: "POST", body: data }
    );
    const res = await upload.json();
    return res.secure_url;
  } catch (err) {
    throw new Error("Failed to upload image");
  }
};

// ==========================================
// LOADING COMPONENT (Fixes stuck loading)
// ==========================================
const ProfileSkeleton = () => (
  <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: "var(--bg)" }}>
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className="rounded-2xl p-6 space-y-6 animate-pulse"
            style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="w-28 h-28 rounded-full"
                style={{ background: "var(--surface2)" }}
              />
              <div className="h-6 w-32 rounded" style={{ background: "var(--surface2)" }} />
              <div className="h-4 w-48 rounded" style={{ background: "var(--surface3)" }} />
            </div>
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-xl" style={{ background: "var(--surface2)" }} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="lg:col-span-2">
          <div 
            className="rounded-2xl p-6 min-h-[400px] animate-pulse"
            style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
          >
            <div className="h-8 w-48 rounded mb-6" style={{ background: "var(--surface2)" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 rounded" style={{ background: "var(--surface3)" }} />
                  <div className="h-10 rounded-xl" style={{ background: "var(--surface2)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// EMPTY STATES
// ==========================================
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{ background: `${C.brand}15`, border: `1px solid ${"var(--border)"}` }}
    >
      <Icon size={28} style={{ color: C.brand }} />
    </div>
    <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>{title}</h3>
    <p className="text-sm text-center max-w-sm" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
  </div>
);

// ==========================================
// TAB BUTTON COMPONENT
// ==========================================
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
    style={{
      background: active ? `${C.brand}15` : "transparent",
      borderLeft: active ? `3px solid ${C.brand}` : "3px solid transparent",
      color: active ? C.brand : "var(--text-muted)",
    }}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
    {active && (
      <motion.div
        layoutId="activeTab"
        className="ml-auto w-1.5 h-1.5 rounded-full"
        style={{ background: C.brand }}
      />
    )}
  </motion.button>
);

// ==========================================
// FORM INPUT COMPONENT
// ==========================================
const FormField = ({ label, name, value, onChange, disabled, type = "text", multiline = false }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        disabled={disabled}
        name={name}
        rows={4}
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
        style={{
          background: disabled ? "var(--surface2)" : "var(--surface3)",
          border: `1px solid ${disabled ? "var(--border)" : "var(--border)"}`,
          color: "var(--text)",
        }}
      />
    ) : (
      <input
        type={type}
        disabled={disabled}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
        style={{
          background: disabled ? "var(--surface2)" : "var(--surface3)",
          border: `1px solid ${disabled ? "var(--border)" : "var(--border)"}`,
          color: "var(--text)",
        }}
      />
    )}
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export const Profile = () => {
  const {userId} = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/user/${userId}`);
        const data = res.data?.data || res.data;
        setUserData(data);
      } catch (err) {
        console.error("User fetch error:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      let avatarUrl = userData.avatar;
      
      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const updates = { ...userData, avatar: avatarUrl };
      const res = await apiClient.put(`/user/${userId}`, updates);
      
      setUserData(res.data?.user || res.data?.data || updates);
      setEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profile updated successfully ✨");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile ❌");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    // Refetch to reset changes
    setLoading(true);
    apiClient.get(`/user/${userId}`).then(res => {
      setUserData(res.data?.data || res.data);
      setLoading(false);
    });
  };

  // Show skeleton while loading
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Show error state if no data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${C.error}15`, border: `1px solid ${C.error}` }}
          >
            <X size={32} style={{ color: C.error }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Failed to Load Profile</h2>
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>Please try again later</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: C.brand, color: "var(--bg)" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayAvatar = avatarPreview || userData.avatar || `https://ui-avatars.com/api/?name=${userData.fullname}&background=16A880&color=fff`;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* -------------------- LEFT SIDEBAR -------------------- */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <div
              className="rounded-2xl p-6 space-y-6 sticky top-6"
              style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
            >
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {/* Glow Ring */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})` }}
                  />
                  
                  <div className="relative">
                    <img
                      src={displayAvatar}
                      alt={userData.fullname}
                      className="w-28 h-28 rounded-full object-cover border-2"
                      style={{ borderColor: C.brand }}
                    />
                    
                    {editMode && (
                      <label className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer shadow-lg"
                        style={{ background: C.brand, color: "var(--bg)" }}
                      >
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold mt-4 text-center" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
                  {userData.fullname}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{userData.email}</p>
                
                {/* Member Since */}
                <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Calendar size={14} />
                  <span>Member since {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Edit Actions */}
                <div className="flex gap-2 mt-4 w-full">
                  {editMode ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50"
                        style={{ 
                          background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                          color: "var(--bg)",
                        }}
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? "Saving..." : "Save"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={cancelEdit}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm"
                        style={{ 
                          background: "var(--surface2)",
                          border: `1px solid ${"var(--border)"}`,
                          color: "var(--text-muted)",
                        }}
                      >
                        <X size={16} />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditMode(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm"
                      style={{ 
                        background: "var(--surface2)",
                        border: `1px solid ${"var(--border)"}`,
                        color: "var(--text)",
                      }}
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Menu
                </p>
                <div className="space-y-1">
                  <TabButton
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                    icon={User}
                    label="Profile Info"
                  />
                  <TabButton
                    active={activeTab === "activity"}
                    onClick={() => setActiveTab("activity")}
                    icon={Activity}
                    label="Activity"
                  />
                  <TabButton
                    active={activeTab === "achievements"}
                    onClick={() => setActiveTab("achievements")}
                    icon={Award}
                    label="Achievements"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* -------------------- RIGHT CONTENT PANEL -------------------- */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-2xl p-6 min-h-[500px]"
              style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
            >
              <AnimatePresence mode="wait">
                
                {/* PROFILE INFO */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
                        Profile Information
                      </h2>
                      {editMode && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium" 
                          style={{ background: `${C.brand}20`, color: C.brand, border: `1px solid ${"var(--border)"}` }}
                        >
                          Editing
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        label="Full Name"
                        name="fullname"
                        value={userData.fullname}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                      <FormField
                        label="Bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleChange}
                        disabled={!editMode}
                        multiline
                        className="sm:col-span-2"
                      />
                    </div>

                    {/* Additional Info Display */}
                    {!editMode && (
                      <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
                        <h3 className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Additional Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface2)" }}>
                            <MapPin size={18} style={{ color: C.brand }} />
                            <div>
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Location</p>
                              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                                {userData.location || "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface2)" }}>
                            <LinkIcon size={18} style={{ color: C.brand }} />
                            <div>
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Website</p>
                              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                                {userData.website || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ACTIVITY */}
                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
                      Activity
                    </h2>
                    <EmptyState 
                      icon={Activity}
                      title="Activity Analytics"
                      subtitle="Detailed activity tracking coming soon. Check your dashboard for now! ⏳"
                    />
                  </motion.div>
                )}

                {/* ACHIEVEMENTS */}
                {activeTab === "achievements" && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fraunces'", color: "var(--text)" }}>
                      Achievements
                    </h2>

                    {userData.achievements?.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userData.achievements.map((ach, idx) => (
                          <motion.div
                            key={ach._id || idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="p-4 rounded-xl relative overflow-hidden group cursor-pointer"
                            style={{ 
                              background: "var(--surface2)", 
                              border: `1px solid ${"var(--border)"}`,
                            }}
                          >
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: `radial-gradient(circle at 50% 0%, ${C.brand}10, transparent 70%)` }}
                            />
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                              <div 
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                                style={{ background: `${C.brand}15`, border: `1px solid ${"var(--border)"}` }}
                              >
                                <Award size={28} style={{ color: C.brand }} />
                              </div>
                              <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>{ach.name}</h3>
                              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                                {ach.description || "Achievement unlocked"}
                              </p>
                              <span 
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{ background: `${C.accent}20`, color: C.accent }}
                              >
                                {ach.pointsRequired || 0} pts
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        icon={Award}
                        title="No Achievements Yet"
                        subtitle="Complete courses and challenges to unlock achievements and earn points!"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;