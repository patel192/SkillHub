import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const UserDetails = () => {
  const { id } = useParams(); // from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/user/${id}`);
      setUser(res.data.data);
      
      console.log(res.data.data)
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

  if (loading) return <div className="p-6">Loading user details...</div>;

  if (!user) return <div className="p-6 text-red-500">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-6">
        <img
          src={
            user.avatar ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt={user.fullname}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.fullname}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm mt-1">
            Role: <span className="capitalize font-medium">{user.role}</span>
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-medium ${
                user.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </p>
          <p className="text-sm mt-1">
            Account Created:{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">User Details</h3>
        <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
          <li>
            <strong>Full Name:</strong> {user.fullname || "Not provided"}
          </li>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
          <li>
            <strong>Role:</strong> {user.role}
          </li>
          <li>
            <strong>Status:</strong>{" "}
            {user.isActive ? "Active" : "Inactive"}
          </li>
          <li>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </li>
          <li>
            <strong>Updated At:</strong>{" "}
            {new Date(user.updatedAt).toLocaleString()}
          </li>
        </ul>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Back to Users
        </button>
        {/* You can add edit, deactivate, or delete here */}
      </div>
    </div>
  );
};

export default UserDetails;
