import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Tooltip from "../../../components/tooltip/Tooltip";
import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
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

export default function AccountStep(props) {
  console.log(props, "props props props props AccountStep");
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
    console.log(
      fundData,
      "fundData fundData fundData checkIfDataSelectedForButtons"
    );
    console.log(
      dataToSend,
      "dataToSend dataToSend dataToSend checkIfDataSelectedForButtons"
    );
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
      console.log(
        response?.data?.reference_document?.term_documents?.[
          response?.data?.reference_document?.term_documents?.length - 1
        ]?.is_required,
        "response?.data?.reference_document?.term_documents?.[response?.data?.reference_document?.term_documents?.length-1]?.is_required"
      );

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
  console.log("options is great ", options);
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
      className={`bg-gradient-stepper-card-${theme} w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mx-auto p-10 md:ml-4 md:mt-12 rounded-lg text-white flex flex-col justify-center`}
    >
      <div
        className={`ml-20 mr-20 flex flex-col items-center bg-transparent font-${theme} text-${theme}`}
      >
        <h3
          className={`text-color-h3-${theme} text-2xl sm:text-xl md:text-2xl font-light mt-6`}
        >
          Let's start with the basics.
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-light mt-2 text-center sm:text-left">
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
                <div className="relative w-full mt-4 mb-10">
                  <input
                    placeholder="Enter The Account Code"
                    className={`bg-color-textfield-dropdown-${theme} text-color-text-${theme} w-full p-3 xs:pl-8 pl-4 rounded-full border border-color-dropdown-${theme} shadow-${theme} focus:outline-none xs:text-lg text-xs`}
                    type="text"
                    value={fundCode}
                    onChange={(event) => setFundCode(event.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    disabled={fundCode?.length > 1 ? false : true}
                    onClick={() => getFundForJoinApi()}
                    className={`absolute right-[1px] top-[1px] xs:py-[18px] py-[12px] sm:px-8 xs:px-6 px-4 rounded-r-full  ${
                      fundCode ? "bg-[#2bb02a]" : "bg-[#0f9969]"
                    } text-white`}
                  >
                    <HiSearch size="20px" />
                  </button>
                </div>
              )}
              {fundData && (
                <>
                  <div
                    className={`flex flex-col sm:flex-row bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[10%] w-[90%] sm:w-[80%] mt-8 items-center p-4`}
                  >
                    {fundData?.fund_setting?.display?.fund_info === true ||
                    fundData?.fund_setting?.display?.fund_info == "true" ? (
                      <div className="flex items-center">
                        <img
                          className="w-15 h-12 mr-2 rounded-[3px]"
                          src={
                            fundData?.logoBucketKey
                              ? fundData?.logoBucketKey
                              : fundData?.fund_logo_url
                          }
                        />
                        <span
                          className={`text-color-${theme} text-sm font-normal`}
                        >
                          {fundData?.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <img
                          className="w-15 h-12 mr-2 rounded-[3px]"
                          src={
                            fundData?.logoBucketKey
                              ? fundData?.logoBucketKey
                              : fundData?.fund_logo_url
                          }
                        />
                        <span
                          className={`text-color-${theme} text-sm font-normal`}
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
                            className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light mb-4 sm:mb-0`}
                          >
                            <small className="flex items-center">
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

                            <small className="text-slate-500 flex items-center">
                              <span>
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
                            className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light`}
                          >
                            <small className="flex items-center">
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
                              <small className="text-slate-500 flex items-center">
                                <span>
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
                        className={`bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[20%] w-[90%] sm:w-[80%] mt-8 p-4`}
                      >
                        <div
                          className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}
                        >
                          <h4
                            className={`text-color-${theme} text-xs font-extrabold m-3`}
                          >
                            Account Description
                          </h4>
                        </div>

                        {fundData?.description && (
                          <p
                            className={`text-color-${theme} text-xs sm:text-sm font-light p-3`}
                          >
                            {fundData?.description}
                          </p>
                        )}
                      </div>
                    )}
                  {fundData?.reference_document?.documents?.length > 0 && (
                    <div>
                      <div
                        className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] sm:h-[10%] sm:w-[80%] mt-4 w-[80%] justify-between items-center`}
                      >
                        <h4
                          className={`text-color-${theme} text-xs sm:text-sm font-extrabold m-3`}
                        >
                          Reference Documents
                        </h4>
                        <Button
                          onClick={toggleCollapse}
                          variant="link"
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                        </Button>
                      </div>
                      {!isCollapsed && (
                        <div className="w-[80%] mt-4">
                          {fundData?.reference_document?.documents &&
                            fundData?.reference_document?.documents.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-lg p-3 mb-2`}
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
                                        <Button
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
                                        </Button>
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

                  <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
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
                                  {/* <Select
                                    placeholder="Select Identity"
                                    isSearchable={true}
                                    styles={customStyles}
                                    filterOption={customFilter}
                                    options={
                                      options[0] != undefined &&
                                      options[0] != "undefined"
                                        ? options
                                        : {
                                            value: "",
                                            label: (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                There is no Identity available
                                                to attached this fund
                                              </div>
                                            ),
                                          }
                                    }
                                    value={
                                      selectedIdentity.value == ""
                                        ? {
                                            value: "",
                                            label: "Please select an identity", // Change this to your desired prompt
                                          }
                                        : selectedIdentity
                                    }
                                    onChange={(selectedOption) =>
                                      setSelectedIdentity(selectedOption)
                                    }
                                  /> */}
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
                                <Tooltip content="Create New Identity">
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
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <p style={{ color: "gray" }}>
                                No options available. Please create a new one.
                              </p>
                              <Tooltip content="Create New Identity">
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
                                      <Button
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
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            onClick={props.handleChangeTermsCondition}
                            variant="success"
                          >
                            Accept All
                          </Button>
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
            <Alert
              closeLabel
              style={{ marginTop: "30px" }}
              dismissible={true}
              onClose={() => setAlertJoinFund(false)}
              key="danger"
              variant="danger"
            >
              Account Not Found
            </Alert>
          ) : null}
        </>
        <Modal
          size="md"
          show={customizeModal}
          onHide={handleClickCustomizeTC}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            {/* <Modal.Header closeButton> */}
            <Modal.Title>
              <div>
                <h1>Disclaimer Notice</h1>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Please review the following Disclaimer and click "I Accept" to
              continue.
            </p>
            <p>
              First Degree Global Asset Management Pte Ltd (
              <strong>First Degree</strong>) is regulated as a Capital Markets
              Services License-holder for Fund Management (LFMC) by the Monetary
              Authority of Singapore ("MAS). The material on this website is
              provided for your general information only and does not constitute
              the giving of investment advice or an offer to sell or the
              solicitation of an offer to buy any investment(s) managed or
              advised on by First Degree.
            </p>
            <p>
              By clicking "I accept", this means you accept the following terms
              and conditions of use of this website:
            </p>
            <ol>
              <li>
                You agree that you <strong>are an</strong>{" "}
                <a
                  target="_blank"
                  href="https://storage.googleapis.com/one-constellation-bucket-public/first_degree/terms_and_conditions.pdf"
                >
                  Accredited Investor or Institutional Investor as defined under
                  section 4A of the Securities and Futures Act (Cap. 289) of
                  Singapore
                </a>
                , and that you are aware of the reduced protections being
                accorded to you by being treated as an Accredited or
                Institutional Investor
              </li>
              <li>
                No person receiving a copy of the offering documents including
                any application forms and subscription agreements used herein to
                subscribe for Participating Shares (the "Subscription Form") in
                any jurisdiction may treat the same as constituting an
                invitation to him or her, unless in the relevant jurisdiction
                such an invitation could lawfully be made to him without
                compliance with any registration or other legal requirements or
                where such requirements have been complied with.
              </li>
              <li>
                First Degree makes no representations or warranties whatsoever
                about any of the content of this website or about content of any
                other website which you may access by hypertext link through
                this website. When you access any other website by means of a
                link from this website, you should understand that your access
                to that other website is independent of First Degree and First
                Degree has no control over the content of the website, nor does
                First Degree in any way endorse or approve the content of that
                website.
              </li>
              <li>
                You agree with our{" "}
                <a
                  target="_blank"
                  href="https://storage.googleapis.com/one-constellation-bucket-public/first_degree/privacy_policy.pdf"
                >
                  data protection policy.
                </a>
              </li>
            </ol>
            <p>
              If you are in any doubt about the information contained on this
              website please contact us or consult your professional{" "}
              <strong>financial adviser, lawyer or accountant</strong>.
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleClickADeclinedCustomize();
                }}
              >
                I Decline
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  handleClickAgreeCustomize();
                }}
              >
                I Accept
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
