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
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [notifications, setNotifications] = useState([]);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 4. Notifications
  const fetchNotifications = async () => {
    const resNotifications = await axios.get(
      `http://localhost:8000/notifications/${userId}`
    );
    const dataNotifications = resNotifications.data.data || [];
    setNotifications(dataNotifications);
  };
useEffect(() => {
  fetchNotifications()
})
  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        // 1. Courses
        const resCourses = await axios.get(
          `http://localhost:8000/enrollment/${userId}`
        );
        const dataCourses = resCourses.data;

        // 2. Certificates
        const resCerts = await axios.get(
          `http://localhost:8000/certificates/${userId}`
        );
        const dataCerts = resCerts.data;

        // 3. Learning Time from localStorage
        let totalSeconds = 0;
        let courseTimes = [];
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(`learningTime_${userId}_`)) {
            const seconds = parseInt(localStorage.getItem(key), 10) || 0;
            totalSeconds += seconds;
            const courseId = key.split("_")[2]; // extract courseId
            courseTimes.push({ courseId, seconds });
          }
        });
        const totalMinutes = Math.floor(totalSeconds / 60);

        // find most learned course
        let mostLearnedCourse = null;
        if (courseTimes.length > 0) {
          const sorted = [...courseTimes].sort((a, b) => b.seconds - a.seconds);
          mostLearnedCourse = sorted[0];
          const Coursename = await axios.get(
            `http://localhost:8000/course/${mostLearnedCourse.courseId}`
          );
          setCourseName(Coursename.data.data.title);
        }

        // 4. Activities
        const resActivities = await axios.get(
          `http://localhost:8000/activities/${userId}`
        );
        const dataActivities = resActivities.data.data || [];
        setActivities(dataActivities);

        // 5. Leaderboard Rank
        const storedRank = localStorage.getItem("userRank");

        // Build user data object
        setUserData({
          name: "Muhammad", // TODO: fetch from profile API later
          courses: dataCourses.data?.length || 0,
          challenges: 12, // static for now
          certificates: dataCerts.data?.length || 0,
          totalMinutes,
          mostLearnedCourse,
          recommendations: [
            { title: "React Hooks Mastery", image: "/assets/react-course.jpg" },
            { title: "Node.js Crash Course", image: "/assets/node-course.jpg" },
          ],
          recentActivity: dataActivities.slice(0, 3), // only 3 activities
          leaderboardRank: storedRank ? parseInt(storedRank, 10) : 0,
        });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      }
    };

    fetchUserDashboard();
  }, [userId]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading Dashboard...
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#334155] p-5 rounded-2xl shadow-lg flex items-center gap-4"
    >
      <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-lg font-semibold text-white">{value}</h2>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-white bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">
      {/* Welcome Header */}
      <motion.div
        className="col-span-full text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
      >
        Welcome back, {userData.name}
      </motion.div>

      {/* Stat Cards */}
      <StatCard
        icon={FaBook}
        title="Courses Enrolled"
        value={userData.courses}
      />
      <StatCard
        icon={FaTasks}
        title="Challenges Completed"
        value={userData.challenges}
      />
      <StatCard
        icon={FaCertificate}
        title="Certificates Earned"
        value={userData.certificates}
      />
      <StatCard
        icon={FaClock}
        title="Total Learning Time"
        value={`${Math.floor(userData.totalMinutes / 60)}h ${
          userData.totalMinutes % 60
        }m`}
      />

      {/* Resume Section */}
      {userData.mostLearnedCourse && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1"
        >
          <div className="flex items-center gap-4">
            <FaPlayCircle size={30} className="text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Continue Course</p>
              <h2 className="font-semibold">{courseName}</h2>
            </div>
          </div>
          <button
            className="mt-4 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() =>
              navigate(`/learning/${userData.mostLearnedCourse.courseId}`)
            }
          >
            Resume
          </button>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1"
      >
        <div className="font-semibold mb-3 text-lg">Recommended for You</div>
        <div className="grid grid-cols-1 gap-3">
          {userData.recommendations.map((course, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[#475569] p-3 rounded-xl"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">{course.title}</span>
                <AiOutlineArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      
      {/* Notifications */}
<motion.div
  whileHover={{ scale: 1.02 }}
  className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1 cursor-pointer"
  onClick={() => navigate("/user/notifications")}
>
  <div className="flex items-center gap-2 font-semibold text-lg mb-3">
    <FaBell /> Notifications
  </div>
  <ul className="text-sm text-gray-300 space-y-2">
    {notifications.length > 0 ? (
      notifications.slice(0, 3).map((n) => (
        <li key={n._id} className={n.read ? "text-gray-400" : "text-white"}>
          • {n.message}
        </li>
      ))
    ) : (
      <li className="text-gray-400">No notifications yet</li>
    )}
  </ul>
  <p className="mt-3 text-blue-400 text-sm">View All →</p>
</motion.div>


      {/* Activity Feed */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1 cursor-pointer"
        onClick={() => navigate("/user/activities")}
      >
        <div className="font-semibold mb-3 text-lg">Recent Activity</div>
        <ul className="text-sm space-y-2">
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
        <p className="mt-3 text-blue-400 text-sm">View All →</p>
      </motion.div>

      {/* Leaderboard Rank */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg flex items-center justify-between col-span-1"
      >
        <div>
          <p className="text-gray-400 text-sm">Your Rank</p>
          <h2 className="text-2xl font-semibold text-white">
            #{userData.leaderboardRank}
          </h2>
        </div>
        <MdLeaderboard size={40} className="text-yellow-400" />
      </motion.div>
    </div>
  );
};
