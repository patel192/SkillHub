import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data.users || []);
      console.log(res.data)
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
      await axios.patch(`http://localhost:8000/user/${id}`, {
        isActive: !currentStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleRole = async (id, currentRole) => {
    try {
      await axios.patch(`http://localhost:8000/user/${id}`, {
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
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Link
            to={`${user._id}`}>
            <div
              key={user._id}
              className="rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullname}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-sm text-white">
                    N/A
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.fullname || "Unnamed"}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.isActive ? "bg-green-700 text-black" : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Created:{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleActive(user._id, user.isActive)}
                  className={`py-1 rounded-md text-sm font-medium transition ${
                    user.isActive
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => toggleRole(user._id, user.role)}
                  className="py-1 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-900"
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
