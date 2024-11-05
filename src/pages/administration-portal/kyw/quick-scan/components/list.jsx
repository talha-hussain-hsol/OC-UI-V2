import { Col, Container, Row, Nav, Spinner, Form, Button, Pagination } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import KywDynamicHeader from "../../../../../widgets/KycDynamicHeader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { getWalletAddressQuickScanListAPI, submitWalletAddressQuickScanAPI, getCryptoCurrencyChainListAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import LoadingSpinner from "../../../../../components/ui/loader/index";
import CustomAlert from "../../../../../widgets/components/Alerts";
import UPPSalla from "../../wallet/components/UPPSalla";

export default function QuickScanWallet() {
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [walletAddressQuickScanData, setWalletAddressQuickScanData] = useState([]);
  const [walletAddressError, setWalletAddressError] = useState(false);
  const [cryptoCurrencyError, setCryptoCurrencyError] = useState(false);
  const [chainList, setChainList] = useState([]);
  const [walletAddressQuickScanDataCount, setWalletAddressQuickScanDataCount] = useState(0);
  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
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
    getWalletAddressQuickScanList(params?.fund_id);
    getCryptoCurrencyChainList();
  }, []);
  useEffect(
    function () {
      if (walletAddressQuickScanData && walletAddressQuickScanDataCount != 0) {
        let totalRecords = walletAddressQuickScanDataCount;
        let numberOfPages = totalRecords / rowsPerPage;
        let roundedUp = Math.ceil(numberOfPages);
        let resultArray = [];
        for (let i = 1; i <= roundedUp; i++) {
          resultArray.push(i);
        }
        setPageOptions(resultArray);
      }
    },
    [walletAddressQuickScanData, walletAddressQuickScanDataCount]
  );

  useEffect(() => {
    console.log(walletAddressQuickScanData, "walletAddressQuickScanData useEffect");
    if (walletAddressQuickScanData) {
      let item = [];
      for (let i of walletAddressQuickScanData) {
        if (i?.status == "NOT_INITIATED") {
          item.push(i);
        }
      }
      if (item.length > 0) {
        setTimeout(function () {
          getWalletAddressQuickScanListPolling(params?.fund_id);
        }, 10000);
      }
    }
  }, [walletAddressQuickScanData]);
  useEffect(
    function () {
      if (pageIndex) {
        getWalletAddressQuickScanList(params?.fund_id);
      }
    },
    [pageIndex]
  );

  const getWalletAddressQuickScanList = async (fundId) => {
    setIsLoader(true);
    let offset = 0;
    if (pageIndex == 1) {
      offset = 0;
    } else {
      offset = rowsPerPage * (pageIndex - 1);
    }
    const response = await getWalletAddressQuickScanListAPI(fundId, rowsPerPage, offset, cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      setWalletAddressQuickScanData(response?.data?.rows);
      setWalletAddressQuickScanDataCount(response?.data?.count);
    } else {
    }
  };
  const getWalletAddressQuickScanListPolling = async (fundId) => {
    let offset = 0;
    if (pageIndex == 1) {
      offset = 0;
    } else {
      offset = rowsPerPage * (pageIndex - 1);
    }
    const response = await getWalletAddressQuickScanListAPI(fundId, rowsPerPage, offset, cancelTokenSource.token);

    if (response.success == true) {
      setWalletAddressQuickScanData(response?.data?.rows);
      setWalletAddressQuickScanDataCount(response?.data?.count);
    } else {
    }
  };
  const getCryptoCurrencyChainList = async () => {
    setIsLoader(true);
    const response = await getCryptoCurrencyChainListAPI(params?.fund_id,cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      setChainList(response?.data?.response?.data);
    } else {
    }
  };
  const handleSubmit = (e) => {
    if (walletAddress == "" || cryptoCurrency == "") {
      if (walletAddress == "") {
        setWalletAddressError(true);
      } else {
        setWalletAddressError(false);
      }
      if (cryptoCurrency == "") {
        setCryptoCurrencyError(true);
      } else {
        setCryptoCurrencyError(false);
      }
      return;
    } else {
      setWalletAddressError(false);
      setCryptoCurrencyError(false);

      let dataToSend = {
        chain: cryptoCurrency,
        address: walletAddress,
      };
      submitWalletAddressQuickScan(dataToSend);
    }
  };
  const submitWalletAddressQuickScan = async (dataToSend) => {
    setIsLoader(true);
    const response = await submitWalletAddressQuickScanAPI(dataToSend, params?.fund_id, cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      setWalletAddressQuickScanData([]);
      getWalletAddressQuickScanList(params?.fund_id);
      setIsLoader(false);
      handleAlert({
          variant: "success",
          message: "Wallet Address Added Successfully",
          show: true,
          hideAuto: true,
        });
      setCryptoCurrency("");
      setWalletAddress("");
    } else {
      handleAlert({
        variant: "danger",
        message: response.user_message ? response.user_message : response.system_message,
        show: true,
        hideAuto: true,
      });
    }
  };
  const handleClickPrevious = (e) => {
    setPageIndex(pageIndex - 1);
  };
  const handleClickNext = (e) => {
    setPageIndex(pageIndex + 1);
  };
  const gotoPage = (page) => {
    setPageIndex(page);
  };
  const handleViewDetail = (e, data) => {
    setIsModalDetailVisible(false);
    setIsLoader(true);
    setTimeout(function () {
      setIsLoader(false);
      setIsModalDetailVisible(true);
    }, 1000);

    setDetailData(data);
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
          <Col xs={12} lg={12} xl={12}>
            <div className="row">
              <div className="card">
                <KywDynamicHeader title={'Quick Scan'} />
                {isLoader ? (
                  <LoadingSpinner
                    animation="grow"
                    custom={true}
                    height="70vh"
                  />
                ) : (
                  <div className="card-body">
                    <Form className="identity-form">
                      <div className="row">
                        <div className="col-3 col-md-3">
                          <div className="form-group">
                            <label className="form-label">Chains</label>
                            <select
                              type="text"
                              className={'form-control'}
                              defaultValue={cryptoCurrency}
                              onChange={(e) => {
                                setCryptoCurrency(e.target.value);
                              }}
                            >
                              <option value="">Select Chains</option>
                              {chainList.length > 0 &&
                                chainList.map((item, index) => (
                                  <option key={index} value={item.chain}>
                                    {item.chain == 'ETH'
                                      ? 'ETH / ERC- 20'
                                      : item.chain}
                                  </option>
                                ))}
                            </select>
                            {cryptoCurrencyError ? (
                              <span className="error-fields">
                                Select Chains To Continue
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-9 col-md-9">
                          <div className="form-group">
                            <label className="form-label">Wallet Address</label>
                            <input
                              type="text"
                              className={'form-control'}
                              placeholder="Wallet Address"
                              defaultValue={walletAddress}
                              onChange={(e) => {
                                setWalletAddress(e.target.value);
                              }}
                            />
                            {walletAddressError ? (
                              <span className="error-fields">
                                Enter Wallet Address To Continue
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <Button
                            className="btn btn-primary"
                            onClick={(e) => {
                              handleSubmit(e);
                            }}
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                )}
              </div>
              {isLoader ? null : (
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-header-title">Report List</h4>
                  </div>
                  <div class="table-responsive">
                    <table className="table table-sm table-nowrap card-table">
                      <thead>
                        <tr>
                          <th>CRYPTO ADDRESS</th>
                          <th>TYPE</th>
                          <th>SUBMISSION DATE</th>
                          <th>TOTAL AMT</th>
                          <th>TOTAL TX</th>
                          <th>RISK</th>
                          <th>Last Review Date</th>
                          <th>STATUS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      {console.log(
                        walletAddressQuickScanData,
                        'walletAddressQuickScanData',
                      )}
                      <tbody className="list">
                        {walletAddressQuickScanData &&
                          walletAddressQuickScanData.map((item, index) => (
                            <tr key={index}>
                              <td className="uppercase-text">
                                {
                                  item?.meta?.payload?.screening?.UPPSALA?.case
                                    ?.address
                                }
                              </td>
                              <td className="uppercase-text">
                                {
                                  item?.meta?.payload?.screening?.UPPSALA?.case
                                    ?.chain
                                }
                              </td>
                              <td>
                                {
                                  item?.meta?.report?.data?.response[0]
                                    ?.analysis_start_time
                                }
                              </td>
                              <td>
                                {
                                  item?.meta?.report?.data?.response[0]
                                    ?.total_amt
                                }
                              </td>
                              <td>
                                {
                                  item?.meta?.report?.data?.response[0]
                                    ?.total_tx
                                }
                              </td>
                              <td>
                                {item?.meta?.report?.data?.response[0]
                                  ?.risk_score >= 0 &&
                                item?.meta?.report?.data?.response[0]
                                  ?.risk_score <= 15 ? (
                                  <span
                                    style={{ color: '#80c380' }}
                                    className="value"
                                  >
                                    LOW RISK
                                  </span>
                                ) : item?.meta?.report?.data?.response[0]
                                    ?.risk_score >= 16 &&
                                  item?.meta?.report?.data?.response[0]
                                    ?.risk_score <= 30 ? (
                                  <span
                                    style={{ color: 'orange' }}
                                    className="value"
                                  >
                                    Medium Risk
                                  </span>
                                ) : item?.meta?.report?.data?.response[0]
                                    ?.risk_score >= 31 &&
                                  item?.meta?.report?.data?.response[0]
                                    ?.risk_score <= 50 ? (
                                  <span
                                    style={{ color: 'red' }}
                                    className="value"
                                  >
                                    {' '}
                                    High Risk
                                  </span>
                                ) : item?.meta?.report?.data?.response[0]
                                    ?.risk_score >= 51 &&
                                  item?.meta?.report?.data?.response[0]
                                    ?.risk_score <= 100 ? (
                                  <span
                                    style={{ color: 'red' }}
                                    className="value"
                                  >
                                    {' '}
                                    Extremely High Risk
                                  </span>
                                ) : null}
                              </td>
                              <td>
                                {item?.meta?.report?.data !== null &&
                                item?.meta?.report
                                  ? new Date(
                                      item?.meta?.report?.data?.response[0]?.query_time,
                                    ).toLocaleString('en-GB')
                                  : null}
                              </td>

                              <td
                                style={{
                                  color: item?.meta?.report
                                    ? item?.meta?.report?.status ===
                                        'NOT_INITIATED' ||
                                      item?.meta?.report?.status === 'FAILED'
                                      ? 'red'
                                      : item?.meta?.report?.status ===
                                        'PROCESSED'
                                      ? 'orange'
                                      : item?.meta?.report?.status ===
                                        'COMPLETED'
                                      ? 'rgb(128, 195, 128)'
                                      : 'black'
                                    : item?.status === 'NOT_INITIATED'
                                    ? 'red'
                                    : item?.status === 'PROCESSED'
                                    ? 'orange'
                                    : item?.status === 'COMPLETED'
                                    ? 'rgb(128, 195, 128)'
                                    : 'black',
                                }}
                              >
                                {item?.meta?.report
                                  ? item?.meta?.report?.status
                                      .replaceAll('_', ' ')
                                      .toLowerCase()
                                      .replace(/\b\w/g, (char) =>
                                        char.toUpperCase(),
                                      )
                                  : item?.status
                                  ? item?.status
                                      .replaceAll('_', ' ')
                                      .toLowerCase()
                                      .replace(/\b\w/g, (char) =>
                                        char.toUpperCase(),
                                      )
                                  : ''}
                              </td>

                              <td>
                                {item?.meta?.report?.status == 'COMPLETED' ? (
                                  <FeatherIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      handleViewDetail(e, item);
                                    }}
                                    icon="eye"
                                    size="1em"
                                  />
                                ) : null}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '10px',
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
                          disabled={pageIndex === pageOptions.length}
                          onClick={(e) => {
                            handleClickNext(e);
                          }}
                        >
                          Next
                        </Pagination.Item>
                      </Pagination>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isModalDetailVisible ? (
              <UPPSalla screeningDetail={detailData?.meta?.report} />
            ) : null}

            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
