import { useSelector, useDispatch } from "react-redux";
import { fetchAllCommunities } from "../../../redux/features/community/communitySlice";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  ArrowRight, 
  Plus, 
  Search,
  Globe,
  Lock,
  Hash,
  TrendingUp,
  MessageCircle,
  Sparkles
} from "lucide-react";

// ==========================================
// DESIGN TOKENS (Matching Dashboard Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  error: "#F87171",
  success: "#22C55E",
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const GlowCard = ({ children, className = "", onClick, gradient = true }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative group cursor-pointer overflow-hidden rounded-2xl ${className}`}
    style={{ 
      background: "var(--surface)",
      border: `1px solid ${"var(--border)"}`,
    }}
  >
    {/* Ambient Glow Effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ 
        background: gradient 
          ? `radial-gradient(circle at 50% 0%, ${C.brand}20, transparent 70%)` 
          : 'none'
      }} 
    />

    {/* Bottom Glow Line */}
    <div 
      className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ 
        background: `linear-gradient(90deg, transparent, ${C.brand}, transparent)` 
      }}
    />

    <div className="relative z-10">{children}</div>
  </motion.div>
);

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const num = parseInt(value) || 0;
    const duration = 1000;
    const steps = 20;
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
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

const Badge = ({ children, type = "default", icon: Icon }) => {
  const styles = {
    default: { bg: `${C.brand}20`, color: C.brand, border: "var(--border)" },
    accent: { bg: `${C.accent}20`, color: C.accent, border: `rgba(245,158,11,0.3)` },
    ghost: { bg: 'transparent', color: "var(--text-muted)", border: "var(--border)" },
  };
  
  const style = styles[type] || styles.default;
  
  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
      style={{ 
        background: style.bg, 
        color: style.color,
        borderColor: style.border,
      }}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

const EmptyState = ({ onAction }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 px-4"
  >
    <div 
      className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
      style={{ 
        background: `linear-gradient(135deg, ${C.brand}20, ${C.brand}05)`,
        border: `1px solid ${"var(--border)"}`,
      }}
    >
      <Users size={40} style={{ color: C.brand }} />
    </div>
    <h3 
      className="text-xl font-bold mb-2"
      style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
    >
      No Communities Yet
    </h3>
    <p className="text-center max-w-md mb-6" style={{ color: "var(--text-muted)" }}>
      Be the first to create a community and start connecting with learners who share your interests.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAction}
      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
      style={{ 
        background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
        color: "var(--bg)",
        boxShadow: `0 4px 20px ${C.brand}40`,
      }}
    >
      <Plus size={18} />
      Create Community
    </motion.button>
  </motion.div>
);

const SkeletonCard = () => (
  <div 
    className="rounded-2xl overflow-hidden"
    style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
  >
    <div 
      className="h-40 w-full animate-pulse"
      style={{ background: "var(--surface2)" }}
    />
    <div className="p-5 space-y-3">
      <div 
        className="h-6 w-3/4 rounded animate-pulse"
        style={{ background: "var(--surface2)" }}
      />
      <div 
        className="h-4 w-full rounded animate-pulse"
        style={{ background: "var(--surface3)" }}
      />
      <div 
        className="h-4 w-2/3 rounded animate-pulse"
        style={{ background: "var(--surface3)" }}
      />
      <div className="flex justify-between items-center pt-2">
        <div 
          className="h-4 w-20 rounded animate-pulse"
          style={{ background: "var(--surface3)" }}
        />
        <div 
          className="h-8 w-16 rounded-full animate-pulse"
          style={{ background: "var(--surface2)" }}
        />
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export const Community = ({ basePath }) => {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const {token} = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/communities");
        setCommunities(res.data.data || []);
        setFilteredCommunities(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching communities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, [token]);

  // Search & Filter Logic
  useEffect(() => {
    let filtered = communities;
    
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter === "popular") {
      filtered = [...filtered].sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0));
    } else if (activeFilter === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredCommunities(filtered);
  }, [searchQuery, activeFilter, communities]);

  const totalMembers = communities.reduce((acc, c) => acc + (c.members?.length || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div 
            className="h-8 w-64 rounded mb-8 animate-pulse"
            style={{ background: "var(--surface2)" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="p-2 rounded-xl"
                style={{ background: `${C.brand}20`, border: `1px solid ${"var(--border)"}` }}
              >
                <Globe size={24} style={{ color: C.brand }} />
              </div>
              <h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                Explore{" "}
                <span style={{ 
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Communities
                </span>
              </h1>
            </div>
            <p style={{ color: "var(--text-muted)" }} className="text-sm sm:text-base max-w-xl">
              Connect, collaborate, and grow with <AnimatedCounter value={totalMembers} /> learners who share your passions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/${basePath}/communities/create`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap"
              style={{ 
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                color: "var(--bg)",
                boxShadow: `0 4px 20px ${C.brand}40`,
              }}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Create Community</span>
              <span className="sm:hidden">Create</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Communities", value: communities.length, icon: Hash },
            { label: "Total Members", value: totalMembers, icon: Users },
            { label: "Active Today", value: Math.floor(totalMembers * 0.3), icon: TrendingUp },
            { label: "Discussions", value: communities.length * 12, icon: MessageCircle },
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl"
              style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}` }}
            >
              <div 
                className="p-2 rounded-lg"
                style={{ background: `${C.brand}15` }}
              >
                <stat.icon size={18} style={{ color: C.brand }} />
              </div>
              <div>
                <p 
                  className="text-lg sm:text-xl font-bold"
                  style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
                >
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2" 
              size={18} 
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ 
                background: "var(--surface)",
                border: `1px solid ${"var(--border)"}`,
                color: "var(--text)",
              }}
              onFocus={(e) => e.target.style.borderColor = C.brand}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {[
              { id: "all", label: "All", icon: Globe },
              { id: "popular", label: "Popular", icon: TrendingUp },
              { id: "newest", label: "Newest", icon: Sparkles },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                style={{ 
                  background: activeFilter === filter.id ? C.brand : "var(--surface)",
                  color: activeFilter === filter.id ? "var(--bg)" : "var(--text-muted)",
                  border: `1px solid ${activeFilter === filter.id ? C.brand : "var(--border)"}`,
                }}
              >
                <filter.icon size={14} />
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Communities Grid */}
        <AnimatePresence mode="wait">
          {filteredCommunities.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredCommunities.map((community, idx) => (
                <GlowCard
                  key={community._id}
                  onClick={() => navigate(`/${basePath}/community/${community._id}`)}
                  className="flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <motion.img
                      src={community.coverImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"}
                      alt={community.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        background: `linear-gradient(to top, ${"var(--surface)"} 0%, transparent 60%)` 
                      }}
                    />
                    
                    {/* Privacy Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        type={community.isPrivate ? "ghost" : "default"}
                        icon={community.isPrivate ? Lock : Globe}
                      >
                        {community.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </div>
                    
                    {/* Category Tag */}
                    {community.category && (
                      <div className="absolute top-3 left-3">
                        <Badge type="accent" icon={Hash}>
                          {community.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <h3 
                      className="text-lg font-bold mb-2 line-clamp-1"
                      style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
                    >
                      {community.name}
                    </h3>
                    
                    <p 
                      className="text-sm line-clamp-2 mb-4 flex-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {community.description || "Join this community to connect with like-minded learners and share knowledge."}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                        <Users size={16} style={{ color: C.brand }} />
                        <span className="text-sm">
                          <AnimatedCounter value={community.members?.length || 0} /> members
                        </span>
                      </div>
                      
                      <motion.div
                        className="flex items-center gap-1 text-sm font-medium"
                        style={{ color: C.brand }}
                        whileHover={{ x: 3 }}
                      >
                        Explore
                        <ArrowRight size={16} />
                      </motion.div>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </motion.div>
          ) : (
            <EmptyState onAction={() => navigate(`/${basePath}/communities/create`)} />
          )}
        </AnimatePresence>

        {/* Load More / End Message */}
        {filteredCommunities.length > 0 && filteredCommunities.length < communities.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p style={{ color: "var(--text-muted)" }}>
              Showing {filteredCommunities.length} of {communities.length} communities
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Community;