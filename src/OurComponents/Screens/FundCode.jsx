import React,{useState} from "react";
import { useTheme } from "../../contexts/themeContext";
import { FiSearch } from "react-icons/fi";


const FundCode = () => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div
      className={`bg-color-card-${theme} w-full rounded-lg border-color-${theme} border-[1px] shadow-${theme} mb-6 py-8 px-20 flex flex-col gap-4 items-center`}
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
          className={`bg-color-textfield-dropdown-${theme} w-full p-3 pl-8 rounded-full border border-color-dropdown-${theme} shadow-${theme} focus:outline-none `}
        />
        
        <button
          disabled={!inputValue}
          className={`absolute right-[1px] top-[1px] py-4 px-8 rounded-r-full  ${
            inputValue ? "bg-green-500" : "bg-green-500 opacity-80"
          } text-white`}
        >
          <FiSearch className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FundCode;
