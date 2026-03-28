import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Trash2,
  Pin,
  Flag,
  X,
  Users,
  Globe,
  Lock,
  Settings,
  UserPlus,
  UserMinus,
  Shield,
  Crown,
  CornerDownRight,
  Loader2,
  TrendingUp,
  Image as ImageIcon,
  Share2,
} from "lucide-react";

// ==========================================
// DESIGN TOKENS
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
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
  error: "#F87171",
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const extractId = (ref) => (!ref ? "" : typeof ref === "string" ? ref : ref._id || "");
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

// Safe array helper - ensures data is always an array
const safeArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.posts && Array.isArray(data.posts)) return data.posts;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data?.posts && Array.isArray(data.data.posts)) return data.data.posts;
  console.warn("Expected array but got:", typeof data, data);
  return [];
};

// ==========================================
// API CLIENT
// ==========================================
const apiClient = axios.create({ timeout: 10000 });
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==========================================
// CUSTOM HOOKS
// ==========================================

const useCommunity = (communityId) => {
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ name: "", description: "", coverImage: "" });

  const fetchCommunity = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/communities/${communityId}`);
      // Handle different response structures
      const data = res.data?.data || res.data;
      setCommunity(data);
      setEditData({
        name: data?.name || "",
        description: data?.description || "",
        coverImage: data?.coverImage || "",
      });
    } catch (err) {
      toast.error("Failed to load community");
      console.error("Community fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  const updateCommunity = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await apiClient.put(`/communities/${communityId}`, { ...editData, userId });
      toast.success("Community updated");
      await fetchCommunity();
      return true;
    } catch (err) {
      toast.error("Failed to update");
      return false;
    }
  };

  useEffect(() => { fetchCommunity(); }, [fetchCommunity]);

  return { community, loading, editData, setEditData, updateCommunity, refresh: fetchCommunity };
};

const useMembership = (community, communityId, refreshCommunity) => {
  const userId = localStorage.getItem("userId");
  
  const isMember = useMemo(() => {
    if (!community?.members || !userId) return false;
    return community.members.some((m) => extractId(m.userId) === userId);
  }, [community, userId]);

  const isAdmin = useMemo(() => {
    if (!community?.members || !userId) return false;
    return community.members.some((m) => extractId(m.userId) === userId && m.role === "admin");
  }, [community, userId]);

  const join = async () => {
    try {
      await apiClient.patch(`/communities/${communityId}/join`, { userId });
      toast.success("Welcome to the community!");
      refreshCommunity();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join");
    }
  };

  const leave = async () => {
    try {
      await apiClient.patch(`/communities/${communityId}/leave`, { userId });
      toast.success("You left the community");
      refreshCommunity();
    } catch (err) {
      toast.error("Failed to leave");
    }
  };

  const removeMember = async (memberId) => {
    try {
      await apiClient.patch(`/communities/${communityId}/leave`, { userId: memberId });
      toast.success("Member removed");
      refreshCommunity();
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  const promoteMember = async (memberId) => {
    try {
      await apiClient.patch(`/communities/${communityId}/promote`, { userId: memberId });
      toast.success("Member promoted to admin");
      refreshCommunity();
    } catch (err) {
      toast.error("Failed to promote");
    }
  };

  const addMember = async (memberId) => {
    try {
      await apiClient.patch(`/communities/${communityId}/join`, { userId: memberId });
      toast.success("Member added");
      refreshCommunity();
    } catch (err) {
      toast.error("Failed to add member");
    }
  };

  return { isMember, isAdmin, join, leave, removeMember, promoteMember, addMember, userId };
};

const usePosts = (communityId, refreshCommunity) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/communities/${communityId}/posts?sort=new&limit=50`);
      // Use safeArray to handle different response structures
      const data = safeArray(res.data);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  const createPost = async (content) => {
    try {
      await apiClient.post("/posts", { userId, content, communityId });
      toast.success("Post created!");
      await fetchPosts();
      refreshCommunity();
    } catch (err) {
      toast.error("Failed to create post");
    }
  };

  const deletePost = async (postId) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      toast.success("Post deleted");
      await fetchPosts();
      refreshCommunity();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const toggleLike = async (postId) => {
    const post = posts.find((p) => p._id === postId);
    const isLiked = post?.likes?.some((l) => extractId(l) === userId);
    
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const newLikes = isLiked
          ? p.likes.filter((l) => extractId(l) !== userId)
          : [...p.likes, userId];
        return { ...p, likes: newLikes };
      })
    );

    try {
      await apiClient.post(`/posts/${postId}/like`, { userId });
    } catch (err) {
      await fetchPosts();
      toast.error("Failed to update like");
    }
  };

  const pinPost = async (postId, isPinned) => {
    try {
      const action = isPinned ? "unpin" : "pin";
      await apiClient.patch(`/communities/${communityId}/${action}`, { postId });
      toast.success(`Post ${isPinned ? "unpinned" : "pinned"}`);
      await fetchPosts();
    } catch (err) {
      toast.error("Failed to pin/unpin");
    }
  };

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return { posts, loading, createPost, deletePost, toggleLike, pinPost, refresh: fetchPosts };
};

const useComments = (communityId, refreshPosts) => {
  const userId = localStorage.getItem("userId");

  const addComment = async (postId, content) => {
    try {
      await apiClient.post(`/posts/${postId}/comment`, { userId, content });
      toast.success("Comment added");
      await refreshPosts();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const addReply = async (postId, commentId, content) => {
    try {
      await apiClient.post(`/posts/${postId}/comment/${commentId}/reply`, { userId, content });
      toast.success("Reply added");
      await refreshPosts();
    } catch (err) {
      toast.error("Failed to add reply");
    }
  };

  return { addComment, addReply };
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

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

const CommunityHeader = ({ community, isMember, isAdmin, onJoin, onLeave, onAdminClick }) => {
  const memberCount = community?.members?.length || 0;
  const isPrivate = community?.isPrivate;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="relative h-48 sm:h-64">
        <img
          src={community?.coverImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"}
          alt={community?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.surface} 0%, transparent 60%)` }} />
        <div className="absolute top-4 right-4">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: isPrivate ? `${C.accent}20` : `${C.brand}20`,
              color: isPrivate ? C.accent : C.brand,
              borderColor: isPrivate ? `rgba(245,158,11,0.3)` : C.border,
            }}
          >
            {isPrivate ? <Lock size={12} /> : <Globe size={12} />}
            {isPrivate ? "Private" : "Public"}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 -mt-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: C.text }}>
              {community?.name}
            </h1>
            <p style={{ color: C.textMuted }} className="max-w-xl mb-3">
              {community?.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: C.textMuted }}>
              <div className="flex items-center gap-1.5">
                <Users size={16} style={{ color: C.brand }} />
                <span><AnimatedCounter value={memberCount} /> members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={16} style={{ color: C.brand }} />
                <span>{Math.floor(memberCount * 0.4)} active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAdminClick}
                className="px-4 py-2.5 rounded-xl font-medium text-sm"
                style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
              >
                Admin Panel
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isMember ? onLeave : onJoin}
              className="px-5 py-2.5 rounded-xl font-medium text-sm"
              style={{
                background: isMember ? "rgba(248,113,113,0.2)" : `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                color: isMember ? C.error : C.bg,
                border: isMember ? `1px solid rgba(248,113,113,0.3)` : "none",
              }}
            >
              {isMember ? "Leave Community" : "Join Community"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PostComposer = ({ onSubmit, isMember }) => {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  if (!isMember) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: C.surface,
        border: `1px solid ${isFocused ? C.brand : C.border}`,
        transition: "border-color 0.3s",
      }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Share something with the community..."
        rows={3}
        className="w-full bg-transparent resize-none outline-none text-sm"
        style={{ color: C.text }}
      />
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <button className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: C.textMuted }}>
          <ImageIcon size={18} />
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`, color: C.bg }}
        >
          <Send size={16} />
          Post
        </motion.button>
      </div>
    </motion.div>
  );
};

const CommentSection = ({ post, userId, onComment, onReply }) => {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  // Ensure comments is always an array
  const comments = safeArray(post.comments);

  const handleSubmitReply = (commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) return;
    onReply(commentId, text);
    setReplyText({ ...replyText, [commentId]: "" });
    setShowReplyInput({ ...showReplyInput, [commentId]: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 space-y-4"
      style={{ borderTop: `1px solid ${C.border}` }}
    >
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div key={comment._id} className="space-y-3">
            <div className="flex gap-3">
              <img
                src={comment.userId?.avatar || `https://ui-avatars.com/api/?name=${comment.userId?.fullname}&background=16A880&color=fff`}
                alt={comment.userId?.fullname}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="rounded-xl p-3" style={{ background: C.surface2 }}>
                  <h5 className="font-semibold text-sm mb-1" style={{ color: C.brand }}>
                    {comment.userId?.fullname}
                  </h5>
                  <p className="text-sm" style={{ color: C.text }}>{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1.5 ml-1">
                  <button
                    className="text-xs font-medium hover:underline"
                    style={{ color: C.textDim }}
                    onClick={() => setShowReplyInput({ ...showReplyInput, [comment._id]: !showReplyInput[comment._id] })}
                  >
                    Reply
                  </button>
                </div>

                <AnimatePresence>
                  {showReplyInput[comment._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 mt-2"
                    >
                      <input
                        type="text"
                        value={replyText[comment._id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ background: C.surface3, border: `1px solid ${C.border}`, color: C.text }}
                        onKeyPress={(e) => e.key === "Enter" && handleSubmitReply(comment._id)}
                      />
                      <button
                        onClick={() => handleSubmitReply(comment._id)}
                        className="p-2 rounded-lg"
                        style={{ background: C.brand, color: C.bg }}
                      >
                        <Send size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Safe array for replies */}
                {safeArray(comment.replies).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="flex gap-2 ml-4">
                        <CornerDownRight size={16} style={{ color: C.textDim, marginTop: 8 }} />
                        <div className="flex-1 rounded-xl p-2.5" style={{ background: C.surface3 }}>
                          <h6 className="font-semibold text-xs mb-0.5" style={{ color: C.brand }}>
                            {reply.userId?.fullname}
                          </h6>
                          <p className="text-sm" style={{ color: C.textMuted }}>{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!commentText.trim()) return;
          onComment(commentText);
          setCommentText("");
        }}
        className="flex gap-3 pt-2"
      >
        <img
          src={`https://ui-avatars.com/api/?name=You&background=16A880&color=fff`}
          alt="You"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2 rounded-xl disabled:opacity-50"
            style={{ background: C.brand, color: C.bg }}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

const PostCard = ({ post, userId, isAdmin, onLike, onDelete, onPin, onComment, onReply }) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Safe array operations
  const likes = safeArray(post.likes);
  const isLiked = likes.some((l) => extractId(l) === userId);
  const isAuthor = extractId(post.userId) === userId;
  const commentCount = safeArray(post.comments).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: C.surface,
        border: `1px solid ${post.isPinned ? "rgba(245,158,11,0.4)" : C.border}`,
      }}
    >
      {post.isPinned && (
        <div className="px-4 py-1.5 text-xs font-medium flex items-center gap-1.5" style={{ background: `${C.accent}10`, color: C.accent }}>
          📌 Pinned Post
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.userId?.avatar || `https://ui-avatars.com/api/?name=${post.userId?.fullname}&background=16A880&color=fff`}
              alt={post.userId?.fullname}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: `2px solid ${C.border}` }}
            />
            <div>
              <h4 className="font-semibold text-sm" style={{ color: C.text }}>{post.userId?.fullname}</h4>
              <p className="text-xs" style={{ color: C.textDim }}>{formatDate(post.createdAt)}</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: C.textMuted }}
            >
              <MoreHorizontal size={18} />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden z-10"
                  style={{ background: C.surface2, border: `1px solid ${C.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                >
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => { onPin(post._id, post.isPinned); setShowMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                        style={{ color: C.accent }}
                      >
                        <Pin size={16} />
                        {post.isPinned ? "Unpin Post" : "Pin Post"}
                      </button>
                      <div className="h-px mx-4" style={{ background: C.border }} />
                    </>
                  )}
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                    style={{ color: C.textMuted }}
                  >
                    <Flag size={16} />
                    Report
                  </button>
                  {(isAdmin || isAuthor) && (
                    <button
                      onClick={() => { onDelete(post._id); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                      style={{ color: C.error }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <p className="mt-3 text-sm leading-relaxed" style={{ color: C.text }}>{post.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: `1px solid rgba(22,168,128,0.1)` }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: isLiked ? C.error : C.textMuted }}
          >
            <Heart size={18} fill={isLiked ? C.error : "none"} strokeWidth={isLiked ? 0 : 2} />
            <span>{likes.length}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: showComments ? C.brand : C.textMuted }}
          >
            <MessageCircle size={18} />
            <span>{commentCount}</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} className="flex items-center gap-2 text-sm font-medium ml-auto" style={{ color: C.textMuted }}>
            <Share2 size={18} />
          </motion.button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <CommentSection post={post} userId={userId} onComment={onComment} onReply={onReply} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const AdminPanel = ({ isOpen, onClose, community, editData, setEditData, onUpdate, onRemoveMember, onPromoteMember, onAddMember }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [newMemberId, setNewMemberId] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newMemberId.trim()) return;
    onAddMember(newMemberId);
    setNewMemberId("");
  };

  // Safe array for members
  const members = safeArray(community?.members);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: `${C.accent}20` }}>
                <Shield size={20} style={{ color: C.accent }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: C.text }}>Admin Panel</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: C.textMuted }}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: C.border }}>
            {[
              { id: "general", label: "General", icon: Settings },
              { id: "members", label: "Members", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors"
                style={{
                  color: activeTab === tab.id ? C.brand : C.textMuted,
                  borderBottom: `2px solid ${activeTab === tab.id ? C.brand : "transparent"}`,
                  background: activeTab === tab.id ? `${C.brand}10` : "transparent",
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "general" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: C.textMuted }}>Community Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: C.textMuted }}>Cover Image URL</label>
                  <input
                    type="text"
                    value={editData.coverImage}
                    onChange={(e) => setEditData({ ...editData, coverImage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: C.textMuted }}>Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                    style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUpdate}
                  className="w-full py-3 rounded-xl font-medium"
                  style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`, color: C.bg }}
                >
                  Save Changes
                </motion.button>
              </div>
            )}

            {activeTab === "members" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textDim }} />
                    <input
                      type="text"
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      placeholder="Enter User ID to add..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ background: C.brand, color: C.bg }}
                  >
                    Add
                  </motion.button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {members.map((member, idx) => {
                    const user = member.userId || member;
                    const isAdminRole = member.role === "admin";
                    return (
                      <motion.div
                        key={user._id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=16A880&color=fff`}
                            alt={user.fullname}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm" style={{ color: C.text }}>{user.fullname || "Unknown"}</span>
                              {isAdminRole && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: `${C.accent}20`, color: C.accent }}>
                                  <Crown size={10} />
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="text-xs" style={{ color: C.textDim }}>{user.email || user._id?.slice(0, 8) + "..."}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isAdminRole && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onPromoteMember(user._id)}
                              className="p-2 rounded-lg transition-colors hover:bg-white/5"
                              style={{ color: C.brand }}
                              title="Promote to Admin"
                            >
                              <Shield size={16} />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRemoveMember(user._id)}
                            className="p-2 rounded-lg transition-colors hover:bg-white/5"
                            style={{ color: C.error }}
                            title="Remove Member"
                          >
                            <UserMinus size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const CommunityDetails = () => {
  const { id: communityId } = useParams();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { community, loading: loadingCommunity, editData, setEditData, updateCommunity, refresh: refreshCommunity } = useCommunity(communityId);
  const { isMember, isAdmin, join, leave, removeMember, promoteMember, addMember, userId } = useMembership(community, communityId, refreshCommunity);
  const { posts, loading: loadingPosts, createPost, deletePost, toggleLike, pinPost } = usePosts(communityId, refreshCommunity);
  const { addComment, addReply } = useComments(communityId, refreshCommunity);

  if (loadingCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={32} style={{ color: C.textMuted }} />
        </motion.div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.bg, color: C.text }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Community Not Found</h2>
          <p style={{ color: C.textMuted }}>The community you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <CommunityHeader
          community={community}
          isMember={isMember}
          isAdmin={isAdmin}
          onJoin={join}
          onLeave={leave}
          onAdminClick={() => setIsAdminOpen(true)}
        />

        <PostComposer onSubmit={createPost} isMember={isMember} />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: C.textMuted }}>
            <span>Posts</span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: C.surface, color: C.textMuted }}>{posts.length}</span>
          </h3>

          {loadingPosts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: C.surface }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ background: C.surface, color: C.textMuted }}>
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  userId={userId}
                  isAdmin={isAdmin}
                  onLike={() => toggleLike(post._id)}
                  onDelete={deletePost}
                  onPin={pinPost}
                  onComment={(text) => addComment(post._id, text)}
                  onReply={(commentId, text) => addReply(post._id, commentId, text)}
                />
              ))}
            </div>
          )}
        </div>

        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          community={community}
          editData={editData}
          setEditData={setEditData}
          onUpdate={updateCommunity}
          onRemoveMember={removeMember}
          onPromoteMember={promoteMember}
          onAddMember={addMember}
        />
      </div>
    </div>
  );
};

export default CommunityDetails;