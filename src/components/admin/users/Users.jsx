import { useEffect, useState } from "react";
import axios from "axios";

export const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await axios.patch(`http://localhost:8000/users/${userId}/role`, {
        role: newRole,
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">Manage Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition duration-300 border border-gray-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullname}`}
                  alt={user.fullname}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.fullname || "Unnamed"}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="mb-2 flex flex-wrap gap-2">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border">
                  Role: <span className="font-medium capitalize">{user.role}</span>
                </span>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Joined on:{" "}
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => toggleStatus(user._id, user.isActive)}
                  className={`px-4 py-1 text-sm rounded-full font-medium transition ${
                    user.isActive
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => toggleRole(user._id, user.role)}
                  className="px-4 py-1 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
