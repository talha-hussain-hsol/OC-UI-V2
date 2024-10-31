import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { postRegistrationProviderGetData } from "../../../api/network/CustomerApi";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { useTheme } from "../../../contexts/themeContext";
import FeatherIcon from "feather-icons-react";
import { HiPlusCircle } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function NewIdentitySection(props) {
  const { theme } = useTheme();
  const cancelTokenSource = axios.CancelToken.source();
  const emailRefs = useRef([]);
  const [isLoader, setIsLoader] = useState(false);
  const [panLoader, setPanLoader] = useState(false);
  const [adharLoader, setAdharLoader] = useState(false);
  const [ckycLoader, setCkycLoader] = useState(false);
  const [isStandAlone, setIsStandAlone] = useState(true);
  const [isIndividualClick, setIsIndividualClick] = useState(true);
  const [isIndividual, setIsIndividual] = useState(
    props?.fundData?.fund_setting?.account?.applicant?.identity?.indivisual
      ?.enabled
  );

  const [jointAccountIsEnabled, setJointAccountIsEnabled] = useState(false);
  const [addMoreDisabled, setAddMoreDisabled] = useState(false);
  const [emailFieldsForJointAccount, setEmailFieldsForJointAccount] = useState([
    "",
  ]);
  const [errorEmails, setErrorEmails] = useState([]);
  const [region, setRegion] = useState(props?.fundData?.fund_setting?.region);
  const [isCorporate, setisCorporate] = useState(false);
  //   const [isIndividual, setIsIndividual] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [lastSelected, setLastSelected] = useState(null);
  const [tickShow, setTickShow] = useState(false);

  const [isNotPanVerified, setIsNotPanVerified] = useState({
    error: false,
    message: "",
  });
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isNotAadhaarVerified, setIsNotAadhaarVerified] = useState({
    error: false,
    message: "",
  });
  const [isCKYCVerified, setIsCKYCVerified] = useState(false);
  const [isNotCKYCVerified, setIsNotCKYCVerified] = useState({
    error: false,
    message: "",
  });
  const [panData, setPanData] = useState(null);
  const [adhaarData, setAdhaarData] = useState(null);
  const [cKYCData, setCKYCData] = useState(null);
  const [registrationProvider, setRegistrationProvider] = useState({
    code: "",
    state: "",
  });
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    let dataToStore = {
      isStandAlone: isStandAlone,
      isIndividual: isIndividual,
      selectedProvider: selectedProvider,
      isPanVerified: isPanVerified,
      isAadhaarVerified: isAadhaarVerified,
      isCKYCVerified: isCKYCVerified,
      panData: panData,
      adhaarData: adhaarData,
      cKYCData: cKYCData,
      jointAccountEmails: emailFieldsForJointAccount,
    };
    props.checkIfDataSelected(dataToStore);
  }, [
    isStandAlone,
    isIndividual,
    selectedProvider,
    isPanVerified,
    isAadhaarVerified,
    isCKYCVerified,
    panData,
    adhaarData,
    cKYCData,
    emailFieldsForJointAccount,
  ]);
  const handleGetDataApi = async () => {
    setIsLoader(true);
    console.log(registrationProvider, "registrationProvider");
    // return;
    if (registrationProvider.state === "PAN") {
      setPanLoader(true);
    }
    if (registrationProvider.state === "AADHAAR") {
      setAdharLoader(true);
    }
    if (registrationProvider.state === "SIGN_DESK_CKYC") {
      setCkycLoader(true);
    }
    const response = await postRegistrationProviderGetData(
      registrationProvider,
      cancelTokenSource.token
    );
    if (response.success) {
      setIsLoader(false);
      if (registrationProvider.state === "PAN") {
        setPanLoader(false);
      }
      if (registrationProvider.state === "AADHAAR") {
        setAdharLoader(false);
      }
      if (registrationProvider.state === "SIGN_DESK_CKYC") {
        setCkycLoader(false);
      }
      if (registrationProvider.state === "AADHAAR") {
        setIsAadhaarVerified(response?.data?.result?.valid_aadhaar);
        if (!response?.data?.result?.valid_aadhaar) {
          setIsNotAadhaarVerified({
            error: true,
            message:
              "Verification failed. Please check the Aadhaar number and try again.",
          });
        } else {
          setIsNotAadhaarVerified({ error: false, message: "" });
        }
        let data = {
          data: response?.data,
          dateTime: new Date(),
        };
        setAdhaarData(data);
      } else if (registrationProvider.state === "PAN") {
        setIsPanVerified(response?.data?.result?.valid_pan);
        let data = {
          data: response?.data,
          dateTime: new Date(),
        };
        setPanData(data);
        setIsNotPanVerified({ error: false, message: "" });
      } else if (registrationProvider.state === "SIGN_DESK_CKYC") {
        setIsCKYCVerified(
          response.data.download.status == "success" ? true : false
        );
        let data = {
          data: response?.data,
          dateTime: new Date(),
        };
        setCKYCData(data);
        props?.handleChangeCkyc(response.data);

        // setIsCKYCVerified(true);
        if (response.data.download.status != "success") {
          setIsNotCKYCVerified({
            error: true,
            message:
              response?.data?.message ||
              "Verification failed. Please check the Date and try again.",
          });
        } else {
          setIsNotCKYCVerified({
            error: false,
            message: "",
          });
        }
      }
    } else {
      setIsLoader(false);
      if (registrationProvider.state === "AADHAAR") {
        setIsAadhaarVerified(false);
        setAdharLoader(false);
        setIsNotAadhaarVerified({
          error: true,
          message:
            response?.data?.message ||
            "Verification failed. Please check the Aadhaar number and try again.",
        });
      } else if (registrationProvider.state === "PAN") {
        setIsPanVerified(false);
        setIsNotPanVerified({
          error: true,
          message:
            "Verification failed. Please check the PAN number and try again.",
        });
        setPanLoader(false);
      } else if (registrationProvider.state === "SIGN_DESK_CKYC") {
        setIsCKYCVerified(false);
        setIsNotCKYCVerified({
          error: true,
          message:
            response?.data?.message ||
            "Verification failed. Please check the Date and try again.",
        });
      }
    }
  };

  const handleButtonClick = (isIndividualSelected, type) => {
    // Check if the clicked button is already selected?
    setLastSelected(type);

    // Set the new state values
    setIsIndividualClick(isIndividualSelected);
    setSelectedProvider(null);

    // Execute additional logic based on the type
    if (type === "individual") {
      setIsIndividual(true);
      // Handle additional logic for Individual
    } else {
      setIsIndividual(false);
      // Handle additional logic for Corporate
    }
    if (lastSelected == type) {
      setTickShow(false);
    } else {
      setTickShow(true);
    }
  };

  const handleJointAccout = (event) => {
    setJointAccountIsEnabled(event.target.checked);
    setIsStandAlone(!event.target.checked);
    if (event.target.checked == false) {
      setEmailFieldsForJointAccount([""]);
    }
  };
  const handleAddEmailFieldsForJointAccount = () => {
    setEmailFieldsForJointAccount([...emailFieldsForJointAccount, ""]);
    setErrorEmails([...errorEmails, ""]);
    emailRefs.current.push(React.createRef());
  };

  useEffect(() => {
    if (
      errorEmails.includes("Invalid Email") ||
      errorEmails.includes("Email already exists")
    ) {
      setAddMoreDisabled(true);
    } else {
      setAddMoreDisabled(false);
    }
  }, [errorEmails]);
  const validateEmails = (email, index) => {
    const isDuplicate = emailFieldsForJointAccount.some(
      (item, i) => i !== index && item === email
    );
    if (isDuplicate) {
      setErrorEmails((prevError) => {
        const newError = [...prevError];
        newError[index] = "Email already exists";
        return newError;
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorEmails((prevError) => {
        const newError = [...prevError];
        newError[index] = "Invalid Email";
        return newError;
      });
      return false;
    }

    // Clear any previous errors for this index
    setErrorEmails((prevError) => {
      const newError = [...prevError];
      newError[index] = "";
      return newError;
    });

    return true;
  };

  const handleEmailChange = (e, index) => {
    const email = e.target.value;

    // Always update email fields with current input
    setEmailFieldsForJointAccount((prev) => {
      const updatedEmailFields = [...prev];
      updatedEmailFields[index] = email;
      return updatedEmailFields;
    });

    // Validate email after updating it
    validateEmails(email, index);
  };

  const handleRemoveEmail = (index) => {
    setEmailFieldsForJointAccount((prev) => prev.filter((_, i) => i !== index));
    setErrorEmails((prev) => prev.filter((_, i) => i !== index));
    emailRefs.current.splice(index, 1);
  };
  return (
    <div className={`w-full px-8`}>
      <div className="md:flex md:flex-row flex flex-col gap-10 justify-center ">
        <div className="md:w-1/2 w-full">
          <h3>Are you applying as an Individual or Corporate?</h3>
          <div className="mt-4">
            <button
              disabled={
                !props?.fundData?.fund_setting?.account?.applicant?.identity
                  ?.indivisual?.enabled
              }
              className={` py-3 w-5/12 rounded-l-full text-white  ${
                isIndividualClick
                  ? "bg-[#5db160] font-semibold"
                  : "bg-[#083a61]"
              } hover:bg-[#5db160] focus:outline-none`}
              onClick={() => handleButtonClick(true, "individual")}
            >
              Individual
            </button>
            <button
              disabled={
                !props?.fundData?.fund_setting?.account?.applicant?.identity
                  ?.corporate?.enabled
              }
              className={` py-3 w-5/12 rounded-r-full text-white ${
                !isIndividualClick
                  ? "bg-[#5db160] font-semibold"
                  : "bg-[#083a61]"
              } hover:bg-[#5db160] focus:outline-none`}
              onClick={() => handleButtonClick(false, "corporate")}
            >
              Corporate
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 flex flex-col">
          <div className="w-full flex flex-col justify-between items-start">
            <h3>How would you like to create your identity?</h3>
            <div
              className={`flex justify-between gap-8 mt-[2em] relative ${
                selectedProvider === null ? "" : ""
              }`}
            >
              {isIndividual && (
                <>
                  {props?.fundData?.fund_setting?.account?.applicant?.identity
                    ?.indivisual?.provider?.verify?.singpass?.enabled && (
                    <>
                      <input
                        type="radio"
                        id="singpass"
                        name="selectedProvider"
                        value="singpass"
                        defaultChecked={selectedProvider == "singpass"}
                        onClick={(e) => setSelectedProvider("singpass")}
                        className="hidden"
                      />
                      <label
                        for="singpass"
                        className={
                          selectedProvider == "singpass"
                            ? "shadow-[0px_0px_8px_1px_rgba(34,197,94,0.5)] opacity-100"
                            : "opacity-40"
                        }
                      >
                        <img
                          style={{ width: "150px", height: "auto" }}
                          src="/img/providers/signpass.png"
                          alt="Singpass"
                        />
                        {selectedProvider === "singpass" && (
                          <span
                            className="absolute top-[-28px] left-[20%] transform translate-x-[-50%] text-white"
                            style={{ color: "rgba(34, 197, 94, 1) !important" }}
                          >
                            ✔
                          </span>
                        )}
                      </label>
                    </>
                  )}
                  {props?.fundData?.fund_setting?.account?.applicant?.identity
                    ?.indivisual?.provider?.verify?.adhaar?.enabled && (
                    <>
                      <input
                        type="radio"
                        id="adhar"
                        name="selectedProvider"
                        value="adhar"
                        onClick={(e) => setSelectedProvider("adhar")}
                        className="hidden"
                      />
                      <label
                        for="adhar"
                        className={
                          selectedProvider == "adhar"
                            ? "shadow-[0px_0px_8px_1px_rgba(34,197,94,0.5)] opacity-100"
                            : "opacity-40"
                        }
                      >
                        <img
                          style={{ height: "30px" }}
                          src="/img/providers/adhhar.png"
                          alt="Adhar"
                        />
                        {selectedProvider === "adhar" && (
                          <span
                            className="absolute top-[-28px] left-[54%] transform translate-x-[-50%] text-white"
                            style={{ color: "rgba(34, 197, 94, 1) !important" }}
                          >
                            ✔
                          </span>
                        )}
                      </label>
                    </>
                  )}
                  {props?.fundData?.fund_setting?.account?.applicant?.identity
                    ?.indivisual?.provider?.verify?.manual?.enabled && (
                    <>
                      <input
                        type="radio"
                        id="manual"
                        name="selectedProvider"
                        value="manual"
                        defaultChecked={selectedProvider == "manual"}
                        onClick={(e) => setSelectedProvider("manual")}
                        className="hidden"
                      />
                      <label
                        for="manual"
                        className={
                          selectedProvider == "manual"
                            ? "shadow-[0px_0px_8px_1px_rgba(34,197,94,0.5)] opacity-100"
                            : "opacity-40 "
                        }
                      >
                        <img
                          style={{ height: "30px" }}
                          src="/img/providers/manualwhite.png"
                          alt="Manual"
                        />
                        {selectedProvider === "manual" && (
                          <span className="absolute top-[-28px] left-[84%] transform translate-x-[-50%] text-green-500 font-bold leading-[1.2]">
                            ✔
                          </span> // Changed color to green
                        )}
                      </label>
                    </>
                  )}
                </>
              )}
              <div className="flex gap-2">
                {!isIndividual && (
                  <>
                    {props?.fundData?.fund_setting?.account?.applicant?.identity
                      ?.corporate?.provider?.verify?.corpass?.enabled && (
                      <>
                        <input
                          type="radio"
                          id="corppass"
                          name="selectedProvider"
                          value="corppass"
                          onClick={(e) => setSelectedProvider("corppass")}
                          className="hidden"
                        />
                        <label
                          for="corppass"
                          className={
                            selectedProvider == "corppass"
                              ? "shadow-[0px_0px_8px_1px_rgba(34,197,94,0.5)] opacity-100"
                              : "opacity-40"
                          }
                        >
                          <img
                            style={{ width: "200px", height: "auto" }}
                            src="/img/corppassLogo.svg"
                            alt="Corppass"
                          />
                          {selectedProvider === "corppass" && (
                            <span className="absolute top-[-28px] left-[20%] transform translate-x-[-50%] text-green-500 font-bold leading-[1.2]">
                              ✔
                            </span> // Changed color to green
                          )}
                        </label>
                      </>
                    )}
                    {props?.fundData?.fund_setting?.account?.applicant?.identity
                      ?.corporate?.provider?.verify?.pan?.enabled && (
                      <>
                        <input
                          type="radio"
                          id="adhar"
                          name="selectedProvider"
                          value="adhar"
                          onClick={(e) => setSelectedProvider("adhar")}
                          className="hidden"
                        />
                        <label
                          for="adhar"
                          className={
                            selectedProvider == "adhar"
                              ? "shadow-[0px_0px_8px_1px_rgba(34,197,94,0.5)] opacity-100"
                              : "opacity-40"
                          }
                        >
                          <img
                            style={{ height: "30px" }}
                            src="/img/providers/pan.png"
                            alt="Pan"
                          />
                          {selectedProvider === "adhar" && (
                            <span className="absolute top-[-28px] left-[54%] transform translate-x-[-50%] text-green-500 font-bold leading-[1.2]">
                              ✔
                            </span> // Changed color to green
                          )}
                        </label>
                      </>
                    )}
                    {props?.fundData?.fund_setting?.account?.applicant?.identity
                      ?.corporate?.provider?.verify?.manual?.enabled && (
                      <>
                        <input
                          type="radio"
                          id="manual"
                          name="selectedProvider"
                          value="manual"
                          onClick={(e) => setSelectedProvider("manual")}
                          className="hidden"
                        />
                        <label
                          for="manual"
                          className={
                            selectedProvider == "manual"
                              ? "shadow-[0px_0px_8px_1px_rgba(34,197,94,0.5)] opacity-100"
                              : "opacity-40"
                          }
                        >
                          <img
                            style={{ height: "30px" }}
                            src="/img/providers/manualwhite.png"
                            alt="Manual"
                          />
                          {selectedProvider === "manual" && (
                            <span className="absolute top-[-28px] left-[84%] transform translate-x-[-50%] text-green-500 font-bold leading-[1.2]">
                              ✔
                            </span> // Changed color to green
                          )}
                        </label>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-full md:w-1/4 lg:w-1/4 xl:w-1/4"></div>

            <div className="w-full md:w-9/12 lg:w-9/12 xl:w-9/12">
              {selectedProvider == "adhar" && (
                <>
                  <hr className="my-3 border-t-[1px] border-t-[#6e84a3] opacity-30" />
                  <div className="w-full mb-0">
                    <label className="">Please Enter Pan Number</label>
                    <div style={{ display: "flex" }} className="items-center">
                      <div
                        className={`w-full mt-3 mb-0 pr-[5%] flex ${
                          isNotPanVerified.error
                            ? "flex-col items-start"
                            : "flex-row items-center"
                        }`}
                      >
                        <input
                          type="text"
                          disabled={isPanVerified}
                          className={`bg-color-textfield-dropdown-${theme} border border-color-${theme} rounded-md shadow-${theme}`}
                          onChange={(event) =>
                            setRegistrationProvider({
                              ...registrationProvider,
                              code: event.target.value,
                              state: "PAN",
                            })
                          }
                          style={{
                            border: isNotPanVerified.error
                              ? "2px solid red"
                              : isPanVerified
                              ? "2px solid green"
                              : null,
                            padding: "5px",
                            width: isPanVerified ? "100%" : "90%",
                          }}
                        />
                        {isNotPanVerified.error && (
                          <span
                            style={{
                              color: "red",
                              fontSize: "10px",
                              marginTop: "5px",
                            }}
                          >
                            {isNotPanVerified.message}
                          </span>
                        )}
                      </div>
                      {!isPanVerified ? (
                        <div
                          className="form-group mb-0"
                          style={{
                            width: "15%",
                            display: "flex",
                            justifyContent: "end",
                            alignItems: isNotPanVerified.error
                              ? "start"
                              : "center",
                          }}
                        >
                          <button
                            onClick={handleGetDataApi}
                            className="h-[40px] flex items-center border px-6 rounded-md bg-"
                          >
                            {panLoader ? (
                              <div>
                                <Spinner
                                  animation="border"
                                  role="status"
                                  style={{ height: "20px", width: "20px" }}
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              </div>
                            ) : (
                              "Verify"
                            )}
                          </button>
                        </div>
                      ) : (
                        <div
                          className="form-group mb-0"
                          style={{
                            width: "30%",
                            display: "flex",
                            justifyContent: "end",
                            alignItems: !isNotPanVerified.error
                              ? "center"
                              : "start",
                          }}
                        >
                          <button
                            style={{
                              border: "2px solid green",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                            }}
                            disabled
                          >
                            <FaCheck
                              style={{ marginRight: "5px", color: "green" }}
                            />{" "}
                            Verified
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {isIndividual && isPanVerified && (
                    <>
                      <hr className="my-3" />
                      <div className="form-group mb-0">
                        <label className="form-label">
                          Please Enter Aadhaar Number
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group mb-0"
                            style={{
                              width: "100%",
                              paddingRight: "5%",
                              display: "flex",
                              flexDirection: isNotAadhaarVerified.error
                                ? "column"
                                : "row",
                              alignItems: !isNotAadhaarVerified.error
                                ? "center"
                                : "start",
                            }}
                          >
                            <input
                              type="text"
                              disabled={isAadhaarVerified}
                              className="form-control"
                              onChange={(event) =>
                                setRegistrationProvider({
                                  ...registrationProvider,
                                  code: event.target.value,
                                  state: "AADHAAR",
                                })
                              }
                              style={{
                                border: isNotAadhaarVerified.error
                                  ? "2px solid red"
                                  : isAadhaarVerified
                                  ? "2px solid green"
                                  : null,
                                padding: "5px",
                                width: isAadhaarVerified ? "100%" : "90%",
                              }}
                            />
                            {(!isAadhaarVerified ||
                              isNotAadhaarVerified.error) && (
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "5px",
                                }}
                              >
                                {isNotAadhaarVerified.message}
                              </span>
                            )}
                          </div>
                          {!isAadhaarVerified ? (
                            <div
                              className="form-group mb-0"
                              style={{
                                width: "15%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: isNotAadhaarVerified.error
                                  ? "start"
                                  : "center",
                              }}
                            >
                              <button
                                onClick={handleGetDataApi}
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {adharLoader ? (
                                  <div>
                                    <Spinner
                                      animation="border"
                                      role="status"
                                      style={{ height: "20px", width: "20px" }}
                                    >
                                      <span className="visually-hidden">
                                        Loading...
                                      </span>
                                    </Spinner>
                                  </div>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div
                              className="form-group mb-0"
                              style={{
                                width: "30%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: !isNotAadhaarVerified.error
                                  ? "center"
                                  : "start",
                              }}
                            >
                              <button
                                style={{
                                  border: "2px solid green",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                disabled
                              >
                                <FaCheck
                                  style={{ marginRight: "5px", color: "green" }}
                                />{" "}
                                Verified
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {isIndividual && isPanVerified && isAadhaarVerified && (
                    <>
                      <hr className="my-3" />
                      <div className="form-group mb-0">
                        <label className="form-label">
                          Please Enter Date Of Birth
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group mb-0"
                            style={{
                              width: "100%",
                              paddingRight: "5%",
                              display: "flex",
                              flexDirection: isNotCKYCVerified.error
                                ? "column"
                                : "row",
                              alignItems: !isNotCKYCVerified?.error
                                ? "center"
                                : "start",
                            }}
                          >
                            <input
                              type="date"
                              disabled={isCKYCVerified}
                              className="form-control"
                              onChange={(event) =>
                                setRegistrationProvider({
                                  ...registrationProvider,
                                  code: panData?.data?.result?.validated_data
                                    ?.pan_number,
                                  state: "SIGN_DESK_CKYC",
                                  date: event.target.value,
                                })
                              }
                              style={{
                                border: isNotCKYCVerified.error
                                  ? "2px solid red"
                                  : isCKYCVerified
                                  ? "2px solid green"
                                  : null,
                                padding: "5px",
                                width: isCKYCVerified ? "100%" : "90%",
                              }}
                            />
                            {isNotCKYCVerified.error && (
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "5px",
                                }}
                              >
                                {isNotCKYCVerified.message}
                              </span>
                            )}
                          </div>
                          {!isCKYCVerified ? (
                            <div
                              className="form-group mb-0"
                              style={{
                                width: "15%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: isNotCKYCVerified.error
                                  ? "start"
                                  : "center",
                              }}
                            >
                              <button
                                onClick={handleGetDataApi}
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {ckycLoader ? (
                                  <div>
                                    <Spinner
                                      animation="border"
                                      role="status"
                                      style={{ height: "20px", width: "20px" }}
                                    >
                                      <span className="visually-hidden">
                                        Loading...
                                      </span>
                                    </Spinner>
                                  </div>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div
                              className="form-group mb-0"
                              style={{
                                width: "30%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: !isNotCKYCVerified.error
                                  ? "center"
                                  : "start",
                              }}
                            >
                              <button
                                style={{
                                  border: "2px solid green",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                disabled
                              >
                                <FaCheck
                                  style={{ marginRight: "5px", color: "green" }}
                                />{" "}
                                Verified
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {!isIndividual && isPanVerified && (
                    <>
                      <hr className="my-3" />
                      <div className="form-group mb-0">
                        <label className="form-label">
                          Please Enter Date Of Incorporation
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group mb-0"
                            style={{
                              width: "100%",
                              paddingRight: "5%",
                              display: "flex",
                              flexDirection: isNotCKYCVerified.error
                                ? "column"
                                : "row",
                              alignItems: !isNotCKYCVerified.error
                                ? "center"
                                : "start",
                            }}
                          >
                            <input
                              type="date"
                              disabled={isCKYCVerified}
                              className="form-control"
                              onChange={(event) =>
                                setRegistrationProvider({
                                  ...registrationProvider,
                                  code: panData?.data?.result?.validated_data
                                    ?.pan_number,
                                  state: "SIGN_DESK_CKYC",
                                  date: event.target.value,
                                })
                              }
                              style={{
                                border: isCKYCVerified.error
                                  ? "2px solid red"
                                  : isCKYCVerified
                                  ? "2px solid green"
                                  : null,
                                padding: "5px",
                                width: isCKYCVerified ? "100%" : "90%",
                              }}
                            />
                            {isNotCKYCVerified.error && (
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "5px",
                                }}
                              >
                                {isNotCKYCVerified.message}
                              </span>
                            )}
                          </div>
                          {!isCKYCVerified ? (
                            <div
                              className="form-group mb-0"
                              style={{
                                width: "15%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: isNotCKYCVerified.error
                                  ? "start"
                                  : "center",
                              }}
                            >
                              <button
                                onClick={handleGetDataApi}
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {ckycLoader ? (
                                  <div>
                                    <Spinner
                                      animation="border"
                                      role="status"
                                      style={{ height: "20px", width: "20px" }}
                                    >
                                      <span className="visually-hidden">
                                        Loading...
                                      </span>
                                    </Spinner>
                                  </div>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div
                              className="form-group mb-0"
                              style={{
                                width: "30%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: !isNotCKYCVerified.error
                                  ? "center"
                                  : "start",
                              }}
                            >
                              <button
                                style={{
                                  border: "2px solid green",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                disabled
                              >
                                <FaCheck
                                  style={{ marginRight: "5px", color: "green" }}
                                />{" "}
                                Verified
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="my-3 border-t-[1px] border-t-[#6e84a3] opacity-30" />
      {props?.fundData?.fund_setting?.account?.max_share_holder != 0 &&
        !params?.accountId && (
          <>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col">
                <label className="font-light form-label mb-1">
                  Joint Account
                </label>
                <small className="font-light text-slate-500">
                  Enable, if this is a joint application
                </small>

                <div className="form-check form-switch flex items-center mt-3">
                  <label className="relative inline-flex items-center cursor-pointer mt-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      disabled={
                        props?.fundData?.fund_setting?.account
                          ?.max_share_holder <= 1
                      }
                      checked={jointAccountIsEnabled}
                      onChange={(event) => handleJointAccout(event)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                  </label>
                  <label className="font-light ml-3" htmlFor="switchOne">
                    Enable
                  </label>
                </div>
              </div>
              <div
                className={`bg-color-card-${theme} rounded-md shadow-${theme} p-4 w-[50%]`}
              >
                <h4 className={`flex  text-color-${theme}`}>
                  <span className="text-[#E4A11B]">
                    <FeatherIcon
                      className="mt-1 mr-2"
                      icon="alert-triangle"
                      size="15"
                    />
                  </span>{" "}
                  Warning
                </h4>

                <p className="font-light text-[13px] text-slate-500">
                  Once an account is made. you cannot change the identity which
                  is attached to it, and its type (i.e. Single Joint).
                </p>
              </div>
            </div>
            <hr className="my-3 border-t-[1px] border-t-[#6e84a3] opacity-30" />
            {console.log(
              emailFieldsForJointAccount,
              "emailFieldsForJointAccount emailFieldsForJointAccount"
            )}
            {props?.fundData?.fund_setting?.account?.max_share_holder <= 1 ? (
              <div className="mt-5">
                <p style={{ color: "orange" }}>
                  Joint Account Disabled for the Fund{" "}
                  <strong>{props?.fundData?.name}</strong>
                </p>
              </div>
            ) : (
              !jointAccountIsEnabled && (
                <div className="mt-5">
                  <p style={{ color: "orange" }}>
                    Please enable joint account to add emails
                  </p>
                </div>
              )
            )}

            {jointAccountIsEnabled
              ? emailFieldsForJointAccount.map((email, index) => (
                  <div key={index} className="form-group">
                    <label className="font-light">
                      Enter Shareholder Email
                    </label>
                    <div className="flex">
                      <div className="w-full">
                        <input
                          className={`bg-color-textfield-dropdown-${theme} mt-2 w-full py-[10px] px-4 border-color-${theme} rounded-lg shadow-${theme} focus:outline-none focus:ring-1 focus:ring-[#2d7ce2] focus:border-[#2d7ce2] placeholder:text-sm placeholder:text-[#8ca4c2]  `}
                          placeholder="Partner Email"
                          type="email"
                          value={email}
                          onChange={(event) => handleEmailChange(event, index)}
                        />
                        {errorEmails.map((item, i) => {
                          if (index == i && item == "Invalid Email") {
                            return (
                              <p
                                style={{
                                  color: "red",
                                  marginTop: "2px",
                                  marginLeft: "15px",
                                }}
                              >
                                Please Enter Valid Email
                              </p>
                            );
                          } else {
                            return null;
                          }
                        })}
                        {errorEmails.map((item, i) => {
                          if (index == i && item == "Email already exists") {
                            return (
                              <p
                                style={{
                                  color: "red",
                                  marginTop: "2px",
                                  marginLeft: "15px",
                                }}
                              >
                                Please Enter Unique Email
                              </p>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                      {emailFieldsForJointAccount.length !== 1 ? (
                        <div xs="auto">
                          <button
                              className="flex items-center mt-2 ml-2 mr-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 "

                            size="sm"
                            onClick={() => handleRemoveEmail(index)}
                          >
                            <RiDeleteBin5Line className="mr-2 text-lg"/>{" "}
                            Delete
                          </button>
                        </div>
                      ) : null}
                      {emailFieldsForJointAccount.length - 1 == index &&
                      emailFieldsForJointAccount.length <
                        props?.fundData?.fund_setting?.account
                          ?.max_share_holder ? (
                        <div className="flex">
                          <button
                            disabled={addMoreDisabled}
                            size="sm"
                            className="flex w-full items-center px-4 py-2 ml-1 mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600  cursor-pointer"
                            onClick={handleAddEmailFieldsForJointAccount}
                          >
                            <HiPlusCircle className="mr-2 text-lg " /> Add More
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              : null}
          </>
        )}
    </div>
  );
}
