import { useCallback, useEffect, useState } from "react";
import { getEntities, getEntityPermission } from "../api/userApi";
import { toast } from "react-toastify";
import axios from "axios";
import { setLocalStorage } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import useEntityStore from "../../src/store/useEntityStore"; // Import Zustand store

const useFundCodeHook = () => {
    const [isSCB, setIsSCB] = useState(false);
    const [isLoader, setIsLoader] = useState(false); // Loader state
    const cancelTokenSource = axios.CancelToken.source(); // Cancel token for API request
  
useEffect(() => {
    handleGetCustomersAccounts();
  }, []);

  const handleGetCustomersAccounts = async () => {
    setIsLoader(true);
    try {
      const response = await verifyFundExist(
        { fund_ids: [3, 215, 1] },
        // cancelTokenSource.token
      );
      
      if (response?.success) {
        setIsSCB(response?.data?.count);
      } else {
        console.error("API Error:", response?.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("API Error:", error);
      }
    } finally {
      setIsLoader(false);
    }
  };


  return {
    entites,
    activePortal,
    portals,
    handleGetCustomersAccounts,
    isLoader
  };
};

export default useFundCodeHook;
