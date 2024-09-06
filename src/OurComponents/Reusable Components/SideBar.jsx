import React, { useState, useEffect, useRef } from "react";
import Logo from "../../../public/Assets/OneConstellation.png";
import { RxDashboard } from "react-icons/rx";
import { TbUsers, TbSwitch } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { MdOutlineFileDownload } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdOutlineAccountTree } from "react-icons/md";
import { PiCompass } from "react-icons/pi";
import Tooltip from "./Tooltip";
import { AiOutlineMenu } from "react-icons/ai";
import { MdInvertColors } from "react-icons/md";
import { useTheme } from "../../contexts/themeContext";

const SideBar = ({ portalType }) => {
  const { toggleTheme, theme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      toggleTheme(storedTheme);
    }
  }, []);
  
 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThemeSidebarOpen, setIsThemeSidebarOpen] = useState(false);
  const [lightThemeEnabled, setLightThemeEnabled] = useState(false);
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(false);
  const [standardCharteredEnabled, setStandardCharteredEnabled] =
    useState(false);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleThemeSidebar = () => {
    setIsThemeSidebarOpen(!isThemeSidebarOpen);
  };

  const handleThemeSwitch = (theme) => {
    localStorage.setItem("theme", theme);
    toggleTheme(theme);
    switch (theme) {
      case "light":
        toggleTheme('light')
        setLightThemeEnabled(!lightThemeEnabled);
        setDarkThemeEnabled(false);
        setStandardCharteredEnabled(false);
        break;
      case "dark":
        toggleTheme('dark')
        setDarkThemeEnabled(!darkThemeEnabled);
        setLightThemeEnabled(false);
        setStandardCharteredEnabled(false);
        break;
      case "standardChartered":
        toggleTheme('theme1')
        setStandardCharteredEnabled(!standardCharteredEnabled);
        setLightThemeEnabled(false);
        setDarkThemeEnabled(false);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);
  return (
    <>
      {/* {/ Hamburger Menu Button /} */}
      <button
        className="fixed top-4 left-4 z-50 text-white p-2 focus:outline-none lg:hidden"
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={24} />
      </button>

      <div
        className={`bg-[#152e4d] h-screen w-16 fixed flex flex-col items-center md:hidden sm:hidden xs:hidden py-6 ${
          !isSidebarOpen ? "lg:flex" : "lg:hidden"
        }`}
      >
        <img src={Logo} alt="One Constellation Logo" className="w-6" />
        <div className="flex flex-col gap-6 items-center mt-8">
          {portalType === "Compliance" && (
            <>
              <Tooltip content="Domains">
                <Link to="">
                  <RxDashboard
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Customers">
                <Link to="">
                  <TbUsers
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Switch">
                <Link to="">
                  <TbSwitch
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Settings">
                <Link to="">
                  <CiSettings
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Ageing Report">
                <Link to="">
                  <MdOutlineFileDownload
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Consumption Report">
                <Link to="">
                  <MdOutlineFileDownload
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
            </>
          )}
          {portalType === "Customer" && (
            <>
              <Tooltip content="Dashboard">
                <Link to="/">
                  <FiHome
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Documents">
                <Link to="/documents">
                  <IoDocumentsOutline
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Accounts">
                <Link to="/accounts">
                  <MdOutlineAccountTree
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Identities">
                <Link to="/identities">
                  <TbUsers
                    size={14}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Walkthrough">
                <Link to="">
                  <PiCompass
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
            </>
          )}
          {portalType === "Manager" && (
            <>
              <Tooltip content="Domains">
                <Link to="">
                  <RxDashboard
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Switch">
                <Link to="">
                  <TbSwitch
                    size={18}
                    className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                  />
                </Link>
              </Tooltip>
            </>
          )}
        </div>
        {/* {/ Bottom Section for larger screens /} */}
        <div className="flex flex-col items-center gap-6 mt-auto">
          <div className="flex flex-col items-center mt-auto">
            <button
              onClick={toggleThemeSidebar}
              className="text-[#6e84a3] hover:text-white transition-colors duration-200"
            >
              <MdInvertColors size={18} />
            </button>
            {isThemeSidebarOpen && (
              <div className="absolute left-14 border-[#132141] border w-60 bottom-32 z-20 text-sm bg-[#152e4d] text-[#6e84a3] shadow-md p-2 rounded-md">
                <ul>
                  <li className="flex justify-between items-center cursor-pointer hover:text-white p-2">
                    Light
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lightThemeEnabled}
                        onChange={() => handleThemeSwitch("light")}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                    </label>
                  </li>
                  <li className="flex justify-between items-center cursor-pointer hover:text-white p-2">
                    Dark
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkThemeEnabled}
                        onChange={() => handleThemeSwitch("dark")}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                    </label>
                  </li>
                  <li className="flex justify-between items-center cursor-pointer hover:text-white p-2">
                    Standard Chartered
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={standardCharteredEnabled}
                        onChange={() => handleThemeSwitch("standardChartered")}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                    </label>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {portalType !== "Manager" && (
            <Tooltip content="Notifications">
              <Link to="">
                <FaRegBell
                  size={18}
                  className="text-[#6e84a3] hover:text-white transition-colors duration-200"
                />
              </Link>
            </Tooltip>
          )}

          <div className="bg-[#244166] rounded-full text-sm text-white w-10 h-10 flex items-center justify-center">
            <p>U</p>
          </div>
        </div>
      </div>

      {/* {/ Sidebar for smaller screens (hamburger menu) /} */}
      <div
        className={`fixed top-0 left-0 w-full bg-[#152e4d] transition-transform transform ${
          isSidebarOpen ? "translate-y-0" : "-translate-y-full"
        } lg:hidden flex flex-col items-center p-4`}
      >
        <div className="flex items-center justify-between w-full mb-6">
          <img src={Logo} alt="One Constellation Logo" className="w-10" />
          <button
            className="text-white p-2 focus:outline-none"
            onClick={toggleSidebar}
          >
            ✕
          </button>
        </div>

        {/* {/ Centered Content Section /} */}
        <div className="flex flex-col gap-4 items-center w-full">
          {portalType === "Compliance" && (
            <>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <RxDashboard size={18} />
                <span>Domains</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <TbUsers size={18} />
                <span>Customers</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <TbSwitch size={18} />
                <span>Switch</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <CiSettings size={18} />
                <span>Settings</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <MdOutlineFileDownload size={18} />
                <span>Ageing Report</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <MdOutlineFileDownload size={18} />
                <span>Consumption Report</span>
              </Link>
            </>
          )}
          {portalType === "Customer" && (
            <>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <FiHome size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <IoDocumentsOutline size={18} />
                <span>Documents</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <MdOutlineAccountTree size={18} />
                <span>Accounts</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <TbUsers size={14} />
                <span>Identities</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <PiCompass size={18} />
                <span>Walkthrough</span>
              </Link>
            </>
          )}
          {portalType === "Manager" && (
            <>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <RxDashboard size={18} />
                <span>Domains</span>
              </Link>
              <Link
                to=""
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <TbSwitch size={18} />
                <span>Switch</span>
              </Link>
            </>
          )}
        </div>

        {/* {/ Bottom Section for smaller screens /} */}
        <div className="flex flex-col items-center gap-6 mt-4 w-full">
          {portalType !== "Manager" && (
            <Link
              to=""
              className="text-[#6e84a3] hover:text-white transition-colors duration-200"
            >
              <FaRegBell size={18} />
            </Link>
          )}

          <div className="bg-[#244166] rounded-full text-sm text-white w-10 h-10 flex items-center justify-center">
            <p>U</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
