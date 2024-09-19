import React from "react";

const Tooltip = ({ content, children, position = "right" }) => {
  const tooltipPositionClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    right: "left-[36px] ml-2 top-1/2 transform -translate-y-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
  };

  const arrowPositionClasses = {
    top: "top-[30px] left-1/2 transform -translate-x-1/2 rotate-[-90deg]",
    right: "top-1/2 left-[-4px] transform -translate-y-1/2",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 rotate-0",
    left: "top-1/2 right-[-4px] transform -translate-y-1/2 rotate-180",
  };
  return (
    <div className="relative cursor-pointer group flex items-center">
    <div>{children}</div>
    <div
      className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#152e4d] text-white text-xs rounded-md py-2 px-3 whitespace-nowrap z-10 pointer-events-none ${tooltipPositionClasses[position]}`}
    >
      {content}
      <div
        className={`absolute w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent ${arrowPositionClasses[position]} border-r-[#152e4d]`}
      ></div>
    </div>
  </div>
  );
};

export default Tooltip;
