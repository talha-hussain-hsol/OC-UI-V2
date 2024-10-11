import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  getSingleAccountDetailByIdAPI,
  getParticularsDetailByIdentityIdAPI,
  getParticularFieldsApi,
  getFlatCPRListAPI,
  getIdentityDocument,
  getRequiredDocumentCRP,
} from "../api/userApi";

const useSummaryStepHook = () => {
  const cancelTokenSource = axios.CancelToken.source();
  const [accountData, setAccountData] = useState([]);
  const [particularDetails, setParticularDetails] = useState([]);
  const [particularFields, setParticularFields] = useState([]);
  const [CRPList, setCRPList] = useState([]);
  const [identityDoc, setIdentityDoc] = useState([]);
  const [CRPDoc, setCRPDoc] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccountDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSingleAccountDetailByIdAPI(
        cancelTokenSource.token
      );
      if (response.success) {
        setAccountData(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchParticularFields = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getParticularFieldsApi(
        "751550b6-e031-439c-bc7e-e2343ce52baf",
        cancelTokenSource.token
      );
      if (response.success) {
        setParticularFields(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchParticularDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getParticularsDetailByIdentityIdAPI(
        cancelTokenSource.token
      );
      if (response.success) {
        setParticularDetails(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchCRPList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFlatCPRListAPI(cancelTokenSource.token);
      if (response.success) {
        setCRPList(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchIdentityDocument = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getIdentityDocument(cancelTokenSource.token);
      if (response.success) {
        setIdentityDoc(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchCRPDocument = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRequiredDocumentCRP(cancelTokenSource.token);
      if (response.success) {
        setCRPDoc(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchAPIs = useCallback(async () => {
    await fetchAccountDetails();
    await fetchParticularDetails();
    await fetchParticularFields();
    await fetchCRPList();
    await fetchIdentityDocument();
    await fetchCRPDocument();
  }, [
    fetchAccountDetails,
    fetchParticularDetails,
    fetchParticularFields,
    fetchCRPList,
    fetchIdentityDocument,
    fetchCRPDocument,
  ]);

  return {
    fetchAPIs,
  };
};

export default useSummaryStepHook;
