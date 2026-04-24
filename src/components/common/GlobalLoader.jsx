import React from "react";
import { useSelector } from "react-redux";
export const GlobalLoader = () => {
  const loading = useSelector((state) => state.ui.loading);
  if (!loading) return null;
  return (
    <div
    style={{
        position:"fixed",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        background:"rgba(0,0,0,0.4)",
        display:"flex",
        justifyContent:"center",
        zIndex:9999,
    }}
    >
      <div>GlobalLoader</div>
    </div>
  );
};
