import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import FeatherIcon from "feather-icons-react";
import { FaUserPlus } from "react-icons/fa";
import { format } from "date-fns";
import { checkPermissions } from "../helpers";
import {
  Col,
  Nav,
  Row,
  Button,
  Dropdown,
  Modal,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import {
  fetchDomainReport,
  getResultSearchIdentity,
} from "../api/network/administrationApi/administrationAPI";
import axios from "axios";
// import LoadingSpinner from "../widgets/bootstrap-component/Spinner";
import {
  postIdentityAttatchWithFund,
  postIdentityList,
} from "../api/network/administrationApi/administrationAPI";
import FundBox from "./fund-box";
import EntityIcon from "../../src/icons/entity-icon-small.svg";
// import CustomAlert from "./bootstrap-component/Alert";
// var theme = localStorage.getItem("portal_theme");
// import CreateIdentity from "../pages/administration-portal/kyc/create-identity";
import { RiAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";
// import SpinnerWithBackDrop from "./bootstrap-component/SpinnerWithBackDrop";
import Loader from "../components/ui/loader/index";
import { HiDownload } from "react-icons/hi";

export default function KycDynamicHeader({ ...props }) {
  const fundConfig = useSelector((state) => state?.fundConfig);
  // const fundConfig = {};
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  const history = useLocation();
  const params = useParams();
  const [modalShowOption, setModalShowOption] = useState(false);
  const [modalShowOptionIdentities, setModalShowOptionIdentities] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermMsg, setSearchTermMsg] = useState("");
  const [searchTermForCheck, setSearchTermForCheck] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIdentityId, setSelectedIdentityId] = useState(null);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [jointAccountIsEnabled, setJointAccountIsEnabled] = useState(false);
  const [fundData, setFunData] = useState(props?.fundDetail);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [isSetSearchResult, setSetSearchResult] = useState(false);
  const [selectedIdentityIndex, setSelectedIdentityIndex] = useState(null);
  const [isAddNewIdentity, setIsAddNewIdentity] = useState(false);
  const [emailFieldsForJointAccount, setEmailFieldsForJointAccount] = useState([
    "",
  ]);
  const [hasNavigated, setHasNavigated] = useState(false); // State to track if navigation has occurred

  const [clickSearchTerm, setClickSearchTerm] = useState(false);
  const [clickIdentities, setClickIdentities] = useState(false);
  const [clickCreataeAccount, setClickCreataeAccount] = useState(false);
  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalAccountCount, setTotalAccountCount] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const forExpiringDocument = checkPermissions("EXPIRED_DOCUMENT_LIST");
  const forOngoingDueDiligence = checkPermissions(
    "ON_GOING_DUE_DILIGENCE_READ"
  );
  const forPeriodicReview = checkPermissions("PERIODIC_REVIEW_LIST");
  const forCreateCustomer = checkPermissions("CUSTOMER_CREATE");
  console.log("forExpiringDocument", forExpiringDocument);
  // const [selectedIdentityaa, setSelectedIdentityaa] = useState(null);
  const [identities, setIdentities] = useState(null);

  useEffect(() => {
    console.log("props fundConfig", fundConfig);
  }, []);

  useEffect(() => {
    navigateBasedOnFundConfig();
  }, [navigateBasedOnFundConfig, params]);

  const navigateBasedOnFundConfig = useCallback(() => {
    if (hasNavigated) return; // If navigation has already occurred, do nothing

    if (
      fundConfig &&
      typeof fundConfig === "object" &&
      Object.keys(fundConfig).length > 0
    ) {
      const currentRoute = window.location.href;
      const routes = [
        {
          routeKeyword: "account", // Higher priority
          condition: fundConfig.config?.modules?.kyc?.Accounts,
          permission: true,
          url: `/${params?.fund_id}/kyc/account/list`,
        },
        {
          routeKeyword: "expiring-document",
          condition:
            fundConfig.config?.modules?.kyc?.Expiring_Documents &&
            forExpiringDocument,
          permission: forExpiringDocument,
          url: `/${params?.fund_id}/kyc/expiring-document/list`,
        },
        {
          routeKeyword: "periodic-review",
          condition:
            fundConfig.config?.modules?.kyc?.Periodic_Review &&
            forPeriodicReview,
          permission: forPeriodicReview,
          url: `/${params?.fund_id}/kyc/periodic-review/list`,
        },
        {
          routeKeyword: "due-diligence",
          condition:
            fundConfig.config?.modules?.kyc?.Due_Diligence &&
            forOngoingDueDiligence,
          permission: forOngoingDueDiligence,
          url: `/${params?.fund_id}/kyc/due-diligence/list`,
        },
        {
          routeKeyword: "quick-scan", // Lower priority
          condition: fundConfig.config?.modules?.kyc?.Quick_Scan,
          permission: true,
          url: `/${params?.fund_id}/kyc/quick-scan/list`,
        },
      ];

      if (params?.quick_scan_detail_id) {
        const newUrl = `/${params?.fund_id}/kyc/quick-scan-detail/${params?.quick_scan_detail_id}`;
        if (currentRoute !== newUrl) {
          navigate(newUrl);
          setHasNavigated(true); // Set the flag after navigating
        }
        return;
      }

      // Check permission for the current route first, now in the new order
      for (const route of routes) {
        if (
          currentRoute.includes(route.routeKeyword) &&
          route.condition &&
          route.permission
        ) {
          if (currentRoute !== route.url) {
            navigate(route.url);
            setHasNavigated(true); // Set the flag after navigating
          }
          return;
        }
      }

      // If permission for the current route is not granted, check other routes in the new order
      for (const route of routes) {
        if (route.condition && route.permission) {
          if (currentRoute !== route.url) {
            navigate(route.url);
            setHasNavigated(true); // Set the flag after navigating
          }
          return;
        }
      }

      const defaultURL = `/${params?.fund_id}/dashboard`;
      if (currentRoute !== defaultURL) {
        navigate(defaultURL);
        setHasNavigated(true); // Set the flag after navigating
      }
    }
  }, [
    fundConfig,
    params,
    forExpiringDocument,
    forPeriodicReview,
    forOngoingDueDiligence,
    navigate,
    hasNavigated,
  ]);

  // useEffect(()=>{
  //   console.log(`this is the start ${forOngoingDueDiligence} - ${params} - ${fundConfig} - ${forExpiringDocument} - ${forPeriodicReview}`)
  //   //fundConfig, params, forExpiringDocument, forPeriodicReview, forOngoingDueDiligence

  // },[forOngoingDueDiligence, params,forPeriodicReview ,fundConfig,forExpiringDocument])

  // useEffect(() => {
  //   navigateBasedOnFundConfig();
  // }, []);

  // const navigateBasedOnFundConfig = () => {
  //   console.log("whole url", window.location.href);
  //   if (fundConfig && typeof fundConfig === "object" && Object.keys(fundConfig).length > 0) {
  //     const currentRoute = window.location.href;
  //     // Define the possible routes based on permissions and configurations
  //     const routes = [
  //       {
  //         routeKeyword: "account",
  //         condition: fundConfig.config?.modules?.kyc?.Accounts,
  //         permission: true,
  //         url: `/${params?.fund_id}/kyc/account/list`,
  //       },
  //       {
  //         routeKeyword: "expiring-document",
  //         condition: fundConfig.config?.modules?.kyc?.Expiring_Documents && forExpiringDocument,
  //         permission: forExpiringDocument,
  //         url: `/${params?.fund_id}/kyc/expiring-document/list`,
  //       },
  //       {
  //         routeKeyword: "periodic-review",
  //         condition: fundConfig.config?.modules?.kyc?.Periodic_Review && forPeriodicReview,
  //         permission: forPeriodicReview,
  //         url: `/${params?.fund_id}/kyc/periodic-review/list`,
  //       },
  //       {
  //         routeKeyword: "due-diligence",
  //         condition: fundConfig.config?.modules?.kyc?.Due_Diligence && forOngoingDueDiligence,
  //         permission: forOngoingDueDiligence,
  //         url: `/${params?.fund_id}/kyc/due-diligence/list`,
  //       },
  //       {
  //         routeKeyword: "quick-scan",
  //         condition: fundConfig.config?.modules?.kyc?.Quick_Scan,
  //         permission: true, // No specific permission check for Quick_Scan
  //         url: `/${params?.fund_id}/kyc/quick-scan/list`,
  //       },
  //     ];

  //     // Check the specific route first

  //     if (params?.quick_scan_detail_id) {

  //       navigate(`/${params?.fund_id}/kyc/quick-scan-detail/${params?.quick_scan_detail_id}`);
  //       return;
  //     }

  //     // Check permission for the current route first
  //     for (const route of routes) {
  //       if (currentRoute.includes(route.routeKeyword) && route.condition && route.permission) {
  //         navigate(route.url);
  //         return;
  //       }
  //     }
  //     // If permission for the current route is not granted, check other routes
  //     for (const route of routes) {
  //       if (route.condition && route.permission) {
  //         navigate(route.url);
  //         return;
  //       }
  //     }
  //     // If none of the conditions are met, navigate to the default route
  //     const defaultURL = `/${params?.fund_id}/dashboard`;
  //     navigate(defaultURL);
  //   }
  // };

  // const navigateBasedOnFundConfig = () => {
  //   console.log("whole url", window.location.href);

  //   if (fundConfig && typeof fundConfig === "object" && Object.keys(fundConfig).length > 0) {
  //     const currentRoute = window.location.href;

  //     // Define the possible routes based on permissions and configurations
  //     const routes = [
  //       {
  //         routeKeyword: "account",
  //         condition: fundConfig.config?.modules?.kyc_child?.Accounts,
  //         permission: true,
  //         url: `/${params?.fund_id}/kyc/account/list`,
  //       },
  //       {
  //         routeKeyword: "expiring-document",
  //         condition: fundConfig.config?.modules?.kyc_child?.Expiring_Documents && forExpiringDocument,
  //         permission: forExpiringDocument,
  //         url: `/${params?.fund_id}/kyc/expiring-document/list`,
  //       },
  //       {
  //         routeKeyword: "periodic-review",
  //         condition: fundConfig.config?.modules?.kyc_child?.Periodic_Review && forPeriodicReview,
  //         permission: forPeriodicReview,
  //         url: `/${params?.fund_id}/kyc/periodic-review/list`,
  //       },
  //       {
  //         routeKeyword: "due-diligence",
  //         condition: fundConfig.config?.modules?.kyc_child?.Due_Diligence && forOngoingDueDiligence,
  //         permission: forOngoingDueDiligence,
  //         url: `/${params?.fund_id}/kyc/due-diligence/list`,
  //       },
  //       {
  //         routeKeyword: "quick-scan",
  //         condition: fundConfig.config?.modules?.kyc_child?.Quick_Scan,
  //         permission: true, // No specific permission check for Quick_Scan
  //         url: `/${params?.fund_id}/kyc/quick-scan/list`,
  //       },
  //     ];

  //     // Check permission for the current route first
  //     for (const route of routes) {
  //       if (currentRoute.includes(route.routeKeyword) && route.condition && route.permission) {
  //         navigate(route.url);
  //         return;
  //       }
  //     }

  //     // If permission for the current route is not granted, check other routes
  //     for (const route of routes) {
  //       if (route.condition && route.permission) {
  //         navigate(route.url);
  //         return;
  //       }
  //     }

  //     // If none of the conditions are met, navigate to the default route
  //     const defaultURL = `/${params?.fund_id}/dashboard`;
  //     navigate(defaultURL);
  //   }
  // };

  const handleSubmitRequestCustomer = (e) => {
    setShowModal(true);
  };
  const handleSubmitCall = (e) => {
    postIdentityAttatchWithFundApi("customer");
  };

  const handleSelectIdentity = (item) => {
    setSelectedIdentity(item);
    // setSelectedIdentityId(id);
    setActiveStep(2);
    setIsAddNewIdentity(false);
  };

  const postIdentityAttatchWithFundApi = async (portal = "admin") => {
    setShowModal(false);
    setClickCreataeAccount(true);
    const data = {
      joint_account: jointAccountIsEnabled,
      fund_id: localStorage.getItem("name_id"),
      share_holder_count:
        emailFieldsForJointAccount.length == 0
          ? 1
          : emailFieldsForJointAccount.length,
      joint_account_emails: jointAccountIsEnabled
        ? emailFieldsForJointAccount
        : [],
    };
    const response = await postIdentityAttatchWithFund(
      selectedIdentity?.id,
      data,
      cancelTokenSource.token
    );
    console.log("checking response", response);
    if (response.success == true) {
      setClickCreataeAccount(false);
      // let accountId = response?.data?.accountId;
      if (portal == "customer") {
        let port = "";
        console.log(window.location.port, "location.port");
        if (window.location.port) {
          port = ":" + window.location.port;
        }

        const url = new URL(window.location.href);
        const domain = url.hostname.split(".").slice(-2).join(".");
        let hostName = window.location.hostname;

        let subDomain = hostName.split(".");

        subDomain = subDomain[0];

        let extractEnv = subDomain.split("-");
        let environment = null;

        if (extractEnv.length > 0 && extractEnv != subDomain) {
          environment = extractEnv[0] + "-";
        } else {
          environment = "";
        }
        console.log("response?.data?.accountId", response?.data?.accountId);
        console.log("customer urlnt?.id", url);
        localStorage.setItem("entity_id", selectedIdentity?.entityId);
        // debugger;
        document.cookie = `entity_id=${selectedIdentity?.entityId};domain=${domain};path=/`;
        document.cookie = `key=${selectedIdentity?.entityId};domain=${domain};path=/`;
        // return;
        {
          selectedIdentity?.type.toLowerCase() == "individual"
            ? (window.location.href = `${
                window.location.protocol
              }//${environment}customer.${domain}${port}/profile/identity/${selectedIdentity?.type.toLowerCase()}/documents/${
                response?.data?.identityId
              }/${response?.data?.accountId}?refresh=yes`)
            : (window.location.href = `${
                window.location.protocol
              }//${environment}customer.${domain}${port}/profile/identity/${selectedIdentity?.type.toLowerCase()}/organization-chart/${
                response?.data?.identityId
              }/${response?.data?.accountId}?refresh=yes`);
        }
      } else {
        navigate(`/${params?.fund_id}/kyc/account/list`);
      }
      handleAlert({
        variant: "success",
        message: "Identity created successfully",
        show: true,
        hideAuto: true,
      });
      props?.getAccountDetail();
      setModalShowOption(false);
      clearData();
    } else {
      setClickCreataeAccount(false);

      handleAlert({
        variant: "danger",
        message: response?.user_message,
        show: true,
        hideAuto: true,
      });
    }
  };
  const postEntityListApi = async (identity) => {
    setClickIdentities(true);
    const data = {
      entityId: identity?.entityId,
    };
    const response = await postIdentityList(data, cancelTokenSource.token);
    // const response = await postIdentityList(identity?.entityId, cancelTokenSource.token);
    console.log("checking response", response);
    if (response.success == true) {
      setClickIdentities(false);

      setIdentities(response.data);
    } else {
      setClickIdentities(false);

      handleAlert({
        variant: "danger",
        message: response?.user_message,
        show: true,
        hideAuto: true,
      });
    }
  };

  // const handleCheckboxChange = (index) => {
  //   setSelectedIdentityIndex(index);
  //   setSelectedIdentity(searchResults[index]);
  //   // setSelectedIdentityId(searchResults[index].id);
  // };

  const isIdentitySelected = (index) => {
    return selectedIdentityIndex === index;
  };
  const isSearchTermMatching = (searchTerm, entityTitle) => {
    if (!entityTitle) {
      return false;
    }
    return entityTitle.toLowerCase().includes(searchTermForCheck.toLowerCase());
  };
  const handleRowClick = (identityId) => {
    setSelectedIdentity(identityId);
    // setSelectedIdentityId(identityId.id);
    console.log("abc");
  };

  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  useEffect(
    function () {
      if (searchResults && totalAccountCount != 0) {
        let totalRecords = totalAccountCount;
        let numberOfPages = totalRecords / rowsPerPage;
        let roundedUp = Math.ceil(numberOfPages);
        let resultArray = [];
        for (let i = 1; i <= roundedUp; i++) {
          resultArray.push(i);
        }
        setPageOptions(resultArray);
      }
    },
    [searchResults, totalAccountCount]
  );
  useEffect(() => {
    console.log("selectedIdentity", selectedIdentity);
  }, [selectedIdentity]);
  const handleClickPrevious = (e) => {
    setPageIndex(pageIndex - 1);
  };
  const handleClickNext = (e) => {
    setPageIndex(pageIndex + 1);
  };
  const gotoPage = (page) => {
    setPageIndex(page);
  };

  const handleJointAccout = (event) => {
    setJointAccountIsEnabled(event.target.checked);
    if (event.target.checked == false) {
      setEmailFieldsForJointAccount([""]);
    }
  };

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const performSearch = async () => {
    setSearchTermMsg(searchTerm);
    setSearchTermForCheck(searchTerm);
    setSetSearchResult(false);
    setClickSearchTerm(true);
    const response = await getResultSearchIdentity(
      searchTerm,
      params?.fund_id,
      cancelTokenSource.token
    );

    if (response.success) {
      setSearchResults(response?.data?.identities);
      setTotalAccountCount(response?.data?.identities?.length);
      setClickSearchTerm(false);
      if (response?.data?.identities?.length < 1) {
        setSetSearchResult(true);
      }
    } else {
      handleAlert({
        variant: "danger",
        message: response?.user_message,
        show: true,
        hideAuto: true,
      });
    }
  };
  const handleClickAddNewIdentity = (item) => {
    setModalShowOptionIdentities(true);

    setSelectedIdentity(item);
    postEntityListApi(item);
  };
  const clearData = () => {
    setSearchResults([]);
    setSetSearchResult(false);
    setActiveStep(1);
    setIsAddNewIdentity(false);
    setSearchTerm("");
  };

  // let identity_id_value = '';
  // if (params.identity_id) {
  //     identity_id_value = '/' + params.identity_id
  // }
  // if (params.account_id) {
  //     identity_id_value = identity_id_value + '/' + params.account_id
  // }
  const handleCloseModal = () => {
    setModalShowOption(false);
    clearData();
  };
  const handleCloseModalIdentities = () => {
    setModalShowOptionIdentities(false);
    setIdentities(null);
    setSelectedIdentity(null);
  };

  const handleSubmitRequest = (e) => {
    postIdentityAttatchWithFundApi();
  };

  // const handleCheckboxChange = (index) => {
  //   setSelectedIdentityIndex(index);
  //   setSelectedIdentity(searchResults[index]);
  //   // setSelectedIdentityId(searchResults[index].id);
  // };

  const stepOne = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          <h6 className="mb-4 text-uppercase text-muted">
            Step {activeStep} of 2
          </h6>
          <h1 className="mb-3">Select or Create New Customer Identity</h1>
          <p className="mb-5 text-muted">
            You may use the search box to find an existing customer identity. If
            you wish to create a new customer identity, you may click on the
            “Add New Customer” Button
          </p>
        </Col>
      </Row>

      <div className="row">
        <label className="form-label">Search Customer Identity</label>
        <div className="col-sm-12">
          <div className="form-group">
            <div class="row">
              <div class="col-md-12">
                <div class="d-grid gap-2 col-12 mx-auto">
                  <div className="row mb-3">
                    <div className="col-sm-12 col-md-8 mb-2 mb-md-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>

                    <div className="col-sm-12 col-md-2 text-center">
                      <button
                        className="btn btn-outline-secondary w-100 w-md-95"
                        disabled={searchTerm?.length > 2 ? false : true}
                        onClick={performSearch}
                      >
                        Search
                      </button>
                    </div>
                    <div className="col-sm-12 col-md-2 text-center">
                      <button
                        onClick={() => setIsAddNewIdentity(true)}
                        className="btn btn-primary w-100 w-md-95"
                      >
                        Add New Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Display search results */}
          {clickSearchTerm ? (
            // <LoadingSpinner animation="grow" custom={true} height="13em" />
            <Loader />
          ) : (
            searchResults.length > 0 && (
              <div
                style={{
                  border: "1px solid white",
                  maxHeight: "19em",
                  overflow: "auto",
                }}
                className="table-responsive"
              >
                <table className="table table-sm table-nowrap card-table">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "white",
                    }}
                  >
                    <tr>
                      {/* <th></th> Empty column for checkboxes */}
                      <th>Name</th>
                      <th>Origin</th>
                      <th>Created Date</th>
                      <th>Identity Label</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: isIdentitySelected(index)
                              ? "#6d89ae"
                              : "inherit",
                          }}
                        >
                          {/* <td>
                            <input type="checkbox" checked={isIdentitySelected(index)} onChange={() => handleCheckboxChange(index)} />
                          </td> */}
                          <td>{item?.name}</td>
                          <td>
                            <span>{item?.entity?.meta?.origin?.mode}</span>
                          </td>
                          <td>
                            <span>
                              {item?.createdAt
                                ? format(new Date(item.createdAt), "MM/dd/yyyy")
                                : "N/A"}
                            </span>
                          </td>
                          <td>
                            <span>{item?.label}</span>
                          </td>
                          <td>{item?.type}</td>
                          <td>{item?.status}</td>
                          <td>
                            {/* {isSearchTermMatching(searchTerm, item?.entity?.title) && (
                              <Button onClick={() => handleClickAddNewIdentity(item)} className="btn btn-sm btn-white w-100 mb-3">
                                <FeatherIcon icon="plus" color="green" size="14" />
                                Add new Identity
                              </Button>setIdentities
                            )} */}
                            {/* <Button onClick={() => handleClickAddNewIdentity(item)} className="btn btn-sm  w-100 mb-3"
                              style={{ backgroundColor: item?.useable == 'valid' ? "green" : item?.useable == false ? "orange" : "red" }}
                              disabled={item?.useable != 'valid'}
                            >
                              Use This Identity
                            </Button> */}
                            {/* <Button
                            onClick={() => handleClickAddNewIdentity(item)}
                            className="btn btn-sm w-100 mb-3"
                            style={{
                              // backgroundColor: item?.useable === 'valid' ? "green" : item?.useable === false ? "orange" : "red",
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            variant='outlined'
                            disabled={item?.useable !== 'valid'}
                          >
                            <FaUserPlus style={{ marginRight: '5px', backgroundColor: item?.useable === 'valid' ? "green" : item?.useable === false ? "orange" : "red",
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px'}} disabled={item?.useable !== 'valid'} />
                          </Button> */}
                            <Button
                              onClick={() => handleClickAddNewIdentity(item)}
                              className="btn btn-sm w-100 mb-3"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              variant="outlined"
                              disabled={item?.useable !== "valid"}
                            >
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    item?.useable === "valid"
                                      ? "green"
                                      : item?.useable === false
                                      ? "orange"
                                      : "red",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "5px",
                                }}
                              >
                                <FaUserPlus
                                  style={{ fontSize: "20px", color: "white" }}
                                />
                              </div>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", paddingTop: "15px" }}
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          )}
          {isSetSearchResult && (
            <div
              className="list-group"
              style={{
                border: "1px solid white",
                padding: "2px",
                overflow: "scroll",
                cursor: "pointer",
              }}
            >
              No data found for "{searchTerm}".
            </div>
          )}
        </div>
        {/* <div className="col-sm-12 py-3">
          <div className="card bg-light border">
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <h4 className="mb-2">
                <span className="text-info">
                  <FeatherIcon className={`text-info`} icon="alert-triangle" size="15" />
                </span>
                Instructions
              </h4>
              <p className="small text mb-0">Please use the search box to find existing identities. For adding new identities, search with a minimum of three characters and choose the desired entity,for adding new</p>
            </div>
          </div>
        </div> */}
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
            Cancel
          </Button>
        </Col>
        <Col className="text-center">
          <h6 className="text-uppercase text-muted mb-0">
            Step {activeStep} of 2
          </h6>
        </Col>
        <Col xs="auto">
          <Button
            disabled={selectedIdentity == null ? true : false}
            size="lg"
            onClick={(e) => setActiveStep(activeStep + 1)}
          >
            Continue
          </Button>
        </Col>
      </Nav>
    </>
  );
  // const stepTwo = (
  //   <>
  //     <Row className="justify-content-center">
  //       <Col xs={12} md={10} lg={8} xl={6} className="text-center">
  //         <h6 className="mb-4 text-uppercase text-muted">Step {activeStep} of 3</h6>
  //         <h1 className="mb-3">Specify the account type, you would like to setup.</h1>
  //         <p className="mb-5 text-muted">Please confirm if this account is a Single or Joint Account. </p>
  //       </Col>
  //     </Row>
  //     <div className="row">
  //       <div className="col-12 col-md-6">
  //         <div className="form-group">
  //           <label className="form-label mb-1">Joint Account</label>
  //           <small className="form-text text-muted">Enable, if this is a joint application</small>

  //           <div className="form-check form-switch">
  //             <input className="form-check-input" id="switchOne" type="checkbox" disabled={fundData?.fund_setting?.account?.max_share_holder > 1 ? false : true} checked={jointAccountIsEnabled} onChange={(event) => handleJointAccout(event)} />
  //             <label className="form-check-label" htmlFor="switchOne">
  //               Enable
  //             </label>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="col-12 col-md-6">
  //         <div className="card bg-light border">
  //           <div className="card-body">
  //             <h4 className="mb-2">
  //               <span class="text-warning">
  //                 <FeatherIcon icon="alert-triangle" size="15" />
  //               </span>{" "}
  //               Warning
  //             </h4>

  //             <p className="small text-muted mb-0">Once an account is made. you cannot change the identity which is attached to it, and its type (i.e. Single Joint).</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <hr className="my-5" />
  //     {fundData?.fund_setting?.account?.max_share_holder <= 1 ? (
  //       <div className="mt-5">
  //         <p style={{ color: "orange" }}>
  //           Joint Account Disabled for the Fund <strong>{fundData?.name}</strong>
  //         </p>
  //       </div>
  //     ) : (
  //       !jointAccountIsEnabled && (
  //         <div className="mt-5">
  //           <p style={{ color: "orange" }}>please enable joint account to add emails</p>
  //         </div>
  //       )
  //     )}
  //     {jointAccountIsEnabled
  //       ? emailFieldsForJointAccount.map((email, index) => (
  //           <div key={index} className="form-group">
  //             <label className="form-label">Add partner emails to send them an invite</label>
  //             <Row
  //               style={{
  //                 justifyContent: "space-between",
  //                 alignItems: addMoreDisabled ? "start" : "end",
  //               }}
  //             >
  //               <Col>
  //                 <input className="form-control" placeholder="Partner Email" type="email" value={email} onChange={(event) => handleEmailChange(event, index)} />
  //                 {errorEmails.map((item, i) => {
  //                   if (index == i && item == "Invalid Email") {
  //                     return (
  //                       <p
  //                         style={{
  //                           color: "red",
  //                           marginTop: "2px",
  //                           marginLeft: "15px",
  //                         }}
  //                       >
  //                         Please Enter Valid Email
  //                       </p>
  //                     );
  //                   } else {
  //                     return null;
  //                   }
  //                 })}
  //                 {errorEmails.map((item, i) => {
  //                   if (index == i && item == "Email already exists") {
  //                     return (
  //                       <p
  //                         style={{
  //                           color: "red",
  //                           marginTop: "2px",
  //                           marginLeft: "15px",
  //                         }}
  //                       >
  //                         Please Enter Unique Email
  //                       </p>
  //                     );
  //                   } else {
  //                     return null;
  //                   }
  //                 })}
  //               </Col>
  //               {emailFieldsForJointAccount.length !== 1 ? (
  //                 <Col xs="auto">
  //                   <Button variant="danger" size="sm" onClick={() => handleRemoveEmail(index)}>
  //                     <RiDeleteBin5Line style={{ fontSize: "16px" }} /> Delete
  //                   </Button>
  //                 </Col>
  //               ) : null}
  //               {emailFieldsForJointAccount.length - 1 == index && emailFieldsForJointAccount.length <= fundData?.fund_setting?.applicant?.max_share_holder ? (
  //                 <Col xs="auto">
  //                   <Button disabled={addMoreDisabled} size="sm" onClick={handleAddEmailFieldsForJointAccount}>
  //                     <HiPlusCircle style={{ fontSize: "16px" }} /> Add More
  //                   </Button>
  //                 </Col>
  //               ) : null}
  //             </Row>
  //           </div>
  //         ))
  //       : null}
  //     <hr className="my-5" />
  //     <Nav className="row align-items-center">
  //       <Col xs="auto">
  //         <Button
  //           variant="white"
  //           size="lg"
  //           onClick={() => {
  //             params?.identity_id ? setActiveStep(activeStep - 2) : setActiveStep(activeStep - 1);
  //           }}
  //         >
  //           Back
  //         </Button>
  //       </Col>
  //       <Col className="text-center">
  //         <h6 className="text-uppercase text-muted mb-0">Step {activeStep} of 3</h6>
  //       </Col>
  //       <Col xs="auto">
  //         <Button size="lg" onClick={(e) => setActiveStep(activeStep + 1)}>
  //           Continue
  //         </Button>
  //       </Col>
  //     </Nav>
  //   </>
  // );
  const addNewIdentity = (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="text-center">
          {/* <h1 className="mb-3">Please Fill all the fields, to create {selectedIdentity == null ? "Entity" : "Identity"}.</h1> */}
          <h1 className="mb-3">
            Create New Customer{" "}
            {selectedIdentity == null ? "Entity" : "Identity"}.
          </h1>
          <p className="mb-3">Please complete the below particulars form</p>
        </Col>
      </Row>
      <div>
        {/* {isAddNewIdentity && (
          <CreateIdentity
            isWizard={true}
            title={selectedIdentity == null ? "Entity" : "Identity"}
            selectedIdentity={
              selectedIdentity == null ? "{}" : selectedIdentity
            }
            handleSelectIdentity={
              selectedIdentity == null ? "{}" : handleSelectIdentity
            }
          />
        )} */}
      </div>
      <Nav className="row align-items-center">
        <Col xs="auto">
          <Button
            variant="white"
            size="lg"
            onClick={() => {
              setActiveStep(1);
              setIsAddNewIdentity(false);
            }}
          >
            Back
          </Button>
        </Col>
        <Col className="text-center">
          {selectedIdentity == null ? null : (
            <h6 className="text-uppercase text-muted mb-0">
              Step {activeStep} of 2
            </h6>
          )}
        </Col>
        <Col xs="auto"></Col>
      </Nav>
    </>
  );
  const stepThree = (
    <>
      {clickCreataeAccount ? (
        // <LoadingSpinner animation="grow" custom={true} height="12em" />
        <Loader />
      ) : (
        <>
          {" "}
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6} className="text-center">
              <h6 className="mb-4 text-uppercase text-muted">Step 2 of 2</h6>
              <h1 className="mb-3">Summary</h1>
              <p className="mb-5 text-muted">Review your Information</p>
            </Col>
          </Row>
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
                                            <FeatherIcon
                                              icon="clock"
                                              size="15"
                                            />
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
                        {selectedIdentity ? (
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <a href="#!" className="avatar avatar-lg">
                                {selectedIdentity?.type == "INDIVIDUAL" ? (
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
                                  {selectedIdentity?.label}
                                </p>
                              </h4>
                              <p className="small mb-0">
                                <span className="text-success"> </span>{" "}
                                {selectedIdentity?.type}
                              </p>

                              <p className="small text-muted mb-1">
                                {selectedIdentity?.type.toLowerCase() ==
                                "corporate"
                                  ? "Country of Incorporation: "
                                  : "Citizenship: "}
                                {selectedIdentity?.meta?.data[
                                  selectedIdentity?.type.toLowerCase() +
                                    ".basic.country_of_residence_code"
                                ]?.value
                                  ? selectedIdentity?.meta?.data[
                                      selectedIdentity?.type.toLowerCase() +
                                        ".basic.country_of_residence_code"
                                    ]?.value
                                  : selectedIdentity?.meta?.data[
                                      selectedIdentity?.type.toLowerCase() +
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
            {/* <MissingFields selectedIdentity={selectedIdentity} fundData={fundData}/> */}
          </>
          <hr className="my-5" />
          <Nav className="row align-items-center">
            <Col xs="auto">
              <Button
                variant="white"
                size="lg"
                onClick={() => {
                  setActiveStep(activeStep - 1);
                  setAlertProps({ ...alertProps, show: false });
                  setSelectedIdentity(null);
                  handleCloseModalIdentities();
                }}
              >
                Back
              </Button>
            </Col>
            <Col className="text-center">
              <h6 className="text-uppercase text-muted mb-0">
                Step {activeStep} of 2
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
            {/* <Col xs="auto">
              <Button
                size="lg"
                onClick={(e) => {
                  handleSubmitRequestCustomer(e);
                }}
              >
                Create Account And Continue To Customer Portal
              </Button>
            </Col> */}
          </Nav>
        </>
      )}
      {/* {alertProps.show && (
        <CustomAlert
          top={true}
          handleCloseAlert={handleCloseAlert}
          message={alertProps.message}
          variant={alertProps.variant}
          show={alertProps.show}
          hideAuto={alertProps.hideAuto}
          onClose={() => setAlertProps({ ...alertProps, show: false })}
        >
          {alertProps.message}
        </CustomAlert>
      )} */}
    </>
  );

  const renderOptionModal = (
    // <Modal size="xl" show={modalShowOption} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered backdrop={modalShowOptionIdentities ? "static" : true}>
    <Modal
      size="xl"
      show={modalShowOption}
      onHide={handleCloseModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      {modalShowOptionIdentities && <div className="modal-overlay"></div>}
      <Modal.Header closeButton>
        <Modal.Title>
          <div>{/* <h3>Select Option</h3> */}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid="lg">
          <Row className="justify-content-center">
            <Col xs={12} lg={12} xl={12}>
              {activeStep === 1 && !isAddNewIdentity && stepOne}
              {/* {activeStep === 2 && !isAddNewIdentity && stepTwo} */}
              {activeStep === 2 && !isAddNewIdentity && stepThree}

              {isAddNewIdentity && addNewIdentity}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
  const renderModalOfIdentities = (
    <Modal
      size="lg"
      show={modalShowOptionIdentities}
      onHide={handleCloseModalIdentities}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "rgb(30, 70, 118)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Modal.Title>
          <div>
            <h2 style={{ color: "white" }}>Select Identites</h2>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "rgb(30, 70, 118)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2em",
          }}
        >
          <p style={{ color: "white" }}>
            Choose an identity from the list or create a new one:
          </p>
          <Button
            variant="primary"
            className="add-identity-btn"
            onClick={() => {
              setIsAddNewIdentity(true);
              setModalShowOptionIdentities(false);
            }}
          >
            <RiAddLine className="add-identity-icon" />
            Add New Identity
          </Button>
        </div>
        <div
          style={{
            maxHeight: "20em",
            overflowY: "auto",
            border:
              identities?.length === 0 || identities == null
                ? "none"
                : "1px solid",
          }}
        >
          <Container fluid="lg">
            {identities == null ? (
              // <LoadingSpinner animation="grow" custom={true} height="13em" />
              <Loader />
            ) : identities.length === 0 ? (
              <div style={{ color: "white", textAlign: "center" }}>
                No data available
              </div>
            ) : (
              <Table
                striped
                hover
                variant="light"
                style={{ backgroundColor: "transparent" }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "rgb(30, 70, 118)",
                        color: "white",
                      }}
                    >
                      Select
                    </th>
                    <th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "rgb(30, 70, 118)",
                        color: "white",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "rgb(30, 70, 118)",
                        color: "white",
                      }}
                    >
                      Type
                    </th>
                    <th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "rgb(30, 70, 118)",
                        color: "white",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {identities.map((identity) => (
                    <tr
                      key={identity.id}
                      className={`mb-2 ${
                        selectedIdentity.id === identity.id
                          ? "selected-row"
                          : ""
                      }`}
                      onClick={() => handleRowClick(identity)}
                    >
                      <td style={{ wordWrap: "break-word" }}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedIdentity.id === identity.id}
                          readOnly
                        />
                      </td>
                      <td style={{ wordWrap: "break-word" }}>
                        {identity.label}
                      </td>
                      <td style={{ wordWrap: "break-word" }}>
                        {identity.type}
                      </td>
                      <td style={{ wordWrap: "break-word" }}>
                        {identity.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "rgb(30, 70, 118)",
        }}
      >
        <div>
          <Button variant="danger" onClick={handleCloseModalIdentities}>
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="primary"
            onClick={(e) => {
              setActiveStep(activeStep + 1);
              setModalShowOptionIdentities(false);
              setIdentities(null);
            }}
          >
            Continue
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );

  const handleClickExportEntityData = async () => {
    setIsLoader(true);
    const response = await fetchDomainReport(
      params?.fund_id,
      false,
      cancelTokenSource.token
    );
    if (response.success) {
      if (response?.data?.uuid) {
        const timer = setInterval(async () => {
          const csv = await fetchDomainReport(
            params?.fund_id,
            response?.data?.uuid,
            cancelTokenSource.token
          );
          if (csv?.data?.data?.csvUrl) {
            clearInterval(timer);
            window.open(csv.data.data.csvUrl, "_blank");
            handleAlert({
              variant: "success",
              message: "Download Domain Report Successfully",
              show: true,
              hideAuto: true,
            });
            setIsLoader(false);
          }
        }, 5000);
      }
    } else {
      setIsLoader(false);
      handleAlert({
        variant: "danger",
        message: response?.user_message,
        show: true,
        hideAuto: true,
      });
    }
  };

  return (
    <div className="card-header">
      {/* {alertProps.variant == "success" && (
        <CustomAlert
          top={false}
          handleCloseAlert={handleCloseAlert}
          message={alertProps.message}
          variant={alertProps.variant}
          show={alertProps.show}
          hideAuto={alertProps.hideAuto}
          onClose={() => setAlertProps({ ...alertProps, show: false })}
        >
          {alertProps.message}
        </CustomAlert>
      )} */}
      {isLoader ? (
        // <LoadingSpinner animation="grow" custom={true} height="100%" />
        <Loader />
      ) : (
        <>
          <ul className="nav nav-tabs nav-tabs-sm card-header-tabs me-2">
            {fundConfig?.config?.modules?.kyc?.Accounts && (
              <li className="nav-item">
                <Link
                  to={`/${params?.fund_id}/kyc/account/list`}
                  className={
                    history.pathname.indexOf("account/list") > -1
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Accounts
                </Link>
              </li>
            )}
            {fundConfig?.config?.modules?.kyc?.Expiring_Documents &&
              forExpiringDocument && (
                <li className="nav-item">
                  <Link
                    to={`/${params?.fund_id}/kyc/expiring-document/list`}
                    className={
                      history.pathname.indexOf("expiring-document/list") > -1
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Documents Expiry
                  </Link>
                </li>
              )}
            {fundConfig?.config?.modules?.kyc?.Periodic_Review &&
              forPeriodicReview && (
                <li className="nav-item">
                  <Link
                    to={`/${params?.fund_id}/kyc/periodic-review/list`}
                    className={
                      history.pathname.indexOf("periodic-review/list") > -1
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Periodic Review
                  </Link>
                </li>
              )}
            {fundConfig?.config?.modules?.kyc?.Due_Diligence &&
              forOngoingDueDiligence && (
                <li className="nav-item">
                  <Link
                    to={`/${params?.fund_id}/kyc/due-diligence/list`}
                    className={
                      history.pathname.indexOf("due-diligence") > -1
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Due Diligence
                  </Link>
                </li>
              )}
            {fundConfig?.config?.modules?.kyc?.Quick_Scan && (
              <li className="nav-item">
                <Link
                  to={`/${params?.fund_id}/kyc/quick-scan/list`}
                  className={
                    history.pathname.indexOf("quick-scan") > -1
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  Quick Scan
                </Link>
              </li>
            )}
          </ul>

          {history.pathname.indexOf("account/list") > -1 &&
          forCreateCustomer ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "1em" }}>
                <Button
                  onClick={() => setModalShowOption(true)}
                  className="btn btn-sm btn-white"
                >
                  <FeatherIcon
                    icon="plus"
                    color="green"
                    size="14"
                  ></FeatherIcon>
                  Create Account
                </Button>
              </div>

              <div>
                {" "}
                <Link
                  style={{ marginRight: "1em" }}
                  to={`/${params?.fund_id}/entities/upload`}
                  ///:fund_id/customers/upload
                  className="btn btn-sm btn-white"
                >
                  <FeatherIcon
                    icon="plus"
                    color="green"
                    size="14"
                  ></FeatherIcon>
                  Import Bulk Customer
                </Link>
              </div>
              <div style={{ display: "flex", justifyContent: "end" }}>
                {" "}
                <Button
                  style={{ height: "28px", width: "200px", padding: "0" }}
                  onClick={() => handleClickExportEntityData()}
                >
                  Download Domain Report <HiDownload />
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
      {isLoadingReport && (
        // <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
        <Loader />
      )}

      {showModal && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmation Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textTransform: "capitalize" }}>
              {selectedIdentity?.type == "INDIVIDUAL"
                ? "You will be redirected to the customer portal for uploading the identity's KYC document(s)."
                : "You will be redirected to the customer portal for uploading the identity's Corporate Underlying Parties."}{" "}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmitCall("customer")}
            >
              Proceed
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {modalShowOption && renderOptionModal}
      {modalShowOptionIdentities && renderModalOfIdentities}

      {/* <div className="card-header-icon">{props?.icon}</div> */}
    </div>
  );
}
