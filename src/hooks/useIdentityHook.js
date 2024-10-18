import { useState, useCallback } from "react";
import { getIdentityList } from "../api/userApi";
import axios from "axios";

const portals = [
  { label: "Customer Portal", type: "customer" },
  { label: "Compliance Portal", type: "compliance" },
  { label: "Manager Portal", type: "management" },
];

const useIdentityHook = (setProfileListData) => {
  const [entites, setEntites] = useState([]);
  const [activePortal, setActivePortal] = useState(portals[0].type);
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();

  const fetchIdentities = useCallback(async () => {
    setIsLoader(true);
    try {
      const response = await getIdentityList(cancelTokenSource.token);
      if (response.success) {
        console.log("Responseeee Identities:",  response);
        setProfileListData(response?.data); // Pass profile data to the state in Identities component
      }
    } catch (error) {
      console.error("Error fetching identities", error);
    } finally {
      setIsLoader(false);
    }
  }, [setProfileListData]);

  const handleActivePortal = useCallback((portalType) => {
    setActivePortal(portalType);
  }, []);

  return {
    entites,
    activePortal,
    portals,
    handleActivePortal,
    isLoader,
    fetchIdentities,
  };
};

export default useIdentityHook;
