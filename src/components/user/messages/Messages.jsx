import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Smile, Trash2, Reply, X, Plus } from "lucide-react";

export const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [reactionTarget, setReactionTarget] = useState(null); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // new
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  // ---------- API ----------
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      const list = res.data?.data?.users ?? res.data?.users ?? [];
      const listWithoutMe = list.filter((u) => String(u._id) !== String(currentUserId));
      setUsers(listWithoutMe);
      if (!selectedUserId && listWithoutMe.length > 0) {
        setSelectedUserId(listWithoutMe[0]._id);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUserId || !currentUserId) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/messages/${currentUserId}/${selectedUserId}`
      );
      const msgs = res.data?.data?.messages ?? res.data?.messages ?? [];
      setMessages(msgs);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;
    try {
      const res = await axios.post("http://localhost:8000/message", {
        senderId: currentUserId,
        receiverId: selectedUserId,
        text,
        replyTo: replyTo?._id || null,
      });
      const newMessage = res.data?.data || null;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
        fetchMessages();
      }
      setMessage("");
      setReplyTo(null);
      setReactionTarget(null);
      setShowEmojiPicker(null);
      inputRef.current?.focus();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleReaction = async (msgId, emoji) => {
    try {
      // Optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msgId
            ? {
                ...m,
                reactions: [
                  ...(m.reactions || []),
                  { userId: { _id: currentUserId, fullname: "You" }, emoji },
                ],
              }
            : m
        )
      );

      const res = await axios.patch(`http://localhost:8000/message/${msgId}/reaction`, {
        userId: currentUserId,
        emoji,
      });

      const updatedMessage = res.data?.data;
      if (updatedMessage) {
        setMessages((prev) =>
          prev.map((m) => (m._id === msgId ? updatedMessage : m))
        );
      }
    } catch (err) {
      console.error("Error adding reaction:", err);
    }
  };

  const handleDelete = async (msgId) => {
    try {
      await axios.delete(`http://localhost:8000/messages/${msgId}`);
      fetchMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // ---------- Effects ----------
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
    inputRef.current?.focus();
  }, [selectedUserId]);

  useEffect(() => {
    if (!selectedUserId) return;
    const id = setInterval(fetchMessages, 4000);
    return () => clearInterval(id);
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------- Render ----------
  return (
    <motion.div
      className="flex h-screen bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <motion.div
        className="w-1/3 bg-gray-800 p-4 border-r border-gray-700 overflow-y-auto"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {users.length === 0 && <p className="text-gray-400">No users available</p>}

        {users.map((user) => (
          <motion.div
            key={user._id}
            onClick={() => setSelectedUserId(user._id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer p-3 mb-2 rounded-lg flex items-center gap-3 ${
              selectedUserId === user._id ? "bg-violet-600" : "bg-gray-700"
            }`}
          >
            <img
              src={
                user.avatar 
              }
              alt={user.fullname}
              className="w-8 h-8 rounded-full"
            />
            <span>{user.fullname || "Unnamed User"}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col justify-between p-4 relative">
        {/* Header */}
        <div className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
          {users.find((u) => u._id === selectedUserId)?.fullname || "Select a chat"}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-2 scroll-smooth">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</p>
          )}

          {messages.map((msg) => {
            const senderIdStr = String(msg?.senderId?._id || msg?.senderId || "");
            const isMe = senderIdStr === String(currentUserId);

            const groupedReactions =
              msg.reactions?.reduce((acc, r) => {
                if (!acc[r.emoji]) acc[r.emoji] = [];
                acc[r.emoji].push(r.userId?.fullname || "User");
                return acc;
              }, {}) || {};

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`group relative p-2 px-4 rounded-xl max-w-[70%] ${
                  isMe ? "bg-violet-600 self-end text-right ml-auto" : "bg-gray-700 self-start"
                }`}
              >
                {/* Hover menu */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur px-1 py-0.5 rounded-md">
                    <button
                      onClick={() => setReactionTarget(msg._id)}
                      className="p-1 hover:text-pink-300"
                      title="React"
                    >
                      <Smile size={16} />
                    </button>
                    <button
                      onClick={() => setReplyTo(msg)}
                      className="p-1 hover:text-blue-300"
                      title="Reply"
                    >
                      <Reply size={16} />
                    </button>
                    {isMe && (
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-1 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Reply bubble */}
                {msg.replyTo && (
                  <div className="text-xs text-gray-300 italic mb-1 border-l-2 border-gray-500 pl-2">
                    Replying to: {msg.replyTo.text}
                  </div>
                )}

                {/* Text */}
                <div>{msg.text}</div>

                {/* Reactions summary */}
                {Object.keys(groupedReactions).length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Object.entries(groupedReactions).map(([emoji, users]) => (
                      <div
                        key={emoji}
                        className="bg-black/30 px-2 py-0.5 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-black/50"
                        title={users.join(", ")}
                      >
                        <span>{emoji}</span>
                        <span className="text-xs">{users.length}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reaction picker */}
                {reactionTarget === msg._id && (
                  <div
                    className={`absolute -top-12 ${isMe ? "right-0" : "left-0"} 
                      bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 flex gap-2 z-10`}
                  >
                    {["❤️", "😂", "👍", "👏", "😮"].map((emo) => (
                      <button
                        key={emo}
                        className="text-xl hover:scale-110 transition"
                        onClick={() => handleReaction(msg._id, emo)}
                      >
                        {emo}
                      </button>
                    ))}
                    <button
                      className="text-sm text-gray-300 hover:text-white"
                      onClick={() =>
                        setShowEmojiPicker((prev) => (prev === msg._id ? null : msg._id))
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}

                {/* Custom Emoji Grid */}
                {showEmojiPicker === msg._id && (
                  <div
                    className={`absolute -top-40 ${isMe ? "right-0" : "left-0"} 
                      bg-gray-900 border border-gray-700 rounded-xl p-3 grid grid-cols-6 gap-2 z-20`}
                  >
                    {[
                      "🔥","😎","🥳","😢","🤔","🙌",
                      "🤯","✨","💯","🤩","😡","🥶",
                      "👀","🙏","😴","🎉","🤝","🫶"
                    ].map((emo) => (
                      <button
                        key={emo}
                        className="text-xl hover:scale-125 transition"
                        onClick={() => {
                          handleReaction(msg._id, emo);
                          setShowEmojiPicker(null);
                          setReactionTarget(null);
                        }}
                      >
                        {emo}
                      </button>
                    ))}
                    <button
                      className="absolute top-1 right-1 text-gray-400 hover:text-white"
                      onClick={() => setShowEmojiPicker(null)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Reply preview */}
        {replyTo && (
          <div className="bg-gray-800 p-2 mb-2 rounded-md flex justify-between items-center">
            <span className="text-sm text-gray-300 truncate">
              Replying to: {replyTo.text}
            </span>
            <button onClick={() => setReplyTo(null)} className="text-gray-400">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input */}
        {selectedUserId && (
          <motion.div
            className="flex mt-2 border-t border-gray-600 pt-2"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white p-2 rounded-l-md focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded-r-md flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
