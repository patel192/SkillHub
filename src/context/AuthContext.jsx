import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [token, settoken] = useState(null);
  const [loading, setloading] = useState(true);
  const [userId, setuserId] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedUser) {
      settoken(storedToken);
      setuser(JSON.parse(storedUser));
      setuserId(storedUserId);
    }
    setloading(false);
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