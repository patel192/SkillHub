import "./App.css";

import { Route, Routes } from "react-router-dom";
import { SignUp } from "./components/pages/SignUp";
import { Login } from "./components/pages/Login";
import { PublicLayout } from "./components/pages/PublicLayout";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="login" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;
