import React, { useEffect } from "react";
import SummaryCard from "../../../components/cardComponent/SummaryCard";
import useSummaryStepHook from "../../../hooks/useSummaryStepHook";

const Summary = () => {
  const { fetchAPIs } = useSummaryStepHook();
  useEffect(() => {
    fetchAPIs();
  }, []);
  return (
    <div className=" flex flex-col justify-center items-center">
      <SummaryCard />
    </div>
  );
};

export default Summary;
