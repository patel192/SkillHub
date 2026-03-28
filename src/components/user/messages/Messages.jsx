import React, { useEffect, useState, useRef, useCallback } from "react";
import apiClient from "../../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import {
  Send,
  Search,
  UserPlus,
  X,
  Check,
  Menu,
  Smile,
  Reply,
  Edit,
  Trash2,
  MoreVertical,
  ArrowLeft,
  Wifi,
  WifiOff,
  CheckCheck,
} from "lucide-react";
import toast from "react-hot-toast";

// ==========================================
// DESIGN TOKENS (Matching MyCourses Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  bg: "#0A0F0D",
  surface: "#111814",
  surface2: "#182219",
  surface3: "#1E2B22",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
  error: "#F87171",
  success: "#22C55E",
};

// WebSocket singleton
let socket = null;

export const Messages = () => {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  // UI State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  // Data State
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const [activeSidebarTab, setActiveSidebarTab] = useState("friends");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [replyTo, setReplyTo] = useState(null);
  const [editMsg, setEditMsg] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showReactions, setShowReactions] = useState(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingRequestIds, setAddingRequestIds] = useState(new Set());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ===============================
  // WebSocket Connection Setup
  // ===============================
  useEffect(() => {
    const initSocket = () => {
      setIsConnecting(true);

      socket = io("https://skillhub-backend-gs3t.onrender.com", {
        auth: { token },
        query: { userId: currentUserId },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socket.on("connect", () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
        toast.success("Connected to chat server");
        socket.emit("join", currentUserId);
      });

      socket.on("disconnect", (reason) => {
        console.log("WebSocket disconnected:", reason);
        setIsConnected(false);
        if (reason === "io server disconnect") {
          socket.connect();
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        toast.error("Failed to connect to chat server");
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log("Reconnected after", attemptNumber, "attempts");
        setIsConnected(true);
        toast.success("Reconnected to chat server");
        socket.emit("join", currentUserId);
        if (selectedUserId) fetchMessages(selectedUserId);
      });

      // Real-time events
      socket.on("new_message", (data) => {
        const { message, tempId } = data;
        const msgSenderId =
          message.senderId?._id?.toString() ||
          message.senderId?.toString() ||
          message.senderId;
        const msgReceiverId =
          message.receiverId?._id?.toString() ||
          message.receiverId?.toString() ||
          message.receiverId;

        // Check if this message belongs to current conversation
        const isCurrentConversation =
          (msgSenderId === selectedUserId && msgReceiverId === currentUserId) ||
          (msgSenderId === currentUserId && msgReceiverId === selectedUserId);

        // Check if message already exists (prevent duplicates)
        setMessages((prev) => {
          // Check by _id or tempId
          const existsById = prev.find((m) => m._id === message._id);
          const existsByTemp = tempId && prev.find((m) => m.tempId === tempId);
          const existsByContent = prev.find(
            (m) =>
              m.text === message.text &&
              m.senderId?.toString() === msgSenderId &&
              Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) <
                5000,
          );

          if (existsById || existsByTemp || existsByContent) {
            // Update existing message (replace temp with real)
            return prev.map((m) => {
              if (m._id === message._id) return message;
              if (tempId && m.tempId === tempId)
                return { ...message, tempId: null };
              if (
                m.text === message.text &&
                m.senderId?.toString() === msgSenderId &&
                Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) <
                  5000
              ) {
                return { ...message, tempId: m.tempId };
              }
              return m;
            });
          }

          // Only add if it's for current conversation
          if (isCurrentConversation) {
            return [...prev, message];
          }

          return prev;
        });

        // Show notification for messages from other users in different conversations
        if (
          msgReceiverId === currentUserId &&
          msgSenderId !== selectedUserId &&
          msgSenderId !== currentUserId
        ) {
          toast.success(
            <div
              className="cursor-pointer"
              onClick={() => {
                setSelectedUserId(msgSenderId);
              }}
            >
              <strong>
                New message from {message.senderId?.fullname || "Someone"}
              </strong>
              <br />
              <span className="text-sm">{message.text?.slice(0, 50)}...</span>
            </div>,
            { duration: 3000, id: `msg-${message._id}` },
          );
        }

        // Mark as read if viewing
        if (msgReceiverId === currentUserId && isCurrentConversation) {
          socket.emit("mark_read", { messageId: message._id });
        }
      });

      socket.on("message_edited", (data) => {
        const { message } = data;
        setMessages((prev) =>
          prev.map((m) => (m._id === message._id ? { ...m, ...message } : m)),
        );
      });

      socket.on("message_deleted", (data) => {
        const { messageId } = data;
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      });

      socket.on("reaction_updated", (data) => {
        const { message } = data;
        setMessages((prev) =>
          prev.map((m) =>
            m._id === message._id ? { ...m, reactions: message.reactions } : m,
          ),
        );
      });

      socket.on("user_typing", (data) => {
        const { userId } = data;
        if (userId !== currentUserId) {
          setTypingUsers((prev) => new Set(prev).add(userId));
        }
      });

      socket.on("user_stop_typing", (data) => {
        const { userId } = data;
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      socket.on("friend_request_received", () => {
        fetchIncoming();
        toast.success("New friend request received");
      });

      socket.on("friend_request_accepted", () => {
        fetchFriends();
        fetchOutgoing();
        toast.success("Friend request accepted");
      });
    };

    initSocket();

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("reconnect");
        socket.off("new_message");
        socket.off("message_edited");
        socket.off("message_deleted");
        socket.off("reaction_updated");
        socket.off("user_typing");
        socket.off("user_stop_typing");
        socket.off("friend_request_received");
        socket.off("friend_request_accepted");
        socket.off("message_sent");
        socket.off("error");
        socket.disconnect();
        socket = null;
      }
    };
  }, [currentUserId, token, selectedUserId]);

  // ===============================
  // Data Fetching
  // ===============================
  const fetchFriends = async () => {
    try {
      const res = await apiClient.get(`/friends/${currentUserId}`);
      const list = res.data?.data ?? [];
      setFriends(list);
      if (!selectedUserId && list.length > 0) setSelectedUserId(list[0]._id);
    } catch {
      setFriends([]);
    }
  };

  const fetchIncoming = async () => {
    try {
      const res = await apiClient.get(`/friends/requests/${currentUserId}`);
      setIncoming(res.data?.data ?? []);
    } catch {
      setIncoming([]);
    }
  };

  const fetchOutgoing = async () => {
    try {
      const res = await apiClient.get(`/friends/requests/sent/${currentUserId}`);
      setOutgoing(res.data?.data ?? []);
    } catch {
      setOutgoing([]);
    }
  };

  const fetchMessages = async (friendId) => {
    if (!friendId) return setMessages([]);
    try {
      const res = await apiClient.get(`/messages/${currentUserId}/${friendId}`);
      setMessages(res.data?.messages ?? res.data?.data ?? []);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchIncoming();
    fetchOutgoing();
  }, []);

  useEffect(() => {
    fetchMessages(selectedUserId);
    if (socket && selectedUserId) {
      socket.emit("join_conversation", {
        userId: currentUserId,
        friendId: selectedUserId,
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // ===============================
  // Typing Indicator
  // ===============================
  const handleTyping = useCallback(() => {
    if (!socket || !selectedUserId) return;

    socket.emit("typing", {
      senderId: currentUserId,
      receiverId: selectedUserId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        senderId: currentUserId,
        receiverId: selectedUserId,
      });
    }, 2000);
  }, [currentUserId, selectedUserId]);

  // ===============================
  // Message Handlers with Optimistic Updates
  // ===============================
  const handleSend = async () => {
    if (!selectedUserId || !newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const messageText = newMessage.trim();

    if (editMsg) {
      try {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === editMsg._id
              ? { ...m, text: messageText, isEditing: true }
              : m,
          ),
        );

        socket.emit("edit_message", {
          messageId: editMsg._id,
          text: messageText,
          senderId: currentUserId,
          receiverId: selectedUserId,
        });

        const res = await apiClient.patch(
          `/message/${editMsg._id}`,
          { text: messageText }
        );

        const updated = res.data?.message ?? res.data ?? null;
        if (updated) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === editMsg._id ? { ...updated, isEditing: false } : m,
            ),
          );
        }
      } catch (err) {
        console.error("edit error", err);
        toast.error("Failed to edit message");
        fetchMessages(selectedUserId);
      } finally {
        setEditMsg(null);
        setNewMessage("");
        setReplyTo(null);
        inputRef.current?.focus();
      }
      return;
    }

    // New message with optimistic update
    const optimisticMsg = {
      _id: tempId,
      tempId,
      senderId: currentUserId,
      receiverId: selectedUserId,
      text: messageText,
      replyTo,
      createdAt: new Date().toISOString(),
      reactions: [],
      isPending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setReplyTo(null);

    try {
      socket.emit("send_message", {
        tempId,
        senderId: currentUserId,
        receiverId: selectedUserId,
        text: messageText,
        replyTo: replyTo?._id ?? null,
      });

      const res = await apiClient.post(
        "/message",
        {
          senderId: currentUserId,
          receiverId: selectedUserId,
          text: messageText,
          replyTo: replyTo?._id ?? null,
        }
      );

      const newMsg = res.data?.message ?? res.data?.data ?? null;
      if (newMsg) {
        setMessages((prev) =>
          prev.map((m) =>
            m.tempId === tempId ? { ...newMsg, isPending: false } : m,
          ),
        );
      }
    } catch (err) {
      console.error("send error", err);
      toast.error("Message failed to send");
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, isFailed: true, isPending: false } : m,
        ),
      );
    }

    inputRef.current?.focus();
  };

  const handleReaction = async (msgId, emoji) => {
    try {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id !== msgId) return m;
          const existingReaction = m.reactions?.find(
            (r) => r.userId === currentUserId,
          );
          let newReactions;

          if (existingReaction) {
            if (existingReaction.emoji === emoji) {
              newReactions = m.reactions.filter(
                (r) => r.userId !== currentUserId,
              );
            } else {
              newReactions = m.reactions.map((r) =>
                r.userId === currentUserId ? { ...r, emoji } : r,
              );
            }
          } else {
            newReactions = [
              ...(m.reactions || []),
              { userId: currentUserId, emoji },
            ];
          }

          return { ...m, reactions: newReactions };
        }),
      );

      socket.emit("add_reaction", {
        messageId: msgId,
        userId: currentUserId,
        emoji,
      });

      await apiClient.patch(
        `/message/${msgId}/reaction`,
        { userId: currentUserId, emoji },
      );
    } catch (err) {
      console.error("reaction error", err);
      toast.error("Failed to react");
      fetchMessages(selectedUserId);
    }
    setShowReactions(null);
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleEdit = (msg) => {
    setEditMsg(msg);
    setNewMessage(msg.text || "");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDelete = async (messageId) => {
    try {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      socket.emit("delete_message", { messageId, senderId: currentUserId });
      await apiClient.delete(`/message/${messageId}`);
    } catch (err) {
      console.error("delete error", err);
      toast.error("Failed to delete message");
      fetchMessages(selectedUserId);
    }
  };

  const handleForward = (msg) => {
    toast.success("Forward feature coming soon!");
  };

  // ===============================
  // Friend Handlers
  // ===============================
  const handleIncomingAction = async (requestId, action) => {
    try {
      await apiClient.patch(
        `/friends/request/${requestId}`,
        { status: action }
      );

      if (socket) {
        socket.emit("friend_request_response", { requestId, status: action });
      }

      await fetchIncoming();
      await fetchFriends();
      await fetchOutgoing();
    } catch (err) {
      console.error("handleIncomingAction error", err);
      toast.error("Failed to process request");
    }
  };

  const sendFriendRequest = async (recipientId) => {
    const id = String(recipientId);
    setAddingRequestIds((prev) => new Set(prev).add(id));
    try {
      await apiClient.post(
        `/friends/request`,
        { requesterId: currentUserId, recipientId: id },
      );

      if (socket) {
        socket.emit("send_friend_request", { recipientId: id });
      }

      await fetchOutgoing();
      toast.success("Friend request sent");
    } catch (err) {
      console.error("send request error", err);
      toast.error("Failed to send friend request");
    } finally {
      setAddingRequestIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  // ===============================
  // Search
  // ===============================
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
          const res = await apiClient.get(
            `/users/search?q=${encodeURIComponent(q)}`,
          );
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

  // ===============================
  // Report Handler
  // ===============================
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    try {
      await apiClient.post(
        "/report",
        {
          reporter: currentUserId,
          type: reportType,
          description: reportMessage,
          targetType: reportTarget.type,
          targetId: reportTarget.id,
        }
      );

      toast.success(`${reportTarget.type} reported successfully`);
      setReportType("");
      setReportMessage("");
      setReportTarget(null);
      setIsReportOpen(false);
    } catch (err) {
      console.error("report error", err);
      toast.error("Failed to report");
    }
  };

  // ===============================
  // Helpers
  // ===============================
  const nameOf = (u) => u?.fullname || u?.name || u?.email || "Unknown";
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  const requestedSet = new Set(
    (outgoing || []).map((r) => String(r.recipient?._id ?? r.recipient ?? "")),
  );
  const friendIdsSet = new Set((friends || []).map((f) => String(f._id)));

  const selectedUser = friends.find(
    (f) => String(f._id) === String(selectedUserId),
  );
  const isTyping = selectedUserId && typingUsers.has(selectedUserId);

  // ===============================
  // Render
  // ===============================
  return (
    <div className="flex h-screen" style={{ background: C.bg, color: C.text }}>
      {/* Connection Status Bar */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-center gap-2"
            style={{ background: isConnecting ? C.accent : C.error }}
          >
            {isConnecting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="text-sm font-medium" style={{ color: C.bg }}>
                  Connecting to chat server...
                </span>
              </>
            ) : (
              <>
                <WifiOff size={16} style={{ color: C.bg }} />
                <span className="text-sm font-medium" style={{ color: C.bg }}>
                  Disconnected. Trying to reconnect...
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? "320px" : "0px",
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col overflow-hidden"
        style={{
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: C.border }}>
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: C.text, fontFamily: "Fraunces, serif" }}
            >
              Messages
            </h2>

            {/* Tabs */}
            <div
              className="flex rounded-xl p-1"
              style={{
                background: C.surface2,
                border: `1px solid ${C.border}`,
              }}
            >
              <button
                onClick={() => setActiveSidebarTab("friends")}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  background:
                    activeSidebarTab === "friends" ? C.brand : "transparent",
                  color: activeSidebarTab === "friends" ? C.bg : C.textMuted,
                }}
              >
                Friends
              </button>
              <button
                onClick={() => setActiveSidebarTab("requests")}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background:
                    activeSidebarTab === "requests" ? C.brand : "transparent",
                  color: activeSidebarTab === "requests" ? C.bg : C.textMuted,
                }}
              >
                Requests
                {incoming.length > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-xs"
                    style={{ background: C.error, color: "white" }}
                  >
                    {incoming.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          {activeSidebarTab === "friends" && (
            <div className="p-4 border-b" style={{ borderColor: C.border }}>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: C.textDim }}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: C.textDim }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {searchLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm"
                    style={{ color: C.textMuted }}
                  >
                    Searching...
                  </motion.div>
                ) : searchResults.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2 max-h-48 overflow-y-auto"
                  >
                    {searchResults.map((u) => {
                      const id = String(u._id ?? u.id ?? "");
                      const alreadyFriend = friendIdsSet.has(id);
                      const alreadyRequested = requestedSet.has(id);
                      const adding = addingRequestIds.has(id);
                      const isSelf = String(id) === String(currentUserId);

                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between p-3 rounded-xl"
                          style={{
                            background: C.surface2,
                            border: `1px solid ${C.border}`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                u.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(u))}&background=16A880&color=fff`
                              }
                              className="w-10 h-10 rounded-full"
                              alt={nameOf(u)}
                            />
                            <div>
                              <div
                                className="text-sm font-medium"
                                style={{ color: C.text }}
                              >
                                {nameOf(u)}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: C.textDim }}
                              >
                                {u.email}
                              </div>
                            </div>
                          </div>
                          <div>
                            {isSelf ? (
                              <span
                                className="text-xs"
                                style={{ color: C.textDim }}
                              >
                                You
                              </span>
                            ) : alreadyFriend ? (
                              <span
                                className="text-xs"
                                style={{ color: C.brand }}
                              >
                                Friend
                              </span>
                            ) : alreadyRequested ? (
                              <span
                                className="text-xs"
                                style={{ color: C.accent }}
                              >
                                Pending
                              </span>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={adding}
                                onClick={() => sendFriendRequest(id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{ background: C.brand, color: C.bg }}
                              >
                                {adding ? "..." : "Add"}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeSidebarTab === "friends" ? (
              friends.length === 0 ? (
                <div
                  className="text-center mt-10"
                  style={{ color: C.textMuted }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ background: C.surface2 }}
                  >
                    <UserPlus size={24} style={{ color: C.textDim }} />
                  </div>
                  <p className="text-sm">No friends yet</p>
                  <p className="text-xs mt-1" style={{ color: C.textDim }}>
                    Search users to add friends
                  </p>
                </div>
              ) : (
                friends.map((f, idx) => (
                  <motion.div
                    key={f._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedUserId(f._id)}
                    className="relative flex items-center p-3 mb-2 rounded-xl cursor-pointer transition-all group"
                    style={{
                      background:
                        String(selectedUserId) === String(f._id)
                          ? C.surface2
                          : "transparent",
                      border: `1px solid ${String(selectedUserId) === String(f._id) ? C.borderHov : "transparent"}`,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={
                          f.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(f))}&background=16A880&color=fff`
                        }
                        alt={nameOf(f)}
                        className="w-12 h-12 rounded-full"
                        style={{
                          border: `2px solid ${String(selectedUserId) === String(f._id) ? C.brand : "transparent"}`,
                        }}
                      />
                      {typingUsers.has(f._id) && (
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            background: C.brand,
                            borderColor: C.surface,
                          }}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div
                        className="font-medium truncate"
                        style={{ color: C.text }}
                      >
                        {nameOf(f)}
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{
                          color: typingUsers.has(f._id) ? C.brand : C.textDim,
                        }}
                      >
                        {typingUsers.has(f._id) ? "typing..." : "Tap to chat"}
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === f._id ? null : f._id);
                        }}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: C.textDim }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      <AnimatePresence>
                        {menuOpen === f._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-40 rounded-xl shadow-xl z-20 overflow-hidden"
                            style={{
                              background: C.surface2,
                              border: `1px solid ${C.border}`,
                            }}
                          >
                            <button
                              onClick={() => {
                                setReportTarget({ type: "User", id: f._id });
                                setIsReportOpen(true);
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2"
                              style={{ color: C.error }}
                            >
                              <span>Report User</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              <div className="space-y-6">
                {/* Incoming */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-3 px-1"
                    style={{ color: C.textMuted }}
                  >
                    Incoming Requests
                  </h3>
                  {incoming.length === 0 ? (
                    <p className="text-sm px-1" style={{ color: C.textDim }}>
                      No pending requests
                    </p>
                  ) : (
                    incoming.map((r) => (
                      <motion.div
                        key={r._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 rounded-xl mb-2"
                        style={{
                          background: C.surface2,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              r.requester?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(r.requester))}&background=16A880&color=fff`
                            }
                            className="w-10 h-10 rounded-full"
                            alt={nameOf(r.requester)}
                          />
                          <span className="text-sm" style={{ color: C.text }}>
                            {nameOf(r.requester)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleIncomingAction(r._id, "accepted")
                            }
                            className="p-2 rounded-lg"
                            style={{
                              background: `${C.success}20`,
                              color: C.success,
                            }}
                          >
                            <Check size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleIncomingAction(r._id, "rejected")
                            }
                            className="p-2 rounded-lg"
                            style={{
                              background: `${C.error}20`,
                              color: C.error,
                            }}
                          >
                            <X size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Outgoing */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-3 px-1"
                    style={{ color: C.textMuted }}
                  >
                    Sent Requests
                  </h3>
                  {outgoing.length === 0 ? (
                    <p className="text-sm px-1" style={{ color: C.textDim }}>
                      No sent requests
                    </p>
                  ) : (
                    outgoing.map((r) => (
                      <div
                        key={r._id}
                        className="flex items-center gap-3 p-3 rounded-xl mb-2"
                        style={{
                          background: C.surface2,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <img
                          src={
                            r.recipient?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(r.recipient))}&background=16A880&color=fff`
                          }
                          className="w-10 h-10 rounded-full"
                          alt={nameOf(r.recipient)}
                        />
                        <div>
                          <div className="text-sm" style={{ color: C.text }}>
                            {nameOf(r.recipient)}
                          </div>
                          <div className="text-xs" style={{ color: C.accent }}>
                            Pending...
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col" style={{ background: C.bg }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: C.textMuted }}
            >
              <Menu size={20} />
            </motion.button>

            {selectedUser ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      selectedUser.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(selectedUser))}&background=16A880&color=fff`
                    }
                    alt={nameOf(selectedUser)}
                    className="w-10 h-10 rounded-full"
                    style={{
                      border: `2px solid ${isTyping ? C.brand : "transparent"}`,
                    }}
                  />
                  {isTyping && (
                    <span
                      className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                      style={{ background: C.brand, borderColor: C.bg }}
                    />
                  )}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: C.text }}>
                    {nameOf(selectedUser)}
                  </div>
                  <div
                    className="text-xs flex items-center gap-1"
                    style={{ color: isTyping ? C.brand : C.textDim }}
                  >
                    {isTyping ? (
                      <>
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: C.brand }}
                        />
                        typing...
                      </>
                    ) : isConnected ? (
                      <>
                        <Wifi size={12} />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff size={12} />
                        Offline
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span style={{ color: C.textMuted }}>
                Select a friend to start chatting
              </span>
            )}
          </div>

          {selectedUser && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: isConnected ? C.success : C.error }}
              />
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {selectedUserId ? (
            messages.length === 0 ? (
              <div
                className="h-full flex flex-col items-center justify-center"
                style={{ color: C.textDim }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ background: C.surface }}
                >
                  <Send size={32} style={{ color: C.textDim }} />
                </div>
                <p>No messages yet</p>
                <p className="text-sm mt-1">Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => {
                  const senderId =
                    typeof msg.senderId === "string"
                      ? msg.senderId
                      : (msg.senderId?._id ?? String(msg.senderId));
                  const isMine = String(senderId) === String(currentUserId);
                  const time = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";
                  const showAvatar =
                    idx === 0 || messages[idx - 1]?.senderId !== senderId;

                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[70%] ${isMine ? "flex-row-reverse" : ""}`}
                      >
                        {!isMine && showAvatar && (
                          <img
                            src={
                              selectedUser?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(selectedUser))}&background=16A880&color=fff`
                            }
                            className="w-8 h-8 rounded-full mb-1"
                            alt=""
                          />
                        )}

                        <div className="relative group">
                          {/* Reply preview */}
                          {msg.replyTo && (
                            <div
                              className="text-xs px-3 py-1.5 rounded-t-lg border-l-2"
                              style={{
                                background: C.surface2,
                                borderColor: C.brand,
                                color: C.textMuted,
                              }}
                            >
                              <span
                                className="font-medium"
                                style={{ color: C.brand }}
                              >
                                Replying to:
                              </span>{" "}
                              {msg.replyTo.text?.slice(0, 50)}
                              {msg.replyTo.text?.length > 50 && "..."}
                            </div>
                          )}

                          {/* Message bubble */}
                          <div
                            onClick={() =>
                              setActiveMessage(
                                activeMessage === msg._id ? null : msg._id,
                              )
                            }
                            className={`px-4 py-2.5 rounded-2xl cursor-pointer transition-all ${
                              msg.replyTo ? "rounded-tl-none" : ""
                            }`}
                            style={{
                              background: isMine
                                ? `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`
                                : C.surface2,
                              color: isMine ? C.bg : C.text,
                              border: isMine ? "none" : `1px solid ${C.border}`,
                              opacity: msg.isPending ? 0.7 : 1,
                            }}
                          >
                            <div className="text-sm">{msg.text}</div>

                            {/* Status indicators */}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-[10px] opacity-70">
                                {time}
                              </span>
                              {isMine && (
                                <>
                                  {msg.isPending ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                      }}
                                      className="w-3 h-3 border border-current border-t-transparent rounded-full"
                                    />
                                  ) : msg.isFailed ? (
                                    <span style={{ color: C.error }}>!</span>
                                  ) : (
                                    <CheckCheck size={12} />
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Reactions */}
                          {msg.reactions?.length > 0 && (
                            <div
                              className="absolute -bottom-3 left-2 flex gap-1 px-2 py-0.5 rounded-full shadow-lg"
                              style={{
                                background: C.surface,
                                border: `1px solid ${C.border}`,
                              }}
                            >
                              {msg.reactions.map((r, i) => (
                                <span key={i} className="text-sm">
                                  {r.emoji}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <AnimatePresence>
                            {activeMessage === msg._id && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`absolute ${isMine ? "right-0" : "left-0"} bottom-full mb-2 flex gap-1 p-1 rounded-xl shadow-xl`}
                                style={{
                                  background: C.surface2,
                                  border: `1px solid ${C.border}`,
                                }}
                              >
                                <button
                                  onClick={() =>
                                    setShowReactions(
                                      showReactions === msg._id
                                        ? null
                                        : msg._id,
                                    )
                                  }
                                  className="p-2 rounded-lg transition-colors hover:bg-white/10"
                                  style={{ color: C.textMuted }}
                                  title="React"
                                >
                                  <Smile size={16} />
                                </button>
                                <button
                                  onClick={() => handleReply(msg)}
                                  className="p-2 rounded-lg transition-colors hover:bg-white/10"
                                  style={{ color: C.textMuted }}
                                  title="Reply"
                                >
                                  <Reply size={16} />
                                </button>
                                {isMine && (
                                  <>
                                    <button
                                      onClick={() => handleEdit(msg)}
                                      className="p-2 rounded-lg transition-colors hover:bg-white/10"
                                      style={{ color: C.textMuted }}
                                      title="Edit"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(msg._id)}
                                      className="p-2 rounded-lg transition-colors hover:bg-white/10"
                                      style={{ color: C.error }}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Reaction picker */}
                          <AnimatePresence>
                            {showReactions === msg._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex gap-1 p-2 rounded-xl shadow-xl"
                                style={{
                                  background: C.surface2,
                                  border: `1px solid ${C.border}`,
                                }}
                              >
                                {emojis.map((e) => (
                                  <button
                                    key={e}
                                    onClick={() => handleReaction(msg._id, e)}
                                    className="text-xl hover:scale-125 transition-transform"
                                  >
                                    {e}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={
                          selectedUser?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOf(selectedUser))}&background=16A880&color=fff`
                        }
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      <div
                        className="px-4 py-2 rounded-2xl flex items-center gap-1"
                        style={{
                          background: C.surface2,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 rounded-full"
                          style={{ background: C.brand }}
                        />
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-2 h-2 rounded-full"
                          style={{ background: C.brand }}
                        />
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="w-2 h-2 rounded-full"
                          style={{ background: C.brand }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </>
            )
          ) : (
            <div
              className="h-full flex flex-col items-center justify-center"
              style={{ color: C.textDim }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: C.surface,
                  border: `2px dashed ${C.border}`,
                }}
              >
                <ArrowLeft size={32} style={{ color: C.textDim }} />
              </div>
              <p className="text-lg font-medium" style={{ color: C.textMuted }}>
                Select a conversation
              </p>
              <p className="text-sm mt-2">
                Choose a friend from the sidebar to start messaging
              </p>
            </div>
          )}
        </div>

        {/* Reply/Edit indicator */}
        <AnimatePresence>
          {(replyTo || editMsg) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 py-3 border-t"
              style={{ borderColor: C.border, background: C.surface }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: replyTo ? `${C.brand}20` : `${C.accent}20`,
                    }}
                  >
                    {replyTo ? (
                      <Reply size={18} style={{ color: C.brand }} />
                    ) : (
                      <Edit size={18} style={{ color: C.accent }} />
                    )}
                  </div>
                  <div className="text-sm">
                    <div
                      style={{ color: C.textMuted }}
                      className="text-xs mb-0.5"
                    >
                      {replyTo ? "Replying to" : "Editing message"}
                    </div>
                    <div
                      style={{ color: C.text }}
                      className="truncate max-w-md"
                    >
                      {(replyTo || editMsg)?.text}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setEditMsg(null);
                  }}
                  className="p-2 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: C.textDim }}
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        {selectedUserId && (
          <div className="px-6 py-4 border-t" style={{ borderColor: C.border }}>
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl outline-none transition-all"
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                  }}
                />
                <button
                  onClick={() => setShowReactions("input")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
                  style={{ color: C.textDim }}
                >
                  <Smile size={18} />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!newMessage.trim() || !isConnected}
                className="p-3 rounded-2xl transition-all disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  color: C.bg,
                }}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-bold"
                  style={{ color: C.text, fontFamily: "Fraunces, serif" }}
                >
                  Report {reportTarget?.type}
                </h2>
                <button
                  onClick={() => setIsReportOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: C.textDim }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: C.textMuted }}
                  >
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: C.surface2,
                      border: `1px solid ${C.border}`,
                      color: C.text,
                    }}
                  >
                    <option value="">Select an issue</option>
                    <option value="abuse">Abuse</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="spam">Spam</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: C.textMuted }}
                  >
                    Details
                  </label>
                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                    style={{
                      background: C.surface2,
                      border: `1px solid ${C.border}`,
                      color: C.text,
                    }}
                    placeholder="Describe the issue..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="flex-1 py-3 rounded-xl font-medium transition-colors"
                    style={{ background: C.surface2, color: C.text }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-medium transition-all"
                    style={{ background: C.error, color: "white" }}
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;
