import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Users = ({token}) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users",{
          headers:{Authorization:`Bearer ${token}`}
        });
      setUsers(res.data.users || []);
      console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/user/${id}`,{
          headers:{Authorization:`Bearer ${token}`}
        }, {
        isActive: !currentStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleRole = async (id, currentRole) => {
    try {
      await axios.patch(`http://localhost:8000/user/${id}`,{
          headers:{Authorization:`Bearer ${token}`}
        }, {
        role: currentRole === "admin" ? "user" : "admin",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-8">
        User Management
      </h2>

      {/* Search Box */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-[#1E293B]/60 border border-white/10 shadow-sm text-white 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
        />
      </div>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((user) => (
            <Link key={user._id} to={`${user._id}`}>
              <div
                className="rounded-2xl bg-[#1E293B]/60 backdrop-blur-md p-6 shadow-lg border border-white/10 
                          hover:shadow-xl hover:scale-[1.02] transition duration-300"
              >
                {/* Avatar + Basic Info */}
                <div className="flex items-center gap-4 mb-5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullname}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                      {user.fullname?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.fullname || "Unnamed"}
                    </h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>

                {/* Status + Role */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.isActive
                        ? "bg-green-600/70 text-white"
                        : "bg-red-600/70 text-white"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === "admin"
                        ? "bg-yellow-500/70 text-white"
                        : "bg-indigo-500/70 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Created Date */}
                <p className="text-sm text-gray-400 mb-5">
                  Created:{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => toggleActive(user._id, user.isActive)}
                    className={`py-2 rounded-lg text-sm font-semibold transition ${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => toggleRole(user._id, user.role)}
                    className="py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 
                           hover:from-indigo-600 hover:to-purple-600 text-white transition"
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
