import React from "react";
import { useTheme } from "../../../contexts/themeContext";

const IconButton = ({ icon, onClick, className }) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-12 h-12 rounded-md border-[1px] border-color-iconButton-${theme} text-xl ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
