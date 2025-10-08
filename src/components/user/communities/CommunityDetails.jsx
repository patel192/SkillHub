import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast"; 
import { Spinner } from "../../../utils/Spinner";
import {
  FaHeart,
  FaCommentAlt,
  FaThumbsUp,
  FaUserPlus,
  FaUserMinus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaEllipsisV,
} from "react-icons/fa";
import { X } from "lucide-react";
import axios from "axios";

export const CommunityDetails = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "", coverImage: "" });
  const [newMemberId, setNewMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastSeen, setLastSeen] = useState(Date.now());
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const userName = "You";
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const idToStr = (x) => (!x ? "" : typeof x === "string" ? x : x._id ? String(x._id) : String(x));
  const isMemberOf = (comm, uid) => Array.isArray(comm?.members) && comm.members.some((m) => idToStr(m.userId) === idToStr(uid));
  const isAdminOf = (comm, uid) => Array.isArray(comm?.members) && comm.members.some((m) => idToStr(m.userId) === idToStr(uid) && m.role === "admin");
  const userLikedPost = (post, uid) => post?.likes?.some((l) => idToStr(l) === idToStr(uid) || idToStr(l._id) === idToStr(uid)) ?? false;
  const showNotification = (msg, type = "success") => type === "error" ? toast.error(msg) : toast.success(msg, { duration: 4000 });

  const fetchCommunityAndPosts = async () => {
    setLoading(true);
    try {
      const [resCommunity, resPosts] = await Promise.all([
        axios.get(`/communities/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/communities/${id}/posts?sort=new&limit=50`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const communityData = resCommunity?.data?.data ?? resCommunity?.data;
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
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/notifications/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data?.data ?? res.data ?? [];
      const newOnes = data.filter((n) => new Date(n.createdAt).getTime() > lastSeen);
      if (newOnes.length > 0) {
        newOnes.forEach((n) => showNotification(n.message ?? "You have a new notification"));
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
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [id, userId]);

  const handleMembership = async (action) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.patch(`/communities/${id}/${action}`, { userId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`Successfully ${action}ed community`);
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification(`Failed to ${action}`, "error");
    }
  };

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post("/posts", { userId, content: newPost, communityId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setNewPost("");
      showNotification("Post created successfully");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
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
      console.error(err?.response?.data ?? err.message);
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
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to add comment", "error");
    }
  };

  const handlePinToggle = async (postId, currentlyPinned) => {
    try {
      const action = currentlyPinned ? "unpin" : "pin";
      await axios.patch(`/communities/${id}/${action}`, { postId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`Post ${currentlyPinned ? "unpinned" : "pinned"}`);
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to pin/unpin", "error");
    }
  };

  const handleUpdateCommunity = async () => {
    if (!editData.name.trim() || !userId) return alert("Name is required");
    try {
      await axios.put(`/communities/${id}`, { ...editData, userId }, { headers: { Authorization: `Bearer ${token}` } });
      setEditMode(false);
      showNotification("Community updated");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to update", "error");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!memberId) return;
    try {
      await axios.patch(`/communities/${id}/leave`, { userId: memberId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("Member removed");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to remove member", "error");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId?.trim()) return alert("Enter a userId");
    try {
      await axios.patch(`/communities/${id}/join`, { userId: newMemberId }, { headers: { Authorization: `Bearer ${token}` } });
      setNewMemberId("");
      showNotification("Member added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to add member", "error");
    }
  };

  const handlePromoteMember = async (memberId) => {
    if (!memberId) return;
    try {
      await axios.patch(`/communities/${id}/promote`, { userId: memberId }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("Member promoted to admin");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to promote", "error");
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
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to add reply", "error");
    }
  };

  const toggleReplies = (commentId) => setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    try {
      await axios.post("/report", { reporter: userId, type: reportType, description: reportMessage, targetType: reportTarget.type, targetId: reportTarget.id }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`${reportTarget.type} reported successfully ✅`);
      setReportType(""); setReportMessage(""); setReportTarget(null); setIsReportOpen(false);
    } catch (err) {
      console.error(err); toast.error("Failed to submit report ❌");
    }
  };

  if (loading || !community) return <div className="flex justify-center items-center h-screen text-white"><Spinner /></div>;

  const joined = isMemberOf(community, userId);
  const admin = isAdminOf(community, userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">{community.name}</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">{community.description}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{community.members?.length ?? 0} members</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {!joined ? (
            <button onClick={() => handleMembership("join")} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition shadow hover:shadow-cyan-500/50 text-xs sm:text-sm">
              <FaUserPlus /> Join
            </button>
          ) : (
            <button onClick={() => handleMembership("leave")} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 rounded-lg hover:bg-red-700 transition shadow hover:shadow-red-500/50 text-xs sm:text-sm">
              <FaUserMinus /> Leave
            </button>
          )}
          {admin && (
            <button onClick={() => setEditMode((v) => !v)} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition shadow hover:shadow-yellow-400/50 text-xs sm:text-sm">
              <FaEdit /> {editMode ? "Close Admin" : "Admin"}
            </button>
          )}
        </div>
      </div>

      {/* ADMIN PANEL */}
      {admin && editMode && (
        <section className="bg-[#142027] p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4 border border-gray-700 shadow-lg shadow-cyan-500/20">
          <h2 className="text-lg sm:text-xl font-semibold text-cyan-300">Admin Controls</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <input value={editData.name} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />
            <input value={editData.coverImage} onChange={(e) => setEditData((p) => ({ ...p, coverImage: e.target.value }))} placeholder="Cover image URL" className="p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />
            <button onClick={handleUpdateCommunity} className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 shadow hover:shadow-green-500/40 text-sm sm:text-base">Save changes</button>
          </div>
          <textarea value={editData.description} onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />

          {/* MEMBERS MANAGEMENT */}
          <div>
            <h3 className="font-semibold mb-2 text-indigo-300 text-sm sm:text-base">Members</h3>
            <div className="grid gap-2 max-h-44 overflow-y-auto">
              {Array.isArray(community.members) && community.members.length > 0 ? (
                community.members.map((m) => {
                  const memberObj = m.userId || m;
                  const memberId = idToStr(memberObj._id ?? memberObj);
                  const memberName = memberObj?.fullname ?? memberId;
                  return (
                    <div key={memberId} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1f2a2e] p-2 rounded hover:shadow-md hover:shadow-cyan-500/30 transition">
                      <div>
                        <div className="font-medium text-sm sm:text-base">{memberName}</div>
                        <div className="text-xs text-gray-400">{m.role}</div>
                      </div>
                      <div className="flex gap-2 mt-1 sm:mt-0">
                        {m.role !== "admin" && (
                          <button onClick={() => handlePromoteMember(memberId)} className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-xs sm:text-sm shadow hover:shadow-blue-400/40" title="Promote to admin">
                            <FaUserShield />
                          </button>
                        )}
                        <button onClick={() => handleRemoveMember(memberId)} className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-xs sm:text-sm shadow hover:shadow-red-400/40">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 text-sm sm:text-base">No members yet.</div>
              )}
            </div>
            <div className="flex gap-2 mt-2 sm:mt-3">
              <input value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} placeholder="Add member by User ID" className="flex-1 p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
              <button onClick={handleAddMember} className="px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-700 shadow hover:shadow-indigo-500/40 text-sm sm:text-base">Add</button>
            </div>
          </div>
        </section>
      )}

      {/* POSTS AND COMMENTS */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm sm:text-base">No posts yet.</p>
        ) : posts.map((post, idx) => {
          const pinned = !!post.isPinned;
          const liked = userLikedPost(post, userId);
          const likeCount = post.likeCount ?? post.likes?.length ?? 0;
          const commentCount = post.commentCount ?? post.comments?.length ?? 0;
          return (
            <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: idx * 0.03 }} className={`p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition ${pinned ? "bg-yellow-900/20 border border-yellow-600" : "bg-[#334155]"}`}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                <img src={post.userId?.avatar || "/avatars/default.png"} alt={post.userId?.fullname || userName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-500 shadow-md" />
                <div className="flex-1">
                  <div className="flex justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-cyan-300 drop-shadow text-sm sm:text-base">{post.userId?.fullname || userName}</div>
                        {pinned && <span className="text-xs text-yellow-300 animate-pulse">📌 Pinned</span>}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                    <button onClick={() => { setReportTarget({ type: "Post", id: post._id }); setIsReportOpen(true); }} className="p-1 rounded hover:bg-gray-700 transition text-xs sm:text-sm">
                      <FaEllipsisV />
                    </button>
                  </div>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base">{post.content}</p>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3 mt-3 text-gray-300">
                    <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1 sm:gap-2 transition text-xs sm:text-sm ${liked ? "text-red-400 drop-shadow-[0_0_10px_#f87171]" : "hover:text-red-400"}`}>
                      <FaHeart /> <span>{likeCount}</span>
                    </button>
                    <button onClick={() => setShowComments((s) => ({ ...s, [post._id]: !s[post._id] }))} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:text-blue-400 hover:drop-shadow-[0_0_8px_#60a5fa]">
                      <FaCommentAlt /> <span>{commentCount}</span>
                    </button>
                    {admin && (
                      <button onClick={() => handlePinToggle(post._id, pinned)} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:text-yellow-300 hover:drop-shadow-[0_0_8px_#facc15]">
                        <FaThumbsUp /> <span>{pinned ? "Unpin" : "Pin"}</span>
                      </button>
                    )}
                  </div>

                  {/* COMMENTS */}
                  <AnimatePresence>
                    {showComments[post._id] && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.5 }} className="bg-[#1e293b] p-2 sm:p-3 rounded-lg mt-2 sm:mt-3 space-y-2 shadow-inner shadow-cyan-500/20 text-sm sm:text-base">
                        {Array.isArray(post.comments) && post.comments.length > 0 ? post.comments.map((c, i) => (
                          <div key={i} className="space-y-1">
                            <div>
                              <span className="font-semibold text-cyan-400">{c.userId.fullname ?? "User"}:</span> {c.content}
                            </div>
                            {c.replies && c.replies.length > 0 && <div className="ml-4 sm:ml-6 space-y-1">
                              {c.replies.map((r, j) => <div key={j}><span className="font-semibold text-indigo-300">{r.userId.fullname ?? "User"}:</span> {r.content}</div>)}
                            </div>}
                            <div className="flex gap-2 items-center mt-1">
                              <input value={replyText[c._id] || ""} onChange={(e) => setReplyText((p) => ({ ...p, [c._id]: e.target.value }))} placeholder="Reply..." className="flex-1 p-1 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm" />
                              <button onClick={() => handleAddReply(post._id, c._id)} className="px-2 py-1 bg-cyan-600 rounded hover:bg-cyan-700 text-xs sm:text-sm">Reply</button>
                            </div>
                          </div>
                        )) : <div className="text-gray-400">No comments yet.</div>}

                        <div className="flex gap-2 mt-2">
                          <input value={commentText[post._id] || ""} onChange={(e) => setCommentText((p) => ({ ...p, [post._id]: e.target.value }))} placeholder="Add a comment..." className="flex-1 p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />
                          <button onClick={() => handleAddComment(post._id)} className="px-3 py-1.5 bg-green-600 rounded hover:bg-green-700 shadow hover:shadow-green-500/40 text-sm sm:text-base">Comment</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NEW POST */}
      {joined && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
          <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Write something..." rows={2} className="flex-1 p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />
          <button onClick={handleAddPost} className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 shadow hover:shadow-cyan-500/40 text-sm sm:text-base">Post</button>
        </div>
      )}

      {/* REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#0f172a] p-4 rounded-lg w-full max-w-md relative">
            <button onClick={() => setIsReportOpen(false)} className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700"><X size={18} /></button>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Report {reportTarget?.type}</h3>
            <form onSubmit={handleReportSubmit} className="flex flex-col gap-2">
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="p-2 rounded bg-gray-800 focus:ring-2 focus:ring-red-400 text-sm sm:text-base" required>
                <option value="">Select reason</option>
                <option value="spam">Spam</option>
                <option value="abuse">Abuse</option>
                <option value="other">Other</option>
              </select>
              <textarea value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} placeholder="Message" rows={3} className="p-2 rounded bg-gray-800 focus:ring-2 focus:ring-red-400 text-sm sm:text-base" required />
              <button type="submit" className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 shadow hover:shadow-red-500/40 text-sm sm:text-base">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
