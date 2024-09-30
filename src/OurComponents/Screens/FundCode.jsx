import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/themeContext";
import { FiSearch } from "react-icons/fi";
import SideBar from "../Reusable Components/SideBar";
import { useNavigate } from "react-router-dom";
import Button from "../Reusable Components/Button";

const FundCode = () => {
  const { theme } = useTheme();

  const [inputValue, setInputValue] = useState("");
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
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const navigate = useNavigate();

  function handleClick() {
    console.log("Button clicked");
    navigate("/stepper");
  }
  function handleNext() {
    navigate("/stepper");
  }
  function handlePrev() {
    navigate("/accounts");
  }
  return (
    <>
      <SideBar portalType="Customer" />
      <div
        className={`bg-color-${theme} h-screen border-color-${theme} border-[1px] shadow-${theme}  py-20 px-16 flex flex-col  items-center`}
      >
        <div
          className={`bg-gradient-stepper-card-${theme}  border-color-${theme} border-[1px] shadow-${theme} rounded-lg w-full ml-16 pt-20 pb-4 px-20 flex flex-col gap-4 items-center`}
        >
          <h3 className={`text-white text-2xl`}>
            Let's start with the basics.
          </h3>
          <p className={`text-white`}>
            Please enter the account joining code which you would have received
            from the account owner.
          </p>

          {/* Search Bar Container */}
          <div className="relative w-full mt-4 mb-10">
            <input
              type="text"
              placeholder="Enter the account code"
              value={inputValue}
              onChange={handleInputChange}
              className={`bg-color-textfield-dropdown-${theme} text-color-text-${theme} w-full p-3 pl-8 rounded-full border border-color-dropdown-${theme} shadow-${theme} focus:outline-none `}
            />

            <button
              disabled={!inputValue}
              className={`absolute right-[1px] top-[1px] py-4 px-8 rounded-r-full  ${
                inputValue ? "bg-green-500" : "bg-green-500 opacity-80"
              } text-white`}
              onClick={handleClick}
            >
              <FiSearch className="w-4 h-4" />
            </button>
          </div>
          <hr className="w-full border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
          <div className="flex lg:space-x-[75%] md:justify-between sm:justify-center w-full p-4">
            <Button
              text="Cancel"
              className={`py-6 px-8 border b-white hover:border-0 rounded-lg text-white focus:outline-none`}
              onClick={handlePrev}
              // disabled={currentStep === 1}
            />
            <Button
              text="Next"
              className={`bg-color-button-${theme} py-6 px-8 rounded-lg text-white`}
              onClick={() => handleNext()}
              // disabled={currentStep === steps.length}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FundCode;
