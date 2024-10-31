import { Col, Container, Row, Nav, Spinner, Form, Button, Modal, OverlayTrigger } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import Tooltip from "../../../components/tooltip/Tooltip";
import {
  getWalletAddressListAPI,
  addWalletAddressAPI,
  getCryptoCurrencyChainListAPI,
  validateByPennyDropAPI,
  submitBankIdentityAPI,
  getBankIdentitiesAPI,
  deleteBankWalletAPI,
  validateByPennyDropVerifyAPI,
  getParticularFieldsFromFundIdApi,
} from "../../../api/network/CustomerApi";
// import SpinnerWithBackDrop from "../../../components/ui/loader";
import LoadingSpinner from "../../../components/ui/loader";
import CustomAlert from "../../../widgets/components/Alerts";
import formatDateRegionWise  from "../../../helpers/formatDateRegionWise";
import MyTable from "./remarks";
import { useTheme } from "../../../contexts/themeContext";

export default function wallets(props) {

  console.log("Hussain Props:", props);
  
const {theme} = useTheme();
  const navigate = useNavigate()
  const params = useParams()
  let type = props?.dataOfAccountSetup?.isIndividual
    ? "individual"
    : "corporate"
  let identity_id = props?.dataOfAccountSetup?.identity_id
  let account_id = props?.dataOfAccountSetup?.account_id
  const cancelTokenSource = axios.CancelToken.source()
  const [isLoader, setIsLoader] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [isLoaderBank, setIsLoaderBank] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [cryptoCurrency, setCryptoCurrency] = useState("")
  const [walletAddressData, setWalletAddressData] = useState([])
  const [walletAddressError, setWalletAddressError] = useState(false)
  const [cryptoCurrencyError, setCryptoCurrencyError] = useState(false)
  const [swiftCodeError, setSwiftCodeError] = useState(false)
  const [labelError, setLabelError] = useState(false)
  const [accountNumberError, setAccountNumberError] = useState(false)
  const [accountNumber, setAccountNumber] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [label, setLabel] = useState("")
  const [bankDataValue, setBankDataValue] = useState(
    props?.dataOfAccountSetup?.BanKData
  )
  const [chainList, setChainList] = useState([])
  const [banKDataList, setBanKDataList] = useState([])
  const [deletedIdentity, setDeletedIdentity] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const [pennyDropDetail, setPennyDropDetail] = useState(null)
  const [isShowPenyDropDetail, setIsShowPenyDropDetail] = useState(false)
  const [isShowBankDetailModal, setIsShowBankDetailModal] = useState(false)
  const [particularFields, setParticularFields] = useState([])
  const [identityDataFields, setIdentityDataFields] = useState(null)
  const [particularAddedData, setParticularAddedData] = useState([])
  const [submitButtonDisable, setSubmitButtonDisable] = useState(true)
  const [selectedBankDetail, setSelectedBankDetail] = useState(true)
  const [cryptoValue, setCryptoValue] = useState(null);
  const [remarks, setRemarks] = useState([])
  const [addBank, setAddBank] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  })
  var allRequiredField = []
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto })
  }

  useEffect(() => {
    getWalletAddressList(identity_id)
    getCryptoCurrencyChainList()
    getBankIdentities(identity_id)
    getParticularFields()
  }, [])
  useEffect(() => {
    console.log("particularAddedDataparticularAddedData", particularAddedData)
  }, [particularAddedData])

  useEffect(() => {
    console.log("identityDataFieldsidentityDataFields", identityDataFields)
    console.log(
      "identityDataFieldsidentityDataFields particularFields",
      particularFields
    )
  }, [identityDataFields, particularFields])

  useEffect(() => {
    autoPopulateLabel()
  }, [identityDataFields, particularFields])

  // Hussain Work
  useEffect(() => {
    const selectedIdentityData = props?.dataOfAccountSetup?.selectedIdentityData?.meta?.data || {};

    // Find the object with key ending in ".crypto_currency"
    const cryptoEntry = Object.entries(selectedIdentityData).find(([key]) =>
      key.endsWith('.crypto_currency')
    );

    if (cryptoEntry) {
      setCryptoValue(cryptoEntry[1]?.value); // Store the value in state
    }
  }, [props]);

  console.log("The Seleted Crypto Option is:", cryptoValue);
  

  const autoPopulateLabel = () => {
    let newLabel = ""

    if (identityDataFields) {
      const bankName = identityDataFields["bank.basic.bank_name"] || ""
      const accountHolderName =
        identityDataFields["bank.basic.account_holder_name"] || ""
      newLabel = `${bankName} ${accountHolderName}`.trim()
    }

    setLabel(newLabel)
  }
  const handleViewHistory = () => {
    setShowHistoryModal(true)
  }

  const getParticularFields = async () => {
    setIsLoader(true)

    const response = await getParticularFieldsFromFundIdApi(
      props?.dataOfAccountSetup?.fund_id,
      cancelTokenSource.token
    )
    setIsLoader(false)
    let array = []
    if (response.success == true) {
      array = [
        ...response.data?.account_fields?.s_b_f,
        ...response.data?.account_fields?.e_b_f,
      ]
      const filteredObj = array
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]].index
          const indexB = b[Object.keys(b)[0]].index
          return indexA - indexB
        })
        .sort((a, b) => {
          if (Object.keys(a)[0] === "bank.extended.bank_branch_address")
            return 1
          if (Object.keys(b)[0] === "bank.extended.bank_branch_address")
            return -1
          return 0
        })

      console.log(filteredObj, "filteredObj filteredObj filteredObj")
      setParticularFields(filteredObj)
    } else {
      setIsLoader(false)
    }
  }

  const getWalletAddressList = async (identityId) => {
    setIsLoader(true)
    const response = await getWalletAddressListAPI(
      identityId,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      setWalletAddressData(response?.data)
      props.setWalletData(response?.data?.length > 0 ? true : false)
    } else {
    }
  }
  const getCryptoCurrencyChainList = async () => {
    setIsLoader(true)
    let account_idss = null
    if (account_id) {
      account_idss = account_id
    }
    const response = await getCryptoCurrencyChainListAPI(
      account_idss,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      setChainList(response?.data?.response?.data)
    } else {
    }
  }
  const getBankIdentities = async (identityId) => {
    setIsLoader(true)
    const response = await getBankIdentitiesAPI(
      identityId,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      console.log(
        response?.data?.length > 0 ? true : false,
        "response?.data getBankIdentities getBankIdentities"
      )
      props.setIsBankData(response?.data?.length > 0 ? true : false)
      setBanKDataList(response?.data)
      setRemarks(response?.data[0]?.meta?.remarks)
      console.log(response?.data[0]?.meta?.remarks, "rrr")
    } else {
    }
  }
  const handleSubmitBank = (e) => {
    const checkPenyDropIntegration =
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.bank?.integration?.enabled
    if (checkPenyDropIntegration || checkPenyDropIntegration === "true") {
      let dataToSend = {
        code: accountNumber,
        state: "SIGN_DESK_PENNY_DROP",
        swift_code: swiftCode,
      }
      validateByPennyDrop(dataToSend)
    } else {
      setIsLoaderBank(true)
      handleAddBankIdentity()
    }
    setAddBank(!addBank)
  }

  const validateByPennyDrop = async (dataToSend) => {
    setIsLoaderBank(true)
    const response = await validateByPennyDropAPI(
      dataToSend,
      cancelTokenSource.token
    )
    if (response.success == true) {
      if (response?.data?.payment) {
        handleAlert({
          variant: "success",
          message: "Bank Identity Added Successfully",
          show: true,
          hideAuto: true,
        })
        getBankIdentities(identity_id)
        handleAddBankIdentity(response?.data)
      } else {
        setIsLoaderBank(false)
        handleAlert({
          variant: "danger",
          message: response.user_message
            ? response.user_message
            : response.system_message,
          show: true,
          hideAuto: true,
        })
      }
    } else {
      setIsLoaderBank(false)
      handleAlert({
        variant: "danger",
        message: "Invalid bank detail",
        show: true,
        hideAuto: true,
      })
    }
  }
  const handleAddBankIdentity = async (data = null) => {
    let dataToSend = {
      label: label,
      data: identityDataFields,
      providerInfo: {
        provider: "SIGN_DESK_PENNY_DROP",
        data: data,
      },
    }
    if (data === null) {
      delete dataToSend["providerInfo"]
    }
    const response = await submitBankIdentityAPI(
      identity_id,
      dataToSend,
      cancelTokenSource.token
    )
    setIsLoaderBank(false)
    if (response.success == true) {
      setBankDataValue(response?.data)
      handleAlert({
        variant: "success",
        message: "Bank Identity Created Successfully",
        show: true,
        hideAuto: true,
      })

      setLabel("")
      setSwiftCode("")
      setAccountNumber("")
      getBankIdentities(identity_id)
      props.setIsBankData(true)
      props.setBanKDataValue(response?.data)
    } else {
      handleAlert({
        variant: "danger",
        message: response.user_message
          ? response.user_message
          : response.system_message,
        show: true,
        hideAuto: true,
      })
    }
  }
  const handleSubmit = (e) => {
    if (walletAddress == "" || cryptoCurrency == "") {
      if (walletAddress == "") {
        setWalletAddressError(true)
      } else {
        setWalletAddressError(false)
      }
      if (cryptoCurrency == "") {
        setCryptoCurrencyError(true)
      } else {
        setCryptoCurrencyError(false)
      }
      return
    } else {
      setWalletAddressError(false)
      setCryptoCurrencyError(false)

      let dataToSend = {
        chain: cryptoCurrency,
        address: walletAddress,
      }
      submitWalletAddress(dataToSend)
    }
  }
  const submitWalletAddress = async (dataToSend) => {
    setIsLoader(true)
    const response = await addWalletAddressAPI(
      dataToSend,
      identity_id,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      setWalletAddressData([])
      getWalletAddressList(identity_id)
      setIsLoader(false)
      handleAlert({
        variant: "success",
        message: "Wallet Address Added Successfully",
        show: true,
        hideAuto: true,
      })
      setCryptoCurrency("")
      setWalletAddress("")
    } else {
      handleAlert({
        variant: "danger",
        message: response.user_message
          ? response.user_message
          : response.system_message,
        show: true,
        hideAuto: true,
      })
    }
  }

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false })
  }
  const handleDeleteBankIdentity = (id) => {
    setDeletedIdentity(id)
    setShowModal(true)
  }
  const handleModalClose = () => {
    setDeletedIdentity(null)
    setShowModal(false)
  }
  const handleCloseHisroeyModal = () => {
    setShowHistoryModal(false)
  }
  const handleProceed = async () => {
    setShowModal(false)
    setIsLoader(true)
    const response = await deleteBankWalletAPI(
      deletedIdentity,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      getWalletAddressList(identity_id)
      getBankIdentities(identity_id)
      handleAlert({
        variant: "success",
        message: "Identity Deleted Successfully",
        show: true,
        hideAuto: true,
      })
    } else {
      handleAlert({
        variant: "danger",
        message: response.user_message
          ? response.user_message
          : response.system_message,
        show: true,
        hideAuto: true,
      })
    }
  }
  const handleViewPennyDropDetail = (data) => {
    setPennyDropDetail(data?.meta?.providerInfo?.data?.status)
    setIsShowPenyDropDetail(true)
  }
  const handleViewBankDetail = (data) => {
    setSelectedBankDetail(data)
    setIsShowBankDetailModal(true)
  }
  const handleModalClosePennyDropDetail = () => {
    setIsShowPenyDropDetail(false)
  }
  const handleModalCloseBankDetailModal = () => {
    setIsShowBankDetailModal(false)
  }
  const handledownloadPennyDropReciept = (e) => {
    const element = document.querySelector(".penny-drop-reciept") // Get the div by its class name
    const opt = {
      margin: 0.5,
      filename: "penny_drop_reciept.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }
    html2pdf().from(element).set(opt).save()
  }

  const checkIfTimeExceededTenMins = (dateTimeString) => {
    const targetDate = new Date(dateTimeString)

    const currentTime = new Date()

    const timeDifference = currentTime.getTime() - targetDate.getTime()

    const timeDifferenceInMinutes = Math.abs(timeDifference / (1000 * 60))
    return timeDifferenceInMinutes > 10
  }

  const handleVerifyBankIdentity = (identityId, referenceId, transactionId) => {
    let dataToSend = {
      state: "SIGN_DESK_PENNY_DROP_STATUS",
      code: transactionId,
      reference_id: referenceId,
    }
    handleVerifyBankIdentityCall(identityId, dataToSend)
  }

  const handleVerifyBankIdentityCall = async (identityId, data) => {
    setIsLoaderBank(true)
    const response = await validateByPennyDropVerifyAPI(
      identityId,
      data,
      cancelTokenSource.token
    )
    setIsLoaderBank(false)
    if (response.success == true) {
      setBankDataValue(response?.data)
      handleAlert({
        variant: "success",
        message: "Bank Identity Verified Successfully",
        show: true,
        hideAuto: true,
      })
      getBankIdentities(identity_id)
    }
  }
  const getUpdatedData = (key) => {
    return particularAddedData[key]?.value == null
      ? ""
      : particularAddedData[key]?.value
  }
  const handleChange = (e) => {
    setShowLabel(true)
    console.log(e.target.name, "e.target.name")
    console.log(
      identityDataFields,
      "identityDataFields identityDataFields handleChange"
    )
    if (e.target.name === "Phone") {
      // If the input is the phone number field, update the phone number
      setIdentityDataFields({
        ...identityDataFields,
        phone: e,
      })
    } else {
      setIdentityDataFields({
        ...identityDataFields,
        [e.target.name]: e.target.value,
      })
    }
    if (e.target.name == "bank.basic.account_number") {
      setAccountNumber(e.target.value)
    }
    if (e.target.name == "bank.basic.swift_bic__ifsc_code") {
      setSwiftCode(e.target.value)
    }
  }
  const handleChangeDate = (name, value) => {
    if (value && value?.length > 0) {
      setIdentityDataFields({
        ...identityDataFields,
        [name]: format(new Date(value[0]), "yyyy-MM-dd"),
      })
    } else {
      setIdentityDataFields({ ...identityDataFields, [name]: "" })
    }
    setShowLabel(true)
  }
  const handleChangeCheckBox = (e) => {
    setIdentityDataFields({
      ...identityDataFields,
      [e.target.name]: e.target.checked,
    })
    setShowLabel(true)
  }
  const handleChangeLabel = (e) => {
    setLabel(e.target.value)
  }
  useEffect(() => {
    if (handleValidate()) {
      setSubmitButtonDisable(false)
    } else {
      setSubmitButtonDisable(true)
    }
  }, [identityDataFields, label])
  const handleValidate = () => {
    let status = true
    if (allRequiredField?.length > 0) {
      console.log(identityDataFields, "dentityDataFields handleValidate")
      for (let item of allRequiredField) {
        if (identityDataFields && identityDataFields[item]) {
          if (
            (!identityDataFields[item] &&
              identityDataFields[item].value === null) ||
            identityDataFields[item].value == ""
          ) {
            status = false
          }
        } else {
          status = false
        }
      }
    }
    if (label != "" && label != null) {
    } else {
      status = false
    }
    return status
  }
  const handleModalCloseAddBank = () => {
    setAddBank(!addBank)
    setLabel("")
    setIdentityDataFields(null)
  }

  useEffect(() => {
    if (addBank) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [addBank]);


  return (
    <div className="main-content">
      {console.log(
        props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
          ?.identity?.wallet?.enabled,
        'dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity?.bank?.enabled',
      )}
      {alertProps.show && (
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
      )}
      <div >
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${showModal ? '' : 'hidden'}`}>

  <div className="fixed inset-0 bg-[#12213c] opacity-50" onClick={handleModalClose}></div>

  <div className={`relative bg-color-modal-${theme} rounded-lg shadow-lg mx-4 w-[40%]
        animate-slideDown`}>

<div className="flex justify-between items-center p-4 border-b border-b-[#1d385a]">
      <h2 className={`text-[15px] font-light text-color-modal-${theme} mb-2 px-4`}>Confirmation Message</h2>
      <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
        &times;
      </button>
    </div>

    <div className={`px-8 my-6 text-color-modal-${theme} font-light text-[15px]`}>
      Are you sure you want to delete this Identity?
    </div>


    <div className="flex justify-end gap-2 py-6 px-6 border-t border-t-[#1d385a]">
      <button onClick={handleModalClose}  className={`px-[30px] py-[10px] text-[15px] font-light text-white bg-color-modal-button-${theme} rounded-md hover:bg-[#5e718b] transition-all duration-300 ease-in-out focus:outline-none`}
       >
        Close
      </button>
      <button onClick={handleProceed} className={`px-[30px] py-[10px] text-[15px] font-light text-white bg-color-modal-button-${theme} rounded-md hover:bg-[#5e718b] transition-all duration-300 ease-in-out focus:outline-none`}
         >
        Proceed
      </button>
    </div>
  </div>
</div>


        <div className="justify-center">

        {(props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
            ?.applicant?.identity?.wallet?.enabled === true ||
            props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
              ?.applicant?.identity?.wallet?.enabled == 'true') && (
              <div className="px-8 py-6">
                {isLoader ? (
                  <LoadingSpinner animation="grow" custom={true} height="70vh" />
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className={`bg-gradient-stepper-card-${theme} shadow-${theme} border border-color-${theme} rounded-lg  px-4`}>
                      <div className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme}  py-[18px] px-[16px] mb-4 flex justify-between h-full w-full`}>
                        <h4 className={`font-light text-color-text-${theme}`}>Add Wallets</h4>
                      </div>
                      <div className={`px-6`}>
                        <form className="w-full flex flex-col justify-center items-center">
                          <div className="flex gap-4 w-full py-4">
                            <div className="w-1/2">
                              <div className="flex flex-col w-full">
                                <label className="text-[15px] font-light mb-2">
                                  CryptoCurrency
                                </label>
                                <select
                                  type="text"
                                  className={`bg-color-textfield-dropdown-${theme} py-2 px-4 appearance-none rounded-lg shadow-${theme} outline-none focus:ring-[1px] focus:ring-[#2b78da] `}
                                  defaultValue={cryptoCurrency}
                                  onChange={(e) => {
                                    setCryptoCurrency(e.target.value);
                                  }}
                                >
                                  <option value="" className={`text-[12px] font-thin`}>Select CryptoCurrency</option>
                                  {chainList?.length > 0 &&
                                    chainList.map((item, index) => (
                                      <option key={index} value={item.chain}>
                                        {item.chain == 'ETH'
                                          ? 'ETH / ERC- 20'
                                          : item.chain}
                                      </option>
                                    ))}
                                </select>
                                {cryptoCurrencyError ? (
                                  <span className="text-red-500">
                                    Select CryptoCurrency to Continue
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="w-1/2">
                              <div className="flex flex-col w-full">
                              <label className="text-[15px] font-light mb-2">
                                  Wallet Address
                                </label>
                                <input
                                  type="text"
                                  className={`bg-color-textfield-dropdown-${theme} py-2 px-4 appearance-none rounded-lg shadow-${theme} outline-none focus:ring-[1px] focus:ring-[#2b78da] placeholder:text-sm placeholder:font-light`}
                                  placeholder="Wallet Address"
                                  defaultValue={walletAddress}
                                  onChange={(e) => {
                                    setWalletAddress(e.target.value);
                                  }}
                                />
                                {walletAddressError ? (
                                  <span className="error-fields">
                                    Enter Wallet Address to Continue
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="mt-10 mb-8">
                            <div className="flex justify-center">
                              <button
                                 className={`bg-color-stepper-button-${theme} hover:bg-color-stepper-button-hover-${theme} transition-all duration-300 ease-in-out text-white font-medium text-[15px] rounded-full py-3 sm:px-7 px-2  `}
                                onClick={(e) => {
                                  handleSubmit(e);
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className={`bg-color-card-${theme} rounded-md border-color-${theme} border-[1px] shadow-${theme}  px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full`}
     >
                      <div className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme}  py-[18px] px-[16px] mb-4 flex justify-between h-full w-full`}
   >
                        <h4 className={`font-light text-color-text-${theme}`}>Wallets List</h4>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <table className="w-[97%] ml-4 mr-4 mb-4">
                          <thead className={`bg-color-table-color-${theme}`}>
                          <tr
            className={` text-[#6e84a3] sm:text-[10px] text-[6px] text-left font-light uppercase border-color-${theme} border-b-[1px] `}
          >
                              <th className="py-4 px-4 sm:px-6 ">Chain</th>
                              <th className="py-4 px-4 sm:px-6 ">Address</th>
                              <th className="py-4 px-4 sm:px-6 ">Action</th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {walletAddressData &&
                              walletAddressData.map((item, index) => (
                                <tr key={index} className={`text-color-h1-${theme} sm:text-sm text-[6px] text-left font-light border-color-${theme} border-t-[1px]`}
                                >
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.meta?.data?.chain}
                                  </td>
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.meta?.data?.address}
                                  </td>
                                  <td className="py-4 px-2 sm:px-6">
                                    {' '}
                                    <FeatherIcon
                                      icon="trash"
                                      color="red"
                                      size="15"
                                      onClick={(e) =>
                                        handleDeleteBankIdentity(item?.id)
                                      }
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                <br />
                <br />
              </div>
            
          )}


        {(props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
            ?.applicant?.identity?.bank?.enabled === true ||
            props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
              ?.applicant?.identity?.bank?.enabled == 'true') && (
              <div className="px-[25px]">
                {isLoaderBank ? (
                  <LoadingSpinner animation="grow" custom={true} height="70vh" />
                ) : (
                  <div className={`bg-color-card-${theme} rounded-md border-color-${theme} border-[1px] shadow-${theme} mb-16 px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full`}
     >
                    <div className="w-full">
                    <div className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme}  py-[8px] px-[16px] mb-4 flex items-center justify-between h-full w-full`}
   >
                        <h4 className={`font-light text-color-text-${theme}`}>Beneficiary Bank List</h4>
                        <button
                          className={`bg-color-button3-${theme} hover:bg-color-button3-hover-${theme} transition-all duration-200 ease-in-out text-white  rounded-lg py-4 sm:px-7 px-2 text-xs sm:text-[15px] font-light`}
                          onClick={(e) => {
                            setAddBank(!addBank);
                          }}
                        >
                          Add New Bank
                        </button>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <table className="w-[97%] ml-4 mr-4 mb-4">
                        <thead className={`bg-color-table-color-${theme}`}>
                          <tr
            className={` text-[#6e84a3] sm:text-[10px] text-[6px] text-left font-light uppercase border-color-${theme} border-b-[1px] `}
          >
                              <th className="py-4 px-4 sm:px-6 ">Label</th>
                              <th className="py-4 px-4 sm:px-6 ">Bank Name</th>
                              {/* <th>Account Type</th> */}
                              <th className="py-4 px-4 sm:px-6 ">Account Number</th>
                              <th className="py-4 px-4 sm:px-6 ">Swift/IFSC</th>
                              <th className="py-4 px-4 sm:px-6 ">Currency</th>
                              <th className="py-4 px-4 sm:px-6 ">Status</th>
                              <th className="py-4 px-4 sm:px-6 ">Action</th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {banKDataList &&
                              banKDataList.map((item, index) => (
                                <tr key={index} className={`text-color-h1-${theme} sm:text-sm text-[6px] text-left font-light border-color-${theme} border-t-[1px]`}
                                >
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.label}
                                  </td>
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.meta?.data['bank.basic.bank_name']}
                                  </td>
                                 
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {
                                      item?.meta?.data[
                                      'bank.basic.account_number'
                                      ]
                                    }
                                  </td>
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.meta?.data["bank.basic.swift_bic__ifsc_code"] || item?.meta?.data["bank.basic.swift_bic_ifsc_code"]}
                                  </td>
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.meta?.data['bank.basic.currency']}
                                  </td>
                                  {item?.meta?.providerInfo ? (
                                    <td
                                      className="py-4 px-2 sm:px-6 uppercase"
                                      style={{
                                        color: item?.meta?.providerInfo?.data
                                          ?.status
                                          ? 'green'
                                          : 'orange',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {item?.meta?.providerInfo?.data?.status
                                        ? 'Verified'
                                        : 'Transaction Status Pending'}
                                    </td>
                                  ) : (
                                    <td
                                      className="py-4 px-2 sm:px-6 uppercase"
                                      style={{
                                        color:
                                          item?.status == 'draft'
                                            ? 'orange'
                                            : 'green',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {item?.status}
                                    </td>
                                  )}
                                  <td className="py-4 px-2 sm:px-6 uppercase">
                                    {item?.meta?.providerInfo?.provider === 'SIGN_DESK_PENNY_DROP' &&
                                      item?.meta?.providerInfo?.data?.status && (
                                       <Tooltip content="Penny Drop Details" >
                                          <span>
                                            <FeatherIcon
                                              icon="list"
                                              color="white"
                                              size="15"
                                              style={{ marginRight: '5px' }}
                                              onClick={(e) => handleViewPennyDropDetail(item)}
                                            />
                                          </span>
                                          </Tooltip>
                                        
                                      )}
                                    {item?.meta?.providerInfo?.data?.status === null &&
                                      checkIfTimeExceededTenMins(
                                        item?.meta?.providerInfo?.data?.payment?.response_time_stamp
                                      ) && (
                                       <Tooltip content="Verify Bank Identity">
                                          <span>
                                            <button
                                             
                                              style={{ marginRight: '5px' }}
                                              onClick={(e) =>
                                                handleVerifyBankIdentity(
                                                  item?.id,
                                                  item?.meta?.providerInfo?.data?.payment?.reference_id,
                                                  item?.meta?.providerInfo?.data?.payment?.transaction_id
                                                )
                                              }
                                            >
                                              Verify
                                            </button>
                                          </span>
                                          </Tooltip>
                                        
                                      )}

                                  <Tooltip>
                                    Delete Bank Identity
                                    
                                      <span>
                                        <FeatherIcon
                                          icon="trash"
                                          color="red"
                                          size="15"
                                          onClick={(e) => handleDeleteBankIdentity(item?.id)}
                                        />
                                      </span>
                                      </Tooltip>

                                    <Tooltip content="View Bank Details">
                                    
                                      <span>
                                        <FeatherIcon
                                          icon="info"
                                          size="15"
                                          style={{ marginLeft: '5px', marginRight: '5px' }}
                                          onClick={(e) => handleViewBankDetail(item)}
                                        />
                                      </span>
                                      </Tooltip>

                                  <Tooltip content="View History">
                                      <span>
                                        <FeatherIcon
                                          icon="archive"
                                          size="15"
                                          style={{ marginLeft: '5px', marginRight: '5px' }}
                                          onClick={() => handleViewHistory(item)}
                                        />
                                      </span>
                                      </Tooltip>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            
          )}


        </div>
      </div>
      <Modal
        show={isShowPenyDropDetail}
        onHide={handleModalClosePennyDropDetail}
      >
        <Modal.Header closeButton>
          <Modal.Title>Penny Drop Reciept</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10px',
            }}
          >
            <button
              onClick={(e) => {
                handledownloadPennyDropReciept(e);
              }}
            >
              <FeatherIcon
                icon="download"
                color="white"
                size="15"
                style={{ marginRight: '5px' }}
              />
              Download
            </button>
          </div>
          <table className="table table-sm table-nowrap card-table penny-drop-reciept">
            <thead>
              <tr>
                <th>Amount</th>
                <th>{parseInt(pennyDropDetail?.result?.Amount).toFixed(2)}</th>
              </tr>
              <tr>
                <th>Bank RRN</th>
                <th>{pennyDropDetail?.result?.BankRRN}</th>
              </tr>
              <tr>
                <th>Beneficiary Account No</th>
                <th>{pennyDropDetail?.result?.BeneAccNo}</th>
              </tr>
              <tr>
                <th>Beneficiary IFSC</th>
                <th>{pennyDropDetail?.result?.BeneIFSC}</th>
              </tr>
              <tr>
                <th>Beneficiary MMID</th>
                <th>{pennyDropDetail?.result?.BeneMMID}</th>
              </tr>
              <tr>
                <th>Beneficiary Mobile</th>
                <th>{pennyDropDetail?.result?.BeneMobile}</th>
              </tr>
              <tr>
                <th>Beneficiary Name</th>
                <th>{pennyDropDetail?.result?.BeneName}</th>
              </tr>
              <tr>
                <th>Payment Reference</th>
                <th>{pennyDropDetail?.result?.PaymentRef}</th>
              </tr>
              <tr>
                <th>Remitter Mobile</th>
                <th>{pennyDropDetail?.result?.RemMobile}</th>
              </tr>
              <tr>
                <th>Remitter Name</th>
                <th>{pennyDropDetail?.result?.RemName}</th>
              </tr>
              <tr>
                <th>Transaction Date & Time</th>
                <th>
                  {formatDateRegionWise(
                    pennyDropDetail?.result?.TranDateTime,
                    true,
                  )}
                </th>
              </tr>
            </thead>
          </table>
        </Modal.Body>
      </Modal>
      <Modal
        show={isShowBankDetailModal}
        onHide={handleModalCloseBankDetailModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Bank Identity Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-sm table-nowrap card-table penny-drop-reciept">
            <thead>
              <tr>
                <th>Label</th>
                <th>{selectedBankDetail?.label}</th>
              </tr>
              <tr>
                <th>Beneficiary Name</th>
                <th>
                  {
                    selectedBankDetail?.meta?.data[
                    'bank.basic.beneficiary_name'
                    ]
                  }
                </th>
              </tr>
              <tr>
                <th>Beneficiary Bank Account Currency</th>
                <th>{selectedBankDetail?.meta?.data['bank.basic.currency']}</th>
              </tr>
              <tr>
                <th>Beneficiary Bank Name</th>
                <th>
                  {selectedBankDetail?.meta?.data['bank.basic.bank_name']}
                </th>
              </tr>
              {/* <tr>
                <th>Account Type</th>
                <th>
                  {selectedBankDetail?.meta?.data['bank.basic.account_type']}
                </th>
              </tr> */}
              <tr>
                <th>Beneficiary Bank Account Number</th>
                <th>
                  {selectedBankDetail?.meta?.data['bank.basic.account_number']}
                </th>
              </tr>
              <tr>
                <th>Beneficiary Bank Account Name</th>
                <th>
                  {
                    selectedBankDetail?.meta?.data[
                    'bank.basic.account_holder_name'
                    ]
                  }
                </th>
              </tr>
              <tr>
                <th>Beneficiary Bank SWIFT/BIC/IFSC Code</th>
                <th>
                  {
                    selectedBankDetail?.meta?.data[
                    'bank.basic.swift_bic__ifsc_code'
                    ] ||  selectedBankDetail?.meta?.data[
                      'bank.basic.swift_bic_ifsc_code'
                      ]
                  }
                </th>
              </tr>
              <tr>
                <th>IBAN (International Bank Account Number)</th>
                <th>{selectedBankDetail?.meta?.data['bank.extended.iban']}</th>
              </tr>
              <tr>
                <th>Sort Code (For UK Banks)</th>
                <th>
                  {console.log(selectedBankDetail, 'selectedBankDetail')}
                  {selectedBankDetail?.meta?.data['bank.extended.sort_code']}
                </th>
              </tr>
              <tr>
                <th>Routing Number</th>
                <th>
                  {
                    selectedBankDetail?.meta?.data[
                    'bank.extended.routing_number'
                    ]
                  }
                </th>
              </tr>
              <tr>
                <th>Bank/Branch Address</th>
                <th>
                  {
                    selectedBankDetail?.meta?.data[
                    'bank.extended.bank_branch_address'
                    ]
                  }
                </th>
              </tr>
              <tr>
                <th>Reference Description</th>
                <th>
                  {
                    selectedBankDetail?.meta?.data[
                    'bank.extended.reference_description'
                    ]
                  }
                </th>
              </tr>
              
            </thead>
          </table>
        </Modal.Body>
      </Modal>
      {/* <Modal size="lg" show={addBank} onHide={handleModalCloseAddBank}> */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto max-h-screen ${addBank ? 'block' : 'hidden'}`}>
      <div
        className={`bg-[#152e4d]  border border-color-${theme} rounded-md sm:w-8/12 w-full mb-5 lg:mt-20 sm:mt-0 xs:mt-40 2xs:mt-10 py-4  shadow-sm text-white overflow-y-auto max-h-screen`}
      >
      <div className="flex items-center justify-between mb-6 py-4 border-b border-[#1d385a]">
    <h2 className="text-[15px] font-light px-4">Add Beneficiary Bank Details</h2>
    <button
        onClick={handleModalCloseAddBank}
        className="text-gray-500 hover:text-gray-700 px-4 focus:outline-none"
    >
        &times;
    </button>
</div>
        
          <div className="w-full px-8">
            <form className="w-full" >
              <div className="w-full">
             
                {showLabel && (
                  <div className="w-full">
                    <div className="w-full">
                      <div className="flex justify-start items-baseline">
                        <span>
                          <label className="font-light text-[15px]">
                            {' '}
                            Identity Label{' '}
                            <span className="text-red-500">*</span>
                          </label>
                        </span>
                      </div>

                      <input
                        type="text"
                        className={
                          label ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md mb-4 outline-none focus:ring-[1px] focus:ring-[#2b78da]` : `w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md mb-4 outline-none focus:ring-[1px] focus:ring-[#2b78da]`
                        }
                        name={'Identity Label'}
                        value={label}
                        placeholder="Label Of Identify"
                        onChange={(e) => {
                          handleChangeLabel(e);
                        }}
                      />
                      {labelError && (
                        <span className="error-fields">
                          Enter Label To Continue
                        </span>
                      )}
                    </div>
                  </div>
                )}
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {particularFields &&
                  particularFields.map((item, index) => {
                    let key = Object.keys(item);
                    let checkFieldsShow =
                      item[key[0]].hasOwnProperty('enabled');
                    if (checkFieldsShow && item[key[0]]?.enabled) {
                      if (
                        item[key[0]]?.for == 'all' ||
                        item[key[0]]?.for == 'root'
                      ) {
                        if (key) {
                          let keyValues = key[0].split('.');
                          let customerType = keyValues[0];
                          let formType = keyValues[1];
                          let fieldName = keyValues[2];
                          let label = fieldName?.replace(/\b\w/g, (char) => char.toUpperCase());
                          let formKeyVal = key[0];
                          const arr = label.split(' ');

                          for (var i = 0; i < arr?.length; i++) {
                            arr[i] =
                              arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                          }
                          const str2 = arr.join(' ');

                          label = str2;
                          let labelFromApi = item[key[0]]?.label;
                          if (labelFromApi) {
                            label = item[key[0]]?.label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                          } else {
                            label = label;

                          }
                          let fieldType = item[key[0]]?.type;
                          let sourceType = item[key[0]]?.source?.type;
                          let returnKey = item[key[0]]?.source?.returnKey;
                          let fieldData = item[key[0]]?.source?.data;
                          let requiredField = item[key[0]]?.required;
                          let valueField = item[key[0]]?.DefaultValue;
                          let editableField = '';
                          //individual.basic.date_signed => key
                          //item => key:value
                          if (item[key[0]].hasOwnProperty('DefaultValue')) {
                            editableField = false;
                          } else {
                            editableField = true;
                          }

                          // if (item[key[0]]?.isSingpass) {
                          //   editableField = false;
                          // } else {
                          //   editableField = true;
                          // }

                          if (
                            customerType ===
                              props?.dataOfAccountSetup?.isIndividual
                              ? 'individual'
                              : 'corporate' && formType !== 'crp'
                          ) {
                            if (requiredField) {
                              allRequiredField.push(key[0]);
                            }
                            if (fieldType === 'text') {
                              console.log('the label is :', label);
                              if (fieldName === 'phone') {
                                return (
                                  <div className="w-1/2 md:w-1/2" key={index}>

                                    <div className="font-light text-[15px]">
                                      <label className="">
                                        {label}
                                        {requiredField && (
                                          <span className="text-red-500">*</span>
                                        )}
                                      </label>
                                      <div
                                        className={
                                          requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == '' ||
                                              getUpdatedData(formKeyVal) == null)
                                            ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da]`
                                            : `w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da]` 
                                        }
                                      >
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <PhoneInput
                                            value={getUpdatedData(formKeyVal)}
                                            country={'sg'}
                                            name={fieldName}
                                            onChange={(e) => {
                                              handlePhoneNumber(e, formKeyVal);
                                            }}
                                            inputProps={{
                                              name: 'phone',
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (label === 'Bank/Branch Address') {
                                return (
                                  <div className="w-1/2 md:w-full" key={index}>

                                    <div className={``}>
                                      <label className="font-light text-[15px]">
                                        {label}
                                        {requiredField && (
                                          <span className="text-red-500">*</span>
                                        )}
                                      </label>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <textarea
                                          // type={fieldType}
                                          className={
                                            requiredField &&
                                              !identityDataFields?.[formKeyVal] &&
                                              (getUpdatedData(formKeyVal) == '' ||
                                                getUpdatedData(formKeyVal) ==
                                                null)
                                              ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mt-2 placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da]`
                                              : `w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mt-2 placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da]`
                                          }
                                          defaultValue={
                                            editableField == false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          name={formKeyVal}
                                          placeholder={label}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="w-full" key={index}>
                                    <div className="w-full">
                                      <label className="">
                                        {label}
                                        {requiredField && (
                                          <span className="text-danger">*</span>
                                        )}
                                      </label>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <input
                                          type={fieldType}
                                          className={
                                            requiredField &&
                                              !identityDataFields?.[formKeyVal] &&
                                              (getUpdatedData(formKeyVal) == '' ||
                                                getUpdatedData(formKeyVal) ==
                                                null)
                                              ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white mt-2 rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da]`
                                              : `w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white mt-2 rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da]`
                                          }
                                          defaultValue={
                                            editableField == false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          name={formKeyVal}
                                          placeholder={label}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            }
                            if (fieldType == 'date') {
                              return (
                                <div className="w-full">
                                  <div className="w-full">
                                    <label className="font-light text-[15px]">
                                      {label}
                                      {requiredField && (
                                        <span className="text-red-500">*</span>
                                      )}
                                    </label>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                      className="flatpickr-wrapper-width"
                                    >
                                      <Flatpickr
                                        placeholder={label}
                                        className={
                                          requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == '' ||
                                              getUpdatedData(formKeyVal) == null)
                                            ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da] mt-2`
                                            :  `w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da] mt-2`
                                        }
                                        name={formKeyVal}
                                        options={{
                                          dateFormat: formatDateRegionWise(
                                            null,
                                            null,
                                            true,
                                          ),
                                          allowInput: true, // Enable manual input
                                          static: true,
                                          onClose: function (
                                            selectedDates,
                                            dateStr,
                                            instance,
                                          ) {
                                            handleChangeDate(
                                              formKeyVal,
                                              selectedDates,
                                            );
                                          },
                                          onReady: function (
                                            selectedDates,
                                            dateStr,
                                            instance,
                                          ) {
                                            // Add event listener to input field to handle manual date entry
                                            const input = instance.input;
                                            input.addEventListener(
                                              'input',
                                              function (event) {
                                                const value = input.value;
                                                if (
                                                  event.inputType ===
                                                  'deleteContentBackward'
                                                ) {
                                                  // Remove the slash when backspace is pressed
                                                  if (
                                                    value?.length === 3 ||
                                                    value?.length === 6
                                                  ) {
                                                    input.value = value.slice(
                                                      0,
                                                      -1,
                                                    );
                                                  }
                                                } else {
                                                  // Insert slash after entering two digits for month and day
                                                  if (
                                                    value?.length === 2 ||
                                                    value?.length === 5
                                                  ) {
                                                    input.value += '/';
                                                  }
                                                }
                                              },
                                            );
                                          },
                                        }}
                                        value={formatDateRegionWise(
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal),
                                        )}
                                        onChange={(e) => {
                                          handleChangeDate(formKeyVal, e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (fieldType == 'dd') {
                              if (
                                sourceType == 'table' ||
                                sourceType == 'custom'
                              ) {
                                return (
                                  <div className="col-6 col-md-6">
                                    <div className="form-group">
                                      <label className="form-label">
                                        {label}
                                        {requiredField && (
                                          <span className="text-danger">*</span>
                                        )}
                                      </label>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <select
                                          className={
                                            requiredField &&
                                              !identityDataFields?.[formKeyVal] &&
                                              (getUpdatedData(formKeyVal) == '' ||
                                                getUpdatedData(formKeyVal) ==
                                                null)
                                              ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da] mt-2`
                                              : `w-full p-2 bg-color-textfield-${theme}  shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da] mt-2`
                                          }
                                          defaultValue={
                                            editableField == false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          name={formKeyVal}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        >
                                          <option value="">
                                            Select {label}
                                          </option>
                                          {fieldData &&
                                            fieldData.map((dat, index) => (
                                              <option
                                                value={dat[returnKey]}
                                                selected={
                                                  editableField == false &&
                                                    valueField == dat[returnKey]
                                                    ? true
                                                    : getUpdatedData(
                                                      formKeyVal,
                                                    ) == dat[returnKey]
                                                      ? true
                                                      : false
                                                }
                                              >
                                                {dat?.name}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              if (sourceType == 'enum') {
                                return (
                                  <div className="col-6 col-md-6">
                                    <div className="form-group">
                                      <label className="form-label">
                                        {label}
                                        {requiredField && (
                                          <span className="text-danger">*</span>
                                        )}
                                      </label>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <select
                                          className={
                                            requiredField &&
                                              !identityDataFields?.[formKeyVal] &&
                                              (getUpdatedData(formKeyVal) == '' ||
                                                getUpdatedData(formKeyVal) ==
                                                null)
                                              ? `w-full p-2 bg-color-textfield-${theme} border-[0.5px] border-[#e19800] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da] mt-2`
                                              : `w-full p-2 bg-color-textfield-${theme}  shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md outline-none focus:ring-[1px] focus:ring-[#2b78da] mt-2`
                                          }
                                          defaultValue={
                                            editableField == false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          name={formKeyVal}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        >
                                          <option value="">
                                            Select {label}
                                          </option>
                                          {fieldData &&
                                            Object.keys(fieldData).map(
                                              (dat, index) => (
                                                <option
                                                  value={
                                                    fieldData[dat][returnKey]
                                                  }
                                                  selected={
                                                    editableField == false &&
                                                      valueField ==
                                                      fieldData[dat][returnKey]
                                                      ? true
                                                      : getUpdatedData(
                                                        formKeyVal,
                                                      ) ==
                                                        fieldData[dat][
                                                        returnKey
                                                        ]
                                                        ? true
                                                        : false
                                                  }
                                                >
                                                  {fieldData[dat]?.name}
                                                </option>
                                              ),
                                            )}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            }
                            if (fieldType == 'check') {
                              return (
                                <div
                                  className="col-6 col-md-6"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '25px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <input
                                      // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                      className={'checkbox-field'}
                                      type={'checkbox'}
                                      id={formKeyVal}
                                      name={formKeyVal}
                                      label={label}
                                      defaultChecked={
                                        editableField == false
                                          ? valueField
                                          : getUpdatedData(formKeyVal)
                                      }
                                      onChange={(e) => {
                                        handleChangeCheckBox(e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          }
                        }
                      }
                    }
                  })}
              </div>
              <div className="">
                <button
                type="submit"
                  className={`py-3 mt-4 px-8 rounded-lg font-light text-[15px] bg-color-button-${theme} `}
                  disabled={submitButtonDisable}
                  onClick={(e) => {
                    handleSubmitBank(e);
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        
        </div>
      </div>
      <Modal show={showHistoryModal} onHide={handleCloseHisroeyModal}>
        <Modal.Header closeButton>
          <Modal.Title>History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {remarks && remarks?.length > 0 ? (
            <MyTable data={remarks} />
          ) : (
            <div>No data available</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
