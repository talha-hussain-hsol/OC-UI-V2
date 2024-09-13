import React from "react";
import { useTheme } from "../../contexts/themeContext";
import DonutChart from "../Reusable Components/DonutChart";

const TransactionSummary = () => {

    const { theme } = useTheme();
    console.log("theme", theme);

    const labels = ["Total Transactions:1", "Suspicious Transactions:1"];
    const dataValues = [50.00, 50.00];
    const colors = ["#FF0000", "#4169E1"];

  return (
    <>
        <p className={`text-color-${theme} ml-[35%] mb-4`}>Proportion of Suspicious Transactions</p>
        <DonutChart
                  labels={labels}
                  dataValues={dataValues}
                  colors={colors}
                />
    </>
  )
}

export default TransactionSummary