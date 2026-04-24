import { useSelector } from "react-redux";

export const GlobalLoader = () => {
  const loading = useSelector(
    (state) => state.ui?.loading
  );

  if (!loading) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      Loading...
    </div>
  );
};