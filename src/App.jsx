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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard/>}></Route>
        <Route path="mycourses" element={<MyCourses/>}></Route>
        <Route path="certificates" element={<Certificates/>}></Route>
        <Route path="messages" element={<Messages/>}></Route>
        <Route path="raodmap" element={<RoadMap/>}></Route>
        <Route path="leaderboard" element={<LeaderBoard/>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
