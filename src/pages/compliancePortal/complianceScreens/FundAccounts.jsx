import React, { useEffect } from "react";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../../contexts/themeContext";
import Header from "../Reusable Components/Header";
import FundAccountCard from "../Reusable Components/CardComponent/FundAccountCard";

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
    <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
      <SideBar portalType="Compliance" />

      <div className="flex flex-col w-full sm:ml-9 h-full pb-10">
        <div className="flex-1 pt-6 sm:px-10 px-4">
          <Header
            heading="Demo Fund"
            subheading="Compliance Portal"
            showLogo={true}
            className="items-center"
            showTabBar={true}
            theme={theme}
          />
        </div>
        <FundAccountCard />
      </div>
    </div>
  );
};

export default FundAccounts;
