import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/themeContext";
import { FiSearch } from "react-icons/fi";
import SideBar from "../../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import { getFundForJoin, verifyFundExist } from "../../../api/userApi"; // Ensure API function is correctly imported
import axios from "axios"; // If needed for CancelToken
import Loader from "../../../components/ui/loader";

const FundCode = () => {
  const { theme } = useTheme();
  const [isSCB, setIsSCB] = useState(false);
  const [fundCode, setFundCode] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [alertJoinFund, setAlertJoinFund] = useState(false); // will use this in future
  const [fundData, setFundData] = useState(null); // will use this in future

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

  const handleInputChange = (e) => {
    setFundCode(e.target.value);
  };

  const navigate = useNavigate();

  function handleClick() {
    getFundForJoinApi();
  }

  function handleNext() {
    navigate("/stepper");
  }

  function handlePrev() {
    navigate("/accounts");
  }

  const handleGetCustomersAccounts = async () => {
    setIsLoader(true);
    try {
      const response = await verifyFundExist(
        { fund_ids: [3, 215, 1] }
        // cancelTokenSource.token
      );

      if (response.success == true) {
        setIsSCB(response?.data?.count);
        navigate("/stepper");
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

  const getFundForJoinApi = async () => {
    setIsLoader(true);
    setAlertJoinFund(false);

    const response = await getFundForJoin(fundCode, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      const fundData = response?.data;
      const referenceDocuments = fundData?.reference_document?.documents;
      const fundField = fundData?.fund_fields;
      const fundSetting = fundData?.fund_setting;
      setFundData(response?.data);
      navigate("/stepper", {
        state: { fundData, referenceDocuments, fundSetting, fundField },
      });
      localStorage.setItem("fundRegion", response?.data?.fund_setting?.region);
      if (!response?.data?.reference_document?.term_documents) {
        props.handleChangeTermsCondition();
      }
      if (response?.data?.reference_document?.term_documents?.length == 0) {
        props.handleChangeTermsCondition();
      } else if (
        response?.data?.reference_document?.term_documents?.[
          response?.data?.reference_document?.term_documents?.length - 1
        ]?.is_required == "false" ||
        response?.data?.reference_document?.term_documents?.[
          response?.data?.reference_document?.term_documents?.length - 1
        ]?.is_required == false
      ) {
        props.handleChangeTermsCondition();
      }
    } else {
      setIsLoader(false);
      setAlertJoinFund(true);
    }
  };

  return (
    <>
      <SideBar portalType="Customer" />
      <div
        className={`bg-color-${theme} h-screen border-color-${theme} border-[1px] shadow-${theme}  lg:px-20 px-8 py-20 flex flex-col gap-4 items-center`}
      >
        <div
          className={`bg-gradient-stepper-card-${theme}  border-color-${theme} border-[1px] shadow-${theme} rounded-lg w-full lg:ml-16 pt-20 pb-4 sm:px-20 xs:px-10 px-4 flex flex-col gap-4 items-center`}
        >
          <h3 className={`text-white xs:text-2xl text-md`}>
            Let's start with the basics.
          </h3>
          <p className={`text-white xs:text-lg text-xs`}>
            Please enter the account joining code which you would have received
            from the account owner.
          </p>

          {isLoader ? (
            <Loader theme={theme} />
          ) : (
            <>
              <div className="relative w-full mt-4 mb-10">
                <input
                  type="text"
                  placeholder="Enter the account code"
                  value={fundCode}
                  onChange={handleInputChange}
                  className={`bg-color-textfield-dropdown-${theme} text-color-text-${theme} w-full p-3 xs:pl-8 pl-4 rounded-full border border-color-dropdown-${theme} shadow-${theme} focus:outline-none xs:text-lg text-xs`}
                />

                <button
                  disabled={!fundCode}
                  className={`absolute right-[1px] top-[1px] xs:py-[18px] py-[12px] sm:px-8 xs:px-6 px-4 rounded-r-full  ${
                    fundCode ? "bg-green-500" : "bg-green-500 opacity-80"
                  } text-white`}
                  onClick={handleClick}
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
              <hr className="w-full border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
              <div className="flex lg:space-x-[75%] sm:justify-between justify-center gap-2 w-full p-4">
                <Button
                  text="Cancel"
                  className={`sm:py-6 sm:px-8 py-6 px-4 border b-white hover:border-0 rounded-lg text-white focus:outline-none`}
                  onClick={handlePrev}
                />
                <Button
                  text="Next"
                  className={`bg-color-button-${theme} sm:py-6 sm:px-8 py-6 px-4 rounded-lg text-white`}
                  onClick={handleNext}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FundCode;
