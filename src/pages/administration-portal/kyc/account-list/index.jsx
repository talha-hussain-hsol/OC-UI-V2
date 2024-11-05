import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import {
  Col,
  Row,
  Container,
  Pagination,
  Card,
  OverlayTrigger,
  Tooltip,
  Button,
  FormControl,
  InputGroup,
  Dropdown,
  Modal,
} from "react-bootstrap";

import DynamicHeaderAdministration from "../../../../widgets/DynamicHeaderAdministration";

// import checkPermissions from "./../../../../helpers/checkPermissions";
// import formatDateRegionWise from "../../../../helpers/formatDateRegionWise";
import { checkPermissions, formatDateRegionWise } from "../../../../helpers";

import {
  getDownloadAuditReport,
  getAccountListSearch,
  getCustomerInformationReport,
} from "../../../../api/network/AdministrationApi/AdministrationApi";
// import SpinnerWithBackDrop from "../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../../components/ui/loader";
import {
  getAccountListAPI,
  getDownloadCustomerProfileAPI,
  getDownloadCustomerProfilePullAPI,
} from "../../../../api/network/AdministrationApi/AdministrationApi";

import {  FiDisc, FiSearch } from "react-icons/fi";

import KycDynamicHeader from "../../../../widgets/KycDynamicHeader";
import FeatherIcon from "feather-icons-react";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";

import DeleteAccountModal from "./components/DeleteAccountModal";
import { useSelector } from "react-redux";
// import TableComponent from "../../../shared-components/table-components";
import TruncatedText from "./components/TruncatedText";
import { FaDownload, FaEllipsisV, FaUserPlus } from "react-icons/fa";

// import FundList from './components/fundList';
export default function AccountList({ ...props }) {
  const params = useParams();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const fundDetail = useSelector((state) => state?.fundConfig);

  const [isLoader, setIsLoader] = useState(false);
  const [initialPageLoaded, setInitialPageLoaded] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const [accountList, setAccountList] = useState(false);
  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalAccountCount, setTotalAccountCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [items, setItems] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const handleCloseModal = () => setDeleteConfirmationModal(false);
  const entityId = localStorage.getItem("entity_id");
  const MANAGE_ALL_CUSTOMERS = checkPermissions("MANAGE_ALL_CUSTOMERS");
  const handleOpenDetailModal = (item) => {

    console.log("dajdsajsdasd", item);
    setItems(item);
    setShowDetailModal(true);
  };
  const handleCloseDetailModal = () => {
    console.log("handler");
    setShowDetailModal(false);
  };

  const gotoPage = (page) => {
    setPageIndex(page);
  };
  function removeEntityIdFromCookie(keyValue) {
    // Step 1: Parse the cookie string and create an object to store key-value pairs
    let cookieData = document.cookie;
    const keyValuePairs = cookieData.split("; ");

    const cookieObject = {};
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      cookieObject[key] = value;
    });

    // Step 2: Filter out the 'entity_id' key
    delete cookieObject[keyValue];

    // Step 3: Reconstruct the cookie string without the 'entity_id' key
    const filteredKeyValuePairs = Object.entries(cookieObject).map(
      ([key, value]) => `${key}=${value}`
    );
    const filteredCookieString = filteredKeyValuePairs.join("; ");

    return filteredCookieString;
  }

  const handleClickIdentity = useCallback((data) => {
    console.log("vghvhvghfthfy", data);
    removeEntityIdFromCookie("entity_id");
    removeEntityIdFromCookie("key");
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");
    localStorage.setItem(
      "entity_id",
      data?.identity?.entity?.id
    );
    document.cookie = `entity_id=${data?.identity?.entity?.id};domain=${domain};path=/`;
    document.cookie = `key=${data?.identity?.entity?.id};domain=${domain};path=/`;
    let port = "";
    if (window.location.port) {
      port = ":" + window.location.port;
    }

    let hostName = window.location.hostname;

    let subDomain = hostName.split(".");

    subDomain = subDomain[0];

    let extractEnv = subDomain.split("-");
    let environment = null;

    if (extractEnv.length > 0 && extractEnv[0] !== subDomain) {
      environment = extractEnv[0] + "-";
    } else {
      environment = "";
    }
    window.location.href = `${window.location.protocol}//${environment}${data?.identity?.entity?.type}.${domain}${port}/subscription-list?refresh=yes&entity_id=${data?.identity?.entity?.id}`;
  }, []);
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  useEffect(() => {
    if (params?.fund_id && pageIndex !== undefined && pageIndex !== null) {
      getAccountList();
    }
  }, [pageIndex, params?.fund_id]);

  useEffect(() => {
    if (Array.isArray(fundDetail) && fundDetail === null && !accountList) {
      setIsLoader(true);
    } else {
      if (accountList) {
        setIsLoader(false);
      } else {
        setIsLoader(true);
      }
    }
  }, [fundDetail]);
  useEffect(
    function () {
      if (accountList && totalAccountCount != 0) {
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
    [accountList, totalAccountCount]
  );

  useEffect(() => {
    // Make an initial call to load the correct page data
    if (!initialPageLoaded) {
      gotoPage(pageIndex);
    }
  }, [pageIndex, initialPageLoaded, gotoPage]);

  const maxVisiblePages = 5;

  const renderPageItems = () => {
    let items = [];
    const totalPages = pageOptions.length;

    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        i === pageIndex ||
        (i >= pageIndex - Math.floor(maxVisiblePages / 2) &&
          i <= pageIndex + Math.floor(maxVisiblePages / 2))
      ) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === pageIndex}
            onClick={(e) => {
              e.preventDefault();
              gotoPage(i);
            }}
          >
            {i + 1}
          </Pagination.Item>
        );
      } else if (
        (i === pageIndex - Math.floor(maxVisiblePages / 2) - 1 &&
          pageIndex > Math.floor(maxVisiblePages / 2)) ||
        (i === pageIndex + Math.floor(maxVisiblePages / 2) + 1 &&
          pageIndex < totalPages - Math.floor(maxVisiblePages / 2))
      ) {
        items.push(<Pagination.Ellipsis key={i} />);
      }
    }

    return items;
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };


  const isShowRedDotForMisMatchedStatus = (shareHolder, status) => {
    console.log(shareHolder, "shareHolder");
    // return;
    if (
      shareHolder?.applicationStatusId.toLowerCase() != "pending" &&
      shareHolder?.applicationStatusId.toLowerCase() != "draft"
    ) {
      if (
        shareHolder?.applicationStatusId.toLowerCase() !=
        status.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const getAccountList = async () => {
    setIsLoader(true);
    let offset = 0;
    if (pageIndex > 0) {
      offset = rowsPerPage * pageIndex;
    }

    const response = await getAccountListAPI(
      params?.fund_id,
      rowsPerPage,
      offset,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      setInitialPageLoaded(true);
      setAccountList(response?.data?.account_list?.rows);
      setTotalAccountCount(response?.data?.account_list?.count);
    } else {
      setIsLoader(false);
    }
  };
  const handleSort = (direction) => {
    const sortedData = [...accountList].sort((a, b) => {
      const labelA = a.accountHolders[0]?.identity.label?.toLowerCase();
      const labelB = b.accountHolders[0]?.identity.label?.toLowerCase();
      if (labelA < labelB) {
        return direction === "asc" ? -1 : 1;
      }
      if (labelA > labelB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setAccountList(sortedData);
  };
  const sortData = () => {
    const sortedData = [...accountList].sort((a, b) => {
      const nameA = getFullName(a?.accountHolders[0]?.identity).toUpperCase();
      const nameB = getFullName(b?.accountHolders[0]?.identity).toUpperCase();
      if (nameA < nameB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
    setAccountList(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchClicked = async () => {
    setIsLoader(true);
    let offset = 0;
    if (pageIndex > 0) {
      // offset = rowsPerPage * pageIndex;
    }

    const response = await getAccountListSearch(
      searchTerm,
      params?.fund_id,
      rowsPerPage,
      offset,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      setInitialPageLoaded(true);
      setAccountList(response?.data?.account_list?.rows);
      setTotalAccountCount(response?.data?.account_list?.count);
    } else {
      setIsLoader(false);
    }
  };

  const handleClickPrevious = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleClickNext = () => {
    if (pageIndex < pageOptions.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  
  const getFullName = (data) => {
    if (data?.type == "CORPORATE") {
      if (data?.meta?.data) {
        if (data?.meta?.data[data?.type.toLowerCase() + ".basic.name"]?.value) {
          return data?.meta?.data[data?.type.toLowerCase() + ".basic.name"]
            ?.value;
        }
      } else {
        return "";
      }
    }
    let first_name = "";
    let middle_name = "";
    let last_name = "";
    if (
      data?.meta?.data[data?.type.toLowerCase() + ".basic.first_name"]?.value
    ) {
      first_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.first_name"]?.value;
    }
    if (
      data?.meta?.data[data.type.toLowerCase() + ".basic.middle_name"]?.value
    ) {
      middle_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.middle_name"]
          ?.value;
    }
    if (
      data?.meta?.data[data?.type.toLowerCase() + ".basic.last_name"]?.value
    ) {
      last_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.last_name"]?.value;
    }
    let full_name = first_name + " " + middle_name + " " + last_name;
    return full_name;
  };
  const handleDownloadReport = async (identity_id) => {
    setIsLoader(true);
    let date;
    const response = await getDownloadCustomerProfileAPI(
      params?.fund_id,
      identity_id,
      cancelTokenSource.token
    );

    if (response.success == true) {
      if (response?.data?.url === null) {
        console.log("response?.data", response?.data?.dateTime);
        if (response?.data?.dateTime) {
          date = response?.data?.dateTime;
          setTimeout(function () {
            pullCustomerProfile(identity_id, date);
          }, 5000);
        }
      } else {
        setIsLoader(false);
        window.open(response?.data?.url, "_blank");
      }
    } else {
      setIsLoader(false);
    }
  };
  const handleDownloadAuditReport = async (account_id) => {
    setIsLoader(true);
    let date;
    const response = await getDownloadAuditReport(
      params?.fund_id,
      account_id,
      cancelTokenSource.token
    );

    if (response.success == true) {
      window.open(response?.data?.getSignedUrl, "_blank");
      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };
  const handleCustomerInformationReport = async (identity_id) => {
    setIsLoader(true);
    let date;
    const response = await getCustomerInformationReport(
      identity_id,
      params?.fund_id,
      cancelTokenSource.token
    );

    if (response.success) {
      handleAlert({
        variant: "success",
        message: "Download Report Successfully",
        show: true,
        hideAuto: true,
      });
      setIsLoader(false);

      console.log("response?.data?.url", response?.data);
      window.open(response?.data, "_blank");
    } else {
      setIsLoader(false);
    }
  };
  const pullCustomerProfile = async (identity_id, dateTime) => {
    const response = await getDownloadCustomerProfilePullAPI(
      params?.fund_id,
      identity_id,
      dateTime,
      cancelTokenSource.token
    );
    if (response.success == true) {
      if (response?.data?.url === null) {
        setTimeout(function () {
          pullCustomerProfile(identity_id, dateTime);
        }, 5000);
      } else {
        setIsLoader(false);
        window.open(response?.data?.url, "_blank");
      }
    } else {
      setIsLoader(false);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchClicked();
    }
  };
  const dateFormate = (dataDate) => {
    const dateString = dataDate;
    const date = new Date(dateString);

    const formattedDate = date
      .toLocaleString("en-GB", { timeZone: "UTC" })
      .replace(",", "");

    // const formattedDate = date.toLocaleDateString('en-US', {
    //   day: 'numeric',
    //   month: 'short',
    //   year: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    // });
    return formattedDate;
  };

  const getRiskAssessmentDataForCurrentFund = (data) => {
    if (data?.length > 0) {
      for (let a = 0; a < data?.length; a++) {
        if (data[a]?.fundId == params?.fund_id) {
          return data[a];
        }
      }
    }
  };
  const getShareHolderRows = (data) => {
    const parentIdentityId = data?.meta?.account_creator_identity_id
    const filteredData = data?.accountHolders.filter(itemss => itemss?.identityId !== parentIdentityId)
    // return (
    //   <td>
    //     <div>ksndkasjd</div>
    //   </td>
    // )
    console.log(filteredData, 'filteredData')
    for (let item of filteredData) {
      return (
        <tr>
          <td>

          </td>
          <td>
            {item?.identity?.type?.toLowerCase() ===
              "individual" ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    Individual
                  </Tooltip>
                }
              >
                <span>
                  <FeatherIcon
                    icon="user"
                    size="15"
                  />
                </span>
              </OverlayTrigger>
            ) : item?.identity?.type?.toLowerCase() ===
              "corporate" ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>Corporate</Tooltip>
                }
              >
                <span>
                  <FeatherIcon
                    icon="briefcase"
                    size="15"
                  />
                </span>
              </OverlayTrigger>
            ) : null}
          </td>
          <td>
            {getFullName(item?.identity) && getFullName(item?.identity).trim() !== "" ? (
              <TruncatedText tooltip={getFullName(item?.identity)} text={getFullName(item?.identity)} maxLength={8} />
            ) : (
              item?.identity?.label
            )}
          </td>
          <td>{item?.meta?.created_by?.name}</td>
          <td>
            {item?.meta?.submission_date ? (
              <TruncatedText tooltip={formatDateRegionWise(item?.meta?.submission_date, true)} text={formatDateRegionWise(item?.meta?.submission_date, true)} maxLength={6} />
            ) : (
              ""
            )}
          </td>
          <td>{item?.identity?.riskAccessment[0]?.updatedByInfo?.name}</td>
          <td>{item?.identity?.riskAccessment[0]?.computedRiskRating}</td>
          <td>{item?.identity?.riskAccessment[0]?.overrideRiskRating}</td>
          <td>
            <>
              <span
                className={
                  item?.applicationStatusId?.toLowerCase() === "accepted"
                    ? "text-success"
                    : item?.applicationStatusId?.toLowerCase() === "request_changes"
                      ? "text-danger"
                      : item?.applicationStatusId?.toLowerCase() === "draft" || item?.applicationStatusId?.toLowerCase() === "pending"
                        ? "text-warning"
                        : "text-default"
                }
              >
                {item?.applicationStatusId?.toLowerCase() !== "pending" && item?.applicationStatusId?.toLowerCase() !== "draft"
                  ? " "
                  : item?.applicationStatusId?.toLowerCase() === "draft"
                    ? " "
                    : " "}
              </span>
              <span
                className={
                  item?.applicationStatusId?.toLowerCase() === "pending" ||
                    item?.applicationStatusId?.toLowerCase() === "draft" ||
                    item?.applicationStatusId === "PENDING_FINAL_REVIEW"
                    ? "text-warning"
                    : item?.applicationStatusId?.toLowerCase() === "accepted"
                      ? "text-success"
                      : item?.applicationStatusId?.toLowerCase() === "request_changes" || item?.applicationStatusId?.toLowerCase() === "rejected"
                        ? "text-danger"
                        : "text-default"
                }
              >
                {item?.applicationStatusId
                  ?.replaceAll("_", " ")
                  ?.toLowerCase()
                  ?.replace(/^\w/, (c) => c.toUpperCase())}
              </span>
            </>
          </td>
          <td>
            <>
              {/* {isShowRedDotForMisMatchedStatus(item) && <FiDisc color="red" />} */}
              <span
                className={item?.status === "accepted" ? "text-success" : item?.status === "request_changes" ? "text-danger" : item?.status === "draft" || item?.status === "pending" ? "text-warning" : "text-default"}
              >
                {item?.status !== "pending" && item?.status !== "draft" ? " " : item?.status === "draft" ? " " : " "}
              </span>
              <span
                className={
                  item?.status === "pending" || item?.status === "draft"
                    ? "text-warning"
                    : item?.status === "accepted"
                      ? "text-success"
                      : item?.status === "request_changes" || item?.status === "rejected"
                        ? "text-danger"
                        : "text-default"
                }
              >
                {item?.status
                  ?.replaceAll("_", " ")
                  ?.toLowerCase()
                  ?.replace(/^\w/, (c) => c.toUpperCase())}
              </span>
            </>
          </td>
          <td>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              {true && (
                <div
                  style={{
                    marginRight: "0.5em",
                  }}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        View Identity Details
                      </Tooltip>
                    }
                  >
                    <div
                      onClick={() =>
                        navigate(
                          `/${params?.fund_id
                          }/kyc/account/identity/${item?.identity.type.toLowerCase()}/summary/${item?.identityId}/${item?.accountId}`,
                          {
                            state:
                              item?.applicationStatusId,
                          }
                        )
                      }
                    >
                      <span className="text-success">
                        <FeatherIcon
                          icon="sliders"
                          size="15"
                        />
                      </span>
                    </div>
                  </OverlayTrigger>
                </div>
              )}
              {/* New Assign User icon */}
              {MANAGE_ALL_CUSTOMERS &&
                item?.relation && (
                  <div
                    style={{
                      marginLeft: "5px",
                      marginRight: "5px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Grant Permission
                        </Tooltip>
                      }
                    >
                      <span className="text-info">
                        <FeatherIcon
                          icon="user-check"
                          size="15"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            window.open(
                              `${process.env.AUTH_API_URL}/entity-users-management/${item?.identity?.entityId}?assign_user=true`,
                              "_blank"
                            )
                          }
                        />
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Invite User
                        </Tooltip>
                      }
                    >
                      <span>
                        <FeatherIcon
                          icon="user-plus"
                          size="15"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            window.open(
                              `${process.env.AUTH_API_URL}/entity-users-management/${item?.identity?.entityId}?invite_user=true`,
                              "_blank"
                            )
                          }
                        />
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Edit Identity
                        </Tooltip>
                      }
                    >
                      <div
                        style={{
                          marginLeft: "5px",
                          marginRight: "5px",
                        }}
                        onClick={() =>
                          handleOpenDetailModal(
                            item
                          )
                        }
                      >
                        <span
                          style={{
                            marginRight:
                              "1rem",
                          }}
                          className="text-success"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                Edit Identity
                              </Tooltip>
                            }
                          >
                            <span>
                              <FeatherIcon
                                icon="edit"
                                size="15"
                              />
                            </span>
                          </OverlayTrigger>
                        </span>
                      </div>
                    </OverlayTrigger>
                  </div>
                )}

              <Dropdown>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>Actions</Tooltip>
                  }
                >
                  <Dropdown.Toggle
                    variant="link"
                    bsPrefix="p-0"
                  >
                    <FaEllipsisV />
                  </Dropdown.Toggle>
                </OverlayTrigger>

                <Dropdown.Menu align="right">
                  {item
                    ?.applicationStatusId ===
                    "ACCEPTED" ||
                    item
                      ?.applicationStatusId ===
                    "REJECTED" ||
                    item
                      ?.applicationStatusId ===
                    "REQUEST_CHANGES" ||
                    item
                      ?.applicationStatusId ===
                    "PENDING_FINAL_REVIEW" ? (
                    <Dropdown.Item
                      onClick={() => {
                        handleDownloadReport(
                          item?.identityId
                        );
                      }}
                    >
                      <FaDownload /> Customer
                      Detail Report
                    </Dropdown.Item>
                  ) : null}

                  <Dropdown.Item
                    onClick={() => {
                      handleCustomerInformationReport(
                        item?.identityId,
                        params?.fund_id
                      );
                    }}
                  >
                    <FaDownload /> Customer
                    Information Report
                  </Dropdown.Item>

                  {item
                    ?.applicationStatusId ===
                    "ACCEPTED" ||
                    item
                      ?.applicationStatusId ===
                    "REJECTED" ||
                    item
                      ?.applicationStatusId ===
                    "REQUEST_CHANGES" ||
                    item
                      ?.applicationStatusId ===
                    "PENDING_FINAL_REVIEW" ? (
                    <Dropdown.Item
                      onClick={() => {
                        handleDownloadAuditReport(
                          item?.accountId
                        );
                      }}
                    >
                      <FaDownload /> Audit
                      Trail Report
                    </Dropdown.Item>
                  ) : null}

                  {/* Delete Account Option */}
                  <Dropdown.Item
                    onClick={() => {
                      setDeleteConfirmationModal(
                        true
                      );
                      setSelectedRow(item);
                    }}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Delete Account
                        </Tooltip>
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                        }}
                      >
                        <FeatherIcon
                          icon="trash"
                          size="15"
                          className="text-danger"
                          style={{
                            marginRight:
                              "5px",
                          }}
                        />
                        <span className="text-danger">
                          Delete Account
                        </span>
                      </div>
                    </OverlayTrigger>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </td>
        </tr>
      )
    }


  }
  return (
    <>
      {isLoader ||
        !(
          typeof fundDetail === "object" && Object.keys(fundDetail).length > 0
        ) ? (
        <Loader />
      ) : (
        <div className="main-content">
          <DynamicHeaderAdministration
            fundDetail={fundDetail}
            style={{ marginBottom: "0rem" }}
            title="O'Keefe PLC"
            titlesmall="ADMINISTRATION PORTAL [GLEASON-O'REILLY]"
            isShowOrganizationLogo={true}
            organizationLogo={""}
            isShowFundLogo={true}
            fundLogo={""}
          />
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs={12}>
                <>
                  <div className="main-content">
                    <Container fluid>
                      {/* <div style={{ display: "flex", justifyContent: "end" ,marginBottom:"0.5rem"}}>
                        <Button
                          className="lift invite-button"
                          onClick={() => {
                            window.open(process.env.AUTH_API_URL + "/entity-users-management/" + localStorage.getItem("entity_id"), "_blank");
                          }}
                        >
                          <FaUserPlus className="invite-icon" />
                          Invite User
                        </Button>
                      </div> */}
                      <Row className="justify-content-center">
                        <Col xs={12}>
                          <div class="card">
                            {/* <KycDynamicHeader fundDetail={props?.fundDetail} title={"Account List"} /> */}
                            {!isLoader ? (
                              <>
                                <KycDynamicHeader
                                  getAccountDetail={getAccountList}
                                  fundDetail={fundDetail}
                                  title={"Account List"}
                                />
                                <div class="table-responsive">
                                  <table class="table table-sm table-nowrap card-table">
                                    <thead>
                                      <tr>
                                        <th colSpan="11">
                                          <InputGroup className="mb-3">
                                            <FormControl
                                              onKeyDown={handleKeyDown}
                                              placeholder="Search..."
                                              aria-label="Search"
                                              aria-describedby="search-icon"
                                              value={searchTerm}
                                              onChange={handleSearch}
                                            />
                                            <InputGroup.Text
                                              id="search-icon"
                                              style={{ cursor: "pointer" }}
                                              onClick={handleSearchClicked}
                                            >
                                              <FiSearch />
                                            </InputGroup.Text>
                                          </InputGroup>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th>Account</th>
                                        <th>Type</th>
                                        <th onClick={sortData}>
                                          Customer Name
                                          <span>
                                            {sortOrder === "asc" ? (
                                              <FeatherIcon
                                                icon="arrow-up"
                                                size="15"
                                              />
                                            ) : (
                                              <FeatherIcon
                                                icon="arrow-down"
                                                size="15"
                                              />
                                            )}
                                          </span>
                                        </th>
                                        <th>Created By</th>
                                        <th>Submitted At</th>
                                        <th>Reviewed By</th>
                                        <th>Computed Risk Rating</th>
                                        <th>Override Risk Rating</th>
                                        <th>S/Status</th>
                                        <th>Status</th>
                                        <th
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody class="list">
                                      {accountList &&
                                        accountList.map((item, index) => {
                                          const isExpanded = expandedRows.includes(index);
                                          const parentIdentityId = item?.meta?.account_creator_identity_id
                                          let parentItem = null
                                          if (parentIdentityId) {
                                            parentItem = item?.accountHolders.filter(itemss => itemss?.identityId === parentIdentityId)
                                          } else {
                                            parentItem = item?.accountHolders
                                          }
                                          parentItem = parentItem[0]
                                          console.log(parentItem, 'parentItem')
                                          return (
                                            <>
                                              <tr>
                                                <td>
                                                  <div>
                                                    <span className="text-success">
                                                      <FeatherIcon
                                                        icon="check-circle"
                                                        color={
                                                          item?.status ===
                                                            "accepted"
                                                            ? "green"
                                                            : item?.status ===
                                                              "rejected"
                                                              ? "red"
                                                              : item?.status ===
                                                                "pending" ||
                                                                "review"
                                                                ? "orange"
                                                                : ""
                                                        }
                                                        size="15"
                                                        style={{
                                                          marginRight: "5px",
                                                        }}
                                                      />
                                                    </span>
                                                    {item?.accountHolders?.length === 1
                                                      ? "Standalone"
                                                      : `Joint: ${item?.accountHolders?.length}`}
                                                    {item?.accountHolders?.length > 1 && (
                                                      <FeatherIcon
                                                        onClick={() => toggleRowExpansion(index)}
                                                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                        color={"#2C7BE5"}
                                                        size="15"
                                                        style={{ marginLeft: "5px", cursor: "pointer" }}
                                                      />
                                                    )}
                                                  </div>
                                                </td>
                                                <td>
                                                  {/* {parentItem?.identity?.type?.toLowerCase() === */}
                                                  {parentItem?.identity?.type?.toLowerCase() ===
                                                    "individual" ? (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          Individual
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <span>
                                                        <FeatherIcon
                                                          icon="user"
                                                          size="15"
                                                        />
                                                      </span>
                                                    </OverlayTrigger>
                                                  ) : parentItem?.identity?.type?.toLowerCase() ===
                                                    "corporate" ? (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>Corporate</Tooltip>
                                                      }
                                                    >
                                                      <span>
                                                        <FeatherIcon
                                                          icon="briefcase"
                                                          size="15"
                                                        />
                                                      </span>
                                                    </OverlayTrigger>
                                                  ) : null}
                                                </td>

                                                <td>
                                                  {getFullName(
                                                    parentItem
                                                      ?.identity
                                                  ) &&
                                                    getFullName(
                                                      parentItem
                                                        ?.identity
                                                    ).trim() !== "" ? (
                                                    <TruncatedText
                                                      tooltip={getFullName(
                                                        parentItem
                                                          ?.identity
                                                      )}
                                                      text={getFullName(
                                                        parentItem
                                                          ?.identity
                                                      )}
                                                      maxLength={8}
                                                    />
                                                  ) : (
                                                    parentItem
                                                      ?.identity?.label
                                                  )}
                                                </td>
                                                <td>
                                                  <TruncatedText
                                                    tooltip={
                                                      item?.meta?.created_by?.name
                                                    } // Full name as tooltip
                                                    text={
                                                      item?.meta?.created_by?.name
                                                    } // Text to display truncated
                                                    maxLength={5} // Maximum length before truncation
                                                  />
                                                </td>

                                                <td>
                                                  {parentItem?.meta
                                                    ?.submission_date ? (
                                                    <TruncatedText
                                                      tooltip={formatDateRegionWise(
                                                        parentItem
                                                          ?.meta?.submission_date,
                                                        true
                                                      )}
                                                      text={formatDateRegionWise(
                                                        parentItem
                                                          ?.meta?.submission_date,
                                                        true
                                                      )}
                                                      maxLength={6}
                                                    />
                                                  ) : (
                                                    ""
                                                  )}
                                                </td>
                                                <td>
                                                  {
                                                    parentItem
                                                      ?.identity?.riskAccessment[0]
                                                      ?.updatedByInfo?.name
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    getRiskAssessmentDataForCurrentFund(
                                                      parentItem
                                                        ?.identity?.riskAccessment
                                                    )?.computedRiskRating
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    getRiskAssessmentDataForCurrentFund(
                                                      parentItem
                                                        ?.identity?.riskAccessment
                                                    )?.overrideRiskRating
                                                  }
                                                </td>
                                                <td>
                                                  <>
                                                    <span
                                                      className={
                                                        parentItem?.applicationStatusId?.toLowerCase() ===
                                                          "accepted"
                                                          ? "text-success"
                                                          : parentItem?.applicationStatusId?.toLowerCase() ===
                                                            "request_changes"
                                                            ? "text-danger"
                                                            : parentItem?.applicationStatusId?.toLowerCase() ===
                                                              "draft" ||
                                                              parentItem?.applicationStatusId?.toLowerCase() ===
                                                              "pending"
                                                              ? "text-warning"
                                                              : "text-default"
                                                      }
                                                    >
                                                      {parentItem?.applicationStatusId?.toLowerCase() !==
                                                        "pending" &&
                                                        parentItem?.applicationStatusId?.toLowerCase() !==
                                                        "draft"
                                                        ? " "
                                                        : parentItem?.applicationStatusId?.toLowerCase() ===
                                                          "draft"
                                                          ? " "
                                                          : " "}
                                                    </span>
                                                    <span
                                                      className={
                                                        parentItem?.applicationStatusId?.toLowerCase() ===
                                                          "pending" ||
                                                          parentItem?.applicationStatusId?.toLowerCase() ===
                                                          "draft" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "PENDING_FINAL_REVIEW"
                                                          ? "text-warning"
                                                          : parentItem?.applicationStatusId?.toLowerCase() ===
                                                            "accepted"
                                                            ? "text-success"
                                                            : parentItem?.applicationStatusId?.toLowerCase() ===
                                                              "request_changes" ||
                                                              parentItem?.applicationStatusId?.toLowerCase() ===
                                                              "rejected"
                                                              ? "text-danger"
                                                              : "text-default"
                                                      }
                                                    >
                                                      {parentItem?.applicationStatusId
                                                        ?.replaceAll("_", " ")
                                                        ?.toLowerCase()
                                                        ?.replace(/^\w/, (c) =>
                                                          c.toUpperCase()
                                                        )}
                                                    </span>
                                                  </>
                                                </td>
                                                <td>
                                                  <>
                                                    {isShowRedDotForMisMatchedStatus(
                                                      parentItem, item?.status
                                                    ) && <FiDisc color="red" />}
                                                    <span
                                                      className={
                                                        item?.status === "accepted"
                                                          ? "text-success"
                                                          : item?.status ===
                                                            "request_changes"
                                                            ? "text-danger"
                                                            : item?.status ===
                                                              "draft" ||
                                                              item?.status ===
                                                              "pending"
                                                              ? "text-warning"
                                                              : "text-default"
                                                      }
                                                    >
                                                      {item?.status !== "pending" &&
                                                        item?.status !== "draft"
                                                        ? " "
                                                        : item?.status === "draft"
                                                          ? " "
                                                          : " "}
                                                    </span>
                                                    <span
                                                      className={
                                                        item?.status ===
                                                          "pending" ||
                                                          item?.status === "draft"
                                                          ? "text-warning"
                                                          : item?.status ===
                                                            "accepted"
                                                            ? "text-success"
                                                            : item?.status ===
                                                              "request_changes" ||
                                                              item?.status ===
                                                              "rejected"
                                                              ? "text-danger"
                                                              : "text-default"
                                                      }
                                                    >
                                                      {item?.status
                                                        ?.replaceAll("_", " ")
                                                        ?.toLowerCase()
                                                        ?.replace(/^\w/, (c) =>
                                                          c.toUpperCase()
                                                        )}
                                                    </span>
                                                  </>
                                                </td>
                                                <td>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    {true && (
                                                      <div
                                                        style={{
                                                          marginRight: "0.5em",
                                                        }}
                                                      >
                                                        <OverlayTrigger
                                                          placement="top"
                                                          overlay={
                                                            <Tooltip>
                                                              View Identity Details
                                                            </Tooltip>
                                                          }
                                                        >
                                                          <div
                                                            onClick={() =>
                                                              navigate(
                                                                `/${params?.fund_id
                                                                }/kyc/account/identity/${parentItem?.identity.type.toLowerCase()}/summary/${parentItem?.identityId}/${parentItem?.accountId}`,
                                                                {
                                                                  state:
                                                                    parentItem?.applicationStatusId,
                                                                }
                                                              )
                                                            }
                                                          >
                                                            <span className="text-success">
                                                              <FeatherIcon
                                                                icon="sliders"
                                                                size="15"
                                                              />
                                                            </span>
                                                          </div>
                                                        </OverlayTrigger>
                                                      </div>
                                                    )}
                                                    {/* New Assign User icon */}
                                                    {MANAGE_ALL_CUSTOMERS &&
                                                      item?.relation && (
                                                        <div
                                                          style={{
                                                            marginLeft: "5px",
                                                            marginRight: "5px",
                                                            display: "flex",
                                                            gap: "10px",
                                                          }}
                                                        >
                                                          <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                              <Tooltip>
                                                                Grant Permission
                                                              </Tooltip>
                                                            }
                                                          >
                                                            <span className="text-info">
                                                              <FeatherIcon
                                                                icon="user-check"
                                                                size="15"
                                                                style={{
                                                                  cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                  window.open(
                                                                    `${process.env.AUTH_API_URL}/entity-users-management/${parentItem?.identity?.entityId}?assign_user=true`,
                                                                    "_blank"
                                                                  )
                                                                }
                                                              />
                                                            </span>
                                                          </OverlayTrigger>

                                                          <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                              <Tooltip>
                                                                Invite User
                                                              </Tooltip>
                                                            }
                                                          >
                                                            <span>
                                                              <FeatherIcon
                                                                icon="user-plus"
                                                                size="15"
                                                                style={{
                                                                  cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                  window.open(
                                                                    `${process.env.AUTH_API_URL}/entity-users-management/${parentItem?.identity?.entityId}?invite_user=true`,
                                                                    "_blank"
                                                                  )
                                                                }
                                                              />
                                                            </span>
                                                          </OverlayTrigger>
                                                          <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                              <Tooltip>
                                                                Edit Identity
                                                              </Tooltip>
                                                            }
                                                          >
                                                            <div
                                                              style={{
                                                                marginLeft: "5px",
                                                                marginRight: "5px",
                                                              }}
                                                              onClick={() =>
                                                                handleOpenDetailModal(
                                                                  parentItem
                                                                )
                                                              }
                                                            >
                                                              <span
                                                                style={{
                                                                  marginRight:
                                                                    "1rem",
                                                                }}
                                                                className="text-success"
                                                              >
                                                                <OverlayTrigger
                                                                  placement="top"
                                                                  overlay={
                                                                    <Tooltip>
                                                                      Edit Identity
                                                                    </Tooltip>
                                                                  }
                                                                >
                                                                  <span>
                                                                    <FeatherIcon
                                                                      icon="edit"
                                                                      size="15"
                                                                    />
                                                                  </span>
                                                                </OverlayTrigger>
                                                              </span>
                                                            </div>
                                                          </OverlayTrigger>
                                                        </div>
                                                      )}

                                                    <Dropdown>
                                                      <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                          <Tooltip>Actions</Tooltip>
                                                        }
                                                      >
                                                        <Dropdown.Toggle
                                                          variant="link"
                                                          bsPrefix="p-0"
                                                        >
                                                          <FaEllipsisV />
                                                        </Dropdown.Toggle>
                                                      </OverlayTrigger>

                                                      <Dropdown.Menu align="right">
                                                        {parentItem
                                                          ?.applicationStatusId ===
                                                          "ACCEPTED" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "REJECTED" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "REQUEST_CHANGES" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "PENDING_FINAL_REVIEW" ? (
                                                          <Dropdown.Item
                                                            onClick={() => {
                                                              handleDownloadReport(
                                                                parentItem?.identityId
                                                              );
                                                            }}
                                                          >
                                                            <FaDownload /> Customer
                                                            Detail Report
                                                          </Dropdown.Item>
                                                        ) : null}

                                                        <Dropdown.Item
                                                          onClick={() => {
                                                            handleCustomerInformationReport(
                                                              parentItem?.identityId,
                                                              params?.fund_id
                                                            );
                                                          }}
                                                        >
                                                          <FaDownload /> Customer
                                                          Information Report
                                                        </Dropdown.Item>

                                                        {parentItem
                                                          ?.applicationStatusId ===
                                                          "ACCEPTED" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "REJECTED" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "REQUEST_CHANGES" ||
                                                          parentItem
                                                            ?.applicationStatusId ===
                                                          "PENDING_FINAL_REVIEW" ? (
                                                          <Dropdown.Item
                                                            onClick={() => {
                                                              handleDownloadAuditReport(
                                                                parentItem?.accountId
                                                              );
                                                            }}
                                                          >
                                                            <FaDownload /> Audit
                                                            Trail Report
                                                          </Dropdown.Item>
                                                        ) : null}

                                                        {/* Delete Account Option */}
                                                        <Dropdown.Item
                                                          onClick={() => {
                                                            setDeleteConfirmationModal(
                                                              true
                                                            );
                                                            setSelectedRow(item);
                                                          }}
                                                        >
                                                          <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                              <Tooltip>
                                                                Delete Account
                                                              </Tooltip>
                                                            }
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                            >
                                                              <FeatherIcon
                                                                icon="trash"
                                                                size="15"
                                                                className="text-danger"
                                                                style={{
                                                                  marginRight:
                                                                    "5px",
                                                                }}
                                                              />
                                                              <span className="text-danger">
                                                                Delete Account
                                                              </span>
                                                            </div>
                                                          </OverlayTrigger>
                                                        </Dropdown.Item>
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  </div>
                                                </td>
                                              </tr>
                                              {isExpanded && (
                                                <>
                                                  {getShareHolderRows(item)}
                                                </>
                                              )}
                                            </>
                                          )
                                        })}
                                    </tbody>
                                  </table>
                                  {/* {accountList.length > 0 && <TableComponent isAccountList={true} pagination={false} key={accountList.length} columns={accountColumns} allData={accountList} />} */}

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginTop: "-1rem",
                                    }}
                                  >
                                    <div>
                                      <Pagination size="lg">
                                        <Pagination.Prev
                                          disabled={pageIndex === 0}
                                          onClick={(e) => {
                                            handleClickPrevious(e);
                                          }}
                                        />
                                        {renderPageItems()}
                                        <Pagination.Next
                                          disabled={
                                            pageIndex === pageOptions.length - 1
                                          }
                                          onClick={(e) => {
                                            handleClickNext(e);
                                          }}
                                        />
                                      </Pagination>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Loader />
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  {deleteConfirmationModal && (
                    <DeleteAccountModal
                      openDeleteModal={deleteConfirmationModal}
                      handleClose={handleCloseModal}
                      selectedRow={selectedRow}
                      handleAlert={handleAlert}
                      getList={getAccountList}
                    />
                  )}
                </>
              </Col>
            </Row>
          </Container>
          {showDetailModal && (
            <Modal
              show={showDetailModal}
              aria-labelledby="contained-modal-title-vcenter"
              onHide={handleCloseDetailModal}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>View Identity Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                You will be redirected to the customer onboarding portal. Would
                you like to proceed?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleClickIdentity(items)}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      )}
    </>
  );
}
