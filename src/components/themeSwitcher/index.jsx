import React from "react";
import { useTheme } from "../../contexts/themeContext";

const ThemeSwitcher = () => {
  const { toggleTheme, theme } = useTheme();

  const buttonClasses = `text-color-${theme} border-color-${theme} hover:bg-color-${theme}-hover bg-gray-100 hover:text-gray-100 font-bold border p-2 rounded-lg`;

  return (
    <div className="flex flex-row gap-x-2">
      <button className={buttonClasses} onClick={() => toggleTheme("SC")}>
        Theme 1
      </button>
      <button className={buttonClasses} onClick={() => toggleTheme("theme2")}>
        Theme 2
      </button>
      <button className={buttonClasses} onClick={() => toggleTheme("theme3")}>
        Theme 3
      </button>
      <button className={buttonClasses} onClick={() => toggleTheme("Ascent")}>
        Theme 4
      </button>
    </div>
  );
};

export default ThemeSwitcher;
