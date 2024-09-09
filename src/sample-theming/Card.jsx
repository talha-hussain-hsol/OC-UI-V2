import React from "react";
import MiniCards from "./MiniCards";
import { useTheme } from "../contexts/themeContext";

const Card = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`bg-color-card-${theme} border-color-${theme} text-color-${theme} rounded-lg p-4 shadow-lg`}
    >
      <div className="flex flex-col gap-6 md:flex-row justify-center mb-5 w-full">
        <div className="w-full md:ml-4">
          <MiniCards theme={theme} />
        </div>
        <div className="w-full md:mr-4">
          <MiniCards theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default Card;
