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
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const recommendatedCourses = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataRecomCourses = recommendatedCourses.data.data || [];

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
        let courseName = "";
        if (courseTimes.length > 0) {
          const sortedCourses = [...courseTimes].sort(
            (a, b) => b.seconds - a.seconds
          );
          mostLearnedCourse = sortedCourses[0];
          const resCourse = await axios.get(
            `/course/${mostLearnedCourse.courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          courseName = resCourse.data.data.title;
        }

        const resUsers = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = Array.isArray(resUsers.data.users)
          ? resUsers.data.users
          : [];
        const sortedUsers = [...allUsers].sort((a, b) => b.points - a.points);
        const userRank = sortedUsers.findIndex((u) => u._id === userId) + 1;

        setUserData({
          courses: courses.length,
          challenges: 12,
          certificates: certificates.length,
          totalMinutes,
          mostLearnedCourse,
          courseName,
          leaderboardRank: userRank || 0,
          recomcourses: dataRecomCourses.slice(0, 3),
          recentActivity: userActivities.slice(0, 3),
        });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.data.fullname);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
      }
    };

    fetchDashboardData();
    fetchUser();
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
      className="
        bg-[#1b1b2a]/80 backdrop-blur-lg rounded-lg 
        p-4 border border-purple-600/40 flex items-center gap-3 transition
        sm:p-5 sm:gap-4
        lg:p-6 lg:rounded-xl lg:border-purple-600/50
      "
    >
      <div
        className="p-3 rounded-full"
        style={{ background: `${accent}20`, color: accent }}
      >
        <Icon size={28} />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-400">{title}</p>
        <h2 className="text-base sm:text-lg font-semibold text-white">
          {value}
        </h2>
      </div>
    </motion.div>
  );

  return (
    <div
      className="
        min-h-screen text-white bg-gradient-to-br 
        from-[#0f172a] via-[#1e1b4b] to-[#0f172a]
        max-w-[1600px] mx-auto
        grid grid-cols-1 gap-4 p-4
        sm:p-6 sm:gap-6
        md:grid-cols-2 md:gap-8
        lg:p-10 lg:gap-10 lg:grid-cols-2
        xl:p-12 xl:gap-12 xl:grid-cols-3
      "
    >
      {/* HEADER */}
      <motion.h1
        className="col-span-full text-xl sm:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome back, <span className="text-cyan-400">{userName}</span>
      </motion.h1>

      {/* STAT CARDS */}
      <StatCard
        icon={FaBook}
        title="Courses Enrolled"
        value={userData.courses}
        accent="#00FFFF"
      />
      <StatCard
        icon={FaTasks}
        title="Challenges Completed"
        value={userData.challenges}
        accent="#FF00FF"
      />
      <StatCard
        icon={FaCertificate}
        title="Certificates Earned"
        value={userData.certificates}
        accent="#FFD700"
      />
      <StatCard
        icon={FaClock}
        title="Total Learning Time"
        value={`${Math.floor(userData.totalMinutes / 60)}h ${
          userData.totalMinutes % 60
        }m`}
        accent="#7C3AED"
      />

      {/* CONTINUE COURSE */}
      {userData.mostLearnedCourse && (
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FF00" }}
          className="
            bg-[#1b1b2a]/80 backdrop-blur-lg rounded-lg p-4
            border border-purple-600/40 col-span-full
            sm:p-5 md:col-span-2
            lg:p-6 lg:rounded-xl lg:border-purple-600/50
          "
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <FaPlayCircle size={30} className="text-green-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                Continue Course
              </p>
              <h2 className="font-semibold text-white text-base sm:text-lg md:text-xl truncate">
                {userData.courseName}
              </h2>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00FF00" }}
            className="
              mt-4 sm:mt-5 w-full md:w-auto bg-green-600 px-5 sm:px-6 py-2.5 sm:py-3
              rounded-lg text-sm sm:text-base font-medium transition
            "
            onClick={() =>
              navigate(`/user/learning/${userData.mostLearnedCourse.courseId}`)
            }
          >
            Resume
          </motion.button>
        </motion.div>
      )}

      {/* RECOMMENDED COURSES */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FF00FF" }}
        className="
          bg-[#1b1b2a]/80 backdrop-blur-lg rounded-lg p-4
          border border-purple-600/40 col-span-full
          sm:p-5 md:col-span-2
          lg:p-6 lg:rounded-xl lg:border-purple-600/50
        "
      >
        <div className="font-semibold mb-3 sm:mb-4 text-lg sm:text-xl">
          Recommended for You
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-72 overflow-y-auto">
          {userData.recomcourses.map((course, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-[#2a2a3b] p-3 sm:p-4 rounded-xl hover:bg-[#3b3b4d] transition-colors cursor-pointer"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
              />
              <div className="flex justify-between items-center w-full truncate">
                <span className="font-medium text-gray-200 truncate">
                  {course.title}
                </span>
                <AiOutlineArrowRight
                  size={20}
                  className="text-cyan-400 flex-shrink-0"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* NOTIFICATIONS */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FFFF" }}
        className="
          bg-[#1b1b2a]/80 backdrop-blur-lg rounded-lg p-4
          border border-purple-600/40 col-span-full md:col-span-1 cursor-pointer
          sm:p-5 lg:p-6 lg:rounded-xl lg:border-purple-600/50
        "
        onClick={() => navigate("/user/notifications")}
      >
        <div className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-2 sm:mb-3">
          <FaBell className="text-yellow-400" /> Notifications
        </div>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-2 max-h-48 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.slice(0, 3).map((n) => (
              <li
                key={n._id}
                className={n.read ? "text-gray-400" : "text-white"}
              >
                • {n.message}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No notifications yet</li>
          )}
        </ul>
        <p className="mt-3 text-cyan-400 text-xs sm:text-sm">View All →</p>
      </motion.div>

      {/* RECENT ACTIVITY */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FF00FF" }}
        className="
          bg-[#1b1b2a]/80 backdrop-blur-lg rounded-lg p-4
          border border-purple-600/40 col-span-full md:col-span-1 cursor-pointer
          sm:p-5 lg:p-6 lg:rounded-xl lg:border-purple-600/50
        "
        onClick={() => navigate("/user/activities")}
      >
        <div className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
          Recent Activity
        </div>
        <ul className="text-xs sm:text-sm space-y-2 max-h-48 overflow-y-auto">
          {userData.recentActivity.length > 0 ? (
            userData.recentActivity.map((activity) => (
              <li key={activity._id} className="text-gray-300">
                • {activity.message}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No recent activity</li>
          )}
        </ul>
        <p className="mt-3 text-purple-400 text-xs sm:text-sm">View All →</p>
      </motion.div>

      {/* LEADERBOARD */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px #FFD700" }}
        className="
          bg-[#1b1b2a]/80 backdrop-blur-lg rounded-lg p-4
          border border-purple-600/40 flex items-center justify-between
          col-span-full md:col-span-1
          sm:p-5 lg:p-6 lg:rounded-xl lg:border-purple-600/50
        "
      >
        <div>
          <p className="text-xs sm:text-sm text-gray-400">Your Rank</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            #{userData.leaderboardRank}
          </h2>
        </div>
        <MdLeaderboard size={36} className="text-yellow-400" />
      </motion.div>
    </div>
  );
};
