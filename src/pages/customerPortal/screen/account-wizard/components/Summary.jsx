import { Col, Container, Row, Nav, Spinner, Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { getMissingDataOfIdentity } from "../../../../helpers";
import axios, { CancelTokenSource } from "axios";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getSingleAccountDetailByIdAPI, getParticularFieldsApi, getFlatCPRListAPI, getParticularsDetailByIdentityIdAPI, getIdentityDocument, getRequiredDocumentCRP } from "../../../../api/network/CustomerApi";
import SpinnerWithBackDrop from "../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
import { AiOutlineConsoleSql } from "react-icons/ai";
import countries from "./../../../../helpers/countries";
import CustomerBox from "../../../../widgets/customer-box";

export default function Summary(props) {
  console.log(props, "props props props props summary");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderApplicationStatus, setIsLoaderApplicationStatus] = useState(true);
  const [accountData, setAccountData] = useState([]);
  const [particularFields, setParticularFields] = useState([]);
  const [crpListData, setCrpListData] = useState([]);
  const [isCrp, setIsCrp] = useState(false);
  const [identityData, setIdentityData] = useState([]);
  const [crpIdentityUploadDocList, setCrpIdentityUploadDocList] = useState([]);
  const [requiredDocumentList, setRequiredDocumentList] = useState([]);
  const [subscriptionApplicationStatus, setSubscriptionApplicationStatus] = useState(false);
  const [requiredSubscriptionDocument, setRequiredSubscriptionDocument] = useState(null);
  const [isShowFaceVerificationVCIP, setIsShowFaceVerificationVCIP] = useState(false);
  const entityId = localStorage.getItem('entity_id');
  const [searchParams] = useSearchParams();
  const openDocs = searchParams?.get("openDoc") || "";

  useLayoutEffect(() => {
    if (!openDocs || identityData?.type !== 'CORPORATE') return
    props.handleGoToStep('Documents')
    const url = new URL(window.location);
    url.search = ''; // Clear query parameters
    window.history.replaceState({}, '', url.toString());
  }, [openDocs])


  useEffect(() => {
    if (props?.dataOfAccountSetup) {
      console.log(props?.dataOfAccountSetup, 'props?.dataOfAccountSetupprops?.dataOfAccountSetupprops?.dataOfAccountSetupprops?.dataOfAccountSetup')
      if (props?.dataOfAccountSetup?.accountData?.meta?.created_by?.portal == 'customer') {
        setIsShowFaceVerificationVCIP(true)
      } else if (props?.dataOfAccountSetup?.accountData?.meta?.created_by?.id != localStorage.getItem("login_user_id")) {
        setIsShowFaceVerificationVCIP(true)
      }
    }
  }, [props?.dataOfAccountSetup]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClickReferenceDocument = (url) => {
    window.open(url, "_blank");
  };

  let account_id = props.dataOfAccountSetup?.account_id;

  let identity_id = props.dataOfAccountSetup?.identity_id;
  useEffect(() => {
    props?.getTransactionHistory(account_id);
  }, []);
  let type = props.dataOfAccountSetup?.isIndividual ? "individual" : "corporate";
  let fundData = props.dataOfAccountSetup?.fund_data;
  let selectedIdentityData = props.dataOfAccountSetup?.selectedIdentityData;
  console.log(getMissingDataOfIdentity(selectedIdentityData, props.dataOfAccountSetup?.fundData, null)?.missingDocuments, "missing documentd data yytt");
  console.log(selectedIdentityData, "selectedIdentityData selectedIdentityData selectedIdentityData selectedIdentityData selectedIdentityData");
  useEffect(() => {
    if (identity_id) {
      setIsLoader(true);
      getCRPList();
      getUploadDocument(identity_id);
      // getSingleAccountDetailById(account_id);
      getParticularFields();
      getRequiredDocument(account_id, identity_id);
    }
  }, [identity_id]);

  useEffect(() => {
    setIsLoaderApplicationStatus(true);

    if (
      requiredSubscriptionDocument !== null &&
      props?.transactionHistoryData
    ) {
      console.log(
        props?.transactionHistoryData,
        'props?.transactionHistoryData',
      );
      let status = matchDocumentType(
        props?.transactionHistoryData,
        requiredSubscriptionDocument,
      );
      console.log(status, 'statusstatusstatusstatusstatus');
      setSubscriptionApplicationStatus(status);
      setIsLoaderApplicationStatus(false);
    }
  }, [requiredSubscriptionDocument, props?.transactionHistoryData]);
  useEffect(() => {
    console.log('isLoaderApplicationStatus', isLoaderApplicationStatus);
  }, [isLoaderApplicationStatus]);

  const matchDocumentType = (uploadedDocuments, requiredDocuments) => {
    for (const requiredDoc of requiredDocuments) {
      if (requiredDoc.isRequired) {
        const uploadedDoc = uploadedDocuments[requiredDoc.key];
        if (!uploadedDoc || uploadedDoc.length === 0) {
          return false; // Required document is missing
        } else {
          if (uploadedDoc[0]?.docuSign) {
            if (uploadedDoc[0]?.docuSign?.status) {
              if (uploadedDoc[0]?.docuSign?.status != 'signing_complete') {
                return false;
              }
            }
          }
        }
        const uploadedDocIds = uploadedDoc.map((doc) =>
          parseInt(doc.documentTypeId),
        );
        console.log(uploadedDocIds, 'uploadedDocIds');
        if (!uploadedDocIds.includes(parseInt(requiredDoc.id))) {
          return false; // Required document type is missing
        } else {
          if (uploadedDoc[0]?.docuSign) {
            if (uploadedDoc[0]?.docuSign?.status) {
              if (uploadedDoc[0]?.docuSign?.status != 'signing_complete') {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
    // for (let requiredDocument of documentTypes) {
    //   for (const key in documentTypeData) {
    //     if (documentTypeData.hasOwnProperty(key)) {
    //       const documentArray = documentTypeData[key];
    //       console.log(requiredDocument?.id,'requiredDocument?.id')
    //       console.log(documentArray[0].documentTypeId,'documentArray[0].documentTypeId')
    //       if (requiredDocument?.id != documentArray[0].documentTypeId) {
    //         if (requiredDocument?.isRequired) {
    //           return false
    //         }ff
    //       }
    //     }
    //   }
    // }
    // return true;
  };

  const getUploadDocument = async (identity_id) => {
    console.log(`checking getUploadDocument`);
    // setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token,
    );
    console.log('object 1', response);
    if (response.success == true) {
      // setIsLoader(false);
      console.log(
        Object.keys(response?.data?.IdentityDocuments),
        'Object.keys(response?.data?.IdentityDocuments)',
      );
      setCrpIdentityUploadDocList(
        response?.data?.IdentityDocuments
          ? Object.keys(response?.data?.IdentityDocuments)
          : [],
      );
    } else {
      // setIsLoader(false);
    }
  };
  const getRequiredDocument = async (account_id, identity_id) => {
    setIsLoaderApplicationStatus(true);
    console.log(`checking getUploadDocument`);
    // setIsLoader(true);

    const response = await getRequiredDocumentCRP(
      account_id,
      identity_id,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      let documentsRequiredCRP = [];
      let subscriptionDocuments = [];
      if (response?.data?.required_documents_types.length > 0) {
        for (let doc of response?.data?.required_documents_types) {
          if (
            doc?.category_key == 'DOCUMENT' &&
            doc?.key != 'OTHER' &&
            doc?.key != 'FACE_VERIFICATION'
          ) {
            console.log(doc, 'doc doc doc doc doc doc doc');
            documentsRequiredCRP.push(doc);
          }

          if (doc?.category_key == 'SUBSCRIPTION_DOCUMENT' && doc?.isRequired) {
            subscriptionDocuments.push(doc);
          }
        }
      }
      setRequiredSubscriptionDocument(subscriptionDocuments);
      console.log(
        documentsRequiredCRP,
        'documents documents documents crp documents',
      );
      setRequiredDocumentList(documentsRequiredCRP);
      setIsLoaderApplicationStatus(false);
    } else {
      setIsLoaderApplicationStatus(false);

      // setIsLoader(false);
    }
  };
  const handleClickMissingParticularsForCrp = (e, data) => {
    let dataToSend = {
      crp: true,
      crpId: data?.id,
      crpType: data?.type,
    };
    props.handleViewMissingParticulars(dataToSend);
  };
  const handleClickMissingDocumentsForCrp = (e, data) => {
    let dataToSend = {
      crp: true,
      crpId: data?.id,
      crpType: data?.type,
    };
    props.handleViewMissingDocuments(dataToSend);
  };
  const getSpecificIdentity = async (identity_id) => {
    setIsLoader(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoader(false);
      console.log(response?.data, 'response response response response ');
      // setLabelIdentity(response.data?.label);
      setIdentityData(response.data);
      if (response?.data?.parentId != '0') {
        setIsCrp(true);
        accountData['attach_identities'] = [{ identity: response?.data }];
        setAccountData(accountData);
        console.log(
          accountData,
          'accountData accountData accountData accountData accountData accountData',
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
      cancelTokenSource.token,
    );
    console.log('response?.data?.account_detail', response);
    // setIsLoader(false);
    if (response.success == true) {
      setAccountData(response?.data?.account_detail);
      getSpecificIdentity(identity_id);
      console.log(
        'response?.data?.account_detail',
        response?.data?.account_detail,
      );
    } else {
    }
  };
  const getParticularFields = async () => {
    // setIsLoader(true);
    let account_idss = null;
    if (account_id) {
      account_idss = account_id;
    }
    console.log('getParticularFields called');
    const response = await getParticularFieldsApi(
      account_idss,
      cancelTokenSource.token,
    );
    // setIsLoader(false);
    if (response.success == true) {
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      let array = [];
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      if (account_id) {
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
    setIsLoader(true);

    const response = await getFlatCPRListAPI(
      identity_id,
      account_id,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoader(false);
      setCrpListData(response?.data);
    } else {
      setIsLoader(false);
    }
  };

  const handleClickOnStatusBtn = (section) => {
    console.log('hanfle dasljd');
    navigate(
      `/profile/identity/${type}/${section}/${identity_id}/${account_id}/`,
    );
  };
  const getDataFromIdentity = (field) => {
    let identityData = selectedIdentityData?.meta?.data
      ? selectedIdentityData?.meta?.data
      : selectedIdentityData?.data;
    if (field == 'email' || field == 'phone') {
      if (identityData?.[`${type}.extended.${field}`]) {
        if (identityData?.[`${type}.extended.${field}`]?.value) {
          return identityData?.[`${type}.extended.${field}`]?.value;
        }
      }
    }
    if (identityData?.[`${type}.basic.${field}`]) {
      if (identityData?.[`${type}.basic.${field}`]?.value) {
        return identityData?.[`${type}.basic.${field}`]?.value;
      }
    }
  };
  const getCountryName = () => {
    let identityDataValue = selectedIdentityData?.meta?.data
      ? selectedIdentityData?.meta?.data
      : selectedIdentityData?.data;

    let countryCode = '';
    if (type == 'individual') {
      if (identityDataValue?.[`${type}.basic.country_of_residence_code`]) {
        if (
          identityDataValue?.[`${type}.basic.country_of_residence_code`]?.value
        ) {
          countryCode =
            identityDataValue?.[`${type}.basic.country_of_residence_code`]?.value;
        }
      }
    } else {
      if (identityDataValue?.[`${type}.basic.incorporate_country_code`]) {
        if (
          identityDataValue?.[`${type}.basic.incorporate_country_code`]?.value
        ) {
          countryCode =
            identityDataValue?.[`${type}.basic.incorporate_country_code`]?.value;
        }
      }
    }
    return getCountryNameFromEnums(countryCode);
  };
  const getCountryNameFromEnums = (countryCode) => {
    let countryName = '';
    if (countries.length > 0) {
      for (let a of countries) {
        if (a.code == countryCode) {
          countryName = a.key;
        }
      }
    }
    if (countryName == '') {
      return countryCode;
    } else {
      return countryName;
    }
  };
  const checkIfWalleAdded = () => {
    if (
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.bank?.enabled === true ||
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.bank?.enabled == 'true'
    ) {
      // if(!props?.dataOfAccountSetup?.bank){
      //     return false
      // }
      return props?.dataOfAccountSetup?.bank;
    }
    if (
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.wallet?.enabled === true ||
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity?.wallet?.enabled == 'true'
    ) {
      // if(!props?.dataOfAccountSetup?.wallet){
      //     return false
      // }
      return props?.dataOfAccountSetup?.wallet;
    }
    return true;
  };
  return (
    <div className="main-content">
      <Container fluid>
        <Card>
          <Card.Body>
            <Row>
              {fundData?.fund_setting?.display?.fund_info === true ||
                fundData?.fund_setting?.display?.fund_info == 'true' ? (
                <Col xs={6} lg={4} xl={4} className="d-flex">
                  <div className="d-flex" style={{ alignItems: 'center' }}>
                    <img
                      className="fund-logo"
                      src={
                        fundData?.logoBucketKey
                          ? fundData?.logoBucketKey
                          : fundData?.fund_logo_url
                      }
                    />
                    <span className="fund-name-box">{fundData?.name}</span>
                  </div>
                </Col>
              ) : (
                <Col
                  xs={12}
                  lg={12}
                  xl={12}
                  className="d-flex justify-content-center"
                >
                  <div className="d-flex" style={{ alignItems: 'center' }}>
                    <img
                      className="fund-logo"
                      src={
                        fundData?.logoBucketKey
                          ? fundData?.logoBucketKey
                          : fundData?.fund_logo_url
                      }
                    />
                    <span className="fund-name-box">{fundData?.name}</span>
                  </div>
                </Col>
              )}

              {(fundData?.fund_setting?.display?.fund_info === true ||
                fundData?.fund_setting?.display?.fund_info == 'true') && (
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
                            </span>{' '}
                            Fund's KYC:{' '}
                            {fundData?.fund_setting?.kyb?.status
                              ? fundData?.fund_setting?.kyb?.status
                                .charAt(0)
                                .toUpperCase() +
                              fundData?.fund_setting?.kyb?.status.slice(1)
                              : fundData?.meta?.config?.kyb?.status
                                .charAt(0)
                                .toUpperCase() +
                              fundData?.meta?.config?.kyb?.status.slice(1)}
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
                            </span>{' '}
                            Fund Domicile:{' '}
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
                            />{' '}
                            Dealing Cycle:{' '}
                            {fundData?.fund_setting?.dealing?.type?.end
                              ? fundData?.fund_setting?.dealing?.type?.end
                              : fundData?.fund_setting?.dealing?.type?.end}
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
                                </span>{' '}
                                Digital Fund:{' '}
                                {fundData?.fund_setting?.account?.applicant?.asset
                                  ?.digital?.status
                                  ? fundData?.fund_setting?.account?.applicant
                                    ?.asset?.digital?.status
                                    ? 'Active'
                                    : 'Not Active'
                                  : fundData?.meta?.config?.settings?.account
                                    ?.applicant?.asset?.digital?.status
                                    ? 'Active'
                                    : 'Not Active'}
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
                fundData?.reference_document?.documents.map((item, index) => (
                  <Card>
                    <Card.Body>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
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
                              height: '30px',
                              width: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px',
                              marginTop: '5px',
                              marginBottom: '5px',
                            }}
                          >
                            <FeatherIcon icon="eye" size="1em" />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
            </Card.Body>
          )}
        </Card>
        <Row>
          <Col xs={12} md={6} lg={6} xl={6}>
            <Card>
              <Card.Header>
                <h3 className="text-muted mb-0">Profile</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={12} md={8} lg={8} xl={8}>
                    <div className="text-muted mt-4 mb-4 identity-info-summary">
                      <p>Name : {selectedIdentityData?.label}</p>
                      {selectedIdentityData?.type === 'INDIVIDUAL' && (
                        <p>
                          Nationality :{' '}
                          {selectedIdentityData?.type === 'INDIVIDUAL' &&
                            getCountryNameFromEnums(
                              selectedIdentityData?.meta?.data[
                                'individual.basic.nationality_code'
                              ].value,
                            )}
                        </p>
                      )}
                      <p>
                        {selectedIdentityData?.type === 'INDIVIDUAL'
                          ? 'Country Of Residence'
                          : 'Country for Incorporation'}
                        : {getCountryName()}
                      </p>
                      <p>
                        Customer Type :{' '}
                        {selectedIdentityData?.type
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(' ')}
                      </p>
                      <p>Email : {getDataFromIdentity('email')}</p>
                      <p>Phone : {getDataFromIdentity('phone')}</p>
                    </div>
                  </Col>
                  <Col xs={12} md={4} lg={4} xl={4}></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={6} xl={6}>
            <Card className="mb-2">
              <Card.Body className="d-flex justify-content-between">
                <div>Particulars Form</div>
                <div className="d-flex justify-content-between">
                  <div>
                    <span class="text-success">
                      <FeatherIcon
                        className={`text-success`}
                        icon="check-circle"
                        color="green"
                        size="15"
                      />{' '}
                      Completed
                    </span>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <FeatherIcon
                      icon="eye"
                      size="15"
                      onClick={(e) => props.handleGoToStep('Identity Setup')}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="mb-2">
              <Card.Body className="d-flex justify-content-between">
                <div>Document Upload</div>
                <div className="d-flex justify-content-between">
                  <div>
                    {console.log(
                      selectedIdentityData,
                      ' selectedIdentityData selectedIdentityData selectedIdentityData selectedIdentityData selectedIdentityData selectedIdentityData selectedIdentityData',
                    )}
                    {getMissingDataOfIdentity(
                      selectedIdentityData,
                      props.dataOfAccountSetup?.fundData,
                      null,
                    )?.missingDocuments?.length > 0 ? (
                      <span class="text-danger">
                        <FeatherIcon
                          className={`text-danger`}
                          icon="check-circle"
                          color="red"
                          size="15"
                        />{' '}
                        Incomplete
                      </span>
                    ) : (
                      <span class="text-success">
                        <FeatherIcon
                          className={`text-success`}
                          icon="check-circle"
                          color="green"
                          size="15"
                        />{' '}
                        Completed
                      </span>
                    )}
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <FeatherIcon
                      icon="eye"
                      size="15"
                      onClick={(e) => props.handleGoToStep('Documents')}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
            {fundData?.fund_setting?.account?.applicant?.identity[
              type == 'individual' ? 'indivisual' : 'corporate'
            ]?.provider?.verify?.face?.enabled &&
              isShowFaceVerificationVCIP && (
                <Card className="mb-2">
                  <Card.Body className="d-flex justify-content-between">
                    <div>Face Verification</div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <span
                          class={
                            props?.dataOfAccountSetup?.faceVerification
                              ? `text-success`
                              : 'text-danger'
                          }
                        >
                          <FeatherIcon
                            className={
                              props?.dataOfAccountSetup?.faceVerification
                                ? `text-success`
                                : 'text-danger'
                            }
                            icon="check-circle"
                            color="green"
                            size="15"
                          />{' '}
                          {props?.dataOfAccountSetup?.faceVerification
                            ? 'Completed'
                            : 'Incomplete'}
                        </span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <FeatherIcon
                          icon="eye"
                          size="15"
                          onClick={(e) =>
                            props.handleGoToStep('Face Verification')
                          }
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            {fundData?.fund_setting?.account?.applicant?.identity[
              type == 'individual' ? 'indivisual' : 'corporate'
            ]?.provider?.verify?.vcip?.enabled &&
              isShowFaceVerificationVCIP && (
                <Card className="mb-2">
                  <Card.Body className="d-flex justify-content-between">
                    <div>VCIP</div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <span
                          class={
                            props?.dataOfAccountSetup?.vcip
                              ? `text-success`
                              : 'text-danger'
                          }
                        >
                          <FeatherIcon
                            className={
                              props?.dataOfAccountSetup?.vcip
                                ? `text-success`
                                : 'text-danger'
                            }
                            icon="check-circle"
                            color="green"
                            size="15"
                          />{' '}
                          {props?.dataOfAccountSetup?.vcip
                            ? 'Completed'
                            : 'Incomplete'}
                        </span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <FeatherIcon
                          icon="eye"
                          size="15"
                          onClick={(e) => props.handleGoToStep('VCIP')}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            {(props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
              ?.applicant?.identity?.bank?.enabled === true ||
              props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
                ?.applicant?.identity?.bank?.enabled == 'true' ||
              props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
                ?.applicant?.identity?.wallet?.enabled === true ||
              props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
                ?.applicant?.identity?.wallet?.enabled == 'true') &&
              props?.dataOfAccountSetup?.fund_data?.named_id?.toUpperCase() !==
              'AXSA-WM' && (
                <Card className="mb-2">
                  <Card.Body className="d-flex justify-content-between">
                    <div>Bank Wallet</div>
                    <div className="d-flex justify-content-between">
                      <div>
                        {/* <span class={props?.dataOfAccountSetup?.bank && props?.dataOfAccountSetup?.wallet ? `text-success` : 'text-danger'}> */}
                        <span
                          class={
                            checkIfWalleAdded() ? `text-success` : 'text-danger'
                          }
                        >
                          <FeatherIcon
                            className={
                              checkIfWalleAdded()
                                ? `text-success`
                                : 'text-danger'
                            }
                            icon="check-circle"
                            color="green"
                            size="15"
                          />{' '}
                          {checkIfWalleAdded() ? 'Completed' : 'Incomplete'}
                        </span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <FeatherIcon
                          icon="eye"
                          size="15"
                          onClick={(e) => props.handleGoToStep('Bank/Wallets')}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            {fundData?.fund_setting?.account?.subscription?.status && (
              <>
                <Card className="mb-2">
                  <Card.Body className="d-flex justify-content-between">
                    <div>Application Document</div>
                    <div className="d-flex justify-content-between">
                      <div>
                        {isLoaderApplicationStatus ? (
                          <Spinner
                            color="blue"
                            animation="border"
                            role="status"
                          ></Spinner>
                        ) : (
                          <span
                            className={
                              subscriptionApplicationStatus === false
                                ? 'text-danger'
                                : subscriptionApplicationStatus
                                  ? 'text-success'
                                  : 'text-danger'
                            }
                          >
                            <FeatherIcon
                              className={
                                subscriptionApplicationStatus === false
                                  ? 'text-danger'
                                  : subscriptionApplicationStatus
                                    ? 'text-success'
                                    : 'text-danger'
                              }
                              icon="check-circle"
                              color="green"
                              size="15"
                            />
                            {subscriptionApplicationStatus === false
                              ? 'Incomplete'
                              : subscriptionApplicationStatus
                                ? 'Completed'
                                : 'Incomplete'}
                          </span>
                        )}
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <FeatherIcon
                          icon="eye"
                          size="15"
                          onClick={(e) => props.handleGoToStep('Application')}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
        <Row>
          {selectedIdentityData?.type.toLowerCase() == 'corporate' ? (
            !isLoader ? (
              <>
                <Col xs={12} lg={12} xl={12}>
                  <div className="card" style={{ backgroundColor: '#1f3958' }}>
                    {/* <div className="card-header">
                      <h4 className="card-header-title">
                        Corporate Underlying Parties
                      </h4>
                    </div> */}
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 className="card-header-title">
                        Corporate Underlying Parties
                      </h4>

                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Invite Underlying Corporate Parties</Tooltip>}
                      >
                        <span>
                          <FeatherIcon
                            icon="user-plus"
                            size="20"
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              window.open(`${process.env.AUTH_API_URL}/entity-users-management/${entityId}?invite_user=true`, "_blank")
                            }
                          />
                        </span>
                      </OverlayTrigger>
                    </div>


                    <div className="card-body">
                      {crpListData &&
                        crpListData.map((item, index) => (
                          <>
                            <Row style={{ minHeight: '161px' }}>
                              <Col xs={12} lg={6} xl={6}>
                                <CustomerBox
                                  customerData={item}
                                  isCrp={true}
                                  params={params}
                                />
                              </Col>
                              <Col xs={12} lg={6} xl={6}>
                                <div
                                  style={{ minHeight: '161px' }}
                                  className="card"
                                >
                                  <div className="card-body">
                                    {getMissingDataOfIdentity(
                                      item,
                                      accountData?.fund,
                                      particularFields,
                                      true,
                                    )?.missingIdentityFields.length > 0 ? (
                                      <div
                                        className="missing_required_fields_documents"
                                        style={{
                                          marginBottom: '1em',
                                        }}
                                      >
                                        <p
                                          className="text-muted"
                                          style={{ maxWidth: '60%' }}
                                        >
                                          <span>Please note: </span>We need a
                                          bit more information to complete this
                                          application.
                                        </p>
                                        <button
                                          className="btn btn-warning"
                                          style={{ fontSize: '12px' }}
                                          onClick={(e) =>
                                            handleClickMissingParticularsForCrp(
                                              e,
                                              item,
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
                                          style={{ maxWidth: '60%' }}
                                        >
                                          <span>Success! </span>You provided all
                                          necessary information.
                                        </p>
                                        <button
                                          className="btn btn-primary"
                                          style={{ fontSize: '12px' }}
                                          onClick={(e) =>
                                            handleClickMissingParticularsForCrp(
                                              e,
                                              item,
                                            )
                                          }
                                        >
                                          View Particulars
                                        </button>
                                      </div>
                                    )}
                                    {getMissingDataOfIdentity(
                                      item,
                                      accountData?.fund,
                                      particularFields,
                                      true,
                                      item?.documents,
                                      item?.requiredDocs,
                                    )?.missingDocuments.length > 0 ? (
                                      <div
                                        className="missing_required_fields_documents"
                                        style={{
                                          marginBottom: '1em',
                                        }}
                                      >
                                        <p
                                          className="text-muted"
                                          style={{ maxWidth: '60%' }}
                                        >
                                          <span>Please note: </span>We need a
                                          bit more information to complete this
                                          application.
                                        </p>
                                        <button
                                          className="btn btn-warning"
                                          style={{ fontSize: '12px' }}
                                          onClick={(e) =>
                                            handleClickMissingDocumentsForCrp(
                                              e,
                                              item,
                                            )
                                          }
                                        >
                                          Incomplete Documents
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="missing_required_fields_documents_success">
                                        <p
                                          className="text-muted"
                                          style={{ maxWidth: '60%' }}
                                        >
                                          <span>Success! </span>You provided all
                                          necessary information.
                                        </p>
                                        <button
                                          className="btn btn-primary"
                                          style={{ fontSize: '12px' }}
                                          onClick={(e) =>
                                            handleClickMissingDocumentsForCrp(
                                              e,
                                              item,
                                            )
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
                          </>
                        ))}
                    </div>
                  </div>
                </Col>
              </>
            ) : (
              <LoadingSpinner animation="grow" custom={true} height="70vh" />
            )
          ) : null}
        </Row>
      </Container>
    </div>
  );
}
