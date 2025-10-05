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

        const resNotifications = await axios.get(`/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataNotifications = resNotifications.data.data || [];
        setNotifications(dataNotifications);

        const resCourses = await axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courses = resCourses.data.data || [];

        const resCerts = await axios.get(`/certificates/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const certificates = resCerts.data.data || [];

        const resActivities = await axios.get(`/activities/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userActivities = resActivities.data.data || [];
        setActivities(userActivities);

        // --- Learning Time ---
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

        // --- Most learned course ---
        let mostLearnedCourse = null;
        if (courseTimes.length > 0) {
          const sortedCourses = [...courseTimes].sort((a, b) => b.seconds - a.seconds);
          mostLearnedCourse = sortedCourses[0];
          const resCourse = await axios.get(`/course/${mostLearnedCourse.courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCourseName(resCourse.data.data.title);
        }

        // --- Leaderboard rank ---
        const resUsers = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = Array.isArray(resUsers.data.users) ? resUsers.data.users : [];
        const sortedUsers = [...allUsers].sort((a, b) => b.points - a.points);
        const userRank = sortedUsers.findIndex((u) => u._id === userId) + 1;

        setUserData({
          name: "Muhammad",
          courses: courses.length,
          challenges: 12,
          certificates: certificates.length,
          totalMinutes,
          mostLearnedCourse,
          leaderboardRank: userRank || 0,
          recomcourses: dataRecomCourses.slice(0, 3),
          recentActivity: userActivities.slice(0, 3),
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
      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${accent}` }}
      className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-5 rounded-xl border border-purple-600/50 flex items-center gap-3 sm:gap-4 transition"
    >
      <div className="p-2 sm:p-3 rounded-full" style={{ background: `${accent}20`, color: accent }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-400">{title}</p>
        <h2 className="text-sm sm:text-lg font-semibold text-white">{value}</h2>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen text-white">
      
      {/* Welcome Header */}
      <motion.div
        className="col-span-full text-2xl sm:text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
      >
        👋 Welcome back, <span className="text-cyan-400">{userData.name}</span>
      </motion.div>

      {/* Stats */}
      <StatCard icon={FaBook} title="Courses Enrolled" value={userData.courses} accent="#00FFFF" />
      <StatCard icon={FaTasks} title="Challenges Completed" value={userData.challenges} accent="#FF00FF" />
      <StatCard icon={FaCertificate} title="Certificates Earned" value={userData.certificates} accent="#FFD700" />
      <StatCard icon={FaClock} title="Total Learning Time" value={`${Math.floor(userData.totalMinutes / 60)}h ${userData.totalMinutes % 60}m`} accent="#7C3AED" />

      {/* Continue Course */}
      {userData.mostLearnedCourse && (
        <motion.div whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FF00" }} className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-5 rounded-xl border border-purple-600/50 col-span-full sm:col-span-1">
          <div className="flex items-center gap-3">
            <FaPlayCircle size={25} className="text-green-400" />
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Continue Course</p>
              <h2 className="font-semibold text-white text-sm sm:text-base">{courseName}</h2>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00FF00" }}
            className="mt-3 sm:mt-4 bg-green-600 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition"
            onClick={() => navigate(`/learning/${userData.mostLearnedCourse.courseId}`)}
          >
            Resume
          </motion.button>
        </motion.div>
      )}

      {/* Recommendations - horizontal scroll on mobile */}
      <motion.div whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FF00FF" }} className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-5 rounded-xl border border-purple-600/50 col-span-full">
        <div className="font-semibold mb-3 text-lg text-white">Recommended for You</div>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {userData.recomcourses.map((course, index) => (
            <div key={index} className="flex-shrink-0 w-40 bg-[#2a2a3b] p-3 rounded-xl hover:bg-[#3b3b4d] transition">
              <img src={course.imageUrl} alt={course.title} className="w-full h-20 sm:h-24 rounded-lg object-cover mb-2" />
              <div className="flex justify-between items-center w-full">
                <span className="font-medium text-xs sm:text-sm text-gray-200">{course.title}</span>
                <AiOutlineArrowRight size={16} className="text-cyan-400" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FFFF" }} className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-5 rounded-xl border border-purple-600/50 col-span-full cursor-pointer" onClick={() => navigate("/user/notifications")}>
        <div className="flex items-center gap-2 font-semibold text-sm sm:text-lg mb-2 sm:mb-3 text-white">
          <FaBell className="text-yellow-400" /> Notifications
        </div>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
          {notifications.length > 0
            ? notifications.slice(0, 3).map((n) => (
                <li key={n._id} className={n.read ? "text-gray-400" : "text-white"}>
                  • {n.message}
                </li>
              ))
            : <li className="text-gray-400">No notifications yet</li>}
        </ul>
        <p className="mt-2 sm:mt-3 text-cyan-400 text-xs sm:text-sm">View All →</p>
      </motion.div>

      {/* Recent Activity */}
      <motion.div whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FF00FF" }} className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-5 rounded-xl border border-purple-600/50 col-span-full cursor-pointer" onClick={() => navigate("/user/activities")}>
        <div className="font-semibold mb-2 sm:mb-3 text-sm sm:text-lg text-white">Recent Activity</div>
        <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2">
          {userData.recentActivity.length > 0
            ? userData.recentActivity.map((activity) => (
                <li key={activity._id} className="text-gray-300">
                  • {activity.message}
                </li>
              ))
            : <li className="text-gray-400">No recent activity</li>}
        </ul>
        <p className="mt-2 sm:mt-3 text-purple-400 text-xs sm:text-sm">View All →</p>
      </motion.div>

      {/* Leaderboard Rank */}
      <motion.div whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FFD700" }} className="bg-[#1b1b2a]/80 backdrop-blur-lg p-4 sm:p-5 rounded-xl border border-purple-600/50 flex items-center justify-between col-span-full sm:col-span-1">
        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Your Rank</p>
          <h2 className="text-lg sm:text-2xl font-semibold text-white">#{userData.leaderboardRank}</h2>
        </div>
        <MdLeaderboard size={30} className="text-yellow-400 sm:text-yellow-400" />
      </motion.div>
    </div>
  );
};
