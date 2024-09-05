import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Header = ({ subheading, heading, showButton, onButtonClick }) => {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/stepper");
  }
  return (
    <div className="ml-6 sm:mt-0 mt-10 ">
      <div className="flex items-center justify-between ">
        {/* Left Side: Subheading and Heading */}
        <div className="flex flex-col gap-1">
          <h6 className="text-[10px] text-[#6e84a3] uppercase tracking-wider ">
            {subheading}
          </h6>
          <h1 className="sm:text-2xl text-xs text-white sm:font-medium ">
            {heading}
          </h1>
        </div>

        {showButton && (
          // <button
          //   className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 my-[35px] w-[10%]"
          //   onClick={onButtonClick}
          // >
          //   Create an Account
          // </button>

          <Button
            text="Create An Account"
            onClick={handleClick}
            className="bg-[#2c7be5] text-white font-light mr-8 rounded-lg py-6 px-8 text-sm sm:text-md"
            // icon={<FaCreditCard />}
            iconPosition="left"
          />
        )}
      </div>
      <hr className=" w-full border-t-[1px] border-t-[#6e84a3] opacity-20 my-6" />
    </div>
  );
};

export default Header;
