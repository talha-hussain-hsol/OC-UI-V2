import FeatherIcon from "feather-icons-react";
import Select from "react-select";

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getFundForJoin,
  getIdentityList,
  postIdentityAttatchWithFund,
} from "../../../../api/network/customerApi";
import axios from "axios";
import { HiPlusCircle } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
// import LoadingSpinner from "../../..../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../components/ui/loader";
import EntityIcon from "./../../../../icons/entity-icon-small.svg";
var theme = localStorage.getItem("portal_theme");

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

export default function Wizard() {
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [fundCode, setFundCode] = useState("");
  const [selectedIdentity, setSelectedIdentity] = useState({ value: "" });
  const [selectedIdentityData, setSelectedIdentityData] = useState();
  const [selectedIdentityMessageShow, setSelectedIdentityMessageShow] =
    useState(false);

  const [identitiesData, setIdentitiesData] = useState([]);
  const [alertJoinFund, setAlertJoinFund] = useState(false);

  const [fundData, setFunData] = useState({});
  const [jointAccountIsEnabled, setJointAccountIsEnabled] = useState(false);
  const [addMoreDisabled, setAddMoreDisabled] = useState(false);
  const [emailFieldsForJointAccount, setEmailFieldsForJointAccount] = useState([
    "",
  ]);
  const [errorEmails, setErrorEmails] = useState([]);
  const [successAttatchMesssage, setSuccessAttatchMesssage] = useState(false);
  const [failedAttatchMesssage, setFailedAttatchMesssage] = useState(false);
  const [failedAttatchMesssageToShow, setFailedAttatchMesssageToShow] =
    useState("");
  const emailRefs = useRef([]);
  useEffect(() => {
    if (
      params?.identity_id &&
      (!fundData || Object.keys(fundData).length === 0)
    ) {
      handleGetIdentityList();
    }
  }, [fundData]);
  useEffect(() => {}, []);

  const handleAddEmailFieldsForJointAccount = () => {
    setEmailFieldsForJointAccount([...emailFieldsForJointAccount, ""]);
    setErrorEmails([...errorEmails, ""]);
    emailRefs.current.push(React.createRef());
  };

  useEffect(() => {
    if (
      errorEmails.indexOf("Invalid Email") !== -1 ||
      errorEmails.indexOf("Email already exists") !== -1
    ) {
      setAddMoreDisabled(true);
    } else {
      setAddMoreDisabled(false);
    }

    console.log(
      'errorEmails.indexOf("Invalid Email") !== -1',
      errorEmails.indexOf("Invalid Email") !== -1
    );

    console.log("checking emailRefs", emailRefs);
    console.log("checking errorEmails", errorEmails);
  }, [errorEmails]);
  useEffect(() => {
    console.log("checking addMoreDisabled", addMoreDisabled);
  }, [addMoreDisabled]);
  useEffect(() => {
    console.log("checking fundData", fundData);
  }, [fundData]);
  useEffect(() => {
    console.log("checking fundData identitiesData", identitiesData);
  }, [identitiesData]);

  const validateEmails = (email, index) => {
    let isValid = true;
    if (emailFieldsForJointAccount.indexOf(email) !== -1) {
      console.log(`${email} `);
      isValid = false;
      setErrorEmails((prevError) => {
        const newError = [...prevError];
        newError[index] = "Email already exists";
        return newError;
      });
    } else {
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        isValid = false;
        setErrorEmails((prevError) => {
          const newError = [...prevError];
          newError[index] = "Invalid Email";
          return newError;
        });
      } else {
        setErrorEmails((prevError) => {
          const newError = [...prevError];
          newError[index] = "";
          return newError;
        });
      }
    }
    return { invalid: isValid };
  };

  const handleEmailChange = (e, index) => {
    const email = e.target.value;
    const updatedEmailFields = [...emailFieldsForJointAccount];
    updatedEmailFields[index] = email;
    setEmailFieldsForJointAccount(updatedEmailFields);
    console.log(validateEmails(email, index));
    // console.log('first',e.target.value)x
    // const email = e.target.value;
    // if (validateEmails(email, index)) {
    //     const updatedEmailFields = [...emailFieldsForJointAccount];
    //     updatedEmailFields[index] = email;
    //     setEmailFieldsForJointAccount(updatedEmailFields);
    // }
  };

  const handleRemoveEmail = (index) => {
    console.log("index", index);
    const emailList = [...emailFieldsForJointAccount];
    console.log("emailList", emailList);
    emailList.splice(index, 1);
    console.log("emailList updated", emailList);
    setEmailFieldsForJointAccount(emailList);

    const emailErrorList = [...errorEmails];
    emailErrorList.splice(index, 1);
    setErrorEmails(emailErrorList);
    emailRefs.current.splice(index, 1);
  };

  // const handleEmailChange = (e, index) => {
  //   const updatedEmailFields = [...emailFieldsForJointAccount];
  //   console.log("emailFieldsForJointAccount", updatedEmailFields);
  //   updatedEmailFields[index] = e.target.value;
  //   setEmailFieldsForJointAccount(updatedEmailFields);
  // };

  const handleSubmitRequest = (e) => {
    postIdentityAttatchWithFundApi();
  };
  const handleCancel = () => {
    navigate("/subscription-list");
  };

  const postIdentityAttatchWithFundApi = async () => {
    setIsLoader(true);
    const data = {
      joint_account: jointAccountIsEnabled,
      fund_id: fundData?.named_id,
      share_holder_count:
        emailFieldsForJointAccount.length == 0
          ? 1
          : emailFieldsForJointAccount.length,
      joint_account_emails: jointAccountIsEnabled
        ? emailFieldsForJointAccount
        : [],
    };
    const response = await postIdentityAttatchWithFund(
      selectedIdentity.value,
      data,
      cancelTokenSource.token
    );
    console.log("checking response", response);
    if (response.success == true) {
      setIsLoader(false);
      setSuccessAttatchMesssage(true);
      let accountId = response?.data?.accountId;
      navigate(`/subscription/detail/overview/${accountId}`);
    } else {
      setIsLoader(false);
      setFailedAttatchMesssage(true);
      setFailedAttatchMesssageToShow(response?.system_message);
    }
  };
  useEffect(() => {
    if (activeStep == 3) {
      handleGetIdentityList();
    }
  }, [activeStep]);
  useEffect(() => {
    console.log(selectedIdentity, "selectedIdentity");
    console.log(selectedIdentity.value, "selectedIdentity.value");
    const selectedIdentityData = identitiesData.filter((item) => {
      return item.id == selectedIdentity.value;
    });
    console.log("selectedIdentityData", ...selectedIdentityData);
    setSelectedIdentityData(...selectedIdentityData);
  }, [selectedIdentity]);

  useEffect(() => {
    console.log("selectedIdentityData", selectedIdentityData);
    if (selectedIdentityData) {
      if (selectedIdentityData?.status == "active") {
        setSelectedIdentityMessageShow(false);
      } else {
        setSelectedIdentityMessageShow(true);
      }
    }
  }, [selectedIdentityData]);

  useEffect(() => {
    if (selectedIdentityMessageShow) {
    }

    console.log("", jointAccountIsEnabled);
  }, [selectedIdentityMessageShow]);

  const getFundForJoinApi = async () => {
    setIsLoader(true);

    const response = await getFundForJoin(fundCode, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setFunData(response?.data);

      setActiveStep(activeStep + 1);
    } else {
      setIsLoader(false);
      setAlertJoinFund(true);
    }
    console.log("response", response);
  };

  const handleGetIdentityList = async () => {
    console.log(`checking`);
    setIsLoader(true);

    const response = await getIdentityList(
      cancelTokenSource.token,
      fundData?.id
    );
    console.log("object 1", response);
    console.log("fundDaTA", fundData);
    if (response.success == true) {
      setIsLoader(false);
      const identities =
        fundData?.fund_setting?.account?.applicant?.corporate &&
        fundData?.fund_setting?.account?.applicant?.indivisual
          ? response?.data
          : fundData?.fund_setting?.account?.applicant?.indivisual
          ? response?.data?.filter((item) => item?.type == "INDIVIDUAL")
          : response?.data?.filter((item) => item?.type == "CORPORATE");
      setTimeout(function () {
        if (params?.identity_id) {
          selectedIdentity.value = params?.identity_id;
          console.log(params?.identity_id, "params?.identity_id");
          console.log(selectedIdentity, "selectedIdentity selectedIdentity");
          setSelectedIdentity(selectedIdentity);
        }
      }, 200);
      const selectedIdentityData = response?.data.filter((item) => {
        console.log(item, "item item item item");
        return item.id == params?.identity_id;
      });
      console.log("selectedIdentityData", ...selectedIdentityData);
      setSelectedIdentityData(...selectedIdentityData);

      setIdentitiesData(identities);
    } else {
      setIsLoader(false);
    }
  };

  const handleJointAccout = (event) => {
    setJointAccountIsEnabled(event.target.checked);
    if (event.target.checked == false) {
      setEmailFieldsForJointAccount([""]);
    }
  };

  const stepOne = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 5
          </h6>
          <h1 className="mb-3">Let's Start With The Basics.</h1>
          <p className="mb-5 text-muted">
            Please enter the account joining code which you would have received
            from the account owner.
          </p>
        </Col>
      </Row>
      {isLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          {/* <LoadingSpinner animation="grow" custom={true} height="36vh" />
           */}
           <Loader/>
        </div>
      ) : (
        <div className="form-group">
          <Form.Label>Enter the account code</Form.Label>
          <Form.Control
            type="text"
            value={fundCode}
            onChange={(event) => setFundCode(event.target.value)}
          />
        </div>
      )}

      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button variant="white" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
        </Col>
        <Col className="text-center">
          <h6 className="text-uppercase text-muted mb-0">
            Step {activeStep} of 5
          </h6>
        </Col>
        <Col xs="auto">
          <Button
            disabled={fundCode.length > 1 ? false : true}
            size="lg"
            onClick={() => getFundForJoinApi()}
          >
            Continue
          </Button>
        </Col>
      </Nav>
      {alertJoinFund ? (
        <Alert
          closeLabel
          style={{ marginTop: "30px" }}
          dismissible={true}
          onClose={() => setAlertJoinFund(false)}
          key="danger"
          variant="danger"
        >
          Fund Not Found
        </Alert>
      ) : null}
    </>
  );
  const stepTwo = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 5
          </h6>
          <h1 className="mb-3">Next, verify account details</h1>
          <p className="mb-5 text-muted">
            Please verify the account information before proceeding.
          </p>
        </Col>
      </Row>
      {fundData && <FundBox isStepForm={true} fundData={fundData} />}

      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => {
              setActiveStep(activeStep - 1);
              setAlertJoinFund(false);
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
          <Button
            size="lg"
            onClick={(e) => {
              params?.identity_id
                ? setActiveStep(activeStep + 2)
                : setActiveStep(activeStep + 1);
            }}
          >
            Continue
          </Button>
        </Col>
      </Nav>
    </>
  );
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
        (fundData?.fund_setting?.account?.applicant?.indivisual == "true" ||
          fundData?.fund_setting?.account?.applicant?.indivisual == true) &&
        (fundData?.fund_setting?.account?.applicant?.corporate == "true" ||
          fundData?.fund_setting?.account?.applicant?.corporate == true)
      ) {
        console.log(
          "in if fundData?.fund_setting?.account?.applicant",
          fundData?.fund_setting?.account?.applicant?.indivisual
        );
        console.log(
          "in if fundData?.fund_setting?.account?.applicant",
          fundData?.fund_setting?.account?.applicant?.corporate
        );
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
        (fundData?.fund_setting?.account?.applicant?.indivisual == "true" ||
          fundData?.fund_setting?.account?.applicant?.indivisual == true) &&
        item?.type === "INDIVIDUAL"
      ) {
        console.log(
          "in if setting?.account?.applicant?.indivisual && ",
          fundData?.fund_setting?.account?.applicant
        );

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
        (fundData?.fund_setting?.account?.applicant?.corporate == "true" ||
          fundData?.fund_setting?.account?.applicant?.corporate == true) &&
        item?.type === "CORPORATE"
      ) {
        console.log(
          "in if a?.fund_setting?.account?.applicant?.corporate && item",
          fundData?.fund_setting?.account?.applicant
        );
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

  if (options.length === 0) {
    options = [
      { label: <p disabled={true}>No options available</p>, value: null },
    ];
  }

  const customFilter = (option, searchText) => {
    console.log("option.data.label", option.data.label);
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

  const stepThree = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 5
          </h6>
          <h1 className="mb-3">Identity & Finance</h1>
          <p className="mb-5 text-muted">
            Attach an identity and bank account to application request
          </p>
        </Col>
      </Row>
      {isLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          {/* <LoadingSpinner animation="grow" custom={true} height="36vh" /> */}
          <Loader/>
        </div>
      ) : (
        <div className="row">
          <div className="col-sm-8">
            <div className="form-group">
              {identitiesData.length > 0 && (
                <label className="form-label">
                  Select the identity you would like to attach to this account.
                </label>
              )}
              {identitiesData.length > 0 ? (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="form-group" style={{ width: "90%" }}>
                    {console.log("options", options)}
                    <Select
                      placeholder="Select Identity"
                      isSearchable={true}
                      styles={customStyles}
                      filterOption={customFilter}
                      options={
                        options[0] != undefined && options[0] != "undefined"
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
                                  There is no Identity available to attached
                                  this fund
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
                    />
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <Link
                      style={{ height: "40px" }}
                      to="/profile/identities"
                      className="btn btn-info"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Add Identity"
                    >
                      <FeatherIcon icon="plus" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="form-group" style={{ width: "90%" }}>
                    <p className="mb-5">
                      there is no identity available,for this fund
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card bg-light border" style={{ height: "100%" }}>
              <div
                className="card-body"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <h4 className="mb-2">
                  <span class="text-warning">
                    <FeatherIcon
                      className={`text-warning`}
                      icon="alert-triangle"
                      size="15"
                    />
                  </span>
                  Warning
                </h4>

                <p className="small text-muted mb-0">
                  Once an investing account is created, you cannot change the
                  associated investing identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedIdentityMessageShow ? (
        <Alert
          closeLabel
          style={{ marginTop: "30px" }}
          dismissible={true}
          onClose={() => setSelectedIdentityMessageShow(false)}
          key="danger"
          variant="danger"
        >
          To proceed, Please choose an active identity.
        </Alert>
      ) : null}
      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => setActiveStep(activeStep - 1)}
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
          <Button
            disabled={
              selectedIdentity == undefined ||
              selectedIdentity == "" ||
              selectedIdentity?.value == null
                ? true
                : false || selectedIdentityData?.status === "active"
                ? false
                : true
            }
            size="lg"
            onClick={(e) => setActiveStep(activeStep + 1)}
          >
            Continue
          </Button>
        </Col>
      </Nav>
    </>
  );
  const stepFour = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 5
          </h6>
          <h1 className="mb-3">
            Specify the account type, you would like to setup.
          </h1>
          <p className="mb-5 text-muted">
            Please confirm if this account is a Single or Joint Account.{" "}
          </p>
        </Col>
      </Row>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-group">
            <label className="form-label mb-1">Joint Account</label>
            <small className="form-text text-muted">
              Enable, if this is a joint application
            </small>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                id="switchOne"
                type="checkbox"
                disabled={
                  fundData?.fund_setting?.account?.max_share_holder > 1
                    ? false
                    : true
                }
                checked={jointAccountIsEnabled}
                onChange={(event) => handleJointAccout(event)}
              />
              <label className="form-check-label" htmlFor="switchOne">
                Enable
              </label>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card bg-light border">
            <div className="card-body">
              <h4 className="mb-2">
                <span class="text-warning">
                  <FeatherIcon icon="alert-triangle" size="15" />
                </span>{" "}
                Warning
              </h4>

              <p className="small text-muted mb-0">
                Once an account is made. you cannot change the identity which is
                attached to it, and its type (i.e. Single Joint).
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-5" />
      {fundData?.fund_setting?.account?.max_share_holder <= 1 ? (
        <div className="mt-5">
          <p style={{ color: "orange" }}>
            Joint Account Disabled for the Fund{" "}
            <strong>{fundData?.name}</strong>
          </p>
        </div>
      ) : (
        !jointAccountIsEnabled && (
          <div className="mt-5">
            <p style={{ color: "orange" }}>
              please enable joint account to add emails
            </p>
          </div>
        )
      )}
      {jointAccountIsEnabled
        ? emailFieldsForJointAccount.map((email, index) => (
            <div key={index} className="form-group">
              <label className="form-label">
                Add partner emails to send them an invite
              </label>
              <Row
                style={{
                  justifyContent: "space-between",
                  alignItems: addMoreDisabled ? "start" : "end",
                }}
              >
                <Col>
                  <input
                    className="form-control"
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
                </Col>
                {emailFieldsForJointAccount.length !== 1 ? (
                  <Col xs="auto">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveEmail(index)}
                    >
                      <RiDeleteBin5Line style={{ fontSize: "16px" }} /> Delete
                    </Button>
                  </Col>
                ) : null}
                {emailFieldsForJointAccount.length - 1 == index &&
                emailFieldsForJointAccount.length <=
                  fundData?.fund_setting?.applicant?.max_share_holder ? (
                  <Col xs="auto">
                    <Button
                      disabled={addMoreDisabled}
                      size="sm"
                      onClick={handleAddEmailFieldsForJointAccount}
                    >
                      <HiPlusCircle style={{ fontSize: "16px" }} /> Add More
                    </Button>
                  </Col>
                ) : null}
              </Row>
            </div>
          ))
        : null}
      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => {
              params?.identity_id
                ? setActiveStep(activeStep - 2)
                : setActiveStep(activeStep - 1);
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
          <Button size="lg" onClick={(e) => setActiveStep(activeStep + 1)}>
            Continue
          </Button>
        </Col>
      </Nav>
    </>
  );
  const stepFive = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">Step 5 of 5</h6>
          <h1 className="mb-3">Summary</h1>
          <p className="mb-5 text-muted">Review your Information</p>
        </Col>
      </Row>
      {isLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          {/* <LoadingSpinner animation="grow" custom={true} height="36vh" /> */}
          <Loader/>
        </div>
      ) : (
        <>
          {fundData && <FundBox fundData={fundData} />}
          {/*emails and selected identity document */}
          {fundData?.reference_document?.documents.length > 0 && (
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className={"col-12 col-md-12"}>
                    <h3>Reference Documents</h3>
                    {fundData?.reference_document?.documents &&
                      fundData?.reference_document?.documents.map(
                        (item, index) => (
                          <div>
                            <a href={item.url} target="_blank">
                              {item?.title}
                            </a>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="card">
            <div className="card-body">
              <div className="row">
                {jointAccountIsEnabled && (
                  <div className="col-12 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <Row className="justify-content-left">
                          <Col className="text-center">
                            <h6 className="mb-4 text-uppercase text-muted">
                              Joint Account Emails
                            </h6>
                          </Col>
                        </Row>
                        <div className="row align-items-center">
                          <div className="col ms-n2">
                            {emailFieldsForJointAccount.length > 0
                              ? emailFieldsForJointAccount.map((item) => {
                                  return (
                                    <div className="row align-items-center">
                                      <small className="text-muted">
                                        <span class="text-success">
                                          <FeatherIcon icon="clock" size="15" />
                                        </span>
                                        {item}
                                      </small>
                                    </div>
                                  );
                                })
                              : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={
                    jointAccountIsEnabled
                      ? "col-12 col-md-6"
                      : "col-12 col-md-12"
                  }
                >
                  <div className="card">
                    <div className="card-body">
                      <Row className="justify-content-left">
                        <Col className="text-center">
                          <h6 className="mb-4 text-uppercase text-muted">
                            Shareholders
                          </h6>
                        </Col>
                      </Row>
                      {selectedIdentityData ? (
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <a href="#!" className="avatar avatar-lg">
                              {selectedIdentityData?.type == "INDIVIDUAL" ? (
                                <img
                                  src="/img/investor/default-avatar.png"
                                  alt="..."
                                  class="avatar-img rounded-circle"
                                />
                              ) : (
                                <EntityIcon
                                  className={"nodeIcon"}
                                  fontSize={"large"}
                                  color={"action"}
                                  style={{
                                    fill:
                                      theme == "dark" || theme == undefined
                                        ? "white"
                                        : "black",
                                  }}
                                />
                              )}
                            </a>
                          </div>
                          <div className="col ms-n2">
                            <h4 className="mb-1">
                              <p
                                style={{
                                  marginBottom: "0px",
                                  textDecoration: "capitalize",
                                }}
                              >
                                {selectedIdentityData?.label}
                              </p>
                            </h4>
                            <p className="small mb-0">
                              <span className="text-success"> </span>{" "}
                              {selectedIdentityData?.type}
                            </p>

                            <p className="small text-muted mb-1">
                              {selectedIdentityData?.type.toLowerCase() ==
                              "corporate"
                                ? "Country of Incorporation: "
                                : "Citizenship: "}
                              {selectedIdentityData?.meta?.data[
                                selectedIdentityData?.type.toLowerCase() +
                                  ".basic.country_of_residence_code"
                              ]?.value
                                ? selectedIdentityData?.meta?.data[
                                    selectedIdentityData?.type.toLowerCase() +
                                      ".basic.country_of_residence_code"
                                  ]?.value
                                : selectedIdentityData?.meta?.data[
                                    selectedIdentityData?.type.toLowerCase() +
                                      ".basic.incorporate_country_code"
                                  ]?.value}{" "}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <MissingFields selectedIdentityData={selectedIdentityData} fundData={fundData}/> */}

          {successAttatchMesssage ? (
            <Alert
              closeLabel
              style={{ marginTop: "30px" }}
              dismissible={true}
              onClose={() => setSuccessAttatchMesssage(false)}
              key="success"
              variant="success"
            >
              Identity Attached successfully
            </Alert>
          ) : null}
          {failedAttatchMesssage ? (
            <Alert
              closeLabel
              style={{ marginTop: "30px" }}
              dismissible={true}
              onClose={() => setFailedAttatchMesssage(false)}
              key="danger"
              variant="danger"
            >
              {failedAttatchMesssageToShow}
            </Alert>
          ) : null}
        </>
      )}

      <hr className="my-5" />
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => setActiveStep(activeStep - 1)}
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
          <Button
            size="lg"
            onClick={(e) => {
              handleSubmitRequest(e);
            }}
          >
            Create Account
          </Button>
        </Col>
      </Nav>
    </>
  );

  return (
    <div className="main-content">
      <Container fluid="lg">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8} className="py-6">
            {activeStep === 1 && stepOne}
            {activeStep === 2 && stepTwo}
            {activeStep === 3 && stepThree}
            {activeStep === 4 && stepFour}
            {activeStep === 5 && stepFive}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
