import React, { useState, useEffect, useCallback } from "react";
import {
  getIdentityDocument,
  getParticularsDetailByIdentityIdAPI,
  getRequiredDocumentCRP,
  getCRPsByIdentityIdAPI,
  getSingleAccountDetailByIdAPI,
  deleteDocument,
} from "../api/userApi";
import axios from "axios";

const useDocumentHook = () => {
  const cancelTokenSource = axios.CancelToken.source();
  const [identityDocument, setIdentityDocument] = useState([]);
  const [particularDetails, setParticularDetails] = useState([]);
  const [accountDetails, setAccountDetails] = useState([]);
  const [requiredDoc, setRequiredDoc] = useState([]);
  const [identityCRP, setIdentityCRP] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchIdentityDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getIdentityDocument(cancelTokenSource.token);
      if (response.success) {
        setIdentityDocument(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching identity documents:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchRequiredDoc = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRequiredDocumentCRP(cancelTokenSource.token);
      if (response.success) {
        setRequiredDoc(response.data?.required_documents_types || []);
        setDocumentTypes(
          response.data?.required_documents_types.children || []
        );
      }
    } catch (error) {
      console.error("Error fetching Required Documents:", error);
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
      console.error("Error fetching Particular Details:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchIdentityCRP = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCRPsByIdentityIdAPI(cancelTokenSource.token);
      if (response.success) {
        setIdentityCRP(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching Identity CRPs:", error);
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
        setAccountDetails(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching Account Details:", error);
    } finally {
      setLoading(false);
    }
  });

  const fetchAPIs = useCallback(async () => {
    await fetchIdentityDocuments();
    await fetchIdentityCRP();
    await fetchRequiredDoc();
    await fetchAccountDetails();
    await fetchParticularDetails();
  }, [
    fetchIdentityDocuments,
    fetchIdentityCRP,
    fetchIdentityDocuments,
    fetchParticularDetails,
    fetchAccountDetails,
  ]);

  return {
    fetchAPIs,
    fetchIdentityDocuments,
    fetchAccountDetails,
    loading,
    identityDocument,
    requiredDoc,
    documentTypes,
    accountDetails,
  };
};

export default useDocumentHook;
