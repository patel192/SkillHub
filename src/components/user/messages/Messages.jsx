import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Search, UserPlus, X, Check } from "lucide-react";

/**
 * Messages component
 *
 * - Friends tab shows accepted friends
 * - Requests tab shows: Incoming | Outgoing | Send (search & add)
 * - Accept/Reject/Cancel actions refresh lists and handle errors
 *
 * NOTE: Backend endpoints assumed:
 *  GET  /friends/:userId                     -> accepted friends
 *  GET  /friends/requests/:userId            -> incoming pending requests
 *  GET  /friends/requests/sent/:userId       -> outgoing pending requests (optional)
 *  POST /friends/request                     -> { requesterId, recipientId } create request
 *  PUT  /friends/request/:requestId          -> { status } update request (accepted/rejected)
 *  DELETE /friends/request/:requestId        -> optional: delete/cancel request
 *  GET  /user/search?q=...                   -> search users by name/email
 */

export const Messages = () => {
  const currentUserId = localStorage.getItem("userId");

  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]); // incoming pending requests
  const [outgoing, setOutgoing] = useState([]); // outgoing pending requests
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [activeSidebarTab, setActiveSidebarTab] = useState("friends"); // "friends" | "requests"
  const [activeRequestsTab, setActiveRequestsTab] = useState("incoming"); // "incoming" | "outgoing" | "send"

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [requestedIds, setRequestedIds] = useState(new Set()); // local cache of sent request ids (recipient ids)
  const messagesEndRef = useRef(null);

  // Fetch accepted friends
  const fetchFriends = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/${currentUserId}`);
      // support flexible shape
      const list = res.data?.data ?? res.data?.friends ?? res.data ?? [];
      setFriends(list);
      // preselect first friend if none selected
      if (!selectedUserId && list.length > 0) setSelectedUserId(list[0]._id);
    } catch (err) {
      console.error("fetchFriends:", err?.response?.data ?? err.message);
      setFriends([]);
    }
  };

  // Fetch incoming pending requests
  const fetchIncoming = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/requests/${currentUserId}`);
      const list = res.data?.data ?? res.data ?? [];
      setIncoming(list);
    } catch (err) {
      console.error("fetchIncoming:", err?.response?.data ?? err.message);
      setIncoming([]);
    }
  };

  // Fetch outgoing pending requests (optional endpoint)
  const fetchOutgoing = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/requests/sent/${currentUserId}`);
      const list = res.data?.data ?? res.data ?? [];
      setOutgoing(list);
      // also populate requestedIds set for UI disables
      const ids = new Set((list || []).map((r) => {
        // request object may have recipient or recipient._id
        return String(r.recipient?._id ?? r.recipient ?? "");
      }));
      setRequestedIds(ids);
    } catch (err) {
      // if endpoint not present or error, fallback: keep outgoing empty (we still track requestedIds locally)
      console.warn("fetchOutgoing (optional) failed:", err?.response?.data ?? err.message);
      setOutgoing([]);
    }
  };

  // Fetch chat messages for selected friend
  const fetchMessages = async (friendId) => {
    if (!friendId) return setMessages([]);
    try {
      const res = await axios.get(`http://localhost:8000/messages/${currentUserId}/${friendId}`);
      const msgs = res.data?.data?.messages ?? res.data?.messages ?? res.data ?? [];
      setMessages(msgs);
    } catch (err) {
      console.error("fetchMessages:", err?.response?.data ?? err.message);
      setMessages([]);
    }
  };

  // Send message
  const handleSend = async (text) => {
    if (!selectedUserId || !text?.trim()) return;
    try {
      const payload = { senderId: currentUserId, receiverId: selectedUserId, text, replyTo: null };
      const res = await axios.post("http://localhost:8000/message", payload);
      const newMsg = res.data?.data ?? res.data ?? null;
      if (newMsg) setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("send message error:", err?.response?.data ?? err.message);
      alert("Failed to send message.");
    }
  };

  // Send friend request (from Send panel). Accepts optional user object to add to outgoing locally
  const handleSendRequest = async (recipientId, recipientObj = null) => {
    try {
      await axios.post("http://localhost:8000/friends/request", {
        requesterId: currentUserId,
        recipientId,
      });

      // optimistic UI: mark as requested
      setRequestedIds((prev) => new Set(prev).add(String(recipientId)));

      // also add to outgoing list locally (so user sees it)
      if (recipientObj) {
        setOutgoing((prev) => {
          // create a minimal request-like object for display
          const fakeReq = { _id: `local-${recipientId}`, requester: { _id: currentUserId }, recipient: recipientObj, status: "pending", createdAt: new Date().toISOString() };
          return [fakeReq, ...prev];
        });
      } else {
        // if no info, try to refresh outgoing from server
        fetchOutgoing();
      }

      // clear search
      setSearch("");
      setSearchResults([]);
      setActiveRequestsTab("outgoing"); // switch to outgoing to show the sent request
    } catch (err) {
      console.error("send request error:", err?.response?.data ?? err.message);
      alert(err?.response?.data?.message ?? "Failed to send friend request");
    }
  };

  // Accept or reject incoming request
  const handleIncomingAction = async (requestId, action) => {
    // action should be "accepted" or "rejected"
    try {
      const res = await axios.patch(`http://localhost:8000/friends/${requestId}`, { status: action });

      // After successful accept/reject: refresh incoming + outgoing + friends
      await fetchIncoming();
      await fetchOutgoing();

      if (action === "accepted") {
        // server returns updated request in res.data.data
        const updated = res.data?.data ?? res.data ?? null;
        // determine new friend id (the other party)
        let newFriendId = null;
        if (updated) {
          const requesterId = String(updated.requester?._id ?? updated.requester ?? "");
          const recipientId = String(updated.recipient?._id ?? updated.recipient ?? "");
          newFriendId = requesterId === String(currentUserId) ? recipientId : requesterId;
        }
        // refresh friends and open chat with new friend if available
        await fetchFriends();
        if (newFriendId) setSelectedUserId(newFriendId);
      }
    } catch (err) {
      console.error("handleIncomingAction error:", err?.response?.data ?? err.message);
      alert(err?.response?.data?.message ?? `Failed to ${action} request`);
    }
  };

  // Cancel outgoing request (try DELETE first, fallback to updating status to 'rejected')
  const handleCancelOutgoing = async (requestId) => {
    try {
      // try HTTP DELETE (if backend supports)
      await axios.delete(`http://localhost:8000/friends/request/${requestId}`);
      // remove from outgoing list
      setOutgoing((prev) => prev.filter((r) => String(r._id) !== String(requestId)));
      // also remove from requestedIds if recipient id available
      // try to remove based on recipient id if available:
      // (if request had recipient object)
      // fetchOutgoing() to be safe
      fetchOutgoing();
    } catch (err) {
      // fallback: set status to rejected
      try {
        await axios.put(`http://localhost:8000/friends/request/${requestId}`, { status: "rejected" });
        await fetchOutgoing();
        // also refresh incoming/friends just in case
        await fetchIncoming();
      } catch (err2) {
        console.error("cancel fallback error:", err2?.response?.data ?? err2.message);
        alert("Failed to cancel request");
      }
    }
  };

  // Search users (Send sub-tab). Calls /user/search?q=...
  const handleSearchUsers = async () => {
    if (!search.trim()) return setSearchResults([]);
    try {
      // prefer /user/search (matches your router). If you use /users/search change accordingly.
      const res = await axios.get(`http://localhost:8000/user/search?q=${encodeURIComponent(search)}`);
      const list = res.data?.users ?? res.data?.data ?? res.data ?? [];
      // exclude current user and existing friends
      const friendIds = new Set((friends || []).map((f) => String(f._id)));
      const filtered = list.filter((u) => String(u._id) !== String(currentUserId) && !friendIds.has(String(u._id)));
      setSearchResults(filtered);
    } catch (err) {
      console.error("searchUsers error:", err?.response?.data ?? err.message);
      setSearchResults([]);
      alert("Search failed. Make sure /user/search is implemented on the backend.");
    }
  };

  // Effects: initial load
  useEffect(() => {
    fetchFriends();
    fetchIncoming();
    fetchOutgoing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When selected friend changes, fetch messages
  useEffect(() => {
    fetchMessages(selectedUserId);
  }, [selectedUserId]);

  // scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // small helper to format user display safely
  const nameOf = (u) => (u?.fullname || u?.name || u?.email || "Unknown");

  // --- UI ---
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 flex flex-col border-r border-gray-800">
        {/* Top tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveSidebarTab("friends")}
            className={`flex-1 p-3 text-center ${activeSidebarTab === "friends" ? "bg-violet-700 font-semibold" : "bg-gray-800"}`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveSidebarTab("requests")}
            className={`flex-1 p-3 text-center ${activeSidebarTab === "requests" ? "bg-violet-700 font-semibold" : "bg-gray-800"}`}
          >
            Requests
            {incoming.length > 0 && (
              <span className="ml-2 inline-block bg-red-500 text-xs px-2 py-0.5 rounded-full">{incoming.length}</span>
            )}
          </button>
        </div>

        {/* FRIENDS panel */}
        {activeSidebarTab === "friends" && (
          <div className="flex-1 overflow-y-auto p-3">
            {friends.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <div className="mb-2">No friends yet</div>
                <div className="text-sm">
                  Click{" "}
                  <button onClick={() => setActiveSidebarTab("requests") || setActiveRequestsTab("send")} className="underline text-violet-400 ml-1">
                    Requests
                  </button>{" "}
                  to find people
                </div>
              </div>
            ) : (
              friends.map((f) => (
                <motion.div
                  key={f._id}
                  onClick={() => setSelectedUserId(f._id)}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer ${String(selectedUserId) === String(f._id) ? "bg-violet-700" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                  <img src={f.avatar || "/default-avatar.png"} alt={nameOf(f)} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{nameOf(f)}</div>
                    <div className="text-xs text-gray-400">Tap to chat</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* REQUESTS panel */}
        {activeSidebarTab === "requests" && (
          <div className="flex-1 flex flex-col">
            {/* sub-tabs */}
            <div className="flex gap-1 p-2 border-b border-gray-800">
              <button
                onClick={() => setActiveRequestsTab("incoming")}
                className={`flex-1 py-2 rounded-md ${activeRequestsTab === "incoming" ? "bg-violet-700" : "bg-gray-800"}`}
              >
                Incoming
              </button>
              <button
                onClick={() => setActiveRequestsTab("outgoing")}
                className={`flex-1 py-2 rounded-md ${activeRequestsTab === "outgoing" ? "bg-violet-700" : "bg-gray-800"}`}
              >
                Outgoing
              </button>
              <button
                onClick={() => setActiveRequestsTab("send")}
                className={`flex-1 py-2 rounded-md ${activeRequestsTab === "send" ? "bg-violet-700" : "bg-gray-800"}`}
              >
                Send
              </button>
            </div>

            {/* content */}
            <div className="p-3 overflow-y-auto flex-1">
              {/* Incoming */}
              {activeRequestsTab === "incoming" && (
                <>
                  {incoming.length === 0 ? (
                    <div className="text-gray-400 text-center mt-4">No pending requests</div>
                  ) : (
                    incoming.map((r) => (
                      <div key={r._id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-3">
                          <img src={r.requester?.avatar || "/default-avatar.png"} alt={nameOf(r.requester)} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-medium">{nameOf(r.requester)}</div>
                            <div className="text-xs text-gray-400">{r.requester?.email}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleIncomingAction(r._id, "accepted")} className="bg-green-600 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                            <Check size={14} /> Accept
                          </button>
                          <button onClick={() => handleIncomingAction(r._id, "rejected")} className="bg-red-600 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Outgoing */}
              {activeRequestsTab === "outgoing" && (
                <>
                  {outgoing.length === 0 ? (
                    <div className="text-gray-400 text-center mt-4">No outgoing requests</div>
                  ) : (
                    outgoing.map((r) => {
                      // recipient may be object or id
                      const recipient = r.recipient?.fullname ? r.recipient : { _id: r.recipient, fullname: r.recipientName ?? r.recipient };
                      const rid = String(r._id ?? `${recipient._id}`);
                      return (
                        <div key={rid} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
                          <div className="flex items-center gap-3">
                            <img src={recipient?.avatar || "/default-avatar.png"} alt={nameOf(recipient)} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <div className="font-medium">{nameOf(recipient)}</div>
                              <div className="text-xs text-gray-400">{recipient?.email}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleCancelOutgoing(r._id)} className="bg-gray-600 px-3 py-1 rounded-md text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Send (search & add) */}
              {activeRequestsTab === "send" && (
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                      placeholder="Search by name or email..."
                      className="flex-1 bg-gray-800 p-2 rounded-md text-sm outline-none"
                    />
                    <button onClick={handleSearchUsers} className="bg-violet-600 hover:bg-violet-700 px-3 py-2 rounded-md">
                      <Search size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {searchResults.length === 0 ? (
                      <div className="text-gray-400">No results</div>
                    ) : (
                      searchResults.map((u) => (
                        <div key={u._id} className="flex items-center justify-between bg-gray-800 rounded-md p-2">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar || "/default-avatar.png"} alt={nameOf(u)} className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <div className="font-medium">{nameOf(u)}</div>
                              <div className="text-xs text-gray-400">{u.email}</div>
                            </div>
                          </div>

                          <div>
                            {friends.some((f) => String(f._id) === String(u._id)) ? (
                              <button onClick={() => setSelectedUserId(u._id)} className="bg-green-600 px-3 py-1 rounded-md text-sm">Chat</button>
                            ) : requestedIds.has(String(u._id)) ? (
                              <button disabled className="bg-gray-600 px-3 py-1 rounded-md text-sm">Requested</button>
                            ) : (
                              <button onClick={() => handleSendRequest(u._id, u)} className="bg-violet-600 hover:bg-violet-700 px-3 py-1 rounded-md text-sm">Add</button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center gap-3">
          <span className="text-lg font-semibold">
            {friends.find((f) => String(f._id) === String(selectedUserId))?.fullname || "Select a friend to chat"}
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No messages yet. Say hi 👋</div>
          ) : (
            messages.map((msg) => {
              const isMe = String(msg.senderId?._id ?? msg.senderId) === String(currentUserId);
              return (
                <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-2xl max-w-[70%] ${isMe ? "ml-auto bg-violet-600 text-right" : "mr-auto bg-gray-800"}`}>
                  {msg.replyTo && <div className="text-xs text-gray-300 italic mb-1 border-l-2 border-gray-500 pl-2">Replying to: {msg.replyTo.text}</div>}
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={selectedUserId ? "Type a message..." : "Select a friend first"}
            className="flex-1 bg-gray-800 p-3 rounded-lg outline-none"
            disabled={!selectedUserId}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend(e.target.value);
                e.target.value = "";
              }
            }}
          />
          <button onClick={() => {
            // pick input value from DOM (simple)
            const input = document.querySelector("input[placeholder='Type a message...']");
            const text = input?.value?.trim();
            if (text) {
              handleSend(text);
              if (input) input.value = "";
            }
          }} className="p-3 bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedUserId}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
