import { useCallback, useState } from "react";
import { getBankIdentitiesAPI, getWalletAddressListAPI } from "../api/userApi";
import axios from "axios";

const useBankWalletHook = () => {
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderBank, setIsLoaderBank] = useState(false);
  const [bankIdentities, setBankIdentities] = useState([]);
  const [walletAddresses, setWalletAddresses] = useState([]);

  const fetchBankIdentities = useCallback(async (identityId) => {
    try {
      setIsLoaderBank(true);
      const response = await getBankIdentitiesAPI(
        identityId,
        cancelTokenSource.token
      );
      if (response.success) {
        setBankIdentities(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching bank identities:", error);
    } finally {
      setIsLoaderBank(false);
    }
  }, []);

  const fetchWalletAddresses = useCallback(async (identityId) => {
    try {
      setIsLoader(true);
      const response = await getWalletAddressListAPI(
        identityId,
        cancelTokenSource.token
      );
      if (response.success) {
        setWalletAddresses(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching wallet addresses:", error);
    } finally {
      setIsLoader(false);
    }
  }, []);

  const fetchAllData = useCallback(
    async (identityId) => {
      await fetchBankIdentities(identityId);
      await fetchWalletAddresses(identityId);
    },
    [fetchBankIdentities, fetchWalletAddresses]
  );

  return {
    isLoader,
    isLoaderBank,
    bankIdentities,
    walletAddresses,
    fetchAllData,
    fetchWalletAddresses,
    fetchBankIdentities,
  };
};

export default useBankWalletHook;
