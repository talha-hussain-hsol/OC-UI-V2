import React from "react";
import Button from "../ui/button/Button";
import { useTheme } from "../../contexts/themeContext";

const CardHeader = ({
  FundName,
  fundClassName = "",
  showButton = true,
  BtnText,
  showLogo = true,
  logoUrl,
  logoClassname = "",
  className = "",
  middleContent = null,
  rightContent = null,
  BtnClassName,
  onClick,
  showField = false,
  fieldClassname = "",
  fieldPlaceholder = "",
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme}  py-2 px-8 flex justify-between h-full w-full ${className}`}
    >
      <div className="flex flex-row justify-center gap-1 my-2 items-center">
        {showLogo &&
          logoUrl && ( // Check if logoUrl exists before rendering the image
            <img
              src={logoUrl} // Use logoUrl from props
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
          <Button text={BtnText} className={BtnClassName} onClick={onClick} />
        )}
        {showField && (
          <input
            type="text"
            placeholder={fieldPlaceholder}
            className={`bg-color-textfield-${theme} text-white p-2  rounded-md border border-[#1c3758] placeholder-[#6e84a3] text-sm ${fieldClassname}`}
          />
        )}
      </div>
    </div>
  );
};

export default CardHeader;