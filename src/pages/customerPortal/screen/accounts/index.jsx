import React, { useEffect, useLayoutEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../contexts/themeContext";
import { getLocalStorage } from "../../../../utils/cookies";
import { getCustomerAccounts } from "../../../../api/userApi";
import useEntityStore from "../../../../store/useEntityStore";
import { removeQueryParams } from "../../../../utils/helperFunctions";
import axios from "axios";
import Loader from "../../../../components/ui/loader";
import useIdentityHook from "../../../../hooks/useIdentityHook";
import SideBar from "../../../../components/sidebar/Sidebar";
import Header from "../../../../components/header/Header";
import AccountCard from "../../../../components/cardComponent/AccountCard";

const Accounts = () => {
  const cancelTokenSource = axios.CancelToken.source();
  const { entites, activePortal, portals, handleActivePortal, isLoader } =
    useIdentityHook();
  const { entityId } = useEntityStore.getState();
  const { theme } = useTheme();
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false); 
  const observerRef = useRef();
  const [accountData, setAccountData] = useState([]);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      const parsedData = JSON.parse(decodeURIComponent(data));
      for (const key in parsedData) {
        localStorage.setItem(key, parsedData[key]);
      }
    }
    removeQueryParams();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "SC"
        ? "#ffffff"
        : theme === "Ascent"
        ? "rgba(18, 38, 63)"
        : theme === "lightTheme"
        ? "#000000"
        : "";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        let currentOffset = offset;
        const response = await getCustomerAccounts(
          currentOffset,
          limit,
          cancelTokenSource.token
        );
        if (response.success) {
          setAccountData((prevData) => [
            ...prevData,
            ...response?.data?.customer_accounts,
          ]);
          setOffset((prevOffset) => prevOffset + limit);
        }
      } catch (error) {
        console.error("Failed to fetch customer accounts", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccountData();
  }, [entityId]);

  const navigate = useNavigate();
  function handleClick() {
    navigate("/fund-code");
  }
  const fetchMoreAccounts = async () => {
    try {
      setIsFetchingMore(true);
      const response = await getCustomerAccounts(
        offset,
        limit,
        cancelTokenSource.token
      );
      if (response.success) {
        setAccountData((prevData) => [
          ...prevData,
          ...response?.data?.customer_accounts,
        ]);
        setOffset((prevOffset) => prevOffset + limit);
      }
    } catch (error) {
      console.error("Failed to fetch more accounts", error);
    } finally {
      setIsFetchingMore(false);
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !isLoading) {
          fetchMoreAccounts();
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isFetchingMore, isLoading]);

  return (
    <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
      <SideBar portalType="Customer" />
      <div className="flex-1 py-6 sm:ml-9 sm:px-10 px-4">
        <Header
          heading="My Accounts"
          subheading="Overview"
          showButton={true}
          onButtonClick={handleClick}
          theme={theme}
        />
        
        {isLoading && <Loader />} 
        {accountData.length > 0 && (
          <>
            {accountData.map((account) => (
              <AccountCard key={account.id} accountData={account} />
            ))}
          </>
        )}
        <div ref={observerRef}>
          {isFetchingMore && <Loader />} 
        </div>
      </div>
    </div>
  );
};

export default Accounts;
