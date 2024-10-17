import React, { useEffect } from "react";
import ApplicationCard from "../../../components/cardComponent/ApplicationCard";
import useApplicationHook from "../../../hooks/useApplicationHook";
import Loader from "../../../components/ui/loader";
import { useTheme } from "../../../contexts/themeContext";

const Application = (props) => {
  const { theme } = useTheme();
  const { dataOfAccountSetups } = props;
  console.log("dataOfAccountSetups7", dataOfAccountSetups);
  var dataSetup = JSON.stringify(dataOfAccountSetups);
  localStorage.setItem("dataofAccountSetup", dataSetup);
  const {
    transactionHistory,
    documentHistory,
    loading,
    fetchAPIs,
    fetchTransactionHistory,
    fetchTransactionHistoryAPI,
  } = useApplicationHook();
  const account_id = dataSetup[0]?.data?.account?.account_id;
  useEffect(() => {
    fetchAPIs(account_id);
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
          account_id={account_id}
        />
      )}
    </div>
  );
};

export default Application;
