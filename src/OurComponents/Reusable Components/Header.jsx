import React, { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import fundLogo from "../../../public/Assets/logo.investor.entity.png";
import TabBar from "./TabBar";
import { FaBars } from "react-icons/fa";
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
  onTabChange,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Dropdown state for small screens

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="ml-6 lg:mr-0 mr-6 lg:mt-0 mt-16 ">
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          {showLogo && (
            <img src={fundLogo} alt="Fund Logo" className="w-1/6 rounded-lg" />
          )}

          <div className="flex flex-col gap-1">
            <h6 className="text-[10px] text-[#6e84a3] uppercase tracking-wider">
              {subheading}
            </h6>
            <h1
              className={`xs:text-2xl text-lg text-color-${theme} sm:font-medium`}
            >
              {heading}
            </h1>
          </div>
        </div>

        {showButton && (
          <Button
            text="Create An Account"
            onClick={onButtonClick}
            className={`bg-color-button-${theme} text-white font-light mr-8 rounded-lg py-6 sm:px-8 px-2 text-xs sm:text-md`}
            iconPosition="left"
          />
        )}

        {showTabBar && (
          <>
            <div className="hidden lg:flex">
              <TabBar
                tabs={[
                  "Dashboard",
                  "KYC/KYB",
                  "KYW",
                  "Transaction Monitoring",
                  "Restricted Lists",
                ]}
                className="font-light py-8"
                onTabChange={onTabChange}
              />
            </div>

            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className={`text-color-${theme} text-sm px-4 py-2`}
              >
                <FaBars size={24} />
              </button>
            </div>

            {isMenuOpen && (
              <div
                className={`lg:hidden absolute  top-24 right-10 mt-2 shadow-lg rounded-md z-10 border border-color-${theme} bg-color-header-${theme} text-color-text-${theme} text-xs`}
              >
                <ul className="flex flex-col items-start">
                  {[
                    "Dashboard",
                    "KYC/KYB",
                    "KYW",
                    "Transaction Monitoring",
                    "Restricted Lists",
                  ].map((tab, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 w-full hover:bg-gray-100"
                      onClick={() => {
                        onTabChange(tab, index);
                        setIsMenuOpen(false); // Close the menu on tab selection
                      }}
                    >
                      {tab}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {showLogo && (
          <img
            src={fundLogo}
            alt="Fund Logo"
            className="w-32 h-16 rounded-lg ml-[-140px]"
          />
        )}
      </div>
      {/* <hr className="w-full border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6" /> */}
    </div>
  );
};

export default Header;
