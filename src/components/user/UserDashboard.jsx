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

// 🧩 Responsive hook — works like media queries
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

export const UserDashboard = () => {
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

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
        setNotifications(resNotifications.data.data || []);

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

        let mostLearnedCourse = null;
        if (courseTimes.length > 0) {
          const sortedCourses = [...courseTimes].sort((a, b) => b.seconds - a.seconds);
          mostLearnedCourse = sortedCourses[0];
          const resCourse = await axios.get(`/course/${mostLearnedCourse.courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCourseName(resCourse.data.data.title);
        }

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

  // --- Stat Card ---
  const StatCard = ({ icon: Icon, title, value, accent }) => (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${accent}` }}
      className={`bg-[#1b1b2a]/80 backdrop-blur-lg p-4 ${
        isMobile ? "flex-col items-start" : "flex-row items-center"
      } rounded-xl border border-purple-600/50 flex gap-4 transition`}
    >
      <div className="p-3 rounded-full" style={{ background: `${accent}20`, color: accent }}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-white`}>
          {value}
        </h2>
      </div>
    </motion.div>
  );

  return (
    <div
      className={`p-4 ${
        isMobile
          ? "grid-cols-1 gap-4"
          : isTablet
          ? "grid-cols-2 gap-6"
          : "grid-cols-3 gap-8"
      } grid bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen text-white`}
    >
      {/* Header */}
      <motion.div
        className={`col-span-full ${
          isMobile ? "text-2xl text-center" : "text-3xl text-left"
        } font-bold`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        👋 Welcome back,{" "}
        <span className="text-cyan-400">{userData.name}</span>
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

      {/* Continue Course, Notifications, etc. keep same structure */}
    </div>
  );
};
