import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaCommentAlt,
  FaThumbsUp,
  FaUserPlus,
  FaUserMinus,
  FaEdit,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { X } from "lucide-react";

/**
 * AdminCommunityDetails (Users-style redesign)
 * - Grid & card layout (like Users.jsx)
 * - Preserves all handlers, endpoints, and nav links
 * - Includes admin edit panel, report modal, posts grid, comments & replies
 */

export const AdminCommunityDetails = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams(); // community id
  const navigate = useNavigate();

  // Core state
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI / form state
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "", coverImage: "" });
  const [newMemberId, setNewMemberId] = useState("");
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [menuOpenForPost, setMenuOpenForPost] = useState(null);

  // reporting modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // { type, id }
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  // notifications
  const [notifications, setNotifications] = useState([]);
  const [lastSeen, setLastSeen] = useState(Date.now());

  const userId = localStorage.getItem("userId");
  const userName = "You";

  // helpers
  const idToStr = (x) => {
    if (!x) return "";
    if (typeof x === "string") return x;
    if (x._id) return String(x._id);
    return String(x);
  };

  const isMemberOf = (comm, uid) =>
    Array.isArray(comm?.members) && comm.members.some((m) => idToStr(m.userId) === idToStr(uid));

  const isAdminOf = (comm, uid) =>
    Array.isArray(comm?.members) &&
    comm.members.some((m) => idToStr(m.userId) === idToStr(uid) && m.role === "admin");

  const userLikedPost = (post, uid) => {
    if (!post?.likes) return false;
    return post.likes.some((l) => idToStr(l) === idToStr(uid) || idToStr(l._id) === idToStr(uid));
  };

  const showNotification = (msg, type = "success") => {
    if (type === "error") toast.error(msg);
    else toast.success(msg, { duration: 3500 });
  };

  // fetch community + posts
  const fetchCommunityAndPosts = async () => {
    setLoading(true);
    try {
      const [resComm, resPosts] = await Promise.all([
        axios.get(`/communities/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/communities/${id}/posts?sort=new&limit=50`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const communityData = resComm?.data?.data ?? resComm?.data;
      const postsData = resPosts?.data?.data?.posts ?? resPosts?.data?.posts ?? [];

      setCommunity(communityData);
      setPosts(postsData);

      if (communityData) {
        setEditData({
          name: communityData.name || "",
          description: communityData.description || "",
          coverImage: communityData.coverImage || "",
        });
      }
    } catch (err) {
      console.error("Error fetching community/posts:", err?.response?.data ?? err.message);
      showNotification("Failed to load community", "error");
    } finally {
      setLoading(false);
    }
  };

  // notifications fetch
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/notifications/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data?.data ?? res.data ?? [];
      const newOnes = data.filter((n) => new Date(n.createdAt).getTime() > lastSeen);
      if (newOnes.length > 0) {
        newOnes.forEach((n) => showNotification(n.message ?? "New notification"));
        setLastSeen(Date.now());
      }
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err?.response?.data ?? err.message);
    }
  };

  useEffect(() => {
    fetchCommunityAndPosts();
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 20000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  // Membership handlers
  const handleMembership = async (action) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.patch(`/communities/${id}/${action}`, { userId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`Successfully ${action}ed community`);
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(`${action} error:`, err?.response?.data ?? err.message);
      showNotification(`Failed to ${action}`, "error");
    }
  };

  // Posts / comments / replies / likes
  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post("/posts", { userId, content: newPost, communityId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setNewPost("");
      showNotification("Post created");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Add post error:", err?.response?.data ?? err.message);
      showNotification("Failed to create post", "error");
    }
  };

  const handleLike = async (postId) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.post(`/posts/${postId}/like`, { userId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("You liked a post");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Like error:", err?.response?.data ?? err.message);
      showNotification("Failed to like post", "error");
    }
  };

  const handleAddComment = async (postId) => {
    const txt = (commentText[postId] || "").trim();
    if (!txt) return;
    try {
      await axios.post(`/posts/${postId}/comment`, { userId, content: txt }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText((p) => ({ ...p, [postId]: "" }));
      showNotification("Comment added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Comment error:", err?.response?.data ?? err.message);
      showNotification("Failed to add comment", "error");
    }
  };

  const handleAddReply = async (postId, commentId) => {
    const txt = (replyText[commentId] || "").trim();
    if (!txt) return;
    try {
      await axios.post(`/posts/${postId}/comment/${commentId}/reply`, { userId, content: txt }, { headers: { Authorization: `Bearer ${token}` } });
      setReplyText((p) => ({ ...p, [commentId]: "" }));
      showNotification("Reply added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Reply error:", err?.response?.data ?? err.message);
      showNotification("Failed to add reply", "error");
    }
  };

  const handlePinToggle = async (postId, currentlyPinned) => {
    try {
      const action = currentlyPinned ? "unpin" : "pin";
      await axios.patch(`/communities/${id}/${action}`, { postId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`Post ${currentlyPinned ? "unpinned" : "pinned"}`);
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Pin error:", err?.response?.data ?? err.message);
      showNotification("Failed to pin/unpin", "error");
    }
  };

  // Community admin actions
  const handleUpdateCommunity = async () => {
    if (!editData.name.trim() || !userId) return alert("Name required");
    try {
      await axios.put(`/communities/${id}`, { ...editData, userId }, { headers: { Authorization: `Bearer ${token}` } });
      setEditMode(false);
      showNotification("Community updated");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Update community error:", err?.response?.data ?? err.message);
      showNotification("Failed to update community", "error");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!memberId) return;
    try {
      await axios.patch(`/communities/${id}/leave`, { userId: memberId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("Member removed");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Remove member error:", err?.response?.data ?? err.message);
      showNotification("Failed to remove member", "error");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId?.trim()) return alert("Enter a user id");
    try {
      await axios.patch(`/communities/${id}/join`, { userId: newMemberId }, { headers: { Authorization: `Bearer ${token}` } });
      setNewMemberId("");
      showNotification("Member added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Add member error:", err?.response?.data ?? err.message);
      showNotification("Failed to add member", "error");
    }
  };

  const handlePromoteMember = async (memberId) => {
    if (!memberId) return;
    try {
      await axios.patch(`/communities/${id}/promote`, { userId: memberId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("Member promoted");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Promote error:", err?.response?.data ?? err.message);
      showNotification("Failed to promote", "error");
    }
  };

  // Report submit
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    try {
      await axios.post(
        "/report",
        {
          reporter: userId,
          type: reportType,
          description: reportMessage,
          targetType: reportTarget.type,
          targetId: reportTarget.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${reportTarget.type} reported ✅`);
      setReportType("");
      setReportMessage("");
      setReportTarget(null);
      setIsReportOpen(false);
    } catch (err) {
      console.error("Report error:", err?.response?.data ?? err.message);
      toast.error("Failed to submit report ❌");
    }
  };

  // Loading or missing
  if (loading || !community) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="mb-3 animate-pulse font-semibold">Loading community...</div>
        </div>
      </div>
    );
  }

  const joined = isMemberOf(community, userId);
  const admin = isAdminOf(community, userId);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#071028] to-[#0f1e3a] text-white">
      {/* Top header (Users-like) */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg">
              {community.name?.[0] || "C"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold truncate">{community.name}</h1>
              <p className="text-gray-300 text-sm mt-1 max-w-xl">{community.description}</p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white">{community.members?.length ?? 0} members</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-200">Community ID: {community._id?.slice?.(0, 8)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {!joined ? (
              <button onClick={() => handleMembership("join")} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                <FaUserPlus /> <span className="hidden sm:inline ml-2">Join</span>
              </button>
            ) : (
              <button onClick={() => handleMembership("leave")} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                <FaUserMinus /> <span className="hidden sm:inline ml-2">Leave</span>
              </button>
            )}

            {admin && (
              <button onClick={() => setEditMode((v) => !v)} className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black">
                <FaEdit /> <span className="hidden sm:inline ml-2">{editMode ? "Close Admin" : "Admin"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Panel (cards style) */}
        {admin && editMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0f1724] p-4 rounded-2xl border border-white/6 shadow-lg">
              <label className="block text-xs text-gray-300 mb-1">Name</label>
              <input value={editData.name} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} className="w-full p-2 rounded bg-[#071227] border border-white/6" />
            </div>

            <div className="bg-[#0f1724] p-4 rounded-2xl border border-white/6 shadow-lg">
              <label className="block text-xs text-gray-300 mb-1">Cover Image URL</label>
              <input value={editData.coverImage} onChange={(e) => setEditData((p) => ({ ...p, coverImage: e.target.value }))} className="w-full p-2 rounded bg-[#071227] border border-white/6" />
              {editData.coverImage && <img src={editData.coverImage} alt="cover" className="mt-3 w-full h-28 object-cover rounded" />}
            </div>

            <div className="bg-[#0f1724] p-4 rounded-2xl border border-white/6 shadow-lg flex flex-col justify-between">
              <label className="block text-xs text-gray-300 mb-1">Description</label>
              <textarea value={editData.description} onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))} rows={4} className="w-full p-2 rounded bg-[#071227] border border-white/6" />
              <div className="mt-3 flex gap-2">
                <button onClick={handleUpdateCommunity} className="px-3 py-2 bg-green-600 rounded text-white">Save changes</button>
                <button onClick={() => setEditMode(false)} className="px-3 py-2 bg-gray-700 rounded text-white">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Members + Add member (cards) */}
        {admin && editMode && (
          <div className="bg-[#061426] p-4 rounded-2xl border border-white/6 shadow-lg mb-6">
            <h3 className="text-sm text-gray-200 mb-3">Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3 max-h-48 overflow-y-auto pr-2">
              {Array.isArray(community.members) && community.members.length > 0 ? (
                community.members.map((m) => {
                  const memberObj = m.userId || m;
                  const memberId = idToStr(memberObj._id ?? memberObj);
                  const memberName = memberObj?.fullname ?? memberObj?.name ?? memberId;
                  return (
                    <div key={memberId} className="bg-[#071227] p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{memberName}</div>
                        <div className="text-xs text-gray-400">{m.role}</div>
                      </div>
                      <div className="flex gap-2">
                        {m.role !== "admin" && (
                          <button onClick={() => handlePromoteMember(memberId)} className="px-2 py-1 bg-indigo-600 rounded text-xs">Promote</button>
                        )}
                        <button onClick={() => handleRemoveMember(memberId)} className="px-2 py-1 bg-red-600 rounded text-xs">Remove</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400">No members yet.</div>
              )}
            </div>

            <div className="flex gap-2">
              <input value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} placeholder="Add member by userId" className="flex-1 p-2 rounded bg-[#071227] border border-white/6" />
              <button onClick={handleAddMember} className="px-3 py-2 bg-indigo-600 rounded">Add</button>
            </div>
          </div>
        )}

        {/* Posts grid (Users style cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No posts yet.</div>
          ) : (
            posts.map((post) => {
              const pinned = !!post.isPinned;
              const liked = userLikedPost(post, userId);
              const likeCount = post.likeCount ?? post.likes?.length ?? 0;
              const commentCount = post.commentCount ?? post.comments?.length ?? 0;

              return (
                <motion.div key={post._id} whileHover={{ scale: 1.02 }} className={`bg-[#071227] p-4 rounded-2xl border ${pinned ? "border-yellow-500/40" : "border-white/6"} shadow-lg flex flex-col`}>
                  <div className="flex items-start gap-3 mb-3">
                    <img src={post.userId?.avatar || "/avatars/default.png"} alt={post.userId?.fullname || userName} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{post.userId?.fullname || userName}</div>
                          <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="relative">
                          <button onClick={() => setMenuOpenForPost(menuOpenForPost === post._id ? null : post._id)} className="p-1 text-gray-300 hover:text-white">
                            <FaEllipsisV />
                          </button>
                          {menuOpenForPost === post._id && (
                            <div className="absolute right-0 mt-2 w-36 bg-[#081226] border border-white/6 rounded-lg shadow-lg z-30">
                              <button onClick={() => { setReportTarget({ type: "Post", id: post._id }); setIsReportOpen(true); setMenuOpenForPost(null); }} className="w-full px-3 py-2 text-left hover:bg-white/5">Report Post</button>
                              {admin && <button onClick={() => handlePinToggle(post._id, pinned)} className="w-full px-3 py-2 text-left hover:bg-white/5">{pinned ? "Unpin" : "Pin"}</button>}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-200">{post.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <button onClick={() => handleLike(post._id)} className={`flex items-center gap-2 ${liked ? "text-pink-400" : "hover:text-pink-400"}`}>
                        <FaHeart /> <span className="text-xs">{likeCount}</span>
                      </button>

                      <button onClick={() => setShowComments((s) => ({ ...s, [post._id]: !s[post._id] }))} className="flex items-center gap-2 hover:text-cyan-300">
                        <FaCommentAlt /> <span className="text-xs">{commentCount}</span>
                      </button>

                      {admin && (
                        <button onClick={() => handlePinToggle(post._id, pinned)} className="flex items-center gap-2 hover:text-yellow-300">
                          <FaThumbsUp /> <span className="text-xs">{pinned ? "Pinned" : "Pin"}</span>
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">ID: {post._id.slice(0, 8)}</div>
                  </div>

                  {/* Comments area (collapsible) */}
                  <AnimatePresence>
                    {showComments[post._id] && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="mt-3 pt-3 border-t border-white/6 space-y-3">
                        {Array.isArray(post.comments) && post.comments.length > 0 ? (
                          post.comments.map((c) => (
                            <div key={c._id} className="text-sm text-gray-200 space-y-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="font-medium text-indigo-300">{c.userId?.fullname ?? "User"}:</span> <span>{c.content}</span>
                                </div>
                                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                              </div>

                              {/* Replies */}
                              <div className="ml-4 space-y-2">
                                {Array.isArray(c.replies) && c.replies.length > 0 ? (
                                  c.replies.map((r) => (
                                    <div key={r._id} className="text-xs text-gray-400">
                                      <span className="font-medium text-indigo-300">{r.userId?.fullname ?? "User"}:</span> {r.content}
                                    </div>
                                  ))
                                ) : null}

                                <div className="flex gap-2 items-center">
                                  <input value={replyText[c._id] || ""} onChange={(e) => setReplyText((p) => ({ ...p, [c._id]: e.target.value }))} placeholder="Reply..." className="flex-1 p-2 text-sm rounded bg-[#061426] border border-white/6" />
                                  <button onClick={() => handleAddReply(post._id, c._id)} className="px-3 py-1 bg-indigo-600 rounded text-xs">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm">No comments yet.</div>
                        )}

                        {/* Add comment */}
                        <div className="flex gap-2 mt-2">
                          <input value={commentText[post._id] || ""} onChange={(e) => setCommentText((p) => ({ ...p, [post._id]: e.target.value }))} placeholder="Write a comment..." className="flex-1 p-2 rounded bg-[#061426] border border-white/6" />
                          <button onClick={() => handleAddComment(post._id)} className="px-3 py-1 bg-green-600 rounded text-sm">Send</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* New post card at bottom (if joined) */}
        {joined && (
          <div className="mt-6 bg-[#071227] p-4 rounded-2xl border border-white/6 shadow-lg max-w-3xl">
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} rows={3} className="w-full p-3 rounded bg-[#061426] border border-white/6 mb-3" placeholder="Share something to the community..."></textarea>
            <div className="flex justify-end">
              <button onClick={handleAddPost} className="px-4 py-2 bg-indigo-600 rounded">Post</button>
            </div>
          </div>
        )}

        {/* Report Modal */}
        <AnimatePresence>
          {isReportOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md bg-[#071227] p-6 rounded-2xl border border-white/6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Report {reportTarget?.type}</h3>
                  <button onClick={() => setIsReportOpen(false)} className="text-gray-400"><X /></button>
                </div>
                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Report Type</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)} required className="w-full p-2 rounded bg-[#061426] border border-white/6">
                      <option value="">Select</option>
                      <option value="abuse">Abuse</option>
                      <option value="inappropriate">Inappropriate</option>
                      <option value="bug">Bug</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Details</label>
                    <textarea value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} rows={4} required className="w-full p-2 rounded bg-[#061426] border border-white/6" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsReportOpen(false)} className="px-3 py-2 bg-gray-700 rounded">Cancel</button>
                    <button type="submit" className="px-3 py-2 bg-red-600 rounded">Submit</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCommunityDetails;
