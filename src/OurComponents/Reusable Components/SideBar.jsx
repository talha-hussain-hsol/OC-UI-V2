import React, { useState, useEffect, useRef } from "react";
import Logo from "../../../public/Assets/OneConstellation.png";
import { RxDashboard } from "react-icons/rx";
import { TbUsers, TbSwitch } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { MdOutlineFileDownload } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdOutlineAccountTree } from "react-icons/md";
import { PiCompass } from "react-icons/pi";
import Tooltip from "./Tooltip";
import { AiOutlineMenu } from "react-icons/ai";
import { MdInvertColors } from "react-icons/md";
import { useTheme } from "../../contexts/themeContext";
import LogoGif from "../../../public/Assets/form-logo.gif";

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
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [lightThemeEnabled, setLightThemeEnabled] = useState(false);
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [standardCharteredEnabled, setStandardCharteredEnabled] =
    useState(false);

  const sidebarRef = useRef(null);
  const themeSidebarRef = useRef(null);
  const themeMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileSidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleThemeSidebar = () => {
    setIsThemeSidebarOpen(!isThemeSidebarOpen);
  };
  const toggleThemeMenu = () => {
    setIsThemeMenuOpen(!isThemeMenuOpen);
  };
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen);
  };

  const handleThemeSwitch = (theme) => {
    const defaultTheme = "Ascent";
    const themeStatus = {
      lightTheme: lightThemeEnabled,
      Ascent: darkThemeEnabled,
      standardChartered: standardCharteredEnabled,
    };
    if (themeStatus[theme]) {
      toggleTheme(defaultTheme);
      setLightThemeEnabled(false);
      setDarkThemeEnabled(true);
      setStandardCharteredEnabled(false);
      localStorage.setItem("theme", defaultTheme);
      return;
    }
    switch (theme) {
      case "lightTheme":
        setLightThemeEnabled(true);
        setDarkThemeEnabled(false);
        setStandardCharteredEnabled(false);
        toggleTheme("lightTheme");
        localStorage.setItem("theme", "lightTheme");
        break;
      case "Ascent":
        setLightThemeEnabled(false);
        setDarkThemeEnabled(true);
        setStandardCharteredEnabled(false);
        toggleTheme("Ascent");
        localStorage.setItem("theme", "Ascent");
        break;
      case "standardChartered":
        setLightThemeEnabled(false);
        setDarkThemeEnabled(false);
        setStandardCharteredEnabled(true);
        toggleTheme("SC");
        localStorage.setItem("theme", "SC");
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "SC";
    toggleTheme(storedTheme);
    switch (storedTheme) {
      case "lightTheme":
        setLightThemeEnabled(true);
        setDarkThemeEnabled(false);
        setStandardCharteredEnabled(false);
        break;
      case "Ascent":
        setLightThemeEnabled(false);
        setDarkThemeEnabled(true);
        setStandardCharteredEnabled(false);
        break;
      case "SC":
        setLightThemeEnabled(false);
        setDarkThemeEnabled(false);
        setStandardCharteredEnabled(true);
        break;
      default:
        setLightThemeEnabled(false);
        setDarkThemeEnabled(true);
        setStandardCharteredEnabled(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }

      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        isProfileSidebarOpen &&
        profileSidebarRef.current &&
        !profileSidebarRef.current.contains(event.target)
      ) {
        setIsProfileSidebarOpen(false);
      }

      if (
        isThemeSidebarOpen &&
        themeSidebarRef.current &&
        !themeSidebarRef.current.contains(event.target)
      ) {
        setIsThemeSidebarOpen(false);
      }

      if (
        isThemeMenuOpen &&
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target)
      ) {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isProfileMenuOpen,
    isProfileSidebarOpen,
    isThemeSidebarOpen,
    isThemeMenuOpen,
  ]);

  return (
    <>
      {/* {/ Hamburger Menu Button /} */}
      <div
        className={`fixed z-20 flex justify-between items-center bg-color-sidebar-nav-${theme} py-2 px-8 w-full focus:outline-none lg:hidden`}
      >
        <div>
          <button
            className={` text-white focus:outline-none lg:hidden `}
            onClick={toggleSidebar}
          >
            <AiOutlineMenu size={24} />
          </button>
        </div>

        <div>
          <img src={LogoGif} alt="" className={`w-20`} />
        </div>
        <div className="flex gap-4">
          <button
            onClick={toggleThemeMenu}
            className={`text-white hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
          >
            <MdInvertColors size={28} />
          </button>
          {isThemeMenuOpen && (
            <div
              ref={themeMenuRef}
              className={`absolute  border-color-${theme} border w-60 right-20 top-12 text-sm bg-color-sidebar-${theme} text-color-sidebar-icon-${theme} shadow-md p-2 rounded-md`}
            >
              <ul>
                <li
                  className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                >
                  Light
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lightThemeEnabled}
                      onChange={() => handleThemeSwitch("lightTheme")}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                  </label>
                </li>
                <li
                  className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                >
                  Dark
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkThemeEnabled}
                      onChange={() => handleThemeSwitch("Ascent")}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                  </label>
                </li>
                <li
                  className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                >
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

          <div>
            <button onClick={toggleProfileMenu}>
              <div
                className={`bg-color-profile-icon-${theme} rounded-full text-sm text-color-profile-icon-${theme} w-10 h-10 flex items-center justify-center`}
              >
                <p>U</p>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div
                ref={profileMenuRef}
                className={`absolute  border-color-${theme} border w-40 right-10 text-sm bg-color-sidebar-${theme} text-color-sidebar-icon-${theme} shadow-md p-2 rounded-md`}
              >
                <ul>
                  <li
                    className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                  >
                    Notifications
                  </li>
                  <li
                    className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                  >
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`bg-color-sidebar-${theme} z-[1000] h-screen w-16 fixed flex flex-col items-center md:hidden sm:hidden xs:hidden py-6 ${
          !isSidebarOpen ? "lg:flex" : "lg:hidden"
        }`}
      >
        <img src={Logo} alt="One Constellation Logo" className="w-6" />
        <div className="flex flex-col gap-6 items-center mt-8">
          {portalType === "Compliance" && (
            <>
              <Tooltip content="Domains">
                <Link to="/domain-accounts">
                  <RxDashboard
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Customers">
                <Link to="/customers-list">
                  <TbUsers
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Switch">
                <Link to="/splash">
                  <TbSwitch
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Settings">
                <Link to="">
                  <CiSettings
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Ageing Report">
                <Link to="">
                  <MdOutlineFileDownload
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Consumption Report">
                <Link to="">
                  <MdOutlineFileDownload
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <div></div>
            </>
          )}
          {portalType === "Customer" && (
            <>
              <Tooltip content="Dashboard">
                <Link to="/">
                  <FiHome
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Documents">
                <Link to="/documents">
                  <IoDocumentsOutline
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Accounts">
                <Link to="/accounts">
                  <MdOutlineAccountTree
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Identities">
                <Link to="/identities">
                  <TbUsers
                    size={14}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Walkthrough">
                <Link to="">
                  <PiCompass
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <div></div>
            </>
          )}
          {portalType === "Manager" && (
            <>
              <Tooltip content="Domains">
                <Link to="">
                  <RxDashboard
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <Tooltip content="Switch">
                <Link to="">
                  <TbSwitch
                    size={18}
                    className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                  />
                </Link>
              </Tooltip>
              <div></div>
            </>
          )}
        </div>
        {/* {/ Bottom Section for larger screens /} */}
        <div className="flex flex-col items-center gap-6 mt-auto">
          <div className="flex flex-col items-center mt-auto">
            <button
              onClick={toggleThemeSidebar}
              className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200 z-20`}
            >
              <MdInvertColors size={18} />
            </button>
            {isThemeSidebarOpen && (
              <div
                ref={themeSidebarRef}
                className={`absolute left-14 border-color-${theme} border w-60 bottom-32 text-sm bg-color-sidebar-${theme} text-color-sidebar-icon-${theme} shadow-md p-2 rounded-md`}
              >
                <ul>
                  <li
                    className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                  >
                    Light
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lightThemeEnabled}
                        onChange={() => handleThemeSwitch("lightTheme")}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                    </label>
                  </li>
                  <li
                    className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                  >
                    Dark
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkThemeEnabled}
                        onChange={() => handleThemeSwitch("Ascent")}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                    </label>
                  </li>
                  <li
                    className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                  >
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
                  className={`text-color-sidebar-icon-${theme} hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
                />
              </Link>
            </Tooltip>
          )}
          <button onClick={toggleProfileSidebar}>
            <div
              className={`bg-color-profile-icon-${theme} rounded-full text-sm text-color-profile-icon-${theme} w-10 h-10 flex items-center justify-center`}
            >
              <p>U</p>
            </div>
          </button>
          {isProfileSidebarOpen && (
            <div
              ref={profileSidebarRef}
              className={`absolute left-14 border-color-${theme} border w-40 bottom-12 text-sm bg-color-sidebar-${theme} text-color-sidebar-icon-${theme} shadow-md p-2 rounded-md`}
            >
              <ul>
                <li
                  className={`flex justify-between items-center cursor-pointer hover:text-color-sidebar-icon-hover-${theme} p-2`}
                >
                  <button>Log Out</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* {/ Sidebar for smaller screens (hamburger menu) /} */}
      <div
        className={`fixed pb-8 top-0 left-0 w-full bg-color-sidebar-nav-${theme} z-20 transition-transform linear duration-300 transform ${
          isSidebarOpen ? "translate-y-0" : "-translate-y-full"
        } lg:hidden flex flex-col items-center p-4`}
      >
        <div className="flex items-center justify-between w-full mb-6">
          <img
            src={LogoGif}
            alt="One Constellation Logo"
            className="w-16 m-auto"
          />
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
                to="/"
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <FiHome size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/documents"
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <IoDocumentsOutline size={18} />
                <span>Documents</span>
              </Link>
              <Link
                to="/accounts"
                className="flex items-center gap-2 text-[#6e84a3] hover:text-white transition-colors duration-200"
              >
                <MdOutlineAccountTree size={18} />
                <span>Accounts</span>
              </Link>
              <Link
                to="/identities"
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
        {/* <div className="flex flex-col items-center gap-6 mt-4 w-full">
          {portalType !== "Manager" && (
            <Link
              to=""
              className={`flex gap-2 items-center text-[#6e84a3] hover:text-color-sidebar-icon-hover-${theme} transition-colors duration-200`}
            >
              <FaRegBell size={18} />
              <span>Notifications</span>
            </Link>
          )}
          <button>
            <div
              className={`text-sm text-[#6e84a3] flex items-center justify-center`}
            >
              <p>Log Out</p>
            </div>
          </button>
        </div>   */}
      </div>
    </>
  );
};

export default SideBar;
