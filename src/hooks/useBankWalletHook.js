import { useCallback, useEffect, useState } from "react";
import { getBankIdentitiesAPI, getWalletAddressListAPI } from "../api/userApi";
import axios from "axios";

const useBankWalletHook = () => {
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderBank, setIsLoaderBank] = useState(false);
  const [bankIdentities, setBankIdentities] = useState([]);
  const [walletAddresses, setWalletAddresses] = useState([]);


  // Memoize fetchBankIdentities to avoid recreating it on each render
  const fetchBankIdentities = useCallback(async () => {
    try {
      setIsLoaderBank(true);
      const response = await getBankIdentitiesAPI(cancelTokenSource.token);
      if (response.success) {
        setBankIdentities(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching bank identities:", error);
    } finally {
      setIsLoaderBank(false);
    }
  }, []);

  // Wrap fetchWalletAddresses in useCallback as well
  const fetchWalletAddresses = useCallback(async () => {
    try {
      setIsLoader(true);
      const response = await getWalletAddressListAPI(cancelTokenSource.token);
      if (response.success) {
        setWalletAddresses(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching wallet addresses:", error);
    } finally {
      setIsLoader(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    await fetchBankIdentities();
    await fetchWalletAddresses();
  }, [fetchBankIdentities, fetchWalletAddresses]);

 

  return {
    isLoader,
    isLoaderBank,
    bankIdentities,
    walletAddresses,
    fetchAllData,
    fetchWalletAddresses,
    fetchBankIdentities
  };
};

export default useBankWalletHook;
