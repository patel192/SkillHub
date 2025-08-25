import "./App.css";

import { Route, Routes } from "react-router-dom";
import { SignUp } from "./components/pages/SignUp";
import { Login } from "./components/pages/Login";
import { PublicLayout } from "./components/pages/PublicLayout";
import { UserLayout } from "./components/user/UserLayout";
import { UserDashboard } from "./components/user/UserDashboard";
import { MyCourses } from "./components/user/course/MyCourses";
import { Certificates } from "./components/user/certificate/Certificates";
import { Messages } from "./components/user/messages/Messages";
import { RoadMap } from "./components/user/roadmap/RoadMap";
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
import { AvatarCustomization } from "./components/user/AvatarCustomization";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />}></Route>
          <Route path="mycourses" element={<MyCourses />}></Route>
          <Route path="certificates" element={<Certificates />}></Route>
          <Route path="messages" element={<Messages />}></Route>
          <Route path="raodmap" element={<RoadMap />}></Route>
          <Route path="leaderboard" element={<LeaderBoard />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="settings" element={<Settings />}></Route>
          <Route path="course/:courseId" element={<CourseDetails />}></Route>
          <Route path="learn/:courseId" element={<LearningPage />}></Route>
          <Route path="avatar" element={<AvatarCustomization />}></Route>

        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="admindashboard" element={<AdminDashboard />}></Route>
          <Route path="resources" element={<Resources />}></Route>

          <Route path="courses" element={<Courses />}></Route>
          <Route path="users" element={<Users />}></Route>
          <Route path="users/:id" element={<UserDetails />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
