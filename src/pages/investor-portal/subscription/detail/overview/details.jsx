import { Col, Container, Row, Nav, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";

import FundBox from "../../../../../widgets/fund-box";
import CustomerBox from "../../../../../widgets/customer-box";
import { MissingFields } from "../../../../../widgets";
import { getMissingDataOfIdentity } from "../../../../../helpers";
import FeatherIcon from "feather-icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  getParticularFieldsApi,
  handleSubmitScreeningApi,
  getFlatCPRListAPI,
} from "../../../../../api/network/customerApi";
// import LoadingSpinner from "../../..../../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../../components/ui/loader";
export default function accountDetail({
  accountData,
  handleAlert,
  setShowAlert,
  setAlertProps,
  getSingleAccountDetailById,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [crpListData, setCrpListData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderForCrp, setIsLoaderForCrp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  let path = params["*"];
  const pathSegments = path.split("/");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];

  const handleClickMissingParticulars = (e, data) => {
    console.log("vbnmjk,");
    navigate(
      `/profile/identity/${data?.identity?.type.toLowerCase()}/particular/${
        data?.identityId
      }/${data?.accountId}`
    );
  };
  const handleClickMissingParticularsForCrp = (e, data) => {
    navigate(
      `/profile/identity/${data?.type.toLowerCase()}/particular/${data?.id}/${
        params?.account_id
      }`,
      {
        state: { isCrp: true },
      }
    );
  };
  const handleClickMissingDocumentsForCrp = (e, data) => {
    navigate(
      `/profile/identity/${data?.type.toLowerCase()}/documents/${data?.id}/${
        params?.account_id
      }`,
      {
        state: { isCrp: true },
      }
    );
  };
  const handleClickMissingDocuments = (e, data) => {
    console.log("vbnmjk,", data);

    navigate(
      `/profile/identity/${data?.identity?.type.toLowerCase()}/documents/${
        data?.identityId
      }/${data?.accountId}`
    );
  };
  useEffect(() => {
    getParticularFields();
  }, []);
  useEffect(() => {
    if (identity_id) {
      setIsLoader(true);
      getCRPList();
    }
  }, [identity_id]);

  const getParticularFields = async () => {
    setIsLoader(true);
    let accountId = null;
    if (account_id) {
      accountId = account_id;
    }
    const response = await getParticularFieldsApi(
      accountId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      let array = [];
      // let array = [...response.data?.fields, ...response.data?.account_fields];

      if (accountId) {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
        ];
      } else {
        array = response.data?.fields;
      }
      setParticularFields(array);
    } else {
      setIsLoader(false);
    }
  };
  const handleSubmitScreening = (e) => {
    handleSubmitScreeningApiCall();
  };

  const getCRPList = async () => {
    setIsLoaderForCrp(true);
    console.log("identity id", params?.identity_id);
    const response = await getFlatCPRListAPI(
      identity_id,
      params?.account_id,
      cancelTokenSource.token
    );
    // setIsLoader(false);
    if (response.success == true) {
      console.log("identity id response", response);
      setIsLoaderForCrp(false);
      setCrpListData(response?.data);
    } else {
      setIsLoaderForCrp(false);
    }
  };

  const handleSubmitScreeningApiCall = async () => {
    setIsLoader(true);
    let accountId = null;
    if (account_id) {
      accountId = account_id;
    }
    const response = await handleSubmitScreeningApi(
      accountData?.attach_identities[0]?.identityId,
      accountData?.id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      getSingleAccountDetailById(accountId);
      setSubmitted(true);
      handleAlert({
        variant: "success",
        message: "Submit For Review Successfully",
        show: true,
        hideAuto: true,
      });
      setShowAlert(true);
    } else {
      setIsLoader(false);
    }
  };
  return (
    <div className="main-content">
      <Container fluid>
        {console.log(particularFields, "particularFields particularFields")}
        {/* {isLoader &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                        <Spinner animation="grow" />
                    </div>
                } */}
        {isLoader || isLoaderForCrp ? (
          // <LoadingSpinner animation="grow" custom={true} height="70vh" />
          <Loader />
        ) : (
          <Row>
            <Col xs={12} lg={12} xl={12}>
              <FundBox fundData={accountData?.fund} />
            </Col>

            {accountData?.fund?.meta?.config?.reference?.documents.length >
              0 && (
              <Col xs={12} lg={12} xl={12}>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className={"col-12 col-md-12"}>
                        <h3>Reference Documents</h3>
                        {accountData?.fund?.meta?.config?.reference
                          ?.documents &&
                          accountData?.fund?.meta?.config?.reference?.documents.map(
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
              </Col>
            )}
            <Col xs={12} lg={12} xl={12}>
              {accountData?.attach_identities &&
                accountData?.attach_identities.map((item, index) => (
                  <div className="card">
                    <div className="card-body">
                      <Row style={{ minHeight: "161px" }}>
                        <div
                          className="card"
                          style={{ backgroundColor: "#1f3958!important" }}
                        >
                          <div className="card-header">
                            <h4 className="card-header-title">
                              {params?.type == "corporate"
                                ? "Corporate"
                                : "Individual"}{" "}
                            </h4>
                          </div>
                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Col s xs={12} lg={6} xl={6}>
                              <CustomerBox customerData={item} />
                            </Col>

                            <Col xs={12} lg={6} xl={6}>
                              <div
                                style={{ minHeight: "161px" }}
                                className="card"
                              >
                                <div className="card-body">
                                  {getMissingDataOfIdentity(
                                    item?.identity,
                                    accountData?.fund,
                                    particularFields
                                  )?.missingIdentityFields.length > 0 ? (
                                    <div
                                      className="missing_required_fields_documents"
                                      style={{ marginBottom: "1em" }}
                                    >
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Please note: </span>We need a bit
                                        more information to complete this
                                        application.
                                      </p>
                                      <button
                                        className="btn btn-warning"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingParticulars(e, item)
                                        }
                                      >
                                        Incomplete Particulars
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="missing_required_fields_documents_success">
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Success! </span>You provided all
                                        necessary information.
                                      </p>
                                      <button
                                        className="btn btn-primary"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingParticulars(e, item)
                                        }
                                      >
                                        View Particulars
                                      </button>
                                    </div>
                                  )}

                                  {getMissingDataOfIdentity(
                                    item?.identity,
                                    accountData?.fund,
                                    particularFields
                                  )?.missingDocuments.length > 0 ? (
                                    <div className="missing_required_fields_documents">
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Please note: </span>We need some
                                        documents to be uploaded to complete
                                        this application.
                                      </p>
                                      <button
                                        className="btn btn-warning"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingDocuments(e, item)
                                        }
                                      >
                                        Incomplete documents
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="missing_required_fields_documents_success">
                                      <p
                                        className="text-muted"
                                        style={{ maxWidth: "60%" }}
                                      >
                                        <span>Success! </span>You have uploaded
                                        all required documents
                                      </p>
                                      <button
                                        className="btn btn-primary"
                                        style={{ fontSize: "12px" }}
                                        onClick={(e) =>
                                          handleClickMissingDocuments(e, item)
                                        }
                                      >
                                        View Documents
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* <MissingFields selectedIdentityData={item?.identity} fundData={accountData?.fund} /> */}
                            </Col>
                          </Row>
                        </div>
                        {params?.type == "corporate" ? (
                          <>
                            <Col xs={12} lg={12} xl={12}>
                              <div
                                className="card"
                                style={{ backgroundColor: "#1f3958" }}
                              >
                                <div className="card-header">
                                  <h4 className="card-header-title">
                                    Corporate Underlying Parties
                                  </h4>
                                </div>
                                <div className="card-body">
                                  {crpListData &&
                                    crpListData.map((item, index) => (
                                      <Row style={{ minHeight: "161px" }}>
                                        <Col s xs={12} lg={6} xl={6}>
                                          <CustomerBox
                                            customerData={item}
                                            isCrp={true}
                                            params={params}
                                          />
                                        </Col>

                                        <Col xs={12} lg={6} xl={6}>
                                          <div
                                            style={{ minHeight: "161px" }}
                                            className="card"
                                          >
                                            <div className="card-body">
                                              {getMissingDataOfIdentity(
                                                item,
                                                accountData?.fund,
                                                particularFields,
                                                true
                                              )?.missingIdentityFields.length >
                                              0 ? (
                                                <div
                                                  className="missing_required_fields_documents"
                                                  style={{
                                                    marginBottom: "1em",
                                                  }}
                                                >
                                                  <p
                                                    className="text-muted"
                                                    style={{ maxWidth: "60%" }}
                                                  >
                                                    <span>Please note: </span>We
                                                    need a bit more information
                                                    to complete this
                                                    application.
                                                  </p>
                                                  <button
                                                    className="btn btn-warning"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={(e) =>
                                                      handleClickMissingParticularsForCrp(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                  >
                                                    Incomplete Particulars
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="missing_required_fields_documents_success">
                                                  <p
                                                    className="text-muted"
                                                    style={{ maxWidth: "60%" }}
                                                  >
                                                    <span>Success! </span>You
                                                    provided all necessary
                                                    information.
                                                  </p>
                                                  <button
                                                    className="btn btn-primary"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={(e) =>
                                                      handleClickMissingParticularsForCrp(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                  >
                                                    View Particulars
                                                  </button>
                                                </div>
                                              )}
                                              {/* {getMissingDataOfIdentity(item, accountData?.fund, particularFields, true,item.documents,accountData?.fund.requiredDocuments)?.missingDocuments.length > 0 ? (
                                                <div className="missing_required_fields_documents" style={{ marginBottom: "1em" }}>
                                                  <p className="text-muted" style={{ maxWidth: "60%" }}>
                                                  <span>Warning! </span>We need some documents to be uploaded to complete this application.
                                                  </p>
                                                  <button className="btn btn-warning" style={{ fontSize: "12px" }} onClick={(e) => handleClickMissingDocumentsForCrp(e, item)}>
                                                    Click Here To Complete
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="missing_required_fields_documents_success">
                                                  <p className="text-muted" style={{ maxWidth: "60%" }}>
                                                    <span>Success! </span>You have Filled all required Documents.
                                                  </p>
                                                  <button className="btn btn-primary" style={{ fontSize: "12px" }} onClick={(e) => handleClickMissingDocumentsForCrp(e, item)}>
                                                 View Documents
                                                  </button>
                                                </div>
                                              )} */}
                                            </div>
                                          </div>

                                          {/* <MissingFields selectedIdentityData={item?.identity} fundData={accountData?.fund} /> */}
                                        </Col>
                                      </Row>
                                    ))}
                                </div>
                              </div>
                            </Col>
                          </>
                        ) : null}
                        {/* {getMissingDataOfIdentity(item?.identity, accountData?.fund, particularFields)?.missingIdentityFields.length == 0 && getMissingDataOfIdentity(item?.identity, accountData?.fund, particularFields)?.missingDocuments.length == 0 ? ( */}
                        {getMissingDataOfIdentity(
                          item?.identity,
                          accountData?.fund,
                          particularFields
                        )?.missingIdentityFields.length == 0 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              className="card bg-light border"
                              style={{ maxWidth: "80%" }}
                            >
                              <div className="card-body">
                                {accountData?.attach_identities[0]
                                  ?.applicationStatusId == "PENDING" ? (
                                  <h4 className="mb-2">
                                    <FeatherIcon
                                      color="orange"
                                      icon="alert-triangle"
                                    />{" "}
                                    Your account is submitted for Review.
                                  </h4>
                                ) : accountData?.attach_identities[0]
                                    ?.applicationStatusId == "REJECTED" ? (
                                  <h4 className="mb-2">
                                    <FeatherIcon
                                      icon="alert-triangle"
                                      color="red"
                                    />{" "}
                                    Your account is Rejected.
                                  </h4>
                                ) : accountData?.attach_identities[0]
                                    ?.applicationStatusId == "ACCEPTED" ? (
                                  <h4 className="mb-2">
                                    <FeatherIcon
                                      icon="alert-triangle"
                                      color="green"
                                    />{" "}
                                    Your account is Accepted.
                                  </h4>
                                ) : null}
                                {/* {(getMissingDataOfIdentity(item?.identity, accountData?.fund, particularFields)?.missingIdentityFields.length == 0 && getMissingDataOfIdentity(item?.identity, accountData?.fund, particularFields)?.missingDocuments.length == 0 && accountData?.attach_identities[0]?.applicationStatusId == "DRAFT" ) && */}
                                {getMissingDataOfIdentity(
                                  item?.identity,
                                  accountData?.fund,
                                  particularFields
                                )?.missingIdentityFields.length == 0 &&
                                  accountData?.attach_identities[0]
                                    ?.applicationStatusId == "DRAFT" && (
                                    <h4 className="mb-2">
                                      <FeatherIcon icon="alert-triangle" /> All
                                      document and information requirements have
                                      been met. Click “Submit for Review” to
                                      start our Know Your Customer (KYC)
                                      process.
                                    </h4>
                                  )}
                                {/* {submitted ? (
                                <h4 className="mb-2">
                                  <FeatherIcon icon="alert-triangle" /> Your account is submitted for Screening.
                                </h4>
                              ) : (
                                <h4 className="mb-2">
                                  <FeatherIcon icon="alert-triangle" /> Your requirements are completed.! Click "Submit for Review" to start the process.
                                </h4>
                              )} */}
                              </div>
                            </div>

                            <div>
                              {accountData?.attach_identities[0]
                                ?.applicationStatusId == "DRAFT" && (
                                <button
                                  disabled={submitted}
                                  className="btn btn-primary"
                                  onClick={(e) => {
                                    handleSubmitScreening(e);
                                  }}
                                >
                                  {submitted
                                    ? "Submitted"
                                    : "Submit For Review"}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                            }}
                          >
                            <div className="card bg-light border">
                              <div className="card-body">
                                <h4 className="mb-2">
                                  <p className="small  mb-0">
                                    {" "}
                                    <FeatherIcon icon="alert-triangle" /> To
                                    submit your profile for review, please fill
                                    in the required particulars and upload the
                                    necessary documents first
                                  </p>
                                </h4>
                              </div>
                            </div>
                          </div>
                        )}
                      </Row>
                    </div>
                  </div>
                ))}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
