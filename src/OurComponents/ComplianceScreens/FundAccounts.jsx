import React, { useEffect } from "react";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../contexts/themeContext";
import Header from "../Reusable Components/Header";
import FundAccountCard from "../Reusable Components/CardComponent/FundAccountCard";

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
