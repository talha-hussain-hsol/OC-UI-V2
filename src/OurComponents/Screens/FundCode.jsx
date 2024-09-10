import React,{useState} from "react";
import { useTheme } from "../../contexts/themeContext";
import { FiSearch } from "react-icons/fi";
import SideBar from "../Reusable Components/SideBar";
import { useNavigate } from "react-router-dom";



const FundCode = () => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const navigate = useNavigate();

  function handleClick() {
    console.log("Button clicked");
    navigate("/stepper");
  }
  return (
    <>
    
    <SideBar portalType="Customer" />
    <div
      className={`bg-color-card-${theme} h-screen border-color-${theme} border-[1px] shadow-${theme} ml-16 py-8 px-20 flex flex-col gap-4 items-center`}
    >
      <h3 className={`text-color-${theme} text-2xl`}>
        Let's start with the basics.
      </h3>
      <p className={`text-color-${theme}`}>
        Please enter the account joining code which you would have received from
        the account owner.
      </p>

      {/* Search Bar Container */}
      <div className="relative w-full mt-4">
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
          <FiSearch  className="w-4 h-4" />
        </button>
      </div>
    </div>
    </>
  );
};

export default FundCode;
