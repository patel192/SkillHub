import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // --- Notifications ---
        const resNotifications = await axios.get(`/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataNotifications = resNotifications.data.data || [];
        setNotifications(dataNotifications);

        // --- Courses ---
        const resCourses = await axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courses = resCourses.data.data || [];

        // --- Certificates ---
        const resCerts = await axios.get(`/certificates/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const certificates = resCerts.data.data || [];

        // --- Activities ---
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

        // --- Fetch all users for leaderboard rank ---
        const resUsers = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = Array.isArray(resUsers.data.users) ? resUsers.data.users : [];
        const sortedUsers = [...allUsers].sort((a, b) => b.points - a.points);
        const userRank = sortedUsers.findIndex((u) => u._id === userId) + 1;

        // --- Build userData ---
        setUserData({
          name: "Muhammad",
          courses: courses.length,
          challenges: 12, // static if not fetched
          certificates: certificates.length,
          totalMinutes,
          mostLearnedCourse,
          leaderboardRank: userRank || 0,
          recommendations: [
            { title: "React Hooks Mastery", image: "/assets/react-course.jpg" },
            { title: "Node.js Crash Course", image: "/assets/node-course.jpg" },
          ],
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
        Loading Dashboard...
      </div>
    );
  }

  // --- Stat Card ---
  const StatCard = ({ icon: Icon, title, value, accent }) => (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${accent}` }}
      className="bg-[#1b1b2a]/80 backdrop-blur-lg p-5 rounded-xl border border-purple-600/50 flex items-center gap-4 transition"
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
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen text-white">
      {/* Welcome Header */}
      <motion.div
        className="col-span-full text-3xl font-bold"
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
      <StatCard
        icon={FaClock}
        title="Total Learning Time"
        value={`${Math.floor(userData.totalMinutes / 60)}h ${userData.totalMinutes % 60}m`}
        accent="#7C3AED"
      />

      {/* Continue Course */}
      {userData.mostLearnedCourse && (
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FF00" }}
          className="bg-[#1b1b2a]/80 backdrop-blur-lg p-5 rounded-xl border border-purple-600/50 col-span-1"
        >
          <div className="flex items-center gap-4">
            <FaPlayCircle size={30} className="text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Continue Course</p>
              <h2 className="font-semibold text-white">{courseName}</h2>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00FF00" }}
            className="mt-4 bg-green-600 px-4 py-2 rounded-lg text-sm font-medium transition"
            onClick={() => navigate(`/learning/${userData.mostLearnedCourse.courseId}`)}
          >
            Resume
          </motion.button>
        </motion.div>
      )}

      {/* Leaderboard Rank */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FFD700" }}
        className="bg-[#1b1b2a]/80 backdrop-blur-lg p-5 rounded-xl border border-purple-600/50 flex items-center justify-between col-span-1"
      >
        <div>
          <p className="text-gray-400 text-sm">Your Rank</p>
          <h2 className="text-2xl font-semibold text-white">#{userData.leaderboardRank}</h2>
        </div>
        <MdLeaderboard size={40} className="text-yellow-400" />
      </motion.div>

      {/* ... other sections like Recommendations, Notifications, Activities ... */}
    </div>
  );
};
