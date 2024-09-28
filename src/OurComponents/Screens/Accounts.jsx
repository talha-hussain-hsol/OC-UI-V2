import React, { useEffect } from "react";
import SideBar from "../Reusable Components/SideBar";
import Header from "../Reusable Components/Header";
import AccountCard from "../Reusable Components/CardComponent/AccountCard";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/themeContext";

const Accounts = () => {
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
  const navigate = useNavigate();
  function handleClick() {
    navigate("/fund-code");
  }

  return (
    <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
      <SideBar portalType="Customer" />
      <div className="flex-1 py-6 lg:ml-9 lg:px-10 px-2">
        <Header
          heading="My Accounts"
          subheading="Overview"
          showButton={true}
          onButtonClick={handleClick}
          theme={theme}
        />
        <hr className=" border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 lg:ml-0 ml-6 sm:mr-6 lg:mr-0 mr-6" />
        <AccountCard />
        <AccountCard />
        <AccountCard />
      </div>
    </div>
  );
};

export default Accounts;
