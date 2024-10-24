import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Tooltip from "../../components/tooltip/Tooltip";
import { useTheme } from "../../contexts/themeContext";
import axios from "axios";
import Stepper from "react-stepper-horizontal";
// import LoadingSpinner from "../../../widgets/bootstrap-component/Spinner";
import {
  getBankIdentitiesAPI,
  getFundForJoin,
  getRegistrationProviderForSingpass,
  getSingleAccountDetailByIdAPI,
  getTransactionHistoryAPI,
  getWalletAddressListAPI,
  handleSubmitScreeningApi,
  postIdentityAttatchWithFund,
} from "../../api/network/CustomerApi";
import AccountStep from "./components/AccountStep";
import IdentityStep from "./components/IdentityStep";
import ApplicationStep from "../wizardcopy/account-wizard/Application";
import BankWalletsStep from "../wizardcopy/account-wizard/BankWallets";
import DocumentsStep from "./components/DocumentsStep";
import FaceVerification from "./components/FaceVerification";
// import IdentityStep from "../wizardcopy/account-wizard/UserForm";
import SummaryStep from "../wizardcopy/account-wizard/Summary";
import Vcip from "../wizardcopy/account-wizard/VCIP";
import getMissingDataOfIdentity from "../../helpers/getMissingDataOfIdentity";
import CustomAlert from "../../widgets/components/Alerts";
import Loader from "../../components/ui/loader";
import Modal from "../../components/modal/MainModal";
import SideBar from "../../components/sidebar/Sidebar";

export default function Wizard() {
  const { theme } = useTheme();
  const [entityType, setEntityType] = useState(null);
  const [isAssistanceData, setIsAssistanceData] = useState(false);
  const [isAssistAvail, setIsAssistAvail] = useState(false);
  const [faceResponse, setFaceResponse] = useState(false);
  const location = useLocation();
  const params = useParams();
  const [providerCkyc, setProviderCkyc] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAcceptedTermsAndCondition, setIsAcceptedTermsAndCondition] =
    useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [dataOfIdentityStep, setDataOfIdentityStep] = useState(false);
  const [buttonIsDisabledDocumentStep, setButtonIsDisabledDocumentStep] =
    useState(false);
  const [handleSubmitIdentityStep, setHandleSubmitIdentityStep] =
    useState(false);
  const [isCrp, setIsCrp] = useState(false);
  const [crpId, setCrpId] = useState(null);
  const [crpType, setCrpType] = useState(null);
  const [
    buttonDisabledForFaceVerification,
    setButtonDisabledForFaceVerification,
  ] = useState(false);
  const [submitFaceVerificationAPI, setSubmitFaceVerificationAPI] =
    useState(false);
  const [imagesForfaceVerification, setImagesForfaceVerification] = useState({
    img2_base64: null,
    img1_base64: null,
  });

  const [buttonDisabledForVCIP, setButtonDisabledForVCIP] = useState(false);
  const [submitVCIPAPI, setSubmitVCIPAPI] = useState(false);

  const [tooltipMessage, setTooltipMessage] = useState("");
  const [isShowFaceVerificationVCIP, setIsShowFaceVerificationVCIP] =
    useState(true);
  const [isShowModalAccurate, setIsShowModalAccurate] = useState(false);
  const [outDated, setOutDated] = useState(null);
  const [isShowModalFundWarning, setIsShowModalFundWarning] = useState(false);

  const [
    handleCallAPIForFaceVerficationData,
    setHandleCallAPIForFaceVerficationData,
  ] = useState(false);
  const [handleCallAPIForVCIPData, setHandleCallAPIForVCIPData] =
    useState(false);
  const [dataOfAccountSetup, setDataOfAccountSetup] = useState({});
  const [transactionHistoryData, setTransactionHistoryData] = useState({});
  const [steps, setSteps] = useState([
    { title: "Select Account" },
    { title: "Identity Setup" },
    { title: "Documents" },
    { title: "Face Verification" },
    { title: "VCIP" },
    { title: "Bank/Wallets" },
    { title: "Application" },
    { title: "Summary" },
  ]);
  const navigate = useNavigate();
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  useEffect(() => {
    console.log("imagesForfaceVerificationp", imagesForfaceVerification);
  }, [imagesForfaceVerification]);
  useEffect(() => {
    console.log("imagesForfaceVerificationp entityType", entityType);
    if (entityType !== null || entityType !== "") {
      console.log("dsdasdas", typeof entityType);
      console.log("dsdasdas aaa", entityType);
    }
  }, [entityType]);

  const handleChangeCkyc = (value) => {
    console.log("value ssdasdada", value);
    setProviderCkyc(value);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams) {
      console.log(queryParams.get("step"), "quersdsd");
      const event = queryParams.get("event");

      const step = queryParams.get("step");
      if (event) {
        let accountWizardAllData = localStorage.getItem("accountWizardAllData");
        if (accountWizardAllData != "null" && accountWizardAllData != null) {
          handleGoToStep("Application");
          setCurrentSection(6);
          setActiveStep(6);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (params?.account_id) {
      handleGetAccountDetailFirstTime();
      getWalletAddressList(params.identity_id);
      getBankIdentities(params.identity_id);
      getTransactionHistory(params.account_id);
    }
  }, [params]);
  useEffect(() => {
    let dataFromLocalStorage = JSON.parse(
      localStorage.getItem("accountWizardAllData")
    );

    if (dataFromLocalStorage?.identityId) {
      handleGetAccountDetailFirstTime(dataFromLocalStorage?.accountId);
      getWalletAddressList(dataFromLocalStorage?.identityId);
      getBankIdentities(dataFromLocalStorage?.identityId);
      getTransactionHistory(dataFromLocalStorage?.accountId);
    }
  }, []);

  useEffect(() => {
    if (params?.account_id && dataOfAccountSetup?.fundData) {
      const {
        accountData,
        fund_data,
        faceVerification,
        vcip,
        application,
        selectedIdentityData,
        bank,
        wallet,
        isIndividual,
      } = dataOfAccountSetup;
      let fundData = fund_data;
      const isParticularFormCompleted = true; // Replace with your actual check
      const isDocumentUploadCompleted =
        getMissingDataOfIdentity(
          selectedIdentityData,
          dataOfAccountSetup?.fundData,
          null
        )?.missingDocuments?.length === 0;

      const isFaceVerificationEnabled =
        fundData?.fund_setting?.account?.applicant?.identity[
          isIndividual ? "indivisual" : "corporate"
        ]?.provider?.verify?.face?.enabled;
      const isFaceVerificationCompleted = isFaceVerificationEnabled
        ? faceVerification
        : true;

      // Check if VCIP is enabled for the specific identity
      const isVcipEnabled =
        fundData?.fund_setting?.account?.applicant?.identity[
          isIndividual ? "indivisual" : "corporate"
        ]?.provider?.verify?.vcip?.enabled;

      // Check VCIP completion status only if it's enabled
      const isVcipCompleted = isVcipEnabled ? vcip : true;

      //   // Check if bank wallet is enabled for the specific identity
      //   const isBankWalletEnabled =
      //   fundData?.fund_setting?.account?.applicant?.identity?.bank?.enabled === true ||
      //   fundData?.fund_setting?.account?.applicant?.identity?.bank?.enabled === "true";

      // // Check bank wallet completion status only if it's enabled
      // const isBankWalletCompleted =
      //   (isBankWalletEnabled && bank) ||
      //   (fundData?.fund_setting?.account?.applicant?.identity?.wallet?.enabled &&
      //     ((fundData?.fund_setting?.account?.applicant?.identity?.wallet?.enabled === "true" ||
      //       fundData?.fund_setting?.account?.applicant?.identity?.wallet?.enabled === true) &&
      //       wallet));

      // const isApplicationDocumentCompleted = application;

      if (!isParticularFormCompleted) {
        setTooltipMessage("Please complete the particulars form.");
      } else if (!isDocumentUploadCompleted) {
        setTooltipMessage("Please upload all required documents.");
      } else if (!isFaceVerificationCompleted) {
        setTooltipMessage("Please complete the face verification process.");
      } else if (!isVcipCompleted) {
        setTooltipMessage("Please complete the VCIP process.");
      } else {
        setTooltipMessage("");
      }
    }
  }, [dataOfAccountSetup?.fundData, dataOfAccountSetup?.isIndividual]);

  useEffect(() => {
    console.log("currentSection", currentSection);
  }, [currentSection]);
  const getTransactionHistory = async (account_id) => {
    const response = await getTransactionHistoryAPI(
      account_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setTransactionHistoryData(response?.data);
      let isSubscriptionDocument = Object.keys(response?.data);
      dataOfAccountSetup["AccountSubscriptionDocs"] = response?.data;
      console.log(isSubscriptionDocument, "isSubscriptionDocument");
      if (isSubscriptionDocument && isSubscriptionDocument?.length > 0) {
        dataOfAccountSetup["application"] = true;
      } else {
        dataOfAccountSetup["application"] = false;
      }
      setDataOfAccountSetup(dataOfAccountSetup);
    }
  };
  const checkIfSubmitButtonDisabled = () => {
    const {
      accountData,
      fund_data,
      faceVerification,
      vcip,
      application,
      selectedIdentityData,
      bank,
      wallet,
      isIndividual,
    } = dataOfAccountSetup;
    let fundData = fund_data;

    // Your existing logic for checking the button disabled state
    const isParticularFormCompleted = true; // Replace with your actual check
    const isDocumentUploadCompleted =
      getMissingDataOfIdentity(
        selectedIdentityData,
        dataOfAccountSetup?.fundData,
        null
      )?.missingDocuments?.length === 0;
    const isFaceVerificationEnabled =
      fundData?.fund_setting?.account?.applicant?.identity[
        isIndividual ? "indivisual" : "corporate"
      ]?.provider?.verify?.face?.enabled;
    const isFaceVerificationCompleted = isFaceVerificationEnabled
      ? faceVerification
      : true;

    // Check if VCIP is enabled for the specific identity
    const isVcipEnabled =
      fundData?.fund_setting?.account?.applicant?.identity[
        isIndividual ? "indivisual" : "corporate"
      ]?.provider?.verify?.vcip?.enabled;

    // Check VCIP completion status only if it's enabled
    const isVcipCompleted = isVcipEnabled ? vcip : true;

    //   const isBankWalletEnabled =
    //   fundData?.fund_setting?.account?.applicant?.identity?.bank?.enabled === true ||
    //   fundData?.fund_setting?.account?.applicant?.identity?.bank?.enabled === "true";

    // // Check bank wallet completion status only if it's enabled
    // const isBankWalletCompleted =
    //   (isBankWalletEnabled && bank) ||
    //   (fundData?.fund_setting?.account?.applicant?.identity?.wallet?.enabled &&
    //     ((fundData?.fund_setting?.account?.applicant?.identity?.wallet?.enabled === "true" ||
    //       fundData?.fund_setting?.account?.applicant?.identity?.wallet?.enabled === true) &&
    //       wallet));

    // const isApplicationDocumentCompleted = application;

    const isSubmitDisabled =
      !isParticularFormCompleted ||
      !isDocumentUploadCompleted ||
      !isFaceVerificationCompleted ||
      !isVcipCompleted;

    return isSubmitDisabled;
  };
  const handleEntityType = (data) => {
    setEntityType(data);
  };

  const getWalletAddressList = async (identityId) => {
    // setIsLoader(true);
    const response = await getWalletAddressListAPI(
      identityId,
      cancelTokenSource.token
    );
    // setIsLoader(false);
    if (response.success == true) {
      dataOfAccountSetup["wallet"] = response?.data?.length > 0 ? true : false;
      setDataOfAccountSetup(dataOfAccountSetup);
    } else {
    }
  };
  const getBankIdentities = async (identityId) => {
    // setIsLoader(true);
    const response = await getBankIdentitiesAPI(
      identityId,
      cancelTokenSource.token
    );
    // setIsLoader(false);
    if (response.success == true) {
      dataOfAccountSetup["bank"] = response?.data?.length > 0 ? true : false;
      setDataOfAccountSetup(dataOfAccountSetup);
    } else {
    }
  };
  const checkIfFaceVerficationVCIPEnable = () => {
    if (dataOfAccountSetup) {
      if (
        dataOfAccountSetup?.accountData?.meta?.created_by?.portal == "customer"
      ) {
        return true;
      } else if (
        dataOfAccountSetup?.accountData?.meta?.created_by?.id !=
        localStorage.getItem("login_user_id")
      ) {
        return true;
      }
      return false;
    }
  };
  useEffect(() => {
    let stepsData = [];

    if (params?.account_id) {
      if (dataOfAccountSetup) {
        stepsData = [
          { title: "Summary" },
          { title: "Identity Setup" },
          { title: "Documents" },
        ];
        if (dataOfAccountSetup?.fund_id) {
          if (dataOfAccountSetup?.isIndividual === undefined) {
            if (
              dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
                ?.identity?.indivisual?.provider?.verify?.face?.enabled &&
              isShowFaceVerificationVCIP
            ) {
              stepsData.push({ title: "Face Verification" });
            }
            if (
              dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
                ?.identity?.indivisual?.provider?.verify?.vcip?.enabled &&
              isShowFaceVerificationVCIP
            ) {
              stepsData.push({ title: "VCIP" });
            }
            console.log(
              dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
                ?.identity?.indivisual?.provider?.verify?.face,
              "dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity[customerType]?.provider?.verify?.face"
            );
          } else {
            let customerType = "";
            if (dataOfAccountSetup?.isIndividual) {
              customerType = "indivisual";
            } else {
              customerType = "corporate";
            }

            if (
              dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
                ?.identity[customerType]?.provider?.verify?.face?.enabled &&
              checkIfFaceVerficationVCIPEnable()
            ) {
              stepsData.push({ title: "Face Verification" });
            }
            if (
              dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
                ?.identity[customerType]?.provider?.verify?.vcip?.enabled &&
              checkIfFaceVerficationVCIPEnable()
            ) {
              stepsData.push({ title: "VCIP" });
            }
          }
          const fundSetting =
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
              ?.identity;

          if (
            (fundSetting?.bank?.enabled === true ||
              fundSetting?.bank?.enabled === "true" ||
              fundSetting?.wallet?.enabled === true ||
              fundSetting?.wallet?.enabled === "true") &&
            dataOfAccountSetup?.fund_data?.named_id?.toUpperCase() !== "AXSA-WM"
          ) {
            stepsData.push({ title: "Bank/Wallets" });
          }
          if (
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.subscription
              ?.status
          ) {
            stepsData.push({ title: "Application" });
          }
        }
        setSteps(stepsData);
        setActiveStep(stepsData?.length);
        console.log(
          dataOfAccountSetup,
          "dataOfAccountSetup dataOfAccountSetup    dataOfAccountSetupdataOfAccountSetupdataOfAccountSetup"
        );
      }
    } else {
      if (dataOfAccountSetup) {
        stepsData = [
          { title: "Select Account" },
          { title: "Identity Setup" },
          { title: "Documents" },
        ];
        if (dataOfAccountSetup?.isIndividual === undefined) {
          if (
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
              ?.identity?.indivisual?.provider?.verify?.face?.enabled &&
            isShowFaceVerificationVCIP
          ) {
            stepsData.push({ title: "Face Verification" });
          }
          if (
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
              ?.identity?.indivisual?.provider?.verify?.vcip?.enabled &&
            isShowFaceVerificationVCIP
          ) {
            stepsData.push({ title: "VCIP" });
          }
          console.log(
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
              ?.identity?.indivisual?.provider?.verify?.face,
            "dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity[customerType]?.provider?.verify?.face"
          );
        } else {
          let customerType = "";
          if (dataOfAccountSetup?.isIndividual) {
            customerType = "indivisual";
          } else {
            customerType = "corporate";
          }

          if (
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
              ?.identity[customerType]?.provider?.verify?.face?.enabled &&
            isShowFaceVerificationVCIP
          ) {
            stepsData.push({ title: "Face Verification" });
          }
          if (
            dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
              ?.identity[customerType]?.provider?.verify?.vcip?.enabled &&
            isShowFaceVerificationVCIP
          ) {
            stepsData.push({ title: "VCIP" });
          }
        }
        const fundSetting =
          dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
            ?.identity;

        if (
          (fundSetting?.bank?.enabled === true ||
            fundSetting?.bank?.enabled === "true" ||
            fundSetting?.wallet?.enabled === true ||
            fundSetting?.wallet?.enabled === "true") &&
          dataOfAccountSetup?.fund_data?.named_id?.toUpperCase() !== "AXSA-WM"
        ) {
          stepsData.push({ title: "Bank/Wallets" });
        }

        if (
          dataOfAccountSetup?.fund_data?.fund_setting?.account?.subscription
            ?.status
        ) {
          stepsData.push({ title: "Application" });
        }
        stepsData.push({ title: "Summary" });
      }
      setSteps(stepsData);
      console.log(
        dataOfAccountSetup,
        "dataOfAccountSetup dataOfAccountSetup    dataOfAccountSetupdataOfAccountSetupdataOfAccountSetup"
      );
    }
    const queryParams = new URLSearchParams(location.search);
    if (queryParams) {
      const event = queryParams.get("event");

      if (event) {
        let accountWizardAllData = localStorage.getItem("accountWizardAllData");
        if (accountWizardAllData != "null" && accountWizardAllData != null) {
          if (stepsData?.length > 0) {
            for (let a = 0; a < stepsData?.length; a++) {
              if (stepsData[a].title == "Application") {
                console.log(
                  stepsData[a].title,
                  "stepsData[a].title stepsData[a].title"
                );
                setCurrentSection(a);
                setActiveStep(a);
                queryParams.delete("event");
                history.replaceState(null, null, "?" + queryParams.toString());
              }
            }
          }
          // localStorage.setItem("accountWizardAllData", null)
        } else if (stepsData?.length > 0) {
          for (let a = 0; a < stepsData?.length; a++) {
            if (stepsData[a].title == "Application") {
              console.log(
                stepsData[a].title,
                "stepsData[a].title stepsData[a].title"
              );
              setCurrentSection(a);
              setActiveStep(a);
              queryParams.delete("event");
              history.replaceState(null, null, "?" + queryParams.toString());
            }
          }
        }
      }
    }
  }, [dataOfAccountSetup, dataOfAccountSetup?.isIndividual]);
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (
      query?.get("state") == "SINGPASS" ||
      query?.get("state") == "CORPPASS"
    ) {
      setDataOfAccountSetup(
        JSON.parse(localStorage.getItem("accountSetupData"))
      );
      setCurrentSection(1);
      setActiveStep(1);
    }
  }, []);
  const getRegistrationProviderForSingpassApi = async () => {
    setIsLoader(true);
    let singPassValue = dataOfAccountSetup?.isIndividual
      ? "SINGPASS"
      : "CORPPASS";
    const response = await getRegistrationProviderForSingpass(
      singPassValue,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      console.log("blsdalsdlka", response);
      let authoriseUrl;
      dataOfAccountSetup?.isIndividual
        ? (authoriseUrl =
            response?.data?.singpass?.configurations.auth_api_url +
            "?client_id=" +
            response?.data?.singpass?.configurations.client_id +
            "&attributes=" +
            response?.data?.singpass?.configurations.attributes.replace(
              /"/g,
              ""
            ) +
            "&purpose=" +
            response?.data?.singpass?.configurations.purpose +
            "&state=" +
            "SINGPASS" +
            "&redirect_uri=" +
            process.env.VITE_SINGPASS_CALL_BACK_URL)
        : (authoriseUrl =
            response?.data?.corppass?.configurations.auth_api_url +
            "?client_id=" +
            response?.data?.corppass?.configurations.client_id +
            "&attributes=" +
            response?.data?.corppass?.configurations.attributes.replace(
              /"/g,
              ""
            ) +
            "&purpose=" +
            response?.data?.corppass?.configurations.purpose +
            "&state=" +
            "CORPPASS" +
            "&redirect_uri=" +
            process.env.VITE_CORPPASS_CALL_BACK_URL);
      console.log("sdasda", authoriseUrl);
      //   return;
      window.location.href = authoriseUrl;
    } else {
      setIsLoader(false);
    }
  };
  const handleClickSpecificTab = (index) => {
    console.log(index, "index handleClickSpecificTab");
  };
  const customSteps = steps.map((step, index) => {
    const isCompleted = index < activeStep;
    if (params?.account_id) {
      return {
        title: step.title,
        // onClick: () => handleClickSpecificTab(index)
      };
    } else {
      return {
        // title: parseInt(index + 1) + " " + step.title,
        title: step.title,
        // icon: isCompleted ? <FontAwesomeIcon icon={faCheckCircle} className="stepper-icon" /> : <FontAwesomeIcon icon={faCheckCircle} className="stepper-icon" />,
      };
    }
  });

  const handleChangeTermsCondition = () => {
    setIsAcceptedTermsAndCondition(true);
  };
  const getDataFromAccountStep = (data) => {
    // localStorage.setItem('accountSetup', data)
    console.log(data, "data getDataFromAccountStep");
    setDataOfAccountSetup(data);
  };
  const getDataForButtonEnableDisable = (data) => {
    console.log(data, "data getDataFromIdentityStep");
    setDataOfIdentityStep(data);
  };
  const handleNextButtonClickDocumentStep = (data) => {
    console.log(data, "data handleNextButtonClickDocumentStep");
    setButtonIsDisabledDocumentStep(data);
  };
  const setWalletData = (data) => {
    dataOfAccountSetup["wallet"] = data;
  };
  const setBankData = (data) => {
    dataOfAccountSetup["bank"] = data;
  };
  const setBanKDataValue = (data) => {
    dataOfAccountSetup["BanKData"] = data;
  };
  const setApplicationStepData = (data) => {
    console.log(data, "data data setApplicationStepData");
    dataOfAccountSetup["application"] = data;
  };
  const handleSetFaceImages = (data) => {
    setImagesForfaceVerification(data);
  };
  const handleMiissingParticulars = (data) => {
    if (data) {
      setCurrentSection(1);
      setActiveStep(1);
    }
  };
  const handleViewMissingParticulars = (data) => {
    if (data) {
      setIsCrp(true);
      setCrpId(data?.crpId);
      setCrpType(data?.crpType);
      setCurrentSection(1);
      setActiveStep(1);
    }
  };
  const handleViewMissingDocuments = (data) => {
    if (data) {
      setIsCrp(true);
      setCrpId(data?.crpId);
      setCrpType(data?.crpType);
      setCurrentSection(2);
      setActiveStep(2);
    }
  };
  const getIdentityData = (data) => {
    dataOfAccountSetup["identityData"] = data;
  };
  const getAccountData = (data) => {
    dataOfAccountSetup["accountData"] = data;
  };
  const handleUpdateSubmitCallIdentityStep = (data) => {
    setHandleSubmitIdentityStep(data);
  };
  const handleNextButtonClickIdentityStep = (
    identity_id,
    account_id,
    identityData,
    accountData,
    isStore = true
  ) => {
    if (isStore) {
      dataOfAccountSetup["identity_id"] = identity_id;
      dataOfAccountSetup["account_id"] = account_id;
      dataOfAccountSetup["accountData"] = accountData;
      dataOfAccountSetup["selectedIdentityData"] = identityData;
      console.log(dataOfAccountSetup, "dataOfAccountSetup");
      setDataOfAccountSetup(dataOfAccountSetup);
    }
    if (!isCrp) {
      setCurrentSection(currentSection + 1);
      setActiveStep(currentSection + 1);
    }
  };
  const faceVerificationCompleted = (data, redirect = false) => {
    setButtonDisabledForFaceVerification(data);
    dataOfAccountSetup["faceVerification"] = data;
    handleGetAccountDetail();
    if (redirect) {
      setCurrentSection(currentSection + 1);
      setActiveStep(currentSection + 1);
    }
  };
  const submitFaceVerification = (data) => {
    setSubmitFaceVerificationAPI(data);
    setButtonDisabledForFaceVerification(data);
  };
  const submitVCIP = (data) => {
    console.log(data, "data submitVCIP submitVCIP");
    setSubmitVCIPAPI(data);
    setButtonDisabledForVCIP(data);
  };
  const handleCallAPIForFaceVerficationDataUpdateFalse = () => {
    setHandleCallAPIForFaceVerficationData(false);
  };
  const handleCallAPIForVCIPDataUpdateFalse = () => {
    setHandleCallAPIForVCIPData(false);
  };
  const handleGetAccountDetail = async () => {
    let dataFromLocalStorage = JSON.parse(
      localStorage.getItem("accountWizardAllData")
    );

    const response = await getSingleAccountDetailByIdAPI(
      dataOfAccountSetup?.account_id
        ? dataOfAccountSetup?.account_id
        : params?.account_id
        ? params?.account_id
        : dataFromLocalStorage?.accountId,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      dataOfAccountSetup["accountData"] = response?.data?.account_detail;
      setDataOfAccountSetup(dataOfAccountSetup);
    }
  };
  const handleGetAccountDetailFirstTime = async (accId = null) => {
    setIsLoader(true);

    const response = await getSingleAccountDetailByIdAPI(
      dataOfAccountSetup?.account_id
        ? dataOfAccountSetup?.account_id
        : params?.account_id
        ? params?.account_id
        : accId,
      cancelTokenSource.token
    );
    if (response.success == true) {
      if (params?.account_id || accId) {
        setIsShowFaceVerificationVCIP(
          response?.data?.account_detail?.meta?.created_by?.portal != "customer"
            ? false
            : true
        );
        getFundData(
          response?.data?.account_detail?.fund?.namedId,
          response?.data?.account_detail
        );
      }
    }
  };
  const getFundData = async (named_id, data) => {
    const response = await getFundForJoin(named_id, cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      localStorage.setItem("fundRegion", response?.data?.fund_setting?.region);
      let dataFromLocalStorage = JSON.parse(
        localStorage.getItem("accountWizardAllData")
      );

      if (params?.account_id || dataFromLocalStorage?.accountId) {
        dataOfAccountSetup["fund_id"] = data?.fundId;
        dataOfAccountSetup["identity_id"] =
          data?.attach_identities[0]?.identityId;
        dataOfAccountSetup["selectedIdentityData"] =
          data?.attach_identities[0]?.identity;
        dataOfAccountSetup["isIndividual"] =
          data?.attach_identities[0]?.identity?.type == "INDIVIDUAL"
            ? true
            : false;
        dataOfAccountSetup["fund_data"] = response?.data;
        dataOfAccountSetup["fundData"] = data?.fund;
        dataOfAccountSetup["account_id"] = params?.account_id
          ? params?.account_id
          : dataFromLocalStorage?.accountId;
        dataOfAccountSetup["accountData"] = data;
        dataOfAccountSetup["faceVerification"] = false;
        dataOfAccountSetup["vcip"] = false;
        if (data?.attach_identities) {
          if (data?.attach_identities?.length > 0) {
            if (data?.attach_identities) {
              if (data?.attach_identities[0]?.meta?.identities) {
                if (
                  data?.attach_identities[0]?.meta?.identities[
                    data?.attach_identities[0]?.identityId
                  ]
                ) {
                  if (
                    data?.attach_identities[0]?.meta?.identities[
                      data?.attach_identities[0]?.identityId
                    ]?.faceVerification
                  ) {
                    dataOfAccountSetup["faceVerification"] = true;
                  }
                  if (
                    data?.attach_identities[0]?.meta?.identities[
                      data?.attach_identities[0]?.identityId
                    ]?.vcip
                  ) {
                    dataOfAccountSetup["vcip"] = true;
                  }
                }
              }
            }
          }
        }
      }
      console.log(
        dataOfAccountSetup,
        "dataOfAccountSetup getSingleAccountDetailByIdAPI"
      );
      setDataOfAccountSetup(dataOfAccountSetup);
    }
  };
  const vcipUpload = (data) => {
    setButtonDisabledForVCIP(data?.status);
    dataOfAccountSetup["vcip"] = data?.status;
    if (data?.redirect) {
      setCurrentSection(currentSection + 1);
      setActiveStep(currentSection + 1);
    }
  };
  const setIsNewIdentity = (data) => {
    console.log(data, "data setIsNewIdentity");
    dataOfAccountSetup["isNewIdentity"] = data;
    console.log(dataOfAccountSetup, "dataOfAccountSetup");
    setDataOfAccountSetup(dataOfAccountSetup);
  };
  const _getSelectedSection = (section) => {
    if (steps[section]) {
      if (steps[section]?.title == "Select Account") {
        return (
          <AccountStep
            checkIfDataSelectedForButtons={getDataFromAccountStep}
            handleChangeCkyc={handleChangeCkyc}
            setIsNewIdentity={setIsNewIdentity}
            handleChangeTermsCondition={handleChangeTermsCondition}
            isAcceptedTermsAndCondition={isAcceptedTermsAndCondition}
          />
        );
      }
      if (steps[section]?.title == "Identity Setup") {
        return (
          <IdentityStep
            providerCkyc={providerCkyc}
            dataOfAccountSetup={dataOfAccountSetup}
            fillAllFields={getDataForButtonEnableDisable}
            submitCall={handleSubmitIdentityStep}
            handleUpdateSubmitCall={handleUpdateSubmitCallIdentityStep}
            handleNextButtonClick={handleNextButtonClickIdentityStep}
            getIdentityData={getIdentityData}
            getAccountData={getAccountData}
            isCrp={isCrp}
            crpId={crpId}
            crpType={crpType}
            isAcceptedTermsAndCondition={isAcceptedTermsAndCondition}
            outDated={outDated}
            updateUpdatedData={updateUpdatedData}
            handleEntityType={handleEntityType}
            handleAlert={handleAlert}
          />
        );
      }
      if (steps[section]?.title == "Documents") {
        return (
          <DocumentsStep
            dataOfAccountSetup={dataOfAccountSetup}
            handleNextButtonClickDocumentStep={
              handleNextButtonClickDocumentStep
            }
            handleRefreshAccountDetail={handleRefreshAccountDetail}
            isCrp={isCrp}
            crpId={crpId}
            crpType={crpType}
          />
        );
      }
      if (steps[section]?.title == "Face Verification") {
        return (
          <FaceVerification
            dataOfAccountSetup={dataOfAccountSetup}
            handleAssistanceData={handleAssistanceData}
            advanceSection={advanceSection}
            isHandleAssistanceData={isHandleAssistanceData}
            handleApiResponseFace={handleApiResponseFace}
            faceVerificationCompleted={faceVerificationCompleted}
            submitFaceVerification={submitFaceVerification}
            handleCallAPIForFaceVerficationData={
              handleCallAPIForFaceVerficationData
            }
            handleCallAPIForFaceVerficationDataUpdateFalse={
              handleCallAPIForFaceVerficationDataUpdateFalse
            }
            handleSetFaceImages={handleSetFaceImages}
            faceImages={imagesForfaceVerification}
          />
        );
      }
      if (steps[section]?.title == "VCIP") {
        return (
          <Vcip
            dataOfAccountSetup={dataOfAccountSetup}
            vcipUpload={vcipUpload}
            submitVCIP={submitVCIP}
            handleCallAPIForVCIPData={handleCallAPIForVCIPData}
            handleCallAPIForVCIPDataUpdateFalse={
              handleCallAPIForVCIPDataUpdateFalse
            }
          />
        );
      }
      if (steps[section]?.title == "Bank/Wallets") {
        return (
          <BankWalletsStep
            dataOfAccountSetup={dataOfAccountSetup}
            setWalletData={setWalletData}
            setIsBankData={setBankData}
            setBanKDataValue={setBanKDataValue}
          />
        );
      }
      if (steps[section]?.title == "Application") {
        return (
          <ApplicationStep
            dataOfAccountSetup={dataOfAccountSetup}
            setApplicationStepData={setApplicationStepData}
            handleMiissingParticulars={handleMiissingParticulars}
            refreshAccountDetail={handleRefreshAccountDetail}
          />
        );
      }
      if (steps[section]?.title == "Summary") {
        return (
          <SummaryStep
            getTransactionHistory={getTransactionHistory}
            transactionHistoryData={transactionHistoryData}
            dataOfAccountSetup={dataOfAccountSetup}
            handleGoToStep={handleGoToStep}
            handleViewMissingParticulars={handleViewMissingParticulars}
            handleViewMissingDocuments={handleViewMissingDocuments}
          />
        );
      }
    }
  };
  const handleGoToStep = (step) => {
    if (steps?.length > 0) {
      for (let a = 0; a < steps?.length; a++) {
        if (steps[a].title == step) {
          console.log(
            a,
            "setCurrentSection setCurrentSection setCurrentSection setCurrentSection "
          );
          setCurrentSection(a);
          setActiveStep(a);
        }
      }
    }
  };
  const checkIfNextButtonDisabled = (e) => {
    console.log(dataOfAccountSetup, "dataOfAccountSetup");

    if (currentSection == 0) {
      if (dataOfAccountSetup) {
        if (!dataOfAccountSetup?.isNewIdentity) {
          if (dataOfAccountSetup.fund_id && dataOfAccountSetup?.identity_id) {
            return false;
          } else {
            if (dataOfAccountSetup.selectedProvider) {
              return false;
            } else {
              return true;
            }
          }
        }

        if (dataOfAccountSetup?.isNewIdentity) {
          if (
            dataOfAccountSetup.fund_id &&
            dataOfAccountSetup?.selectedProvider == null
          ) {
            return true;
          }
          if (
            dataOfAccountSetup.fund_id &&
            dataOfAccountSetup?.selectedProvider == "manual"
          ) {
            return false;
          } else if (
            dataOfAccountSetup.fund_id &&
            dataOfAccountSetup?.selectedProvider != "manual" &&
            dataOfAccountSetup?.selectedProvider == "adhar"
          ) {
            if (dataOfAccountSetup?.isIndividual) {
              if (
                dataOfAccountSetup?.isPanVerified &&
                dataOfAccountSetup?.isAadhaarVerified &&
                dataOfAccountSetup?.isCKYCVerified
              ) {
                return false;
              } else {
                return true;
              }
            }
            if (!dataOfAccountSetup?.isIndividual) {
              if (
                dataOfAccountSetup?.isPanVerified &&
                dataOfAccountSetup?.isCKYCVerified
              ) {
                return false;
              } else {
                return true;
              }
            }
          } else if (
            dataOfAccountSetup.fund_id &&
            dataOfAccountSetup?.selectedProvider != "manual" &&
            dataOfAccountSetup?.selectedProvider != "adhar"
          ) {
            return false;
          }
        }
      } else {
        return true;
      }
    }
    if (currentSection == 1) {
      console.log(dataOfIdentityStep, "dataOfIdentityStep");
      if (dataOfIdentityStep) {
        if (!dataOfAccountSetup?.isIndividual) {
          if (entityType === null || entityType === "") {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    if (steps[currentSection]?.title == "Documents") {
      console.log(buttonIsDisabledDocumentStep, "buttonIsDisabledDocumentStep");
      if (buttonIsDisabledDocumentStep) {
        return false;
      } else {
        return true;
      }
    }
    if (steps[currentSection]?.title == "Face Verification") {
      if (
        imagesForfaceVerification?.img1_base64 !== null &&
        imagesForfaceVerification?.img2_base64 !== null
      ) {
        return false;
      } else {
        return true;
      }
      // console.log(dataOfAccountSetup?.faceVerification, "dataOfAccountSetup?.faceVerification");
      // if (buttonDisabledForFaceVerification) {

      //   return false;
      // } else {

      //   return true;
      // }
    }
    if (steps[currentSection]?.title == "VCIP") {
      if (buttonDisabledForVCIP) {
        return false;
      } else {
        return true;
      }
    }
  };
  const handleBackCancel = (e) => {
    if (currentSection == 0) {
      setDataOfAccountSetup(null);
      navigate("/subscription-list");
    } else {
      if (currentSection == 1) {
        setCrpId(null);
        setIsCrp(false);
      }
      setCurrentSection(currentSection - 1);
      setActiveStep(currentSection - 1);
    }
  };
  const handleJoinFund = async () => {
    setIsLoader(true);
    const data = {
      joint_account: false,
      fund_id: dataOfAccountSetup?.fundData?.named_id,
      share_holder_count: 0,
      joint_account_emails: [],
    };
    const response = await postIdentityAttatchWithFund(
      dataOfAccountSetup?.identity_id,
      data,
      cancelTokenSource.token
    );
    setIsLoader(false);
    console.log("checking response", response);
    if (response.success == true) {
      dataOfAccountSetup["isAadhaarVerified"] = false;
      dataOfAccountSetup["isCKYCVerified"] = false;
      dataOfAccountSetup["isIndividual"] = dataOfAccountSetup?.isIndividual
        ? "individual"
        : "corporate";
      dataOfAccountSetup["isNewIdentity"] = false;
      dataOfAccountSetup["isPanVerified"] = false;
      dataOfAccountSetup["isStandAlone"] = true;
      dataOfAccountSetup["selectedProvider"] = null;
      dataOfAccountSetup["account_id"] = response?.data?.accountId;
      dataOfAccountSetup["accountData"] = response?.data;
      setCurrentSection(currentSection + 1);
      setActiveStep(currentSection + 1);
      // setSubmitLoader(false);
    } else {
      // setSubmitLoader(false);
    }
  };
  const handleNextButtonCRP = (e, isCrp = false) => {
    if (isCrp) {
      setIsCrp(isCrp);

      setHandleSubmitIdentityStep(true);
    }
  };
  const handleAssistanceData = (data) => {
    setIsAssistanceData(data);
  };
  const isHandleAssistanceData = (data) => {
    setIsAssistAvail(data);
  };
  const handleApiResponseFace = (data) => {
    console.log("data", data);
    setFaceResponse(data);
  };
  function advanceSection() {
    setCurrentSection(currentSection + 1);
    setActiveStep(currentSection + 1);
  }
  const handleNextButton = (e) => {
    if (currentSection + 1 == steps?.length) {
      if (params?.account_id) {
        navigate("/subscription-list");
      } else {
        handleSubmitApplication();
      }
    } else if (currentSection == 0) {
      console.log(
        dataOfAccountSetup.selectedProvider,
        "dataOfAccountSetup.selectedProvider"
      );
      if (!dataOfAccountSetup.selectedProvider) {
        // handleJoinFund()
        setCurrentSection(currentSection + 1);
        setActiveStep(currentSection + 1);
      }
      if (dataOfAccountSetup.selectedProvider == "manual") {
        setCurrentSection(currentSection + 1);
        setActiveStep(currentSection + 1);
      } else if (dataOfAccountSetup.selectedProvider != "manual") {
        console.log(dataOfAccountSetup, "dataOfAccountSetup for next");
        if (
          dataOfAccountSetup.selectedProvider == "singpass" ||
          dataOfAccountSetup.selectedProvider == "corppass"
        ) {
          localStorage.setItem(
            "accountSetupData",
            JSON.stringify(dataOfAccountSetup)
          );
          getRegistrationProviderForSingpassApi();
        } else if (dataOfAccountSetup.selectedProvider == "adhar") {
          setCurrentSection(currentSection + 1);
          setActiveStep(currentSection + 1);
        }
      }
      if (
        dataOfAccountSetup?.fund_data?.fund_setting?.region
          .toLowerCase()
          .includes("india")
      ) {
        setIsShowModalFundWarning(true);
      }
    } else if (currentSection == 1) {
      if (isCrp) {
        if (dataOfAccountSetup?.account_id) {
          setCurrentSection(currentSection + 1);
          setActiveStep(currentSection + 1);
        } else {
          setHandleSubmitIdentityStep(true);
        }
        setIsCrp(false);
      } else {
        setHandleSubmitIdentityStep(true);
      }
    } else if (currentSection == 2) {
      if (dataOfAccountSetup.selectedProvider == "adhar" && outDated == null) {
        setIsShowModalAccurate(true);
      } else {
        setCurrentSection(currentSection + 1);
        setActiveStep(currentSection + 1);
      }
    } else {
      if (steps[currentSection]?.title == "Face Verification") {
        if (submitFaceVerificationAPI) {
          if (faceResponse) {
            setCurrentSection(currentSection + 1);
            setActiveStep(currentSection + 1);
            setFaceResponse(false);
            return;
          }

          console.log("isAssistanceData", isAssistanceData);
          console.log("isAssistanceData faceResponse", faceResponse);
          console.log("isAssistanceData visAssistAvail", isAssistAvail);
          if (!isAssistanceData) {
            if (isAssistAvail) {
              setHandleCallAPIForFaceVerficationData(true);
            } else {
              if (!isAssistanceData) {
                setHandleCallAPIForFaceVerficationData(true);
                return;
              } else {
                setCurrentSection(currentSection + 1);
                setActiveStep(currentSection + 1);
              }
              setCurrentSection(currentSection + 1);
              setActiveStep(currentSection + 1);
            }
          } else {
            setCurrentSection(currentSection + 1);
            setActiveStep(currentSection + 1);
          }
        } else if (dataOfAccountSetup?.faceVerification) {
          setCurrentSection(currentSection + 1);
          setActiveStep(currentSection + 1);
        }
      }

      // if (steps[currentSection]?.title == "Face Verification") {
      //   debugger;
      //   // if (imagesForfaceVerification?.img1_base64 !== null && imagesForfaceVerification?.img2_base64 !== null) {
      //   //   setCurrentSection(currentSection + 1);
      //   //   setActiveStep(currentSection + 1);
      //   // }
      //   if (submitFaceVerificationAPI) {
      //     setHandleCallAPIForFaceVerficationData(true);
      //     if (!isAssistanceData) {
      //       setHandleCallAPIForFaceVerficationData(true);
      //     } else {
      //       setCurrentSection(currentSection + 1);
      //       setActiveStep(currentSection + 1);
      //     }
      //   }
      // }
      else if (steps[currentSection]?.title == "VCIP") {
        if (submitVCIPAPI) {
          setHandleCallAPIForVCIPData(true);
        } else if (dataOfAccountSetup?.vcip) {
          setCurrentSection(currentSection + 1);
          setActiveStep(currentSection + 1);
        }
      } else {
        setCurrentSection(currentSection + 1);
        setActiveStep(currentSection + 1);
      }
    }
  };
  const handleSubmitApplication = async () => {
    setIsLoader(true);
    let account_id = null;
    if (dataOfAccountSetup?.account_id) {
      account_id = dataOfAccountSetup?.account_id;
    }
    const response = await handleSubmitScreeningApi(
      dataOfAccountSetup?.identity_id,
      account_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      navigate(`/subscription-list`);
    } else {
      setIsLoader(false);
    }
  };
  const handleSubmitReview = async () => {
    handleSubmitApplication();
    console.log("handleSubmitReview");
  };

  const handleRefreshAccountDetail = () => {
    handleGetAccountDetail();
    handleGetAccountDetailOnRequest();
  };
  const handleGetAccountDetailOnRequest = async () => {
    // setIsLoader(true)
    let dataFromLocalStorage = JSON.parse(
      localStorage.getItem("accountWizardAllData")
    );
    const response = await getSingleAccountDetailByIdAPI(
      dataOfAccountSetup?.account_id
        ? dataOfAccountSetup?.account_id
        : params?.account_id
        ? params?.account_id
        : dataFromLocalStorage?.accountId,
      cancelTokenSource.token
    );
    if (response.success == true) {
      let dataFromLocalStorage = JSON.parse(
        localStorage.getItem("accountWizardAllData")
      );
      if (params?.account_id || dataFromLocalStorage?.accountId) {
        getFundData(
          response?.data?.account_detail?.fund?.namedId,
          response?.data?.account_detail
        );
      }
    }
  };
  const closeModalAccurate = () => {
    setIsShowModalAccurate(false);
  };

  const handleApproveClickAccurate = (e) => {
    setIsShowModalAccurate(false);
    setCurrentSection(currentSection + 1);
    setActiveStep(currentSection + 1);
    setOutDated(false);
  };
  const handleModifyClickAccurate = (e) => {
    setIsShowModalAccurate(false);
    setCurrentSection(currentSection - 1);
    setActiveStep(currentSection - 1);
    setOutDated(true);
  };
  const handleCloseModal = (e) => {
    setIsShowModalFundWarning(false);
  };
  const updateUpdatedData = (status) => {
    setOutDated(status);
  };

  return (
    <>
      <SideBar portalType="Customer" />
      <div
        className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 min-h-screen`}
      >
        {alertProps.show && (
          <CustomAlert
            handleCloseAlert={handleCloseAlert}
            message={alertProps.message}
            variant={alertProps.variant}
            show={alertProps.show}
            hideAuto={alertProps.hideAuto}
            onClose={() => setAlertProps({ ...alertProps, show: false })}
          />
        )}

        <Stepper
          steps={customSteps}
          activeStep={currentSection}
          activeColor="#007bff"
          completeColor="green"
          activeTitleColor={"white"}
          completeTitleColor={"white"}
          completeBorderColor={"green"}
          completeBarColor={"green"}
          circleFontColor={"black"}
        />

        <div className="">
          {isLoader ? (
            <div className="flex justify-center items-center h-[20rem]">
              <Loader />
            </div>
          ) : (
            <>{_getSelectedSection(currentSection)}</>
          )}

          <div className="flex lg:justify-between md:justify-center sm:justify-center w-full px-28 py-8">
            <button
              className={`bg-color-button-${theme} px-6 py-3 rounded-lg text-white outline-none`}
              onClick={(e) => handleBackCancel(e)}
            >
              {currentSection == 0 ? "Cancel" : "Back"}
            </button>
            {dataOfAccountSetup?.isIndividual === false &&
              currentSection == 1 &&
              !isCrp && (
                <Tooltip content='Please click "Save & Next" to skip this step'>
                  <button
                    className={`bg-color-button-${theme} px-6 py-3 rounded-lg text-white outline-none`}
                    disabled={checkIfNextButtonDisabled()}
                    onClick={(e) => handleNextButtonCRP(e, true)}
                  >
                    Create Organization Chart
                  </button>
                </Tooltip>
              )}
            {dataOfAccountSetup?.accountData?.attach_identities
              ? dataOfAccountSetup?.accountData?.attach_identities[0]
                  ?.applicationStatusId === "DRAFT" &&
                params?.account_id &&
                currentSection === 0 && (
                  <>
                    <Tooltip id="tooltip">
                      {tooltipMessage}

                      <div>
                        <button
                          className={`bg-color-button-${theme} px-6 py-3 rounded-lg text-white outline-none`}
                          disabled={checkIfSubmitButtonDisabled()}
                          onClick={handleSubmitReview}
                        >
                          Submit For Review
                        </button>
                      </div>
                    </Tooltip>
                  </>
                )
              : null}

            <button
              className={`bg-color-button-${theme} px-6 py-3 rounded-lg text-white outline-none`}
              disabled={checkIfNextButtonDisabled()}
              onClick={(e) => handleNextButton(e)}
            >
              {currentSection + 1 == steps?.length
                ? params?.account_id
                  ? "Finish"
                  : "Submit"
                : currentSection === 0
                ? "Next"
                : "Save & Next"}
            </button>
          </div>
        </div>

        <Modal
          size="md"
          show={isShowModalAccurate}
          onHide={closeModalAccurate}
          centered
        >
          <div>
            <h3 className="text-lg font-bold">CKYC Accurate?</h3>
          </div>
          <div className="mt-4">
            <h3>Is the data retrieved by CKYC accurate?</h3>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleApproveClickAccurate}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                onClick={handleModifyClickAccurate}
              >
                Modify
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          size="md"
          show={isShowModalFundWarning}
          onHide={handleCloseModal}
          centered
        >
          <div>
            <h3 className="text-lg font-bold">Notice</h3>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-700">
              <p>
                Please note that you are about to share your personal data and
                information with the following entities:
              </p>
              <p>
                Fund Administrator:{" "}
                {dataOfAccountSetup?.fund_data?.administration?.entity?.title}
              </p>
              {dataOfAccountSetup?.fund_data?.management?.entity?.title && (
                <p>
                  Investment Manager:{" "}
                  {dataOfAccountSetup?.fund_data?.management?.entity?.title}
                </p>
              )}
            </h3>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleCloseModal}
              >
                Proceed
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
