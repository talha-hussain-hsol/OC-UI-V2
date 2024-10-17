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

  const fetchTransactionHistory = useCallback(async (accountId) => {
    try {
      setLoading(true);
      const response = await getCustomTransactionAPI(
        accountId,
        cancelTokenSource.token
      );
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
  const fetchAccountDetails = useCallback(async (accountId) => {
    try {
      setLoading(true);
      const response = await getSingleAccountDetailByIdAPI(
        accountId,
        cancelTokenSource.token
      );
      if (response.success) {
        setAccountData(response.data.account_detail || []);
      }
    } catch (error) {
      console.error("Error fetching Account Details:", error);
    } finally {
      setLoading(false);
    }
  });
  const fetchRequiredDocuments = useCallback(async (accountId) => {
    try {
      setLoading(true);
      const response = await getRequiredDocumentAPI(
        accountId,
        cancelTokenSource.token
      );
      if (response.success) {
        setRequiredDoc(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching Required Documents:", error);
    } finally {
      setLoading(false);
    }
  });
  const fetchTransactionHistoryAPI = useCallback(async (accountId) => {
    try {
      setLoading(true);
      const response = await getTransactionHistoryAPI(
        accountId,
        cancelTokenSource.token
      );
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
      console.error("Error fetching Transaction  Documents:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchAPIs = useCallback(
    async (accountId) => {
      await fetchTransactionHistory(accountId);
      await fetchUserDetails();
      await fetchAccountDetails(accountId);
      await fetchRequiredDocuments(accountId);
      await fetchTransactionHistoryAPI(accountId);
    },
    [
      fetchTransactionHistory,
      fetchUserDetails,
      fetchAccountDetails,
      fetchRequiredDocuments,
      fetchTransactionHistoryAPI,
    ]
  );

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
