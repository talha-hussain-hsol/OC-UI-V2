import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../contexts/themeContext";
import useAccountsHook from "../../../../hooks/useAccountsHook";
import useEntityStore from "../../../../store/useEntityStore";
import Loader from "../../../../components/ui/loader";
import SideBar from "../../../../components/sidebar/Sidebar";
import Header from "../../../../components/header/Header";
import AccountCard from "../../../../components/cardComponent/AccountCard";

const Accounts = () => {
  const { accounts, isLoader, fetchMoreAccounts } = useAccountsHook();
  const { entityId } = useEntityStore.getState();
  const { theme } = useTheme();
  const observerRef = useRef();
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const navigate = useNavigate();
  function handleClick() {
    navigate("/fund-code");
  }

  // Use the observer to trigger API call when reaching the bottom of the list
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !isLoader) {
          setIsFetchingMore(true);
          fetchMoreAccounts().finally(() => {
            setIsFetchingMore(false);
          });
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
  }, [isFetchingMore, isLoader]);

  return (
    <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
      <SideBar portalType="Customer" />
      <div className="flex-1 py-6 lg:ml-9 lg:px-10 px-2">
        <Header
          heading="My Accounts"
          subheading="Overview"
          showButton={true}
          onButtonClick={handleClick}
          theme={theme}
        />
        <hr className=" border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 lg:ml-0 ml-6 sm:mr-6 lg:mr-0 mr-6" />
        {isLoader && <Loader theme={theme} />}
        {accounts.length > 0 && (
          <>
            {accounts.map((account) => (
              <AccountCard key={account.id} accountData={account} />
            ))}
          </>
        )}
        <div ref={observerRef}>
          {isFetchingMore && <Loader theme={theme} />}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
