import React from "react";

const Tooltip = ({ content, children }) => {
  return (
    <div className="relative cursor-pointer group flex items-center">
      <div>{children}</div>
      <div className="absolute left-full ml-7 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#152e4d] text-white text-xs rounded-md py-2 px-3 whitespace-nowrap z-10 pointer-events-none">
        {content}
        <div className="absolute top-1/2 left-[-4px] transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-[#152e4d]"></div>
      </div>
    </div>
  );
};

export default Tooltip;
