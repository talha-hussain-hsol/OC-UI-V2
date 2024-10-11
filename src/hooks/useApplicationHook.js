import { useState, useCallback } from "react";
import {
  getCustomTransactionAPI,
  getAuthUserDetail,
  getSingleAccountDetailByIdAPI,
  getRequiredDocumentAPI,
  getTransactionHistoryAPI,
} from "../api/userApi";
import axios from "axios";

const useApplicationHook = () => {
  const cancelTokenSource = axios.CancelToken.source();
  const [transactionHistory, setTransactionHistory] = useState([]);

  const [userId, setUserId] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [requiredDoc, setRequiredDoc] = useState([]);
  const [documentHistory, setDocumentHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactionHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCustomTransactionAPI(cancelTokenSource.token);
      if (response.success) {
        setTransactionHistory(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAuthUserDetail(cancelTokenSource.token);
      if (response.success) {
        setUserId(response.data.id || []);
      }
    } catch (error) {
      console.error("Error fetching User Details:", error);
    } finally {
      setLoading(false);
    }
  });
  const fetchAccountDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSingleAccountDetailByIdAPI(
        cancelTokenSource.token
      );
      if (response.success) {
        setAccountData(response.data.account_detail || []);
      }
    } catch (error) {
      console.error("Error fetching User Details:", error);
    } finally {
      setLoading(false);
    }
  });
  const fetchRequiredDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRequiredDocumentAPI(cancelTokenSource.token);
      if (response.success) {
        setRequiredDoc(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching User Details:", error);
    } finally {
      setLoading(false);
    }
  });
  const fetchTransactionHistoryAPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransactionHistoryAPI(cancelTokenSource.token);
      // if (response.success) {
      //   console.log('Response Data:', response.data);
      //   setDocumentHistory(response.data || []);
      // }
      if (response.success) {
        const subscriptionAgreement =
          response.data.SUBSCRIPTION_AGREEMENT || [];

        if (subscriptionAgreement.length > 0) {
          setDocumentHistory(subscriptionAgreement);
        }
      }
    } catch (error) {
      console.error("Error fetching User Details:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchAPIs = useCallback(async () => {
    await fetchTransactionHistory();
    await fetchUserDetails();
    await fetchAccountDetails();
    await fetchRequiredDocuments();
    await fetchTransactionHistoryAPI();
  }, [
    fetchTransactionHistory,
    fetchUserDetails,
    fetchAccountDetails,
    fetchRequiredDocuments,
    fetchTransactionHistoryAPI,
  ]);

  return {
    transactionHistory,
    userId,
    accountData,
    loading,
    documentHistory,
    fetchAPIs,
    fetchTransactionHistory,
    fetchTransactionHistoryAPI,
  };
};

export default useApplicationHook;
