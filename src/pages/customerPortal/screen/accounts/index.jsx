

import React, { useEffect, useState } from "react";
import { Modal, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../../../../components/tooltip/Tooltip";

import Header from "../../../../components/header/Header";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  getCustomerAccounts,
  deleteAccountAPI,
} from "../../../../api/network/CustomerApi";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../../../components/ui/loader/index";
import EntityIcon from "../../../../icons/entity-icon-small.svg";
import { checkSubscriptionAllow } from "../../../../helpers/getFundConfiguration";
import Countries from "../../../../helpers/countries";
import { setCustomerAccounts } from "../../../../store/slices/customerAccountSlice";
import { useSelector, useDispatch } from "react-redux";
import CustomAlert from "../../../../components/ui/loader/index";
import SideBar from "../../../../components/sidebar/Sidebar";
import { useTheme } from "../../../../contexts/themeContext";

export default function InvestorSubscriptionList({ ...props }) {
  const { theme } = useTheme();

  const [accountsData, setAccountsData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderAccount, setIsLoaderAccount] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [switchTransferModal, setSwitchTransferModal] = useState(false);

  const cancelTokenSource = axios.CancelToken.source();
  const history = useLocation();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);

  const dispatch = useDispatch();
  function handleClick() {
    navigate("/subscription/request");
  }

  const customerAccounts = useSelector((state) => state?.customerAccount);
  const [activeItem, setActiveItem] = useState(null);
  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const headerButtonCallBack = (e) => {
    e.preventDefault();
    navigate("/subscription/request");
  };
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
    console.log("isLoaderAccount", isLoaderAccount);
  }, [isLoaderAccount]);
  useEffect(() => {
    console.log("accountsData", accountsData);
  }, [accountsData]);
  useEffect(() => {
    console.log(
      "customerAccountscustomerAccountscustomerAccountscustomerAccountscustomerAccounts",
      customerAccounts
    );
  }, [customerAccounts]);

  useEffect(() => {
    const abortController = new AbortController();

    loadMoreAccounts(abortController);

    return () => {
      abortController.abort(); // Cancel the request on component unmount or route change
    };
  }, []);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
  //       loadMoreAccounts();
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [offset, limit]);

  const loadMoreAccounts = async (abortController) => {
    setIsLoader(true); // Main loader to indicate the entire loading process
    let currentOffset = offset;
    let keepLoading = true;

    while (keepLoading && !abortController.signal.aborted) {
      try {
        // Show the loader before each API call
        setIsLoaderAccount(true);

        const response = await getCustomerAccounts(
          currentOffset,
          limit,
          cancelTokenSource.token
        );
        const newAccounts = response.data?.customer_accounts || [];

        if (response?.success && newAccounts.length > 0) {
          setAccountsData((prevAccounts) => [...prevAccounts, ...newAccounts]);
          currentOffset += limit;
          setOffset(currentOffset);
        } else {
          keepLoading = false; // Stop loading if no more accounts are returned
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching accounts", error);
        }
        keepLoading = false; // Stop loading on error
      } finally {
        // Hide the loader after each API call
        setIsLoaderAccount(false);
      }
    }

    // Main loader off after the entire process
    setIsLoader(false);
  };

  const handleGetCustomersAccounts = async () => {
    console.log(`checking`);
    setIsLoaderAccount(true);

    const response = await getCustomerAccounts(0, 10, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoaderAccount(false);
      setAccountsData(response?.data?.customer_accounts);
      dispatch(setCustomerAccounts(response?.data?.customer_accounts));
    } else {
      setIsLoaderAccount(false);
    }
  };

  const hanleDeleteAccount = (e, accountId) => {
    setDeleteAccountId(accountId);
    setDeleteAccountModal(true);
  };
  const handleDeleteAccountConfirm = async (e) => {
    setIsLoaderAccount(true);
    setDeleteAccountModal(false);
    const response = await deleteAccountAPI(
      deleteAccountId,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoaderAccount(false);
      handleGetCustomersAccounts();
      props?.handleAlert({
        variant: "success",
        message: "Account Deleted Successfully",
        show: true,
        hideAuto: true,
      });
    } else {
      setIsLoaderAccount(false);
    }
  };
  const closeModal = () => {
    setDeleteAccountModal(false);
  };
  const closeModalSwitchModal = () => {
    setSwitchTransferModal(false);
  };
  const handleClickSwicthTransfer = (e) => {
    setSwitchTransferModal(true);
  };
  const getCountryNameFromEnums = (countryCode) => {
    let countryName = "";
    if (Countries.length > 0) {
      for (let a of Countries) {
        if (a.code == countryCode) {
          countryName = a.key;
        }
      }
    }
    if (countryName == "") {
      return countryCode;
    } else {
      return countryName;
    }
  };
  return (
    <>
      <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
        <SideBar portalType="Customer" />
        <div className="flex-1 py-6 lg:ml-9  lg:px-10 px-2">
          <Header
            heading="My Accounts"
            subheading="Overview"
            showButton={true}
            onButtonClick={handleClick}
            theme={theme}
          />
          <hr className="border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4  ml-6 sm:mr-6 lg:mr-0 mr-6" />

<div className={`bg-color-account-${theme} rounded-lg `}>
          <div className="flex flex-col ">
            {accountsData.length > 0
              ? accountsData.map((item, index) => {
                  return (
                    <div
                      className={`bg-color-card-${theme} shadow-${theme} border border-color-${theme} flex flex-col gap-4 rounded-lg px-4 ml-4 mr-4 mt-4 mb-4`}
                      key={index}
                    >
                      <div className={`bg-color-card-${theme} shadow-${theme} border-b border-color-${theme} rounded-t-lg flex justify-between py-[6px] sm:px-[24px] items-center gap-4`}>
                        <h4 className={`xs:text-[15px] text-[10px] font-light flex items-center text-color-fundName-${theme}`}>
                          <img
                            src={item?.account?.fund?.logoBucketKey}
                            style={{
                              maxHeight: "30px",
                              textAlign: "left",
                              marginRight: "5px",
                            }}
                            alt=""
                            className="rounded "
                          />
                          {item?.account?.fund?.name}
                        </h4>

                        {/* {item?.account?.status == 'accepted' && ( */}
                        {/* http://customer.oc.sg:8002/profile/detail/098d9e73-f3e5-47c3-b8eb-92d45f5d3306/252cd9e4-17c3-4e78-90ea-62a7e88ffe29 */}
                        <div className="flex sm:gap-2 gap-1">
                        {(item?.account?.fundId === 215 ||
                          item?.account?.fundId === "215") && (
                          <button
                            onClick={() =>
                              navigate(
                                `/profile/detail/${item?.identityId}/${item?.accountId}?event=complete`,
                                {
                                  state: { isTransaction: true },
                                }
                              )
                            }
                            className="mt-[10px] py-[4px] px-[8px]"
                          >
                            <Tooltip content= "New Transaction Request" position="upper">
                              <span>
                                <img
                                  style={{ height: "35px", width: "35px" }}
                                  className={"subscription_list_icons"}
                                  src={
                                    "/img/transaction-icons/add_new_transactions.png"
                                  }
                                />
                              </span>
                            </Tooltip>
                          </button>
                        )}

                        {/* )} */}
                        <>
                          {item?.account?.meta.hasOwnProperty(
                            "subscriptionDocuments"
                          ) ? (
                            <>
                              {checkSubscriptionAllow(item?.account?.fund) &&
                                item?.account?.status == "accepted" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/profile/detail/${item?.identityId}/${item?.accountId}?event="additional"`,
                                          {
                                            state: { isSignAgreement: false },
                                          }
                                        )
                                      }
                                      className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6 rounded-md border-[1px] border-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} bg-color-iconButton-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                                      
                                    >
                                      <Tooltip content="Additional Investment" position="upper">
                                        
                                        <span>
                                          <img
                                            className={
                                              "sm:h-[20px] sm:w-[20px] xs:w-[16px] xs:h-[16px] w-[10px] h-[10px]"
                                            }
                                            src={
                                              "/img/transaction-icons/subscription.svg"
                                            }
                                          />
                                        </span>
                                      </Tooltip>
                                    </button>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/profile/detail/${item?.identityId}/${item?.accountId}?event="redemption"`,
                                          {
                                            state: { isSignAgreement: false },
                                          }
                                        )
                                      }
                                      className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6 rounded-md border-[1px] border-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} bg-color-iconButton-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                                     
                                    >
                                      <Tooltip content="Redemption Request" position="upper" className=''>
                                        
                                        <span>
                                          <img
                                            className={
                                              "sm:h-[20px] sm:w-[20px] xs:w-[16px] xs:h-[16px] w-[10px] h-[10px]"
                                            }
                                            src={
                                              "/img/transaction-icons/Redemption.svg"
                                            }
                                          />
                                        </span>
                                      </Tooltip>
                                    </button>
                                  </>
                                )}
                            </>
                          ) : checkSubscriptionAllow(item?.account?.fund) ? (
                            <Link
                              to={`/profile/detail/${item?.identityId}/${item?.accountId}?event=application`}
                              className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6 rounded-md border-[1px] border-color-iconButton-${theme} bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                              
                            >
                              <Tooltip content="Sign Agreement" position="upper" className='left-[-21px] bottom-[24px] text-nowrap'>
                                
                                <span>
                                  <img
                                    className={"sm:h-[20px] sm:w-[20px] xs:w-[16px] xs:h-[16px] w-[10px] h-[10px]"}
                                    src={
                                      "/img/transaction-icons/sign_agreement.png"
                                    }
                                  />
                                </span>
                              </Tooltip>
                            </Link>
                          ) : null}
                        </>
                        <Link
                          to={`/profile/detail/${item?.identityId}/${item?.accountId}`}
                          className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6  rounded-md border-[1px] border-color-iconButton-${theme} bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                                     
                        >
                          <Tooltip content="Account Detail" position="upper" className='left-[-21px] bottom-7 text-nowrap'>
                            
                            <span >
                              {/* <img className={"subscription_list_icons"} src={"/img/transaction-icons/sign_agreement.png"} /> */}
                              <FontAwesomeIcon
                                color="#2C7BE5"
                                icon={faEye}
                                className="sm:text-[16px] text-[12px]"
                              />
                            </span>
                          </Tooltip>
                        </Link>

                        {item?.account?.fund?.meta?.config?.settings?.account
                          ?.transfer?.enabled && (
                          <div
                           
                            onClick={(e) => {
                              handleClickSwicthTransfer(e);
                            }}
                            className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6 rounded-md border-[1px] border-color-iconButton-${theme} bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                                     
                          >
                            <Tooltip content="Transfer" position="upper" className='left-[-21px] bottom-[24px]'>
                              
                              <span>
                                <img
                                  className={"sm:h-[20px] sm:w-[20px] xs:w-[16px] xs:h-[16px] w-[10px] h-[10px]"}
                                  src={"/img/transaction-icons/icons.svg"}
                                />
                              </span>
                            </Tooltip>
                          </div>
                        )}
                        {item?.account?.fund?.meta?.config?.settings?.account
                          ?.switch?.enabled && (
                          <div
                           
                            onClick={(e) => {
                              handleClickSwicthTransfer(e);
                            }}
                            className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6 rounded-md border-[1px] border-color-iconButton-${theme} bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                                     
                          >
                            <Tooltip content="Switch" position="upper" className='left-[-21px] bottom-[24px]'>
                             
                              <span>
                                <img
                                  className={"sm:h-[20px] sm:w-[20px] xs:w-[16px] xs:h-[16px] w-[10px] h-[10px]"}
                                  src={"/img/transaction-icons/switch.png"}
                                />
                              </span>
                            </Tooltip>
                          </div>
                        )}
                        {(item?.account?.status == "draft" ||
                          item?.account?.status == "pending") && (
                          <div
                           
                            onClick={(e) => {
                              hanleDeleteAccount(e, item.accountId);
                            }}
                            className={`flex justify-center items-center sm:w-12 sm:h-12 xs:w-8 xs:h-8 w-6 h-6 rounded-md border-[1px] border-color-iconButton-${theme} bg-color-iconButton-${theme} hover:border-color-iconButton-hover-${theme} hover:bg-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out text-xl`}
                                     
                          >
                            <Tooltip content="Delete" position="upper" className='left-[-18px]'>
                              
                              <span>
                                <FontAwesomeIcon
                                  color="red"
                                  icon={faTrash}
                                  // style={{ fontSize: "16" }}
                                  className="sm:text-[16px] text-[12px]"
                                />
                              </span>
                            </Tooltip>
                          </div>
                        )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-6 md:flex-row justify-center mb-5 w-full">
                        <div className="w-full md:ml-4 md:flex md:flex-row md:justify-between flex flex-col gap-4 ">
                            <div  className={`bg-color-card-${theme} rounded-lg border-color-${theme} border-[1px] shadow-${theme} py-2 px-4 md:w-[50%] w-full`}>
                              <div className="flex flex-col md:flex-row justify-between gap-1 w-full">
                                <div className={`flex gap-4 w-full `}>
                                  <div className="flex items-center space-x-4">
                                    <a href="#!" className="avatar avatar-lg">
                                      {
                                        item?.identity?.type == "INDIVIDUAL" ? (
                                          <img
                                            src="/img/investor/default-avatar.png"
                                            alt="..."
                                            className="w-16 rounded-full"
                                          />
                                        ) : (
                                          <EntityIcon
                                            className={"nodeIcon"}
                                            fontSize={"large"}
                                            color={"action"}
                                            style={{
                                              fill:
                                                theme == "dark" ||
                                                theme == undefined
                                                  ? "white"
                                                  : "black",
                                            }}
                                          />
                                        )
                                        // <img src="/img/office-building-icon-32.png" alt="..." className="avatar-img rounded-circle" />
                                      }
                                    </a>
                                  </div>
                                  <div className={`flex flex-col w-full `}>
                                    <h4 className="mb-1">
                                      <p
                                        style={{ marginBottom: "0px" }} className={`text-color-fundName-${theme} xs:text-[15px] text-[12px] font-light`}
                                      >{`${item?.identity?.label}`}</p>
                                    </h4>
<div>
                                    
                                      {/* {item?.identity?.type.toLowerCase() ==
                                      "corporate"
                                      ? "Country of Incorporation: "
                                      : "Citizenship: "} */}
                                      {item?.identity?.type.toLowerCase() ===
                                        "corporate" && (
                                        <>
                                        <p className={`flex items-center gap-2 sm:text-[13px] xs:text-[10px] text-[8px] font-light text-color-sidebar-icon-${theme} `}>
                                          Country of Incorporation:{" "}
                                          {item?.identity?.meta?.data[
                                            item?.identity?.type.toLowerCase() +
                                              ".basic.country_of_residence_code"
                                          ]?.value ||
                                            item?.identity?.meta?.data[
                                              item?.identity?.type.toLowerCase() +
                                                ".basic.incorporate_country_code"
                                            ]?.value}{" "}
                                          <span className="flex">
                                            <FeatherIcon
                                              className={`text-[15px]`}
                                              icon="check-circle"
                                              color="#3DA500"
                                              size="15"
                                            />
                                            <br />
                                          </span>
                                          </p>
                                        </>
                                      )}
                                      
                                      {item?.identity?.type.toLowerCase() !==
                                        "corporate" && (
                                        <>
                                          <p className={`flex items-center gap-2 sm:text-[13px] xs:text-[10px] text-[8px] font-light text-color-sidebar-icon-${theme}`}>
                                            Nationality:{" "}
                                            {getCountryNameFromEnums(
                                              item?.identity?.meta?.data[
                                                item?.identity?.type.toLowerCase() +
                                                  ".basic.country_of_residence_code"
                                              ]?.value
                                                ? item?.identity?.meta?.data[
                                                    item?.identity?.type.toLowerCase() +
                                                      ".basic.nationality_code"
                                                  ]?.value
                                                : item?.identity?.meta?.data[
                                                    item?.identity?.type.toLowerCase() +
                                                      ".basic.nationality_code"
                                                  ]?.value
                                            )}{" "}
                                            <span className="">
                                              <FeatherIcon
                                                className={``}
                                                icon="check-circle"
                                                color="#3DA500"
                                                size="15"
                                              />
                                            </span>
                                          </p>

                                          <p className={`flex items-center gap-2 sm:text-[13px] xs:text-[10px] text-[7px] font-light text-color-sidebar-icon-${theme}`}>
                                            Country Of Residence:{" "}
                                            <span
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            >
                                              {getCountryNameFromEnums(
                                                item?.identity?.meta?.data[
                                                  item?.identity?.type.toLowerCase() +
                                                    ".basic.country_of_residence_code"
                                                ]?.value ||
                                                  item?.identity?.meta?.data[
                                                    item?.identity?.type.toLowerCase() +
                                                      ".basic.incorporate_country_code"
                                                  ]?.value
                                              )}
                                            </span>{" "}
                                            <span className="text-success">
                                              <FeatherIcon
                                                className={`text-success`}
                                                icon="check-circle"
                                                color="#3DA500"
                                                size="15"
                                              />
                                            </span>
                                          </p>
                                        </>
                                      )}
                                      {/* <br /> */}
                                      <p className={`flex items-center gap-2 sm:text-[13px] xs:text-[10px] text-[8px] font-light text-color-sidebar-icon-${theme}`}>
                                      Customer Type:
                                      <>
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {item?.identity?.type.toLowerCase()}
                                        </span>{" "}
                                        <span className="text-success">
                                          <FeatherIcon
                                            className={`text-success`}
                                            icon="check-circle"
                                            color="#3DA500"
                                            size="15"
                                          />
                                        </span>
                                      </>
                                    
</p>
                                    </div>

                                    <p className={`sm:text-[13px] xs:text-[10px] text-[8px] font-light text-color-fundName-${theme}`}>
                                      <span className=""> </span>{" "}
                                      Subscription Type:{" "}
                                      {item?.account?.scount == 1
                                        ? "Standalone"
                                        : "Joint Account"}
                                    </p>
                                    <p className={`sm:text-[13px] xs:text-[10px] text-[8px] font-light text-color-fundStatus-${theme} `}>
                                      <span
                                        className={
                                          item?.account?.status == "pending" ||
                                          item?.account?.status == "draft"
                                            ? ""
                                            : ""
                                        }
                                      >
                                        {" "}
                                      </span>{" "}
                                      <span className={`text-color-fundName-${theme}`}>Status:{" "}</span>
                                      
                                      {item?.account?.status?.replace(
                                        /^\w/,
                                        (c) => c.toUpperCase()
                                      )}
                               {item?.account?.status === "pending" &&
                                    " For Screening"}
                                    </p>
                                  </div>
                                </div>
                            </div>
                          </div>
                          {(item?.account?.fund?.meta?.config?.settings?.display
                            ?.fund_info === true ||
                            item?.account?.fund?.meta?.config?.settings?.display
                              ?.fund_info == "true") && (
                            <>
                              {item?.account?.fundId == 3 ||
                              item?.account?.fundId == 351 ||
                              item?.account?.fundId == 1 ||
                              item?.account?.fundId == 215 ? (
                                <div className={`bg-color-card-${theme} md:w-[50%] w-full rounded-lg border-color-${theme} border-[1px] shadow-${theme}  px-4 py-4 lg:mr-0 mr-6`}>
                                  <div className="flex flex-col items-center gap-4">
                                    <div className="flex flex-col gap-6 md:flex-row justify-center mb-5 w-full">
                                      <div className="w-full md:mr-4 md:flex md:justify-between ">
                                        <div className="col-sm-6">
                                          <div className={` rounded-lg  px-4 w-full flex justify-between `}>
                                            <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="clock"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              {/* Dealing Every Month */}
                                              {/* Dealing Cycle: Open  */}
                                              Launch Date: 5 May 2021
                                              {/* {item?.account?.fund?.meta?.config?.settings?.dealing?.period ? item?.account?.fund?.meta?.config?.settings?.dealing?.period : item?.account?.fund?.meta?.config?.settings?.dealing?.period} */}
                                              </p>
                                            </small>
                                          </div>

                                          <div className={` rounded-lg  px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>
                                                
                                              Launch Price: SGD: 10:00
                                              </p>
                                            </small>
                                          </div>
                                          <div className={` rounded-lg  px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>
                                                
                                              Last Dividend: 1.50
                                              </p>
                                            </small>
                                          </div>
                                          <div className={` rounded-lg px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              Dividend Frequency: Monthly
                                              </p>
                                            </small>
                                          </div>
                                          <div className={` rounded-lg  px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>{" "}
                                              Min Initial Amount: SGD 1,000:00
                                            </small>
                                          </div>
                                        </div>
                                        <div className="col-sm-6">
                                          <div className={` rounded-lg px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              Latest Nav Price: SGD 6.1595
                                              </p>
                                            </small>
                                          </div>
                                          <div className={` rounded-lg  px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              Past 1 Month: 0.26%
                                              </p>
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="">
                                  <div className="">
                                    <div className="">
                                      <div className="">
                                        <div className="">
                                          <div className={` rounded-lg px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="clock"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              {/* Dealing Every Month */}
                                              {/* Dealing Cycle: Open  */}
                                              Dealing Cycle:{" "}
                                              {item?.account?.fund?.meta?.config
                                                ?.settings?.dealing?.type?.end
                                                ? item?.account?.fund?.meta
                                                ?.config?.settings?.dealing
                                                ?.type?.end
                                                : item?.account?.fund?.meta
                                                ?.config?.settings?.dealing
                                                ?.type?.end}
                                              {/* {item?.account?.fund?.meta?.config?.settings?.dealing?.period ? item?.account?.fund?.meta?.config?.settings?.dealing?.period : item?.account?.fund?.meta?.config?.settings?.dealing?.period} */}
                                                </p>
                                            </small>
                                          </div>

                                          <div className={` rounded-lg  py-2 px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              Fund's KYC:
                                              {
                                                item?.account?.fund?.meta
                                                ?.config?.kyb?.status
                                              }
                                              </p>
                                            </small>
                                          </div>
                                          <div className={` rounded-lg  py-2 px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              Digital Fund:
                                              {item?.account?.fund?.meta?.config
                                                ?.settings?.account?.applicant
                                                ?.asset?.digital?.status
                                                ? "Active"
                                                : "Not Active"}
                                                </p>
                                            </small>
                                          </div>
                                          <div className={` rounded-lg  py-2 px-4 w-full flex justify-between`}>
                                          <small className={`xl:text-[13px] text-[11px] font-light text-color-sidebar-icon-${theme} flex items-center gap-2`}>
                                              <span className="text-success">
                                                <FeatherIcon
                                                  className={`text-success`}
                                                  icon="check-circle"
                                                  color="#3DA500"
                                                  size="15"
                                                />
                                              </span>
                                              <p>

                                              Fund Domicile:
                                              {
                                                item?.account?.fund?.meta
                                                ?.config?.settings?.region
                                              }
                                              </p>
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          </div>
          {isLoaderAccount && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20rem",
              }}
            >
              <LoadingSpinner theme={theme} />
            </div>
          )}
          {/* {
          isLoader && (
            <LoadingSpinner animation="grow" custom={true} height="20vh" />
          )
        } */}
        </div>
      </div>
      <Modal
        size="md"
        show={deleteAccountModal}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Confirmation Message</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <div>
              <h4>Are you sure, you would like to delete this application?</h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="btn btn-sm btn-danger  custom-responsive-btn"
                  onClick={(e) => {
                    handleDeleteAccountConfirm(e);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal
        size="md"
        show={switchTransferModal}
        onHide={closeModalSwitchModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Coming Soon!</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <div>
              <h4>This Feature is in progress!</h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="btn btn-sm btn-danger  custom-responsive-btn"
                  onClick={(e) => {
                    setSwitchTransferModal(false);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
