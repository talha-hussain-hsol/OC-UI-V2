import { useCallback, useEffect, useState } from "react";
import { getCustomerAccounts } from "../api/userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useEntityStore from "../store/useEntityStore";
import axios from "axios";

const portals = [
  { label: "Customer Portal", type: "customer" },
  { label: "Compliance Portal", type: "compliance" },
  { label: "Manager Portal", type: "management" },
];

const useAccountsHook = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [activePortal, setActivePortal] = useState(portals[0].type);
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const { setAccountId, setAccountList } = useEntityStore();

  // Memoize the API call using useCallback
  const handleAccountsAPI = useCallback(async () => {
    setIsLoader(true);
    const response = await getCustomerAccounts(cancelTokenSource.token);
    if (response == true) {
      setIsLoader(false);
      setAccountList(response?.data);
    } else {
      setIsLoader(false);
    }
  }, []);

  useEffect(() => {
    handleAccountsAPI();
  }, [handleAccountsAPI]);

  const handleActivePortal = useCallback((portalType) => {
    setActivePortal(portalType);
  }, []);

  return {
    accounts,
    isLoader,
    handleActivePortal,
  };
};

export default useAccountsHook;
