import React, { useMemo, useState, useEffect } from "react";
import { Col, Row, Container, Pagination, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios, { CancelTokenSource } from "axios";
import { getAccountListAPI, getDownloadCustomerProfileAPI, getDownloadCustomerProfilePullAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import { Link, useNavigate, useParams } from "react-router-dom";

import { FiDownload, FiDisc } from "react-icons/fi";

import KycDynamicHeader from "../../../../../widgets/KycDynamicHeader";
import FeatherIcon from "feather-icons-react";
import LoadingSpinner from "../../../../../widgets/bootstrap-component/Spinner";
import DeleteAccountModal from "./DeleteAccountModal";
import { useSelector } from "react-redux";
import TableComponent from "../../../../shared-components/table-components";
export default function AccountList({ ...props }) {
  // const fundConfig = useSelector((state) => state?.fundConfig);
  const fundConfig = props?.fundDetail;
  console.log("fundDetails props", props?.fundDetails);
  const [initialPageLoaded, setInitialPageLoaded] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [accountList, setAccountList] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalAccountCount, setTotalAccountCount] = useState(0);
  const navigate = useNavigate();
  const handleCloseModal = () => setDeleteConfirmationModal(false);
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  useEffect(() => {
    if (params?.fund_id && pageIndex !== undefined && pageIndex !== null) {
      getAccountList();
    }
  }, [pageIndex, params?.fund_id]);

  useEffect(() => {
    console.log("fundConfig", fundConfig);
  }, [fundConfig]);
  useEffect(
    function () {
      if (accountList && totalAccountCount != 0) {
        let totalRecords = totalAccountCount
        let numberOfPages = totalRecords / rowsPerPage
        let roundedUp = Math.ceil(numberOfPages)
        let resultArray = []
        for (let i = 1; i <= roundedUp; i++) {
          resultArray.push(i)
        }
        setPageOptions(resultArray)
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
      if (i === 0 || i === totalPages - 1 || i === pageIndex || (i >= pageIndex - Math.floor(maxVisiblePages / 2) && i <= pageIndex + Math.floor(maxVisiblePages / 2))) {
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
      } else if ((i === pageIndex - Math.floor(maxVisiblePages / 2) - 1 && pageIndex > Math.floor(maxVisiblePages / 2)) || (i === pageIndex + Math.floor(maxVisiblePages / 2) + 1 && pageIndex < totalPages - Math.floor(maxVisiblePages / 2))) {
        items.push(<Pagination.Ellipsis key={i} />);
      }
    }

    return items;
  };

  const accountColumns = useMemo(
    () => [
      {
        Header: "Account",
        accessor: "scount",

        Cell: ({ value, row }) => (
          <div>
            <span className="text-success">
              <FeatherIcon
                icon="check-circle"
                color={
                  row.original?.status === "accepted"
                    ? "green"
                    : row.original?.status === "rejected"
                      ? "red"
                      : row.original?.status === "pending" || "review"
                        ? "orange"
                        : ""
                }
                size="15"
                style={{ marginRight: "5px" }}
              />
            </span>
            {value === 1 ? "Standalone" : `Joint: ${value}`}
          </div>
        ),
      },
      { Header: "Type", accessor: "accountHolders[0].identity.type", Cell: ({ value }) => value?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) },
      {
        Header: "Customer Name",
        accessor: "accountHolders[0].identity.label",
        Cell: ({ value, row }) => (
          <span>
            {(() => {
              const fullName = getFullName(row.original?.accountHolders[0]?.identity);
              return fullName.trim() !== "" ? fullName : value;
            })()}
          </span>
        ),
      },
      { Header: "Created By", accessor: "meta.created_by.name" },
      {
        Header: "Submitted At",
        accessor: "accountHolders[0].meta.submission_date",
        Cell: ({ value }) => <span>{value ? dateFormate(value) : ""}</span>,
      },

      { Header: "Reviewed By", accessor: "accountHolders[0].identity.riskAccessment[0].updatedByInfo.name" },
      { Header: "Computed Risk Rating", accessor: "accountHolders[0].identity.riskAccessment[0].computedRiskRating" },
      { Header: "Override Risk Rating", accessor: "accountHolders[0].identity.riskAccessment[0].overrideRiskRating" },
      {
        Header: "S/Status",
        accessor:
          "accountHolders[0].applicationStatusId",
        Cell: ({ value }) => (
          <>
            <span
              className={
                value.toLowerCase() === "accepted"
                  ? "text-success"
                  : value.toLowerCase() === "request_changes"
                    ? "text-danger"
                    : value.toLowerCase() === "draft" || value.toLowerCase() === "pending"
                      ? "text-warning"
                      : "text-default"
              }
            >
              {value.toLowerCase() !== "pending" && value.toLowerCase() !== "draft"
                ? " "
                : value.toLowerCase() === "draft"
                  ? " "
                  : " "}
            </span>
            <span
              className={
                value.toLowerCase() === "pending" || value.toLowerCase() === "draft"
                  ? "text-warning"
                  : value.toLowerCase() === "accepted"
                    ? "text-success"
                    : value.toLowerCase() === "request_changes" || value.toLowerCase() === "rejected"
                      ? "text-danger"
                      : "text-default"
              }
            >
              {value
                ?.replaceAll("_", " ")
                ?.toLowerCase()
                ?.replace(/^\w/, (c) => c.toUpperCase())}
            </span>
          </>
        )
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value, row }) => (
          <>
            {isShowRedDotForMisMatchedStatus(row) && <FiDisc color='red' />}
            <span
              className={
                value === "accepted"
                  ? "text-success"
                  : value === "request_changes"
                    ? "text-danger"
                    : value === "draft" || value === "pending"
                      ? "text-warning"
                      : "text-default"
              }
            >
              {value !== "pending" && value !== "draft"
                ? " "
                : value === "draft"
                  ? " "
                  : " "}
            </span>
            <span
              className={
                value === "pending" || value === "draft"
                  ? "text-warning"
                  : value === "accepted"
                    ? "text-success"
                    : value === "request_changes" || value === "rejected"
                      ? "text-danger"
                      : "text-default"
              }
            >
              {value
                ?.replaceAll("_", " ")
                ?.toLowerCase()
                ?.replace(/^\w/, (c) => c.toUpperCase())}
            </span>
          </>
        ),
      },
      {
        Header: "Action",
        accessor: "id",
        Cell: ({ value, row }) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ marginRight: "0.5em" }}>
              <OverlayTrigger placement="top" overlay={<Tooltip>Identity Details</Tooltip>}>
                <div
                  onClick={() =>
                    navigate(
                      `/${params?.fund_id
                      }/kyc/account/identity/${row.original.accountHolders[0]?.identity.type.toLowerCase()}/summary/${row.original.accountHolders[0]?.identityId
                      }/${row.original.accountHolders[0]?.accountId}`,
                      {
                        state:
                          row.original.accountHolders[0]?.applicationStatusId,
                      }
                    )
                  }
                >
                  <span className="text-success">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Identity Details</Tooltip>}>
                      <span>
                        <FeatherIcon icon="sliders" size="15" />
                      </span>
                    </OverlayTrigger>
                  </span>
                </div>
              </OverlayTrigger>
            </div>
            <div
              onClick={() => {
                setDeleteConfirmationModal(true);
                setSelectedRow(row.original);
              }}
            >
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Account</Tooltip>}>
                <div>
                  <span className="text-danger">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete Account</Tooltip>}>
                      <span>
                        <FeatherIcon icon="trash" size="15" />
                      </span>
                    </OverlayTrigger>
                  </span>
                </div>
              </OverlayTrigger>
            </div>
            {row.original.accountHolders[0]?.applicationStatusId ===
              "ACCEPTED" ||
              row.original.accountHolders[0]?.applicationStatusId ===
              "REJECTED" ? (
              <div style={{ marginLeft: "10px" }}>
                <OverlayTrigger placement="top" overlay={<Tooltip>Download Report</Tooltip>}>
                  <span className="text-success">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Download Report</Tooltip>}>
                      <FiDownload
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          handleDownloadReport(row.original.accountHolders[0]?.identityId);
                        }}
                        size="15"
                      />
                    </OverlayTrigger>
                  </span>
                </OverlayTrigger>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        ),
      },
    ],
    [accountList]
  );

  const isShowRedDotForMisMatchedStatus = (data) => {
    console.log(data, 'data')
    // return;
    if (data?.original?.accountHolders[0]?.applicationStatusId.toLowerCase() != "pending" && data?.original?.accountHolders[0]?.applicationStatusId.toLowerCase() != "draft") {
      if (data?.original?.accountHolders[0]?.applicationStatusId.toLowerCase() != data?.original?.status.toLowerCase()) {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  }
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
    )
    if (response.success == true) {
      setIsLoader(false);
      setInitialPageLoaded(true);
      setAccountList(response?.data?.account_list?.rows);
      setTotalAccountCount(response?.data?.account_list?.count);
    } else {
      setIsLoader(false)
    }
  }

  // const handleClickPrevious = () => {
  //   if (pageIndex > 0) {
  //     setPageIndex(pageIndex - 1)
  //   }
  // }

  // const handleClickNext = () => {
  //   if (pageIndex < pageOptions.length - 1) {
  //     setPageIndex(pageIndex + 1);
  //   }
  // };

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


  const gotoPage = (page) => {
    setPageIndex(page)
  }
  const getFullName = (data) => {
    if (data?.type == "CORPORATE") {
      if (data?.meta?.data) {
        if (data?.meta?.data[data?.type.toLowerCase() + ".basic.name"]?.value) {
          return data?.meta?.data[data?.type.toLowerCase() + ".basic.name"]
            ?.value
        }
      } else {
        return ""
      }
    }
    let first_name = ""
    let middle_name = ""
    let last_name = ""
    if (
      data?.meta?.data[data?.type.toLowerCase() + ".basic.first_name"]?.value
    ) {
      first_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.first_name"]?.value
    }
    if (
      data?.meta?.data[data.type.toLowerCase() + ".basic.middle_name"]?.value
    ) {
      middle_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.middle_name"]?.value
    }
    if (
      data?.meta?.data[data?.type.toLowerCase() + ".basic.last_name"]?.value
    ) {
      last_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.last_name"]?.value
    }
    let full_name = first_name + " " + middle_name + " " + last_name
    return full_name
  }
  const handleDownloadReport = async (identity_id) => {

    setIsLoader(true)
    let date;
    const response = await getDownloadCustomerProfileAPI(
      params?.fund_id,
      identity_id,
      cancelTokenSource.token
    )

    if (response.success == true) {
      if (response?.data?.url === null) {

        console.log("response?.data", response?.data?.dateTime)
        if (response?.data?.dateTime) {


          date = response?.data?.dateTime;
          setTimeout(function () {

            pullCustomerProfile(identity_id, date)
          }, 5000)
        }

      } else {
        setIsLoader(false)
        window.open(response?.data?.url, "_blank")
      }
    } else {
      setIsLoader(false)
    }
  }
  const pullCustomerProfile = async (identity_id, dateTime) => {
    const response = await getDownloadCustomerProfilePullAPI(
      params?.fund_id,
      identity_id,
      dateTime,
      cancelTokenSource.token
    )
    if (response.success == true) {
      if (response?.data?.url === null) {
        setTimeout(function () {
          pullCustomerProfile(identity_id, dateTime)
        }, 5000)
      } else {
        setIsLoader(false)
        window.open(response?.data?.url, "_blank")
      }
    } else {
      setIsLoader(false)
    }
  }
  const dateFormate = (dataDate) => {
    const dateString = dataDate;
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("en-GB", { timeZone: "UTC" }).replace(",", "");

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
  return (
    <>
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                {/* <KycDynamicHeader fundDetail={props?.fundDetail} title={"Account List"} /> */}
                {!isLoader ? (
                  <>
                    <KycDynamicHeader fundConfig={fundConfig} title={"Account List"} />
                    <div class="table-responsive">
                      {accountList.length > 0 && <TableComponent isAccountList={true} pagination={false} key={accountList.length} columns={accountColumns} allData={accountList} />}

                      <div style={{ display: "flex", justifyContent: "center", marginTop: "-1rem" }}>
                        <div >
                          <Pagination size="lg">
                            <Pagination.Prev
                              disabled={pageIndex === 0}
                              onClick={(e) => {
                                handleClickPrevious(e);
                              }}
                            />
                            {renderPageItems()}
                            <Pagination.Next
                              disabled={pageIndex === pageOptions.length - 1}
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
                  <LoadingSpinner custom={true} />
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {deleteConfirmationModal && <DeleteAccountModal openDeleteModal={deleteConfirmationModal} handleClose={handleCloseModal} selectedRow={selectedRow} handleAlert={handleAlert} getList={getAccountList} />}
    </>
  );
}
