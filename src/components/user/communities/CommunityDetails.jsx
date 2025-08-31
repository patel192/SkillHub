// CommunityDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaCommentAlt, FaThumbsUp, FaUserPlus, FaUserMinus } from "react-icons/fa";
import axios from "axios";
export const CommunityDetails = () => {
    const { id } = useParams(); // community id
  const [community, setCommunity] = useState(null); // full community (members populated)
  const [posts, setPosts] = useState([]); // posts list
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const userName = "You"; // optionally fetch real user profile later

  // helper: safe string compare for ObjectId / populated object / string
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
    comm.members.some((m) => idToStr(m.userId) === idToStr(uid) && m.role === "admin");

  const userLikedPost = (post, uid) => {
    if (!post?.likes) return false;
    return post.likes.some((l) => idToStr(l) === idToStr(uid) || idToStr(l._id) === idToStr(uid));
  };

  // Fetch both community and its posts
  const fetchCommunityAndPosts = async () => {
    setLoading(true);
    try {
      const [resCommunity, resPosts] = await Promise.all([
        axios.get(`http://localhost:8000/communities/${id}`), // returns full community (populated)
        axios.get(`http://localhost:8000/communities/${id}/posts?sort=new`), // returns posts + small community meta
      ]);

      // community endpoint: res.data.data (single community)
      const communityData = resCommunity?.data?.data ?? resCommunity?.data;
      // posts endpoint: resPosts.data.data.posts (shaped posts)
      const postsData = resPosts?.data?.data?.posts ?? resPosts?.data?.posts ?? [];

      setCommunity(communityData);
      setPosts(postsData);
    } catch (err) {
      console.error("❌ Error fetching community or posts:", err?.response?.data ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityAndPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Membership (PATCH per routes)
  const handleMembership = async (action) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.patch(`http://localhost:8000/communities/${id}/${action}`, { userId });
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(`❌ Error ${action}:`, err?.response?.data ?? err.message);
    }
  };

  // Create Post
  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post("http://localhost:8000/posts", {
        userId,
        content: newPost,
        communityId: id,
      });
      setNewPost("");
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("❌ Error creating post:", err?.response?.data ?? err.message);
    }
  };

  // Like (backend uses POST /posts/:id/like in your routes)
  const handleLike = async (postId) => {
    if (!userId) return alert("Please login first");
    try {
      await axios.post(`http://localhost:8000/posts/${postId}/like`, { userId });
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("❌ Error liking post:", err?.response?.data ?? err.message);
    }
  };

  // Comment
  const handleAddComment = async (postId) => {
    if (!(commentText[postId] || "").trim()) return;
    try {
      await axios.post(`http://localhost:8000/posts/${postId}/comment`, {
        userId,
        content: commentText[postId],
      });
      setCommentText((p) => ({ ...p, [postId]: "" }));
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error("❌ Error adding comment:", err?.response?.data ?? err.message);
    }
  };

  // Pin / Unpin (PATCH)
  const handlePin = async (postId, shouldPin) => {
    try {
      const action = shouldPin ? "pin" : "unpin";
      await axios.patch(`http://localhost:8000/communities/${id}/${action}`, { postId });
      await fetchCommunityAndPosts();
    } catch (err) {
      console.error(`❌ Error ${shouldPin ? "pinning" : "unpinning"}:`, err?.response?.data ?? err.message);
    }
  };

  if (loading || !community) {
    return <div className="p-6 text-gray-400">Loading community...</div>;
  }

  const joined = isMemberOf(community, userId);
  const admin = isAdminOf(community, userId);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{community.name}</h1>
          <p className="text-gray-400 mt-1">{community.description}</p>
          <p className="text-xs text-gray-500 mt-2">{community.members?.length ?? 0} members</p>
        </div>

        <div className="flex flex-col gap-2">
          {!joined ? (
            <button
              onClick={() => handleMembership("join")}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700"
            >
              <FaUserPlus /> Join
            </button>
          ) : (
            <button
              onClick={() => handleMembership("leave")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
            >
              <FaUserMinus /> Leave
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 flex-1 overflow-y-auto mb-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const liked = userLikedPost(post, userId);
            const likeCount = post.likeCount ?? (post.likes?.length || 0);
            const commentCount = post.commentCount ?? (post.comments?.length || 0);
            const pinned = post.isPinned === true;

            return (
              <motion.div
                key={post._id}
                className={`p-4 rounded-2xl shadow-md ${pinned ? "bg-yellow-900/10 border border-yellow-600" : "bg-[#334155]"}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* header */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={post.userId?.avatar || "/avatars/default.png"}
                    alt={post.userId?.fullname || userName}
                    className="w-10 h-10 rounded-full border-2 border-cyan-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.userId?.fullname || userName}</p>
                      {pinned && <span className="text-xs text-yellow-300">Pinned</span>}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* content */}
                <p className="mb-3">{post.content}</p>

                {/* actions */}
                <div className="flex gap-6 text-gray-300 items-center mb-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 ${liked ? "text-red-400" : "hover:text-red-400"}`}
                    aria-pressed={liked}
                    title={liked ? "Unlike" : "Like"}
                  >
                    <FaHeart />
                    <span>{likeCount}</span>
                  </button>

                  <button
                    onClick={() => setShowComments((s) => ({ ...s, [post._id]: !s[post._id] }))}
                    className="flex items-center gap-2 hover:text-blue-400"
                    title="Toggle comments"
                  >
                    <FaCommentAlt />
                    <span>{commentCount}</span>
                  </button>

                  {admin && (
                    <button
                      onClick={() => handlePin(post._id, !pinned)}
                      className="flex items-center gap-2 hover:text-yellow-300"
                    >
                      <FaThumbsUp />
                      <span>{pinned ? "Unpin" : "Pin"}</span>
                    </button>
                  )}
                </div>

                {/* comments */}
                {showComments[post._id] && (
                  <div className="bg-[#1e293b] p-3 rounded-lg space-y-3">
                    {Array.isArray(post.comments) && post.comments.length > 0 ? (
                      post.comments.map((c, idx) => (
                        <div key={idx} className="text-sm text-gray-300">
                          <span className="font-semibold text-cyan-400">
                            {c.userId?.fullname ?? "User"}:
                          </span>{" "}
                          {c.content}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No comments yet.</p>
                    )}

                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="flex-1 p-2 rounded-lg bg-gray-700 text-white text-sm focus:outline-none"
                        value={commentText[post._id] || ""}
                        onChange={(e) => setCommentText((p) => ({ ...p, [post._id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No posts yet.</p>
        )}
      </div>

      {/* New Post only for members */}
      {joined && (
        <motion.div
          className="bg-[#334155] p-4 rounded-2xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            className="w-full p-3 rounded-lg bg-[#1e293b] text-white focus:outline-none"
            rows={3}
            placeholder="Share an idea, ask a question..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button onClick={handleAddPost} className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700">
              Post
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
