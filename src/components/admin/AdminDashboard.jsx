import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Book, Users, CheckCircle, Clock } from "lucide-react";
import axios from "axios";
export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalPublished: 0,
    totalUnpublished: 0,
  });

  const [latestCourses, setLatestCourses] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/overview");
      setStats(res.data.stats);
      setLatestCourses(res.data.latestCourses);
    } catch (error) {
      console.error("Error fetching admin stats:", error.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 text-white"
    >
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Book size={24} />} label="Courses" value={stats.totalCourses} />
        <StatCard icon={<Users size={24} />} label="Users" value={stats.totalUsers} />
        <StatCard icon={<CheckCircle size={24} />} label="Published" value={stats.totalPublished} />
        <StatCard icon={<Clock size={24} />} label="Unpublished" value={stats.totalUnpublished} />
      </div>

      {/* Latest Courses */}
      <div className="bg-[#1E293B] rounded-xl p-4 shadow">
        <h3 className="text-xl font-semibold mb-4">Latest Courses</h3>
        <div className="space-y-3">
          {latestCourses.length === 0 ? (
            <p className="text-gray-400">No courses found.</p>
          ) : (
            latestCourses.map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between p-3 bg-[#334155] rounded-lg"
              >
                <div>
                  <h4 className="font-semibold text-lg">{course.title}</h4>
                  <p className="text-sm text-gray-400">
                    {course.category} • {course.level}
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    course.isPublished ? "bg-green-600" : "bg-yellow-600"
                  }`}
                >
                  {course.isPublished ? "Published" : "Unpublished"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
const StatCard = ({ icon, label, value }) => (
  <div className="bg-[#1E293B] p-4 rounded-xl shadow flex items-center gap-4 hover:scale-105 transition-transform duration-500 cursor-pointer">
    <div className="bg-indigo-600 p-3 rounded-full">{icon}</div>
    <div>
      <h4 className="text-sm text-gray-400">{label}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
