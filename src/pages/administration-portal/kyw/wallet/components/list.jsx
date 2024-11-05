import React, {  useState, useEffect } from "react";
import { Col, Row, Container, Pagination, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { getTransactionListAPI, downloadWalletReportAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import { Link, useParams } from "react-router-dom";
import { FiDownload } from "react-icons/fi";

import KywDynamicHeader from "../../../../../widgets/KywDynamicHeader";
import FeatherIcon from "feather-icons-react";
import LoadingSpinner from "../../../../../components/ui/loader/index";
import CustomAlert from "../../../../../widgets/components/Alerts";
export default function list({ ...props }) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [transactionList, setTransactionList] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [enablePagination, setEnablePagination] = useState(false);
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  useEffect(() => {
    if (params?.fund_id) {
      getTransactionList();
    }
  }, [params?.fund_id]);

  useEffect(() => {
    if (pageIndex && enablePagination) {
      getTransactionList();
    }
  }, [pageIndex, enablePagination]);
  useEffect(
    function () {
      if (transactionList && totalTransactionCount != 0) {
        let totalRecords = totalTransactionCount;
        let numberOfPages = totalRecords / rowsPerPage;
        let roundedUp = Math.ceil(numberOfPages);
        let resultArray = [];
        for (let i = 1; i <= roundedUp; i++) {
          resultArray.push(i);
        }
        setPageOptions(resultArray);
      }
    },
    [transactionList, totalTransactionCount]
  );
  const getTransactionList = async () => {
    setIsLoader(true);
    let offset = 0;
    if (pageIndex == 1) {
      offset = 0;
    } else {
      offset = rowsPerPage * (pageIndex - 1);
    }

    const response = await getTransactionListAPI(params?.fund_id, rowsPerPage, offset, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setTransactionList(response?.data?.account_list?.rows);
      setTotalTransactionCount(response?.data?.account_list?.count);
    } else {
      setIsLoader(false);
    }
  };
  const handleClickPrevious = (e) => {
    setPageIndex(pageIndex - 1);
  };
  const handleClickNext = (e) => {
    setEnablePagination(true);
    setPageIndex(pageIndex + 1);
  };
  const gotoPage = (page) => {
    setEnablePagination(true);
    setPageIndex(page);
  };
  const handleDownloadReport = async (walletId) => {
    setIsLoader(true);
    const response = await downloadWalletReportAPI(params?.fund_id, walletId, cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {y
      handleAlert({
        variant: "success",
        message: "Download Wallet Report Successfully",
        show: true,
        hideAuto: true,
      });
      window.open(response.data, "_blank");
    } else {
      // setIsLoader(false);
      handleAlert({
        variant: "danger",
        message: response?.user_message,
        show: true,
        hideAuto: true,
      });
    }
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };
  return (
    <div className="main-content">
      {alertProps.show && (
        <CustomAlert
          handleCloseAlert={handleCloseAlert}
          message={alertProps.message}
          variant={alertProps.variant}
          show={alertProps.show}
          hideAuto={alertProps.hideAuto}
          onClose={() => setAlertProps({ ...alertProps, show: false })}
        >
          {alertProps.message}
        </CustomAlert>
      )}

      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="main-content">
              <Container fluid>
                <Row className="justify-content-center">
                  <Col xs={12}>
                    <div class="card">
                      <KywDynamicHeader title={'Wallet'} />
                      {!isLoader ? (
                        <div class="table-responsive">
                          <table class="table table-sm table-nowrap card-table">
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>stage</th>
                                <th>Type</th>
                                <th>Chain</th>
                                <th>Address</th>
                                <th>Identity</th>
                                <th>Status</th>

                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody class="list">
                              {transactionList.length > 0 ? (
                                transactionList &&
                                transactionList.map((item, index) => (
                                  <>
                                    <tr>
                                      <td>
                                        <span class="text-success">
                                          <FeatherIcon
                                            icon="check-circle"
                                            className={
                                              item?.parent?.accountShareHolder
                                                ?.applicationStatusId ===
                                                'PENDING' ||
                                              item?.parent?.accountShareHolder
                                                ?.applicationStatusId ===
                                                'DRAFT'
                                                ? 'text-warning'
                                                : item?.parent
                                                    ?.accountShareHolder
                                                    ?.applicationStatusId ===
                                                  'ACCEPTED'
                                                ? 'text-success'
                                                : item?.parent
                                                    ?.accountShareHolder
                                                    ?.applicationStatusId ===
                                                  'REQUEST_CHANGES'
                                                ? 'text-danger'
                                                : 'text-default'
                                            }
                                            size="15"
                                            style={{ marginRight: '5px' }}
                                          />
                                        </span>
                                        <span
                                          className={
                                            item?.parent?.accountShareHolder
                                              ?.applicationStatusId ===
                                              'PENDING' ||
                                            item?.parent?.accountShareHolder
                                              ?.applicationStatusId === 'DRAFT'
                                              ? 'text-warning'
                                              : item?.parent?.accountShareHolder
                                                  ?.applicationStatusId ===
                                                'ACCEPTED'
                                              ? 'text-success'
                                              : item?.parent?.accountShareHolder
                                                  ?.applicationStatusId ===
                                                'REQUEST_CHANGES'
                                              ? 'text-danger'
                                              : 'text-default'
                                          }
                                        >
                                          {' '}
                                          {item?.parent?.accountShareHolder
                                            ?.account?.scount == 1
                                            ? 'Standalone'
                                            : 'Joint : '.item?.parent
                                                ?.accountShareHolder?.account
                                                ?.scount}
                                        </span>
                                      </td>
                                      <td>
                                        <span
                                          className={
                                            item?.parent?.accountShareHolder
                                              ?.account?.status === 'accepted'
                                              ? 'text-success'
                                              : item?.parent?.accountShareHolder
                                                  ?.account?.status ===
                                                'rejected'
                                              ? 'text-danger'
                                              : item?.parent?.accountShareHolder
                                                  ?.account?.status === 'review'
                                              ? 'text-warning'
                                              : item?.parent?.accountShareHolder
                                                  ?.account?.status ===
                                                'pending'
                                              ? 'text-warning'
                                              : 'text-default'
                                          }
                                        ></span>
                                        <span
                                          className={
                                            item?.parent?.accountShareHolder
                                              ?.account?.status === 'pending'
                                              ? 'text-warning'
                                              : item?.parent?.accountShareHolder
                                                  ?.account?.status ===
                                                'accepted'
                                              ? 'text-success'
                                              : item?.parent?.accountShareHolder
                                                  ?.account?.status ===
                                                'rejected'
                                              ? 'text-danger'
                                              : item?.parent?.accountShareHolder
                                                  ?.account?.status === 'review'
                                              ? 'text-warning'
                                              : 'text-default'
                                          }
                                        >
                                          {item?.parent?.accountShareHolder?.account?.status?.replace(
                                            /^\w/,
                                            (c) => c.toUpperCase(),
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {item?.parent.type
                                          .toLowerCase()
                                          .replace(/^\w/, (c) =>
                                            c.toUpperCase(),
                                          )}
                                      </td>
                                      <td>{item?.meta?.data?.chain}</td>
                                      <td>{item?.meta?.data?.address}</td>
                                      <td>{item?.parent?.label}</td>
                                      <td>
                                        <span
                                          className={
                                            item?.parent?.accountShareHolder
                                              ?.applicationStatusId ===
                                            'ACCEPTED'
                                              ? 'text-success'
                                              : item?.parent?.accountShareHolder
                                                  ?.applicationStatusId ===
                                                'REQUEST_CHANGES'
                                              ? 'text-danger'
                                              : item?.parent?.accountShareHolder
                                                  ?.applicationStatusId ===
                                                  'DRAFT' ||
                                                item?.parent?.accountShareHolder
                                                  ?.applicationStatusId ===
                                                  'PENDING'
                                              ? 'text-warning'
                                              : 'text-default'
                                          }
                                        >
                                          {item?.parent?.accountShareHolder
                                            ?.applicationStatusId !==
                                            'PENDING' &&
                                          item?.parent?.accountShareHolder
                                            ?.applicationStatusId !== 'DRAFT'
                                            ? ' '
                                            : item?.parent?.accountShareHolder
                                                ?.applicationStatusId ===
                                              'DRAFT'
                                            ? ' '
                                            : ' '}
                                        </span>
                                        <span
                                          className={
                                            item?.status === 'pending' ||
                                            item?.status === 'draft'
                                              ? 'text-warning'
                                              : item?.parent?.status ===
                                                'accepted'
                                              ? 'text-success'
                                              : item?.status ===
                                                'request_changes'
                                              ? 'text-danger'
                                              : 'text-default'
                                          }
                                        >
                                          {item?.status
                                            .toLowerCase()
                                            .replace(/^\w/, (c) =>
                                              c.toUpperCase(),
                                            )}
                                        </span>
                                      </td>

                                      <td style={{ display: 'flex' }}>
                                        {/* Add the OverlayTrigger component to add a tooltip */}

                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Wallet Details</Tooltip>
                                          }
                                        >
                                          <Link
                                            to={`/${params?.fund_id}/kyw/wallets/screening/${item?.id}`}
                                          >
                                            <span className="text-success">
                                              {/* Wrap the FeatherIcon and FiDownload components with the OverlayTrigger component */}
                                              <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                  <Tooltip>
                                                    Wallet Details
                                                  </Tooltip>
                                                }
                                              >
                                                <span>
                                                  <FeatherIcon
                                                    icon="sliders"
                                                    size="15"
                                                  />
                                                </span>
                                              </OverlayTrigger>
                                            </span>
                                          </Link>
                                        </OverlayTrigger>
                                        {item?.id && (
                                          <div
                                            style={{ marginLeft: '10px' }}
                                            onClick={(e) => {
                                              handleDownloadReport(item?.id);
                                            }}
                                          >
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={
                                                <Tooltip>
                                                  Download Report
                                                </Tooltip>
                                              }
                                            >
                                              <span className="text-success">
                                                <OverlayTrigger
                                                  placement="top"
                                                  overlay={
                                                    <Tooltip>
                                                      Download Report
                                                    </Tooltip>
                                                  }
                                                >
                                                  <FiDownload size="15" />
                                                </OverlayTrigger>
                                              </span>
                                            </OverlayTrigger>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="5"
                                    style={{
                                      textAlign: 'center',
                                      paddingTop: '15px',
                                    }}
                                  >
                                    No data found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {/* <Pagination>
                      {pageOptions.map((option, index) => (
                        <Pagination.Item
                          key={index}
                          active={option === pageIndex}
                          onClick={(e) => {
                            e.preventDefault();
                            gotoPage(option);
                          }}
                        >
                          {option + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination> */}

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <Pagination size="lg">
                              <Pagination.Item
                                disabled={pageIndex == 1}
                                onClick={(e) => {
                                  handleClickPrevious(e);
                                }}
                              >
                                Previous
                              </Pagination.Item>
                              {pageOptions.map((option, index) => (
                                <Pagination.Item
                                  key={index}
                                  active={option === pageIndex}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    gotoPage(option);
                                  }}
                                >
                                  {option}
                                </Pagination.Item>
                              ))}
                              <Pagination.Item
                                disabled={pageIndex === pageOptions?.length}
                                onClick={(e) => {
                                  handleClickNext(e);
                                }}
                              >
                                Next
                              </Pagination.Item>
                            </Pagination>
                          </div>
                        </div>
                      ) : (
                        <LoadingSpinner custom={true} />
                      )}
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
