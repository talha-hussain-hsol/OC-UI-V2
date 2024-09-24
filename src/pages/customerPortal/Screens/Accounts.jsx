import React, { useEffect, useLayoutEffect, useState } from "react";
import SideBar from "../../../OurComponents/Reusable Components/SideBar";
import Header from "../../../OurComponents/Reusable Components/Header";
import AccountCard from "../../../OurComponents/Reusable Components/CardComponent/AccountCard";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/themeContext";
import { getLocalStorage } from "../../../utils/cookies";
import { getCustomerAccounts } from "../../../api/userApi";
import useEntityStore from "../../../store/useEntityStore";
import { removeQueryParams } from "../../../utils/helperFunctions";

const Accounts = () => {
  const { entityId } = useEntityStore();
  const { theme } = useTheme();

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

  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    debugger;
    const fetchAccountData = async () => {
      try {
        const response = await getCustomerAccounts(entityId);
        console.log("API Response:", response);
        setAccountData(response?.data?.customer_accounts);
      } catch (error) {
        console.error("Failed to fetch customer accounts", error);
      }
    };

    fetchAccountData();
  }, [entityId]);

  const navigate = useNavigate();
  function handleClick() {
    navigate("/fund-code");
  }

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

        {accountData !== null && (
          <>
            {accountData.map((account) => (
              <AccountCard key={account.id} accountData={accountData} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Accounts;
