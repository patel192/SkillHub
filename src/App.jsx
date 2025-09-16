import axios from "axios";
import "./App.css"
import { Route, Routes } from "react-router-dom";
import { SignUp } from "./components/pages/SignUp";
import { Login } from "./components/pages/Login";
import { PublicLayout } from "./components/pages/PublicLayout";
import { UserLayout } from "./components/user/UserLayout";
import { UserDashboard } from "./components/user/UserDashboard";
import { MyCourses } from "./components/user/course/MyCourses";
import { Certificates } from "./components/user/certificate/Certificates";
import { Messages } from "./components/user/messages/Messages";

import { LeaderBoard } from "./components/user/leaderboard/LeaderBoard";
import { Profile } from "./components/user/Profile";
import { Settings } from "./components/user/Settings";
import { CourseDetails } from "./components/user/course/CourseDetails";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Courses } from "./components/admin/course/Courses";
import { Users } from "./components/admin/users/Users";
import UserDetails from "./components/admin/users/UserDetails";
import { Resources } from "./components/admin/resource/Resources";
import { LearningPage } from "./components/user/course/LearningPage";
import { Community } from "./components/user/communities/Community";
import { CommunityDetails } from "./components/user/communities/CommunityDetails";
import { Toaster } from "react-hot-toast";
import { Activities } from "./components/user/activity/Activities";
import { Notifications } from "./components/user/notification/Notifications";
import { Report } from "./components/user/report/Report";
import { Reports } from "./components/admin/report/Reports";
import { ReportsDetail } from "./components/admin/report/ReportsDetail";
import { AdminCommunityDetails } from "./components/admin/community/AdminCommunityDetails";
import { AdminCourseDetails } from "./components/admin/course/AdminCourseDetails";
import { CourseLessons } from "./components/admin/resource/CourseLessons";
import { CourseQuiz } from "./components/admin/resource/CourseQuiz";
import { EditCourse } from "./components/admin/course/EditCourse";
import { AddCourse } from "./components/admin/course/AddCourse";

function App() {
  const token = localStorage.getItem("token")
  axios.defaults.baseURL = "https://skillhub-backend-4982.onrender.com" 
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard token={token} />}></Route>
          <Route
            path="communities"
            element={<Community basePath="user" token={token} />}
          ></Route>
          <Route path="community/:id" element={<CommunityDetails />}></Route>
          <Route path="mycourses" element={<MyCourses token={token} />}></Route>
          <Route path="certificates" element={<Certificates />}></Route>
          <Route path="messages" element={<Messages token={token} />}></Route>
          <Route path="leaderboard" element={<LeaderBoard token={token} />}></Route>
          <Route path="profile" element={<Profile token={token} />}></Route>
          <Route path="settings" element={<Settings />}></Route>
          <Route path="course/:courseId" element={<CourseDetails token={token} />}></Route>
          <Route path="learn/:courseId" element={<LearningPage token={token}/>}></Route>
          <Route path="activities" element={<Activities token={token}/>}></Route>
          <Route path="notifications" element={<Notifications token={token} />}></Route>
          <Route path="report" element={<Report token={token} />}></Route>
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="admindashboard" element={<AdminDashboard token={token} />}></Route>
          <Route path="resources" element={<Resources token={token} />}></Route>
          <Route path="resources/:courseId" element={<CourseLessons token={token} />}></Route>
          <Route path="quiz/:courseId" element={<CourseQuiz token={token} />}></Route>

          <Route path="courses" element={<Courses token={token} />}></Route>
          <Route path="courses/:id" element={<AdminCourseDetails token={token} />}></Route>
          <Route path="courses/edit/:id" element={<EditCourse token={token} />}></Route>
          <Route path="courses/new" element={<AddCourse token={token} />}></Route>
          <Route path="users" element={<Users token={token} />}></Route>
          <Route path="users/:id" element={<UserDetails token={token} />}></Route>
          <Route path="reports" element={<Reports token={token} />}></Route>
          <Route path="reports/:id" element={<ReportsDetail token={token} />}></Route>
          <Route
            path="communities"
            element={<Community basePath="admin"/>}
          ></Route>
          <Route
            path="community/:id"
            element={<AdminCommunityDetails basePath="admin"/>}
          ></Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
