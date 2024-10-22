import { Col, Container, Row, Nav, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { getMissingDataOfIdentity } from "../../../../helpers";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import {
  getSingleAccountDetailByIdAPI,
  getParticularFieldsApi,
  getFlatCPRListAPI,
  getParticularsDetailByIdentityIdAPI,
  getIdentityDocument,
  getRequiredDocumentCRP,
} from "../../../../api/network/customerApi";
// import SpinnerWithBackDrop from "../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../components/ui/loader";
import { AiOutlineConsoleSql } from "react-icons/ai";

export default function summary() {
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [particularFields, setParticularFields] = useState([]);
  const [crpListData, setCrpListData] = useState([]);
  const [isCrp, setIsCrp] = useState(false);
  const [identityData, setIdentityData] = useState([]);
  const [crpIdentityUploadDocList, setCrpIdentityUploadDocList] = useState([]);
  const [requiredDocumentList, setRequiredDocumentList] = useState([]);
  useEffect(() => {
    if (params?.account_id) {
      // getSingleAccountDetailById(params?.account_id);
      // getParticularFields();
    }
  }, []);
  useEffect(() => {
    if (params?.identity_id) {
      setIsLoader(true);
      getCRPList();
      getUploadDocument(params?.identity_id);
      getSingleAccountDetailById(params?.account_id);
      getParticularFields();
      getRequiredDocument(params?.account_id, params?.identity_id);
    }
  }, [params?.identity_id]);
  useEffect(() => {
    console.log("params?.accountId", params);
  }, [params]);
  console.log("accountData");
  const getUploadDocument = async (identity_id) => {
    console.log(`checking getUploadDocument`);
    // setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token
    );
    console.log("object 1", response);
    if (response.success == true) {
      // setIsLoader(false);
      console.log(
        Object.keys(response?.data?.IdentityDocuments),
        "Object.keys(response?.data?.IdentityDocuments)"
      );
      setCrpIdentityUploadDocList(
        response?.data?.IdentityDocuments
          ? Object.keys(response?.data?.IdentityDocuments)
          : []
      );
    } else {
      // setIsLoader(false);
    }
  };
  const getRequiredDocument = async (account_id, identity_id) => {
    console.log(`checking getUploadDocument`);
    // setIsLoader(true);

    const response = await getRequiredDocumentCRP(
      account_id,
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      let documentsRequiredCRP = [];
      if (response?.data?.required_documents_types.length > 0) {
        for (let doc of response?.data?.required_documents_types) {
          if (
            doc?.category_key == "DOCUMENT" &&
            doc?.key != "OTHER" &&
            doc?.key != "FACE_VERIFICATION"
          ) {
            console.log(doc, "doc doc doc doc doc doc doc");
            documentsRequiredCRP.push(doc);
          }
        }
      }
      console.log(
        documentsRequiredCRP,
        "documents documents documents crp documents"
      );
      setRequiredDocumentList(documentsRequiredCRP);
    } else {
      // setIsLoader(false);
    }
  };
  const getSpecificIdentity = async (identity_id) => {
    setIsLoader(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      console.log(response?.data, "response response response response ");
      // setLabelIdentity(response.data?.label);
      setIdentityData(response.data);
      if (response?.data?.parentId != "0") {
        setIsCrp(true);
        accountData["attach_identities"] = [{ identity: response?.data }];
        setAccountData(accountData);
        console.log(
          accountData,
          "accountData accountData accountData accountData accountData accountData"
        );
      } else {
        setIsCrp(false);
      }
    } else {
    }
  };

  const getSingleAccountDetailById = async (accountId) => {
    // setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      accountId,
      cancelTokenSource.token
    );
    console.log("response?.data?.account_detail", response);
    // setIsLoader(false);
    if (response.success == true) {
      setAccountData(response?.data?.account_detail);
      getSpecificIdentity(params?.identity_id);
      console.log(
        "response?.data?.account_detail",
        response?.data?.account_detail
      );
    } else {
    }
  };
  const getParticularFields = async () => {
    // setIsLoader(true);
    let account_id = null;
    if (params?.account_id) {
      account_id = params?.account_id;
    }
    console.log("getParticularFields called");
    const response = await getParticularFieldsApi(
      account_id,
      cancelTokenSource.token
    );
    // setIsLoader(false);
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
      setParticularFields(array);
    } else {
    }
  };
  const getCRPList = async () => {
    // setIsLoader(true);

    const response = await getFlatCPRListAPI(
      params?.identity_id,
      params?.account_id,
      cancelTokenSource.token
    );
    // setIsLoader(false);
    if (response.success == true) {
      setCrpListData(response?.data);
    } else {
    }
  };

  const handleClickOnStatusBtn = (section) => {
    console.log("hanfle dasljd");
    navigate(
      `/profile/identity/${params.type}/${section}/${params.identity_id}/${params.account_id}/`
    );
  };
  return (
    <div className="main-content">
      {console.log(accountData, "accountData")}
      <Container fluid>
        {isLoader ? (
          // <LoadingSpinner animation="grow" custom={true} height="70vh" />
          <Loader />
        ) : params?.account_id ? (
          accountData?.attach_identities &&
          accountData?.attach_identities.map((item, index) => (
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={10}>
                <form>
                  {isLoader && (
                    // <LoadingSpinner
                    //   animation="grow"
                    //   custom={true}
                    //   height="70vh"
                    // />
                    <Loader/>
                  )}
                  <div className="row">
                    <div className="card">
                      {console.log(
                        getMissingDataOfIdentity(
                          item?.identity,
                          accountData?.fund,
                          particularFields,
                          isCrp,
                          crpIdentityUploadDocList,
                          requiredDocumentList
                        ),
                        "asdasdasdasd"
                      )}
                      <div
                        className="card-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <h4 className="card-header-title">Summary</h4>
                        <div>
                          {getMissingDataOfIdentity(
                            item?.identity,
                            accountData?.fund,
                            particularFields,
                            isCrp,
                            crpIdentityUploadDocList,
                            requiredDocumentList
                          )?.missingIdentityFields.length > 0 ||
                          getMissingDataOfIdentity(
                            item?.identity,
                            accountData?.fund,
                            particularFields,
                            isCrp,
                            crpIdentityUploadDocList,
                            requiredDocumentList
                          )?.missingDocuments.length > 0 ? (
                            <span class="text-success">
                              <FeatherIcon
                                icon="clock"
                                color="orange"
                                size="15"
                              />
                            </span>
                          ) : (
                            <span class="text-success">
                              <FeatherIcon
                                icon="check-circle"
                                color="green"
                                size="15"
                              />
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="list-group list-group-flush my-n3">
                          {getMissingDataOfIdentity(
                            item?.identity,
                            accountData?.fund,
                            particularFields,
                            isCrp,
                            crpIdentityUploadDocList,
                            requiredDocumentList
                          )?.missingIdentityFields.length > 0 ? (
                            <div className="list-group-item">
                              <div className="row align-items-center">
                                <div className="col">
                                  <h4 className="font-weight-base mb-1">
                                    Particulars
                                  </h4>
                                  <small className="text-muted">
                                    We need a bit more information to complete
                                    this application.
                                  </small>
                                </div>
                                <div className="col-auto">
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      handleClickOnStatusBtn("particular")
                                    }
                                  >
                                    In Complete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="list-group-item">
                              <div className="row align-items-center">
                                <div className="col">
                                  <h4 className="font-weight-base mb-1">
                                    Particulars
                                  </h4>
                                  <small className="text-muted">
                                    Make sure data you entered is correct
                                  </small>
                                </div>
                                <div className="col-auto">
                                  <button
                                    onClick={() =>
                                      handleClickOnStatusBtn("particular")
                                    }
                                    className="btn btn-sm btn-success"
                                  >
                                    Completed
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="list-group-item">
                            {getMissingDataOfIdentity(
                              item?.identity,
                              accountData?.fund,
                              particularFields,
                              isCrp,
                              crpIdentityUploadDocList,
                              requiredDocumentList
                            )?.missingDocuments.length > 0 ? (
                              <div className="row align-items-center">
                                <div className="col">
                                  <h4 className="font-weight-base mb-1">
                                    Documents
                                  </h4>

                                  <small className="text-muted">
                                    We need some documents to be uploaded to
                                    complete this application.
                                  </small>
                                </div>
                                <div className="col-auto">
                                  <button
                                    onClick={() =>
                                      handleClickOnStatusBtn("documents")
                                    }
                                    className="btn btn-sm btn-danger"
                                  >
                                    In Complete
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="row align-items-center">
                                <div className="col">
                                  <h4 className="font-weight-base mb-1">
                                    Documents
                                  </h4>

                                  <small className="text-muted">
                                    Make sure document you upload is correct
                                  </small>
                                </div>
                                <div className="col-auto">
                                  <button
                                    onClick={() =>
                                      handleClickOnStatusBtn("documents")
                                    }
                                    className="btn btn-sm btn-success"
                                  >
                                    Completed
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {params?.type == "corporate" ? (
                        <>
                          <div className="card-header">
                            <h4 className="card-header-title">CRP</h4>
                          </div>
                          <div className="card-body">
                            {crpListData &&
                              crpListData.map((item, index) => (
                                <div
                                  className="list-group list-group-flush my-n3"
                                  key={index}
                                >
                                  <div className="list-group-item">
                                    <div className="row align-items-center">
                                      <Link
                                        to={`/profile/identity/${item?.type.toLowerCase()}/summary/${
                                          item?.id
                                        }/${
                                          params?.account_id
                                            ? params?.account_id
                                            : ""
                                        }`}
                                      >
                                        <div className="col">
                                          <h4 className="font-weight-base mb-1">
                                            {item?.label}
                                          </h4>
                                          <small className="text-muted">
                                            {item?.type}
                                          </small>
                                        </div>
                                      </Link>

                                      {/* <div className="col-sm-3">
                                        <h4 className="font-weight-base mb-1">Screening</h4>
                                        <small style={{ color: item?.screening?.status ? 'green' : 'red' }} >{item?.screening?.status ? 'Completed' : 'Not Completed'}</small>
                                      </div>
                                      <div className="col-sm-3">
                                        <h4 className="font-weight-base mb-1">Risk Assessment</h4>
                                        <small style={{ color: item?.risk_assessment?.status ? 'green' : 'red' }} >{item?.risk_assessment?.status ? 'Completed' : 'Not Completed'}</small>
                                      </div>
                                      <div className="col-sm-3">
                                        <h4 className="font-weight-base mb-1">Status</h4>
                                        <small style={{ color:item?.risk_assessment?.status === false || item?.risk_assessment?.mark_status == 'NOT_SET' || item?.risk_assessment?.mark_status == 'REJECTED' ? 'red' : 'green' }}>{item?.risk_assessment?.mark_status.replace('_', ' ')}</small>
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </form>
                <br />
                <br />
              </Col>
            </Row>
          ))
        ) : null}
      </Container>
    </div>
  );
}
