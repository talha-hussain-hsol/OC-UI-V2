import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Button, Dropdown } from "react-bootstrap";
import { Header } from "../components";
import {
  getParticularsDetailByIdentityIdAPI,
  getRequiredDocument,
  getSingleAccountDetailByIdAPI,
} from "../api/network/customerApi";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { MdOutlineArrowBack } from "react-icons/md";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import {
  isFaceEnabled,
  isVCIPEnabled,
  isRequiredDocumentEnabled,
} from "../helpers/getFundConfiguration";

export default function IdentityHeader({ ...props }) {
  const navigate = useNavigate();

  const history = useLocation();
  const params = useParams();

  useEffect(() => {
    console.log("sdasda navigate", history);
  }, [history]);

  const cancelTokenSource = axios.CancelToken.source();
  const [label, setLabel] = useState("");
  const [labelIdentity, setLabelIdentity] = useState("");
  const [identityData, setIdentityData] = useState("");
  const identityType = params?.type;

  const faceVerificationEnabled = isFaceEnabled(
    props?.fundConfigurationData,
    identityType
  );
  const vcipEnabled = isVCIPEnabled(props?.fundConfigurationData, identityType);
  const isDocumentEnabled = isRequiredDocumentEnabled(
    props?.fundConfigurationData,
    identityType
  );

  console.log(
    "checking data for configuration faceVerificationEnabled",
    faceVerificationEnabled
  );
  console.log("checking data for configuration vcipEnabled", vcipEnabled);
  // const [uppsalaStatus, setUppsalaStatus] = useState(false);
  // const [faceVerificationDocumentId, setFaceVerificationDocumentId] = useState(null);

  let path = params["*"];
  const pathSegments = path.split("/");
  console.log(pathSegments, "pathSegments pathSegments");
  console.log(params, "params params params params");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];

  useEffect(() => {
    if (identity_id) {
      getSpecificIdentity(identity_id);
      handleGetRequiredDocumentApi();
    }
  }, [identity_id]);
  useEffect(() => {
    if (account_id) {
      getSingleAccountDetailById(account_id);
    }
  }, [account_id]);
  useEffect(() => {
    console.log("props?.faceVerificationDocumentId", props);
  }, [props]);

  const handleGetRequiredDocumentApi = async () => {
    console.log(`checking`);
    if (account_id) {
      const response = await getRequiredDocument(
        account_id,
        cancelTokenSource.token
      );
      if (response.success == true) {
        if (response?.data?.required_documents_types) {
          for (let item of response?.data?.required_documents_types) {
            if (
              item?.key == "FACE_VERIFICATION" ||
              item?.category_key == "FACE_VERIFICATION"
            ) {
              props?.handleFaceVerification(item?.id);
            }
          }
        }
      } else {
      }
    } else {
      // setIsLoader(false);
      // setRequiredDocList([]);
    }
  };

  let identity_id_value = "";
  if (identity_id) {
    identity_id_value = "/" + identity_id;
  }
  if (account_id) {
    identity_id_value = identity_id_value + "/" + account_id;
  }
  console.log(identity_id_value, "identity_id_value");

  const getSpecificIdentity = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setLabelIdentity(response.data?.label);
      if (response?.data?.parentId != "0") {
        setIdentityData(response.data);
        setLabel(response.data?.label);
      } else {
        setLabel("");
      }
    } else {
    }
  };
  const getSingleAccountDetailById = async (account_id) => {
    const response = await getSingleAccountDetailByIdAPI(
      account_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      props?.handleUpsalla(
        response?.data?.account_detail?.fund?.meta?.tp?.uppsala?.status ==
          "false"
          ? false
          : true
      );
    } else {
    }
  };
  const handleBackClick = () => {
    navigate(`/subscription-list`);
  };

  return (
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <Row className="align-items-center">
          <Col>
            <Header.Pretitle>OVERVIEW</Header.Pretitle>
            <div style={{ display: "flex", alignItems: "center" }}>
              {label == "" && account_id && (
                <OverlayTrigger overlay={<Tooltip>go back</Tooltip>}>
                  <span
                    style={{ maxWidth: "1em", cursor: "pointer" }}
                    onClick={handleBackClick}
                    className="position-relative me-4"
                    {...props}
                  >
                    <MdOutlineArrowBack size="2em" />
                  </span>
                </OverlayTrigger>
              )}
              <Header.Title>{labelIdentity}</Header.Title>
            </div>
            <Header.Pretitle>
              {label != "" ? (
                <div>
                  <Link
                    to={`/profile/identity/corporate/overview/${
                      identityData?.parentId
                    }/${account_id ? account_id : ""}`}
                  >
                    <FeatherIcon icon="chevron-left" size="1em" />
                  </Link>
                  CRP ({label})
                </div>
              ) : null}
            </Header.Pretitle>
          </Col>
        </Row>
        {console.log(history.pathname, "history.pathname")}
        <Row className="align-items-center">
          <Col>
            <Header.Tabs
              className="nav-overflow"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ display: "flex", flexGrow: 1 }}>
                {!history?.state?.isCrp &&
                  (identity_id
                    ? account_id && (
                        <Nav.Item>
                          <Link
                            to={`/profile/identity/${params?.type}/overview${identity_id_value}`}
                          >
                            <Nav.Link
                              href={`/profile/identity/${params?.type}/overview${identity_id_value}`}
                              active={
                                history.pathname ===
                                `/profile/identity/${params?.type}/overview${identity_id_value}`
                              }
                            >
                              Overview
                            </Nav.Link>
                          </Link>
                        </Nav.Item>
                      )
                    : null)}

                <Nav.Item>
                  <Link
                    to={`/profile/identity/${params?.type}/particular${identity_id_value}`}
                    state={{ isCrp: history?.state?.isCrp }}
                  >
                    <Nav.Link
                      href={`/profile/identity/${params?.type}/particular${identity_id_value}`}
                      active={
                        history.pathname ===
                        `/profile/identity/${params?.type}/particular${identity_id_value}`
                      }
                    >
                      Particulars
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                {params?.type === "corporate" && identity_id ? (
                  <Nav.Item>
                    <Link
                      to={`/profile/identity/${params?.type}/organization-chart${identity_id_value}`}
                      state={{ isCrp: history?.state?.isCrp }}
                    >
                      <Nav.Link
                        href={`/profile/identity/${params?.type}/organization-chart${identity_id_value}`}
                        active={
                          history.pathname ===
                          `/profile/identity/${params?.type}/organization-chart${identity_id_value}`
                        }
                      >
                        Organization Chart
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : null}
                {identity_id && isDocumentEnabled ? (
                  <Nav.Item>
                    <Link
                      to={`/profile/identity/${params?.type}/documents${identity_id_value}`}
                      state={{ isCrp: history?.state?.isCrp }}
                    >
                      <Nav.Link
                        href={`/profile/identity/${params?.type}/documents${identity_id_value}`}
                        active={
                          history.pathname ===
                          `/profile/identity/${params?.type}/documents${identity_id_value}`
                        }
                      >
                        Documents
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : null}
                {!history?.state?.isCrp &&
                  (identity_id && faceVerificationEnabled ? (
                    <Nav.Item>
                      <Link
                        to={`/profile/identity/${params?.type}/face-verification${identity_id_value}`}
                      >
                        <Nav.Link
                          href={`/profile/identity/${params?.type}/face-verification${identity_id_value}`}
                          active={
                            history.pathname ===
                            `/profile/identity/${params?.type}/face-verification${identity_id_value}`
                          }
                        >
                          Face Verification
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                  ) : null)}
                {account_id &&
                  (identity_id && vcipEnabled ? (
                    <Nav.Item>
                      <Link
                        to={`/profile/identity/${params?.type}/vcip${identity_id_value}`}
                      >
                        <Nav.Link
                          href={`/profile/identity/${params?.type}/vcip${identity_id_value}`}
                          active={
                            history.pathname ===
                            `/profile/identity/${params?.type}/vcip${identity_id_value}`
                          }
                        >
                          Vcip
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                  ) : null)}

                {!history?.state?.isCrp &&
                  (identity_id && props?.uppsalaStatus ? (
                    <Nav.Item>
                      <Link
                        to={`/profile/identity/${params?.type}/wallets${identity_id_value}`}
                      >
                        <Nav.Link
                          href={`/profile/identity/${params?.type}/wallets${identity_id_value}`}
                          active={
                            history.pathname ===
                            `/profile/identity/${params?.type}/wallets${identity_id_value}`
                          }
                        >
                          Wallets
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                  ) : null)}
                {!history?.state?.isCrp &&
                  (identity_id && props?.isShowInvestmentTab ? (
                    <Nav.Item>
                      <Link
                        to={`/profile/identity/${params?.type}/investments${identity_id_value}`}
                      >
                        <Nav.Link
                          href={`/profile/identity/${params?.type}/investments${identity_id_value}`}
                          active={
                            history.pathname ===
                            `/profile/identity/${params?.type}/investments${identity_id_value}`
                          }
                        >
                          Application Documents
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                  ) : null)}
              </div>
              {/*remove summary for now and mov crps list to overview */}
              {/* {identity_id && account_id ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Nav.Item>
                    <Link to={`/profile/identity/${params?.type}/summary${identity_id_value}`}>
                      <Nav.Link href={`/profile/identity/${params?.type}/summary${identity_id_value}`} active={history.pathname === `/profile/identity/${params?.type}/summary${identity_id_value}`}>
                        Summary
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
              
                </div>
              ) : null} */}
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
                    {/* <Dropdown.Item href="/profile/identity/digital-wallet/summary">Digital Wallet</Dropdown.Item> */}
                    {/* <Dropdown.Item href="/profile/identity/bank-account/summary">Bank Account</Dropdown.Item> */}
                  </Dropdown.Menu>
                ) : (
                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile/identity/individual/particular">
                      Individual
                    </Dropdown.Item>
                    <Dropdown.Item href="/profile/identity/corporate/particular">
                      Corporate
                    </Dropdown.Item>
                    {/* <Dropdown.Item href="/profile/identity/digital-wallet/particular">Digital Wallet</Dropdown.Item> */}
                    {/* <Dropdown.Item href="/profile/identity/bank-account/particular">Bank Account</Dropdown.Item> */}
                  </Dropdown.Menu>
                )}
              </Dropdown>
            </Col>
          ) : null}
        </Row>
      </Header.Body>
    </Header>
  );
}
