import {
  Col,
  Container,
  Row,
  Nav,
  Dropdown,
  Button,
  Modal,
} from "react-bootstrap";
import { SubscriptionDetailHeader } from "../../../../widgets";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
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
  postStampingApi,
  postDownloadStampDpcApi,
} from "../../../../api/network/customerApi";
import { BsChevronRight } from "react-icons/bs";

// import CustomAlert from "../../../../widgets/bootstrap-component/Alert";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
// import SpinnerWithBackDrop from "../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../../components/ui/loader";
import FeatherIcon from "feather-icons-react";
import {
  getMaxSubscriptionAmount,
  getMinSubscriptionAmount,
  getMaxAdditionalSubscriptionAmount,
  getMinAdditionalSubscriptionAmount,
  getMaxRedemptionSubscriptionAmount,
  getMinRedemptionSubscriptionAmount,
} from "../../../../helpers/getFundConfiguration";
import { Select } from "../../../../components/vendor";

const themeDark = localStorage.getItem("portal_theme");
const customStyles =
  themeDark == "dark" || themeDark == undefined
    ? {
        option: (provided, state) => ({
          ...provided,
          color: "#93a6c6",
          ":active": {
            backgroundColor: "#3b82f6",
            color: "#fff",
          },
        }),
        control: (provided, state) => ({
          ...provided,
          minHeight: "40px",
          backgroundColor: "#1e3a5c",
          color: "#93a6c6",
          borderColor: state.isFocused ? null : "#444",
        }),
        menu: (provided, state) => ({
          ...provided,
          backgroundColor: "#1e3a5c",
          color: "#93a6c6",
        }),
        placeholder: (provided, state) => ({
          ...provided,
          color: "#93a6c6",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#fff",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          display: "none",
        }),
      }
    : {
        control: (provided, state) => ({
          ...provided,
          minHeight: "40px",
        }),
      };

export default function investment({ ...props }) {
  console.log(props, "props?.props?.props?.props?.");
  console.log(props?.fundConfigurationData, "props?.fundConfigurationData");
  const [requiredDocList, setRequiredDocList] = useState([]);
  const [requiredDocListAll, setRequiredDocListAll] = useState([]);
  const [additionalSubscription, setAdditionalSubscription] = useState([]);
  const [redemptionSubscription, setRedemptionSubscription] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [isLoaderStamp, setIsLoaderStamp] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountFormatted, setAmountFormatted] = useState("");
  const [envelopeID, setEnvelopeID] = useState("");
  const [errorAmount, setErrorAmount] = useState(false);
  const [errorCurrency, setErrorCurrency] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionHistoryData, setTransactionHistoryData] = useState(null);
  const [signSubmit, setSignSubmit] = useState(false);
  const [uploadDocument, setUploadDocument] = useState(false);
  const [contentTypeData, setContentTypeData] = useState("");
  const [subscriptionAmountRangeError, setShowSubscriptionAmountRangeError] =
    useState(false);
  const [maxSubscriptionAmount, setMaxSubscriptionAmount] = useState();
  const [minSubscriptionAmount, setMinSubscriptionAmount] = useState();
  const [additionalAmount, setAdditionalAmount] = useState(null);
  const [redemptionAmount, setRedemptionAmount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAmount, setIsAmount] = useState(false);
  const [showProceed, setProceed] = useState(false);
  const [currencyValues, setCurrencyValues] = useState(
    props?.fundConfigurationData?.meta?.config?.settings?.account?.applicant
      ?.asset?.traditional?.network?.length > 0
      ? props?.fundConfigurationData?.meta?.config?.settings?.account?.applicant
          ?.asset?.traditional?.network
      : []
  );
  const [selectedCurrencyValues, setSelectedCurrencyValues] = useState([]);
  const [documentIdForVerifyUpload, setDocumentIdForVerifyUpload] =
    useState("");
  const [currencyOptions, setCurrencyOptions] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const docImage = useRef();
  const inputRef = useRef(null);

  const params = useParams();
  let path = params["*"];
  const pathSegments = path.split("/");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];
  const history = useLocation();
  const navigate = useNavigate();
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  useEffect(() => {
    let options;
    console.log("dsadasda", props);
    console.log("dsadasda currencyValues", currencyValues);
    // debugger;

    if (currencyValues.length > 0) {
      options = currencyValues.map((item) => ({
        value: item,
        label: item,
      }));
      setCurrencyOptions(options);
    }
  }, []);
  useEffect(() => {
    console.log("dsadasda", props);

    setMaxSubscriptionAmount(
      getMaxSubscriptionAmount(props?.fundConfigurationData)
    );
    setMinSubscriptionAmount(
      getMinSubscriptionAmount(props?.fundConfigurationData)
    );
  }, [props]);
  useEffect(() => {
    handleGetRequiredDocument();
    getInitialInvestmentSign();
    getTransactionHistory();
    if (account_id) {
      getSingleAccountDetailById(account_id);
    }
  }, []);
  useEffect(() => {
    console.log(amount, "amount amount amount");

    if (
      amount >= getMinSubscriptionAmount(props?.fundConfigurationData) &&
      amount <= getMaxSubscriptionAmount(props?.fundConfigurationData)
    ) {
    } else {
      setShowSubscriptionAmountRangeError(true);
    }
  }, [amount]);

  useEffect(() => {
    if (accountData) {
      if (accountData?.attach_identities[0]) {
        if (accountData?.attach_identities[0]?.identity?.meta?.data) {
          let email =
            accountData?.attach_identities[0]?.identity?.meta?.data[
              `${accountData?.attach_identities[0]?.identity?.type.toLowerCase()}.extended.email`
            ]?.value;
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
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      accountId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      console.log("response", response);
      setAccountData(response?.data?.account_detail);
    } else {
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

    const { min, max } =
      props?.fundConfigurationData?.meta?.config?.settings?.account
        ?.redemption || {};
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

    const { min, max } =
      props?.fundConfigurationData?.meta?.config?.settings?.account?.addition ||
      {};
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

  console.log(params, "params params");

  const getInitialInvestmentSign = async () => {
    const response = await getInitialInvestmentSignAPI(
      account_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      console.log(
        response?.data,
        "response?.data response?.data response?.data response?.data"
      );
      setTransactionData(response?.data);
    }
  };
  const getTransactionHistory = async () => {
    const response = await getTransactionHistoryAPI(
      account_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setTransactionHistoryData(response?.data);
    }
  };
  const handleGetRequiredDocument = async () => {
    console.log(`checking`);
    setIsLoader(true);
    if (account_id) {
      const response = await getRequiredDocumentAPI(
        account_id,
        cancelTokenSource.token
      );

      if (response.success == true) {
        setIsLoader(false);
        console.log("checking required", response);
        let data = [];
        if (response?.data?.required_documents_types.length > 0) {
          for (let item of response?.data?.required_documents_types) {
            if (item?.category_key == "SUBSCRIPTION_DOCUMENT") {
              console.log(item, "item item item itemasdasd");
              data.push(item);
            }
            if (item?.category_key == "ADDITIONAL_SUBSCRIPTION_DOCUMENT") {
              setAdditionalSubscription(item);
            }
            if (item?.category_key == "REDEMPTION_DOCUMENT") {
              setRedemptionSubscription(item);
            }
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
  };
  const handleClickChoice = (key) => {
    if (requiredDocList?.has_amount) {
      if (amount == "") {
        setErrorAmount(true);
        return;
      } else {
        setErrorAmount(false);
      }
      if (!selectedCurrencyValues.value) {
        setErrorCurrency(true);
        return;
      } else {
        setErrorCurrency(false);
      }
    }
    const dateToSend = {
      redirect_url: window.location.href,
      choice: key,
      accountId: account_id,
      amount: requiredDocList?.has_amount ? amount : null,
      type: "subscription",
      currency: requiredDocList?.has_amount
        ? selectedCurrencyValues.value
          ? selectedCurrencyValues.value
          : selectedCurrencyValues
        : null,
    };
    requestSignUrl(dateToSend);
  };
  const requestSignUrl = async (data) => {
    setIsLoader(true);
    const response = await getSignedURLAPI(
      data,
      requiredDocList.id,
      cancelTokenSource.token
    );

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
  const handleSignAndSubmit = (e, status, data) => {
    if (data?.has_amount) {
      setIsAmount;
    }
    setRequiredDocList(data);
    setIsAmount(data?.has_amount);
    if (status == "re-sign") {
      setShowModal(true);

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
      const filteredDocuments = documents.filter(
        (doc) => doc.documentTypeId === mineDocumentTypeID
      );

      // Sort the filtered documents by docUploadDateTime in descending order
      filteredDocuments.sort(
        (a, b) => b.docUploadDateTime - a.docUploadDateTime
      );

      // Get the time span from the current time to each document's upload time
      const currentTime = Date.now();
      for (let i = 0; i < filteredDocuments.length; i++) {
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
    if (requiredDocList?.has_amount) {
      if (amount == "") {
        setErrorAmount(true);
        return;
      } else {
        setErrorAmount(false);
      }
      if (!selectedCurrencyValues.value) {
        setErrorCurrency(true);
        return;
      } else {
        setErrorCurrency(false);
      }
    }
    setIsLoader(true);
    console.log(requiredDocList, "requiredDocList");
    const data = {
      account_id: account_id,
      currency: requiredDocList?.has_amount
        ? selectedCurrencyValues.value
        : null,
      type: "subscription",
      // type: requiredDocList?.category_key == "SUBSCRIPTION_DOCUMENT" ? "subscription" : requiredDocList?.category_key == "ADDITIONAL_SUBSCRIPTION_DOCUMENT" ? "addition" : requiredDocList?.category_key == "REDEMPTION_DOCUMENT" ? "redemption" : null,
      content_type: contentTypeData,
      amount: requiredDocList?.has_amount ? parseInt(amount) : null,
      document_type_id: requiredDocList?.id,
    };
    console.log("is it ", data);
    const response = await transactionDocAddApi(data, cancelTokenSource.token);
    if (response.success) {
      setUploadDocument(false);
      setIsLoader(true);
      // setDocumentIdForVerifyUpload(requiredDocList?.id);
      const randomString = getShortestTimeSpan(
        response?.data?.account_info?.meta?.subscriptionDocuments,
        requiredDocList?.id
      );
      console.log("randomString", randomString); // Output: cDzAy9HoLm0M6id0ykbL
      const dataToUpload = {
        docTypeId: requiredDocList?.id,
        randomString: randomString,
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

          const res = await transactionDocVerifyUpload(
            dataToUpload,
            account_id,
            cancelTokenSource.token
          );
          // const res = await transactionDocVerifyUpload(response?.data?.transaction_document_id, cancelTokenSource.token);
          if (res.success) {
            setIsLoader(false);
            handleGetRequiredDocument();
            getInitialInvestmentSign();
            getTransactionHistory();
            if (account_id) {
              getSingleAccountDetailById(account_id);
            }
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
        message: "Document Added Successfully",
        show: true,
        hideAuto: true,
      });
      props?.refreshAccountDetail();
      setSignSubmit(false);
      getInitialInvestmentSign();
      getTransactionHistory();
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
    const response = await getDownloadSigningDocument(
      item,
      id,
      account_id,
      cancelTokenSource.token
    );
    console.log("response id", response);
    if (response.success == true) {
      setIsLoader(false);
      window.open(`${response?.data?.signed_url?.url}`, "_blank");
    } else {
      setIsLoader(false);
    }
  };
  const handleClickFinishSigning = async (
    e,
    envelop_id,
    random_string,
    documentType
  ) => {
    setIsLoader(true);
    const data = {
      redirect_url: window.location.href,
      envelop_id: envelop_id,
      randomKey: random_string,
      accountId: account_id,
      type: "subscription",
    };
    const response = await getDocuSignURLForFinishSigningAPI(
      data,
      documentType,
      cancelTokenSource.token
    );
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
    const response = await getDownloadDocuSignAPI(
      documentTypeId,
      dataToSend,
      cancelTokenSource.token
    );
    console.log("response id", response);
    if (response.success == true) {
      setIsLoader(false);

      if (response?.data?.signed_url?.url) {
        if (response?.data?.signed_url?.url.length > 0) {
          for (let a = 0; a < response?.data?.signed_url?.url.length; a++) {
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

  const handleDownloadStampDocument = async (doc) => {
    setIsLoader(true);

    const dataToSend = {
      key: doc["STAMP_DOCUMENT"]?.bucketKey,
    };
    const response = await postDownloadStampDpcApi(
      dataToSend,
      cancelTokenSource.token
    );
    console.log("response", response);
    if (response.success) {
      window.open(response?.data, "_blank");

      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };
  const handleChangeCurrency = (selectedOption) => {
    setSelectedCurrencyValues(selectedOption);
  };

  function formatNumberWithCommas(number) {
    if (isNaN(number)) {
      return ""; // Return an empty string for invalid input
    }

    const parts = parseFloat(number).toFixed(0).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function removeCommasFromFormattedNumber(formattedNumber) {
    const withoutCommas = formattedNumber.replace(/,/g, "");
    const withoutDecimals = withoutCommas.replace(/\.\d*/, "");
    return withoutDecimals;
  }

  const handleChangeAmount = (event) => {
    const inputValue = event.target.value;
    const unformattedNumber = removeCommasFromFormattedNumber(inputValue);

    console.log("weaeawe", event.target.value);
    console.log("weaeawe minSubscriptionAmount", minSubscriptionAmount);
    console.log("weaeawe maxSubscriptionAmount", maxSubscriptionAmount);
    console.log("requiredDocList requiredDocList", requiredDocList);
    setAmount(unformattedNumber);

    let maxAmount = maxSubscriptionAmount;
    let minAmount = minSubscriptionAmount;
    if (requiredDocList?.category_key == "SUBSCRIPTION_DOCUMENT") {
      maxAmount = maxSubscriptionAmount;
      minAmount = minSubscriptionAmount;
    } else if (
      requiredDocList?.category_key == "ADDITIONAL_SUBSCRIPTION_DOCUMENT"
    ) {
      maxAmount = getMaxAdditionalSubscriptionAmount(
        props?.fundConfigurationData
      );
      minAmount = getMinAdditionalSubscriptionAmount(
        props?.fundConfigurationData
      );
    } else if (requiredDocList?.category_key == "REDEMPTION_DOCUMENT") {
      maxAmount = getMaxRedemptionSubscriptionAmount(
        props?.fundConfigurationData
      );
      minAmount = getMinRedemptionSubscriptionAmount(
        props?.fundConfigurationData
      );
    }
    if (!isNaN(unformattedNumber)) {
      const formattedAmount = formatNumberWithCommas(unformattedNumber);

      if (formattedAmount == "NaN") {
        setAmountFormatted("");
      } else {
        const formattedValue = `${formattedAmount}.00`;

        setAmountFormatted(formattedValue);
        if (inputRef.current) {
          inputRef.current.value = formattedValue; // Update input value
          inputRef.current.selectionStart = formattedValue.length - 3; // Set cursor before .00
          inputRef.current.selectionEnd = formattedValue.length - 3;
        }
      }
    } else {
      setAmountFormatted("");
    }
    if (unformattedNumber >= minAmount && unformattedNumber <= maxAmount) {
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
    setSignSubmit(false);
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };
  function isEmptyObject(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false; // Object has properties, so it's not empty
      }
    }
    return true; // Object has no properties, so it's empty
  }

  const isDocumentUploaded = (id) => {
    // console.log(Object.keys(props?.accountData?.meta?.subscriptionDocuments), "props?.accountData?.meta?.subscriptionDocuments");
    var returnData = false;
    if (props?.accountData?.meta?.subscriptionDocuments) {
      if (
        Object.keys(props?.accountData?.meta?.subscriptionDocuments)?.length > 0
      ) {
        for (let a of Object.keys(
          props?.accountData?.meta?.subscriptionDocuments
        )) {
          if (props?.accountData?.meta?.subscriptionDocuments[a]) {
            const filteredDocuments =
              props?.accountData?.meta?.subscriptionDocuments[a]?.sort(
                (a, b) => b.docUploadDateTime - a.docUploadDateTime
              );

            console.log(
              filteredDocuments[0]?.documentTypeId,
              "filteredDocuments filteredDocuments"
            );
            console.log(id, "filteredDocuments filteredDocuments id");
            console.log(
              filteredDocuments[0],
              "filteredDocuments filteredDocuments"
            );
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
    if (props?.accountData?.meta?.subscriptionDocuments) {
      if (
        props?.accountData?.meta?.subscriptionDocuments.hasOwnProperty(
          keyOfDocument
        )
      ) {
        documents =
          props?.accountData?.meta?.subscriptionDocuments[keyOfDocument];
      }
    }
    console.log("documents", documents);

    let shortestTimeSpan = Infinity;

    let latestDocumentRandomStatus = "";

    // Sort the filtered documents by docUploadDateTime in descending order
    const filteredDocuments = documents?.sort(
      (a, b) => b.docUploadDateTime - a.docUploadDateTime
    );

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

    return latestDocumentRandomStatus == ""
      ? "Not Completed"
      : latestDocumentRandomStatus;
  };
  const checkIfShowAdditional = () => {
    if (
      props?.fundConfigurationData?.meta?.config?.settings?.account?.addition
        ?.status ||
      props?.fundConfigurationData?.meta?.config?.settings?.account?.redemption
        ?.status
    ) {
      if (transactionHistoryData) {
        if (
          transactionHistoryData.hasOwnProperty("SUBSCRIPTION_AGREEMENT") ||
          transactionHistoryData.hasOwnProperty("SUBSCRIPTION_APPLICATION")
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };
  const handleClickMissingParticulars = (e) => {
    console.log("vbnmjk,");
    navigate(
      `/profile/detail/${accountData?.attach_identities[0]?.identityId}/${account_id}?step=identity?step=identity`
    );
  };
  const handleNextStep = () => {
    let nextStepRoute;

    nextStepRoute = `/profile/identity/${params?.type}/overview/${params?.identity_id}/${params?.account_id}`;

    navigate(nextStepRoute);
  };
  const handleClickStemp = async (item, docUploadedData) => {
    setIsLoaderStamp(true);

    const data = {
      id: docUploadedData?.randomString,
      document_type_key: item?.key,
    };
    const response = await postStampingApi(
      identity_id,
      accountData?.attach_identities[0]?.id,
      data,
      cancelTokenSource.token
    );
    console.log("response", response);
    if (response.success) {
      location.reload();

      setIsLoaderStamp(false);
    } else {
      setIsLoaderStamp(false);
    }
  };
  const checkIfStampingEnable = () => {
    return props?.fundConfigurationData?.meta?.config?.settings?.account
      ?.stamping?.status;
  };
  return (
    <div className="main-content">
      {/* {alertProps.show && (
        <CustomAlert
          handleCloseAlert={handleCloseAlert}
          message={alertProps.message}
          variant={alertProps.variant}
          show={alertProps.show}
          hideAuto={alertProps.hideAuto}
          onClose={() => setAlertProps({ ...alertProps, show: false })}
        >
          {alertProps.message}
        </CustomAlert>
      )} */}
      <Container fluid>
        {isLoaderStamp ? (
          // <SpinnerWithBackDrop animation="grow" custom={true} height="100vh" />
          <Loader />
        ) : (
          <Row className="justify-content-center">
            <Col
              xs={12}
              lg={props?.accountData?.status == "accepted" ? 10 : 12}
              xl={props?.accountData?.status == "accepted" ? 10 : 12}
            >
              {/* <SubscriptionDetailHeader forTabsCheck={history?.state} /> */}
              <div style={{ maxHeight: "22em" }} class="row">
                {/* <div class="col-12 col-md-9"> */}
                {/* <div class={(checkIfShowAdditional() && props?.accountData?.status == "accepted") ? "col-12 col-md-9" : "col-12 col-md-12"}> */}
                <div class={"col-12 col-md-9"}>
                  {isLoader ? (
                    // <SpinnerWithBackDrop
                    //   animation="grow"
                    //   custom={true}
                    //   height="100vh"
                    // />
                    <Loader />
                  ) : null}
                  {/* {transactionData.length == 0 ? ( */}
                  <div class="card">
                    <div class="card-header">
                      <h4 class="card-header-title">Review & Sign Documents</h4>
                    </div>
                    <div class="card-body">
                      <div className="row">
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
                            <tbody class="list">
                              {requiredDocListAll.length != 0 &&
                                requiredDocListAll.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      {item?.name && (
                                        <span>
                                          {item?.name && (
                                            <span>
                                              {item?.name
                                                .split(" ")
                                                .map(
                                                  (word) =>
                                                    word
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    word.slice(1)
                                                )
                                                .join(" ")}
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {isDocumentUploaded(item?.id)
                                        ? dateFormate(
                                            isDocumentUploaded(item?.id)
                                              ?.docUploadDateTime
                                          )
                                        : ""}
                                    </td>
                                    {/* <td>{isDocumentUploaded(item?.id) ? isDocumentUploaded(item?.id)?.status == "pending" ? "Signed" : "Draft" : 'Not Completed'}</td> */}
                                    <td>{getStatus(item)}</td>
                                    <td>
                                      {isDocumentUploaded(item?.id) &&
                                      isEmailValid ? (
                                        <>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {!isDocumentUploaded(
                                              item?.id
                                            ).hasOwnProperty(
                                              "STAMP_DOCUMENT"
                                            ) ? (
                                              isDocumentUploaded(item?.id)
                                                ?.status != "draft" &&
                                              isDocumentUploaded(item?.id)
                                                ?.status != "canceled" && (
                                                <FeatherIcon
                                                  style={{ cursor: "pointer" }}
                                                  icon="download"
                                                  color="green"
                                                  size="15"
                                                  onClick={(e) => {
                                                    handleDownloadDocument(
                                                      isDocumentUploaded(
                                                        item?.id
                                                      )?.documentTypeId,
                                                      isDocumentUploaded(
                                                        item?.id
                                                      )?.randomString
                                                    );
                                                  }}
                                                />
                                              )
                                            ) : (
                                              <FeatherIcon
                                                style={{ cursor: "pointer" }}
                                                icon="download"
                                                color="green"
                                                size="15"
                                                onClick={(e) => {
                                                  handleDownloadStampDocument(
                                                    isDocumentUploaded(item?.id)
                                                  );
                                                }}
                                              />
                                            )}
                                            {isDocumentUploaded(item?.id)
                                              ?.status != "draft" &&
                                              isDocumentUploaded(item?.id)
                                                ?.status != "canceled" && (
                                                <div>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <button
                                                      style={{
                                                        marginLeft: "15px",
                                                      }}
                                                      className="btn btn-primary"
                                                      onClick={(e) => {
                                                        handleSignAndSubmit(
                                                          e,
                                                          "re-sign",
                                                          item
                                                        );
                                                        setAmount(
                                                          isDocumentUploaded(
                                                            item?.id
                                                          )?.amount
                                                        );
                                                        setSelectedCurrencyValues(
                                                          isDocumentUploaded(
                                                            item?.id
                                                          )?.currency
                                                        );
                                                        setIsAmount(
                                                          item?.has_amount
                                                        );
                                                      }}
                                                    >
                                                      Re Sign
                                                    </button>
                                                    {/* {checkIfStampingEnable() && isDocumentUploaded(item?.id)?.mode == "manual" && !isDocumentUploaded(item?.id).hasOwnProperty("STAMP_DOCUMENT") && (
                                                  <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-primary"
                                                    onClick={(e) => {
                                                      handleClickStemp(item, isDocumentUploaded(item?.id));
                                                      console.log("please be e", isDocumentUploaded(item?.id));
                                                    }}
                                                  >
                                                    Stamp
                                                  </button>
                                                )} */}
                                                  </div>

                                                  <Modal
                                                    show={showModal}
                                                    onHide={handleModalClose}
                                                  >
                                                    <Modal.Header closeButton>
                                                      <Modal.Title>
                                                        Confirmation Message
                                                      </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                      The data entered in the
                                                      document previously will
                                                      be cleared. Would you like
                                                      to proceed?
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                      <Button
                                                        variant="secondary"
                                                        onClick={
                                                          handleModalClose
                                                        }
                                                      >
                                                        Close
                                                      </Button>
                                                      <Button
                                                        variant="secondary"
                                                        onClick={handleProceed}
                                                      >
                                                        Proceed
                                                      </Button>
                                                    </Modal.Footer>
                                                  </Modal>
                                                </div>
                                              )}

                                            {isDocumentUploaded(item?.id)
                                              ?.status == "draft" && (
                                              <>
                                                <button
                                                  style={{ marginLeft: "10px" }}
                                                  className="btn btn-primary"
                                                  onClick={(e) => {
                                                    setIsAmount(
                                                      item?.has_amount
                                                    ),
                                                      handleClickFinishSigning(
                                                        e,
                                                        isDocumentUploaded(
                                                          item?.id
                                                        )?.docuSign
                                                          ?.envelope_id,
                                                        isDocumentUploaded(
                                                          item?.id
                                                        )?.randomString,
                                                        isDocumentUploaded(
                                                          item?.id
                                                        )?.documentTypeId
                                                      );
                                                  }}
                                                >
                                                  Finish Signing
                                                </button>
                                                <div>
                                                  <button
                                                    style={{
                                                      marginLeft: "10px",
                                                    }}
                                                    className="btn btn-primary"
                                                    onClick={(e) => {
                                                      handleSignAndSubmit(
                                                        e,
                                                        "re-sign",
                                                        item
                                                      );
                                                      setAmount(
                                                        isDocumentUploaded(
                                                          item?.id
                                                        )?.amount
                                                      );
                                                      setSelectedCurrencyValues(
                                                        isDocumentUploaded(
                                                          item?.id
                                                        )?.currency
                                                      );
                                                      setIsAmount(
                                                        item?.has_amount
                                                      );
                                                    }}
                                                  >
                                                    Re Sign
                                                  </button>

                                                  <Modal
                                                    show={showModal}
                                                    onHide={handleModalClose}
                                                  >
                                                    <Modal.Header closeButton>
                                                      <Modal.Title>
                                                        Confirmation Message
                                                      </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                      The data entered in the
                                                      document previously will
                                                      be cleared. Would you like
                                                      to proceed?
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                      <Button
                                                        variant="secondary"
                                                        onClick={
                                                          handleModalClose
                                                        }
                                                      >
                                                        Close
                                                      </Button>
                                                      <Button
                                                        variant="secondary"
                                                        onClick={handleProceed}
                                                      >
                                                        Proceed
                                                      </Button>
                                                    </Modal.Footer>
                                                  </Modal>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        isEmailValid && (
                                          <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                              handleSignAndSubmit(
                                                e,
                                                "new",
                                                item
                                              );
                                            }}
                                          >
                                            Sign & Submit
                                          </button>
                                        )
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {!isEmailValid && (
                            <div className="card">
                              <div className="card-body">
                                <div className="missing_required_fields_documents">
                                  <p className="text-muted">
                                    <span>Warning! </span> Please add your valid
                                    email address before proceeding.
                                  </p>
                                  <FeatherIcon
                                    icon="arrow-right-circle"
                                    onClick={(e) => {
                                      handleClickMissingParticulars(e);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ) : null} */}
                </div>
                {transactionHistoryData &&
                  props?.accountData?.status == "accepted" && (
                    <>
                      {/* {transactionHistoryData.hasOwnProperty("SUBSCRIPTION_AGREEMENT") || transactionHistoryData.hasOwnProperty("SUBSCRIPTION_APPLICATION") ? ( */}
                      <>
                        <div class="col-12 col-md-3">
                          {props?.fundConfigurationData?.meta?.config?.settings
                            ?.account?.addition?.status && (
                            <div class="card">
                              <div class="card-header">
                                <h4 class="card-header-title">
                                  Additional Investment
                                </h4>
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
                                      handleSignAndSubmit(
                                        e,
                                        "new",
                                        additionalSubscription
                                      );
                                    }}
                                  >
                                    Sign & Submit
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                          {props?.fundConfigurationData?.meta?.config?.settings
                            ?.account?.redemption?.status && (
                            <div class="card">
                              <div class="card-header">
                                <h4 class="card-header-title">
                                  Request Redemption
                                </h4>
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
                                      handleSignAndSubmit(
                                        e,
                                        "new",
                                        redemptionSubscription
                                      );
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
              {!isEmptyObject(transactionHistoryData) ? (
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-header-title">Document History</h4>
                  </div>
                  <div
                    class="card-body"
                    style={{
                      maxHeight: "10em!important",
                      overflow: "scroll!important",
                    }}
                  >
                    <div
                      class="row"
                      style={{ maxHeight: "10em", overflow: "scroll" }}
                    >
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
                            {console.log(
                              transactionHistoryData,
                              "transactionHistoryData"
                            )}
                            <tbody class="list">
                              {transactionHistoryData &&
                                Object.keys(transactionHistoryData).map(
                                  (item, index) => (
                                    <>
                                      {transactionHistoryData[item].map(
                                        (itemData, index) => (
                                          <tr>
                                            <td>{item.replaceAll("_", " ")}</td>
                                            <td>
                                              {dateFormate(
                                                itemData?.docUploadDateTime
                                              )}
                                            </td>
                                            <td>
                                              {itemData?.status == "pending"
                                                ? "Signed"
                                                : "Draft"}
                                            </td>
                                            <td>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {itemData?.status != "draft" &&
                                                  itemData?.status !=
                                                    "canceled" && (
                                                    <FeatherIcon
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      icon="download"
                                                      color="green"
                                                      size="15"
                                                      onClick={(e) => {
                                                        handleDownloadDocument(
                                                          itemData?.documentTypeId,
                                                          itemData?.randomString
                                                        );
                                                      }}
                                                    />
                                                  )}
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </>
                                  )
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <Modal show={signSubmit} onHide={handleSignSubmitClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Please Select Document Signing Mode</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {isAmount && (
                    <div className="row mt-2">
                      <div className="col-sm-7">
                        {/* <label for="floatingInput">Initial Investment Amount</label> */}
                        <input
                          type="text"
                          class="form-control"
                          id="floatingInput"
                          value={amountFormatted}
                          ref={inputRef}
                          onChange={handleChangeAmount}
                          placeholder={
                            requiredDocList?.category_key ==
                            "SUBSCRIPTION_DOCUMENT"
                              ? "Investment/ Commitment Amount"
                              : requiredDocList?.category_key ==
                                "ADDITIONAL_SUBSCRIPTION_DOCUMENT"
                              ? "Enter Addition Investment Amount"
                              : requiredDocList?.category_key ==
                                "REDEMPTION_DOCUMENT"
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
                        <Dropdown.Toggle
                          as="span"
                          className="dropdown-ellipses"
                          role="button"
                        >
                          <Button className="lift">Manual Signature</Button>
                        </Dropdown.Toggle>
                        {console.log(
                          requiredDocList,
                          "requiredDocList requiredDocList requiredDocList requiredDocList"
                        )}
                        <Dropdown.Menu
                          as="div"
                          className="custom-dropdown-menu"
                        >
                          <Dropdown align="right" alignRight>
                            <Dropdown.Toggle
                              as="span"
                              className="dropdown-ellipses"
                              role="button"
                            >
                              <Button
                                style={{
                                  background: "transparent",
                                  border: "0px",
                                  color: "#fff",
                                }}
                                className="lift-btn"
                              >
                                <p style={{ color: "white!important" }}>
                                  Download Document
                                </p>
                              </Button>
                            </Dropdown.Toggle>
                            {requiredDocList?.choices ? (
                              <Dropdown.Menu
                                as="div"
                                className="custom-dropdown-menu"
                              >
                                {Object.keys(requiredDocList?.choices)?.map(
                                  (item, index) => (
                                    <Dropdown.Item
                                      onClick={(e) => {
                                        handleClickDownloadManual(
                                          item,
                                          requiredDocList?.id
                                        );
                                      }}
                                      key={index}
                                    >
                                      {item}
                                    </Dropdown.Item>
                                  )
                                )}
                              </Dropdown.Menu>
                            ) : (
                              <Dropdown.Menu
                                as="div"
                                className="custom-dropdown-menu"
                              >
                                <Dropdown.Item>
                                  <p style={{ color: "white!important" }}>
                                    No Data Found
                                  </p>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            )}
                          </Dropdown>
                          <Dropdown.Item
                            onClick={(e) => {
                              handleClickUpload();
                            }}
                          >
                            Upload Document
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div
                      className="col-sm-6"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          as="span"
                          className="dropdown-ellipses"
                          role="button"
                        >
                          <Button className="lift">Digital Signature</Button>
                        </Dropdown.Toggle>
                        {requiredDocList?.choices ? (
                          <Dropdown.Menu
                            as="div"
                            className="custom-dropdown-menu"
                          >
                            {Object.keys(requiredDocList?.choices)?.map(
                              (item, index) => (
                                <Dropdown.Item
                                  onClick={(e) => {
                                    handleClickChoice(item);
                                  }}
                                  key={index}
                                >
                                  {
                                    <p style={{ color: "white!important" }}>
                                      {" "}
                                      {item}
                                    </p>
                                  }
                                </Dropdown.Item>
                              )
                            )}
                          </Dropdown.Menu>
                        ) : (
                          <Dropdown.Menu
                            as="div"
                            className="custom-dropdown-menu"
                          >
                            <Dropdown.Item>
                              <p style={{ color: "white!important" }}>
                                No Data Found
                              </p>
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
                      <div
                        className="card"
                        style={{ width: "350px", padding: "10px" }}
                      >
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
                          <img
                            id="imagePreview"
                            src=""
                            alt="Upload image"
                            className="subscriptionUploadDocument"
                            style={{ display: "none" }}
                          ></img>
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
                            <h3>Click here to upload document</h3>
                          </div>
                          <div id="imageUploadText2">
                            <p>Acceptable formats: PNG, JPG, PDF</p>
                          </div>
                          <div id="imageUploadText3">
                            <p>Max file size: 75 MB</p>
                          </div>
                        </div>
                        <input
                          type="file"
                          id="inputImageElement"
                          ref={docImage}
                          style={{ display: "none" }}
                        />
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
          </Row>
        )}
        {params?.identity_id && params?.account_id && (
          <Col
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "1em",
            }}
            xs={12}
            lg={11}
            xl={11}
          >
            <Button onClick={handleNextStep}>
              Next <BsChevronRight />
            </Button>
          </Col>
        )}
      </Container>
    </div>
  );
}
