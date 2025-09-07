import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Search, UserPlus, X, Check, Menu } from "lucide-react";

export const Messages = () => {
  const currentUserId = localStorage.getItem("userId");

  // existing state (kept)
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [activeSidebarTab, setActiveSidebarTab] = useState("friends");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [replyTo, setReplyTo] = useState(null);
  const [editMsg, setEditMsg] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showReactions, setShowReactions] = useState(null); // messageId for reactions

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // new states for search/add friend
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingRequestIds, setAddingRequestIds] = useState(new Set());

  // --- Fetch Functions (unchanged endpoints used) ---
  const fetchFriends = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/${currentUserId}`);
      const list = res.data?.data ?? [];
      setFriends(list);
      if (!selectedUserId && list.length > 0) setSelectedUserId(list[0]._id);
    } catch {
      setFriends([]);
    }
  };

  const fetchIncoming = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/requests/${currentUserId}`);
      setIncoming(res.data?.data ?? []);
    } catch {
      setIncoming([]);
    }
  };

  const fetchOutgoing = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/requests/sent/${currentUserId}`);
      setOutgoing(res.data?.data ?? []);
    } catch {
      setOutgoing([]);
    }
  };

  const fetchMessages = async (friendId) => {
    if (!friendId) return setMessages([]);
    try {
      const res = await axios.get(`http://localhost:8000/messages/${currentUserId}/${friendId}`);
      // controller returns { success, messages } so try both shapes
      setMessages(res.data?.messages ?? res.data?.data ?? []);
    } catch {
      setMessages([]);
    }
  };

  // --- Utility sets ---
  const requestedSet = new Set((outgoing || []).map((r) => String(r.recipient?._id ?? r.recipient ?? "")));
  const friendIdsSet = new Set((friends || []).map((f) => String(f._id)));

  // --- Message Handlers ---
  const handleSend = async () => {
    if (!selectedUserId || !newMessage.trim()) return;

    // If editing an existing message
    if (editMsg) {
      try {
        const res = await axios.patch(`http://localhost:8000/message/${editMsg._id}`, {
          text: newMessage,
        });
        const updated = res.data?.message ?? res.data ?? null;
        if (updated) {
          setMessages((prev) => prev.map((m) => (String(m._id) === String(editMsg._id) ? updated : m)));
        }
      } catch (err) {
        console.error("edit error", err);
        alert("Failed to edit message");
      } finally {
        setEditMsg(null);
        setNewMessage("");
        setReplyTo(null);
        inputRef.current?.focus();
      }
      return;
    }

    // Optimistic send for new messages
    const tempId = `tmp-${Date.now()}`;
    const optimisticMsg = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: selectedUserId,
      text: newMessage,
      replyTo,
      createdAt: new Date().toISOString(),
      reactions: [],
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await axios.post("http://localhost:8000/message", {
        senderId: currentUserId,
        receiverId: selectedUserId,
        text: newMessage,
        replyTo: replyTo?._id ?? null,
      });
      const newMsg = res.data?.message ?? res.data?.message ?? res.data?.data ?? null;
      if (newMsg) {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? newMsg : m)));
      }
    } catch (err) {
      console.error("send error", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      alert("Message failed to send.");
    }

    setReplyTo(null);
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleReaction = async (msgId, emoji) => {
    try {
      const res = await axios.patch(`http://localhost:8000/message/${msgId}/reaction`, {
        userId: currentUserId,
        emoji,
      });
      const updated = res.data?.message ?? res.data?.data ?? res.data ?? null;
      if (updated) {
        setMessages((prev) => prev.map((m) => (String(m._id) === String(msgId) ? updated : m)));
      }
    } catch (err) {
      console.error("reaction error", err);
      alert("Failed to react");
    }
    setShowReactions(null);
  };

  // restore missing action handlers (reply/edit/delete/forward)
  const handleReply = (msg) => {
    setReplyTo(msg);
    // bring focus to input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleEdit = (msg) => {
    setEditMsg(msg);
    setNewMessage(msg.text || "");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://localhost:8000/message/${messageId}`);
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
    } catch (err) {
      console.error("delete error", err);
      alert("Failed to delete message");
    }
  };

  const handleForward = (msg) => {
    alert(`Forwarding is not implemented yet. (Would open friend picker for: "${msg.text?.slice(0, 60)}...")`);
  };

  // --- Friends / Requests Handlers ---
  const handleIncomingAction = async (requestId, action) => {
    try {
      // keeping your existing route shape
      await axios.patch(`http://localhost:8000/friends/request/${requestId}`, { status: action });
      await fetchIncoming();
      await fetchFriends();
      await fetchOutgoing();
    } catch (err) {
      console.error("handleIncomingAction error", err);
    }
  };

  const sendFriendRequest = async (recipientId) => {
    const id = String(recipientId);
    setAddingRequestIds((prev) => new Set(prev).add(id));
    try {
      await axios.post(`http://localhost:8000/friends/request`, {
        requesterId: currentUserId,
        recipientId: id,
      });
      // update outgoing list
      await fetchOutgoing();
    } catch (err) {
      console.error("send request error", err);
      alert("Failed to send friend request");
    } finally {
      setAddingRequestIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  // --- Search users (debounced) ---
  useEffect(() => {
    const t = setTimeout(() => {
      const q = (searchQuery || "").trim();
      if (!q || q.length < 2) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }
      (async () => {
        setSearchLoading(true);
        try {
          // backend user search endpoint — adjust if your route differs
          const res = await axios.get(`http://localhost:8000/users/search?q=${encodeURIComponent(q)}`);
          setSearchResults(res.data?.data ?? res.data ?? []);
        } catch (err) {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      })();
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // --- Effects ---
  useEffect(() => {
    fetchFriends();
    fetchIncoming();
    fetchOutgoing();
  }, []);

  useEffect(() => {
    fetchMessages(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // small helper for display name
  const nameOf = (u) => (u?.fullname || u?.name || u?.email || "Unknown");

  // emojis for picker
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar animated with framer-motion */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? "33.333%" : "0px", opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.24 }}
        style={{ overflow: "hidden" }}
        className="bg-gray-900 flex flex-col border-r border-gray-800"
      >
        {/* keep visual gap even when collapsed: content uses pointer events only when open */}
        <div style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}>
          <div className="flex border-b border-gray-800 items-center px-2">
            <button
              onClick={() => setActiveSidebarTab("friends")}
              className={`flex-1 p-3 text-center ${
                activeSidebarTab === "friends" ? "bg-violet-700" : "bg-gray-800"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveSidebarTab("requests")}
              className={`flex-1 p-3 text-center ${
                activeSidebarTab === "requests" ? "bg-violet-700" : "bg-gray-800"
              }`}
            >
              Requests
              {incoming.length > 0 && (
                <span className="ml-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">{incoming.length}</span>
              )}
            </button>
          </div>

          {/* small search / add-friend UI (visible in friends tab) */}
          {activeSidebarTab === "friends" && (
            <div className="p-3 border-b border-gray-800">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users to add (min 2 chars)"
                    className="w-full bg-gray-800 p-2 rounded-md outline-none pr-10"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Search size={16} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 bg-gray-800 rounded-md"
                >
                  <X size={16} />
                </button>
              </div>

              {/* showing search results */}
              {searchLoading ? (
                <div className="text-xs text-gray-400 mt-2">Searching...</div>
              ) : (
                searchResults.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map((u) => {
                      const id = String(u._id ?? u.id ?? "");
                      const alreadyFriend = friendIdsSet.has(id);
                      const alreadyRequested = requestedSet.has(id);
                      const adding = addingRequestIds.has(id);
                      const isSelf = String(id) === String(currentUserId);

                      return (
                        <div key={id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <img src={u.avatar || "/default-avatar.png"} className="w-8 h-8 rounded-full" alt={nameOf(u)} />
                            <div className="text-sm">{nameOf(u)}</div>
                          </div>
                          <div>
                            {isSelf ? (
                              <div className="text-xs text-gray-500">You</div>
                            ) : alreadyFriend ? (
                              <div className="text-xs text-green-400">Friend</div>
                            ) : alreadyRequested ? (
                              <div className="text-xs text-yellow-300">Requested</div>
                            ) : (
                              <button
                                disabled={adding}
                                onClick={() => sendFriendRequest(id)}
                                className="px-3 py-1 bg-violet-600 rounded-md text-sm"
                              >
                                {adding ? "Sending..." : "Add"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          )}

          {/* Friends list */}
          {activeSidebarTab === "friends" && (
            <div className="flex-1 overflow-y-auto p-3">
              {friends.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">No friends yet. Add some to start chatting.</div>
              ) : (
                friends.map((f) => (
                  <motion.div
                    key={f._id}
                    onClick={() => setSelectedUserId(f._id)}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer ${
                      String(selectedUserId) === String(f._id)
                        ? "bg-violet-700"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <img src={f.avatar || "/default-avatar.png"} alt={nameOf(f)} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium">{nameOf(f)}</div>
                      <div className="text-xs text-gray-400">Tap to chat</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Requests tab */}
          {activeSidebarTab === "requests" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <h3 className="font-semibold">Incoming</h3>
              {incoming.map((r) => (
                <div key={r._id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                  <span>{nameOf(r.requester)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleIncomingAction(r._id, "accepted")}
                      title="Accept"
                      className="p-1 rounded bg-green-600"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleIncomingAction(r._id, "rejected")}
                      title="Reject"
                      className="p-1 rounded bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <h3 className="font-semibold mt-4">Outgoing</h3>
              {outgoing.map((r) => (
                <div key={r._id} className="p-2 bg-gray-800 rounded-lg">
                  To: {nameOf(r.recipient)}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <button onClick={() => setSidebarOpen((s) => !s)}>
            <Menu />
          </button>
          <div className="flex-1 text-center">
            {selectedUserId ? (
              <span className="font-semibold">{`Chat with ${nameOf(friends.find((f) => String(f._id) === String(selectedUserId)))}`}</span>
            ) : (
              <span className="text-gray-400">Select a friend to start chatting</span>
            )}
          </div>
          <div style={{ width: 36 }} /> {/* spacer */}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg) => {
  const senderId =
    typeof msg.senderId === "string"
      ? msg.senderId
      : msg.senderId?._id ?? String(msg.senderId);

  const isMine = String(senderId) === String(currentUserId);

  // format time
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      key={msg._id}
      className={`relative group p-3 rounded-lg max-w-md ${
        isMine ? "bg-gray-800 ml-auto" : "bg-violet-600"
      }`}
    >
      {msg.replyTo && (
        <div className="text-xs text-gray-300 border-l-2 border-gray-400 pl-2 mb-1">
          Replying to: {msg.replyTo.text}
        </div>
      )}

      <div>{msg.text}</div>

      {/* Timestamp */}
      <div className="text-[10px] text-gray-400 mt-1 text-right">{time}</div>

      {/* Reactions */}
      {msg.reactions?.length > 0 && (
        <div className="flex gap-1 mt-1">
          {msg.reactions.map((r, i) => (
            <span key={i} className="text-sm">
              {r.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute -top-7 right-0 hidden group-hover:flex gap-2 text-xs bg-gray-900 px-2 py-1 rounded-lg shadow-lg">
        <button
          onClick={() => setShowReactions(showReactions === msg._id ? null : msg._id)}
          className="hover:scale-110 transition"
          title="React"
        >
          😀
        </button>
        <button
          onClick={() => handleReply(msg)}
          className="hover:scale-110 transition"
          title="Reply"
        >
          ↩️
        </button>

        {isMine && (
          <>
            <button onClick={() => handleEdit(msg)} className="hover:scale-110 transition" title="Edit">
              ✏️
            </button>
            <button onClick={() => handleDelete(msg._id)} className="hover:scale-110 transition" title="Delete">
              🗑️
            </button>
          </>
        )}

        <button onClick={() => handleForward(msg)} className="hover:scale-110 transition" title="Forward">
          📤
        </button>
      </div>

      {/* Reaction picker */}
      {showReactions === msg._id && (
        <div
          className="absolute bottom-full right-0 mb-1 flex gap-2 bg-gray-700 p-2 rounded-lg shadow-lg"
          onMouseEnter={() => setShowReactions(msg._id)}
          onMouseLeave={() => setShowReactions(null)}
        >
          {["👍", "❤️", "😂", "😮", "😢", "🔥"].map((e) => (
            <button key={e} onClick={() => handleReaction(msg._id, e)}>
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
})}


          <div ref={messagesEndRef} />
        </div>

        {/* Reply/Edit indicator (stylized) */}
        {(replyTo || editMsg) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 pb-2">
            <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                  {replyTo ? String((replyTo.text || "").slice(0, 1)).toUpperCase() : "E"}
                </div>
                <div className="text-sm">
                  {replyTo ? (
                    <div>
                      <div className="text-xs text-gray-300">Replying to</div>
                      <div className="truncate max-w-md">{replyTo.text}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-gray-300">Editing</div>
                      <div className="truncate max-w-md">{editMsg?.text}</div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setReplyTo(null);
                  setEditMsg(null);
                }}
                className="p-1"
                title="Cancel"
              >
                <X />
              </button>
            </div>
          </motion.div>
        )}

        {/* Input */}
        {selectedUserId ? (
          <div className="p-3 border-t border-gray-800 flex gap-2 items-end">
            <input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={editMsg ? "Edit message..." : "Type a message..."}
              className="flex-1 bg-gray-800 p-2 rounded-md outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        ) : (
          <div className="p-3 text-center text-gray-400">Select a friend to start chatting</div>
        )}
      </div>
    </div>
  );
};
