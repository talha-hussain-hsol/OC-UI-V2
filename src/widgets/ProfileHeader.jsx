import { Link, useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

import React, { useEffect, useState } from "react";
import {
  Col,
  Nav,
  Row,
  Button,
  Dropdown,
  Modal,
  Container,
  Form,
  Alert,
} from "react-bootstrap";
import { Header } from "../components";
import {
  getRegistrationProviderForSingpass,
  postRegistrationProviderGetData,
} from "../api/network/customerApi";
import axios from "axios";
// import SpinnerWithBackDrop from "./bootstrap-component/SpinnerWithBackDrop";
import Select from "react-select";
import { FaCheck } from "react-icons/fa"; // Import the green tick icon

const themeDark = localStorage.getItem("portal_theme");
const customStyles =
  themeDark == "dark" || themeDark == undefined
    ? {
        option: (provided, state) => ({
          ...provided,
          color: "#fff",
          backgroundColor: state.isSelected ? "#3b82f6" : "#1e3a5c",
          ":active": {
            backgroundColor: "#3b82f6",
            color: "#fff",
          },
          ":hover": {
            backgroundColor: "#3b82f6",
            color: "#fff",
          },
          ":not(:hover)": {
            backgroundColor: state.isSelected ? "#3b82f6" : "#1e3a5c",
            color: "##fff",
          },
        }),
        input: (provided) => ({
          ...provided,
          color: "#fff",
        }),

        singleValue: (provided) => ({
          ...provided,
          color: "#fff",
        }),
        control: (provided, state) => ({
          ...provided,
          minHeight: "40px", // set the minimum height here
          backgroundColor: "#1e3a5c",
          color: "#93a6c6",
          borderColor: state.isFocused ? "#fff" : "#444",
        }),
        menu: (provided, state) => ({
          ...provided,
          backgroundColor: "#1e3a5c",
          color: "#93a6c6",
        }),
        placeholder: (provided, state) => ({
          ...provided,
          color: "#93a6c6", // change the color of the placeholder text here
        }),
      }
    : {
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? "#fff" : "#000",
          backgroundColor: state.isSelected
            ? "#3b82f6"
            : state.isFocused
            ? "#e5e7eb"
            : "#fff",
          ":active": {
            backgroundColor: "#3b82f6",
            color: "#fff",
          },
          ":hover": {
            backgroundColor: state.isSelected ? "#3b82f6" : "#e5e7eb",
            color: state.isSelected ? "#fff" : "#000",
          },
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#3b3f45",
        }),
        control: (provided, state) => ({
          ...provided,
          minHeight: "40px", // set the minimum height here
          backgroundColor: "#fff",
          color: "#3b3f45",
          borderColor: state.isFocused ? "#3b82f6" : "#cbd5e0",
          boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
          "&:hover": {
            borderColor: state.isFocused ? "#3b82f6" : "#a0aec0",
          },
        }),
        menu: (provided, state) => ({
          ...provided,
          backgroundColor: "#fff",
          color: "#3b3f45",
        }),
        placeholder: (provided, state) => ({
          ...provided,
          color: "#a0aec0", // change the color of the placeholder text here
        }),
      };
export default function AccountHeader({ ...props }) {
  const cancelTokenSource = axios.CancelToken.source();

  const navigate = useNavigate();
  const [modalShowOption, setModalShowOption] = useState(false);
  const [type, setType] = useState("");
  const [typeProcess, setTypeProcess] = useState("");
  const [region, setRegion] = useState("");
  const [navigateLink, setNavigateLink] = useState("");
  const [handleClickProvider, setHandleClickProvider] = useState(false);
  const [handleClickProviderLink, setHandleClickProviderLink] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [panData, setPanData] = useState(null);
  const [adhaarData, setAdhaarData] = useState(null);
  const [dateCkyc, setDateCkyc] = useState(null);
  const [cKycData, setCKycData] = useState(null);

  const [panNumber, setPanNumber] = useState(null);
  const [registrationProvider, setRegistrationProvider] = useState({
    code: "",
    state: "",
  });
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [isNotPanVerified, setIsNotPanVerified] = useState({
    error: false,
    message: "",
  });
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isNotAadhaarVerified, setIsNotAadhaarVerified] = useState({
    error: false,
    message: "",
  });
  const [isDateVerified, setIsDateVerified] = useState(false);
  const [isNotDateVerified, setIsNotDateVerified] = useState({
    error: false,
    message: "",
  });

  const options = [
    { value: "individual", label: "Individual" },
    { value: "corporate", label: "Corporate" },
    // Add more options if needed
  ];
  const optionsForProcess = [
    { value: "manual", label: "Manual" },
    { value: "integrate", label: "Integrated National Database" },
    // Add more options if needed
  ];
  const regionOptions = [
    { value: "SGP", label: "Singapore" },
    { value: "IND", label: "India" },

    //please  Add more options if needed
  ];

  const [isLoader, setIsLoader] = useState(false);

  const history = useLocation();
  const params = useParams();

  useEffect(() => {
    console.log("isAadhaarVerified", isAadhaarVerified);
  }, [isAadhaarVerified]);

  const handleAdharAndPanContinue = () => {
    navigate(`/profile/identity/${type?.value}/particular?pan=true`, {
      state: { data: { adhhar: adhaarData, pan: panData, dataCkyc: cKycData } },
    });
  };

  const handleGetDataApi = async () => {
    setIsLoader(true);

    const response = await postRegistrationProviderGetData(
      registrationProvider,
      cancelTokenSource.token
    );
    console.log("response", response);
    if (response.success) {
      setIsLoader(false);
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
        setAdhaarData(response?.data);
      } else {
        setIsPanVerified(response?.data?.result?.valid_pan);
        console.log("response", response?.data);
        setPanData(response?.data);
        setIsNotPanVerified({ error: false, message: "" });
      }
    } else {
      setIsLoader(false);
      if (registrationProvider.state === "AADHAAR") {
        setIsAadhaarVerified(false);
        setIsNotAadhaarVerified({
          error: true,
          message:
            response?.data?.message ||
            "Verification failed. Please check the Aadhaar number and try again.",
        });
      } else {
        setIsPanVerified(false);
        setIsNotPanVerified({
          error: true,
          message:
            "Verification failed. Please check the PAN number and try again.",
        });
      }
    }
  };

  const handleChangeDate = async () => {
    setIsLoader(true);

    const response = await postRegistrationProviderGetData(
      registrationProvider,
      cancelTokenSource.token
    );
    console.log("response", response);
    if (response.success) {
      setIsLoader(false);
      if (response?.data?.download?.result?.kycStatus === "SUCCESS") {
        setCKycData(response?.data);

        setIsNotDateVerified({ error: false, message: "" });
        setIsDateVerified(true);
      } else {
        setIsDateVerified(false);
        setIsNotDateVerified({
          error: true,
          message: "Date Not Match With Pan Number",
        });
      }

      console.log("response", response?.data);
    } else {
      setIsLoader(false);

      setIsDateVerified(false);
      setIsNotDateVerified({
        error: true,
        message: "Verification failed. Please check the Date and try again.",
      });
    }
  };

  const handleCloseModal = () => {
    setModalShowOption(false);
    setHandleClickProvider(false);
  };

  const handleShowModal = () => {
    console.log("awais");
    setModalShowOption(true);
  };
  const handleClickContinue = (value) => {
    if (value == "manual") {
      navigate(navigateLink, { state: { manual: true } });
    } else {
      getRegistrationProviderForSingpassApi();

      // navigate(`/${params?.fund_id}/restricted/list/${value.original.id}`, { state: value.original });
    }
  };
  const getRegistrationProviderForSingpassApi = async () => {
    setIsLoader(true);
    console.log(`checking getUploadDocument`);
    let singPassValue = type?.value == "individual" ? "SINGPASS" : "CORPPASS";
    // setIsLoader(true);

    const response = await getRegistrationProviderForSingpass(
      singPassValue,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      console.log("blsdalsdlka", response);
      let authoriseUrl;
      type?.value == "individual"
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

      // navigate(navigateLink,{ state:{manual:false,authoriseUrl:authoriseUrl} })
      setHandleClickProvider(true);
      setHandleClickProviderLink(authoriseUrl);
      window.location.href = authoriseUrl;
    } else {
      setIsLoader(false);
    }
  };
  const stepOne = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 3
          </h6>
          <h1 className="mb-3">Select Identity Type</h1>
          <p className="mb-5 text-muted">
            Please select whether you would like to setup an individual or a
            corporate identity and click on the continue button.
          </p>
        </Col>
      </Row>

      <div className="row">
        <div className="col-sm-8">
          <div className="form-group">
            <label className="form-label">Select The Identity Type</label>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="form-group" style={{ width: "90%" }}>
                {console.log("options", options)}
                <Select
                  placeholder="Select Identity Type"
                  isSearchable={true}
                  styles={customStyles}
                  value={type}
                  options={options}
                  onChange={(selected) => {
                    setType(selected);
                    handleNavigateToIdentity(
                      selected,
                      `/profile/identity/${selected.value}/particular`
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div
            className="card bg-light border"
            style={{ height: "100%", width: "300px" }}
          >
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                width: "300px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  class="text-info"
                  style={{ marginRight: "5px", marginBottom: "10px" }}
                >
                  <FeatherIcon
                    className={`text-info`}
                    icon="alert-triangle"
                    size="15"
                    marginRight="10px"
                  />
                </span>
                <h4 className="mb-2">Purpose Of Identity Creation</h4>
              </div>

              <p className="small text-muted mb-0">
                You can create more than one identity. this is one-time setup
                for each Identity Type. This identity can then be used to join
                different Accounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => {
              setModalShowOption(false);
              setActiveStep(1);
            }}
          >
            Back
          </Button>
        </Col>
        <Col className="text-center">
          <h6 className="text-uppercase text-muted mb-0">
            Step {activeStep} of 3
          </h6>
        </Col>
        <Col xs="auto">
          <Button
            size="lg"
            onClick={(e) => setActiveStep(activeStep + 1)}
            disabled={type !== "" ? false : true}
          >
            Continue
          </Button>
        </Col>
      </Nav>
    </>
  );
  const handleClearStepTwo = () => {
    setRegion("");
    setTypeProcess("");
  };
  const stepTwo = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 3
          </h6>
          <h1 className="mb-3">How Would You Like To Setup Your Identity?</h1>
          <p className="mb-5 text-muted">
            You can setup your identity manually or use the available government
            integrated data sources based on your nationality.
          </p>
        </Col>
      </Row>

      <div className="row">
        <div className="col-sm-8">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="form-group">
              <label className="form-label">Select The Setup Method :</label>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="form-group" style={{ width: "90%" }}>
                  {console.log("options", options)}
                  <Select
                    placeholder="Select Identity Type"
                    isSearchable={true}
                    styles={customStyles}
                    value={typeProcess}
                    options={optionsForProcess}
                    onChange={(selected) => {
                      setTypeProcess(selected);
                    }}
                  />
                </div>
              </div>
            </div>
            {typeProcess?.value == "integrate" && (
              <div className="form-group">
                <label className="form-label">Select The Region</label>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="form-group" style={{ width: "90%" }}>
                    {console.log("options", options)}
                    <Select
                      placeholder="Select Identity Type"
                      isSearchable={true}
                      styles={customStyles}
                      value={region}
                      options={regionOptions}
                      onChange={(selected) => {
                        setRegion(selected);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {region?.value == "IND" && typeProcess?.value != "manual" && (
              <div className="form-group">
                <label className="form-label">Please Enter Pan Number</label>
                <div style={{ display: "flex" }}>
                  <div
                    className="form-group"
                    style={{
                      width: "70%",
                      paddingRight: "5%",
                      display: "flex",
                      flexDirection: isNotPanVerified.error ? "Column" : "Row",
                      alignItems: !isNotPanVerified.error ? "center" : "start",
                    }}
                  >
                    <input
                      type="text"
                      disabled={isPanVerified}
                      className="form-control"
                      onChange={(event) => {
                        setRegistrationProvider({
                          ...registrationProvider,
                          code: event.target.value,
                          state: "PAN",
                        });
                        setPanNumber(event.target.value);
                      }}
                      style={{
                        border: isNotPanVerified.error
                          ? "2px solid red"
                          : isPanVerified
                          ? "2px solid green"
                          : null,
                        padding: "5px",
                        width: "100%",
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
                      className="form-group"
                      style={{
                        width: "20%",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: isNotPanVerified.error ? "start" : "center",
                      }}
                    >
                      <Button
                        variant="white"
                        size="sm"
                        onClick={handleGetDataApi}
                      >
                        Verify
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="form-group"
                      style={{
                        width: "20%",
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
                        style={{ border: "2px solid green" }}
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
            )}
            {type?.value == "individual" &&
              region?.value === "IND" &&
              isPanVerified && (
                <div className="form-group">
                  <label className="form-label">
                    Please Enter Aadhaar Number
                  </label>
                  <div style={{ display: "flex" }}>
                    <div
                      className="form-group"
                      style={{
                        width: "70%",
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
                          width: "100%",
                        }}
                      />
                      {(!isAadhaarVerified || isNotAadhaarVerified.error) && (
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
                        className="form-group"
                        style={{
                          width: "20%",
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
                        >
                          Verify
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="form-group"
                        style={{
                          width: "20%",
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
                          style={{ border: "2px solid green" }}
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
              )}
            {/*this is for ckyc */}
            {region?.value == "IND" &&
              isPanVerified &&
              (isAadhaarVerified || type?.value == "corporate") && (
                <div className="form-group">
                  <label className="form-label">
                    Please Enter{" "}
                    {type?.value === "corporate"
                      ? "Date Of Incorporation"
                      : "Date Of Birth"}
                  </label>
                  <div style={{ display: "flex" }}>
                    <div
                      className="form-group"
                      style={{
                        width: "70%",
                        paddingRight: "5%",
                        display: "flex",
                        flexDirection: isNotDateVerified.error
                          ? "column"
                          : "row", // Updated this line
                        alignItems: !isNotDateVerified.error
                          ? "center"
                          : "start", // Adjusted alignment
                      }}
                    >
                      <input
                        type="date"
                        value={dateCkyc}
                        className="form-control"
                        style={{
                          border: isNotDateVerified.error
                            ? "2px solid red"
                            : isDateVerified
                            ? "2px solid green"
                            : null,
                          padding: "5px",
                          width: "100%",
                        }}
                        onChange={(event) => {
                          setRegistrationProvider({
                            ...registrationProvider,
                            date: event.target.value,
                            state: "SIGN_DESK_CKYC",
                            code: panNumber,
                          });
                          setDateCkyc(event.target.value);
                        }}
                        disabled={isDateVerified} // Disable the input if date is verified
                      />
                      {(!isDateVerified || isNotDateVerified.error) && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "10px",
                            marginTop: "5px",
                          }}
                        >
                          {isNotDateVerified.message}
                        </span>
                      )}
                    </div>
                    {!isDateVerified ? (
                      <div
                        className="form-group"
                        style={{
                          width: "20%",
                          display: "flex",
                          justifyContent: "end",
                          alignItems: isNotDateVerified.error
                            ? "start"
                            : "center",
                        }}
                      >
                        <Button
                          variant="white"
                          size="sm"
                          onClick={handleChangeDate}
                        >
                          Verify
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="form-group"
                        style={{
                          width: "20%",
                          display: "flex",
                          justifyContent: "end",
                          alignItems: !isNotDateVerified.error
                            ? "center"
                            : "start",
                        }}
                      >
                        <Button
                          variant="white"
                          size="sm"
                          style={{ border: "2px solid green" }}
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
              )}
          </div>
        </div>
        <div className="col-sm-4">
          <div
            className="card bg-light border"
            style={{ height: "100%", width: "300px" }}
          >
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                width: "300px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  class="text-info"
                  style={{ marginRight: "5px", marginBottom: "10px" }}
                >
                  <FeatherIcon
                    className={`text-info`}
                    icon="alert-triangle"
                    size="15"
                  />
                </span>
                <h4 className="mb-2">Notice!</h4>
              </div>

              <p className="small text-muted mb-0">
                Available government data sources are Myinfo with
                Singpass/CorpPass.
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => {
              setActiveStep(activeStep - 1);
              handleClearStepTwo();
            }}
          >
            Back
          </Button>
        </Col>
        <Col className="text-center">
          <h6 className="text-uppercase text-muted mb-0">
            Step {activeStep} of 5
          </h6>
        </Col>
        <Col xs="auto">
          {typeProcess?.value == "integrate" ? (
            !(region?.value !== "IND") ? (
              <Button
                disabled={!isPanVerified || region?.value !== "IND"}
                size="lg"
                onClick={handleAdharAndPanContinue}
              >
                Continue
              </Button>
            ) : (
              <Button
                disabled={
                  (typeProcess == "" ? true : false) ||
                  (region == "" ? true : false)
                }
                size="lg"
                onClick={(e) => setActiveStep(activeStep + 1)}
              >
                Continue
              </Button>
            )
          ) : (
            <Button
              size="lg"
              disabled={typeProcess == "" ? true : false}
              onClick={() =>
                navigate(`/profile/identity/${type?.value}/particular`)
              }
            >
              Continue
            </Button>
          )}
        </Col>
      </Nav>
    </>
  );
  const stepThree = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 3
          </h6>
          <h1 className="mb-3">Setup With Government Data Sources</h1>
          <p className="mb-5 text-muted">
            Please click on the continue button to retrieve the data.
          </p>
        </Col>
      </Row>

      <div className="row">
        <div className="col-sm-8">
          {type?.value == "individual" ? (
            <Row className="justify-content-center">
              <Col md={4} className="text-center">
                <div
                  style={{
                    marginLeft: "100px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <img src={"/img/Primary.svg"} alt="SingPass Logo" />
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="justify-content-center">
              <Col md={4} className="text-center">
                <div
                  style={{
                    marginLeft: "70px",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    width: "190%",
                    padding: " 10px",
                    borderRadius: "15px",
                    cursor: "pointer",
                  }}
                >
                  <img src={"/img/corppassLogo.svg"} alt="CorPass Logo" />
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>

      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => {
              setActiveStep(activeStep - 1);
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col className="text-center">
          <h6 className="text-uppercase text-muted mb-0">
            Step {activeStep} of 3
          </h6>
        </Col>
        <Col xs="auto">
          <Button size="lg" onClick={handleClickContinue}>
            Continue
          </Button>
        </Col>
      </Nav>
    </>
  );

  const renderOptionModal = (
    <Modal
      size="xl"
      show={modalShowOption}
      onHide={handleCloseModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div style={{ border: "1px solid #577aa7b0" }}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Setup Your Identity</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid="sm">
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={8} className="py-1">
                {activeStep === 1 && stepOne}
                {activeStep === 2 && stepTwo}
                {activeStep === 3 && stepThree}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </div>
      {/* <Modal.Footer>
        <Button variant="danger" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer> */}
    </Modal>
  );

  const handleNavigateToIdentity = (e, link) => {
    handleShowModal();
    // navigate(link)
    setNavigateLink(link);
  };
  return (
    <Header className="mt-md-2" {...props}>
      {modalShowOption && renderOptionModal}
      {isLoader && (
        // <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
        <></>
      )}
      <Header.Body>
        {/* <Row className="align-items-center">
          <Col>
            <Header.Pretitle>OVERVIEW</Header.Pretitle>
            <Header.Title>Identity Portal</Header.Title>
          </Col>
        </Row> */}
        <Row className="align-items-center">
          <Col>
            <Header.Tabs className="nav-overflow">
              {history.pathname === "/profile/info" ? (
                <Nav.Item>
                  <Link to="/profile/info" passHref>
                    <Nav.Link
                      href="/profile/info"
                      active={history.pathname === "/profile/info"}
                    >
                      Info
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              ) : null}
              {history.pathname === "/profile/identities" ? (
                <Nav.Item>
                  <Link to="/profile/identities" passHref>
                    <Nav.Link
                      href="/profile/identities"
                      active={history.pathname === "/profile/identities"}
                    >
                      My Identities
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              ) : null}
            </Header.Tabs>
          </Col>
          {history.pathname === "/profile/identities" ? (
            <Col xs="auto">
              <Button onClick={handleShowModal} className="lift">
                Create New Identity
              </Button>
            </Col>
          ) : null}
        </Row>
      </Header.Body>
    </Header>
  );
}
