import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import fundLogo from "../../../public/Assets/logo.investor.entity.png";
import TabBar from "./TabBar";

// import { useTheme } from "../../contexts/themeContext";
import { useTheme } from "../../contexts/themeContext";

const Header = ({
  subheading,
  heading,
  showButton,
  onButtonClick,
  showLogo,
  showTabBar,
  theme,
  className,
}) => {
  const navigate = useNavigate();

  // function handleClick() {
  //   navigate("/stepper")
  //   console.log("Button Clicked")
  // }
  return (
    <div className="ml-6 sm:mt-0 mt-10 ">
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          {showLogo && (
            <img src={fundLogo} alt="Fund Logo" className="w-1/6 rounded-lg" />
          )}

          <div className="flex flex-col gap-1">
            <h6 className="text-[10px] text-[#6e84a3] uppercase tracking-wider ">
              {subheading}
            </h6>
            <h1
              className={`sm:text-2xl text-xs text-color-${theme} sm:font-medium`}
            >
              {heading}
            </h1>
          </div>
        </div>

        {showButton && (
          <Button
            text="Create An Account"
            onClick={onButtonClick}
            className={`bg-color-button-${theme} text-white font-light mr-8 rounded-lg py-6 px-8 text-sm sm:text-md`}
            iconPosition="left"
          />
        )}
        {showTabBar && (
          <TabBar
            tabs={[
              "Dashboard",
              "KYC/KYB",
              "KYW",
              "Transaction Monitoring",
              "Restricted Lists",
            ]}
            className="font-light py-8"
          />
        )}
        {showLogo && (
          <img
            src={fundLogo}
            alt="Fund Logo"
            className="w-32 h-16 rounded-lg ml-[-140px]"
          />
        )}
      </div>
      <hr className=" w-full border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 " />
    </div>
  );
};

export default Header;
