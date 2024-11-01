import React, { useEffect } from "react";
import SideBar from "../../../components/sidebar/Sidebar";
import { useTheme } from "../../../contexts/themeContext";
import Header from "../../../components/header/Header";
import FundAccountCard from "../../../components/cardComponent/FundAccountCard";

const FundAccounts = () => {
  const { theme } = useTheme();

  useEffect(() => {

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
