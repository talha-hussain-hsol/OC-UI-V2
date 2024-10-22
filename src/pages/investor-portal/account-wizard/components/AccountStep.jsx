import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Alert,
  Modal,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFundForJoin,
  getIdentityList,
} from "../../../../api/network/customerApi";
import axios from "axios";
import { HiUserAdd } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { validateEmails } from "../../../../utils/validation/email-validation";
// import LoadingSpinner from "../../..../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../components/ui/loader";
import NewIdentitySection from "./NewIdentitySection";
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
          marginLeft: "10px",
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

export default function AccountStep(props) {
  console.log(props, "props props props props AccountStep");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
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
    <div className="main-content">
      <Container fluid="lg">
        <Row className="justify-content-center">
          <Col xs={12} md={12} lg={12} xl={12} className="text-center">
            <h1 className="mb-3">Let's Start With The Basics.</h1>
            <p className="mb-5 text-muted">{descriptionText}</p>
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
            <Loader />
          </div>
        ) : (
          <>
            {!fundData && (
              <div className="form-group">
                {/* <Form.Label>Enter the account code</Form.Label> */}

                <div className="d-flex ">
                  <Form.Control
                    placeholder="Enter The Account Code"
                    className="fund-search-input"
                    type="text"
                    value={fundCode}
                    onChange={(event) => setFundCode(event.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    disabled={fundCode?.length > 1 ? false : true}
                    onClick={() => getFundForJoinApi()}
                    className="btn-search-fund btn btn-success"
                  >
                    <HiSearch size="20px" />
                  </button>
                </div>
              </div>
            )}
            {fundData && (
              <>
                <Card>
                  <Card.Body>
                    {/* <div className="edit-button-fund-box">
                                            <p onClick={() => { setFundData(null), setSelectedIdentity({ value: "" }) }}>Edit</p>
                                        </div> */}
                    <Row>
                      {fundData?.fund_setting?.display?.fund_info === true ||
                      fundData?.fund_setting?.display?.fund_info == "true" ? (
                        <Col xs={6} lg={4} xl={4} className="d-flex">
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <img
                              className="fund-logo"
                              src={
                                fundData?.logoBucketKey
                                  ? fundData?.logoBucketKey
                                  : fundData?.fund_logo_url
                              }
                            />
                            <span className="fund-name-box">
                              {fundData?.name}
                            </span>
                          </div>
                        </Col>
                      ) : (
                        <Col
                          xs={12}
                          lg={12}
                          xl={12}
                          className="d-flex justify-content-center"
                        >
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <img
                              className="fund-logo"
                              src={
                                fundData?.logoBucketKey
                                  ? fundData?.logoBucketKey
                                  : fundData?.fund_logo_url
                              }
                            />
                            <span className="fund-name-box">
                              {fundData?.name}
                            </span>
                          </div>
                        </Col>
                      )}
                      {(fundData?.fund_setting?.display?.fund_info === true ||
                        fundData?.fund_setting?.display?.fund_info ==
                          "true") && (
                        <>
                          <Col xs={6} lg={4} xl={4}>
                            <>
                              <div>
                                <small className="fund_info_small">
                                  <span class="text-success">
                                    <FeatherIcon
                                      className={`text-success`}
                                      icon="check-circle"
                                      color="green"
                                      size="15"
                                    />
                                  </span>{" "}
                                  Fund's KYC:{" "}
                                  {fundData?.fund_setting?.kyb?.status
                                    ? fundData?.fund_setting?.kyb?.status
                                    : fundData?.meta?.config?.kyb?.status}
                                </small>
                              </div>
                              <div>
                                <small className="text-muted fund_info_small">
                                  <span class="text-success">
                                    <FeatherIcon
                                      className={`text-success`}
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
                          </Col>
                          <Col xs={6} lg={4} xl={4}>
                            <>
                              <div>
                                <small className="fund_info_small">
                                  <FeatherIcon
                                    className={`text-success`}
                                    icon="clock"
                                    color="green"
                                    size="15"
                                  />{" "}
                                  Dealing Cycle:{" "}
                                  {fundData?.fund_setting?.dealing?.type?.end
                                    ? fundData?.fund_setting?.dealing?.type?.end
                                    : fundData?.fund_setting?.dealing?.type
                                        ?.end}
                                </small>
                              </div>
                              {fundData?.fund_setting?.account?.applicant?.asset
                                ?.digital?.status && (
                                <div>
                                  <small className="text-muted fund_info_small">
                                    <span class="text-success">
                                      <FeatherIcon
                                        className={`text-success`}
                                        icon="check-circle"
                                        color="green"
                                        size="15"
                                      />
                                    </span>{" "}
                                    Digital Fund:
                                    {fundData?.fund_setting?.account?.applicant
                                      ?.asset?.digital?.status
                                      ? fundData?.fund_setting?.account
                                          ?.applicant?.asset?.digital?.status
                                        ? "Active"
                                        : "Not Active"
                                      : fundData?.meta?.config?.settings
                                          ?.account?.applicant?.asset?.digital
                                          ?.status
                                      ? "Active"
                                      : "Not Active"}
                                  </small>
                                </div>
                              )}
                            </>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
                {fundData?.description &&
                  typeof fundData?.description === "string" &&
                  fundData?.description.trim()?.length > 0 && (
                    <Card>
                      <Card.Header>
                        <h4 className="card-header-title">
                          Account Description
                        </h4>
                      </Card.Header>
                      <Card.Body>
                        {fundData?.description && (
                          <p>{fundData?.description}</p>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                {fundData?.reference_document?.documents?.length > 0 && (
                  <Card>
                    <Card.Header>
                      <h4 className="card-header-title">Reference Documents</h4>
                      <Button
                        onClick={toggleCollapse}
                        variant="link"
                        className="btn-collapse"
                      >
                        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                      </Button>
                    </Card.Header>
                    {!isCollapsed && (
                      <Card.Body>
                        {fundData?.reference_document?.documents &&
                          fundData?.reference_document?.documents.map(
                            (item, index) => (
                              <Card>
                                <Card.Body>
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
                                </Card.Body>
                              </Card>
                            )
                          )}
                      </Card.Body>
                    )}
                  </Card>
                )}

                <hr className="my-5" />
                {props?.isAcceptedTermsAndCondition ? (
                  !isNewIdentity && (
                    <Row className="justify-content-center">
                      <Col xs={12} md={12} lg={12} xl={12}>
                        {shouldShowSelect && (
                          <Form.Label>
                            Select the identity you would like to attach this
                            account
                          </Form.Label>
                        )}
                        <div className="d-flex">
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
                                <Select
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
                                              There is no Identity available to
                                              attached this fund
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
                              <OverlayTrigger
                                overlay={<Tooltip>Create New Identity</Tooltip>}
                              >
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
                              </OverlayTrigger>
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
                            <OverlayTrigger
                              overlay={<Tooltip>Create New Identity</Tooltip>}
                            >
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
                            </OverlayTrigger>
                          </div>
                        )}
                      </Col>
                    </Row>
                  )
                ) : (
                  <Card>
                    <Card.Header>
                      <h4 className="card-header-title">
                        Terms and Conditions
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      {!fundData?.config?.reference?.customizeTC &&
                        fundData?.reference_document?.term_documents &&
                        fundData?.reference_document?.term_documents.map(
                          (item, index) => (
                            <Card>
                              <Card.Body>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>
                                    <p className="mb-0">{item?.title}</p>
                                    <p className="mb-0">{item?.description}</p>
                                  </div>
                                  <div>
                                    <Button
                                      onClick={(e) =>
                                        handleClickReferenceDocument(item?.url)
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
                              </Card.Body>
                            </Card>
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
                    </Card.Body>
                  </Card>
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
      </Container>
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
            solicitation of an offer to buy any investment(s) managed or advised
            on by First Degree.
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
              , and that you are aware of the reduced protections being accorded
              to you by being treated as an Accredited or Institutional Investor
            </li>
            <li>
              No person receiving a copy of the offering documents including any
              application forms and subscription agreements used herein to
              subscribe for Participating Shares (the "Subscription Form") in
              any jurisdiction may treat the same as constituting an invitation
              to him or her, unless in the relevant jurisdiction such an
              invitation could lawfully be made to him without compliance with
              any registration or other legal requirements or where such
              requirements have been complied with.
            </li>
            <li>
              First Degree makes no representations or warranties whatsoever
              about any of the content of this website or about content of any
              other website which you may access by hypertext link through this
              website. When you access any other website by means of a link from
              this website, you should understand that your access to that other
              website is independent of First Degree and First Degree has no
              control over the content of the website, nor does First Degree in
              any way endorse or approve the content of that website.
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
  );
}
