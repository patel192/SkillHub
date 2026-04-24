import React from "react";
import { useSelector } from "react-redux";
export const GlobalLoader = () => {
  const state = useSelector((state) => state);

  console.log("Redux state:", state);
  return <div>Loader Mounted</div>;
};
