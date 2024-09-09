import React from "react";
import SideBar from "../Reusable Components/SideBar";
import Header from "../Reusable Components/Header";
import AccountCard from "../Reusable Components/CardComponent/AccountCard";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/themeContext";

const Accounts = () => {
  const { theme } = useTheme();

  const navigate = useNavigate();
  function handleClick() {
    navigate("/stepper");
  }

  return (
    <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
      <SideBar portalType="Customer" />
      <div className="flex-1 py-6 sm:ml-9 sm:px-10 px-4">
        <Header
          heading="My Accounts"
          subheading="Overview"
          showButton={true}
          onButtonClick={handleClick}
          theme={theme}
        />

        <AccountCard />
        <AccountCard />
        <AccountCard />
      </div>
    </div>
  );
};

export default Accounts;
