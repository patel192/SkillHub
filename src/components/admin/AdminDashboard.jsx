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
  Activity,
  Bug,
  TrendingUp,
  DollarSign,
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
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({});
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState([]);
  const [reports, setReports] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await axios.get("/admin/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats || {});
      setLatestUsers(res.data.latestUsers || []);
      setLatestCourses(res.data.latestCourses || []);
      setEnrollmentTrends(res.data.enrollmentTrends || []);
      setReports(res.data.latestReports || []);
      setTopCourses(res.data.topCourses || []);
    } catch (error) {
      console.error("Error fetching admin overview:", error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#111827] to-[#1e293b] text-white space-y-8"
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-center sm:text-left">
        Admin Dashboard
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard icon={<Users size={20} />} label="Users" value={stats.totalUsers} gradient="from-purple-500 to-cyan-500" />
        <StatCard icon={<Book size={20} />} label="Courses" value={stats.totalCourses} gradient="from-cyan-500 to-teal-500" />
        <StatCard icon={<CheckCircle size={20} />} label="Published" value={stats.totalPublished} gradient="from-green-400 to-emerald-500" />
        <StatCard icon={<Clock size={20} />} label="Unpublished" value={stats.totalUnpublished} gradient="from-yellow-400 to-orange-500" />
        <StatCard icon={<Award size={20} />} label="Certificates" value={stats.totalCertificates} gradient="from-pink-500 to-purple-500" />
        <StatCard icon={<FileText size={20} />} label="Posts" value={stats.totalPosts} gradient="from-cyan-400 to-sky-500" />
        <StatCard icon={<Layers size={20} />} label="Communities" value={stats.totalCommunities} gradient="from-indigo-400 to-purple-500" />
        <StatCard icon={<DollarSign size={20} />} label="Revenue" value={`$${stats.totalRevenue}`} gradient="from-emerald-400 to-green-500" />
        <StatCard icon={<TrendingUp size={20} />} label="Active (7d)" value={stats.activeUsers} gradient="from-purple-400 to-pink-500" />
      </div>

      {/* Enrollment Trends */}
      <Section title="Enrollment Trends" icon={<Activity size={18} className="text-cyan-400" />}>
        {enrollmentTrends.length === 0 ? (
          <p className="text-gray-400 text-sm sm:text-base text-center">No data available.</p>
        ) : (
          <div className="w-full h-56 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#e2e8f0" fontSize={12} />
                <YAxis stroke="#e2e8f0" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #6366f1",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#22d3ee" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Section>

      {/* Latest Users & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestUsers users={latestUsers} />
        <LatestCourses courses={latestCourses} />
      </div>

      {/* Reports & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsSection reports={reports} />
        <TopCoursesSection topCourses={topCourses} />
      </div>
    </motion.div>
  );
};

/* --- Sub Components --- */
const StatCard = ({ icon, label, value, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className={`rounded-xl p-3 sm:p-5 bg-gradient-to-br ${gradient} flex items-center gap-3 sm:gap-4 shadow-lg min-w-0`}
  >
    <div className="bg-black/30 p-2 sm:p-3 rounded-full shrink-0">{icon}</div>
    <div className="truncate">
      <h4 className="text-xs sm:text-sm opacity-80 truncate">{label}</h4>
      <p className="text-base sm:text-2xl font-bold truncate">{value ?? 0}</p>
    </div>
  </motion.div>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-[#111827]/60 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/20 shadow-md space-y-3 overflow-hidden">
    <h3 className="text-lg sm:text-2xl font-semibold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
      {icon} {title}
    </h3>
    <div className="overflow-x-auto custom-scrollbar">{children}</div>
  </div>
);

const LatestUsers = ({ users }) => (
  <Section title="Latest Users" icon={<Users size={18} className="text-cyan-400" />}>
    {users.length === 0 ? (
      <p className="text-gray-400 text-sm sm:text-base">No users found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <motion.tr
                key={u._id}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(34,211,238,0.1)",
                }}
                className="transition cursor-pointer"
              >
                <td className="py-2 px-2 flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center font-bold">
                    {u.fullname?.[0] || "U"}
                  </div>
                  <span className="font-medium truncate max-w-[120px] sm:max-w-[180px]">{u.fullname}</span>
                </td>
                <td className="py-2 px-2 text-gray-300 truncate max-w-[140px] sm:max-w-[200px]">{u.email}</td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                        : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Section>
);

const LatestCourses = ({ courses }) => (
  <Section title="Latest Courses" icon={<Book size={18} className="text-purple-400" />}>
    {courses.length === 0 ? (
      <p className="text-gray-400 text-sm sm:text-base">No courses found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2 px-2">Title</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Level</th>
              <th className="py-2 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <motion.tr
                key={c._id}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(168,85,247,0.1)",
                }}
              >
                <td className="py-2 px-2 font-medium truncate max-w-[120px] sm:max-w-[200px]">{c.title}</td>
                <td className="py-2 px-2 truncate">{c.category}</td>
                <td className="py-2 px-2 text-gray-300">{c.level}</td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      c.isPublished
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    }`}
                  >
                    {c.isPublished ? "Published" : "Unpublished"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Section>
);

const ReportsSection = ({ reports }) => (
  <Section title="Latest Reports" icon={<Bug size={18} className="text-pink-400" />}>
    {reports.length === 0 ? (
      <p className="text-gray-400 text-sm sm:text-base">No reports submitted.</p>
    ) : (
      <ul className="space-y-3">
        {reports.map((r) => (
          <motion.li
            key={r._id}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-3 sm:p-4 rounded-xl border border-white/10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="min-w-0">
                <p className="font-semibold capitalize text-sm truncate">{r.type}</p>
                <p className="text-gray-400 text-xs sm:text-sm truncate">{r.description}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  r.status === "open"
                    ? "bg-red-600/70 text-white"
                    : r.status === "reviewing"
                    ? "bg-yellow-600/70 text-white"
                    : "bg-green-600/70 text-white"
                }`}
              >
                {r.status}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    )}
  </Section>
);

const TopCoursesSection = ({ topCourses }) => (
  <Section title="Top Courses" icon={<TrendingUp size={18} className="text-green-400" />}>
    {topCourses.length === 0 ? (
      <p className="text-gray-400 text-sm sm:text-base">No course data yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2 px-2">Course</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {topCourses.map((c, i) => (
              <motion.tr
                key={i}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(168,85,247,0.1)",
                }}
              >
                <td className="py-2 px-2 font-medium truncate max-w-[120px] sm:max-w-[200px]">{c.title}</td>
                <td className="py-2 px-2 truncate">{c.category}</td>
                <td className="py-2 px-2 text-cyan-400 font-semibold">{c.count}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Section>
);
