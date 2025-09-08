import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Users,
  CheckCircle,
  Clock,
  Award,
  FileText,
  Layers,
  UserCircle,
} from "lucide-react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      className="p-8 min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-10"
    >
      {/* Page Title */}
      <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        Admin Dashboard
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          icon={<Users size={28} />}
          label="Total Users"
          value={stats.totalUsers}
          gradient="from-indigo-500 to-blue-500"
        />
        <StatCard
          icon={<Book size={28} />}
          label="Total Courses"
          value={stats.totalCourses}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={<CheckCircle size={28} />}
          label="Published"
          value={stats.totalPublished}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={<Clock size={28} />}
          label="Unpublished"
          value={stats.totalUnpublished}
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          icon={<Award size={28} />}
          label="Certificates"
          value={stats.totalCertificates}
          gradient="from-teal-500 to-cyan-500"
        />
        <StatCard
          icon={<FileText size={28} />}
          label="Posts"
          value={stats.totalPosts}
          gradient="from-pink-500 to-rose-500"
        />
        <StatCard
          icon={<Layers size={28} />}
          label="Communities"
          value={stats.totalCommunities}
          gradient="from-sky-500 to-indigo-500"
        />
      </div>

      {/* Enrollment Trends */}
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <ChartIcon /> Enrollment Trends
        </h3>
        {enrollmentTrends.length === 0 ? (
          <p className="text-gray-400">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Latest Users & Courses */}
      {/* Latest Users & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Users */}
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Users size={22} /> Latest Users
          </h3>
          {latestUsers.length === 0 ? (
            <p className="text-gray-400">No users found.</p>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-gray-400 border-b border-gray-700">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      className="transition cursor-pointer"
                    >
                      <td className="py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                          {user.fullname?.[0] || "U"}
                        </div>
                        <span className="font-medium">{user.fullname}</span>
                      </td>
                      <td className="py-3 text-gray-300">{user.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-600/70 text-white"
                              : "bg-indigo-600/70 text-white"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Latest Courses */}
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Book size={22} /> Latest Courses
          </h3>
          {latestCourses.length === 0 ? (
            <p className="text-gray-400">No courses found.</p>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-gray-400 border-b border-gray-700">
                    <th className="py-2">Title</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Level</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestCourses.map((course) => (
                    <motion.tr
                      key={course._id}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      className="transition cursor-pointer"
                    >
                      <td className="py-3 font-medium">{course.title}</td>
                      <td className="py-3">
                        <span className="bg-indigo-500/60 text-xs px-2 py-1 rounded-md">
                          {course.category}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300">{course.level}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            course.isPublished
                              ? "bg-green-600/70 text-white"
                              : "bg-yellow-600/70 text-white"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Unpublished"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${gradient} text-white flex items-center gap-4`}
  >
    <div className="bg-black/20 p-3 rounded-full">{icon}</div>
    <div>
      <h4 className="text-sm opacity-80">{label}</h4>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </div>
  </motion.div>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 19h16M4 15h8m-8-4h16m-8-4h8m-16-4h16"
    />
  </svg>
);
