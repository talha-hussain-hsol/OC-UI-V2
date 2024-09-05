import React from "react";
import UserIcon from "../../Assets/UserIcon.jpg";

const MiniCards = ({
  leftContent,
  rightContent,
  showUserIcon = true,
  showLeft = true,
  showRight = true,
  leftClassName = "",
  rightClassName = "",
}) => {
  return (
    <div>
      <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-lg border-[#1b3050] border-[1px] shadow-[2px_4px_20px_rgba(0,0,0,0.9)] py-2 px-4 w-full">
        <div className="flex flex-col md:flex-row justify-between gap-1 w-full">
          {showLeft && (
            <div className={`flex gap-4 w-full ${leftClassName}`}>
              {showUserIcon && (
                <div className="flex items-center space-x-4">
                  <img
                    src={UserIcon}
                    alt="User Icon"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              )}
              <div>{leftContent}</div>
            </div>
          )}
          {showRight && (
            <div className={`flex flex-col w-full ${rightClassName}`}>
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCards;
