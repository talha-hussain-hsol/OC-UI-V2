import React from "react";
import { useTheme } from "../../contexts/themeContext";

const NotificationCard = ({ iconLeft, message, dateTime, iconRight }) => {
  const { theme } = useTheme();
  console.log("theme", theme);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="text-green-500 mr-4">{iconLeft}</div>
        <div>
          <div
            className={`text-color-text-${theme} font-medium text-lg md:text-xs xl:text-lg`}
          >
            {message}
          </div>
          <div className="text-gray-400 md:text-xs xl:text-lg text-lg">
            {dateTime}
          </div>
        </div>
      </div>

      <div className="text-green-500">{iconRight}</div>
    </div>
  );
};

export default NotificationCard;
