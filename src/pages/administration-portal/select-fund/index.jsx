import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row, Container, Button } from "react-bootstrap";
import CustomAlert from "../../../widgets/components/Alerts";
import DynamicHeader from "../../../widgets/DynamicHeader";
import Filter from "./components/filter";
// import LoadingSpinner from "../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../components/ui/loader";
import { isKYCEnabled } from "../../../helpers/getFundConfiguration";
import { FaCheckSquare } from "react-icons/fa";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { HiDownload } from "react-icons/hi";
import axios from "axios";
import {
  fetchEntityReport,
  getFilterFundsAPI,
} from "../../../api/network/AdministrationApi/AdministrationApi";
import TableComponent from "../../shared-components/paginated-table-component";
import formatDateRegionWise from "../../../helpers/formatDateRegionWise";

export default function SelectFund({ ...props }) {
  const cancelTokenSource = axios.CancelToken.source();

  const [fundData, setFundData] = useState([]);
  const [initialPageLoaded, setInitialPageLoaded] = useState(false);

  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState();
  const [totalAccountCount, setTotalAccountCount] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [offset, setOffset] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  useEffect(
    function () {
      if (fundData && totalAccountCount != 0) {
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
    [fundData, totalAccountCount]
  );
  const gotoPage = (page) => {
    setPageIndex(page);
  };
  useEffect(() => {
    // Make an initial call to load the correct page data
    if (!initialPageLoaded) {
      gotoPage(pageIndex);
    }
  }, [pageIndex, initialPageLoaded, gotoPage]);
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
 

  const handleLoader = (value) => {
    setIsLoader(value)

  }



  function headerButtonCallBack() {}

  const handleSetFundData = (data, count) => {
    setFundData(data);
    setTotalAccountCount(count);
    setInitialPageLoaded(true);
  };

  const getFilterFunds = useCallback(
    async (name, offset = "0", limit = "50") => {
      
      setIsLoader(true);
      const response = await getFilterFundsAPI(
        name,
        selectedRegion,
        limit,
        offset,
        cancelTokenSource.token
      );

      if (response.success == true) {
        setAlertProps({
          variant: "",
          message: "",
          show: false,
          hideAuto: false,
        });
        handleSetFundData(response?.data?.rows, response?.data?.count);
        if (!(response?.data?.rows.length > 0)) {
          handleAlert({
            variant: "info",
            message: "No results found for your search.",
            show: true,
            hideAuto: true,
          });
        }
        setIsLoader(false);
      } else {
        handleAlert({
          variant: "danger",
          message: response?.user_message,
          show: true,
          hideAuto: true,
        });
        setIsLoader(false);
      }
    },
    [cancelTokenSource.token, selectedRegion]
  );

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  const handleClickExportEntityData = async () => {
    setIsLoader(true);
    const response = await fetchEntityReport("", cancelTokenSource.token);
    if (response.success) {
      if (response?.data?.uuid) {
        const timer = setInterval(async () => {
          const csv = await fetchEntityReport(
            response?.data?.uuid,
            cancelTokenSource.token
          );
          if (csv?.data?.data?.csvUrl) {
            clearInterval(timer);
            window.open(csv.data.data.csvUrl, "_blank");
            handleAlert({
              variant: "success",
              message: "Download Entity Report Successfully",
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

  const columns = useMemo(() => {
    const columns = [
      {
        Header: "Domain Account",
        accessor: "name",
        Cell: (props) => {
          const item = props.row?.original;
          return (
            <>
              <Link
                to={`${
                  isKYCEnabled(item?.meta?.config)
                    ? `/${item?.id}/kyc/account/list`
                    : `/${item?.id}/dashboard`
                } `}
                className="avatar avatar-xs d-inline-block me-2"
              >
                <img
                  src={item?.logoBucketKey}
                  alt="..."
                  className="avatar-img rounded-circle"
                />
              </Link>

              <span>
                {" "}
                <Link
                  to={`${
                    isKYCEnabled(item?.meta?.config)
                      ? `/${item?.id}/kyc/account/list`
                      : `/${item?.id}/dashboard`
                  } `}
                  onClick={() => localStorage.setItem("name_id", item?.namedId)}
                >
                  {item?.name}
                </Link>
              </span>
            </>
          );
        },
        sortType: (rowA, rowB) => {
          const a = rowA.original.name.toLowerCase();
          const b = rowB.original.name.toLowerCase();
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        },
  
      },
      {
        Header: "Region",
        accessor: "region",
        disableSortBy: true,
      },
      {
        Header: "Account Manager",
        accessor: "management.entity.title",
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "",
        Cell: ({row}) => {
          const item = row?.original;
          return (
            <>
            {item?.status === "accepted" ? (
              <span className="text-success">
                <FaCheckSquare />{" "}
              </span>
            ) : item?.status === "rejected" ? (
              <span className="text-danger">
                <FaCheckSquare />{" "}
              </span>
            ) : item?.status === "screening" || item?.status === "pending" ? (
              <span className="text-warning">
                <FaCheckSquare />{" "}
              </span>
            ) : item?.status === "review" ? (
              <span className="text-primary">
                <FaCheckSquare />{" "}
              </span>
            ) : item?.status === "draft" || item?.status === "parked" ? (
              <span className="text-info">
                <FaCheckSquare />{" "}
              </span>
            ) : (
              <span className="text-default">
                <FaCheckSquare />{" "}
              </span>
            )}
            {!item?.status ? (
              <span className="text-success">
                <FaCheckSquare /> Active
              </span>
            ) : (
              <span
                className={
                  item?.status === "accepted"
                    ? "text-success"
                    : item?.status === "rejected"
                    ? "text-danger"
                    : item?.status === "screening" || item?.status === "pending"
                    ? "text-warning"
                    : item?.status === "review"
                    ? "text-primary"
                    : item?.status === "draft" || item?.status === "parked"
                    ? "text-info"
                    : "text-default"
                }
              >
                {item?.status}
              </span>
            )}
            </>
          )
        },
        disableSortBy: true,
      },
      {
        Header: "Launch Date",
        accessor: "",
        Cell: ({row}) => {
          const item = row?.original;
          return (
            <>{item?.createdAt ? formatDateRegionWise(item.createdAt , false, false,item.region ) : ""}</>
          )
        },
        disableSortBy: true,
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({row}) => {
          const item = row?.original;
          return (
            <Link to={`/${item?.id}/fund-configuration`}>
            <FeatherIcon icon={"settings"} size="15" />
          </Link>
          )
        },
        disableSortBy: true,
      }
    ];
    return columns;
  }, []);

  const handlePagination = useCallback(
    (offset, limit) => {
      getFilterFunds('', offset, limit);
    },
    [getFilterFunds]
  );
  return (
    <>
      <div className="main-content">
        <DynamicHeader
          style={{ marginBottom: "0rem" }}
          title="Domain Accounts"
          titlesmall="Compliance Portal"
          buttontext={""}
          buttoncallback={headerButtonCallBack}
          isShowFundLogo={true}
        />

        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <Filter
                getFilterFunds={getFilterFunds}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                pageIndex={pageIndex}
                handleAlert={handleAlert}
                isLoader= {handleLoader}
              />
              {isLoader ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader animation="grow" custom={true} />
                </div>
              ) : fundData.length > 0 ? (
                <div className="main-content">
                  <Container fluid>
                    <Row className="justify-content-center">
                      <Col xs={12}>
                        <div className="card">
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                            className="card-header"
                          >
                            <div
                              style={{ display: "flex", justifyContent: "end" }}
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "190px",
                                  padding: "0",
                                }}
                                onClick={handleClickExportEntityData}
                              >
                                Download Entity Report <HiDownload />
                              </Button>
                            </div>
                          </div>
                          <div className="table-responsive">
                            <TableComponent
                              pageLimit={50}
                              allData={fundData}
                              fetchPageData={handlePagination}
                              offset={offset}
                              setOffset={setOffset}
                              columns={columns}
                              pagination={true}
                              totalLimit={totalAccountCount}
                              isDomain={true}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              ) : null}

              {alertProps.show && (
                <CustomAlert
                  handleCloseAlert={handleCloseAlert}
                  message={alertProps.message}
                  variant={alertProps.variant}
                  show={alertProps.show}
                  hideAuto={alertProps.hideAuto}
                  onClose={() => setAlertProps({ ...alertProps, show: false })}
                  className="position-fixed bottom-0 start-50 translate-middle-x"
                >
                  {alertProps.message}
                </CustomAlert>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
