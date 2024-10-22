import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, Nav, Row, Button, Dropdown } from "react-bootstrap";
import { Header } from "../components";
import {
  getParticularFieldsApi,
  getRiskAssessmentTabStatusAPI,
} from "../api/network/administrationApi/administrationAPI";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { Breadcrumb } from "react-bootstrap";
import { checkPermissions, getMissingDataOfIdentity } from "../helpers";
// import LoadingSpinner from "../widgets/bootstrap-component/Spinner";
import Loader from "../components/ui/loader";
import {
  isFaceEnabled,
  isVCIPEnabled,
  isRequiredDocumentEnabled,
} from "../helpers/getFundConfiguration";
import { useSelector } from "react-redux";

export default function AdministrationIdentityHeader({ ...props }) {
  const fundConfig = useSelector((state) => state?.fundConfig);
  const accountDetail = useSelector((state) => state?.accountDetail);
  const identityDetail = useSelector((state) => state?.identityDetail);
  console.log("identityDetailidentityDetail", identityDetail);

  const history = useLocation();
  const navigate = useNavigate();
  console.log("historyhistory accountData", accountDetail);
  // console.log("historyhistory accountData", accountDetail?.attach_identities[0]?.applicationStatusId);

  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [label, setLabel] = useState("");
  const [identityData, setIdentityData] = useState("");
  const [complianceDataMissing, setCmplianceDataMissing] = useState([]);
  const [fundDetail, setFundDetail] = useState(fundConfig);
  //   const [accountDetail, setAccountData] = useState([]);
  const [particularFields, setParticularFields] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [missingData, setMissingData] = useState(null);
  // const [props?.riskAssessmentStatusTab, setRiskAssessmentStatusTab] = useState("");
  const [loaderHeader, setLoaderHeader] = useState(true);
  const [status, setStatus] = useState("");
  const identityType = params?.type;
  //   const [isInformationSaveFace, setIsInformationSaveface] = useState(false);
  const [isInformationSaveVcip, setIsInformationSavefaceVcip] = useState(false);
  const faceVerificationEnabled = isFaceEnabled(
    accountDetail?.fund,
    identityType
  );
  const vcipEnabled = isVCIPEnabled(accountDetail?.fund, identityType);
  const documentEnabled = isRequiredDocumentEnabled(
    accountDetail?.fund,
    identityType
  );
  const isShowManualTransaction =
    accountDetail?.fund?.meta?.config?.settings?.sections?.manual_transaction
      ?.enabled;

  const VIEW_TRANSACTION_DETAIL = checkPermissions("VIEW_TRANSACTION_DETAIL");
  const isManagement = window.location.href?.includes("management");

  let path = params["*"];
  const pathSegments = path.split("/");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];

  useEffect(() => {
    console.log(history.search, "history.search useEffect");
    const queryParams = new URLSearchParams(history.search);
    console.log(queryParams, "queryParams");
    if (queryParams) {
      const refresh_header_identity = queryParams.get(
        "refresh_header_identity"
      );
      console.log(refresh_header_identity, "refresh_header_identity");
      if (refresh_header_identity) {
        // props?.getSingleAccountDetailById(account_id);
        getParticularFields();
        getRiskAssessmentTabStatus();
      }
      console.log(history.pathname.split("?")[0], "history.search.split()[0]");
      navigate(history.pathname.split("?")[0]);
    }
  }, [history.search]);

  useEffect(() => {
    console.log("params in summmmmmmmm", params);

    if (identity_id) {
      getSpecificIdentity(identity_id);
      getRiskAssessmentTabStatus();
    }
  }, [identity_id, params]);
  useEffect(() => {
    if (accountDetail?.attach_identities?.length > 0) {
      setStatus(accountDetail?.attach_identities[0]?.applicationStatusId);
    }
    console.log("statusstatusstatusstatusstatusstatusstatus", status);
  }, [accountDetail]);
  useEffect(() => {
    if (accountDetail?.fund?.meta?.data) {
      const allFields = Object.entries(
        accountDetail?.fund?.meta?.data["c_f"]
      ).map(([key, value]) => ({ [key]: value }));

      const dataMissing = getMissingDataOfIdentity(
        props?.complianceDataFields && props?.complianceDataFields,
        {},
        allFields
      );
      console.log("dataMissing", dataMissing);
      setCmplianceDataMissing(dataMissing);
      props?.handleCompliance(dataMissing);
    }
  }, [accountDetail]);
  useEffect(() => {
    if (account_id) {
      getParticularFields();
    }
  }, []);
  useEffect(() => {
    console.log("accountDetail accountDetail", accountDetail);
  }, [accountDetail]);

  useEffect(() => {
    if (accountDetail?.attach_identities && particularFields) {
      setMissingData(
        getMissingDataOfIdentity(
          accountDetail?.attach_identities &&
            accountDetail?.attach_identities[0]?.identity,
          accountDetail?.fund,
          particularFields
        )
      );
      setLoaderHeader(false);
    }
  }, [accountDetail, particularFields]);

  const getParticularFields = async () => {
    setIsLoader(true);
    console.log("getParticularFieldsasdasd called");
    const response = await getParticularFieldsApi(
      account_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    console.log(response.data, "response response response");
    if (response.success == true) {
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      let array = [];
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      if (params?.account_id) {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
        ];
      } else {
        array = response.data?.fields;
      }
      console.log(array, "array array array array getParticularFields");
      setParticularFields(array);
    } else {
    }
  };
  const getRiskAssessmentTabStatus = async () => {
    setIsLoader(true);
    console.log("getRiskAssessmentTabStatusAPI called");
    const response = await getRiskAssessmentTabStatusAPI(
      params?.fund_id,
      identity_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      // setRiskAssessmentStatusTab(response?.data?.riskTab);
      props?.handleSetRiskAssessmentTab(response?.data?.riskTab);
    } else {
    }
  };
  const [entityLogo, setEntityLogo] = useState(
    localStorage.getItem("entity_logo")
  );
  let identity_id_value = "";
  if (identity_id) {
    identity_id_value = "/" + identity_id;
  }
  if (account_id) {
    identity_id_value = identity_id_value + "/" + account_id;
  }
  const getSpecificIdentity = (identity_id) => {
    try {
      console.log("Fetching details for identity ID:", identity_id);

      const response = identityDetail;

      if (!response) {
        console.error("No identity detail available.");
        return;
      }

      if (response.success) {
        props?.handleDataFromCustomerIdentity(response.data);
        console.log("Identity details fetched successfully:", response);

        if (response.data?.parentId === "0") {
          props?.setHandleRiskStatusObject([]);
          setLabel("");
        } else {
          setIdentityData(response.data);

          // Find the risk assessment that matches the fundId
          const matchedRiskAssessment = response.data?.riskAccessment?.find(
            (risk) => risk.fundId === parseInt(params?.fund_id, 10)
          );

          // Set the risk status object if a match is found
          if (matchedRiskAssessment) {
            props?.setHandleRiskStatusObject(
              matchedRiskAssessment?.approvalStatus
            );
          }

          setLabel(response.data?.label);
        }
      } else {
        console.error(
          "Failed to fetch identity details:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching identity details:",
        error
      );
    }
  };

  const handleRedirectToScreening = () => {
    navigate(
      `/${params?.fund_id}/kyc/account/identity/${params?.type}/screening/${identity_id}/${account_id}`
    );
  };
  const handleRedirectToRiskAssessment = () => {
    navigate(
      `/${params?.fund_id}/kyc/account/identity/${params?.type}/risk-assessment/${identity_id}/${account_id}`
    );
  };
  const handleRedirectToCompliance = () => {
    navigate(
      `/${params?.fund_id}/kyc/account/identity/${params?.type}/compliance/${identity_id}/${account_id}`
    );
  };

  const handleCheckPermissionScreen = checkPermissions("CUSTOMER_SCREEN");
  const handleCheckPermissionRisk = checkPermissions("RISK_MATRIX_READ");

  return (
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <Row className="align-items-center">
          <div className="col-auto">
            <div className="avatar avatar-md">
              {fundDetail?.fund_logo_url && (
                <img
                  src={fundDetail?.fund_logo_url}
                  alt="..."
                  className="avatar-img rounded"
                />
              )}
            </div>
          </div>
          <Col>
            <Header.Pretitle>
              {props?.isManager ? "Manager" : "COMPLIANCE"} PORTAL
            </Header.Pretitle>
            <Header.Title>{fundDetail?.name}</Header.Title>
            {/* <p style={{ marginBottom: '0px', fontWeight: 500, fontSize: '12px' }}>{props?.pageType}</p> */}

            <Header.Pretitle>
              {label != "" ? (
                <div onClick={() => props?.handleSetRiskAssessmentTab([])}>
                  <Link
                    to={`/${
                      params?.fund_id
                    }/kyc/account/identity/corporate/summary/${
                      identityData?.parentId
                    }/${account_id ? account_id : ""}`}
                  >
                    <FeatherIcon icon="chevron-left" size="1em" />
                  </Link>
                  CRP ({label})
                </div>
              ) : null}
            </Header.Pretitle>
            {/* <Link to={`/${params?.fund_id}/kyc/account/list`}>
                            <FeatherIcon
                                icon="chevron-left"
                                size="2em"
                            />
                            Account List
                        </Link> */}
          </Col>
          <Col xs="auto">
            <h4 class="card-header-title">
              <img
                src={entityLogo}
                style={{
                  width: "8em",
                  maxHeight: "50px",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
                alt=""
                class="rounded"
              />
              {/* <img src="https://storage.googleapis.com/ascentfs-media-public/public-data/organizations/ascent-fs/logo/ascent-fs-logo.png" style={{ maxHeight: '50px', textAlign: 'left', marginLeft: '10px' }} alt="" class="rounded" /> */}
            </h4>
          </Col>
        </Row>
        <Row
          style={{
            borderTop: "1px solid #1e3a5c",
            marginTop: "15px",
            borderBottom: "1px solid #1e3a5c",
            padding: "5px 0px",
          }}
        >
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item to="#!">
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
              <FeatherIcon icon="chevron-right" size="1em" />
              <Breadcrumb.Item href="#!">
                <Link to={`/${params?.fund_id}/kyc/account/list`}>
                  Account List
                </Link>
              </Breadcrumb.Item>
              <FeatherIcon icon="chevron-right" size="1em" />
              <Breadcrumb.Item active>
                {history.pathname.indexOf("summary") > -1
                  ? "Summary"
                  : history.pathname.indexOf("particular") > -1
                  ? "Particulars"
                  : history.pathname.indexOf("organization-chart") > -1
                  ? "Organization Chart"
                  : history.pathname.indexOf("documents") > -1
                  ? "KYC Documents"
                  : history.pathname.indexOf("screening") > -1
                  ? "Screening"
                  : history.pathname.indexOf("compliance") > -1
                  ? "Compliance"
                  : history.pathname.indexOf("risk-assessment") > -1
                  ? "Risk Assessment"
                  : history.pathname.indexOf("subscriptions") > -1
                  ? "Subscriptions"
                  : history.pathname.indexOf("wallets") > -1
                  ? "Wallets"
                  : "Summary"}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        {loaderHeader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2em",
            }}
          >
            {/* <LoadingSpinner custom={true} height={"5vh"} /> */}
            <Loader/>
          </div>
        ) : (
          <Row className="align-items-center">
            <Col>
              <Header.Tabs className="nav-overflow">
                <Nav.Item>
                  <Link
                    to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/summary/${identity_id}/${account_id}`}
                  >
                    <Nav.Link
                      href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/summary/${identity_id}/${account_id}`}
                      active={
                        history.pathname.indexOf("summary") > -1 ? true : false
                      }
                    >
                      Summary
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/particular/${identity_id}/${account_id}`}
                  >
                    <Nav.Link
                      style={{
                        color:
                          missingData?.missingIdentityFields?.length > 0
                            ? "orange"
                            : "",
                      }}
                      href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/particular/${identity_id}/${account_id}`}
                      active={
                        history.pathname.indexOf("particular") > -1
                          ? true
                          : false
                      }
                    >
                      Particulars
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                {params?.type == "corporate" && identity_id ? (
                  <Nav.Item>
                    <Link
                      to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/organization-chart/${identity_id}/${account_id}`}
                    >
                      <Nav.Link
                        href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/organization-chart/${identity_id}/${account_id}`}
                        active={
                          history.pathname.indexOf("organization-chart") > -1
                            ? true
                            : false
                        }
                      >
                        Organization Chart
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : null}
                {documentEnabled && (
                  <Nav.Item>
                    <Link
                      to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/documents/${identity_id}/${account_id}`}
                    >
                      <Nav.Link
                        // style={{ color: missingData?.missingDocuments?.length > 0 ? "orange" : "" }}
                        href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/documents/${identity_id}/${account_id}`}
                        active={
                          history.pathname.indexOf("documents") > -1
                            ? true
                            : false
                        }
                      >
                        KYC Documents
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                )}

                {accountDetail?.fund?.meta?.config?.settings?.account?.applicant
                  ?.identity?.wallet?.enabled === true ||
                accountDetail?.fund?.meta?.config?.settings?.account?.applicant
                  ?.identity?.wallet?.enabled === "true" ||
                accountDetail?.fund?.meta?.config?.settings?.account?.applicant
                  ?.identity?.bank?.enabled === true ||
                accountDetail?.fund?.meta?.config?.settings?.account?.applicant
                  ?.identity?.bank?.enabled === "true" ? (
                  <Nav.Item>
                    <Link
                      to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/wallets/${identity_id}/${account_id}`}
                    >
                      <Nav.Link
                        href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/wallets/${identity_id}/${account_id}`}
                        active={
                          history.pathname.indexOf("wallets") > -1
                            ? true
                            : false
                        }
                      >
                        Banks/Wallets
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : null}
                {faceVerificationEnabled ? (
                  <Nav.Item>
                    <Link
                      to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/face-verification/${identity_id}/${account_id}`}
                    >
                      <Nav.Link
                        style={{
                          color: props?.isInformationSaveFace ? "" : "orange",
                        }}
                        href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/face-verification/${identity_id}/${account_id}`}
                        active={
                          history.pathname.indexOf("face-verification") > -1
                            ? true
                            : false
                        }
                      >
                        Face Verification
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : null}
                {vcipEnabled ? (
                  <Nav.Item>
                    <Link
                      to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/vcip/${identity_id}/${account_id}`}
                    >
                      <Nav.Link
                        style={{
                          color: props?.isInformationSaveVcip ? "" : "orange",
                        }}
                        href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/vcip/${identity_id}/${account_id}`}
                        active={
                          history.pathname.indexOf("vcip") > -1 ? true : false
                        }
                      >
                        VCIP
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : null}
                {!(status === "DRAFT") && handleCheckPermissionScreen && (
                  <Nav.Item>
                    <Link
                      // disabled={missingData?.missingDocuments?.length > 0 || missingData?.missingIdentityFields?.length > 0}
                      // style={{ cursor: missingData?.missingDocuments?.length > 0 || missingData?.missingIdentityFields?.length > 0 ? "not-allowed" : "" }}
                      // className={ missingData?.missingDocuments?.length > 0 || missingData?.missingIdentityFields?.length > 0 ? "disabled-link" : "" }
                      onClick={(e) => {
                        handleRedirectToScreening(e);
                      }}
                      to={"#"}
                    >
                      <Nav.Link
                        style={{
                          color: !props?.riskAssessmentStatusTab
                            ? "orange"
                            : "",
                        }}
                        // disabled={missingData?.missingDocuments?.length > 0 || missingData?.missingIdentityFields?.length > 0}
                        active={
                          history.pathname.indexOf("screening") > -1
                            ? true
                            : false
                        }
                      >
                        Screening
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                )}
                {!(status === "DRAFT") && (
                  <Nav.Item>
                    <Link
                      onClick={(e) => {
                        handleRedirectToCompliance(e);
                      }}
                      to={""}
                    >
                      <Nav.Link
                        style={{
                          color:
                            complianceDataMissing?.missingIdentityFields
                              .length > 0
                              ? "orange"
                              : "",
                        }}
                        active={
                          history.pathname.indexOf("compliance") > -1
                            ? true
                            : false
                        }
                      >
                        Compliance
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                )}
                {console.log(
                  complianceDataMissing?.missingIdentityFields,
                  "complianceDataMissing?.missingIdentityFields"
                )}
                {console.log(
                  props?.riskAssessmentStatusTab,
                  "props?.riskAssessmentStatusTab"
                )}
                {!(status === "DRAFT") && handleCheckPermissionRisk && (
                  <Nav.Item>
                    <Link
                      disabled={
                        props?.riskAssessmentStatusTab === false ||
                        complianceDataMissing?.missingIdentityFields.length > 0
                      }
                      style={{
                        cursor:
                          props?.riskAssessmentStatusTab === false ||
                          complianceDataMissing?.missingIdentityFields.length >
                            0
                            ? "not-allowed"
                            : "",
                      }}
                      className={
                        props?.riskAssessmentStatusTab === false ||
                        complianceDataMissing?.missingIdentityFields.length > 0
                          ? "disabled-link"
                          : ""
                      }
                      onClick={(e) => {
                        handleRedirectToRiskAssessment(e);
                      }}
                      to={""}
                    >
                      <Nav.Link
                        style={{
                          color:
                            props?.riskAssessmentStatusTab === false ||
                            complianceDataMissing?.missingIdentityFields
                              .length > 0
                              ? "orange"
                              : "",
                          cursor:
                            props?.riskAssessmentStatusTab === false ||
                            complianceDataMissing?.missingIdentityFields
                              .length > 0
                              ? "not-allowed"
                              : "",
                        }}
                        active={
                          history.pathname.indexOf("risk-assessment") > -1
                            ? true
                            : false
                        }
                      >
                        Risk Assessments
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                )}
                {(accountDetail?.fund?.meta?.config?.settings?.account
                  ?.subscription?.status === true ||
                  accountDetail?.fund?.meta?.config?.settings?.account
                    ?.subscription?.status === "true") && (
                  <Nav.Item>
                    <Link
                      to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/subscriptions/${identity_id}/${account_id}`}
                    >
                      <Nav.Link
                        href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/subscriptions/${identity_id}/${account_id}`}
                        active={
                          history.pathname.indexOf("subscriptions") > -1
                            ? true
                            : false
                        }
                      >
                        Subscriptions
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                )}

                {isShowManualTransaction &&
                  (isManagement ? VIEW_TRANSACTION_DETAIL : true) && (
                    <Nav.Item>
                      <Link
                        to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/transactions/${identity_id}/${account_id}`}
                      >
                        <Nav.Link
                          href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/transactions/${identity_id}/${account_id}`}
                          active={
                            history.pathname.indexOf("transactions") > -1
                              ? true
                              : false
                          }
                        >
                          Transaction Details
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                  )}

                {/* <Nav.Item>
                                <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/report/${identity_id}/${account_id}`}>
                                    <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/report/${identity_id}/${account_id}`} active={history.pathname.indexOf("report") > -1 ? true : false}>
                                        Report
                                    </Nav.Link>
                                </Link>
                            </Nav.Item> */}
              </Header.Tabs>
            </Col>
            {history.pathname === "/profile/identities" ? (
              <Col xs="auto">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="span"
                    className="dropdown-ellipses"
                    role="button"
                  >
                    <Button className="lift">Create New Identity</Button>
                  </Dropdown.Toggle>
                  {console.log(identity_id, "identity_id")}
                  {identity_id ? (
                    <Dropdown.Menu>
                      <Dropdown.Item href="/profile/identity/individual/summary">
                        Individual
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile/identity/corporate/summary">
                        Corporate
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile/identity/digital-wallet/summary">
                        Digital Wallet
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile/identity/bank-account/summary">
                        Bank Account
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  ) : (
                    <Dropdown.Menu>
                      <Dropdown.Item href="/profile/identity/individual/particular">
                        Individual
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile/identity/corporate/particular">
                        Corporate
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile/identity/digital-wallet/particular">
                        Digital Wallet
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile/identity/bank-account/particular">
                        Bank Account
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </Col>
            ) : null}
          </Row>
        )}
      </Header.Body>
    </Header>
  );
}
