import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/features/users/usersSlice";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/axiosConfig";
import { 
  User, 
  Activity, 
  Award, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  ChevronLeft,
  XCircle,
  Loader2,
  UserPlus,
  Clock,
  CheckCircle2,
  MessageSquare,
  Lock,
  Shield
} from "lucide-react";

import toast from "react-hot-toast";

// ==========================================
// DESIGN TOKENS
// ==========================================
const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
};

// ==========================================
// LOADING SKELETON
// ==========================================
const ProfileSkeleton = () => (
  <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: "var(--bg)" }}>
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="h-64 rounded-2xl" style={{ background: "var(--surface)" }} />
        </div>
        <div className="lg:col-span-2">
          <div className="h-96 rounded-2xl" style={{ background: "var(--surface)" }} />
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// PUBLIC PROFILE COMPONENT
// ==========================================
export const PublicProfile = () => {
  const { id: userId } = useParams();
  const { userId: currentUserId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const { profile: userData, profileLoading: loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [friendStatus, setFriendStatus] = useState("none"); // none, pending_out, pending_in, friends
  const [actionLoading, setActionLoading] = useState(false);
  const [settings, setSettings] = useState({
    profilePublic: true,
    showActivity: true,
    showProgress: true
  });

  const checkFriendStatus = async () => {
    if (!currentUserId || !userId) return;
    try {
      // 1. Check if already friends
      const friendsRes = await apiClient.get(`/friends/${currentUserId}`);
      const friendsList = friendsRes.data?.data || [];
      const isFriend = friendsList.some(f => String(f._id || f) === String(userId));
      
      if (isFriend) {
        setFriendStatus("friends");
        return;
      }

      // 2. Check requests (incoming and outgoing are on the same endpoint)
      const reqRes = await apiClient.get(`/friends/requests/${currentUserId}`);
      const allRequests = reqRes.data?.data || [];
      
      const incoming = allRequests.find(r => String(r.requester?._id || r.requester) === String(userId));
      if (incoming) {
        setFriendStatus("pending_in");
        return;
      }

      const outgoing = allRequests.find(r => String(r.recipient?._id || r.recipient) === String(userId));
      if (outgoing) {
        setFriendStatus("pending_out");
        return;
      }

      setFriendStatus("none");
    } catch (err) {
      console.error("Error checking friend status:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        
        // Fetch User Data
        await dispatch(fetchUserProfile(userId)).unwrap();

        // Fetch User Settings for Privacy
        try {
          const settingsRes = await apiClient.get(`/user/${userId}/settings`);
          if (settingsRes.data?.data) {
            setSettings({
              profilePublic: settingsRes.data.data.profilePublic ?? true,
              showActivity: settingsRes.data.data.showActivity ?? true,
              showProgress: settingsRes.data.data.showProgress ?? true
            });
          }
        } catch (settingsErr) {
          console.warn("Failed to fetch settings for user, using defaults:", settingsErr);
        }

        await checkFriendStatus();
      } catch (err) {
        console.error("Public Profile fetch error:", err);
      } finally {
        
      }
    };
    
    fetchUser();
  }, [userId, currentUserId]);

  if (loading) return <ProfileSkeleton />;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <XCircle size={48} className="mx-auto mb-4" style={{ color: C.error }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>User Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: C.brand, color: "var(--bg)" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const avatar = userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullname || "User")}&background=16A880&color=fff`;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-0" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium p-2 rounded-lg transition-colors"
        style={{ color: "var(--text-muted)", background: "var(--surface2)" }}
      >
        <ChevronLeft size={18} />
        Back to Community
      </motion.button>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar / User Info Card */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
            <div className="rounded-3xl p-8 space-y-8 sticky top-4 border shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
                    style={{ background: C.brand }}
                  />
                  <img
                    src={avatar}
                    alt={userData.fullname}
                    className="w-32 h-32 rounded-full object-cover border-4 relative z-10"
                    style={{ borderColor: C.brand }}
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                  {userData.fullname}
                </h2>
                <p className="text-sm font-medium mb-4" style={{ color: C.brand }}>Student Learner</p>
                
                <div className="flex items-center gap-2 text-[13px] opacity-70 mb-6">
                  <Calendar size={14} />
                  <span>Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-3 rounded-2xl text-center border" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
                    <p className="text-lg font-bold">{userData.achievements?.length || 0}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Badges</p>
                  </div>
                  <div className="p-3 rounded-2xl text-center border" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
                    <p className="text-lg font-bold">12</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Courses</p>
                  </div>
                </div>

                {/* Friend Action Button */}
                {currentUserId !== userId && (
                  <div className="w-full mt-6">
                    {friendStatus === "friends" ? (
                      <button
                        onClick={() => navigate("/user/messages")}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        style={{ color: C.brand }}
                      >
                        <MessageSquare size={18} />
                        Message Friend
                      </button>
                    ) : friendStatus === "pending_out" ? (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold opacity-60 cursor-not-allowed bg-white/5 border border-white/10"
                        style={{ color: C.accent }}
                      >
                        <Clock size={18} />
                        Request Pending
                      </button>
                    ) : friendStatus === "pending_in" ? (
                      <button
                        onClick={() => navigate("/user/messages")}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white/10 border border-white/10 transition-colors hover:bg-white/15"
                        style={{ color: C.brand }}
                      >
                        <UserPlus size={18} />
                        Respond to Request
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                          try {
                            setActionLoading(true);
                            await apiClient.post("/friends/request", {
                              requesterId: currentUserId,
                              recipientId: userId
                            });
                            toast.success("Friend request sent! ✨");
                            setFriendStatus("pending_out");
                          } catch (err) {
                            toast.error(err.response?.data?.message || "Failed to send request");
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                          color: "var(--bg)",
                          boxShadow: `0 8px 16px ${C.brand}30`
                        }}
                      >
                        {actionLoading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <UserPlus size={18} />
                        )}
                        {actionLoading ? "Sending..." : "Add Friend"}
                      </motion.button>
                    )}
                  </div>
                )}
              </div>

              {settings.profilePublic || currentUserId === userId ? (
                <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">About User</h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    {userData.bio || "No bio provided yet."}
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm opacity-80">
                      <Mail size={16} style={{ color: C.brand }} />
                      {userData.email}
                    </div>
                    {userData.location && (
                      <div className="flex items-center gap-3 text-sm opacity-80">
                        <MapPin size={16} style={{ color: C.brand }} />
                        {userData.location}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t text-center space-y-2" style={{ borderColor: "var(--border)" }}>
                   <Lock size={24} className="mx-auto opacity-20" />
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Private Account</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content Areas */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-2 space-y-6">
            {!settings.profilePublic && currentUserId !== userId ? (
              <div className="rounded-3xl p-12 border border-dashed flex flex-col items-center justify-center text-center space-y-4" 
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="p-4 rounded-full" style={{ background: `${C.brand}10` }}>
                   <Shield size={48} style={{ color: C.brand }} />
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Fraunces', serif" }}>Profile is Private</h3>
                   <p className="text-sm opacity-60 max-w-sm">This user has restricted their profile visibility. You can only see their basic info.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Achievements Section */}
                {(settings.showProgress || currentUserId === userId) && (
                  <div className="rounded-3xl p-8 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl" style={{ background: `${C.accent}15`, color: C.accent }}>
                          <Award size={24} />
                        </div>
                        <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Badges & Achievements</h3>
                      </div>
                    </div>

                    {userData.achievements?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userData.achievements.map((ach, idx) => (
                          <div key={idx} className="p-5 rounded-2xl border flex items-center gap-4 transition-transform hover:scale-[1.02]"
                            style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
                          >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: `${C.brand}15`, color: C.brand }}
                            >
                              <Award size={22} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm tracking-tight">{ach.name}</h4>
                              <p className="text-[11px] opacity-60 mt-0.5">{ach.description || "Earned through excellence."}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center border-2 border-dashed rounded-3xl" style={{ borderColor: "var(--border)" }}>
                        <Award size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm opacity-60">No achievements recorded yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Activity Section */}
                {(settings.showActivity || currentUserId === userId) && (
                  <div className="rounded-3xl p-8 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 rounded-xl" style={{ background: `${C.brand}15`, color: C.brand }}>
                        <Activity size={24} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Recent Learning Activity</h3>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="p-4 rounded-xl text-center opacity-60 text-sm border border-dashed" style={{ borderColor: "var(--border)" }}>
                         Learning activity is currently private or restricted.
                       </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
