import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../redux/features/auth/authSlice";
import { fetchSettings } from "../../redux/features/settings/settingsSlice";

const INACTIVE_TIME = 30 * 60 * 1000;

export const AuthListener = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const timerRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    window.location.href = "/login";
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log("User inactive for 30 minutes, logging out...");
      handleLogout();
    }, INACTIVE_TIME);
  }, [handleLogout]);

  useEffect(() => {
    if (!token) return;

    // Settings fetch
    if (user && (user._id || user.id)) {
        dispatch(fetchSettings(user._id || user.id));
    }

    // Token Expiration Logic
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const remainingTime = expiryTime - Date.now();
      if (remainingTime <= 0) {
        console.log("Token Expired, Logging out...");
        handleLogout();
        return;
      }
      const timer = setTimeout(() => {
        console.log("Token Expired");
        handleLogout();
      }, remainingTime);
      return () => clearTimeout(timer);
    } catch (err) {
      console.log("Invalid Token");
      handleLogout();
    }
  }, [token, user, dispatch, handleLogout]);

  useEffect(() => {
    if (!token) return;

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
  }, [token, resetTimer]);

  return null;
};
