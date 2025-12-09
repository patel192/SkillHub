import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Book, Users, CheckCircle, Clock, Award, FileText,
  Layers, Activity, Bug, TrendingUp, DollarSign
} from "lucide-react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
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
    } catch (err) {
      console.error("Overview fetch failed:", err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 min-h-screen 
      bg-gradient-to-br from-[#0C1022] via-[#0D142B] to-[#101828] 
      text-white space-y-10"
    >

      {/* ====================== HEADER ====================== */}
      <div className="mb-4">
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight 
          bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 
          bg-clip-text text-transparent"
        >
          Admin Dashboard
        </motion.h2>
        <p className="text-gray-400 mt-1">Analytics • Insights • Activity</p>
      </div>

      {/* ====================== STAT CARDS ====================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

        <StatCard label="Users" value={stats.totalUsers} icon={<Users size={22} />} color="from-purple-500 to-cyan-500" />
        <StatCard label="Courses" value={stats.totalCourses} icon={<Book size={22} />} color="from-cyan-500 to-blue-500" />
        <StatCard label="Published" value={stats.totalPublished} icon={<CheckCircle size={22} />} color="from-green-500 to-emerald-500" />
        <StatCard label="Unpublished" value={stats.totalUnpublished} icon={<Clock size={22} />} color="from-yellow-400 to-orange-500" />
        <StatCard label="Certificates" value={stats.totalCertificates} icon={<Award size={22} />} color="from-pink-500 to-purple-500" />
        <StatCard label="Posts" value={stats.totalPosts} icon={<FileText size={22} />} color="from-sky-500 to-cyan-500" />
        <StatCard label="Communities" value={stats.totalCommunities} icon={<Layers size={22} />} color="from-indigo-500 to-purple-500" />
        <StatCard label="Revenue" value={`$${stats.totalRevenue}`} icon={<DollarSign size={22} />} color="from-green-400 to-emerald-600" />
      </div>

      {/* ====================== ENROLLMENT TREND CHART ====================== */}
      <GlassSection
        title="Enrollment Trends"
        icon={<Activity size={18} className="text-cyan-400" />}
      >
        {enrollmentTrends.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No data available...</p>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#e2e8f0" />
                <YAxis stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    background: "#0F172A",
                    border: "1px solid #6366f1",
                    borderRadius: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#22d3ee" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassSection>

      {/* ====================== LATEST USERS + COURSES ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestUsers users={latestUsers} />
        <LatestCourses courses={latestCourses} />
      </div>

      {/* ====================== REPORTS + TOP COURSES ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsSection reports={reports} />
        <TopCoursesSection topCourses={topCourses} />
      </div>
    </motion.div>
  );
};


/* ============================================================
   ⬇️ SUB COMPONENTS — Neo Glassmorphism UI
============================================================ */

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`rounded-xl p-5 flex items-center gap-4 
    bg-white/10 backdrop-blur-xl border border-white/10 
    shadow-lg shadow-purple-500/10 hover:shadow-cyan-400/20
    transition`}
  >
    <div className={`p-3 rounded-full bg-gradient-to-br ${color} shadow-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-300 text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value ?? 0}</p>
    </div>
  </motion.div>
);

const GlassSection = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl space-y-4"
  >
    <h3 className="text-xl font-semibold flex items-center gap-2 
      bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
    >
      {icon} {title}
    </h3>

    {children}
  </motion.div>
);

/* LATEST USERS */
const LatestUsers = ({ users }) => (
  <GlassSection title="Latest Users" icon={<Users size={18} className="text-cyan-400" />}>
    {users.length === 0 ? (
      <p className="text-gray-400">No users found.</p>
    ) : (
      <table className="min-w-full text-left text-sm">
        <tbody>
          {users.map((u, i) => (
            <motion.tr
              key={i}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(56,189,248,0.1)" }}
              className="transition cursor-pointer"
            >
              <td className="py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold">
                  {u.fullname?.[0]}
                </div>
                <div>
                  <p className="font-medium">{u.fullname}</p>
                  <p className="text-gray-400 text-xs">{u.email}</p>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    )}
  </GlassSection>
);

/* LATEST COURSES */
const LatestCourses = ({ courses }) => (
  <GlassSection title="Latest Courses" icon={<Book size={18} className="text-purple-400" />}>
    {courses.length === 0 ? (
      <p className="text-gray-400">No courses found.</p>
    ) : (
      <table className="min-w-full text-left text-sm">
        <tbody>
          {courses.map((c, i) => (
            <motion.tr
              key={i}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(168,85,247,0.15)" }}
              className="transition"
            >
              <td className="py-3 font-medium">{c.title}</td>
              <td className="py-3 text-gray-300">{c.category}</td>
              <td className="py-3 text-gray-300">{c.level}</td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    c.isPublished
                      ? "bg-green-500/30 text-green-300"
                      : "bg-yellow-500/30 text-yellow-300"
                  }`}
                >
                  {c.isPublished ? "Published" : "Unpublished"}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    )}
  </GlassSection>
);

/* REPORTS */
const ReportsSection = ({ reports }) => (
  <GlassSection title="Latest Reports" icon={<Bug size={18} className="text-pink-400" />}>
    {reports.length === 0 ? (
      <p className="text-gray-400">No reports submitted.</p>
    ) : (
      <ul className="space-y-3">
        {reports.map((r, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold capitalize">{r.type}</p>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  r.status === "open"
                    ? "bg-red-500/30 text-red-300"
                    : r.status === "reviewing"
                    ? "bg-yellow-500/30 text-yellow-200"
                    : "bg-green-500/30 text-green-300"
                }`}
              >
                {r.status}
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">{r.description}</p>
          </motion.li>
        ))}
      </ul>
    )}
  </GlassSection>
);

/* TOP COURSES */
const TopCoursesSection = ({ topCourses }) => (
  <GlassSection title="Top Courses" icon={<TrendingUp size={18} className="text-green-400" />}>
    {topCourses.length === 0 ? (
      <p className="text-gray-400">No course data.</p>
    ) : (
      <table className="min-w-full text-left text-sm">
        <tbody>
          {topCourses.map((c, i) => (
            <motion.tr
              key={i}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(34,211,238,0.1)" }}
            >
              <td className="py-3 font-medium">{c.title}</td>
              <td className="py-3 text-gray-300">{c.category}</td>
              <td className="py-3 text-cyan-400 font-semibold">{c.count}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    )}
  </GlassSection>
);
