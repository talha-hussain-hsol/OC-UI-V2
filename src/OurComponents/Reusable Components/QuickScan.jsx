import React, { useState } from "react";
import Table from "./Tables/Table";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { useTheme } from "../../contexts/themeContext";
import PeriodicReview from "./PeriodicReview";
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import Button from "./Button";

function QuickScan() {
  const { theme } = useTheme();
  console.log("theme", theme);
  const [crypto, setCrypto] = useState("");

  const handleCreateAccount = () => {
    console.log("Create Account button clicked");
  };

  const cryptos = [
    "Select CryptoCurrency",
    "BTC",
    "LTC",
    "ADA",
    "TRX",
    "BNB",
    "XRP",
  ];

  return (
    <>
      <div className={` flex flex-row rounded-lg mt-4 ml-4`}>
        <div className={`flex flex-col w-[30%] `}>
          <label htmlFor="" className={`text-color-text-${theme}`}>
            CryptoCurrency
          </label>
          <Dropdown
            options={cryptos}
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            className={`text-color-h1-${theme} w-full sm:w-[48%] lg:w-[100%]`}
          />
        </div>
        <div className={`flex flex-col w-[68%] ml-5 `}>
          <label htmlFor="" className={`text-color-text-${theme}`}>
            Wallet Address
          </label>

          <TextField
            type="text"
            placeholder="Wallet Address"
            className="w-full sm:w-[48%] lg:w-[30%]"
          />
        </div>
    </div>

      <div className="flex flex-wrap lg:flex-nowrap lg:space-x-3 mt-6 items-center  space-y-4 lg:space-y-0  ml-4 mb-6">
      <Button
        text="Submit"
        onClick={handleCreateAccount}
        className={`bg-color-button-${theme} text-color-text-${theme} font-light text-center rounded-lg py-2 sm:py-4 px-10 sm:px-24 text-sm sm:text-md w-full sm:w-auto `}
        //   iconPosition="right"
        />
      </div>

     
    </>
  );
}

export default QuickScan;
