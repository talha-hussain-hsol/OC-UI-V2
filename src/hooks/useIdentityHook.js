import { useCallback, useEffect, useState } from "react";
import { getIdentityList } from "../api/userApi";
import { toast } from "react-toastify";
import axios from "axios";
import { setLocalStorage } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import useEntityStore from "../store/useEntityStore";

const portals = [
  { label: "Customer Portal", type: "customer" },
  { label: "Compliance Portal", type: "compliance" },
  { label: "Manager Portal", type: "management" },
];

const useIdentityHook = () => {
  const [entites, setEntites] = useState([]);
  const [activePortal, setActivePortal] = useState(portals[0].type);
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();

  const handleGetIdentityList = useCallback(async () => {
    console.log(`checking`);
    setIsLoader(true);

    const response = await getIdentityList(cancelTokenSource.token);
    console.log("object 1", response);
    if (response == true) {
      setIsLoader(false);
      setProfileListData(response?.data);
    } else {
      setIsLoader(false);
    }
  }, []);

  useEffect(() => {
    handleGetIdentityList();
  }, [handleGetIdentityList]);

  const handleActivePortal = useCallback((portalType) => {
    setActivePortal(portalType);
  }, []);

  return {
    entites,
    activePortal,
    portals,
    handleActivePortal,
    isLoader
  };
};

export default useIdentityHook;
