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
  const [reportTarget, setReportTarget] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const userName = "You";
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const idToStr = (x) =>
    !x ? "" : typeof x === "string" ? x : x._id ? String(x._id) : String(x);
  const isMemberOf = (comm, uid) =>
    Array.isArray(comm?.members) &&
    comm.members.some((m) => idToStr(m.userId) === idToStr(uid));
  const isAdminOf = (comm, uid) =>
    Array.isArray(comm?.members) &&
    comm.members.some(
      (m) => idToStr(m.userId) === idToStr(uid) && m.role === "admin"
    );
  const userLikedPost = (post, uid) =>
    post?.likes?.some(
      (l) => idToStr(l) === idToStr(uid) || idToStr(l._id) === idToStr(uid)
    ) ?? false;
  const showNotification = (msg, type = "success") =>
    type === "error"
      ? toast.error(msg)
      : toast.success(msg, { duration: 4000 });

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
        "Error fetching community/posts:",
        err?.response?.data ?? err.message
      );
    } finally {
      setLoading(false);
    }
  };

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
        newOnes.forEach((n) =>
          showNotification(n.message ?? "You have a new notification")
        );
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
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [id, userId]);

  const handleMembership = async (action) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.patch(
        `/communities/${id}/${action}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.post(
        "/posts",
        { userId, content: newPost, communityId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.post(
        `/posts/${postId}/like`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.post(
        `/posts/${postId}/comment`,
        { userId, content: txt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.patch(
        `/communities/${id}/${action}`,
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.put(
        `/communities/${id}`,
        { ...editData, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.patch(
        `/communities/${id}/leave`,
        { userId: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.patch(
        `/communities/${id}/join`,
        { userId: newMemberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.patch(
        `/communities/${id}/promote`,
        { userId: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.post(
        `/posts/${postId}/comment/${commentId}/reply`,
        { userId, content: txt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText((p) => ({ ...p, [commentId]: "" }));
      showNotification("Reply added");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(err?.response?.data ?? err.message);
      showNotification("Failed to add reply", "error");
    }
  };

  const toggleReplies = (commentId) =>
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));

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
      toast.success(`${reportTarget.type} reported successfully ✅`);
      setReportType("");
      setReportMessage("");
      setReportTarget(null);
      setIsReportOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit report ❌");
    }
  };

  if (loading || !community)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );

  const joined = isMemberOf(community, userId);
  const admin = isAdminOf(community, userId);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{community.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{community.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            👥 {community.members?.length ?? 0} members
          </p>
        </div>

        <div className="flex gap-3">
          {!joined ? (
            <button
              onClick={() => handleMembership("join")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow"
            >
              Join
            </button>
          ) : (
            <button
              onClick={() => handleMembership("leave")}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition shadow"
            >
              Leave
            </button>
          )}

          {admin && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-700 transition shadow"
            >
              {editMode ? "Close Admin" : "Admin"}
            </button>
          )}
        </div>
      </div>

      {/* ADMIN PANEL */}
      {admin && editMode && (
        <div className="bg-[#11141b] border border-white/10 rounded-xl p-5 space-y-4 shadow-lg">
          <h2 className="text-xl font-semibold text-indigo-400">
            Admin Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Community Name"
              className="bg-[#0b0e13] p-3 rounded-xl border border-white/10 focus:border-indigo-400 outline-none"
            />
            <input
              value={editData.coverImage}
              onChange={(e) =>
                setEditData({ ...editData, coverImage: e.target.value })
              }
              placeholder="Cover Image URL"
              className="bg-[#0b0e13] p-3 rounded-xl border border-white/10 focus:border-indigo-400 outline-none"
            />

            <button
              onClick={handleUpdateCommunity}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition shadow"
            >
              Save Changes
            </button>
          </div>

          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            placeholder="Description"
            rows={2}
            className="bg-[#0b0e13] w-full p-3 rounded-xl border border-white/10 focus:border-indigo-400 outline-none"
          />

          {/* Members */}
          <div>
            <h3 className="font-semibold text-indigo-400 mb-2">Members</h3>

            <div className="max-h-52 overflow-y-auto space-y-2">
              {community.members?.map((m) => {
                const memberObj = m.userId || m;
                return (
                  <div
                    key={memberObj._id}
                    className="flex justify-between items-center bg-[#0c0f15] border border-white/5 rounded-xl p-3"
                  >
                    <div>
                      <p className="font-medium">{memberObj.fullname}</p>
                      <p className="text-xs text-gray-400">{m.role}</p>
                    </div>

                    <div className="flex gap-2">
                      {m.role !== "admin" && (
                        <button
                          onClick={() => handlePromoteMember(memberObj._id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                          Promote
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveMember(memberObj._id)}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                placeholder="User ID"
                className="bg-[#0b0e13] flex-1 p-3 rounded-xl border border-white/10 focus:border-indigo-400 outline-none"
              />
              <button
                onClick={handleAddMember}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POSTS SECTION */}
      <div className="space-y-5">
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No posts yet.</p>
        ) : (
          posts.map((post) => {
            const liked = userLikedPost(post, userId);
            const pinned = post.isPinned;

            return (
              <div
                key={post._id}
                className={`p-5 rounded-xl border border-white/10 bg-[#11141b] shadow transition ${
                  pinned ? "border-yellow-500/40" : ""
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center gap-3">
                  <img
                    src={post.userId?.avatar}
                    className="w-12 h-12 rounded-full border border-indigo-400"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">{post.userId?.fullname}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setReportTarget({ type: "Post", id: post._id }) ||
                      setIsReportOpen(true)
                    }
                    className="p-2 rounded-lg hover:bg-[#1c1f26] transition"
                  >
                    <FaEllipsisV />
                  </button>
                </div>

                {/* Post Content */}
                <p className="mt-3 text-gray-200 text-sm">{post.content}</p>

                {/* Actions */}
                <div className="flex gap-5 mt-4 text-sm">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 hover:text-red-400 transition ${
                      liked ? "text-red-400" : "text-gray-300"
                    }`}
                  >
                    <FaHeart /> {post.likeCount ?? post.likes?.length ?? 0}
                  </button>

                  <button
                    onClick={() =>
                      setShowComments((p) => ({
                        ...p,
                        [post._id]: !p[post._id],
                      }))
                    }
                    className="flex items-center gap-2 hover:text-indigo-400 transition"
                  >
                    <FaCommentAlt /> {post.commentCount ?? 0}
                  </button>

                  {admin && (
                    <button
                      onClick={() => handlePinToggle(post._id, pinned)}
                      className="flex items-center gap-2 hover:text-yellow-400 transition"
                    >
                      📌 {pinned ? "Unpin" : "Pin"}
                    </button>
                  )}
                </div>

                {/* COMMENTS */}
                {showComments[post._id] && (
                  <div className="bg-[#0c0f15] rounded-xl p-4 mt-3 border border-white/5 space-y-3">
                    {(post.comments || []).map((c) => (
                      <div key={c._id} className="space-y-1">
                        <p className="text-sm">
                          <span className="text-indigo-400 font-semibold">
                            {c.userId.fullname}:
                          </span>{" "}
                          {c.content}
                        </p>

                        {/* Replies */}
                        {(c.replies || []).map((r) => (
                          <p key={r._id} className="ml-4 text-gray-300 text-sm">
                            <span className="text-cyan-300 font-semibold">
                              {r.userId.fullname}:
                            </span>{" "}
                            {r.content}
                          </p>
                        ))}

                        {/* Reply Input */}
                        <div className="flex gap-2 mt-2">
                          <input
                            value={replyText[c._id] || ""}
                            onChange={(e) =>
                              setReplyText((p) => ({
                                ...p,
                                [c._id]: e.target.value,
                              }))
                            }
                            placeholder="Reply..."
                            className="flex-1 bg-[#0b0e13] p-2 rounded-xl text-sm border border-white/10 focus:border-indigo-400 outline-none"
                          />
                          <button
                            onClick={() => handleAddReply(post._id, c._id)}
                            className="px-3 py-2 bg-indigo-600 rounded-xl text-sm hover:bg-indigo-700 transition"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-2 pt-2">
                      <input
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText((p) => ({
                            ...p,
                            [post._id]: e.target.value,
                          }))
                        }
                        placeholder="Add a comment..."
                        className="flex-1 bg-[#0b0e13] p-3 rounded-xl border border-white/10 focus:border-indigo-400 outline-none text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-4 py-2 bg-green-600 rounded-xl hover:bg-green-700 transition text-sm"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* NEW POST FIELD */}
      {joined && (
        <div className="bg-[#11141b] border border-white/10 rounded-xl p-4 flex gap-3 mt-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something..."
            rows={2}
            className="flex-1 bg-[#0b0e13] p-3 rounded-xl border border-white/10 focus:border-indigo-400 outline-none text-sm"
          />
          <button
            onClick={handleAddPost}
            className="px-5 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow"
          >
            Post
          </button>
        </div>
      )}

      {/* REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <div className="bg-[#11141b] border border-white/10 p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold text-red-400 mb-3">
              Report {reportTarget?.type}
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-3 bg-[#0b0e13] rounded-xl border border-white/10 focus:border-red-400 outline-none text-sm"
              >
                <option value="">Select reason</option>
                <option value="spam">Spam</option>
                <option value="abuse">Abusive</option>
                <option value="other">Other</option>
              </select>

              <textarea
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                placeholder="Message"
                rows={3}
                className="w-full p-3 bg-[#0b0e13] rounded-xl border border-white/10 focus:border-red-400 outline-none text-sm"
              />

              <button
                type="submit"
                className="w-full py-2 bg-red-600 rounded-xl hover:bg-red-700 transition shadow text-sm"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
