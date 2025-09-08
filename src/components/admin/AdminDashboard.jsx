import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Book, Users, CheckCircle, Clock, Award, FileText, Layers } from "lucide-react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState([]);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/overview");
      setStats(res.data.stats);
      setLatestUsers(res.data.latestUsers);
      setLatestCourses(res.data.latestCourses);
      setEnrollmentTrends(res.data.enrollmentTrends);
    } catch (error) {
      console.error("Error fetching admin overview:", error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 text-white space-y-8"
    >
      <h2 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={24} />} label="Users" value={stats.totalUsers} />
        <StatCard icon={<Book size={24} />} label="Courses" value={stats.totalCourses} />
        <StatCard icon={<CheckCircle size={24} />} label="Published" value={stats.totalPublished} />
        <StatCard icon={<Clock size={24} />} label="Unpublished" value={stats.totalUnpublished} />
        <StatCard icon={<Award size={24} />} label="Certificates" value={stats.totalCertificates} />
        <StatCard icon={<FileText size={24} />} label="Posts" value={stats.totalPosts} />
        <StatCard icon={<Layers size={24} />} label="Communities" value={stats.totalCommunities} />
      </div>

      {/* Enrollment Trends */}
      <div className="bg-[#1E293B] rounded-xl p-4 shadow">
        <h3 className="text-xl font-semibold mb-4">📈 Enrollment Trends</h3>
        {enrollmentTrends.length === 0 ? (
          <p className="text-gray-400">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Latest Users & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Users */}
        <div className="bg-[#1E293B] rounded-xl p-4 shadow">
          <h3 className="text-xl font-semibold mb-4">👥 Latest Users</h3>
          {latestUsers.length === 0 ? (
            <p className="text-gray-400">No users found.</p>
          ) : (
            <div className="space-y-3">
              {latestUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
                  <div>
                    <h4 className="font-semibold">{user.fullname}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-indigo-600">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Courses */}
        <div className="bg-[#1E293B] rounded-xl p-4 shadow">
          <h3 className="text-xl font-semibold mb-4">📚 Latest Courses</h3>
          {latestCourses.length === 0 ? (
            <p className="text-gray-400">No courses found.</p>
          ) : (
            <div className="space-y-3">
              {latestCourses.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-gray-400">
                      {course.category} • {course.level}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      course.isPublished ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-[#1E293B] p-4 rounded-xl shadow flex items-center gap-4 hover:scale-105 transition-transform duration-500 cursor-pointer">
    <div className="bg-indigo-600 p-3 rounded-full">{icon}</div>
    <div>
      <h4 className="text-sm text-gray-400">{label}</h4>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  </div>
);
