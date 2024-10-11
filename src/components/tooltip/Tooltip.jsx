import React from "react";
import { useTheme } from "../../contexts/themeContext";

const Tooltip = ({ content, children, position = "right" }) => {
  const { theme } = useTheme();
  const positionClasses = {
    upper: "bottom-full mb-3 left-[-2px] transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className="relative cursor-pointer group flex items-center z-10">
      <div>{children}</div>
      <div
        className={`absolute opacity-0 left-full ml-7 group-hover:opacity-100 transition-opacity duration-200 bg-color-sidebar-${theme} text-color-text-${theme} text-xs rounded-md py-2 px-3 whitespace-nowrap z-10 pointer-events-none ${positionClasses[position]}`}
      >
        {content}
        <div
          className={`absolute w-0 h-0  border-r-4 border-t-4 border-b-4 border-transparent`}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;
