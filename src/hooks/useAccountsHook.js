// import { useCallback, useState } from "react";
// import { getCustomerAccounts } from "../api/userApi";
// import useEntityStore from "../store/useEntityStore";
// import axios from "axios";

// const useAccountsHook = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [isLoader, setIsLoader] = useState(false);
//   const cancelTokenSource = axios.CancelToken.source();
//   const { setAccountList } = useEntityStore();
//   const limit = 10;

//   // Memoize the API call to prevent recreating the function on every render
//   const fetchAccountsAPI = useCallback(
//     async (currentOffset = 0) => {
//       try {
//         setIsLoader(true);
//         const response = await getCustomerAccounts(
//           currentOffset,
//           limit,
//           cancelTokenSource.token
//         );
//         if (response.success) {
//           return response?.data?.customer_accounts || [];
//         }
//       } catch (error) {
//         console.error("Failed to fetch customer accounts", error);
//       } finally {
//         setIsLoader(false);
//       }
//       return [];
//     },
//     [limit]
//   );

//   // Memoize the function to fetch more accounts
//   const fetchMoreAccounts = useCallback(async () => {
//     const newAccounts = await fetchAccountsAPI(offset);
//     if (newAccounts.length > 0) {
//       setAccounts((prevAccounts) => [...prevAccounts, ...newAccounts]);
//       setOffset((prevOffset) => prevOffset + limit);
//     }
//   }, [offset, fetchAccountsAPI, limit]);

//   return {
//     accounts,
//     isLoader,
//     fetchMoreAccounts,
//   };
// };

// export default useAccountsHook;



// useAccountHook.js  


import { useCallback, useEffect, useState } from "react";
import { getCustomerAccounts } from "../api/userApi";
import useEntityStore from "../store/useEntityStore";
import axios from "axios";

const useAccountsHook = () => {
  const [accounts, setAccounts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const { setAccountList } = useEntityStore();
  const limit = 10;

  const fetchAccountsAPI = useCallback(async (currentOffset = 0) => {
    try {
      setIsLoader(true);
      const response = await getCustomerAccounts(currentOffset, limit, cancelTokenSource.token);
      if (response.success) {
        return response?.data?.customer_accounts || [];
      }
    } catch (error) {
      console.error("Failed to fetch customer accounts", error);
    } finally {
      setIsLoader(false);
    }
    return [];
  }, [limit]);

  const fetchMoreAccounts = useCallback(async () => {
    const newAccounts = await fetchAccountsAPI(offset);
    if (newAccounts.length > 0) {
      setAccounts((prevAccounts) => [...prevAccounts, ...newAccounts]);
      setOffset((prevOffset) => prevOffset + limit);
    }
  }, [offset, fetchAccountsAPI]);

  // Fetch initial accounts on mount
  useEffect(() => {
    fetchMoreAccounts();
  }, [fetchMoreAccounts]);

  return { accounts, isLoader, fetchMoreAccounts };
};

export default useAccountsHook;