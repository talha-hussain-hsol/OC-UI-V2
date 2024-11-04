

import React, { useEffect } from "react";
import { useTheme } from "../../../contexts/themeContext";
import FundAccountCard from "../../../components/cardComponent/FundAccountCard";

const FundAccounts = () => {
  const { theme } = useTheme();

  useEffect(() => {
    console.log("Current theme:", theme);

    document.body.style.backgroundColor =
      theme === "SC"
        ? "#ffffff"
        : theme === "Ascent"
        ? "rgba(18, 38, 63)"
        : theme === "lightTheme"
        ? "#000000"
        : "";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);
  return (
    
        <FundAccountCard />
      
  );
};

export default FundAccounts;
