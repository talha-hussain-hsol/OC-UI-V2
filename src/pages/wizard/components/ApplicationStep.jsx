import { Col, Container, Row, Nav, Dropdown, Button, Modal, OverlayTrigger, Tooltip, ProgressBar, Card } from "react-bootstrap";
// import { SubscriptionDetailHeader } from "../../../../widgets";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  getRequiredDocumentAPI,
  getSignedURLAPI,
  getInitialInvestmentSignAPI,
  getDownloadSigningDocument,
  transactionDocAddApi,
  transactionDocVerifyUpload,
  getDocuSignURLForFinishSigningAPI,
  getDownloadDocuSignAPI,
  getTransactionHistoryAPI,
  getSingleAccountDetailByIdAPI,
  doStampingAPI,
  handleDownloadStampDocumentAPI,
  doESignAPI,
  submitCustomTransactionDataAPI,
  getCustomTransactionAPI,
  getAuthUserDetail,
} from "../../../api/network/CustomerApi";
import { useTheme } from "../../../contexts/themeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../../widgets/components/Alerts";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
import SpinnerWithBackDrop from "../../../components/ui/loader/index";
import FeatherIcon from "feather-icons-react";
import {
  getMaxSubscriptionAmount,
  getMinSubscriptionAmount,
  getMaxAdditionalSubscriptionAmount,
  getMinAdditionalSubscriptionAmount,
  getMaxRedemptionSubscriptionAmount,
  getMinRedemptionSubscriptionAmount,
} from "../../../helpers/getFundConfiguration";
import { Select } from "../../../components/vendor";
import  formatDateRegionWise  from "../../../helpers/formatDateRegionWise";
import DeleteTransactionModal from "./deleteModalCrp/DeleteAccountModal";
import DeleteManualDocModal from "./applicationModal/deleteManualDocModal";
export default function investment({ ...props }) {
  const {theme} = useTheme();
  console.log(props, "props?.props?.props?.props?.");
  const manualTranssaction = props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections?.manual_transaction;
  console.log("√manualTranssaction", manualTranssaction);
  const [deleteManualDocConfirmation, setDeleteManualConfirmation] = useState(false);

  const [selectedManualUploadedDoc, setSelectedManualUploadedDoc] = useState(null);
  const [selectedManualRequiredKey, setSelectedManualRequiredKey] = useState(null);
  const [requiredDocList, setRequiredDocList] = useState([]);
  const [requiredDocListAll, setRequiredDocListAll] = useState([]);
  const [additionalSubscription, setAdditionalSubscription] = useState([]);
  const [redemptionSubscription, setRedemptionSubscription] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [isLoaderAccount, setIsLoaderAccount] = useState(false);
  const [isLoaderESign, setIsLoaderESign] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [singleTransactionData, setSingleTransactionData] = useState("");
  const [envelopeID, setEnvelopeID] = useState("");
  const [errorAmount, setErrorAmount] = useState(false);
  const [errorCurrency, setErrorCurrency] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionHistoryData, setTransactionHistoryData] = useState(null);
  const [signSubmit, setSignSubmit] = useState(false);
  const [uploadDocument, setUploadDocument] = useState(false);
  const [contentTypeData, setContentTypeData] = useState("");
  const [pDFError, setPDFError] = useState(false);
  const [subscriptionAmountRangeError, setShowSubscriptionAmountRangeError] = useState(false);
  const [maxSubscriptionAmount, setMaxSubscriptionAmount] = useState();
  const [minSubscriptionAmount, setMinSubscriptionAmount] = useState();
  const [additionalAmount, setAdditionalAmount] = useState(null);
  const [redemptionAmount, setRedemptionAmount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAmount, setIsAmount] = useState(false);
  const [showProceed, setProceed] = useState(false);
  const [keyRandom, setKeyRandom] = useState(234234);
  const [refresh, setRefresh] = useState(false);
  const [stamp, setStamp] = useState(false);
  const [stampingDone, setStampingDone] = useState(false);
  const [currencyValues, setCurrencyValues] = useState(
    props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.asset?.traditional?.network?.length > 0 ? props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.asset?.traditional?.network : []
  );
  const [selectedCurrencyValues, setSelectedCurrencyValues] = useState([]);
  const [documentIdForVerifyUpload, setDocumentIdForVerifyUpload] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loaderDescription, setLoaderDescription] = useState("");
  const [addTransaction, setAddTransaction] = useState(false);

  const [TransactionType, setTransactionType] = useState("");
  const [status, setStatus] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [classType, setClassType] = useState(null);
  const [noOfShares, setNoOfShares] = useState(null);
  const [transactionContentTypeData, setTransactionContentTypeData] = useState("");
  const [dealingCycle, setDealingCycle] = useState("");

  const [typeError, setTypeError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [transactionDateError, setTransactionDateError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [currencyError, setCurrencyError] = useState(false);
  const [classTypeError, setClassTypeError] = useState(false);
  const [dealingCycleError, setDealingCycleError] = useState(false);
  const [noOfSharesError, setNoOfSharesError] = useState(false);
  const [transactionList, setTransactionList] = useState(false);

  const [userId, setUserId] = useState(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  const docImage = useRef();
  const params = useParams();
  const history = useLocation();
  const navigate = useNavigate();
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const type = props?.dataOfAccountSetup?.isIndividual ? "individual" : "corporate";
  const identity_id = props?.dataOfAccountSetup?.identity_id;
  const account_id = props?.dataOfAccountSetup?.account_id;
  const accountShareHolderId = props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.id;
  let handleCallStamping = true;
  const handleCloseModal = () => setDeleteConfirmationModal(false);
  const handleCloseModalManual = () => setDeleteManualConfirmation(false);

  useEffect(() => {
    getTransactionList();
    getUserDetail();
  }, []);
  useEffect(() => {
    let options;
    if (currencyValues?.length > 0) {
      options = currencyValues.map((item) => ({
        value: item,
        label: item,
      }));
      setCurrencyOptions(options);
    }
  }, [currencyValues]);
  useEffect(() => {
    if (history?.state?.isTransaction) {
      setAddTransaction(true);
    }
  }, [history]);
  useEffect(() => {
    console.log(transactionHistoryData, "transactionHistoryData transactionHistoryDatatransactionHistoryData");
    // if (transactionHistoryData && requiredDocListAll && accountData) {
    //   if (transactionHistoryData.hasOwnProperty("SUBSCRIPTION_AGREEMENT")) {
    //     for (let item of requiredDocListAll) {
    //       console.log(item, "item");
    //       console.log(isDocumentUploaded(item?.id), "isDocumentUploaded(item?.id)");
    //       console.log(checkIfStampingEnable(), "checkIfStampingEnable()");
    //       console.log(isDocumentUploaded(item?.id)?.STAMP_DOCUMENT, "isDocumentUploaded(item?.id)?.STAMP_DOCUMENT");
    //       if (item?.category_key == "SUBSCRIPTION_DOCUMENT" && stampingDone == false) {
    //         if (item?.key == "SUBSCRIPTION_AGREEMENT" && checkIfStampingEnable()) {
    //           if (isDocumentUploaded(item?.id) && isDocumentUploaded(item?.id)?.docuSign?.status == "signing_complete" && isDocumentUploaded(item?.id)?.mode == "docusign") {
    //             if (!isDocumentUploaded(item?.id)?.STAMP_DOCUMENT) {
    //               handleStamping(item);
    //             }
    //           }
    //         } else if (!checkIfStampingEnable() && checkIfESignEnable() && item?.key == "SUBSCRIPTION_AGREEMENT") {
    //           if (isDocumentUploaded(item?.id) && isDocumentUploaded(item?.id)?.docuSign?.status == "signing_complete" && isDocumentUploaded(item?.id)?.mode == "docusign") {
    //             if (!isDocumentUploaded(item?.id)?.AADHAAR_SIGN_DOCUMENT) {
    //               handleESign(item);
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    if (transactionList?.length > 0 && accountData && checkIfESignEnable()) {
      for (let a of transactionList) {
        console.log(a, 'aaaaaaa transactionList')
        if (a.type = "subscription") {
          if (a?.meta?.subscription?.length > 0) {
            if (a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]) {
              if (a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]?.docuSign?.status == "signing_complete" && a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]?.mode == "docusign") {
                if (!a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]?.STAMP_DOCUMENT) {
                  handleStamping(a);
                }
              }
              if (a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]?.STAMP_DOCUMENT) {
                if (!a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]?.AADHAAR_SIGN_DOCUMENT) {
                  handleESign('subscription', a?.meta?.subscription?.[a?.meta?.subscription?.length - 1]?.randomString, a?.id);
                }
              }
            }
          }
        }
      }
    }
  }, [accountData, transactionList]);
  useEffect(() => {
    console.log("contentTypeData", contentTypeData);
  }, [contentTypeData]);
  useEffect(() => {
    if (account_id) {
      getSingleAccountDetailById(account_id);
    }
  }, []);
  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);
  useEffect(() => {
    if (stamp) {
      getTransactionHistory();
    }
  }, [stamp]);
  useEffect(() => {
    if (accountData) {
      if (accountData?.attach_identities[0]) {
        if (accountData?.attach_identities[0]?.identity?.meta?.data) {
          let email = accountData?.attach_identities[0]?.identity?.meta?.data[`${accountData?.attach_identities[0]?.identity?.type.toLowerCase()}.extended.email`]?.value;
          console.log(email, "email email email");
          console.log(isValidEmail(email), "isValidEmail(email)");
          if (!isValidEmail(email)) {
            setIsEmailValid(false);
          } else {
            setIsEmailValid(true);
          }
        }
      }
    }
  }, [accountData]);
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const getSingleAccountDetailById = async (accountId) => {
    setIsLoaderAccount(true);
    const response = await getSingleAccountDetailByIdAPI(accountId, cancelTokenSource.token);

    if (response.success == true) {
      setAccountData(response?.data?.account_detail);
      setIsLoaderAccount(false);

      console.log("response", response);
    } else {
      setIsLoaderAccount(false);
    }
  };
  const getUserDetail = async () => {
    setIsLoader(true);
    const response = await getAuthUserDetail(cancelTokenSource.token);
    console.log("trrrrrrrr", response);

    if (response.success == true) {
      setUserId(response?.data?.id);
      let customerData = [];

      console.log(customerData, "customerData");
    } else {
      setIsLoader(false);
    }
  };

  console.log("selectedCurrencyValues", selectedCurrencyValues);

  const handleRedemptionAmountChange = (event) => {
    const value = parseInt(event.target.value);
    console.log("value", value);

    if (isNaN(value)) {
      setRedemptionAmount(null);
      return;
    }

    const { min, max } = props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.redemption || {};
    console.log("min", typeof min);
    console.log("max", max);

    if (value >= min && value <= max) {
      setRedemptionAmount(value);
    } else {
      setRedemptionAmount(min);
      handleAlert({
        variant: "info",
        message: `please enter amount between ${min} and ${max}`,
        show: true,
        hideAuto: true,
      });
    }
  };
  const handleAdditionalAmountChange = (event) => {
    const value = parseInt(event.target.value);
    console.log("value", value);

    if (isNaN(value)) {
      setAdditionalAmount(null);
      return;
    }

    const { min, max } = props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.addition || {};
    console.log("min", typeof min);
    console.log("max", max);

    if (value >= min && value <= max) {
      setAdditionalAmount(value);
    } else {
      setAdditionalAmount(min);
      handleAlert({
        variant: "info",
        message: `please enter amount between ${min} and ${max}`,
        show: true,
        hideAuto: true,
      });
    }
  };

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  useEffect(() => {
    handleGetRequiredDocument();
    getInitialInvestmentSign();
    getTransactionHistory();
  }, []);
  useEffect(() => {
    console.log(amount, "amount amount amount");

    if (amount >= getMinSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting) && amount <= getMaxSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting)) {
    } else {
      setShowSubscriptionAmountRangeError(true);
    }
    setMaxSubscriptionAmount(getMaxSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting));
    setMinSubscriptionAmount(getMinSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting));
  }, [amount]);
  useEffect(() => {
    console.log("history", history);
  }, [history]);
  const getInitialInvestmentSign = async () => {
    const response = await getInitialInvestmentSignAPI(account_id, cancelTokenSource.token);
    if (response.success == true) {
      console.log(response?.data, "response?.data response?.data response?.data response?.data");
      setTransactionData(response?.data);
    }
  };
  const getTransactionHistory = async () => {
    const response = await getTransactionHistoryAPI(account_id, cancelTokenSource.token);
    if (response.success == true) {
      if (stamp) {
        handleGetRequiredDocument();
        setStamp(false);
      }
      setTransactionHistoryData(response?.data);
      if (response?.data.hasOwnProperty("SUBSCRIPTION_AGREEMENT") || response?.data.hasOwnProperty("SUBSCRIPTION_APPLICATION")|| response?.data.hasOwnProperty("CONTRIBUTION_AGREEMENT")) {
        props.setApplicationStepData(true);
      } else {
        props.setApplicationStepData(false);
      }
      setTimeout(function () {
        setRefresh(true);
        setKeyRandom(Math.floor(Math.random() * (9999999 - 1 + 1)) + 1);
      }, 500);
    }
  };
  const handleGetRequiredDocument = async () => {
    console.log(`checking`);
    setRequiredDocListAll([]);
    setIsLoader(true);
    if (account_id) {
      const response = await getRequiredApplicationDocumentAPI(account_id, cancelTokenSource.token);

      if (response.success == true) {
        setIsLoader(false);
        console.log("checking required", response);
        let data = [];
        if (response?.data?.req_documents?.length > 0) {
          for (let item of response?.data?.req_documents) {
            if (item?.key == "SUBSCRIPTION_AGREEMENT") {
              console.log(item, "item item item itemasdasd");
              data.push(item);
            }

            // if (item?.key == "SUBSCRIPTION_AGREEMENT" && checkIfStampingEnable()) {
            //     if (isDocumentUploaded(item?.id) && (isDocumentUploaded(item?.id)?.docuSign?.status == 'signing_complete' || isDocumentUploaded(item?.id)?.mode == 'manual')) {
            //         if (isDocumentUploaded(item?.id)?.STAMP_DOCUMENT) {

            //         }
            //     }
            // }

            if (item?.key == "ADDITIONAL_SUBSCRIPTION_AGREEMENT") {
              setAdditionalSubscription(item);
            }
            if (item?.key == "REDEMPTION_DOCUMENT") {
              setRedemptionSubscription(item);
            }

          }
          console.log(data, "data data data dataasdnajsdnakjhs");
          setRequiredDocListAll(data);
          setSignSubmit(false);
        } else {
          setIsLoader(false);
        }
      } else {
        setIsLoader(false);
        setRequiredDocListAll([]);
      }
    }
  };
  const handleClickChoice = (key) => {
    console.log(singleTransactionData, 'transactionDatatransactionDatatransactionDatatransactionData')
    localStorage.setItem("accountWizardAllData", JSON.stringify(props?.dataOfAccountSetup));
    const dateToSend = {
      redirect_url: window.location.href.split("?")[0],
      choice: key,
      // choice: key,
      accountId: account_id,
      // type: singleTransactionData?.type,
      // currency: 'INR',
      transactionId: singleTransactionData?.id
    };
    console.log("redirect_url", dateToSend);
    requestSignUrl(dateToSend);
  };
  const requestSignUrl = async (data) => {
    setIsLoader(true);
    setLoaderDescription(<span style={{ color: "orange" }}>Please wait a moment, you are being directed to DocuSign</span>);

    const response = await getSignedURLAPI(data, requiredDocList.id, cancelTokenSource.token);
    setLoaderDescription("");
    if (response.success == true) {
      window.location.href = response?.data?.signing_url;
    } else {
      setIsLoader(false);
    }
  };
  const dateFormate = (timestamp) => {
    // console.log(dataDate, 'dataDate dataDate')
    // const dateString = dataDate;
    // const date = new Date(dateString);
    // const formattedDate = date.toLocaleDateString("en-US", {
    //   day: "numeric",
    //   month: "short",
    //   year: "numeric",
    // });
    // return formattedDate;
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Note: Month is zero-based
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}${" "}${hours}:${minutes}:${seconds}`;
  };
  const documentTypeMap = {
    "subscription": "SUBSCRIPTION_AGREEMENT",
    "redemption": "REDEMPTION_DOCUMENT",
    "addition": "ADDITIONAL_SUBSCRIPTION_AGREEMENT",
    "full-redemption": "REDEMPTION_DOCUMENT",
    "partial-redemption": "REDEMPTION_DOCUMENT",
  };
  function getDocumentByType(type) {
    const key = documentTypeMap[type]; // Get the key for the given type
    if (!key) return null; // Return null if the type doesn't match any key

    // Find the document with the matching key
    return requiredDocListAll.find((doc) => doc.key === key);
  }
  const handleSignAndSubmit = (e, status, data) => {
    setSingleTransactionData(data)
    setTransactionId(data?.transactionableId)
    setAmount(data?.amount)
    setCurrency(data?.currency)
    let requiredDocument = getDocumentByType(data?.type)
    console.log(requiredDocument, 'requiredDocumentrequiredDocumentrequiredDocumentrequiredDocumentrequiredDocumentrequiredDocument')
    setRequiredDocList(requiredDocument);
    setIsAmount(false);
    if (status == "re-sign") {
      // setShowModal(true);
      handleProceed();
      // if (!signSubmit && showProceed) {
      //   setSignSubmit(true);
      // } else {
      //   setSignSubmit(false);
      // }
    } else {
      if (signSubmit) {
        setSignSubmit(false);
      } else {
        setSignSubmit(true);
      }
    }
  };
  function handleModalClose() {
    // hide the modal dialog
    setShowModal(false);
  }
  function handleProceed() {
    // hide the modal dialog
    setProceed(true);
    setShowModal(false);
    setSignSubmit(true);
  }
  const handleClickUpload = (e) => {
    setUploadDocument(true);
  };
  const handleCancelUploadDocument = (e) => {
    setUploadDocument(false);
  };
  function getShortestTimeSpan(subscriptionDocuments, mineDocumentTypeID) {
    let shortestTimeSpan = Infinity;
    let latestDocumentRandomString = "";

    for (const documentType in subscriptionDocuments) {
      const documents = subscriptionDocuments[documentType];

      // Filter out documents with the same documentTypeId
      const filteredDocuments = documents.filter((doc) => doc.documentTypeId === mineDocumentTypeID);

      // Sort the filtered documents by docUploadDateTime in descending order
      filteredDocuments.sort((a, b) => b.docUploadDateTime - a.docUploadDateTime);

      // Get the time span from the current time to each document's upload time
      const currentTime = Date.now();
      for (let i = 0; i < filteredDocuments?.length; i++) {
        const timeSpan = currentTime - filteredDocuments[i].docUploadDateTime;

        // Update the shortestTimeSpan and latestDocumentRandomString if applicable
        if (timeSpan < shortestTimeSpan) {
          shortestTimeSpan = timeSpan;
          latestDocumentRandomString = filteredDocuments[i].randomString;
        }
      }
    }

    // debugger;
    return latestDocumentRandomString;
  }

  // Usage example

  const handleUploadDocument = async (e) => {

    setIsLoader(true);
    const data = {

      type: singleTransactionData?.type,
      content_type: contentTypeData,
      document_type_id: requiredDocList?.id,
      transaction_id: singleTransactionData?.id,
      share_holder_id: accountShareHolderId,
      identity_id: identity_id,
    };

    console.log("is it ", data);
    const response = await transactionDocAddApi(data, cancelTokenSource.token);
    if (response.success) {
      setUploadDocument(false);
      setIsLoader(true);
      // setDocumentIdForVerifyUpload(requiredDocList?.id);
      const randomString = getShortestTimeSpan(response?.data?.account_info?.meta?.subscriptionDocuments, requiredDocList?.id);
      console.log("randomString", randomString); // Output: cDzAy9HoLm0M6id0ykbL
      const dataToUpload = {
        req_id: response?.data?.doc_id,
        transaction_id: singleTransactionData?.id
      };
      let url = response.data.signed_url;
      let file = docImage.current?.files?.item(0);
      console.log(file, "imageBlob file");
      console.log(url, "url url url url");
      //Removing and Adding Token
      let token = axios.defaults.headers["x-auth-token"];

      delete axios.defaults.headers["x-auth-token"];

      console.log(file, "imageBlob file");
      axios
        .put(url, file, {
          headers: {
            "Content-Type": file?.type,
          },
        })
        .then(async (response) => {
          console.log("Image Upload Success ", response);

          axios.defaults.headers["x-auth-token"] = token;

          const res = await transactionDocVerifyUpload(dataToUpload, account_id, cancelTokenSource.token);
          // const res = await transactionDocVerifyUpload(response?.data?.transaction_document_id, cancelTokenSource.token);
          if (res.success) {
            setIsLoader(false);
            getTransactionHistory();
            props?.refreshAccountDetail();
            getSingleAccountDetailById(account_id);
            //  window.location.href=window.location.href+"?event=signing_complete"
            setTimeout(function () {
              handleGetRequiredDocument();
            }, 1000);

            setSignSubmit(false);
          } else {
            setIsLoader(false);
          }
        })
        .catch((err) => {
          console.log("Image Upload Failed Response", err);
          axios.defaults.headers["x-auth-token"] = token;
          // setErrorMessage(response.system_message);
          setIsLoader(false);
        });
      //document_type_id: requiredDocList?.id,

      //  "docTypeId":110,
      //  "randomString":"J01LYcxQ3@9ByyUYcWrA"
      // }

      handleAlert({
        variant: "success",
        message: "Document Added successfully",
        show: true,
        hideAuto: true,
      });

      setSignSubmit(false);
      getInitialInvestmentSign();
      getTransactionHistory();
      handleGetRequiredDocument();
    } else {
      handleAlert({
        variant: "danger",
        message: response?.user_message,
        show: true,
        hideAuto: true,
      });
      setIsLoader(false);
    }

    // setUploadDocument(false)
  };
  const handleClickDocument = (e) => {
    console.log("hello handleClickDocument");
    let elem = document.getElementById("input_field_document");
    if (elem) {
      elem.click();
    }
  };

  function handleImageClick(e) {
    let elem = document.getElementById("inputImageElement");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview");
      if (image) {
        image.style.display = "block";
        let file = docImage.current?.files?.item(0);
        console.log(file, "file");
        if (file.type != "application/pdf") {
          setPDFError(true);
          return;
        }
        setContentTypeData(file.type);
        console.log(docImage, "docImage handleImageClick");
        if (file) {
          let data = URL.createObjectURL(file);
          // image.src = data;
          toggleAllImageTags("none");

          if (file.type.search("image") != -1) {
            image.src = data;
          } else {
            // toggleAllImageTags('none');
            let image = document.getElementById("imagePreview");
            if (image) {
              image.style.display = "none";
            }
          }
        }
        // }
      }
    });
  }

  function toggleAllImageTags(input) {
    console.log(input, "input");
    let icon = document.getElementById("imageUploadIcon");
    let text1 = document.getElementById("imageUploadText1");
    let text2 = document.getElementById("imageUploadText2");
    let text3 = document.getElementById("imageUploadText3");
    let image = document.getElementById("imagePreview");

    if (icon && text1 && text2 && text3) {
      icon.style.display = input;
      text1.style.display = input;
      text2.style.display = input;
      text3.style.display = input;
    }

    if (input == "block" && image) {
      image.style.display = input;
    }
  }
  const handleClickDownloadManual = async (item, id) => {
    setIsLoader(true);
    console.log("ittttem", item);
    const response = await getDownloadSigningDocument(item, id, account_id, cancelTokenSource.token);
    console.log("response id", response);
    if (response.success == true) {
      setIsLoader(false);
      window.open(`${response?.data?.signed_url?.url}`, "_blank");
    } else {
      setIsLoader(false);
    }
  };
  const handleClickFinishSigning = async (e, envelop_id, random_string, documentType) => {
    localStorage.setItem("accountWizardAllData", JSON.stringify(props?.dataOfAccountSetup));
    setIsLoader(true);
    const data = {
      redirect_url: window.location.href,
      envelop_id: envelop_id,
      randomKey: random_string,
      accountId: account_id,
      type: "subscription",
    };
    const response = await getDocuSignURLForFinishSigningAPI(data, documentType, cancelTokenSource.token);
    console.log("response id", response);
    if (response.success == true) {
      setIsLoader(false);
      window.open(`${response?.data?.signing_url}`, "_blank");
    } else {
      setIsLoader(false);
    }
  };
  const handleDownloadDocument = async (documentTypeId, randomString) => {
    console.log("in loader");
    setIsLoader(true);
    let dataToSend = {
      randomString: randomString,
      accountId: account_id,
    };
    const response = await getDownloadDocuSignAPI(documentTypeId, dataToSend, cancelTokenSource.token);
    console.log("response id", response);
    if (response.success == true) {
      setIsLoader(false);

      if (response?.data?.signed_url?.url) {
        if (response?.data?.signed_url?.url?.length > 0) {
          for (let a = 0; a < response?.data?.signed_url?.url?.length; a++) {
            // console.log(response?.data?.signed_url?.url[a],'response?.data?.signed_url?.url[a]')
            window.open(`${response?.data?.signed_url?.url[a]}`, "_blank");
          }
        }
      }
      // window.location.href = response?.data?.signing_url;
    } else {
      setIsLoader(false);
    }
  };
  const handleChangeCurrency = (selectedOption) => {
    setSelectedCurrencyValues(selectedOption);
  };
  const handleChangeAmount = (event) => {
    console.log("weaeawe", event.target.value);
    console.log("weaeawe minSubscriptionAmount", minSubscriptionAmount);
    console.log("weaeawe maxSubscriptionAmount", maxSubscriptionAmount);
    console.log("requiredDocList requiredDocList", requiredDocList);
    const value = event.target.value === "" ? 0 : parseFloat(event.target.value);

    setAmount(value);
    let maxAmount = maxSubscriptionAmount;
    let minAmount = minSubscriptionAmount;
    if (requiredDocList?.category_key == "SUBSCRIPTION_DOCUMENT") {
      maxAmount = maxSubscriptionAmount;
      minAmount = minSubscriptionAmount;
    } else if (requiredDocList?.category_key == "ADDITIONAL_SUBSCRIPTION_DOCUMENT") {
      maxAmount = getMaxAdditionalSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting);
      minAmount = getMinAdditionalSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting);
    } else if (requiredDocList?.category_key == "REDEMPTION_DOCUMENT") {
      maxAmount = getMaxRedemptionSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting);
      minAmount = getMinRedemptionSubscriptionAmount(props?.dataOfAccountSetup?.fund_data?.fund_setting);
    }
    if (value >= minAmount && value <= maxAmount) {
      //   handleAlert({
      //     variant: "info",
      //     message: `Amount should be between ${minSubscriptionAmount} and ${maxSubscriptionAmount}`,
      //     show: true,
      //     hideAuto: true,
      //   });
    } else {
      handleAlert({
        variant: "danger",
        message: `Amount should be between ${minAmount} and ${maxAmount}`,
        show: true,
        hideAuto: true,
      });
    }
  };
  const handleSignSubmitClose = (e) => {
    console.log("ksjlhdliashdlhsalidhaidhilashdlsahdkgas;d;gsld;g")
    setSignSubmit(false);
    setAmount("");
    setSelectedCurrencyValues([])

  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  const isDocumentUploaded = (id) => {
    // console.log(Object.keys(props?.accountData?.meta?.subscriptionDocuments), "props?.accountData?.meta?.subscriptionDocuments");
    var returnData = false;
    if (accountData?.meta?.subscriptionDocuments) {
      if (Object.keys(accountData?.meta?.subscriptionDocuments)?.length > 0) {
        for (let a of Object.keys(accountData?.meta?.subscriptionDocuments)) {
          if (accountData?.meta?.subscriptionDocuments[a]) {
            // Filter out documents with deleted.status === true
            const filteredDocuments = accountData?.meta?.subscriptionDocuments[a]
              ?.filter(item => !(item?.deleted?.status === true))
              ?.sort((a, b) => b.docUploadDateTime - a.docUploadDateTime);

            console.log(filteredDocuments[0]?.documentTypeId, "filteredDocuments filteredDocuments");
            console.log(id, "filteredDocuments filteredDocuments id");
            console.log(filteredDocuments[0], "filteredDocuments filteredDocuments");

            if (filteredDocuments[0]?.documentTypeId == id) {
              return filteredDocuments[0];
            }
          }
        }
      }
    }

  };

  const getStatus = (item) => {
    console.log("props itttt", item);
    console.log("props accountData", props?.accountData);
    const keyOfDocument = item?.key;
    console.log("keyOfDocument", keyOfDocument);
    var documents = [];
    if (accountData?.meta?.subscriptionDocuments) {
      if (accountData?.meta?.subscriptionDocuments.hasOwnProperty(keyOfDocument)) {
        documents = accountData?.meta?.subscriptionDocuments[keyOfDocument];
      }
    }
    console.log("documents", documents);

    let shortestTimeSpan = Infinity;

    let latestDocumentRandomStatus = "";

    // Sort the filtered documents by docUploadDateTime in descending order
    // const filteredDocuments = documents?.sort((a, b) => b.docUploadDateTime - a.docUploadDateTime);
    const filteredDocuments = documents
      ?.filter(doc => !(doc?.deleted?.status === true)) // Exclude deleted documents
      ?.sort((a, b) => b.docUploadDateTime - a.docUploadDateTime); // S


    // Get the time span from the current time to each document's upload time
    const currentTime = Date.now();
    for (let i = 0; i < filteredDocuments?.length; i++) {
      const timeSpan = currentTime - filteredDocuments[i].docUploadDateTime;

      // Update the shortestTimeSpan and latestDocumentRandomStatus if applicable
      if (timeSpan < shortestTimeSpan) {
        shortestTimeSpan = timeSpan;
        latestDocumentRandomStatus = filteredDocuments[i].status;
      }
    }
    console.log("latestDocumentRandomStatus", latestDocumentRandomStatus);

    return latestDocumentRandomStatus == "" ? "Not Completed" : latestDocumentRandomStatus == "pending" ? "Signed" : "Draft";
  };
  const checkIfShowAdditional = () => {
    if (props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.addition?.status || props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.redemption?.status) {
      if (transactionHistoryData) {
        if (transactionHistoryData.hasOwnProperty("SUBSCRIPTION_AGREEMENT") || transactionHistoryData.hasOwnProperty("SUBSCRIPTION_APPLICATION") || transactionHistoryData.hasOwnProperty('CONTRIBUTION_AGREEMENT')) {
          if (props?.dataOfAccountSetup?.accountData?.status == "accepted") {
            return true;


          } else {
            return false;


          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };
  const checkIfShowManualTransaction = () => {
    // return true
    return props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections?.manual_transaction?.enabled;
  };
  const handleClickMissingParticulars = (e) => {
    props.handleMiissingParticulars(true);
    // navigate(`/profile/detail/${accountData?.attach_identities[0]?.identityId}/${account_id}?step=identity`);
  };
  const checkIfStampingEnable = () => {
    return props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.stamping?.status;
  };
  const checkIfESignEnable = () => {
    return props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.eSign?.status;
  };

  const handleStamping = async (data) => {
    handleCallStamping = false;
    setIsLoader(true);
    setLoaderDescription("Please Wait! Stamping is in progress");
    let dataToSend = {
      id: data?.meta[data.type][data?.meta[data.type]?.length - 1]?.randomString,
      document_type_key: data?.type,
      transaction_id: data?.id,
    };
    const response = await doStampingAPI(identity_id, accountShareHolderId, dataToSend, cancelTokenSource.token);
    console.log("response id", response);
    setLoaderDescription("");
    if (response.success == true) {
      if (response?.data?.error) {
        handleAlert({
          variant: "danger",
          message: response?.data?.errorObject?.message?.message,
          show: true,
          hideAuto: true,
        });
        setIsLoader(false);
      } else {
        setIsLoader(false);
        setStampingDone(true);
        setStamp(true);
        if (checkIfESignEnable()) {
          handleESign(data?.type, data?.meta[data.type][data?.meta[data.type]?.length - 1]?.randomString, data?.id);
        } else {
          getTransactionHistory();
        }
        // window.location.href=window.location.href+"?steps=Application"
        // getTransactionHistory();
        // window.open(`${response?.data?.signed_url?.url}`, "_blank");
      }
    } else {
      setIsLoader(false);
    }
  };
  const handleESign = async (documentKey, randomString, transactionId) => {
    setIsLoaderESign(true);
    setLoaderDescription("Please Wait! E Sign is in progress");
    let dataToSend = {
      id: randomString,
      document_type_key: documentKey,
      return_url: window.location.href.split("?")[0] + "?event=signing_complete",
      transaction_id: transactionId,
    };
    const response = await doESignAPI(identity_id, accountShareHolderId, dataToSend, cancelTokenSource.token);
    console.log("response id", response);
    if (response.success == true) {
      // setIsLoader(false);
      // getTransactionHistory();
      if (response?.data?.error) {
        handleAlert({
          variant: "danger",
          message: response?.data?.errorObject?.message,
          show: true,
          hideAuto: true,
        });
        setIsLoaderESign(false);
      } else {
        window.location.href = `${response?.data}`;
      }
    } else {
      setIsLoaderESign(false);
    }
  };
  const handleDownloadStampDocument = async (bucketKey) => {
    setIsLoader(true);
    let dataToSend = {
      key: bucketKey,
    };
    const response = await handleDownloadStampDocumentAPI(dataToSend, cancelTokenSource.token);
    console.log("response id", response);
    if (response.success == true) {
      setIsLoader(false);
      // getTransactionHistory();
      window.open(`${response?.data}`, "_blank");
    } else {
      setIsLoader(false);
    }
  };
  const getSignedPercentage = (signer) => {
    let percentage = 0;
    if (signer) {
      for (let s of signer) {
        if (s?.sign == "SIGNED") {
          percentage += 33;
        }
      }
    }
    return percentage;
  };
  const handleAddTransaction = (e) => {
    setAddTransaction(!addTransaction);
  };

  const clearTransactionForm = () => {
    setAddTransaction(false);
    setTransactionType("");
    setStatus("");
    setTransactionDate("");
    setTransactionAmount(null);
    setCurrency(null);
    setClassType(null);
    setNoOfShares(null);
    setTransactionContentTypeData("");
    setDealingCycle("");

    setTypeError(false);
    setStatusError(false);
    setTransactionDateError(false);
    setAmountError(false);
    setCurrencyError(false);
    setClassTypeError(false);
    setDealingCycleError(false);
    setNoOfSharesError(false);
  };

  const handleDeleteClick = (uploadedData, key) => {
    console.log("sdljashdljkashjlda", uploadedData)
    console.log("sdljashdljkashjlda requiredData", key)
    setSelectedManualUploadedDoc(uploadedData);
    setSelectedManualRequiredKey(key)
    setDeleteManualConfirmation(true);
  };

  const handleSubmitTransactions = (e) => {
    e.preventDefault();
    let isError = false;

    if (TransactionType == "") {
      setTypeError(true);
      isError = true;
    } else {
      setTypeError(false);
    }
    if (noOfShares !== null) {
      setAmountError(false);
      setCurrencyError(false);
    } else {
      // No of shares not provided, so make amount and currency mandatory
      if (transactionAmount == null) {
        setAmountError(true);
        isError = true;
      } else {
        setAmountError(false);
      }
      if (currency == null) {
        setCurrencyError(true);
        isError = true;
      } else {
        setCurrencyError(false);
      }
    }

    // if (classType == '') {
    //     setClassTypeError(true)

    // } else {
    //     setClassTypeError(false)
    // }
    if (transactionDate == "") {
      isError = true;
      setTransactionDateError(true);
    } else {
      setTransactionDateError(false);
    }
    if (isError) {
      return;
    }

    let dataToSend = {
      status: "pending",
      type: TransactionType,
      transactionDate: transactionDate,
      amount: transactionAmount,
      no_of_shares: parseInt(noOfShares),
      currency: currency,
      // dealingCycle: dealingCycle,
      classType: classType,
    };
    submitTransactionData(dataToSend);
  };
  const submitTransactionData = async (data) => {
    setIsLoader(true);
    const response = await submitCustomTransactionDataAPI(account_id, data, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      getTransactionList();
      clearTransactionForm();
      setAddTransaction(!addTransaction);
      handleAlert({
        variant: "success",
        message: `Transaction added Successfully!`,
        show: true,
        hideAuto: true,
      });
    } else {
      setIsLoader(false);
    }
  };
  const getTransactionList = async () => {
    setIsLoader(true);
    const response = await getCustomTransactionAPI(account_id, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setTransactionList(response.data);
    } else {
      setIsLoader(false);
    }
  };


  return (
    <div className="w-full">
      {alertProps.show && (
        <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
          {alertProps.message}
        </CustomAlert>
      )}
      {refresh}
      <div>
        <div className="flex flex-col w-full justify-center">
          <Col xs={12} lg={12} xl={12}>
            {/* <SubscriptionDetailHeader forTabsCheck={history?.state} /> */}
            <div
            className={`bg-color-card-${theme} rounded-md  shadow-${theme} mb-8 flex flex-col items-center justify-center h-full w-full`}
          >
              {/* <div class="col-12 col-md-9"> */}
              <div class={checkIfShowAdditional() ? "col-9 col-md-9" : "col-12 col-md-12"}>
                {isLoader || isLoaderESign || isLoaderAccount ? <SpinnerWithBackDrop animation="grow" custom={true} height="100vh" loaderDescription={loaderDescription} /> : null}
                {/* {transactionData.length == 0 ? ( */}
                {isLoaderAccount ? (
                  <SpinnerWithBackDrop animation="grow" custom={true} height="100vh" loaderDescription={loaderDescription} />
                ) : (
                  <div class="card">
                    {/* <div class="card-header">
                                        <h4 class="card-header-title">Review & Sign Documents</h4>
                                    </div> */}

                    <div
                      className="card-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 className="card-header-title">Review & Sign Documents</h4>
                      {checkIfShowManualTransaction() && (
                        <Button
                          onClick={(e) => {
                            handleAddTransaction(e);
                          }}
                        >
                          New Transaction Request
                        </Button>
                      )}
                    </div>
                    <div class="card-body">
                      <div>
                        {addTransaction && (
                          <Card {...props}>
                            <Card.Header>
                              <h4 className="card-header-title">Add Transaction Request</h4>
                            </Card.Header>
                            <Card.Body>
                              <Row className="justify-content-center mb-4">
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">Type</label>
                                  <select
                                    className="form-control"
                                    onChange={(e) => {
                                      setTransactionType(e.target.value);
                                    }}
                                  >
                                    <option value="">Select Type</option>
                                    <option value="subscription" disabled={transactionList?.length>=1}>Initial Subscription</option>
                                    <option value="addition" disabled={transactionList?.length==0}>Additional Subscription</option>
                                    <option value="redemption" disabled={transactionList?.length==0}>Redemption</option>
                                    <option value="full-redemption" disabled={transactionList?.length==0}>Full Redemption</option>
                                    <option value="partial-redemption" disabled={transactionList?.length==0}>Partial Redemption</option>
                                    {/* <option value="internal">Internal</option>
                                                            <option value="exchange">Exchange</option>
                                                            <option value="deposit">Deposit</option> */}
                                  </select>
                                  {typeError && <p className="error-fields">Select Type To Continue</p>}
                                </Col>

                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">Amount</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Amount"
                                    onChange={(e) => {
                                      setTransactionAmount(e.target.value);
                                    }}
                                  />
                                  {amountError && <p className="error-fields">Enter Amount To Continue</p>}
                                </Col>
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">Currency</label>
                                  <select
                                    className="form-control"
                                    onChange={(e) => {
                                      setCurrency(e.target.value);
                                    }}
                                  >
                                    <option value="">Select Currency</option>

                                    {props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections?.manual_transaction?.currency !== ""
                                      ? props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections?.manual_transaction?.currency?.map((item) => {
                                        return (
                                          <>
                                            <option value={item}>{item}</option>
                                          </>
                                        );
                                      })
                                      : null}
                                  </select>
                                  {currencyError && <p className="error-fields">Enter Currency To Continue</p>}
                                </Col>
                              </Row>
                              <Row className="justify-content-center mb-4">
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">No Of Shares</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="No. Of Shares"
                                    onChange={(e) => {
                                      setNoOfShares(e.target.value);
                                    }}
                                  />
                                  {noOfSharesError && <p className="error-fields">Enter No. Of Shares To Continue</p>}
                                </Col>
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">Class Type</label>
                                  <select
                                    className="form-control"
                                    onChange={(e) => {
                                      setClassType(e.target.value);
                                    }}
                                  >
                                    <option value="">Select type</option>

                                    {props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections?.manual_transaction?.class_type !== ""
                                      ? props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections?.manual_transaction?.class_type?.map((item) => {
                                        return (
                                          <>
                                            <option value={item}>{item}</option>
                                          </>
                                        );
                                      })
                                      : null}
                                  </select>

                                  {classTypeError && <p className="error-fields">Enter Class Type To Continue</p>}
                                </Col>
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">Transaction Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Transaction Date"
                                    onChange={(e) => {
                                      setTransactionDate(e.target.value);
                                    }}
                                  />
                                  {transactionDateError && <p className="error-fields">Enter Transaction Date To Continue</p>}
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">Latest NAV Price</label>
                                  <input type="text" className="form-control" placeholder="Latest NAV Price" defaultValue={"1 share = 6.15 USD - From VITAL"} readOnly />
                                </Col>
                                <Col xs={12} lg={4} xl={4}>
                                  <label className="form-label">No Shares Owned</label>
                                  <input type="text" className="form-control" placeholder="No Shares Owned" defaultValue={"(Investor Perspective) - From VITAL"} readOnly />
                                </Col>
                                {/* <Col xs={12} lg={4} xl={4}>
                                                            <label className="form-label">
                                                                Dealing Cycle
                                                            </label>
                                                            <input type="date" className="form-control" placeholder="Dealing Cycle"
                                                                onChange={(e) => { setDealingCycle(e.target.value) }} />
                                                            {dealingCycleError && (
                                                                <p className="error-fields">Enter Dealing Cycle To Continue</p>
                                                            )}
                                                        </Col> */}
                              </Row>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  marginTop: "20px",
                                  marginBottom: "20px",
                                }}
                              >
                                <button
                                  className="btn btn-success"
                                  onClick={(e) => {
                                    handleSubmitTransactions(e);
                                  }}
                                >
                                  Submit
                                </button>
                              </div>
                              {/* <div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginTop: "20px",
                                                            }}
                                                        >
                                                            <div className="card" style={{ width: "450px", padding: "10px" }}>
                                                                <div
                                                                    style={{
                                                                        border: "dotted",
                                                                        height: "350px",
                                                                        cursor: "pointer",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                    }}
                                                                    onClick={(e) => {
                                                                        handleImageClick(e);
                                                                    }}
                                                                >
                                                                    <img id="imagePreview" src="" alt="Upload image" className="subscriptionUploadDocument" style={{ display: "none" }}></img>
                                                                    {contentTypeData.search("pdf") != -1 ? (
                                                                        <FeatherIcon icon="file" />
                                                                    ) :
                                                                        contentTypeData.search("word") != -1 ? (
                                                                            <FeatherIcon icon="file-text" />
                                                                        ) : null}
                                                                    <div id="imageUploadIcon">
                                                                        <FeatherIcon icon="camera" />
                                                                    </div>
                                                                    <div id="imageUploadText1">
                                                                        <h3>Upload Document</h3>
                                                                    </div>
                                                                    <div id="imageUploadText2">
                                                                        <p>Formats PDF only</p>
                                                                    </div>
                                                                    <div id="imageUploadText3">
                                                                        <p>Max Size 75 MB</p>
                                                                    </div>
                                                                </div>
                                                                <input type="file" id="inputImageElement" ref={docImage} style={{ display: "none" }} />
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "space-around",
                                                                        marginTop: "20px",
                                                                    }}
                                                                >
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        disabled={contentTypeData == "" ? true : false}
                                                                        onClick={(e) => {
                                                                            handleSubmitTransactions(e);
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                            </Card.Body>
                          </Card>
                        )}
                      </div>

                    </div>
                  </div>
                )}
                {/* ) : null} */}
              </div>
              {transactionHistoryData !== null &&
                (transactionHistoryData?.hasOwnProperty("SUBSCRIPTION_AGREEMENT") || transactionHistoryData?.hasOwnProperty("SUBSCRIPTION_APPLICATION") || transactionHistoryData.hasOwnProperty('CONTRIBUTION_AGREEMENT')) &&
                props?.dataOfAccountSetup?.accountData?.status == "accepted" && (
                  <>
                    {/* {transactionHistoryData.hasOwnProperty("SUBSCRIPTION_AGREEMENT") || transactionHistoryData.hasOwnProperty("SUBSCRIPTION_APPLICATION") ? ( */}
                    <>
                      <div class="col-12 col-md-3">
                        {props?.dataOfAccountSetup?.fundData?.meta?.config?.settings?.account?.addition?.status && (
                          <div class="card">
                            <div class="card-header">
                              <h4 class="card-header-title">Additional Investment</h4>
                            </div>
                            <div class="card-body">
                              {/* <div class="form-floating form-group">
                                <input type="number" class="form-control" id="floatingInput" value={additionalAmount} onChange={(event) => handleAdditionalAmountChange(event)} placeholder="Enter Additional Amount" />
                                <label for="floatingInput">Additional Amount</label>
                              </div> */}
                              {isEmailValid && (
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  onClick={(e) => {
                                    handleSignAndSubmit(e, "new", additionalSubscription);
                                  }}
                                >
                                  Sign & Submit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        {props?.dataOfAccountSetup?.fundData?.meta?.config?.settings?.account?.redemption?.status && (
                          <div class="card">
                            <div class="card-header">
                              <h4 class="card-header-title">Request Redemption</h4>
                            </div>
                            <div class="card-body">
                              {/* <div class="form-floating form-group">
                                <input type="number" class="form-control" id="floatingInput" value={redemptionAmount} onChange={(event) => handleRedemptionAmountChange(event)} placeholder="Enter Redemption Amount" />
                                <label for="floatingInput">Redemption Amount</label>
                              </div> */}
                              {isEmailValid && (
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  onClick={(e) => {
                                    handleSignAndSubmit(e, "new", redemptionSubscription);
                                  }}
                                >
                                  Sign & Submit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                    {/* ) : null} */}
                  </>
                )}
            </div>
            {transactionHistoryData && Object.keys(transactionHistoryData)?.length !== 0 ? (
              <div class="card">
                <div class="card-header">
                  <h4 class="card-header-title">Document History</h4>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class={"col-12 col-md-12"}>
                      <div class="table-responsive">
                        <table class="table table-sm table-nowrap card-table">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          {console.log(transactionHistoryData, "transactionHistoryData")}
                          <tbody class="list">
                            {transactionHistoryData &&
                              Object.keys(transactionHistoryData).map((item, index) => (
                                <>
                                  {transactionHistoryData[item].map((itemData, index) => (
                                    <tr>
                                      <td>{item.replaceAll("_", " ")}</td>
                                      <td>{formatDateRegionWise(itemData?.docUploadDateTime, true)}</td>
                                      <td>{itemData?.status == "pending" ? "Signed" : "Draft"}</td>
                                      <td>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {itemData?.status != "draft" && itemData?.status != "canceled" && (
                                            <FeatherIcon
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              icon="download"
                                              color="green"
                                              size="15"
                                              onClick={(e) => {
                                                handleDownloadDocument(itemData?.documentTypeId, itemData?.randomString);
                                              }}
                                            />
                                          )}

                                          {itemData?.mode === "manual" && (
                                            <div style={{ marginLeft: "1rem" }}>
                                              <Button
                                                onClick={() => handleDeleteClick(itemData, item)} //
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
                                                  backgroundColor: "red", // Add the red background color
                                                }}
                                              >
                                                <FeatherIcon icon="trash" size="1em" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

              <div class="card">
                <div class="card-header">
                  <h4 class="card-header-title">Transaction History</h4>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class={"col-12 col-md-12"}>
                      <div class="table-responsive">
                        <table class="table table-sm table-nowrap card-table">
                          <thead>
                            <tr>
                              <th>Subscription Type</th>
                              <th>Amount</th>
                              <th>No Of Shares</th>
                              <th>Currency</th>
                              <th>Status</th>
                              <th>Date</th>
                              {checkIfStampingEnable() && (<th>Stamp</th>)}
                              {props?.dataOfAccountSetup?.fundData?.region === "India" && checkIfESignEnable() && (<th>E Sign</th>)}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody class="list">
                            {transactionList &&
                              transactionList.map((item, index) => (
                                <tr>
                                  <td>{item?.type}</td>
                                  <td>{new Intl.NumberFormat().format(item?.amount ?? 0) || 0}</td>
                                  <td>{item?.meta?.moreInfo?.no_of_shares}</td>
                                  <td>{(item?.currency || "")?.toUpperCase()}</td>
                                  <td>{item?.status == "pending" ? "Pending For Review" : item?.status}</td>
                                  <td>{item?.transactionDate}</td>


                                  {checkIfStampingEnable() && item.type == "subscription" && (
                                    <td>
                                      {(item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.docuSign?.status == "signing_complete" || (item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1])?.docuSign?.mode == "manual") && (
                                        <>
                                          {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.STAMP_DOCUMENT ? (
                                            <>
                                              <FeatherIcon
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                                icon="download"
                                                color="green"
                                                size="15"
                                                onClick={(e) => {
                                                  handleDownloadStampDocument(item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.STAMP_DOCUMENT?.bucketKey);
                                                }}
                                              ></FeatherIcon>
                                              {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.STAMP_DOCUMENT?.stamp_paper_no.join(",")}
                                            </>
                                          ) : (
                                            <button
                                              className="btn btn-primary"
                                              onClick={(e) => {
                                                handleStamping(item);
                                              }}
                                            >
                                              Proceed
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </td>
                                  )}

                                  {(props?.dataOfAccountSetup?.fundData?.region === "India" && checkIfESignEnable() && item.type == "subscription") && (
                                    <td>
                                      {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1] && (item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.docuSign?.status == "signing_complete" || item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.mode == "manual") && (
                                        <>
                                          {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT && item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.status == "completed" ? (
                                            <>
                                              <FeatherIcon
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                                icon="download"
                                                color="green"
                                                size="15"
                                                onClick={(e) => {
                                                  handleDownloadStampDocument(item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.bucketKey);
                                                }}
                                              ></FeatherIcon>
                                            </>
                                          ) : (
                                            <>
                                              {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT && (
                                                <>
                                                  {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.signer_meta_info &&
                                                    item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.signer_meta_info.map((itemSigner, index) => (
                                                      <>
                                                        {itemSigner?.type == "CUSTOMER" && itemSigner?.sign != "SIGNED" ? (
                                                          <button
                                                            className="btn btn-primary"
                                                            onClick={(e) => {
                                                              handleESign(item.type, item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.randomString, item?.id);
                                                            }}
                                                            
                                                          >
                                                            Proceed
                                                          </button>
                                                        ) : null}
                                                      </>
                                                    ))}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1] && (item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.docuSign?.status == "signing_complete" || item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.mode == "manual") && (
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip className="mytooltip" style={{ padding: "20px" }}>
                                              {item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.signer_meta_info &&
                                                item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.signer_meta_info.map((itemESign, index) => (
                                                  <div className="row align-items-center mb-2">
                                                    <div className="col-auto">
                                                      <a href="#!" className="avatar avatar-lg">
                                                        <img src="/img/investor/default-avatar.png" alt="..." className="avatar-img rounded-circle" />
                                                      </a>
                                                    </div>
                                                    <div className="col ms-n2">
                                                      <h4 className="mb-1">
                                                        <p
                                                          style={{
                                                            marginBottom: "0px",
                                                          }}
                                                        >
                                                          {itemESign?.signer_email}
                                                        </p>
                                                      </h4>
                                                      <ProgressBar color={itemESign?.sign ? "success" : "warning"} now={itemESign?.sign == "SIGNED" ? 100 : 33} />
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "space-between",
                                                        }}
                                                      >
                                                        <p className={itemESign?.sign == "SIGNED" ? "small text-success mb-1" : "small text-success mb-1"}>Pending</p>
                                                        <p className={itemESign?.sign == "SIGNED" ? "small text-success mb-1" : "small text-muted mb-1"}>Signed</p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                            </Tooltip>
                                          }
                                        >
                                          <ProgressBar now={getSignedPercentage(item?.meta?.[item.type]?.[item?.meta?.[item.type]?.length - 1]?.AADHAAR_SIGN_DOCUMENT?.signer_meta_info)} />
                                        </OverlayTrigger>
                                      )}
                                    </td>
                                  )}
                                  <td>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                      <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                          handleSignAndSubmit(e, "new", item);
                                        }}
                                      >
                                        Sign & Submit
                                      </button>
                                      {userId === item?.meta?.moreInfo?.created_by?.id && (
                                        <div
                                          onClick={() => {
                                            setDeleteConfirmationModal(true);
                                            setSelectedRow(item);
                                          }}
                                        >
                                          <OverlayTrigger overlay={<Tooltip>delete transaction</Tooltip>}>
                                            <span className="position-relative me-4">
                                              <FeatherIcon color="red" icon="trash" size="1.5em" />
                                            </span>
                                          </OverlayTrigger>
                                        </div>
                                      )}
                                    </div>

                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <Modal show={signSubmit} onHide={handleSignSubmitClose}>
              <Modal.Header closeButton>
                <Modal.Title>Please select document signing mode</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {isAmount && (
                  <div className="row mt-2">
                    <div className="col-sm-7">
                      {/* <label for="floatingInput">Initial Investment Amount</label> */}
                      <input
                        class="form-control"
                        id="floatingInput"
                        value={amount}
                        onChange={handleChangeAmount}
                        placeholder={
                          requiredDocList?.category_key == "SUBSCRIPTION_DOCUMENT"
                            ? "Enter Investment/ Commitment Amount"
                            : requiredDocList?.category_key == "ADDITIONAL_SUBSCRIPTION_DOCUMENT"
                              ? "Enter Addition Investment Amount"
                              : requiredDocList?.category_key == "REDEMPTION_DOCUMENT"
                                ? "Enter Redemption Amount"
                                : "Enter Investment/ Commitment Amount"
                        }
                      />
                      {errorAmount ? (
                        <span style={{ color: "red" }} className="danger">
                          Amount is required
                        </span>
                      ) : null}
                      {/* {subscriptionAmountRangeError && (
                            <span style={{ color: "red" }} className="danger">
                              Amount should be between {minSubscriptionAmount} and {maxSubscriptionAmount}
                            </span>
                          )} */}
                    </div>
                    <div className="col-sm-5">
                      <Select
                        options={currencyOptions}
                        styles={customStyles}
                        onChange={handleChangeCurrency}
                        placeholder={`Select Currency`}
                        defaultValue={selectedCurrencyValues || "Select"}
                      // className={errors && errors[field] ? "is-invalid" : ""}
                      />
                      {errorCurrency ? (
                        <span style={{ color: "red" }} className="danger">
                          Currency is required
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="row mt-5">
                  <div className="col-sm-6">
                    <Dropdown align="end">
                      <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                        <Button className="lift">
                          <FontAwesomeIcon icon={faFileSignature} style={{ marginRight: "0.5rem" }} />
                          Manual Signature
                        </Button>
                      </Dropdown.Toggle>
                      {/* <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                          <Button className="lift">Manual Signature</Button>
                        </Dropdown.Toggle> */}
                      {console.log(requiredDocList, "requiredDocList requiredDocList requiredDocList requiredDocList")}
                      <Dropdown.Menu as="div" className="custom-dropdown-menu">
                        <Dropdown.Item
                          onClick={(e) => {
                            handleClickUpload();
                          }}
                        >
                          Upload Document
                        </Dropdown.Item>
                        <Dropdown align="right" alignRight>
                          <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                            <Button
                              style={{
                                background: "transparent",
                                border: "0px",
                                color: "#fff",
                              }}
                              className="lift-btn"
                            >
                              <p style={{ color: "white!important" }}>Download Document</p>
                            </Button>
                          </Dropdown.Toggle>
                          {requiredDocList?.choices ? (
                            <Dropdown.Menu as="div" className="custom-dropdown-menu">
                              {Object.keys(requiredDocList?.choices)?.map((item, index) => (
                                <Dropdown.Item
                                  onClick={(e) => {
                                    handleClickDownloadManual(item, requiredDocList?.id);
                                  }}
                                  key={index}
                                >
                                  {item}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          ) : (
                            <Dropdown.Menu as="div" className="custom-dropdown-menu">
                              <Dropdown.Item>
                                <p style={{ color: "white!important" }}>No Data Found</p>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          )}
                        </Dropdown>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="col-sm-6" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Dropdown align="end">
                      <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                        <Button className="lift">
                          <FontAwesomeIcon icon={faFileSignature} style={{ marginRight: "0.5rem" }} />
                          Digital Signature
                        </Button>
                      </Dropdown.Toggle>
                      {/* <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                          <Button className="lift">Digital Signature</Button>
                        </Dropdown.Toggle> */}
                      {requiredDocList?.choices ? (
                        <Dropdown.Menu
                          as="div"
                          className="custom-dropdown-menu"
                        >
                          {Object.keys(requiredDocList?.choices)?.map(
                            (item, index) => item === 'deleted' ? null : (
                              <Dropdown.Item
                                onClick={() => {
                                  handleClickChoice(item);
                                }}
                                key={index}
                              >
                                {
                                  <p style={{ color: 'white!important' }}>
                                    {' '}
                                    {item
                                      ?.split(' ')
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1).toLowerCase(),
                                      )
                                      .join(' ')}
                                  </p>
                                }
                              </Dropdown.Item>
                            ),
                          )}
                        </Dropdown.Menu>
                      ) : (
                        <Dropdown.Menu as="div" className="custom-dropdown-menu">
                          <Dropdown.Item>
                            <p style={{ color: "white!important" }}>No Data Found</p>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      )}
                    </Dropdown>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  {uploadDocument && (
                    <div className="card" style={{ width: "350px", padding: "10px" }}>
                      {pDFError && <p style={{ color: "red" }}>Only Pdf file is allowed to upload</p>}
                      <div
                        style={{
                          border: "dotted",
                          height: "350px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) => {
                          handleImageClick(e);
                        }}
                      >
                        <img id="imagePreview" src="" alt="Upload image" className="subscriptionUploadDocument" style={{ display: "none" }}></img>
                        {contentTypeData.search("pdf") != -1 ? (
                          <FeatherIcon icon="file" />
                        ) : // <PdfIcon style={{ fill: "white" }} fontSize={"medium"} color={"action"}></PdfIcon>
                          contentTypeData.search("word") != -1 ? (
                            <FeatherIcon icon="file-text" />
                          ) : null}
                        {/* <canvas class="result"></canvas> */}
                        <div id="imageUploadIcon">
                          <FeatherIcon icon="camera" />
                        </div>
                        <div id="imageUploadText1">
                          <h3>Upload Document</h3>
                        </div>
                        <div id="imageUploadText2">
                          <p>Formats PDF only</p>
                        </div>
                        <div id="imageUploadText3">
                          <p>Max Size 75 MB</p>
                        </div>
                      </div>
                      <input type="file" id="inputImageElement" ref={docImage} style={{ display: "none" }} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginTop: "20px",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          disabled={contentTypeData == "" ? true : false}
                          onClick={(e) => {
                            handleUploadDocument(e);
                          }}
                        >
                          Upload
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={(e) => {
                            handleCancelUploadDocument(e);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleSignSubmitClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </div>
        {deleteManualDocConfirmation && (
          <DeleteManualDocModal
            openDeleteModal={deleteManualDocConfirmation}
            handleClose={handleCloseModalManual}
            selectedRow={selectedManualUploadedDoc}
            selectedRequiredKey={selectedManualRequiredKey}
            handleAlert={handleAlert}
            getList={() => {
              handleGetRequiredDocument();
              getInitialInvestmentSign();
              getTransactionHistory();
              getSingleAccountDetailById(account_id);
            }}
          />
        )}

        {deleteConfirmationModal && (
          <DeleteTransactionModal
            openDeleteModal={deleteConfirmationModal}
            handleClose={handleCloseModal}
            selectedRow={selectedRow}
            handleAlert={handleAlert}
            getTransactionList={getTransactionList}
            getuserDetail={getUserDetail}
            account_id={account_id}
          />
        )}
      </div>
    </div>
  );
}
