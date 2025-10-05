import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "../../utils/Spinner";
import {
  FaBook,
  FaCertificate,
  FaClock,
  FaPlayCircle,
  FaTasks,
  FaBell,
} from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [recomcourse, setrecomcourse] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const recommendatedCourses = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataRecomCourses = recommendatedCourses.data.data || [];
        setrecomcourse(dataRecomCourses);

        // Notifications
        const resNotifications = await axios.get(`/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(resNotifications.data.data || []);

        // Courses
        const resCourses = await axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courses = resCourses.data.data || [];

        // Certificates
        const resCerts = await axios.get(`/certificates/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const certificates = resCerts.data.data || [];

        // Activities
        const resActivities = await axios.get(`/activities/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userActivities = resActivities.data.data || [];
        setActivities(userActivities);

        // Learning time
        let totalSeconds = 0;
        let courseTimes = [];
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(`learningTime_${userId}_`)) {
            const seconds = parseInt(localStorage.getItem(key), 10) || 0;
            totalSeconds += seconds;
            const courseId = key.split("_")[2];
            courseTimes.push({ courseId, seconds });
          }
        });
        const totalMinutes = Math.floor(totalSeconds / 60);

        // Most learned course
        let mostLearnedCourse = null;
        if (courseTimes.length > 0) {
          const sortedCourses = [...courseTimes].sort((a, b) => b.seconds - a.seconds);
          mostLearnedCourse = sortedCourses[0];
          const resCourse = await axios.get(`/course/${mostLearnedCourse.courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCourseName(resCourse.data.data.title);
        }

        // Leaderboard rank
        const resUsers = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = Array.isArray(resUsers.data.users) ? resUsers.data.users : [];
        const sortedUsers = [...allUsers].sort((a, b) => b.points - a.points);
        const userRank = sortedUsers.findIndex((u) => u._id === userId) + 1;

        // Build userData
        setUserData({
          name: "Muhammad",
          courses: courses.length,
          challenges: 12,
          certificates: certificates.length,
          totalMinutes,
          mostLearnedCourse,
          leaderboardRank: userRank || 0,
          recomcourses: dataRecomCourses.slice(0, 10),
          recentActivity: userActivities.slice(0, 5),
        });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [token, userId]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, accent }) => (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: `0 0 15px ${accent}` }}
      className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 rounded-xl border border-purple-600/50 flex items-center gap-3 transition"
    >
      <div className="p-3 rounded-full" style={{ background: `${accent}20`, color: accent }}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-lg font-semibold text-white">{value}</h2>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen text-white">
      {/* Welcome */}
      <motion.div
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        👋 Welcome back, <span className="text-cyan-400">{userData.name}</span>
      </motion.div>

      {/* Stats */}
      <div className="space-y-3">
        <StatCard icon={FaBook} title="Courses Enrolled" value={userData.courses} accent="#00FFFF" />
        <StatCard icon={FaTasks} title="Challenges Completed" value={userData.challenges} accent="#FF00FF" />
        <StatCard icon={FaCertificate} title="Certificates Earned" value={userData.certificates} accent="#FFD700" />
        <StatCard
          icon={FaClock}
          title="Total Learning Time"
          value={`${Math.floor(userData.totalMinutes / 60)}h ${userData.totalMinutes % 60}m`}
          accent="#7C3AED"
        />
      </div>

      {/* Continue Course */}
      {userData.mostLearnedCourse && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 rounded-xl border border-purple-600/50"
        >
          <div className="flex items-center gap-3">
            <FaPlayCircle size={28} className="text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Continue Course</p>
              <h2 className="font-semibold text-white">{courseName}</h2>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-3 bg-green-600 px-4 py-2 rounded-lg text-sm font-medium w-full"
            onClick={() => navigate(`/learning/${userData.mostLearnedCourse.courseId}`)}
          >
            Resume
          </motion.button>
        </motion.div>
      )}

      {/* Recommendations - Swipeable */}
      <div>
        <p className="font-semibold mb-2 text-lg">Recommended for You</p>
        <motion.div className="flex gap-3 overflow-x-auto pb-2" drag="x" dragConstraints={{ left: -1000, right: 0 }}>
          {userData.recomcourses.map((course, idx) => (
            <div
              key={idx}
              className="min-w-[200px] bg-[#2a2a3b] p-3 rounded-xl flex-shrink-0 hover:bg-[#3b3b4d] cursor-pointer"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <img src={course.imageUrl} alt={course.title} className="w-full h-28 object-cover rounded-lg mb-2" />
              <p className="text-gray-200 font-medium">{course.title}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Notifications */}
      <div
        className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 rounded-xl border border-purple-600/50 cursor-pointer"
        onClick={() => navigate("/user/notifications")}
      >
        <div className="flex items-center gap-2 font-semibold text-lg mb-2 text-white">
          <FaBell className="text-yellow-400" /> Notifications
        </div>
        <ul className="text-sm text-gray-300 space-y-1">
          {notifications.length > 0
            ? notifications.slice(0, 3).map((n) => (
                <li key={n._id} className={n.read ? "text-gray-400" : "text-white"}>
                  • {n.message}
                </li>
              ))
            : <li className="text-gray-400">No notifications yet</li>}
        </ul>
        <p className="mt-2 text-cyan-400 text-sm">View All →</p>
      </div>

      {/* Recent Activity */}
      <div
        className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 rounded-xl border border-purple-600/50 cursor-pointer"
        onClick={() => navigate("/user/activities")}
      >
        <p className="font-semibold mb-2 text-lg text-white">Recent Activity</p>
        <ul className="text-sm space-y-1 text-gray-300">
          {userData.recentActivity.length > 0
            ? userData.recentActivity.map((activity) => (
                <li key={activity._id}>• {activity.message}</li>
              ))
            : <li className="text-gray-400">No recent activity</li>}
        </ul>
        <p className="mt-2 text-purple-400 text-sm">View All →</p>
      </div>

      {/* Leaderboard */}
      <div className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 rounded-xl border border-purple-600/50 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Your Rank</p>
          <h2 className="text-2xl font-semibold text-white">#{userData.leaderboardRank}</h2>
        </div>
        <MdLeaderboard size={36} className="text-yellow-400" />
      </div>
    </div>
  );
};
