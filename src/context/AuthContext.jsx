import {jwtDecode} from "jwt-decode";
import {
  createContext,
  useCallback,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
const INACTIVE_TIME = 30 * 60 * 1000;
export const AuthProvider = ({ children }) => {
  const timerRef = useRef(null);
  const [user, setuser] = useState(null);
  const [token, settoken] = useState(null);
  const [loading, setloading] = useState(true);
  const [userId, setuserId] = useState(null);
  const navigate = useNavigate();
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
      });
      clearTimeout(timerRef.current);
    };
  }, []);
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const remainingTime = expiryTime - Date.now();
      if (remainingTime <= 0) {
        console.log("Token Expired,Logging out...");
        logout();
        return;
      }
      const timer = setTimeout(() => {
        console.log("Token Expired");
        logout();
      }, remainingTime);
      return () => clearTimeout(timer);
    } catch (err) {
      console.log("Invalid Token");
      logout();
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData.id);
    setuser(userData);
    settoken(jwtToken);
    setuserId(userData.id);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setuser(null);
    setuserId(null);
    settoken(null);
    navigate("/login");
  };
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log("User inactive for 30 minutes,logging out...");
      logout();
    }, INACTIVE_TIME);
  }, []);
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
