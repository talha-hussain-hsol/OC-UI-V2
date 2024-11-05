import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Alert, Button,  Col,  Row, Pagination,  Container, Tooltip } from "react-bootstrap";
// import { GrFormView } from "react-icons/gr";
import axios from "axios";
import { getPeriodicReviewAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import KycDynamicHeader from "../../../../../widgets/KycDynamicHeader";
import { useNavigate, useParams } from "react-router-dom";
import TableComponent from "../../../../shared-components/table-component-with-backend-pagination";
// import { format } from "date-fns";
// import { IndeterminateCheckbox, Select } from "../../../../../components/vendor";
// import LoadingSpinner from "../../../../../widgets/bootstrap-component/Spinner";
// import FeatherIcon from "feather-icons-react";
import formatDateRegionWise from "./../../../../../helpers/formatDateRegionWise";
import { useSelector } from "react-redux";
import QuestionnaireModal from "./questionnaire-modal";
import Loader from "../../../../../components/ui/loader";

export default function PeriodicReviewList({ ...props }) {
  const fundConfig = useSelector((state) => state?.fundConfig);
  console.log("fundConfigfundConfig", fundConfig);
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [periodicList, setPeriodicList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageOptions, setPageOptions] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [periodicReviewQuestion, setPeriodicReviewQuestion] = useState(fundConfig?.config?.kyc?.periodic_review_questions);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [selection, setSelection] = useState("pending_periodic_review");

  const handleClickSelection = (e, state) => {
    setCount(0);
    setPageOptions(0);
    setPageOptions([]);
    handlePeriodic(state);
    setSelection("pending_periodic_review")


  };
  const handleClickSelections = (e, state) => {
    setCount(0);
    setPageOptions(0);
    setPageOptions([]);
    handlePeriodic(state);
    setSelection("overdue_periodic_review")

  };

  const handlePeriodic = (overDue) => {
    getPeriodicList(overDue);
  };

  const handleShowAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "" });
    }, 3000); // Hide alert after 3 seconds
  };

  const handleShow = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const calculatePageOptions = useCallback(() => {
    if (count !== 0) {
      const totalRecords = count;
      const numberOfPages = Math.ceil(totalRecords / rowsPerPage);
      const resultArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);
      setPageOptions(resultArray);
    }
  }, [count, rowsPerPage]);

  useEffect(() => {
    calculatePageOptions();
  }, [periodicList, count, calculatePageOptions]);

  useEffect(() => {
    if (params?.fund_id && pageIndex !== undefined && pageIndex !== null) {
      getPeriodicList();
    }
  }, [pageIndex, params?.fund_id]);

  const handleClickPrevious = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  }, [pageIndex]);

  const handleClickNext = useCallback(() => {
    if (pageIndex < pageOptions.length - 1) {
      setPageIndex((prev) => prev + 1);
    }
  }, [pageIndex, pageOptions.length]);

  const gotoPage = useCallback((page)=> {
    setPageIndex(page)
;
  }, []);

  const getPeriodicList = useCallback(async (overDue = false) => {
    try {
      setIsLoader(true);
      const offset = pageIndex > 0 ? rowsPerPage * pageIndex : 0;
      const response = await getPeriodicReviewAPI(params?.fund_id, offset, rowsPerPage, cancelTokenSource.token, overDue);
      if (response.success) {
        setPeriodicList(response?.data?.rows);
        // setTotalCount(response?.data?.count);
        setCount(response?.data?.count);
      }
    } catch (error) {
      console.error("Error fetching periodic review list", error);
    } finally {
      setIsLoader(false);
    }
  }, [pageIndex, rowsPerPage, params?.fund_id]);

  const pageNumberChangedCallback = (e) => {
    console.log(e, "pageNumberChangedCallback");
  };

  const tooltip = <Tooltip id="tooltip">Review</Tooltip>;

  const columns = useMemo(
    () => [
      {
        Header: "NAME",
        accessor: "identity",
        Cell: ({ value }) => <p>{value.label}</p>,
      },
      {
        Header: "RISK SCORE",
        accessor: "meta", // Ensure meta is the correct top-level key in your data
        Cell: ({ value }) => {
          let score = "";
          if (value) {
            try {
              const riskData = JSON.parse(value.riskData);
              score = riskData?.score || ""; // Use optional chaining to handle potential undefined values
            } catch (e) {
              console.error("Error parsing riskData:", e);
            }
          }
          return <p>{score}</p>;
        },
      },
      {
        Header: "OVER RIDE RISK RATING",
        accessor: "override_risk_rating",
        Cell: ({ row }) => {
          console.log("row", row);
          const value = row.values?.meta?.overrideRiskRating;
          return <p>{value ? value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : ""}</p>;
        },
      },
      {
        Header: "Computed RISK RATING",
        accessor: "computed_risk_rating",
        Cell: ({ row }) => {
          console.log("row", row);
          const value = row.values?.meta?.computedRiskRating;
          return <p>{value ? value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : ""}</p>;
        },
      },
      {
        Header: "APPROVAL STATUS",
        accessor: "approval_status",
        Cell: ({ row }) => {
          const value = row.values?.meta?.approvalStatus;
          let color = "";
          switch (value) {
            case "REQUEST_CHANGES":
              color = "text-warning";
              break;
            case "ACCEPTED":
              color = "text-success";
              break;
            case "REJECTED":
              color = "text-danger";
              break;
            case "PENDING":
              color = "text-info";
              break;
            default:
              color = "text-default";
              break;
          }
          return (
            <span className={color}>
              {value &&
                value
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase())}
            </span>
          );
        },
      },
      {
        Header: "CREATED AT",
        accessor: "createdAt",
        Cell: ({ value }) => <p>{formatDateRegionWise(value)}</p>,
      },
      {
        Header: "UPDATED AT",
        accessor: "updatedAt",
        Cell: ({ value }) => <p>{formatDateRegionWise(value)}</p>,
      },
      {
        Header: "Next Review Date",
        accessor: "reviewDate",
        Cell: ({ value }) => <p>{formatDateRegionWise(value)}</p>,
      },
      {
        Header: "Action",
        disableSortBy: true,
        accessor: "id",
        Cell: (props) => (
          <>
            {props?.cell.row.original?.accountId && (
              <Button variant="primary" onClick={() => handleShow(props?.cell.row.original)}>
                {" "}
                Review
              </Button>
            )}
          </>
        ),
      },
    ],
    []
  );

  const handleClickPeriodicReviewDetail = useCallback(
    (data) => {
      navigate(`/${params?.fund_id}/kyc/account/identity/${data?.identity?.type.toLowerCase()}/screening/${data?.identity?.id}/${data?.accountId}`);
    },
    [navigate, params?.fund_id]
  );

  const maxVisiblePages = 5;

  const renderPageItems = useCallback(() => {
    const items = [];
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
  }, [pageOptions.length, pageIndex, gotoPage]);

  return (
    <>
      <div className="main-content">
        {showModal ? <QuestionnaireModal getPeriodicList={getPeriodicList} selectedRow={selectedRow} show={showModal} handleClose={handleClose} questions={periodicReviewQuestion} showAlert={handleShowAlert} /> : null}

        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div className="card">
                <KycDynamicHeader title="Periodic Review" />
                <div className="individual-corporate-selection-container">
                        <button
                          className={selection == "pending_periodic_review" ? "btn btn-primary btn-quick-scan-selection-individual " : "btn btn-primary btn-quick-scan-selection-individual active"}
                          onClick={(e) => {
                            handleClickSelection(e, false);
                          }}
                          disabled={isLoader}

                        >
                          Pending Periodic Review
                        </button>
                        <button
                          className={selection == "overdue_periodic_review" ? "btn btn-primary btn-quick-scan-selection-corporate " : "btn btn-primary btn-quick-scan-selection-corporate active"}
                          onClick={(e) => {
                            handleClickSelections(e, true);
                          }}
                          disabled={isLoader}
                        >
                          Overdue Periodic Review
                        </button>
                      </div>
                      <div className="mt-5 mb-5" style={{ display: "flex", flexDirection: "column" }}>
                      {selection === "pending_periodic_review"
                       ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      This section displays all cases that are due for a periodic review within the next 3 months. The default review cycle is determined by the risk level of each case.
                      </small>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      High-risk cases require a review (every 1 year), medium-risk cases (every 2 years), and low-risk cases (every 3 years).
                      </small>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      Cases listed in this section are approaching their review date and need attention to ensure they remain compliant with the periodic review cycle.
                      </small>
                    </div>
                  ) : null }
                  {selection === 'overdue_periodic_review' ?  (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      This section highlights all cases where the periodic review is overdue. The default review cycle, based on risk level,
                      </small>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      specifies that high-risk cases should be reviewed (every 1 year), medium-risk cases (every 2 years), and low-risk cases (every 3 years). 
                      </small>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      Cases in this section have passed their scheduled review date and require immediate action to maintain compliance and reduce potential risks.
                      </small>
                    </div>
                  ) : null }
                </div>

                {/* <div className="mt-5 mb-5" style={{ display: "flex", flexDirection: "column" }}>
                  <small style={{ textAlign: "center" }} className="text-muted">
                    Periodic review section indicates all cases which are due for periodic review cycle within the next 3 months.
                  </small>
                  <small style={{ textAlign: "center" }} className="text-muted">
                    The default periodic review cycle is set for High Risk (every 1 year), Medium Risk (Every 2 years) and Low Risk (Every 3 years).
                  </small>
                </div> */}
                {isLoader ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Loader animation="grow" custom />
                  </div>
                ) : (
                  <>
                    <Row className="justify-content-center">
                      <Col xs={12}>
                        <TableComponent pagination={false} columns={columns} allData={periodicList} searchable={false} />
                      </Col>
                    </Row>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "-1rem" }}>
                      <Pagination size="lg">
                        <Pagination.Prev disabled={pageIndex === 0} onClick={handleClickPrevious} />
                        {renderPageItems()}
                        <Pagination.Next disabled={pageIndex === pageOptions.length - 1} onClick={handleClickNext} />
                      </Pagination>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
          {alert.show && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1050,
                width: "auto",
                maxWidth: "400px",
              }}
            >
              <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: "", variant: "" })}>
                {alert.message}
              </Alert>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}


