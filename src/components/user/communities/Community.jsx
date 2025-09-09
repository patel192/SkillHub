import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Community = ({basePath}) => {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get("http://localhost:8000/communities");
        setCommunities(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching communities:", err);
      }
    };
    fetchCommunities();
  }, []);
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌐 Communities</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {communities.length > 0 ? (
          communities.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/${basePath}/community/${c._id}`)}
              className="cursor-pointer bg-[#1e293b] rounded-xl p-4 hover:bg-[#334155] transition"
            >
              <img
                src={c.coverImage || "/cover-placeholder.png"}
                alt={c.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{c.name}</h2>
              <p className="text-sm text-gray-400 line-clamp-2">
                {c.description}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {c.members?.length || 0} members
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No communities yet.</p>
        )}
      </div>
    </div>
  );
};
