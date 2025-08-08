import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/user/${id}`);
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-lg text-gray-700">Loading user details...</div>
    );

  if (!user)
    return <div className="p-6 text-red-500 text-lg">User not found.</div>;
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/20 text-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img
            src={
              user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={user.fullname}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500 shadow-lg transition-transform hover:scale-105"
          />
          <span
            className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
            title={user.isActive ? "Active" : "Inactive"}
          ></span>
        </div>

        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-wide">{user.fullname}</h1>
          <p className="text-md text-purple-300">{user.email}</p>
          <div className="text-sm">
            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`${
                  user.isActive ? "text-green-400" : "text-red-400"
                } font-semibold`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/20 pt-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">
          🧾 Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
          <div>
            <p className="mb-2">
              <span className="font-semibold">Full Name:</span> {user.fullname}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {user.isActive ? "Active" : "Inactive"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Updated At:</span>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/20 pt-6 flex flex-wrap gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
        >
          ← Back to Users
        </button>
        <button className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">
          ✏️ Edit User
        </button>
        <button className="px-5 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-all">
          ⚠️ Deactivate
        </button>
        <button className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-all">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
