import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Spinner } from "../../utils/Spinner";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Clock,
  Award,
  Target,
  ArrowRight,
  Bell,
  Flame,
  Play,
} from "lucide-react";

export const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [userName, setUserName] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  // --- FETCH DATA (unchanged logic) ----------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(user.data.data.fullname);

        const coursesRes = await axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const certRes = await axios.get(`/certificates/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const actRes = await axios.get(`/activities/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const notifRes = await axios.get(`/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(notifRes.data.data || []);

        const recRes = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // -------- learning time ----------
        let totalSec = 0;
        let courseTimes = [];

        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith(`learningTime_${userId}_`)) {
            const sec = parseInt(localStorage.getItem(k)) || 0;
            totalSec += sec;
            const id = k.split("_")[2];
            courseTimes.push({ courseId: id, seconds: sec });
          }
        });

        const totalMinutes = Math.floor(totalSec / 60);

        let topCourseId = null;
        let topCourseName = "";

        if (courseTimes.length > 0) {
          courseTimes.sort((a, b) => b.seconds - a.seconds);
          topCourseId = courseTimes[0].courseId;

          const c = await axios.get(`/course/${topCourseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          topCourseName = c.data.data.title;
        }

        setDashboard({
          coursesCount: coursesRes.data.data.length,
          certificatesCount: certRes.data.data.length,
          challenges: 12,
          totalMinutes,
          recentActivity: actRes.data.data.slice(0, 5),
          recommended: recRes.data.data.slice(0, 4),
          topCourseId,
          topCourseName,
        });
      } catch (err) {
        console.error("Dashboard loading error:", err);
      }
    };

    fetchData();
  }, []);

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  const hours = Math.floor(dashboard.totalMinutes / 60);
  const mins = dashboard.totalMinutes % 60;

  // UI COMPONENTS -----------------------------------------------------

  const GlowCard = ({ children, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#12141b] border border-white/10 shadow-lg cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_top_left,rgba(120,60,255,0.5),transparent_60%)]"></div>
      {children}
    </motion.div>
  );

  const StatBlock = ({ icon: Icon, label, value }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-5 rounded-xl bg-[#0f131a] border border-white/5 shadow-md"
    >
      <div className="p-3 rounded-xl bg-[#171b22] text-indigo-300">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <h3 className="text-xl font-bold text-white">{value}</h3>
      </div>
    </motion.div>
  );

  const CourseCard = ({ course, onClick }) => (
    <GlowCard onClick={onClick}>
      <div className="flex gap-4">
        <img
          src={course.imageUrl}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div>
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {course.shortDesc?.slice(0, 70) || "Course info"}
          </p>
        </div>
      </div>
    </GlowCard>
  );

  // ===================================================================
  // FINAL UI LAYOUT — MODERN PREMIUM DASHBOARD
  // ===================================================================

  return (
    <div className="p-10 text-white max-w-[1400px] mx-auto space-y-14">

      {/* HEADER ------------------------------------------------------- */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-400">Your personalized learning dashboard</p>
      </div>

      {/* QUICK STATS -------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBlock icon={BookOpen} label="Courses Enrolled" value={dashboard.coursesCount} />
        <StatBlock icon={Award} label="Certificates" value={dashboard.certificatesCount} />
        <StatBlock icon={Target} label="Challenges" value={12} />
        <StatBlock icon={Clock} label="Learning Time" value={`${hours}h ${mins}m`} />
      </div>

      {/* CONTINUE LEARNING ------------------------------------------- */}
      {dashboard.topCourseId && (
        <GlowCard onClick={() => navigate(`/user/learning/${dashboard.topCourseId}`)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Continue Learning</p>
              <h2 className="text-xl font-bold mt-1">{dashboard.topCourseName}</h2>
            </div>

            <div className="p-4 bg-[#1c2130] rounded-xl shadow-inner">
              <Play size={32} className="text-cyan-300" />
            </div>
          </div>
        </GlowCard>
      )}

      {/* MAIN GRID ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT SIDE -------------------------------------------------- */}
        <div className="lg:col-span-2 space-y-12">

          {/* RECOMMENDED COURSES */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">Recommended for you</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dashboard.recommended.map((c) => (
                <CourseCard
                  key={c._id}
                  course={c}
                  onClick={() => navigate(`/user/course/${c._id}`)}
                />
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>

            <GlowCard>
              <div className="space-y-4">
                {dashboard.recentActivity.length > 0 ? (
                  dashboard.recentActivity.map((a) => (
                    <div key={a._id} className="border-b border-white/5 pb-3 last:border-none">
                      <p className="text-sm text-gray-300">{a.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No recent activity</p>
                )}
              </div>
            </GlowCard>
          </div>
        </div>

        {/* RIGHT SIDE — NOTIFICATIONS -------------------------------- */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Notifications</h2>

          <GlowCard>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {notifications.length > 0 ? (
                notifications.slice(0, 6).map((n) => (
                  <div key={n._id} className="p-3 bg-[#121821] rounded-xl text-sm">
                    {n.message}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No notifications available.</p>
              )}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
