import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast"; // ✅ add toast
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
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";
import { X } from "lucide-react";
export const CommunityDetails = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams(); // community id
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    coverImage: "",
  });
  const [newMemberId, setNewMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastSeen, setLastSeen] = useState(Date.now());
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // { type: "Post"|"Comment"|"User", id }
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const userName = "You";
  // --- extra states ---
  const [replyText, setReplyText] = useState({}); // store reply text per comment
  const [showReplies, setShowReplies] = useState({}); // toggle replies section
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${reportTarget.type} reported successfully ✅`);
      setReportType("");
      setReportMessage("");
      setReportTarget(null);
      setIsReportOpen(false);
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      toast.error("Failed to submit report ❌");
    }
  };
  // --- handle add reply ---
  const handleAddReply = async (postId, commentId) => {
    const txt = (replyText[commentId] || "").trim();
    if (!txt) return;
    try {
      await axios.post(
        `/posts/${postId}/comment/${commentId}/reply`,
        {
          userId,
          content: txt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReplyText((p) => ({ ...p, [commentId]: "" }));
      showNotification("Reply added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Error adding reply:", err?.response?.data ?? err.message);
      showNotification("Failed to add reply", "error");
    }
  };

  // --- handle toggle replies ---
  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // --- helpers ---
  const idToStr = (x) => {
    if (!x) return "";
    if (typeof x === "string") return x;
    if (x._id) return String(x._id);
    return String(x);
  };

  const isMemberOf = (comm, uid) =>
    Array.isArray(comm?.members) &&
    comm.members.some((m) => idToStr(m.userId) === idToStr(uid));

  const isAdminOf = (comm, uid) =>
    Array.isArray(comm?.members) &&
    comm.members.some(
      (m) => idToStr(m.userId) === idToStr(uid) && m.role === "admin"
    );

  const userLikedPost = (post, uid) => {
    if (!post?.likes) return false;
    return post.likes.some(
      (l) => idToStr(l) === idToStr(uid) || idToStr(l._id) === idToStr(uid)
    );
  };

  // --- toast helper ---
  const showNotification = (msg, type = "success") => {
    if (type === "error") toast.error(msg);
    else toast.success(msg, { duration: 4000 });
  };

  // --- Fetch community + posts ---
  const fetchCommunityAndPosts = async () => {
    setLoading(true);
    try {
      const [resCommunity, resPosts] = await Promise.all([
        axios.get(`/communities/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/communities/${id}/posts?sort=new&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const communityData = resCommunity?.data?.data ?? resCommunity?.data;
      const postsData =
        resPosts?.data?.data?.posts ?? resPosts?.data?.posts ?? [];

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
      console.error(
        "Error fetching community or posts:",
        err?.response?.data ?? err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch notifications ---
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data ?? res.data ?? [];

      const newOnes = data.filter(
        (n) => new Date(n.createdAt).getTime() > lastSeen
      );

      if (newOnes.length > 0) {
        newOnes.forEach((n) => {
          showNotification(n.message ?? "You have a new notification");
        });
        setLastSeen(Date.now());
      }

      setNotifications(data);
    } catch (err) {
      console.error(
        "Error fetching notifications:",
        err?.response?.data ?? err.message
      );
    }
  };

  useEffect(() => {
    fetchCommunityAndPosts();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // refresh every 20s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  // --- Membership ---
  const handleMembership = async (action) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.patch(
        `/communities/${id}/${action}`,
        {
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification(`Successfully ${action}ed community`);
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(`Error ${action}:`, err?.response?.data ?? err.message);
      showNotification(`Failed to ${action}`, "error");
    }
  };

  // --- Posts / Likes / Comments ---
  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post(
        "/posts",
        {
          userId,
          content: newPost,
          communityId: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewPost("");
      showNotification("Post created successfully");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Error creating post:", err?.response?.data ?? err.message);
      showNotification("Failed to create post", "error");
    }
  };

  const handleLike = async (postId) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.post(
        `/posts/${postId}/like`,
        {
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification("You liked a post");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Error liking post:", err?.response?.data ?? err.message);
      showNotification("Failed to like post", "error");
    }
  };

  const handleAddComment = async (postId) => {
    const txt = (commentText[postId] || "").trim();
    if (!txt) return;
    try {
      await axios.post(
        `/posts/${postId}/comment`,
        {
          userId,
          content: txt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText((p) => ({ ...p, [postId]: "" }));
      showNotification("Comment added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(
        "Error adding comment:",
        err?.response?.data ?? err.message
      );
      showNotification("Failed to add comment", "error");
    }
  };

  const handlePinToggle = async (postId, currentlyPinned) => {
    try {
      const action = currentlyPinned ? "unpin" : "pin";
      await axios.patch(
        `/communities/${id}/${action}`,
        {
          postId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification(`Post ${currentlyPinned ? "unpinned" : "pinned"}`);
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Error pin/unpin:", err?.response?.data ?? err.message);
      showNotification("Failed to pin/unpin", "error");
    }
  };

  const handleUpdateCommunity = async () => {
    if (!editData.name.trim() || !userId) return alert("Name is required");
    try {
      await axios.put(
        `/communities/${id}`,
        {
          ...editData,
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMode(false);
      showNotification("Community updated");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(
        "Error updating community:",
        err?.response?.data ?? err.message
      );
      showNotification("Failed to update", "error");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!memberId) return;
    try {
      await axios.patch(
        `/communities/${id}/leave`,
        {
          userId: memberId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification("Member removed");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(
        "Error removing member:",
        err?.response?.data ?? err.message
      );
      showNotification("Failed to remove member", "error");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId?.trim()) return alert("Enter a userId");
    try {
      await axios.patch(
        `/communities/${id}/join`,
        {
          userId: newMemberId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMemberId("");
      showNotification("Member added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("Error adding member:", err?.response?.data ?? err.message);
      showNotification("Failed to add member", "error");
    }
  };

  const handlePromoteMember = async (memberId) => {
    if (!memberId) return;
    try {
      await axios.patch(
        `/communities/${id}/promote`,
        {
          userId: memberId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification("Member promoted to admin");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(
        "Error promoting member:",
        err?.response?.data ?? err.message
      );
      showNotification("Failed to promote", "error");
    }
  };

  if (loading || !community) {
    return <div className="p-6 text-gray-400">Loading community...</div>;
  }

  const joined = isMemberOf(community, userId);
  const admin = isAdminOf(community, userId);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            {community.name}
          </h1>
          <p className="text-gray-400 mt-1">{community.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            {community.members?.length ?? 0} members
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!joined ? (
            <button
              onClick={() => handleMembership("join")}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-cyan-500/50"
            >
              <FaUserPlus /> Join
            </button>
          ) : (
            <button
              onClick={() => handleMembership("leave")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-red-500/50"
            >
              <FaUserMinus /> Leave
            </button>
          )}

          {admin && (
            <button
              onClick={() => setEditMode((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all shadow-md hover:shadow-yellow-400/50"
            >
              <FaEdit /> {editMode ? "Close Admin" : "Admin"}
            </button>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      {admin && editMode && (
        <section className="bg-[#142027] p-4 rounded-lg space-y-4 border border-gray-700 shadow-lg shadow-cyan-500/20">
          <h2 className="text-lg font-semibold text-cyan-300">
            Admin Controls
          </h2>

          {/* Edit info */}
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData((p) => ({ ...p, name: e.target.value }))
              }
              className="p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500"
              placeholder="Name"
            />
            <input
              value={editData.coverImage}
              onChange={(e) =>
                setEditData((p) => ({ ...p, coverImage: e.target.value }))
              }
              className="p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500"
              placeholder="Cover image URL"
            />
            <button
              onClick={handleUpdateCommunity}
              className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 shadow-md hover:shadow-green-500/50"
            >
              Save changes
            </button>
          </div>

          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-cyan-500"
            placeholder="Description"
            rows={2}
          />

          {/* Members management */}
          <div>
            <h3 className="font-semibold mb-2 text-indigo-300">Members</h3>
            <div className="grid gap-2 max-h-44 overflow-y-auto">
              {Array.isArray(community.members) &&
              community.members.length > 0 ? (
                community.members.map((m) => {
                  const memberObj = m.userId || m; // either populated object or id
                  const memberId = idToStr(memberObj._id ?? memberObj);
                  const memberName =
                    memberObj?.fullname ?? memberObj?.fullname ?? memberId;
                  return (
                    <div
                      key={memberId}
                      className="flex items-center justify-between bg-[#1f2a2e] p-2 rounded hover:shadow-md hover:shadow-cyan-500/30 transition"
                    >
                      <div>
                        <div className="font-medium">{memberName}</div>
                        <div className="text-xs text-gray-400">{m.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.role !== "admin" && (
                          <button
                            onClick={() => handlePromoteMember(memberId)}
                            className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm shadow hover:shadow-blue-400/40"
                            title="Promote to admin"
                          >
                            <FaUserShield />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-sm shadow hover:shadow-red-400/40"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400">No members yet.</div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="flex-1 p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                placeholder="Add member by User ID"
              />
              <button
                onClick={handleAddMember}
                className="px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-700 shadow hover:shadow-indigo-500/40"
              >
                Add
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Posts list */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts yet.</p>
        ) : (
          posts.map((post, idx) => {
            const pinned = !!post.isPinned;
            const liked = userLikedPost(post, userId);
            const likeCount = post.likeCount ?? post.likes?.length ?? 0;
            const commentCount =
              post.commentCount ?? post.comments?.length ?? 0;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: idx * 0.03 }}
                className={`p-4 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition ${
                  pinned
                    ? "bg-yellow-900/20 border border-yellow-600"
                    : "bg-[#334155]"
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <img
                    src={post.userId?.avatar || "/avatars/default.png"}
                    alt={post.userId?.fullname || userName}
                    className="w-10 h-10 rounded-full border-2 border-cyan-500 shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-cyan-300 drop-shadow">
                            {post.userId?.fullname || userName}
                          </div>
                          {pinned && (
                            <span className="text-xs text-yellow-300 animate-pulse">
                              📌 Pinned
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setReportTarget({ type: "Post", id: post._id });
                          setIsReportOpen(true);
                        }}
                        className="p-2 rounded hover:bg-gray-700 transition"
                      >
                        <FaEllipsisV />
                      </button>
                    </div>

                    <p className="mt-3">{post.content}</p>

                    <div className="flex items-center gap-6 mt-4 text-gray-300">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 transition ${
                          liked
                            ? "text-red-400 drop-shadow-[0_0_10px_#f87171]"
                            : "hover:text-red-400"
                        }`}
                        aria-pressed={liked}
                      >
                        <FaHeart />
                        <span>{likeCount}</span>
                      </button>

                      <button
                        onClick={() =>
                          setShowComments((s) => ({
                            ...s,
                            [post._id]: !s[post._id],
                          }))
                        }
                        className="flex items-center gap-2 hover:text-blue-400 hover:drop-shadow-[0_0_8px_#60a5fa]"
                      >
                        <FaCommentAlt />
                        <span>{commentCount}</span>
                      </button>

                      {/* Admin pin toggle */}
                      {admin && (
                        <button
                          onClick={() => handlePinToggle(post._id, pinned)}
                          className="flex items-center gap-2 hover:text-yellow-300 hover:drop-shadow-[0_0_8px_#facc15]"
                        >
                          <FaThumbsUp />
                          <span>{pinned ? "Unpin" : "Pin"}</span>
                        </button>
                      )}
                    </div>

                    {/* Comments area */}
                    <AnimatePresence>
                      {showComments[post._id] && (
                        <motion.div
                          transition={{ duration: 2 }}
                          className="bg-[#1e293b] p-3 rounded-lg mt-3 space-y-3 shadow-inner shadow-cyan-500/20"
                        >
                          {Array.isArray(post.comments) &&
                          post.comments.length > 0 ? (
                            post.comments.map((c, i) => (
                              <div
                                key={i}
                                className="text-sm text-gray-300 space-y-2"
                              >
                                {/* Comment */}
                                <div>
                                  <span className="font-semibold text-cyan-400">
                                    {c.userId.fullname ?? "User"}:
                                  </span>{" "}
                                  {c.content}
                                </div>

                                {/* Show replies */}
                                {c.replies && c.replies.length > 0 && (
                                  <div className="ml-6 space-y-2">
                                    {c.replies.map((r, ri) => (
                                      <div
                                        key={ri}
                                        className="text-xs text-gray-400"
                                      >
                                        <span className="font-semibold text-indigo-400">
                                          {r.userId.fullname ?? "User"}:
                                        </span>{" "}
                                        {r.content}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Reply input */}
                                <div className="ml-6 flex gap-2">
                                  <input
                                    value={replyText[c._id] || ""}
                                    onChange={(e) =>
                                      setReplyText((prev) => ({
                                        ...prev,
                                        [c._id]: e.target.value,
                                      }))
                                    }
                                    className="flex-1 p-1 rounded bg-gray-800 text-xs focus:ring-1 focus:ring-cyan-500"
                                    placeholder="Write a reply..."
                                  />
                                  <button
                                    onClick={() =>
                                      handleAddReply(post._id, c._id)
                                    }
                                    className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700 hover:shadow-md hover:shadow-green-400/40"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 text-sm">
                              No comments yet.
                            </div>
                          )}

                          {/* Add new comment */}
                          <div className="flex gap-2">
                            <input
                              value={commentText[post._id] || ""}
                              onChange={(e) =>
                                setCommentText((p) => ({
                                  ...p,
                                  [post._id]: e.target.value,
                                }))
                              }
                              className="flex-1 p-2 rounded bg-gray-800 focus:ring-1 focus:ring-blue-500"
                              placeholder="Write a comment..."
                            />
                            <button
                              onClick={() => handleAddComment(post._id)}
                              className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 hover:shadow-md hover:shadow-blue-400/40"
                            >
                              Send
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* New post only for members */}
      {joined && (
        <motion.div
          className="bg-[#334155] p-4 rounded-2xl shadow-md hover:shadow-cyan-500/30 transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            className="w-full p-3 rounded-lg bg-[#1e293b] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            placeholder="Share an idea, ask a question..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddPost}
              className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition shadow hover:shadow-cyan-500/50"
            >
              Post
            </button>
          </div>
        </motion.div>
      )}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md relative"
          >
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-red-500">
              Report {reportTarget?.type}
            </h2>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-red-400"
                >
                  <option value="">-- Select an issue --</option>
                  <option value="abuse">🚨 Abuse</option>
                  <option value="inappropriate">⚠️ Inappropriate</option>
                  <option value="bug">🐞 Bug</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Details
                </label>
                <textarea
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  required
                  rows="3"
                  className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-red-400"
                  placeholder="Describe the issue..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 rounded-lg shadow hover:scale-105 transition"
              >
                Submit Report
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
