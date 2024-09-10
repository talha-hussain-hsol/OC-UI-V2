import React from "react";
import BankCard from "../Reusable Components/CardComponent/BankCard";
import { useTheme } from "../../contexts/themeContext";

const BankWallets = () => {
  const { theme } = useTheme();
  return (
    <div className={`bg-color-${theme} flex flex-col justify-center items-center rounded-md`}>
      <BankCard />
    </div>
  );
};

export default BankWallets;
