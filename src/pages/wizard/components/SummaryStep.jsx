import {
  Col,
  Container,
  Row,
  Nav,
  Spinner,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import React, { useState, useEffect, useLayoutEffect } from "react";
import getMissingDataOfIdentity from "../../../helpers/getMissingDataOfIdentity";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getSingleAccountDetailByIdAPI,
  getParticularFieldsApi,
  getFlatCPRListAPI,
  getParticularsDetailByIdentityIdAPI,
  getIdentityDocument,
  getRequiredDocumentCRP,
} from "../../../api/network/CustomerApi";
import LoadingSpinner from "../../../components/ui/loader/index";
// import { AiOutlineConsoleSql } from "react-icons/ai";
import countries from "../../../helpers/countries";
import CustomerBox from "../../../widgets/components/CustomerBox";
import { useTheme } from "../../../contexts/themeContext";

export default function Summary(props) {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderApplicationStatus, setIsLoaderApplicationStatus] =
    useState(true);
  const [accountData, setAccountData] = useState([]);
  const [particularFields, setParticularFields] = useState([]);
  const [crpListData, setCrpListData] = useState([]);
  const [isCrp, setIsCrp] = useState(false);
  const [identityData, setIdentityData] = useState([]);
  const [crpIdentityUploadDocList, setCrpIdentityUploadDocList] = useState([]);
  const [requiredDocumentList, setRequiredDocumentList] = useState([]);
  const [subscriptionApplicationStatus, setSubscriptionApplicationStatus] =
    useState(false);
  const [requiredSubscriptionDocument, setRequiredSubscriptionDocument] =
    useState(null);
  const [isShowFaceVerificationVCIP, setIsShowFaceVerificationVCIP] =
    useState(false);
  const entityId = localStorage.getItem("entity_id");
  const [searchParams] = useSearchParams();
  const openDocs = searchParams?.get("openDoc") || "";

  useLayoutEffect(() => {
    if (!openDocs || identityData?.type !== "CORPORATE") return;
    props.handleGoToStep("Documents");
    const url = new URL(window.location);
    url.search = ""; // Clear query parameters
    window.history.replaceState({}, "", url.toString());
  }, [openDocs]);

  useEffect(() => {
    if (props?.dataOfAccountSetup) {
     
      if (
        props?.dataOfAccountSetup?.accountData?.meta?.created_by?.portal ==
        "customer"
      ) {
        setIsShowFaceVerificationVCIP(true);
      } else if (
        props?.dataOfAccountSetup?.accountData?.meta?.created_by?.id !=
        localStorage.getItem("login_user_id")
      ) {
        setIsShowFaceVerificationVCIP(true);
      }
    }
  }, [props?.dataOfAccountSetup]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClickReferenceDocument = (url) => {
    window.open(url, "_blank");
  };

  let account_id = props.dataOfAccountSetup?.account_id;

  let identity_id = props.dataOfAccountSetup?.identity_id;
  useEffect(() => {
    props?.getTransactionHistory(account_id);
  }, []);
  let type = props.dataOfAccountSetup?.isIndividual
    ? "individual"
    : "corporate";
  let fundData = props.dataOfAccountSetup?.fund_data;
  let selectedIdentityData = props.dataOfAccountSetup?.selectedIdentityData;
  
  useEffect(() => {
    if (identity_id) {
      setIsLoader(true);
      getCRPList();
      getUploadDocument(identity_id);
      // getSingleAccountDetailById(account_id);
      getParticularFields();
      getRequiredDocument(account_id, identity_id);
    }
  }, [identity_id]);

  useEffect(() => {
    setIsLoaderApplicationStatus(true);

    if (
      requiredSubscriptionDocument !== null &&
      props?.transactionHistoryData
    ) {
     
      let status = matchDocumentType(
        props?.transactionHistoryData,
        requiredSubscriptionDocument
      );
      setSubscriptionApplicationStatus(status);
      setIsLoaderApplicationStatus(false);
    }
  }, [requiredSubscriptionDocument, props?.transactionHistoryData]);
  useEffect(() => {
  }, [isLoaderApplicationStatus]);

  const matchDocumentType = (uploadedDocuments, requiredDocuments) => {
    for (const requiredDoc of requiredDocuments) {
      if (requiredDoc.isRequired) {
        const uploadedDoc = uploadedDocuments[requiredDoc.key];
        if (!uploadedDoc || uploadedDoc.length === 0) {
          return false; // Required document is missing
        } else {
          if (uploadedDoc[0]?.docuSign) {
            if (uploadedDoc[0]?.docuSign?.status) {
              if (uploadedDoc[0]?.docuSign?.status != "signing_complete") {
                return false;
              }
            }
          }
        }
        const uploadedDocIds = uploadedDoc.map((doc) =>
          parseInt(doc.documentTypeId)
        );
        if (!uploadedDocIds.includes(parseInt(requiredDoc.id))) {
          return false; // Required document type is missing
        } else {
          if (uploadedDoc[0]?.docuSign) {
            if (uploadedDoc[0]?.docuSign?.status) {
              if (uploadedDoc[0]?.docuSign?.status != "signing_complete") {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
    // for (let requiredDocument of documentTypes) {
    //   for (const key in documentTypeData) {
    //     if (documentTypeData.hasOwnProperty(key)) {
    //       const documentArray = documentTypeData[key];
    //       console.log(requiredDocument?.id,'requiredDocument?.id')
    //       console.log(documentArray[0].documentTypeId,'documentArray[0].documentTypeId')
    //       if (requiredDocument?.id != documentArray[0].documentTypeId) {
    //         if (requiredDocument?.isRequired) {
    //           return false
    //         }ff
    //       }
    //     }
    //   }
    // }
    // return true;
  };

  const getUploadDocument = async (identity_id) => {
    // setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      // setIsLoader(false);
     
      setCrpIdentityUploadDocList(
        response?.data?.IdentityDocuments
          ? Object.keys(response?.data?.IdentityDocuments)
          : []
      );
    } else {
      // setIsLoader(false);
    }
  };
  const getRequiredDocument = async (account_id, identity_id) => {
    setIsLoaderApplicationStatus(true);
    // setIsLoader(true);

    const response = await getRequiredDocumentCRP(
      account_id,
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      let documentsRequiredCRP = [];
      let subscriptionDocuments = [];
      if (response?.data?.required_documents_types.length > 0) {
        for (let doc of response?.data?.required_documents_types) {
          if (
            doc?.category_key == "DOCUMENT" &&
            doc?.key != "OTHER" &&
            doc?.key != "FACE_VERIFICATION"
          ) {
           
            documentsRequiredCRP.push(doc);
          }

          if (doc?.category_key == "SUBSCRIPTION_DOCUMENT" && doc?.isRequired) {
            subscriptionDocuments.push(doc);
          }
        }
      }
      setRequiredSubscriptionDocument(subscriptionDocuments);
     
      setRequiredDocumentList(documentsRequiredCRP);
      setIsLoaderApplicationStatus(false);
    } else {
      setIsLoaderApplicationStatus(false);

      // setIsLoader(false);
    }
  };
  const handleClickMissingParticularsForCrp = (e, data) => {
    let dataToSend = {
      crp: true,
      crpId: data?.id,
      crpType: data?.type,
    };
    props.handleViewMissingParticulars(dataToSend);
  };
  const handleClickMissingDocumentsForCrp = (e, data) => {
    let dataToSend = {
      crp: true,
      crpId: data?.id,
      crpType: data?.type,
    };
    props.handleViewMissingDocuments(dataToSend);
  };
  const getSpecificIdentity = async (identity_id) => {
    setIsLoader(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      // setLabelIdentity(response.data?.label);
      setIdentityData(response.data);
      if (response?.data?.parentId != "0") {
        setIsCrp(true);
        accountData["attach_identities"] = [{ identity: response?.data }];
        setAccountData(accountData);
    
      } else {
        setIsCrp(false);
      }
    } else {
    }
  };

  const getSingleAccountDetailById = async (accountId) => {
    // setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      accountId,
      cancelTokenSource.token
    );
    // setIsLoader(false);
    if (response.success == true) {
      setAccountData(response?.data?.account_detail);
      getSpecificIdentity(identity_id);
     
    } else {
    }
  };
  const getParticularFields = async () => {
    // setIsLoader(true);
    let account_idss = null;
    if (account_id) {
      account_idss = account_id;
    }
    const response = await getParticularFieldsApi(
      account_idss,
      cancelTokenSource.token
    );
    // setIsLoader(false);
    if (response.success == true) {
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      let array = [];
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      if (account_id) {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
        ];
      } else {
        array = response.data?.fields;
      }
      setParticularFields(array);
    } else {
    }
  };
  const getCRPList = async () => {
    setIsLoader(true);

    const response = await getFlatCPRListAPI(
      identity_id,
      account_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      setCrpListData(response?.data);
    } else {
      setIsLoader(false);
    }
  };

  const handleClickOnStatusBtn = (section) => {
    navigate(
      `/profile/identity/${type}/${section}/${identity_id}/${account_id}/`
    );
  };
  const getDataFromIdentity = (field) => {
    let identityData = selectedIdentityData?.meta?.data
      ? selectedIdentityData?.meta?.data
      : selectedIdentityData?.data;
    if (field == "email" || field == "phone") {
      if (identityData?.[`${type}.extended.${field}`]) {
        if (identityData?.[`${type}.extended.${field}`]?.value) {
          return identityData?.[`${type}.extended.${field}`]?.value;
        }
      }
    }
    if (identityData?.[`${type}.basic.${field}`]) {
      if (identityData?.[`${type}.basic.${field}`]?.value) {
        return identityData?.[`${type}.basic.${field}`]?.value;
      }
    }
  };
  const getCountryName = () => {
    let identityDataValue = selectedIdentityData?.meta?.data
      ? selectedIdentityData?.meta?.data
      : selectedIdentityData?.data;

    let countryCode = "";
    if (type == "individual") {
      if (identityDataValue?.[`${type}.basic.country_of_residence_code`]) {
        if (
          identityDataValue?.[`${type}.basic.country_of_residence_code`]?.value
        ) {
          countryCode =
            identityDataValue?.[`${type}.basic.country_of_residence_code`]
              ?.value;
        }
      }
    } else {
      if (identityDataValue?.[`${type}.basic.incorporate_country_code`]) {
        if (
          identityDataValue?.[`${type}.basic.incorporate_country_code`]?.value
        ) {
          countryCode =
            identityDataValue?.[`${type}.basic.incorporate_country_code`]
              ?.value;
        }
      }
    }
    return getCountryNameFromEnums(countryCode);
  };
  const getCountryNameFromEnums = (countryCode) => {
    let countryName = "";
    if (countries.length > 0) {
      for (let a of countries) {
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
  const checkIfWalleAdded = () => {
    if (
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.bank?.enabled === true ||
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.bank?.enabled == "true"
    ) {
      // if(!props?.dataOfAccountSetup?.bank){
      //     return false
      // }
      return props?.dataOfAccountSetup?.bank;
    }
    if (
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.wallet?.enabled === true ||
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.wallet?.enabled == "true"
    ) {
      // if(!props?.dataOfAccountSetup?.wallet){
      //     return false
      // }
      return props?.dataOfAccountSetup?.wallet;
    }
    return true;
  };
  return (
    <div  className=" flex flex-col justify-center items-center">
      <div className={` bg-color-card-${theme} rounded-lg shadow-${theme} border border-color-${theme} h-[10%] sm:h-[10%] w-[90%] sm:w-[95%] mt-4`}>
        <div className="flex flex-col item-start gap-1 my-2 ">
        <div className="flex flex-col gap-6 md:flex-row items-start w-full">
            {fundData?.fund_setting?.display?.fund_info === true ||
            fundData?.fund_setting?.display?.fund_info == "true" ? (
              <div className="flex items-center md:w-1/3 w-full">
                  <img
                    className="w-16 h-12 rounded-md ml-2 mr-2 "
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
                  <span  className={`text-color-${theme} lg:text-lg md:text-sm xs:text-lg text-sm font-normal`}>{fundData?.name}</span>
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
                        <span className="">
                          <FeatherIcon
                            className={``}
                            icon="check-circle"
                            color="green"
                            size="15"
                          />
                        </span>{" "}
                        Fund's KYC:{" "}
                        {fundData?.fund_setting?.kyb?.status
                          ? fundData?.fund_setting?.kyb?.status
                              .charAt(0)
                              .toUpperCase() +
                            fundData?.fund_setting?.kyb?.status.slice(1)
                          : fundData?.meta?.config?.kyb?.status
                              .charAt(0)
                              .toUpperCase() +
                            fundData?.meta?.config?.kyb?.status.slice(1)}
                      </small>
                  
                     
                      <small className="text-slate-500 lg:text-base md:text-xs sm:text-lg text-xs flex gap-1 items-center">
                              <span className="flex items-center gap-1">
                          <FeatherIcon
                            className={``}
                            icon="check-circle"
                            color="green"
                            size="15"
                          />
                        </span>{" "}
                        Fund Domicile:{" "}
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
                          className={``}
                          icon="clock"
                          color="green"
                          size="15"
                        />{" "}
                       
                        Dealing Cycle:{" "}
                        {fundData?.fund_setting?.dealing?.type?.end
                          ? fundData?.fund_setting?.dealing?.type?.end
                          : fundData?.fund_setting?.dealing?.type?.end}
                      </small>
                   
                    {fundData?.fund_setting?.account?.applicant?.asset?.digital
                      ?.status && (
                        <small className="text-slate-500 lg:text-base md:text-xs xs:text-lg text-xs flex gap-1 items-center">
                                <span className="flex items-center gap-1">
                            <FeatherIcon
                              className={``}
                              icon="check-circle"
                              color="green"
                              size="15"
                            />
                          </span>{" "}
                          Digital Fund:{" "}
                          {fundData?.fund_setting?.account?.applicant?.asset
                            ?.digital?.status
                            ? fundData?.fund_setting?.account?.applicant?.asset
                                ?.digital?.status
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
        </div>
      </div>
      <div
        className={` bg-color-card-${theme} rounded-lg shadow-${theme} border border-color-${theme} h-[10%] sm:h-[10%] w-[90%] sm:w-[95%] mt-4`}
      >
        <div className={`flex justify-between items-center px-4 py-2`}>
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
          <div className="w-full mt-4">
            {fundData?.reference_document?.documents &&
              fundData?.reference_document?.documents.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-${theme} p-3 mb-2`}
                >
                  <div className="flex justify-between w-full">
                    
                      <div className="flex flex-col">
                        <p
                          className={`mb-0 text-xs font-semibold text-color-${theme}`}
                        >
                          {item?.title}
                        </p>
                        <p className={`mb-0 text-xs text-gray-500`}>
                          {item?.description}
                        </p>
                      </div>
                      <div className="flex">
                        <button
                          onClick={(e) =>
                            handleClickReferenceDocument(item?.url)
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
              ))}
          </div>
        )}
      </div>
      <div className={`md:flex md:flex-row flex flex-col justify-between h-[10%] sm:h-[10%] w-[90%] sm:w-[95%] mt-4`}>
        <div
          className={`bg-color-stepstatus-${theme}  rounded-md border-[#1b3050] border-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mb-8 flex flex-col  justify-center h-full md:w-[48%] w-full`}
        >
          <div
            className={`bg-gradient-profile-card-${theme} rounded-md border-color-${theme} border-b-[1px] shadow-${theme}  py-4 px-8 flex justify-between h-full w-full`}
          >
            <h3 className={`text-[10px] xs:text-sm`}>Profile</h3>
          </div>

          
            <div className={`flex flex-col ml-4 my-8 gap-3`}>
              <p className="text-slate-500 uppercase text-sm">Name : {selectedIdentityData?.label}</p>
              {selectedIdentityData?.type === "INDIVIDUAL" && (
                <p className="text-slate-500 uppercase text-sm">
                  Nationality :{" "}
                  {selectedIdentityData?.type === "INDIVIDUAL" &&
                    getCountryNameFromEnums(
                      selectedIdentityData?.meta?.data[
                        "individual.basic.nationality_code"
                      ].value
                    )}
                </p>
              )}
              <p className="text-slate-500 uppercase text-sm">
                {selectedIdentityData?.type === "INDIVIDUAL"
                  ? "Country Of Residence"
                  : "Country for Incorporation"}
                : {getCountryName()}
              </p>
              <p className="text-slate-500 uppercase text-sm">
                Customer Type :{" "}
                {selectedIdentityData?.type
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </p>
              <p className="text-slate-500 uppercase text-sm">Email : {getDataFromIdentity("email")}</p>
              <p className="text-slate-500 uppercase text-sm">Phone : {getDataFromIdentity("phone")}</p>
            </div>
          
          <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3"></div>
        </div>
        <div className="flex flex-col gap-2 md:w-[48%] w-full">
          <div  className={`bg-color-stepstatus-${theme} rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4  w-full text-sm`}>
            <div className="flex justify-between  gap-1 my-2">
              <div className="font-normal text-white">Particulars Form</div>
              <div className="flex  items-center gap-1">
                <div>
                  <span className="text-[#01cc7a] font-light flex items-center gap-1">
                    <FeatherIcon
                      className={`text-[#01cc7a]`}
                      icon="check-circle"
                      color="green"
                      size="15"
                    />{" "}
                    Completed
                  </span>
                </div>
                <div style={{ marginLeft: "10px" }}>
                  <FeatherIcon
                    icon="eye"
                    size="15"
                    onClick={(e) => props.handleGoToStep("Identity Setup")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`bg-color-stepstatus-${theme} rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4 w-full text-sm`}>
            <div className="flex justify-between items-center gap-1 my-2">
              <div className="font-normal text-white">Document Upload</div>
              <div className="flex items-center gap-1">
                <div>
             
                  {getMissingDataOfIdentity(
                    selectedIdentityData,
                    props.dataOfAccountSetup?.fundData,
                    null
                  )?.missingDocuments?.length > 0 ? (
                    <span className="text-[#DC4C64] font-light flex items-center gap-1">
                      <FeatherIcon
                        className={`text-[#DC4C64] font-light`}
                        icon="check-circle"
                        color="red"
                        size="15"
                      />{" "}
                      Incomplete
                    </span>
                  ) : (
                    <span className="text-[#01cc7a]  font-light flex items-center gap-1">
                      <FeatherIcon
                        className={`text-[#01cc7a] font-light`}
                        icon="check-circle"
                        color="green"
                        size="15"
                      />{" "}
                      Completed
                    </span>
                  )}
                </div>
                <div style={{ marginLeft: "10px" }}>
                  <FeatherIcon
                    icon="eye"
                    size="15"
                    onClick={(e) => props.handleGoToStep("Documents")}
                  />
                </div>
              </div>
            </div>
          </div>
          {fundData?.fund_setting?.account?.applicant?.identity[
            type == "individual" ? "indivisual" : "corporate"
          ]?.provider?.verify?.face?.enabled &&
            isShowFaceVerificationVCIP && (
              <div className={`bg-color-stepstatus-${theme} rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4  w-full text-sm`}>
                <div className="flex justify-between items-center gap-1 my-2">
                  <div className="font-normal text-white">Face Verification</div>
                  <div className="flex items-center gap-1">
                    <div>
                      <span
                        className={
                          props?.dataOfAccountSetup?.faceVerification
                            ? "text-[#01cc7a] font-light flex items-center gap-1"
                            : "text-[#DC4C64] font-light flex items-center gap-1"
                            
                        }
                      >
                        <FeatherIcon
                          className={
                            props?.dataOfAccountSetup?.faceVerification
                              ? "text-[#01cc7a] font-light"
                              : "text-[#DC4C64] font-light"
                          }
                          icon="check-circle"
                          color="green"
                          size="15"
                        />
                        {props?.dataOfAccountSetup?.faceVerification
                          ? "Completed"
                          : "Incomplete"}
                      </span>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <FeatherIcon
                        icon="eye"
                        size="15"
                        onClick={(e) =>
                          props.handleGoToStep("Face Verification")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          {fundData?.fund_setting?.account?.applicant?.identity[
            type == "individual" ? "indivisual" : "corporate"
          ]?.provider?.verify?.vcip?.enabled &&
            isShowFaceVerificationVCIP && (
              <div className={`bg-color-stepstatus-${theme} rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4  w-full text-sm`}>
                <div className="flex justify-between items-center gap-1 my-2">
                  <div className="font-normal text-white">VCIP</div>
                  <div className="flex items-center gap-1">
                    <div>
                      <span
                        className={
                          props?.dataOfAccountSetup?.vcip
                            ? "text-[#01cc7a] font-light flex items-center gap-1"
                            : "text-[#DC4C64] font-light flex items-center gap-1 "
                        }
                      >
                        <FeatherIcon
                          className={
                            props?.dataOfAccountSetup?.vcip
                              ? "text-[#01cc7a] font-light"
                              : "text-[#DC4C64] font-light"
                          }
                          icon="check-circle"
                          color="green"
                          size="15"
                        />{" "}
                        {props?.dataOfAccountSetup?.vcip
                          ? "Completed"
                          : "Incomplete"}
                      </span>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <FeatherIcon
                        icon="eye"
                        size="15"
                        onClick={(e) => props.handleGoToStep("VCIP")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          {(props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
            ?.applicant?.identity?.bank?.enabled === true ||
            props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
              ?.applicant?.identity?.bank?.enabled == "true" ||
            props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
              ?.applicant?.identity?.wallet?.enabled === true ||
            props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
              ?.applicant?.identity?.wallet?.enabled == "true") &&
            props?.dataOfAccountSetup?.fund_data?.named_id?.toUpperCase() !==
              "AXSA-WM" && (
              <div className={`bg-color-stepstatus-${theme} rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4  w-full text-sm`}>
                <div className="flex justify-between items-center gap-1 my-2">
                  <div className="font-normal text-white">Bank Wallet</div>
                  <div className="flex items-center gap-1">
                    <div>
                      {/* <span className={props?.dataOfAccountSetup?.bank && props?.dataOfAccountSetup?.wallet ? `` : 'text-danger'}> */}
                      <span
                        className={
                          checkIfWalleAdded() ? "text-[#01cc7a] font-light flex items-center gap-1" : "text-[#DC4C64] font-light flex items-center gap-1"
                        }
                      >
                        <FeatherIcon
                          className={
                            checkIfWalleAdded() ? "text-[#01cc7a] font-light" : "text-[#DC4C64] font-light"
                          }
                          icon="check-circle"
                          color="green"
                          size="15"
                        />{" "}
                        {checkIfWalleAdded() ? "Completed" : "Incomplete"}
                      </span>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <FeatherIcon
                        icon="eye"
                        size="15"
                        onClick={(e) => props.handleGoToStep("Bank/Wallets")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          {fundData?.fund_setting?.account?.subscription?.status && (
            <>
              <div className={`bg-color-stepstatus-${theme} rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4 w-full text-sm`}>
                <div className="flex justify-between items-center gap-1 my-2">
                  <div className="font-normal text-white">Application Document</div>
                  <div className="flex items-center gap-1">
                    <div>
                      {isLoaderApplicationStatus ? (
                        <Spinner
                          color="blue"
                          animation="border"
                          role="status"
                        ></Spinner>
                      ) : (
                        <span
                          className={
                            subscriptionApplicationStatus === false
                              ? "text-[#DC4C64] font-light flex items-center gap-1"
                              : subscriptionApplicationStatus
                              ? "text-[#01cc7a] font-light flex items-center gap-1"
                              : "text-[#DC4C64] font-light flex items-center gap-1"
                          }
                        >
                          <FeatherIcon
                            className={
                              subscriptionApplicationStatus === false
                                ? "text-[#DC4C64] font-light"
                                : subscriptionApplicationStatus
                                ?"text-[#01cc7a] font-light"
                                : "text-[#DC4C64] font-light"
                            }
                            icon="check-circle"
                            color="green"
                            size="15"
                          />
                          {subscriptionApplicationStatus === false
                            ? "Incomplete"
                            : subscriptionApplicationStatus
                            ? "Completed"
                            : "Incomplete"}
                        </span>
                      )}
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <FeatherIcon
                        icon="eye"
                        size="15"
                        onClick={(e) => props.handleGoToStep("Application")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full mb-10">
        {selectedIdentityData?.type.toLowerCase() == "corporate" ? (
          !isLoader ? (
            <>
              <div className={`ml-6 mr-6 bg-color-card-${theme} shadow-${theme} border border-color-${theme} pb-6 rounded-lg`}>
                <div className=" w-full" >
                  {/* <div className="card-header">
                      <h4 className="card-header-title">
                        Corporate Underlying Parties
                      </h4>
                    </div> */}
                  <div
                    className={`w-full flex justify-between items-center bg-color-card-${theme} py-[17px] px-[24px] shadow-${theme} border-b border-color-${theme} rounded-t-lg`}
                    
                  >
                    <h4 className="text-[15px] font-light">
                      Corporate Underlying Parties
                    </h4>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>Invite Underlying Corporate Parties</Tooltip>
                      }
                    >
                      <span>
                        <FeatherIcon
                          icon="user-plus"
                          size="20"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            window.open(
                              `${process.env.AUTH_API_URL}/entity-users-management/${entityId}?invite_user=true`,
                              "_blank"
                            )
                          }
                        />
                      </span>
                    </OverlayTrigger>
                  </div>

                  <div className="card-body">
                    {crpListData &&
                      crpListData.map((item, index) => (
                        <>
                          <div style={{ minHeight: "161px" }}>
                            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                              <CustomerBox
                                customerData={item}
                                isCrp={true}
                                params={params}
                              />
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                              <div
                                style={{ minHeight: "161px" }}
                                className="card"
                              >
                                <div className="card-body">
                                  {getMissingDataOfIdentity(
                                    item,
                                    accountData?.fund,
                                    particularFields,
                                    true
                                  )?.missingIdentityFields.length > 0 ? (
                                    <div
                                      className="missing_required_fields_documents"
                                      style={{
                                        marginBottom: "1em",
                                      }}
                                    >
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Please note: </span>We need a bit
                                        more information to complete this
                                        application.
                                      </p>
                                      <button
                                        className="btn btn-warning"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingParticularsForCrp(
                                            e,
                                            item
                                          )
                                        }
                                      >
                                        Incomplete Particulars
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="missing_required_fields_documents_success">
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Success! </span>You provided all
                                        necessary information.
                                      </p>
                                      <button
                                        className="btn btn-primary"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingParticularsForCrp(
                                            e,
                                            item
                                          )
                                        }
                                      >
                                        View Particulars
                                      </button>
                                    </div>
                                  )}
                                  {getMissingDataOfIdentity(
                                    item,
                                    accountData?.fund,
                                    particularFields,
                                    true,
                                    item?.documents,
                                    item?.requiredDocs
                                  )?.missingDocuments.length > 0 ? (
                                    <div
                                      className="missing_required_fields_documents"
                                      style={{
                                        marginBottom: "1em",
                                      }}
                                    >
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Please note: </span>We need a bit
                                        more information to complete this
                                        application.
                                      </p>
                                      <button
                                        className="btn btn-warning"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingDocumentsForCrp(
                                            e,
                                            item
                                          )
                                        }
                                      >
                                        Incomplete Documents
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="missing_required_fields_documents_success">
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Success! </span>You provided all
                                        necessary information.
                                      </p>
                                      <button
                                        className="btn btn-primary"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingDocumentsForCrp(
                                            e,
                                            item
                                          )
                                        }
                                      >
                                        View Documents
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* <MissingFields selectedIdentityData={item?.identity} fundData={accountData?.fund} /> */}
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <LoadingSpinner animation="grow" custom={true} height="70vh" />
          )
        ) : null}
      </div>
    </div>
  );
}
