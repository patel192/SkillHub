import React, { useState, useEffect } from "react";
import { Crown, Award, Trophy, Medal, Target, Zap, Flame, Star, TrendingUp,Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../api/axiosConfig";
import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
// ==========================================
// DESIGN TOKENS (Matching Dashboard Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  accent2: "#8B5CF6",
  bg: "#0A0F0D",
  surface: "#111814",
  surface2: "#182219",
  surface3: "#1E2B22",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const num = parseInt(value) || 0;
    const steps = 30;
    const increment = num / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const RankBadge = ({ rank }) => {
  const configs = {
    1: { icon: Crown, color: C.gold, bg: "rgba(255,215,0,0.15)", label: "1st" },
    2: { icon: Medal, color: C.silver, bg: "rgba(192,192,192,0.15)", label: "2nd" },
    3: { icon: Medal, color: C.bronze, bg: "rgba(205,127,50,0.15)", label: "3rd" },
  };

  const config = configs[rank];
  if (!config) return <span className="font-bold text-lg w-8 text-center" style={{ color: "var(--text-muted)" }}>#{rank}</span>;

  const Icon = config.icon;
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, delay: rank * 0.1 }}
      className="flex items-center justify-center w-10 h-10 rounded-full"
      style={{ background: config.bg, border: `2px solid ${config.color}` }}
    >
      <Icon size={20} style={{ color: config.color }} />
    </motion.div>
  );
};

const ProgressBar = ({ progress, color = C.brand, height = "h-2" }) => (
  <div className={`w-full ${height} rounded-full overflow-hidden`} style={{ background: "var(--surface)"3 }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.max(5, progress)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full rounded-full"
      style={{ background: `linear-gradient(90deg, ${color}, ${C.brandLight})` }}
    />
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
    style={{
      background: active ? `linear-gradient(135deg, ${C.brand}, ${C.brandLight})` : "var(--surface)"2,
      color: active ? "var(--bg)" : "var(--text)"Muted,
      border: `1px solid ${active ? C.brand : "var(--border)"}`,
      boxShadow: active ? `0 4px 20px ${C.brand}40` : "none",
    }}
  >
    <Icon size={18} />
    <span className="hidden sm:inline">{label}</span>
  </motion.button>
);

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4"
  >
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
      style={{ background: `${C.brand}15`, border: `1px solid ${"var(--border)"}` }}
    >
      <Icon size={32} style={{ color: C.brand }} />
    </div>
    <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>{title}</h3>
    <p style={{ color: "var(--text)"Muted }}>{subtitle}</p>
  </motion.div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  const {userId} = useAuth();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/users");
        const usersData = Array.isArray(res.data?.users) ? res.data.users : 
                         Array.isArray(res.data) ? res.data : [];
        setUsers(usersData);
        
        // Calculate user rank
        if (userId) {
          const sorted = [...usersData].sort((a, b) => (b.points || 0) - (a.points || 0));
          const rank = sorted.findIndex(u => u._id === userId) + 1;
          setUserRank(rank > 0 ? rank : null);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId]);

  // Fetch achievements
  useEffect(() => {
    if (activeTab !== "achievements" || !userId) return;
    
    const fetchAchievements = async () => {
      try {
        const res = await apiClient.get(`/achievement/${userId}`);
        const data = res.data?.achievement || res.data?.data || [];
        setAchievements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
        setAchievements([]);
      }
    };
    fetchAchievements();
  }, [activeTab, userId]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => (b.points || 0) - (a.points || 0));
  }, [users]);

  const topScore = sortedUsers[0]?.points || 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 rounded-full"
          style={{ borderColor: C.brand, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-xl"
                style={{ background: `${C.brand}20`, border: `1px solid ${"var(--border)"}` }}
              >
                <Trophy size={24} style={{ color: C.brand }} />
              </div>
              <h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                <span style={{ 
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Leaderboard
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base max-w-lg" style={{ color: "var(--text)"Muted }}>
              Compete with fellow learners and track your achievements. 
              {userRank && (
                <span className="ml-2" style={{ color: C.brand }}>
                  You're ranked <strong>#{userRank}</strong>!
                </span>
              )}
            </p>
          </div>

          {/* Stats Summary */}
          <div className="flex gap-3">
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
            >
              <Users size={16} style={{ color: C.brand }} />
              <span className="text-sm font-medium" style={{ color: "var(--text)"Muted }}>
                <AnimatedCounter value={users.length} /> learners
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          <TabButton
            active={activeTab === "leaderboard"}
            onClick={() => setActiveTab("leaderboard")}
            icon={Award}
            label="Leaderboard"
          />
          <TabButton
            active={activeTab === "achievements"}
            onClick={() => setActiveTab("achievements")}
            icon={Target}
            label="Achievements"
          />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "leaderboard" ? (
            <LeaderboardPanel 
              key="leaderboard"
              users={sortedUsers}
              topScore={topScore}
              userId={userId}
            />
          ) : (
            <AchievementsPanel 
              key="achievements"
              achievements={achievements}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// LEADERBOARD PANEL
// ==========================================

const LeaderboardPanel = ({ users, topScore, userId }) => {
  if (users.length === 0) {
    return (
      <EmptyState 
        icon={Award}
        title="No Leaders Yet"
        subtitle="Be the first to earn points and top the leaderboard!"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Top 3 Podium (Desktop) */}
      <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
        {[1, 0, 2].map((offset, idx) => {
          const user = users[offset];
          if (!user) return null;
          
          const rank = offset + 1;
          const heights = ["h-32", "h-40", "h-32"];
          const medals = [C.silver, C.gold, C.bronze];
          
          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${heights[idx]} rounded-2xl flex flex-col items-center justify-end p-4 relative overflow-hidden`}
              style={{ 
                background: "var(--surface)",
                border: `2px solid ${medals[idx]}`,
                order: idx === 1 ? 1 : idx === 0 ? 0 : 2
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{ background: `linear-gradient(to top, ${medals[idx]}, transparent)` }}
              />
              <Crown size={32} style={{ color: medals[idx], marginBottom: 8 }} />
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=16A880&color=fff`}
                alt={user.fullname}
                className="w-12 h-12 rounded-full border-2 mb-2"
                style={{ borderColor: medals[idx] }}
              />
              <p className="font-bold text-sm text-center line-clamp-1" style={{ color: "var(--text)" }}>{user.fullname}</p>
              <p className="text-lg font-bold" style={{ color: medals[idx] }}>
                <AnimatedCounter value={user.points || 0} /> pts
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* List */}
      <div 
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)", background: "var(--surface)"2 }}>
          <div className="flex items-center justify-between text-sm font-medium" style={{ color: "var(--text)"Muted }}>
            <span className="flex-1">Rank & Learner</span>
            <span className="w-24 text-right hidden sm:block">Progress</span>
            <span className="w-20 text-right">Points</span>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {users.map((user, idx) => {
            const rank = idx + 1;
            const isMe = user._id === userId;
            const progress = topScore > 0 ? ((user.points || 0) / topScore) * 100 : 0;

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-center gap-3 sm:gap-4 p-4 transition-colors hover:bg-white/5 ${
                  isMe ? "bg-opacity-10" : ""
                }`}
                style={isMe ? { background: `${C.brand}10`, borderLeft: `3px solid ${C.brand}` } : {}}
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  <RankBadge rank={rank} />
                </div>

                {/* Avatar */}
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=16A880&color=fff`}
                  alt={user.fullname}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                  style={{ border: `2px solid ${rank <= 3 ? (rank === 1 ? C.gold : rank === 2 ? C.silver : C.bronze) : "var(--border)"}` }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm sm:text-base truncate" style={{ color: "var(--text)" }}>
                      {user.fullname}
                    </p>
                    {isMe && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${C.brand}20`, color: C.brand, border: `1px solid ${"var(--border)"}` }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  
                  {/* Mobile Progress */}
                  <div className="sm:hidden mt-2">
                    <ProgressBar progress={progress} height="h-1.5" />
                  </div>
                </div>

                {/* Desktop Progress */}
                <div className="hidden sm:block w-24 flex-shrink-0">
                  <ProgressBar progress={progress} height="h-2" />
                </div>

                {/* Points */}
                <div className="w-20 text-right flex-shrink-0">
                  <p className="font-bold text-sm sm:text-base" style={{ color: rank <= 3 ? C.brand : "var(--text)" }}>
                    <AnimatedCounter value={user.points || 0} />
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>pts</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// ACHIEVEMENTS PANEL
// ==========================================

const AchievementsPanel = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <EmptyState 
        icon={Target}
        title="No Achievements Yet"
        subtitle="Start learning to unlock achievements and earn badges!"
      />
    );
  }

  const getRarityColor = (points) => {
    if (points >= 1000) return { bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.5)", icon: C.accent };
    if (points >= 500) return { bg: "rgba(139,92,246,0.2)", border: "rgba(139,92,246,0.5)", icon: C.accent2 };
    return { bg: `${C.brand}20`, border: "var(--border)", icon: C.brand };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {achievements.map((ach, idx) => {
          const rarity = getRarityColor(ach.pointsRequired || 0);
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative group rounded-2xl p-5 cursor-pointer overflow-hidden"
              style={{ 
                background: "var(--surface)",
                border: `1px solid ${rarity.border}`,
              }}
            >
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${rarity.icon}15, transparent 70%)` }}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon/Badge */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: rarity.bg, border: `1px solid ${rarity.border}` }}
                >
                  {ach.icon ? (
                    <img src={ach.icon} alt="" className="w-10 h-10" />
                  ) : (
                    <Star size={32} style={{ color: rarity.icon }} />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-base mb-1" style={{ color: "var(--text)" }}>
                  {ach.name}
                </h3>

                {/* Description */}
                <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text)"Muted }}>
                  {ach.description || "Complete challenges to unlock this achievement"}
                </p>

                {/* Points */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: rarity.bg, color: rarity.icon, border: `1px solid ${rarity.border}` }}
                >
                  <Zap size={12} />
                  {ach.pointsRequired || 0} pts required
                </div>

                {/* Progress if user has progress */}
                {ach.progress !== undefined && (
                  <div className="w-full mt-3">
                    <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                      <span>Progress</span>
                      <span>{ach.progress}%</span>
                    </div>
                    <ProgressBar progress={ach.progress} color={rarity.icon} height="h-1.5" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Total Achievements", value: achievements.length, icon: Trophy },
          { label: "Points Earned", value: achievements.reduce((a, b) => a + (b.pointsAwarded || 0), 0), icon: Zap },
          { label: "Rare Badges", value: achievements.filter(a => (a.pointsRequired || 0) >= 500).length, icon: Star },
          { label: "Completion Rate", value: Math.round(achievements.filter(a => a.unlocked).length / achievements.length * 100) || 0, suffix: "%", icon: TrendingUp },
        ].map((stat, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
          >
            <div className="p-2 rounded-lg" style={{ background: `${C.brand}15` }}>
              <stat.icon size={18} style={{ color: C.brand }} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-xs" style={{ color: "var(--text)"Muted }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LeaderBoard;