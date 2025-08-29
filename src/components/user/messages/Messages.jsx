import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, UserCircle, Trash2, SmilePlus, Reply } from "lucide-react";
import axios from "axios";

export const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId =
    localStorage.getItem("userId") || "68ac7e5deae1452d25995886"; // logged-in user

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch users (for sidebar)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users");
        setUsers(res.data.data); // ✅ fixed
        if (res.data.data.length > 0) setSelectedUserId(res.data.data[0]._id);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;
      try {
        const res = await axios.get(
          `http://localhost:8000/messages/${currentUserId}/${selectedUserId}`
        );
        setMessages(res.data.data); // ✅ fixed
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUserId]);

  // Send message
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post("http://localhost:8000/messages", {
        senderId: currentUserId,
        receiverId: selectedUserId,
        text: message,
      });
      setMessages([...messages, res.data.data]); // ✅ fixed
      setMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/messages/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("❌ Error deleting message:", err);
    }
  };

  // React to message
  const handleReact = async (id, emoji) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/messages/${id}/react`,
        { userId: currentUserId, emoji }
      );
      setMessages(messages.map((msg) => (msg._id === id ? res.data.data : msg))); // ✅ fixed
    } catch (err) {
      console.error("❌ Error reacting to message:", err);
    }
  };

  return (
    <motion.div
      className="flex h-screen bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {users.map((user) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={user._id}
            onClick={() => setSelectedUserId(user._id)}
            className={`cursor-pointer p-3 mb-2 rounded-lg ${
              selectedUserId === user._id ? "bg-violet-600" : "bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCircle className="w-6 h-6 text-white" />
              <span>{user.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col justify-between p-4 relative">
        {/* Header */}
        <div className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
          {users.find((u) => u._id === selectedUserId)?.name || "Select a chat"}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              className={`p-3 rounded-xl max-w-[70%] group relative ${
                msg.senderId === currentUserId
                  ? "bg-violet-600 self-end text-right ml-auto"
                  : "bg-gray-700 self-start"
              }`}
            >
              <p>{msg.text}</p>

              {/* Reactions */}
              {msg.reactions?.length > 0 && (
                <div className="flex gap-1 mt-1 text-lg">
                  {msg.reactions.map((r, i) => (
                    <span key={i}>{r.emoji}</span>
                  ))}
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute hidden group-hover:flex gap-2 -top-8 right-0 bg-gray-800 p-1 rounded-md shadow-lg">
                <button
                  onClick={() => handleReact(msg._id, "❤️")}
                  className="hover:text-red-400"
                >
                  <SmilePlus size={16} />
                </button>
                <button
                  onClick={() => console.log("Reply feature")}
                  className="hover:text-blue-400"
                >
                  <Reply size={16} />
                </button>
                {msg.senderId === currentUserId && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedUserId && (
          <div className="flex mt-4 border-t border-gray-600 pt-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white p-3 rounded-l-md focus:outline-none"
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
          </div>
        )}
      </div>
    </motion.div>
  );
};
