import { createContext, useRef, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
const INACTIVE_TIME = 30 * 60 * 1000;
export const AuthProvider = ({ children }) => {
  const timerRef = useRef(null);
  const [user, setuser] = useState(null);
  const [token, settoken] = useState(null);
  const [loading, setloading] = useState(true);
  const [userId, setuserId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken) {
      settoken(storedToken);
    }
    if (storedUser) {
      setuser(JSON.parse(storedUser));
    }
    if (storedUserId) {
      setuserId(storedUserId);
    }
    setloading(false);
  }, []);
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer();
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
        clearTimeout(timerRef.current);
      });
    };
  }, []);
  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setuser(userData);
    settoken(jwtToken);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setuser(null);
    setuserId(null);
    settoken(null);
    window.location.href = "/login";
  };
  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log("User inactive for 30 minutes,logging out...");
      logout();
    }, INACTIVE_TIME);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userId,
        role: user?.role,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
