import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, UserCircle } from "lucide-react";

const dummyUsers = [
  { id: 1, name: "Instructor John", avatar: "🧑‍🏫" },
  { id: 2, name: "Alice", avatar: "👩‍💻" },
  { id: 3, name: "Bob", avatar: "🧑‍🎓" },
];

const dummyMessages = {
  1: [
    { id: 1, text: "Hello! Need help with JavaScript.", sender: "me" },
    { id: 2, text: "Sure! Let’s discuss.", sender: "them" },
  ],
  2: [
    { id: 1, text: "Wanna study together?", sender: "them" },
    { id: 2, text: "Absolutely!", sender: "me" },
  ],
  3: [
    { id: 1, text: "I have a question on React.", sender: "them" },
    { id: 2, text: "Go ahead!", sender: "me" },
  ],
};
export const Messages = () => {
    const [selectedUserId, setSelectedUserId] = useState(1);
  const [message, setMessage] = useState("");

  const selectedMessages = dummyMessages[selectedUserId] || [];

  const handleSend = () => {
    if (message.trim() === "") return;
    dummyMessages[selectedUserId].push({ id: Date.now(), text: message, sender: "me" });
    setMessage("");
  };

  return (
     <motion.div
      className="flex h-[80vh] bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <motion.div
        className="w-1/3 bg-gray-800 p-4 border-r border-gray-700"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {dummyUsers.map((user) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            className={`cursor-pointer p-3 mb-2 rounded-lg ${
              selectedUserId === user.id ? "bg-violet-600" : "bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCircle className="w-6 h-6 text-white" />
              <span>{user.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col justify-between p-4 relative">
        {/* Header */}
        <div className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
          {dummyUsers.find((u) => u.id === selectedUserId)?.name}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-2 scroll-smooth">
          {selectedMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-2 px-4 rounded-xl max-w-[70%] ${
                msg.sender === "me"
                  ? "bg-violet-600 self-end text-right ml-auto"
                  : "bg-gray-700 self-start"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <motion.div
          className="flex mt-4 border-t border-gray-600 pt-2"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white p-2 rounded-l-md focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded-r-md flex items-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
