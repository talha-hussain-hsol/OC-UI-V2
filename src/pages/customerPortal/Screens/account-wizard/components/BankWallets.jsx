import React from "react";
import { useTheme } from "../../../../../contexts/themeContext";
import BankCard from "../../../../../components/CardComponent/BankCard";

const BankWallets = () => {
  const { theme } = useTheme();
  return (
    <div className={`bg-color-${theme} flex flex-col justify-center items-center rounded-md`}>
      <BankCard />
    </div>
  );
};

export default BankWallets;
