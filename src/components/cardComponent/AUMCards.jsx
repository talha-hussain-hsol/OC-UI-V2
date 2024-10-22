import React from "react";
import { useTheme } from "../../contexts/themeContext";

const AUMCard = ({ date, amount, icon, text }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex  md:w-[98%] items-center p-[28px] bg-gradient-card-${theme} rounded-lg w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}
    >
      <div className=" bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
        {icon}
      </div>

      <div className="ml-6">
        <p className="text-white uppercase text-sm ">
          {text}
          <span className="text-xs text-gray-300">{date}</span>
        </p>
        <p className="text-white text-md mt-1">USD {amount}</p>
      </div>
    </div>
  );
};

export default AUMCard;
