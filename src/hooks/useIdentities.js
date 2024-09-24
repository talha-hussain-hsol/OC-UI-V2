import { useState, useEffect } from "react";
import axios from "axios";
import { getIdentityList } from "../api/userApi";

const useIdentities = () => {
  const [profileListData, setProfileListData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [status, setStatus] = useState([]);
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    fetchIdentityList();

    return () => {
      cancelTokenSource.cancel("Request canceled by the user."); // Clean up on unmount
    };
  }, []);

  const fetchIdentityList = async () => {
    setIsLoader(true);
    try {
      const response = await getIdentityList(cancelTokenSource.token);
      if (response.success === true) {
        setProfileListData(response.data);
        setStatus(response.data.map((item) => item.status === "Active"));
      }
    } catch (error) {
      console.error("Failed to fetch identity list", error);
    } finally {
      setIsLoader(false);
    }
  };

  const handleToggleStatus = (index) => {
    setStatus((prevStatus) =>
      prevStatus.map((stat, i) => (i === index ? !stat : stat))
    );
  };

  return {
    profileListData,
    isLoader,
    status,
    handleToggleStatus,
  };
};

export default useIdentities;
