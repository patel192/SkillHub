import "./App.css";
import { LandingPage } from "./components/pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import { SignUp } from "./components/pages/SignUp";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
      </Routes>
    </>
  );
}

export default App;
