import React, { useEffect } from "react";
import ApplicationCard from "../../../components/cardComponent/ApplicationCard";
import useApplicationHook from "../../../hooks/useApplicationHook";
import Loader from "../../../components/ui/loader";
import { useTheme } from "../../../contexts/themeContext";

const Application = (dataOfAccountSetup) => {
  const { theme } = useTheme();
  const { dataOfAccountSetups } = dataOfAccountSetup; 
  console.log('dataOfAccountSetups7',dataOfAccountSetups)
  const {
    transactionHistory,
    documentHistory,
    loading,
    fetchAPIs,
    fetchTransactionHistory,
    fetchTransactionHistoryAPI,
  } = useApplicationHook();
  useEffect(() => {
    fetchAPIs();
  }, []);
  return (
    <div className="flex flex-col justify-center items-center">
      {loading ? (
        <Loader theme={theme} />
      ) : (
        <ApplicationCard
          transactionHistory={transactionHistory}
          fetchTransactionHistory={fetchTransactionHistory}
          fetchTransactionHistoryAPI={fetchTransactionHistoryAPI}
          documentHistory={documentHistory}
        />
      )}
    </div>
  );
};

export default Application;
