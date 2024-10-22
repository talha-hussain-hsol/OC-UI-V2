import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, Nav, Row, Button, Dropdown } from "react-bootstrap";
import { Header } from "../components";
import { getParticularsDetailByIdentityIdAPI } from "../api/network/customerApi";
import { getFundDetailAPI, getSingleAccountDetailByIdAPI, getParticularFieldsApi, getRiskAssessmentTabStatusAPI } from "../api/network/ManagerApi/ManagerApi";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { Breadcrumb } from "react-bootstrap";
import { checkPermissions, getMissingDataOfIdentity } from "../helpers";
// import LoadingSpinner from "../widgets/bootstrap-component/Spinner";
import Loader from "../components/ui/loader";
import { isFaceEnabled, isVCIPEnabled, isRequiredDocumentEnabled } from "../helpers/getFundConfiguration";

export default function AdministrationIdentityHeader({ ...props }) {
    console.log(props,'props?.accountData')
    const history = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const cancelTokenSource = axios.CancelToken.source();
    const [label, setLabel] = useState("");
    const [identityData, setIdentityData] = useState("");
    const [fundDetail, setFundDetail] = useState("");
    const [accountData, setAccountData] = useState([]);
    const [particularFields, setParticularFields] = useState(null);
    const [isLoader, setIsLoader] = useState(false);
    const [missingData, setMissingData] = useState(null);
    // const [props?.riskAssessmentStatusTab, setRiskAssessmentStatusTab] = useState("");
    const [loaderHeader, setLoaderHeader] = useState(true);
    const [status, setStatus] = useState(props?.location == null ? "" : props?.location);
    const identityType = params?.type;

    const faceVerificationEnabled = isFaceEnabled(accountData?.fund, identityType);
    const vcipEnabled = isVCIPEnabled(accountData?.fund, identityType);
    const documentEnabled = isRequiredDocumentEnabled(accountData?.fund, identityType);
    const VIEW_TRANSACTION_DETAIL = checkPermissions("VIEW_TRANSACTION_DETAIL")

    const isShowManualTransaction = props?.accountData?.fund?.meta?.config?.settings?.sections?.manual_transaction?.enabled
    console.log("props", props?.location);

    let path = params["*"];
    const pathSegments = path.split("/");
    const identity_id = pathSegments[1];
    const account_id = pathSegments[2];

    useEffect(() => {
        console.log(history.search, "history.search useEffect");
        const queryParams = new URLSearchParams(history.search);
        console.log(queryParams, "queryParams");
        if (queryParams) {
            const refresh_header_identity = queryParams.get("refresh_header_identity");
            console.log(refresh_header_identity, "refresh_header_identity");
            if (refresh_header_identity) {
                getSingleAccountDetailById(account_id);
                getParticularFields();
                getRiskAssessmentTabStatus();
            }
            console.log(history.pathname.split("?")[0], "history.search.split()[0]");
            navigate(history.pathname.split("?")[0]);
        }
    }, [history.search,]);



    useEffect(() => {
        console.log("params in summmmmmmmm", params)
        if (identity_id) {
            getSpecificIdentity(identity_id);
            getRiskAssessmentTabStatus();
        }
    }, [identity_id, params]);
    useEffect(() => {
        if (account_id) {
            getSingleAccountDetailById(account_id);
            getParticularFields();
        }
    }, []);
    useEffect(() => {
        console.log("accountData accountData", accountData)
    }, [accountData])

    useEffect(() => {
        if (accountData?.attach_identities && particularFields) {
            setMissingData(getMissingDataOfIdentity(accountData?.attach_identities && accountData?.attach_identities[0]?.identity, accountData?.fund, particularFields));
            setLoaderHeader(false);
        }
    }, [accountData, particularFields]);
    const getSingleAccountDetailById = async (accountId) => {
        setIsLoader(true);
        const response = await getSingleAccountDetailByIdAPI(accountId, cancelTokenSource.token);
        console.log("response?.data?.account_detail", response);
        setIsLoader(false);
        if (response.success == true) {
            setAccountData(response?.data?.account_detail);
            console.log("response?.data?.account_detail", response?.data?.account_detail);
        } else {
        }
    };

    const getParticularFields = async () => {
        setIsLoader(true);
        console.log("getParticularFieldsasdasd called");
        const response = await getParticularFieldsApi(account_id, cancelTokenSource.token);
        setIsLoader(false);
        console.log(response.data, "response response response");
        if (response.success == true) {
            // let array = [...response.data?.fields, ...response.data?.account_fields];
            let array = [];
            // let array = [...response.data?.fields, ...response.data?.account_fields];
            if (params?.account_id) {
                array = [...response.data?.account_fields?.s_f, ...response.data?.account_fields?.e_f];
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
        const response = await getRiskAssessmentTabStatusAPI(params?.fund_id, identity_id, cancelTokenSource.token);
        setIsLoader(false);
        if (response.success == true) {
            // setRiskAssessmentStatusTab(response?.data?.riskTab);
            props?.handleSetRiskAssessmentTab(response?.data?.riskTab)
        } else {
        }
    };
    const [entityLogo, setEntityLogo] = useState(localStorage.getItem("entity_logo"));
    let identity_id_value = "";
    if (identity_id) {
        identity_id_value = "/" + identity_id;
    }
    if (account_id) {
        identity_id_value = identity_id_value + "/" + account_id;
    }
    const getSpecificIdentity = async (identity_id) => {
        const response = await getParticularsDetailByIdentityIdAPI(identity_id, cancelTokenSource.token);
        if (response.success == true) {
            if (response?.data?.parentId != "0") {
                setIdentityData(response.data);
                setLabel(response.data?.label);
            } else {
                setLabel("");
            }
        } else {
        }
    };
    useEffect(
        function () {
            if (params?.fund_id) {
                getFundDetail();
            }
        },
        [params?.fund_id]
    );
    const getFundDetail = async () => {
        const response = await getFundDetailAPI(params?.fund_id, cancelTokenSource.token);
        if (response.success == true) {
            setFundDetail(response?.data);
        } else {
        }
    };
    const handleRedirectToScreening = () => {
        navigate(`/${params?.fund_id}/kyc/account/identity/${params?.type}/screening/${identity_id}/${account_id}`);
    };
    const handleRedirectToRiskAssessment = () => {

        navigate(`/${params?.fund_id}/kyc/account/identity/${params?.type}/risk-assessment/${identity_id}/${account_id}`);

    };
    const handleRedirectToCompliance = () => {
        navigate(`/${params?.fund_id}/kyc/account/identity/${params?.type}/compliance/${identity_id}/${account_id}`)
    }

    const handleCheckPermissionScreen = checkPermissions("CUSTOMER_SCREEN");
    const handleCheckPermissionRisk = checkPermissions("RISK_MATRIX_READ");



    return (
        <Header className="mt-md-2" {...props}>
            <Header.Body>
                <Row className="align-items-center">
                    <div className="col-auto">
                        <div className="avatar avatar-md">{fundDetail?.fund_logo_url && <img src={fundDetail?.fund_logo_url} alt="..." className="avatar-img rounded" />}</div>
                    </div>
                    <Col>
                        <Header.Pretitle>MANAGER PORTAL</Header.Pretitle>
                        <Header.Title>{fundDetail?.name}</Header.Title>
                        {/* <p style={{ marginBottom: '0px', fontWeight: 500, fontSize: '12px' }}>{props?.pageType}</p> */}

                        <Header.Pretitle>
                            {label != "" ? (
                                <div>
                                    <Link to={`/${params?.fund_id}/kyc/account/identity/corporate/summary/${identityData?.parentId}/${account_id ? account_id : ""}`}>
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
                            <img src={entityLogo} style={{ width: "8em", maxHeight: "50px", textAlign: "left", marginLeft: "10px" }} alt="" class="rounded" />
                            {/* <img src="https://storage.googleapis.com/ascentfs-media-public/public-data/organizations/ascent-fs/logo/ascent-fs-logo.png" style={{ maxHeight: '50px', textAlign: 'left', marginLeft: '10px' }} alt="" class="rounded" /> */}
                        </h4>
                    </Col>
                </Row>
                <Row style={{ borderTop: "1px solid #1e3a5c", marginTop: "15px", borderBottom: "1px solid #1e3a5c", padding: "5px 0px" }}>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item to="#!">
                                <Link to="/">Dashboard</Link>
                            </Breadcrumb.Item>
                            <FeatherIcon icon="chevron-right" size="1em" />
                            <Breadcrumb.Item href="#!">
                                <Link to={`/${params?.fund_id}/kyc/account/list`}>Account List</Link>
                            </Breadcrumb.Item>
                            <FeatherIcon icon="chevron-right" size="1em" />
                            <Breadcrumb.Item active>{
                                history.pathname.indexOf("summary") > -1 ? "Summary" :
                                    history.pathname.indexOf("particular") > -1 ? "Particulars" :
                                        history.pathname.indexOf("organization-chart") > -1 ? "Organization Chart" :
                                            history.pathname.indexOf("documents") > -1 ? "KYC Documents" :
                                                history.pathname.indexOf("screening") > -1 ? "Screening" :
                                                    history.pathname.indexOf("compliance") > -1 ? "Compliance" :
                                                        history.pathname.indexOf("risk-assessment") > -1 ? "Risk Assessment" :
                                                            history.pathname.indexOf("subscriptions") > -1 ? "Subscriptions" :
                                                                history.pathname.indexOf("wallets") > -1 ? "Wallets" :
                                                                    "Summary"
                            }</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
                {loaderHeader ? (
                    // <LoadingSpinner custom={true} height={"70vh"} />
                    <Loader/>
                ) : (
                    <Row className="align-items-center">
                        <Col>
                            <Header.Tabs className="nav-overflow">
                                <Nav.Item>
                                    <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/summary/${identity_id}/${account_id}`}>
                                        <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/summary/${identity_id}/${account_id}`} active={history.pathname.indexOf("summary") > -1 ? true : false}>
                                            Summary
                                        </Nav.Link>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/particular/${identity_id}/${account_id}`}>
                                        <Nav.Link
                                            style={{ color: missingData?.missingIdentityFields?.length > 0 ? "orange" : "" }}
                                            href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/particular/${identity_id}/${account_id}`}
                                            active={history.pathname.indexOf("particular") > -1 ? true : false}
                                        >
                                            Particulars
                                        </Nav.Link>
                                    </Link>
                                </Nav.Item>
                                {params?.type == "corporate" && identity_id ? (
                                    <Nav.Item>
                                        <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/organization-chart/${identity_id}/${account_id}`}>
                                            <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/organization-chart/${identity_id}/${account_id}`} active={history.pathname.indexOf("organization-chart") > -1 ? true : false}>
                                                Organization Chart
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                ) : null}
                                {documentEnabled && <Nav.Item>
                                    <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/documents/${identity_id}/${account_id}`}>
                                        <Nav.Link
                                            // style={{ color: missingData?.missingDocuments?.length > 0 ? "orange" : "" }}
                                            href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/documents/${identity_id}/${account_id}`}
                                            active={history.pathname.indexOf("documents") > -1 ? true : false}
                                        >
                                            KYC Documents
                                        </Nav.Link>
                                    </Link>
                                </Nav.Item>}
                                {((accountData?.fund?.meta?.config?.settings?.account?.applicant?.identity?.wallet?.enabled === true || accountData?.fund?.meta?.config?.settings?.account?.applicant?.identity?.wallet?.enabled === "true") || (accountData?.fund?.meta?.config?.settings?.account?.applicant?.identity?.bank?.enabled === true || accountData?.fund?.meta?.config?.settings?.account?.applicant?.identity?.bank?.enabled === "true")) ?
                                    <Nav.Item>
                                        <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/wallets/${identity_id}/${account_id}`}>
                                            <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/wallets/${identity_id}/${account_id}`} active={history.pathname.indexOf("wallets") > -1 ? true : false}>
                                                Banks/Wallets
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    : null
                                }
                                {faceVerificationEnabled ?
                                    <Nav.Item>
                                        <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/face-verification/${identity_id}/${account_id}`}>
                                            <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/face-verification/${identity_id}/${account_id}`} active={history.pathname.indexOf("face-verification") > -1 ? true : false}>
                                                Face Verification
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    : null

                                }
                                {vcipEnabled ?
                                    <Nav.Item>
                                        <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/vcip/${identity_id}/${account_id}`}>
                                            <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/vcip/${identity_id}/${account_id}`} active={history.pathname.indexOf("vcip") > -1 ? true : false}>
                                                VCIP
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    : null

                                }
                                {/* {
                                ((!(status == "DRAFT") &&  handleCheckPermissionScreen) )&& (
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
                                                style={{ color: !props?.riskAssessmentStatusTab ? "orange" : "" }}
                                                // disabled={missingData?.missingDocuments?.length > 0 || missingData?.missingIdentityFields?.length > 0}
                                                active={history.pathname.indexOf("screening") > -1 ? true : false}
                                            >
                                                Screening
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                )}
                                <Nav.Item>
                                    <Link onClick={(e) => { handleRedirectToCompliance(e) }} to={""}>
                                        <Nav.Link
                                            active={history.pathname.indexOf("compliance") > -1 ? true : false}>
                                            Compliance
                                        </Nav.Link>
                                    </Link>
                                </Nav.Item>
                                {((!(status == "DRAFT") &&  handleCheckPermissionRisk) )&& (
                                    <Nav.Item>
                                        <Link
                                            disabled={!props?.riskAssessmentStatusTab}
                                            style={{ cursor: !props?.riskAssessmentStatusTab ? "not-allowed" : "" }}
                                            className={!props?.riskAssessmentStatusTab ? "disabled-link" : ""}
                                            onClick={(e) => {
                                                handleRedirectToRiskAssessment(e);
                                            }}
                                            to={""}
                                        >
                                            <Nav.Link
                                                style={{ color: !props?.riskAssessmentStatusTab ? "orange" : "", cursor: !props?.riskAssessmentStatusTab ? "not-allowed" : "" }}
                                                active={history.pathname.indexOf("risk-assessment") > -1 ? true : false}
                                            >
                                                Risk Assessments
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                )} */}
                                <Nav.Item>
                                    <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/subscriptions/${identity_id}/${account_id}`}>
                                        <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/subscriptions/${identity_id}/${account_id}`} active={history.pathname.indexOf("subscriptions") > -1 ? true : false}>
                                            Subscriptions
                                        </Nav.Link>
                                    </Link>
                                </Nav.Item>
                                {isShowManualTransaction && VIEW_TRANSACTION_DETAIL && (
                                    <Nav.Item>
                                        <Link to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/transactions/${identity_id}/${account_id}`}>
                                            <Nav.Link href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/transactions/${identity_id}/${account_id}`} active={history.pathname.indexOf("transactions") > -1 ? true : false}>
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
                                    <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                        <Button className="lift">Create New Identity</Button>
                                    </Dropdown.Toggle>
                                    {console.log(identity_id, "identity_id")}
                                    {identity_id ? (
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/profile/identity/individual/summary">Individual</Dropdown.Item>
                                            <Dropdown.Item href="/profile/identity/corporate/summary">Corporate</Dropdown.Item>
                                            <Dropdown.Item href="/profile/identity/digital-wallet/summary">Digital Wallet</Dropdown.Item>
                                            <Dropdown.Item href="/profile/identity/bank-account/summary">Bank Account</Dropdown.Item>
                                        </Dropdown.Menu>
                                    ) : (
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/profile/identity/individual/particular">Individual</Dropdown.Item>
                                            <Dropdown.Item href="/profile/identity/corporate/particular">Corporate</Dropdown.Item>
                                            <Dropdown.Item href="/profile/identity/digital-wallet/particular">Digital Wallet</Dropdown.Item>
                                            <Dropdown.Item href="/profile/identity/bank-account/particular">Bank Account</Dropdown.Item>
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
