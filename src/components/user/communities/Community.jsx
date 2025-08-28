import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import axios from "axios";

export const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const userId = localStorage.getItem("userId");
  const userName = "Muhammad"; // replace with real user profile later

  // ✅ Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/posts");
      setPosts(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Create a new post
  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post("http://localhost:8000/post", {
        userId,
        content: newPost,
      });
      setNewPost("");
      fetchPosts();
    } catch (err) {
      console.error("❌ Error creating post:", err);
    }
  };

  // ✅ Like/Unlike post
  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8000/post/${postId}/like`,
        { userId }
      );
      fetchPosts();
    } catch (err) {
      console.error("❌ Error liking post:", err);
    }
  };

  // ✅ Add comment
  const handleAddComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      await axios.post(
        `http://localhost:8000/posts/${postId}/comment`,
        {
          userId,
          content: commentText[postId],
        }
      );
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">🌐 Community</h1>

      {/* Posts Feed */}
      <div className="space-y-4 flex-1 overflow-y-auto mb-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post._id}
              className="bg-[#334155] p-4 rounded-2xl shadow-md"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* User + Time */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/avatars/default.png"
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-cyan-500"
                />
                <div>
                  <p className="font-semibold">{post.userId?.fullname || userName}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p className="mb-3">{post.content}</p>

              {/* Likes + Comments */}
              <div className="flex gap-6 text-gray-300 mb-3">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-2 hover:text-red-400"
                >
                  <FaHeart
                    className={`${
                      post.likes?.includes(userId)
                        ? "text-red-500"
                        : "text-gray-300"
                    }`}
                  />
                  {post.likes?.length || 0}
                </button>

                <button
                  onClick={() =>
                    setShowComments((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                  className="flex items-center gap-2 hover:text-blue-400"
                >
                  <FaCommentAlt /> {post.comments?.length || 0}
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="bg-[#1e293b] p-3 rounded-lg space-y-3">
                  {/* Existing Comments */}
                  {post.comments?.length > 0 ? (
                    post.comments.map((c, idx) => (
                      <div key={idx} className="text-sm text-gray-300">
                        <span className="font-semibold text-cyan-400">
                          {c.userId?.fullname || "User"}:
                        </span>{" "}
                        {c.content}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 p-2 rounded-lg bg-gray-700 text-white text-sm focus:outline-none"
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
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
          ))
        ) : (
          <p className="text-center text-gray-400">No posts yet. Be the first!</p>
        )}
      </div>

      {/* New Post Box (BOTTOM) */}
      <motion.div
        className="bg-[#334155] p-4 rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <textarea
          className="w-full p-3 rounded-lg bg-[#1e293b] text-white focus:outline-none"
          rows="3"
          placeholder="Share an idea, ask a question..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          onClick={handleAddPost}
          className="mt-3 px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700"
        >
          Post
        </button>
      </motion.div>
    </div>
  );
};
