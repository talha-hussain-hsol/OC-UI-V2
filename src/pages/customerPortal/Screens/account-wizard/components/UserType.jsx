import React, { useState } from "react";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { useTheme } from "../../../../../contexts/themeContext";

const UserType = ({ onSelection }) => {  // Accept onSelection as a prop
  const { theme } = useTheme();
  const [userType, setUserType] = useState("");

  const handleSelection = (type) => {
    setUserType(type);
    onSelection(type); 
  };

  return (
    <>
    
    <div
      className={`w-full flex flex-col items-center bg-transparent font-${theme} text-${theme}`}
    >
      <h3 className={`text-color-h3-${theme} text-2xl font-light mt-6`}>
        Let's start with the basics.
      </h3>
      <p className="text-slate-500 text-xs font-light mt-2">
        Please select if you are applying as an individual or corporate. You may
        attach an existing identity or create a new one.
      </p>

      <div
        className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] w-[80%] mt-8 items-center`}
      >
        <div className="flex items-center ml-2">
          <img
            src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
            alt="Image"
            className="w-15 h-12 mr-2 rounded-[3px]"
          />
          <h2 className={`text-color-${theme} text-sm font-normal`}>
            Demo Fund
          </h2>
        </div>
        <div className={`text-color-${theme} ml-[20%] text-xs font-light`}>
          <p className="flex items-center">
            <IoCheckmarkDoneCircleOutline
              className={`text-color-button1-${theme}`}
            />{" "}
            Fund's KYC: Accepted
          </p>
          <p className="text-slate-500 flex items-center">
            <IoCheckmarkDoneCircleOutline
              className={`text-color-button1-${theme}`}
            />{" "}
            Fund Domicile: Singapore
          </p>
        </div>
        <div className={`text-color-${theme} ml-[20%] text-xs font-light`}>
          <p className="flex items-center">
            <FaRegClock className={`text-color-button1-${theme}`} /> Dealing
            Cycle: Interval
          </p>
          <p className="text-slate-500 flex items-center">
            <IoCheckmarkDoneCircleOutline
              className={`text-color-button1-${theme}`}
            />{" "}
            Digital Fund: Active
          </p>
        </div>
      </div>

      <div
        className={`bg-color-card-${theme} rounded-lg shadow-lg h-[20%] w-[80%] mt-8`}
      >
        <div
          className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}
        >
          <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
            Account Description
          </p>
        </div>
        <p className={`text-color-${theme} text-xs font-light p-3`}>Demo</p>
      </div>

      <div
        className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] mt-4 w-[80%]`}
      >
        <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
          Reference Documents
        </p>
      </div>

      <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

      <div className="flex w-[80%]">
        <div className="w-[50] mr-[20%]">
          <p className={`text-color-${theme} text-sm`}>
            Are you applying as an Individual or Corporate?
          </p>

          <div className="flex mt-4">
            <button
              onClick={() => handleSelection("individual")}
              className={`flex-1 py-2 rounded-l-full text-white ${
                userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
              } hover:bg-[#3e9b3e] focus:outline-none`}
            >
              Individual
            </button>
            <button
              onClick={() => handleSelection("corporate")}
              className={`flex-1 py-2 rounded-r-full text-white ${
                userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
              } hover:bg-[#3e9b3e] focus:outline-none`}
            >
              Corporate
            </button>
          </div>
        </div>
        <div className="flex w-[50]">
          <p className={`text-color-${theme} text-sm`}>
            How would you like to create your identity?
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserType;
