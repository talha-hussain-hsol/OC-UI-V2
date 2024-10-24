import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { postRegistrationProviderGetData } from "../../../api/network/CustomerApi";
import axios from "axios";
import { FaCheck } from "react-icons/fa";

// var theme = localStorage.getItem("portal_theme");
// const themeDark = localStorage.getItem("portal_theme");

export default function NewIdentitySection(props) {
  const cancelTokenSource = axios.CancelToken.source();
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

  return (
    <div>
      {/* <hr className="my-5" /> */}
      {/* <Row className="justify-content-center">
        <Col xs={12} md={6} lg={6} xl={6}>
          <h3>Account Type</h3>
          <div className="account_type_btn_container">
            <button className={isStandAlone ? "btn btn-primary btn-account-type-standalone selected" : "btn btn-primary btn-account-type-standalone not_selected"} onClick={(e) => setIsStandAlone(true)}>
              StandAlone
            </button>
            <button disabled className={!isStandAlone ? "btn btn-primary btn-account-type-joint selected" : "btn btn-primary btn-account-type-joint not_selected"} onClick={(e) => setIsStandAlone(false)}>
              Joint
            </button>
          </div>
        </Col>
        <Col xs={12} md={6} lg={6} xl={6} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Card style={{ width: "60%", marginBottom: "0px" }}>
            <Card.Body>
              <h4 className="mb-2">
                <span className="text-warning" style={{ marginRight: "5px" }}>
                  <FeatherIcon className={`text-warning`} icon="alert-triangle" size="15" />
                </span>
                Instructions
              </h4>
              <p className="small text-muted mb-0">Your Joint Account is Disabled</p>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
      {/* <hr className="my-5" /> */}
      {console.log(isNotCKYCVerified, "isNotCKYCVerified")}
      <div className="flex justify-center">
        {/* <Col xs={12} md={6} lg={6} xl={6}>
          <h3>Are you applying as an Individual or Corporate?</h3>
          <div className="account_type_btn_container">
            <button
              disabled={!props?.fundData?.fund_setting?.account?.applicant?.identity?.indivisual?.enabled}
              className={isIndividualClick ? "btn btn-primary btn-account-type-standalone selected" : "btn btn-primary btn-account-type-standalone not_selected"}
              onClick={() => handleButtonClick(true, "individual")}
            >
              Individual
            </button>
            <button
              disabled={!props?.fundData?.fund_setting?.account?.applicant?.identity?.corporate?.enabled}
              className={!isIndividualClick ? "btn btn-primary btn-account-type-joint selected" : "btn btn-primary btn-account-type-joint not_selected"}
              onClick={() => handleButtonClick(false, "corporate")}
            >
              Corporate
            </button>
          </div>
        </Col> */}
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-4">
            Are you applying as an Individual or Corporate?
          </h3>
          <div className="flex space-x-4">
            <button
              disabled={
                !props?.fundData?.fund_setting?.account?.applicant?.identity
                  ?.indivisual?.enabled
              }
              className={`px-4 py-2 rounded-lg font-medium 
        ${
          isIndividualClick
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        } 
        ${
          !props?.fundData?.fund_setting?.account?.applicant?.identity
            ?.indivisual?.enabled
            ? "opacity-50 cursor-not-allowed"
            : ""
        }
      `}
              onClick={() => handleButtonClick(true, "individual")}
            >
              Individual
            </button>
            <button
              disabled={
                !props?.fundData?.fund_setting?.account?.applicant?.identity
                  ?.corporate?.enabled
              }
              className={`px-4 py-2 rounded-lg font-medium 
        ${
          !isIndividualClick
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        } 
        ${
          !props?.fundData?.fund_setting?.account?.applicant?.identity
            ?.corporate?.enabled
            ? "opacity-50 cursor-not-allowed"
            : ""
        }
      `}
              onClick={() => handleButtonClick(false, "corporate")}
            >
              Corporate
            </button>
          </div>
        </div>

        {/* <Col
          xs={12}
          md={6}
          lg={6}
          xl={6}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{ justifyContent: "space-between", alignItems: "center" }}
            className="provider-selection-container"
          >
            <h3>How would you like to create your identity?</h3>
            <div
              className={
                selectedProvider === null
                  ? "provider-selection before"
                  : "provider-selection  "
              }
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "65%",
                marginTop: "2em",
              }}
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
                      />
                      <label
                        for="singpass"
                        className={
                          selectedProvider == "singpass"
                            ? "selected"
                            : "hide-content"
                        }
                      >
                        <img
                          style={{ width: "150px", height: "auto" }}
                          src="/img/providers/signpass.png"
                          alt="Singpass"
                        />
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
                      />
                      <label
                        for="adhar"
                        className={
                          selectedProvider == "adhar" ? "selected" : ""
                        }
                      >
                        <img
                          style={{ height: "30px" }}
                          src="/img/providers/adhhar.png"
                          alt="Adhar"
                        />
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
                      />
                      <label
                        for="manual"
                        className={
                          selectedProvider == "manual"
                            ? "selected"
                            : "hide-content"
                        }
                      >
                        <img
                          style={{ height: "30px" }}
                          src="/img/providers/manualwhite.png"
                          alt="Manual"
                        />
                      </label>
                    </>
                  )}
                  {/* {props?.fundData?.fund_setting?.account?.applicant?.identity?.indivisual?.provider?.verify?.adhaar?.enabled && (
    <>
                  <input
                    type="radio"
                    id="adhar"
                    name="selectedProvider"
                    value="adhar"
                    onClick={(e) => setSelectedProvider("adhar")}
                  />
                  <label
                    for="adhar"
                    className={selectedProvider == "adhar" ? "selected" : ""}
                  >
                    <img
                      style={{ height: "30px" }}
                      src="/img/providers/adhhar.png"
                      alt="Adhar"
                    />
                  </label> 
                  </>
                  )} }
                </>
              )}
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
                      />
                      <label
                        for="corppass"
                        className={
                          selectedProvider == "corppass"
                            ? "selected"
                            : "hide-content"
                        }
                      >
                        <img
                          style={{ width: "200px", height: "auto" }}
                          src="/img/corppassLogo.svg"
                          alt="Corppass"
                        />
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
                      />
                      <label
                        for="adhar"
                        className={
                          selectedProvider == "adhar" ? "selected" : ""
                        }
                      >
                        <img
                          style={{ height: "30px" }}
                          src="/img/providers/pan.png"
                          alt="Pan"
                        />
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
                      />
                      <label
                        for="manual"
                        className={
                          selectedProvider == "manual"
                            ? "selected"
                            : "hide-content"
                        }
                      >
                        <img
                          style={{ height: "30px" }}
                          src="/img/providers/manualwhite.png"
                          alt="Manual"
                        />
                      </label>
                    </>
                  )}

                  {/* <input
                    type="radio"
                    id="adhar"
                    name="selectedProvider"
                    value="adhar"
                    onClick={(e) => setSelectedProvider("adhar")}
                  />
                  <label
                    for="adhar"
                    className={selectedProvider == "adhar" ? "selected" : ""}
                  >
                    <img
                      style={{ height: "30px" }}
                      src="/img/providers/pan.png"
                      alt="Pan"
                    />
                  </label> }
                </>
              )}
            </div>
          </div> */}

        <div className="w-full md:w-1/2 flex flex-col">
          <div className="provider-selection-container flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              How would you like to create your identity?
            </h3>
            <div
              className={`provider-selection ${
                selectedProvider === null ? "before" : ""
              } flex justify-between w-2/3 mt-8`}
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
                        onClick={() => setSelectedProvider("singpass")}
                      />
                      <label
                        htmlFor="singpass"
                        className={`${
                          selectedProvider == "singpass"
                            ? "selected"
                            : "hide-content"
                        }`}
                      >
                        <img
                          className="w-[150px] h-auto"
                          src="/img/providers/signpass.png"
                          alt="Singpass"
                        />
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
                        onClick={() => setSelectedProvider("adhar")}
                      />
                      <label
                        htmlFor="adhar"
                        className={`${
                          selectedProvider == "adhar" ? "selected" : ""
                        }`}
                      >
                        <img
                          className="h-[30px]"
                          src="/img/providers/adhhar.png"
                          alt="Adhar"
                        />
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
                        onClick={() => setSelectedProvider("manual")}
                      />
                      <label
                        htmlFor="manual"
                        className={`${
                          selectedProvider == "manual"
                            ? "selected"
                            : "hide-content"
                        }`}
                      >
                        <img
                          className="h-[30px]"
                          src="/img/providers/manualwhite.png"
                          alt="Manual"
                        />
                      </label>
                    </>
                  )}
                </>
              )}
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
                        onClick={() => setSelectedProvider("corppass")}
                      />
                      <label
                        htmlFor="corppass"
                        className={`${
                          selectedProvider == "corppass"
                            ? "selected"
                            : "hide-content"
                        }`}
                      >
                        <img
                          className="w-[200px] h-auto"
                          src="/img/corppassLogo.svg"
                          alt="Corppass"
                        />
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
                        onClick={() => setSelectedProvider("adhar")}
                      />
                      <label
                        htmlFor="adhar"
                        className={`${
                          selectedProvider == "adhar" ? "selected" : ""
                        }`}
                      >
                        <img
                          className="h-[30px]"
                          src="/img/providers/pan.png"
                          alt="Pan"
                        />
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
                        onClick={() => setSelectedProvider("manual")}
                      />
                      <label
                        htmlFor="manual"
                        className={`${
                          selectedProvider == "manual"
                            ? "selected"
                            : "hide-content"
                        }`}
                      >
                        <img
                          className="h-[30px]"
                          src="/img/providers/manualwhite.png"
                          alt="Manual"
                        />
                      </label>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* <Row>
            <Col xs={12} md={3} lg={3} xl={3}></Col>
            <Col xs={12} md={9} lg={9} xl={9}>
              {selectedProvider == "adhar" && (
                <>
                  <hr className="my-3" />
                  <div className="form-group mb-0">
                    <label className="form-label">
                      Please Enter Pan Number
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group mb-0"
                        style={{
                          width: "100%",
                          paddingRight: "5%",
                          display: "flex",
                          flexDirection: isNotPanVerified.error
                            ? "Column"
                            : "Row",
                          alignItems: !isNotPanVerified.error
                            ? "center"
                            : "start",
                        }}
                      >
                        <input
                          type="text"
                          disabled={isPanVerified}
                          className="form-control"
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
                          <Button
                            variant="white"
                            size="sm"
                            onClick={handleGetDataApi}
                            style={{
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                            }}
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
                          </Button>
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
                          <Button
                            variant="white"
                            size="sm"
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
                          </Button>
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
                              <Button
                                variant="white"
                                size="sm"
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
                              </Button>
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
                              <Button
                                variant="white"
                                size="sm"
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
                              </Button>
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
                              <Button
                                variant="white"
                                size="sm"
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
                              </Button>
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
                              <Button
                                variant="white"
                                size="sm"
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
                              </Button>
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
                              <Button
                                variant="white"
                                size="sm"
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
                              </Button>
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
                              <Button
                                variant="white"
                                size="sm"
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
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </Col>
          </Row> */}

          <div className="flex flex-wrap">
            <div className="w-full md:w-3/12 lg:w-3/12 xl:w-3/12"></div>
            <div className="w-full md:w-9/12 lg:w-9/12 xl:w-9/12">
              {selectedProvider === "adhar" && (
                <>
                  <hr className="my-3" />
                  <div className="mb-0">
                    <label className="block text-sm font-medium">
                      Please Enter Pan Number
                    </label>
                    <div className="flex">
                      <div
                        className={`w-full pr-5 flex ${
                          isNotPanVerified.error
                            ? "flex-col items-start"
                            : "items-center"
                        }`}
                      >
                        <input
                          type="text"
                          disabled={isPanVerified}
                          className="form-control w-full p-2"
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
                              : "",
                          }}
                        />
                        {isNotPanVerified.error && (
                          <span className="text-red-500 text-xs mt-2">
                            {isNotPanVerified.message}
                          </span>
                        )}
                      </div>
                      {!isPanVerified ? (
                        <div className="w-1/5 flex justify-end items-center">
                          <button
                            className="bg-white border border-gray-300 text-sm px-4 py-2"
                            onClick={handleGetDataApi}
                            style={{
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {panLoader ? (
                              <div className="loader">Loading...</div>
                            ) : (
                              "Verify"
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="w-1/3 flex justify-end items-center">
                          <button
                            className="border-2 border-green-500 text-green-500 flex items-center px-4 py-2"
                            disabled
                          >
                            <FaCheck className="mr-2" /> Verified
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isIndividual && isPanVerified && (
                    <>
                      <hr className="my-3" />
                      <div className="mb-0">
                        <label className="block text-sm font-medium">
                          Please Enter Aadhaar Number
                        </label>
                        <div className="flex">
                          <div
                            className={`w-full pr-5 flex ${
                              isNotAadhaarVerified.error
                                ? "flex-col items-start"
                                : "items-center"
                            }`}
                          >
                            <input
                              type="text"
                              disabled={isAadhaarVerified}
                              className="form-control w-full p-2"
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
                                  : "",
                              }}
                            />
                            {isNotAadhaarVerified.error && (
                              <span className="text-red-500 text-xs mt-2">
                                {isNotAadhaarVerified.message}
                              </span>
                            )}
                          </div>
                          {!isAadhaarVerified ? (
                            <div className="w-1/5 flex justify-end items-center">
                              <button
                                className="bg-white border border-gray-300 text-sm px-4 py-2"
                                onClick={handleGetDataApi}
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {adharLoader ? (
                                  <div className="loader">Loading...</div>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="w-1/3 flex justify-end items-center">
                              <button
                                className="border-2 border-green-500 text-green-500 flex items-center px-4 py-2"
                                disabled
                              >
                                <FaCheck className="mr-2" /> Verified
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
                      <div className="mb-0">
                        <label className="block text-sm font-medium">
                          Please Enter Date Of Birth
                        </label>
                        <div className="flex">
                          <div
                            className={`w-full pr-5 flex ${
                              isNotCKYCVerified.error
                                ? "flex-col items-start"
                                : "items-center"
                            }`}
                          >
                            <input
                              type="date"
                              disabled={isCKYCVerified}
                              className="form-control w-full p-2"
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
                                  : "",
                              }}
                            />
                            {isNotCKYCVerified.error && (
                              <span className="text-red-500 text-xs mt-2">
                                {isNotCKYCVerified.message}
                              </span>
                            )}
                          </div>
                          {!isCKYCVerified ? (
                            <div className="w-1/5 flex justify-end items-center">
                              <button
                                className="bg-white border border-gray-300 text-sm px-4 py-2"
                                onClick={handleGetDataApi}
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {ckycLoader ? (
                                  <div className="loader">Loading...</div>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="w-1/3 flex justify-end items-center">
                              <button
                                className="border-2 border-green-500 text-green-500 flex items-center px-4 py-2"
                                disabled
                              >
                                <FaCheck className="mr-2" /> Verified
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
                      <div className="mb-0">
                        <label className="block text-sm font-medium">
                          Please Enter Date Of Incorporation
                        </label>
                        <div className="flex">
                          <div
                            className={`w-full pr-5 flex ${
                              isNotCKYCVerified.error
                                ? "flex-col items-start"
                                : "items-center"
                            }`}
                          >
                            <input
                              type="date"
                              disabled={isCKYCVerified}
                              className="form-control w-full p-2"
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
                                  : "",
                              }}
                            />
                            {isNotCKYCVerified.error && (
                              <span className="text-red-500 text-xs mt-2">
                                {isNotCKYCVerified.message}
                              </span>
                            )}
                          </div>
                          {!isCKYCVerified ? (
                            <div className="w-1/5 flex justify-end items-center">
                              <button
                                className="bg-white border border-gray-300 text-sm px-4 py-2"
                                onClick={handleGetDataApi}
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {ckycLoader ? (
                                  <div className="loader">Loading...</div>
                                ) : (
                                  "Verify"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="w-1/3 flex justify-end items-center">
                              <button
                                className="border-2 border-green-500 text-green-500 flex items-center px-4 py-2"
                                disabled
                              >
                                <FaCheck className="mr-2" /> Verified
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

      <hr className="my-5" />
    </div>
  );
}
