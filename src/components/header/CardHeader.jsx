import React from "react";
import Button from "../ui/button/Button";
import { useTheme } from "../../contexts/themeContext";
import IconButton from "../ui/button/IconButton";
import { TbDeviceHeartMonitorFilled } from "react-icons/tb";
import { FaBoxArchive, FaEye } from "react-icons/fa6";
import { IoIosSwitch } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Tooltip from "../tooltip/Tooltip";

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
  iconButton,
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
        <h3 className={`font-light ${fundClassName}`}>{FundName}</h3>
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
        {iconButton && (
          <div className="flex gap-3">
            <Tooltip content="Sign Agreement" position="upper">
              <IconButton
                icon={<TbDeviceHeartMonitorFilled color="#b2c8d6" size={30} />}
                className={`hover:bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme}`}
              />
            </Tooltip>
            <Link
              to={`/profile/detail/7a50549e-6cbb-402a-b0dd-754960650067/724ac18b-3999-4922-bf1f-9e7cff67fc1c`}
            >
              <Tooltip content="Account Details" position="upper">
                <IconButton
                  icon={<FaEye color="#2c7be5" size={24} />}
                  className={`hover:bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme}`}
                />
              </Tooltip>
            </Link>
            <Tooltip content="Transfer" position="upper">
              <IconButton
                icon={<FaBoxArchive color="#ffa502" size={24} />}
                className={`hover:bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme}`}
              />
            </Tooltip>
            <Tooltip content="Switch" position="upper">
              <IconButton
                icon={<IoIosSwitch color="#b2c8d6" size={24} />}
                className={`hover:bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme}`}
              />
            </Tooltip>
            <Tooltip content="Delete" position="upper">
              <IconButton
                icon={<MdDelete color="#ff0000" size={24} />}
                className={`hover:bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme}`}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
