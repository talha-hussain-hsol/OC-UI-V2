import React from "react";
import fundLogo from "../../Assets/logo.investor.entity.png";
import Button from "../Button";

const CardHeader = ({
  FundName,
  fundClassName = "",
  showButton = true,
  BtnText,
  showLogo = true,
  logoClassname = "",
  className = "",
  middleContent = null,
  rightContent = null,
  BtnClassName,
  onClick, // New onClick prop
  showField = false,
  fieldClassname = "",
  fieldPlaceholder = "",
}) => {
  return (
    <div
      className={` bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-t-md border-[#1b3050] border-b-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-2 px-8 flex justify-between h-full w-full ${className}`}
    >
      <div className="flex items-center gap-1 my-2">
        {showLogo && (
          <img
            src={fundLogo}
            alt="Fund Logo"
            className={`w-10 h-auto rounded-md ${logoClassname}`}
          />
        )}
        <h3 className={`font-medium ${fundClassName}`}>{FundName}</h3>
      </div>

      {middleContent && <div className="flex">{middleContent}</div>}

      <div className="flex items-start">
        {rightContent && <div>{rightContent}</div>}

        {showButton && (
          <Button
            text={BtnText}
            className={BtnClassName}
            onClick={onClick} // Dynamic onClick passed from parent
          />
        )}
        {showField && (
          <input
            type="text"
            placeholder={fieldPlaceholder}
            className={`bg-[#043f63] text-white p-2 shadow-[0px_6px_20px_rgba(0,0,0,0.9)] rounded-md border border-[#1c3758] placeholder-[#6e84a3] text-sm ${fieldClassname}`}
          />
        )}
      </div>
    </div>
  );
};

export default CardHeader;
