import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Tooltip from "../../../components/tooltip/Tooltip";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  getFundForJoin,
  getIdentityList,
  postIdentityAttatchWithFund,
} from "../../../api/network/CustomerApi";
import axios from "axios";
import { HiUserAdd } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
import Loader from "../../../components/ui/loader";
import NewIdentitySection from "./NewIdentitySection";
import { useTheme } from "../../../contexts/themeContext";
import TermsCondition from "../../../components/modal/TermsCondition";

export default function AccountStep(props) {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [fundCode, setFundCode] = useState("");
  const [descriptionText, setDescriptionText] = useState(
    "Please enter the account joining code which you would have received from the account owner."
  );
  const [selectedIdentity, setSelectedIdentity] = useState({ value: "" });
  const [isNewIdentity, setIsNewIdentity] = useState(false);
  const [selectedIdentityData, setSelectedIdentityData] = useState();
  const [selectedIdentityMessageShow, setSelectedIdentityMessageShow] =
    useState(false);

  const [identitiesData, setIdentitiesData] = useState([]);
  const [fundData, setFundData] = useState(null);
  const [customizeModal, setCustomizeModal] = useState(false);
  const [isShowIdentityNewButton, setIsShowIdentityNewButton] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (fundData) {
      handleGetIdentityList();
    }
  }, [fundData]);
  useEffect(() => {
    //
    if (isShowIdentityNewButton) {
      setSelectedIdentity({ value: null });
      setIsNewIdentity(true);
    }
  }, [identitiesData]);
  useEffect(() => {
    let dataToSend = {
      fund_id: fundData?.id,
      identity_id: selectedIdentity.value,
      selectedIdentityData: selectedIdentityData,
      isIndividual: selectedIdentityData
        ? selectedIdentityData?.type.toLowerCase() == "individual"
          ? true
          : false
        : true,
      fund_data: fundData,
    };
   
    props.checkIfDataSelectedForButtons(dataToSend);
  }, [fundData, selectedIdentity, selectedIdentityData]);
  useEffect(() => {
    const selectedIdentityData = identitiesData.filter((item) => {
      return item.id == selectedIdentity.value;
    });
    setSelectedIdentityData(...selectedIdentityData);
  }, [selectedIdentity]);
  const [alertJoinFund, setAlertJoinFund] = useState(false);

  const handleGetIdentityList = async () => {
    setIsLoader(true);

    const response = await getIdentityList(
      cancelTokenSource.token,
      fundData?.id
    );
    if (fundData?.config?.reference?.customizeTC) {
      handleClickCustomizeTC();
    }
    if (response.success == true) {
      if (response?.data?.length > 0) {
        setIsShowIdentityNewButton(false);
      } else {
        setIsShowIdentityNewButton(true);
      }
      setIsLoader(false);
      const identities =
        fundData?.fund_setting?.account?.applicant?.identity?.corporate
          ?.enabled &&
        fundData?.fund_setting?.account?.applicant?.identity?.indivisual
          ?.enabled
          ? response?.data
          : fundData?.fund_setting?.account?.applicant?.identity?.indivisual
              ?.enabled
          ? response?.data?.filter((item) => item?.type == "INDIVIDUAL")
          : response?.data?.filter((item) => item?.type == "CORPORATE");
      setTimeout(function () {
        if (params?.identity_id) {
          selectedIdentity.value = params?.identity_id;
          setSelectedIdentity(selectedIdentity);
        }
      }, 200);
      const selectedIdentityData = response?.data.filter((item) => {
        return item.id == params?.identity_id;
      });
      setSelectedIdentityData(...selectedIdentityData);

      setIdentitiesData(identities);
    } else {
      setIsLoader(false);
    }
  };
  const getFundForJoinApi = async () => {
    setIsLoader(true);
    setAlertJoinFund(false);

    const response = await getFundForJoin(fundCode, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setFundData(response?.data);
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
    

      setDescriptionText(
        "Please select if you are applying as an individual or corporate. You may an attach an existing identity or create a new one."
      );
    } else {
      setIsLoader(false);
      setAlertJoinFund(true);
    }
  };

  const handleCancel = () => {
    navigate("/subscription-list");
  };
  const customFilter = (option, searchText) => {
    if (
      option.data.label.props.children[1]
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      option.data.value.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };
  let options = [];
  let selectedIdentityValue = {};
  options = identitiesData
    .map((item) => {
      if (selectedIdentity == item?.id) {
        selectedIdentityValue = {
          value: item.id,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  marginRight: "5px",
                }}
              />
              {`${item.label} (${item.type})`}
            </div>
          ),
        };
      }

      const dotColor = item.status === "active" ? "green" : "grey";

      if (
        (fundData?.fund_setting?.account?.applicant?.identity?.indivisual
          ?.enabled == "true" ||
          fundData?.fund_setting?.account?.applicant?.identity?.indivisual
            ?.enabled == true) &&
        (fundData?.fund_setting?.account?.applicant?.identity?.corporate
          ?.enabled == "true" ||
          fundData?.fund_setting?.account?.applicant?.identity?.corporate
            ?.enabled == true)
      ) {
        return {
          value: item.id,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  marginRight: "5px",
                }}
              />
              {`${item.label} (${item.type})`}
            </div>
          ),
        };
      } else if (
        (fundData?.fund_setting?.account?.applicant?.identity?.indivisual
          ?.enabled == "true" ||
          fundData?.fund_setting?.account?.applicant?.identity?.indivisual
            ?.enabled == true) &&
        item?.type === "INDIVIDUAL"
      ) {
        return {
          value: item.id,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  marginRight: "5px",
                }}
              />
              {`${item.label} (${item.type})`}
            </div>
          ),
        };
      } else if (
        (fundData?.fund_setting?.account?.applicant?.identity?.corporate
          ?.enabled == "true" ||
          fundData?.fund_setting?.account?.applicant?.identity?.corporate
            ?.enabled == true) &&
        item?.type === "CORPORATE"
      ) {
        return {
          value: item.id,
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  marginRight: "5px",
                }}
              />
              {`${item.label} (${item.type})`}
            </div>
          ),
        };
      }
    })
    .filter((option) => option !== undefined);

  if (options?.length === 0) {
    options = [
      { label: <p disabled={true}>No options available</p>, value: null },
    ];
  }
  const shouldShowSelect =
    options?.length > 1 || (options?.length === 1 && options[0].value !== null);
  const checkIfDataSelected = (data) => {
    data["fund_id"] = fundData?.id;
    data["fund_data"] = fundData;
    data["identity_id"] = selectedIdentity.value;
    data["isNewIdentity"] = isNewIdentity;
    props.checkIfDataSelectedForButtons(data);
  };
  const handleClickReferenceDocument = (url) => {
    window.open(url, "_blank");
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && fundCode?.length > 1) {
      getFundForJoinApi();
    }
  };
  const handleClickCustomizeTC = () => {
    setCustomizeModal(!customizeModal);
  };
  const handleClickAgreeCustomize = (e) => {
    handleClickCustomizeTC();
    props.handleChangeTermsCondition();
  };
  const handleClickADeclinedCustomize = (e) => {
    handleClickCustomizeTC();
    navigate("/");
  };
  return (
    <div
       >
      <div
        className={`ml-10 mr-10 flex flex-col items-center bg-transparent `}
      >
        <h3
          className={`text-color-h3-${theme} text-base xs:text-xl md:text-2xl font-light mt-6`}
        >
          Let's start with the basics.
        </h3>
        <p className={`text-color-description-${theme} text-xs sm:text-sm  font-light mt-2 text-center `}>
          {descriptionText}
        </p>
        <>
          {isLoader ? (
            <div className="flex justify-center items-center h-[20rem]">
              <Loader />
            </div>
          ) : (
            <>
              {!fundData && (
                <div className="relative w-full mt-10 mb-10">
                  <input
                    placeholder="Enter The Account Code"
                    className={`bg-color-textfield-dropdown-${theme} text-color-text-${theme} w-[93%]  xl:w-[96.8%] py-[14px] px-2 xs:pl-6 pl-4 rounded-l-full border border-color-dropdown-${theme} shadow-${theme} focus:outline-none xs:text-[15px] text-xs placeholder:text-sm`}
                    type="text"
                    value={fundCode}
                    onChange={(event) => setFundCode(event.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    disabled={fundCode?.length > 1 ? false : true}
                    onClick={() => getFundForJoinApi()}
                    className={`absolute right-[1px] xs:py-[13px] py-[12px] sm:px-8 xs:px-6 px-4 rounded-r-full  ${
                      fundCode ? `bg-[#3DA500] hover:bg-[#348a01] transition-all ease-in-out duration-300` : "bg-[#0f9969] "
                    } text-white`}
                  >
                    <HiSearch size="20px" className={`${fundCode ? 'text-white':'text-[#adb5c0]'}`}/>
                  </button>
                </div>
              )}
              {fundData && (
                <>
                  <div
                    className={`flex flex-col gap-4 md:flex-row bg-color-card-header-${theme} shadow-${theme} justify-between rounded-lg border border-color-${theme}  h-auto sm:h-[10%] w-[90%] sm:w-[95%] mt-8 items-start px-4 py-2`}
                  >
                    {fundData?.fund_setting?.display?.fund_info === true ||
                    fundData?.fund_setting?.display?.fund_info == "true" ? (
                      <div className="flex items-center md:w-1/3 w-full">
                        <img
                          className="w-18 h-16 mr-2 "
                          src={
                            fundData?.logoBucketKey
                              ? fundData?.logoBucketKey
                              : fundData?.fund_logo_url
                          }
                        />
                        <span
                          className={`text-color-${theme} lg:text-lg md:text-sm xs:text-lg text-sm font-normal`}
                        >
                          {fundData?.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center md:w-1/3 w-full">
                        <img
                          className="w-18 h-16 mr-2 "
                          src={
                            fundData?.logoBucketKey
                              ? fundData?.logoBucketKey
                              : fundData?.fund_logo_url
                          }
                        />
                        <span
                          className={`text-color-${theme} lg:text-lg md:text-sm xs:text-lg text-sm font-normal`}
                        >
                          {fundData?.name}
                        </span>
                      </div>
                    )}
                    {(fundData?.fund_setting?.display?.fund_info === true ||
                      fundData?.fund_setting?.display?.fund_info == "true") && (
                      <>
                        <>
                          <div
                            className={`text-color-${theme}  lg:text-lg md:text-sm xs:text-xl text-sm font-light mb-4 sm:mb-0 md:w-1/3 w-full`}
                          >
                            <small className="flex items-center gap-1">
                              <span>
                                <FeatherIcon
                                  className={`text-color-button1-${theme}`}
                                  icon="check-circle"
                                  color="green"
                                  size="15"
                                />
                              </span>
                              Fund's KYC:{" "}
                              {fundData?.fund_setting?.kyb?.status
                                ? fundData?.fund_setting?.kyb?.status
                                : fundData?.meta?.config?.kyb?.status}
                            </small>

                            <small className="text-slate-500 lg:text-base md:text-xs sm:text-lg text-xs flex items-center">
                              <span className="flex items-center gap-1">
                                <FeatherIcon
                                  className={`text-color-button1-${theme}`}
                                  icon="check-circle"
                                  color="green"
                                  size="15"
                                />
                              </span>{" "}
                              Fund Domicile:
                              {fundData?.fund_setting?.region
                                ? fundData?.fund_setting?.region
                                : fundData?.meta?.config?.settings?.region}
                            </small>
                          </div>
                        </>

                        <>
                          <div
                            className={`text-color-${theme} lg:text-lg md:text-sm xs:text-xl text-sm font-light md:w-1/3 w-full`}
                          >
                            <small className="flex items-center gap-1">
                              <FeatherIcon
                                className={`text-color-button1-${theme}`}
                                icon="clock"
                                color="green"
                                size="15"
                              />{" "}
                              Dealing Cycle:{" "}
                              {fundData?.fund_setting?.dealing?.type?.end
                                ? fundData?.fund_setting?.dealing?.type?.end
                                : fundData?.fund_setting?.dealing?.type?.end}
                            </small>

                            {fundData?.fund_setting?.account?.applicant?.asset
                              ?.digital?.status && (
                              <small className="text-slate-500 lg:text-base md:text-xs xs:text-lg text-xs flex items-center">
                                <span className="flex items-center gap-1">
                                  <FeatherIcon
                                    className={`text-color-button1-${theme}`}
                                    icon="check-circle"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Digital Fund:
                                {fundData?.fund_setting?.account?.applicant
                                  ?.asset?.digital?.status
                                  ? fundData?.fund_setting?.account?.applicant
                                      ?.asset?.digital?.status
                                    ? "Active"
                                    : "Not Active"
                                  : fundData?.meta?.config?.settings?.account
                                      ?.applicant?.asset?.digital?.status
                                  ? "Active"
                                  : "Not Active"}
                              </small>
                            )}
                          </div>
                        </>
                      </>
                    )}
                  </div>

                  {fundData?.description &&
                    typeof fundData?.description === "string" &&
                    fundData?.description.trim()?.length > 0 && (
                      <div
                        className={`bg-color-card-${theme} shadow-${theme} rounded-lg border border-color-${theme}  h-auto sm:h-[20%] w-[90%] sm:w-[95%] mt-8`}
                      >
                        <div
                          className={`flex bg-color-card-${theme} shadow-${theme} rounded-t-lg w-full py-2 px-4 border-b border-color-${theme}`}
                        >
                          <h4
                            className={`text-color-${theme} text-sm font-light m-3`}
                          >
                            Account Description
                          </h4>
                        </div>

                        {fundData?.description && (
                          <p
                            className={`text-color-${theme} text-xs sm:text-sm font-light py-3 px-4 mb-4`}
                          >
                            {fundData?.description}
                          </p>
                        )}
                      </div>
                    )}
                  {fundData?.reference_document?.documents?.length > 0 && (
                    <div  className={` bg-color-card-${theme} rounded-lg shadow-${theme} border border-color-${theme} h-[10%] sm:h-[10%] w-[90%] sm:w-[95%] mt-4`}>
                      <div
                         className={`flex justify-between items-center px-4 py-2`}  >
                        <h4
                          className={`text-color-${theme} text-xs sm:text-sm font-light m-3`}
                        >
                          Reference Documents
                        </h4>
                        <button
                          onClick={toggleCollapse}
                          
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                        </button>
                      </div>
                      {!isCollapsed && (
                        <div className="w-[95%] mt-4">
                          {fundData?.reference_document?.documents &&
                            fundData?.reference_document?.documents.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-${theme} p-3 mb-2`}
                                >
                                  <div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <p
                                          className={`mb-0 text-xs font-semibold text-color-${theme}`}
                                        >
                                          {item?.title}
                                        </p>
                                        <p
                                          className={`mb-0 text-xs text-gray-500`}
                                        >
                                          {item?.description}
                                        </p>
                                      </div>
                                      <div>
                                        <button
                                          onClick={(e) =>
                                            handleClickReferenceDocument(
                                              item?.url
                                            )
                                          }
                                          className={`p-2 rounded-full bg-gradient-card-${theme} flex items-center justify-center`}
                                          style={{
                                            height: "30px",
                                            width: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "6px",
                                            marginTop: "5px",
                                            marginBottom: "5px",
                                          }}
                                        >
                                          <FeatherIcon icon="eye" size="1em" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-10 mx-8" />
                  {props?.isAcceptedTermsAndCondition ? (
                    !isNewIdentity && (
                      <div className="flex justify-center">
                        <div className="flex flex-col w-full">
                          {shouldShowSelect && (
                            <label>
                              Select the identity you would like to attach this
                              account
                            </label>
                          )}
                          <div className="flex">
                            {shouldShowSelect ? (
                              <div
                                className="form-group"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ width: "90%" }}>
                                  
                                  <Select
                                    placeholder="Select Identity"
                                    isSearchable={true}
                                    classNamePrefix="tailwind-select" // Tailwind class prefix for customization
                                    filterOption={customFilter}
                                    options={
                                      options && options.length > 0
                                        ? options
                                        : [
                                            {
                                              value: "",
                                              label: (
                                                <div className="flex items-center text-gray-500">
                                                  There is no Identity available
                                                  to attach to this fund
                                                </div>
                                              ),
                                            },
                                          ]
                                    }
                                    value={
                                      selectedIdentity?.value === ""
                                        ? {
                                            value: "",
                                            label: "Please select an identity", // Change this to your desired prompt
                                          }
                                        : selectedIdentity
                                    }
                                    onChange={(selectedOption) =>
                                      setSelectedIdentity(selectedOption)
                                    }
                                    styles={{
                                      control: (provided, state) => ({
                                        ...provided,
                                        borderRadius: "0.375rem", // Tailwind equivalent for rounded-md
                                        borderColor: state.isFocused
                                          ? "rgb(59, 130, 246)"
                                          : "rgb(229, 231, 235)", // focus:ring-blue-500 and border-gray-300
                                        boxShadow: state.isFocused
                                          ? "0 0 0 1px rgb(59, 130, 246)"
                                          : "", // focus ring
                                        "&:hover": {
                                          borderColor: "rgb(209, 213, 219)", // hover:border-gray-300
                                        },
                                      }),
                                      placeholder: (provided) => ({
                                        ...provided,
                                        color: "rgb(156, 163, 175)", // text-gray-400
                                      }),
                                      option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                          ? "rgb(59, 130, 246)" // bg-blue-500 for selected
                                          : state.isFocused
                                          ? "rgb(229, 231, 235)" // hover:bg-gray-100 for hover
                                          : "",
                                        color: state.isSelected
                                          ? "white"
                                          : "rgb(17, 24, 39)", // text-white or text-gray-900
                                      }),
                                      singleValue: (provided) => ({
                                        ...provided,
                                        color: "rgb(17, 24, 39)", // text-gray-900
                                      }),
                                    }}
                                  />
                                </div>
                                <Tooltip content="Create New Identity" position="upper">
                                  <div
                                    style={{
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                      setSelectedIdentity({ value: null }),
                                        setIsNewIdentity(true);
                                      props.setIsNewIdentity(true);
                                    }}
                                  >
                                    <HiUserAdd color="green" size="50px" />
                                  </div>
                                </Tooltip>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          {!shouldShowSelect && (
                            <div className={`flex justify-center flex-col items-center`}
                              
                            >
                              <p className={`text-color-description-${theme}`} >
                                No options available. Please create a new one.
                              </p>
                              <Tooltip content="Create New Identity" position="upper">
                                <div
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    setSelectedIdentity({ value: null }),
                                      setIsNewIdentity(true);
                                  }}
                                >
                                  <HiUserAdd color="green" size="50px" />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div>
                      <div>
                        <h4 className="card-header-title">
                          Terms and Conditions
                        </h4>
                      </div>
                      <div>
                        {!fundData?.config?.reference?.customizeTC &&
                          fundData?.reference_document?.term_documents &&
                          fundData?.reference_document?.term_documents.map(
                            (item, index) => (
                              <div key={index}>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <p className="mb-0">{item?.title}</p>
                                      <p className="mb-0">
                                        {item?.description}
                                      </p>
                                    </div>
                                    <div>
                                      <button
                                        onClick={(e) =>
                                          handleClickReferenceDocument(
                                            item?.url
                                          )
                                        }
                                        className="lift"
                                        style={{
                                          height: "30px",
                                          width: "30px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          padding: "6px",
                                          marginTop: "5px",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        <FeatherIcon icon="eye" size="1em" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <button
                            onClick={props.handleChangeTermsCondition}
                         
                          >
                            Accept All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {isNewIdentity && fundData && (
                <NewIdentitySection
                  handleChangeCkyc={props?.handleChangeCkyc}
                  checkIfDataSelected={checkIfDataSelected}
                  fundData={fundData}
                />
              )}
            </>
          )}

          {alertJoinFund ? (
            <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">Account Not Found</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setAlertJoinFund(false)}
              aria-label="Close"
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a.5.5 0 01.707 0l.707.707a.5.5 0 010 .707L11.414 10l4.348 4.348a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707 0L10 11.414l-4.348 4.348a.5.5 0 01-.707 0l-.707-.707a.5.5 0 010-.707L8.586 10 4.239 5.652a.5.5 0 010-.707l.707-.707a.5.5 0 01.707 0L10 8.586l4.348-4.348z" />
              </svg>
            </button>
          </div>
          ) : null}
        </>
        <TermsCondition
        show={customizeModal}
        onHide={handleClickCustomizeTC}
        handleClickADeclinedCustomize={handleClickADeclinedCustomize}
        handleClickAgreeCustomize={handleClickAgreeCustomize}
      />
      </div>
    </div>
  );
}
