import { Button, Col, Container, Form, Row, Nav, Card, Modal } from "react-bootstrap";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import FeatherIcon from "feather-icons-react";
import LoadingSpinner from "../../../../../components/ui/loader/index";
import { downloadWalletReportAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import axios from "axios";
import CustomAlert from "../../../../../widgets/components/Alerts";

export default function InternetSearch({ ...props }) {
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const params = useParams();
  const [screeningWalletData, setScreeningWalletData] = useState(props?.screeningDetail?.data?.response);
  const [screeningWalletDataForModal, setScreeningWalletDataForModal] = useState(props?.screeningDetail?.data?.response[0]);
  const [isViewModal, setIsViewModal] = useState(true);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  useEffect(() => {
    document.getElementById("download-pdf-detail").style.display = "none";
    // setIsLoader(false);
  }, []);
  const handleViewDetail = (e) => {
    console.log("handleViewDetail");
    setIsViewModal(true);
    
  };
  const handleCloseModal = () => {
    setIsViewModal(false);

  }

    const handleUpsalaDownloadPdf = async (walletData) => {
      setIsLoader(true);
      const response = await downloadWalletReportAPI(params?.fund_id, params?.wallet_id, cancelTokenSource.token);
      if (response.success == true) {
        setIsLoader(false);
        window.open(response.data, '_blank');
      } else {
        handleAlert({
          variant: "danger",
          message: response.user_message,
          show: true,
          hideAuto: true,
        });
        setIsLoader(false);

          // setIsLoader(false);
      }
  }
  
  // const _exportPdfDetail = () => {
  //   printJS("download-pdf-detail", "html");
  //   document.getElementById("download-pdf-detail").style.display = "none";
  //   setIsLoader(false);
  // };

  const pageNumberChangedCallback = (data) => {};
  const columns = useMemo(
    () => [
      // CRYPTO ADDRESS	TYPE	SUBMISSION DATE	TOTAL AMT	TOTAL TX	RISK	STATUS	ACTION

      {
        Header: "CRYPTO ADDRESS",
        accessor: "address",
      },
      {
        Header: "TYPE",
        accessor: "blockchain",
      },
      {
        Header: "SUBMISSION DATE",
        accessor: "analysis_start_time",
        Cell: (props) => <>{props?.cell.row.original?.analysis_start_time}</>,
      },
      {
        Header: "TOTAL AMT",
        accessor: "total_amt",
        Cell: (props) => <>{props?.cell.row.original?.total_amt}</>,
      },
      {
        Header: "TOTAL TX",
        accessor: "total_tx",
        Cell: (props) => <>{props?.cell.row.original?.total_tx}</>,
      },
      {
        Header: "RISK",
        accessor: "risk_score",
        Cell: (props) => <>{props?.cell.row.original?.risk_score}</>,
      },

      {
        Header: "ACTION",
        accessor: "id",
        Cell: (props) => (
          <>
            <FeatherIcon
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                handleViewDetail(e);
              }}
              icon={"eye"}
              size="17"
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <div className="main-content custom-mod">
      
      <Modal size="xl" show={isViewModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
      {
            isLoader &&  <LoadingSpinner animation="grow" custom={true} height="100vh" />
        }
        <Modal.Header>
          <Modal.Title>
            <div>
              <h3>UPPSALA Detail</h3>
            </div>
          </Modal.Title>
          <div>
            <a target="_blank" className="btn btn-primary" onClick={(e)=>{handleUpsalaDownloadPdf(screeningWalletDataForModal)}}>
              <FeatherIcon icon="download" size="15px" />
              Download
            </a>
          </div>
        
        </Modal.Header>
        {console.log(screeningWalletDataForModal, "screeningWalletDataForModal")}
        {alertProps.show && (
        <CustomAlert handleCloseAlert={handleCloseAlert} top={true} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
          {alertProps.message}
        </CustomAlert>
      )}
        <Modal.Body className="show-grid ">
          <Container className="uppsalla_detail">
            <div className="row">
           
              <div class="col-sm-6">
                <div class="card">
                  <h1 className="title-head">Report Details</h1>
                  <h1 className="value" style={{ fontSize: "14px" }}>
                    {screeningWalletDataForModal?.address}
                  </h1>
                  <div className="row">
                    <div className="col-sm-6">
                      <h1 className="value">REPORT ID</h1>
                    </div>
                    <div className="col-sm-6">
                      <h1 className="value">{screeningWalletDataForModal?.id}</h1>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <h1 className="value">TYPE</h1>
                    </div>
                    <div className="col-sm-6">
                      <h1 className="value">{screeningWalletDataForModal?.blockchain}</h1>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <h1 className="value">LAST TRANSACTION TIMESTAMP</h1>
                    </div>
                    <div className="col-sm-6">
                      <h1 className="value">{screeningWalletDataForModal?.analysis_end_time}</h1>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <h1 className="value">BLACKLISTED ADDRESS LIST</h1>
                    </div>
                    <div className="col-sm-6">
                      <h1 className="value">{screeningWalletDataForModal?.blacklisted_addr_list}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="card">
                  <h1 className="title-head">VERDICT</h1>

                  {screeningWalletDataForModal?.risk_score >= 0 && screeningWalletDataForModal?.risk_score <= 15 ? (
                    <h1 style={{ color: "#80c380" }} className="value">
                      LOW RISK
                    </h1>
                  ) : screeningWalletDataForModal?.risk_score >= 16 && screeningWalletDataForModal?.risk_score <= 30 ? (
                    <h1 style={{ color: "orange" }} className="value">
                      Medium Risk
                    </h1>
                  ) : screeningWalletDataForModal?.risk_score >= 31 && screeningWalletDataForModal?.risk_score <= 50 ? (
                    <h1 style={{ color: "red" }} className="value">
                      {" "}
                      High Risk
                    </h1>
                  ) : screeningWalletDataForModal?.risk_score >= 51 && screeningWalletDataForModal?.risk_score <= 100 ? (
                    <h1 style={{ color: "red" }} className="value">
                      {" "}
                      Extremely High Risk
                    </h1>
                  ) : null}
                </div>
                <div class="card">
                  <h1 className="title-head">STATIC ANALYTIC RESULTS (TRDB)</h1>
                  <h1 className="value">{screeningWalletDataForModal?.ground_truth_label}</h1>
                </div>
              </div>
            </div>
            <div className="row">
              <div class="col-sm-12">
                <div class="card">
                  <h1 className="title-head">MALICIOUS ACCOUNT DETAILS</h1>
                  <div class="col-sm-12">
                    <div className="row">
                      <div className="col-sm-3">
                        <h1 className="value">ESTIMATED MALICIOUS AMOUNT</h1>
                      </div>
                      <div className="col-sm-9">
                        <h1 className="value"> {screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.estimated_mal_amt).toFixed(3)}</h1>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-3">
                        <h1 className="value">ESTIMATED MALICIOUS TX</h1>
                      </div>
                      <div className="col-sm-9">
                        <h1 className="value">{screeningWalletDataForModal?.estimated_mal_tx}</h1>
                      </div>
                    </div>
                    <table class="table table-sm table-nowrap card-table">
                      <tbody class="list">
                        <tr>
                          <th className="head-row">Coins</th>
                          {screeningWalletDataForModal &&
                            Object.keys(screeningWalletDataForModal?.mal_amt_dict).map((item) => {
                              return <th>{item}</th>;
                            })}
                        </tr>
                        <tr>
                          <th className="head-row">Amount</th>
                          {screeningWalletDataForModal &&
                            Object.keys(screeningWalletDataForModal?.mal_amt_dict).map((item) => {
                              return <th>{parseFloat(screeningWalletDataForModal?.mal_amt_dict[item]).toFixed(3)}</th>;
                            })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div class="col-sm-12">
                <div class="card">
                  <h1 className="title-head">ACCOUNT DETAILS</h1>
                  <div class="col-sm-12">
                    <div className="row">
                      <div className="col-sm-3">
                        <h1 className="value">TOTAL AMOUNT</h1>
                      </div>
                      <div className="col-sm-9">
                        <h1 className="value">{screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.total_amt).toFixed(3)}</h1>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-3">
                        <h1 className="value">TOTAL TRANSACTION</h1>
                      </div>
                      <div className="col-sm-9">
                        <h1 className="value">{screeningWalletDataForModal?.total_tx}</h1>
                      </div>
                    </div>
                    <table class="table table-sm table-nowrap card-table">
                      <tbody class="list">
                        <tr>
                          <th className="head-row">Coins</th>
                          {screeningWalletDataForModal &&
                            Object.keys(screeningWalletDataForModal?.total_amt_dict).map((item) => {
                              return <th>{item}</th>;
                            })}
                        </tr>
                        <tr>
                          <th className="head-row">Amount</th>
                          {screeningWalletDataForModal &&
                            Object.keys(screeningWalletDataForModal?.total_amt_dict).map((item) => {
                              return <th>{parseFloat(screeningWalletDataForModal?.total_amt_dict[item]).toFixed(3)}</th>;
                            })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => {
              setIsViewModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <div id="download-pdf-detail" style={{ width: "100em", height: "2100px", padding: "10px" }}>
        <Container className="uppsalla_detail">
        <div className="row">
            <Card>
              <Card.Body>
                <Card.Title>
                  <h2 style={{ marginBottom: "2px" }}>UPPSALA Report</h2>
                </Card.Title>
              
              
              </Card.Body>
            </Card>
          </div>
          <hr style={{ border: "1px solid black", width: "20%", display: "flex", justifyContent: "center" }} />

          <div className="row">
            <Card>
              <Card.Body>
                <Card.Title>
                  <h2>Report Details</h2>
                </Card.Title>
                <Card.Subtitle>
                  <h4 style={{ marginTop: "1px", marginBottom: "3px" }}>{screeningWalletDataForModal?.address}</h4>
                </Card.Subtitle>
                <div>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>Report ID</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal?.id}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>Type</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal?.blockchain}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>Last Transaction Timestamp</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal?.analysis_end_time}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>Blacklisted Address List</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal?.blacklisted_addr_list}</div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </div>
          <hr style={{ border: "1px solid black", width: "50%", display: "flex", justifyContent: "center" }} />

          <div className="row">
            {" "}
            <div class="col-sm-12">
              <div class="card">
                <Row>
                  <Col md={4}>
                    <h1 className="title-head">VERDICT</h1>
                  </Col>
                  <Col md={8}>
                    <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>
                      {" "}
                      {screeningWalletDataForModal?.risk_score >= 0 && screeningWalletDataForModal?.risk_score <= 15 ? (
                        <h1 style={{ color: "#80c380" }} className="value">
                          LOW RISK
                        </h1>
                      ) : screeningWalletDataForModal?.risk_score >= 16 && screeningWalletDataForModal?.risk_score <= 30 ? (
                        <h1 style={{ color: "orange" }} className="value">
                          Medium Risk
                        </h1>
                      ) : screeningWalletDataForModal?.risk_score >= 31 && screeningWalletDataForModal?.risk_score <= 50 ? (
                        <h1 style={{ color: "red" }} className="value">
                          {" "}
                          High Risk
                        </h1>
                      ) : screeningWalletDataForModal?.risk_score >= 51 && screeningWalletDataForModal?.risk_score <= 100 ? (
                        <h1 style={{ color: "red" }} className="value">
                          {" "}
                          Extremely High Risk
                        </h1>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </div>

              <div class="card">
                <Row>
                  <Col md={4}>
                    <h1 className="title-head">STATIC ANALYTIC RESULTS (TRDB)</h1>
                  </Col>
                  <Col md={8}>
                    <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>
                      {" "}
                      <h1 className="value">{screeningWalletDataForModal?.ground_truth_label}</h1>
                    </div>
                  </Col>
                </Row>
                <hr style={{ border: "1px solid black", width: "50%", display: "flex", justifyContent: "center" }} />
              </div>
            </div>
          </div>
          <hr style={{ border: "1px solid black", width: "50%", display: "flex", justifyContent: "center" }} />


          <div className="row">
            <Card>
              <Card.Body>
                <Card.Title>
                  <h2 style={{ marginBottom: "2px" }}>MALICIOUS ACCOUNT DETAILS</h2>
                </Card.Title>

                <div>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>ESTIMATED MALICIOUS AMOUNT</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.estimated_mal_amt).toFixed(3)}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>ESTIMATED MALICIOUS TX</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal?.estimated_mal_tx}</div>
                    </Col>
                  </Row>
                  <table class="table table-sm table-nowrap card-table">
                    <tbody class="list">
                      <tr>
                        <th className="head-row">Coins</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.mal_amt_dict).map((item) => {
                            return <th>{item}</th>;
                          })}
                      </tr>
                      <tr>
                        <th className="head-row">Amount</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.mal_amt_dict).map((item) => {
                            return <th>{parseFloat(screeningWalletDataForModal?.mal_amt_dict[item]).toFixed(3)}</th>;
                          })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* <div className="row">
            <div class="col-sm-12">
              <div class="card">
                <h1 className="title-head">MALICIOUS ACCOUNT DETAILS</h1>
                <div class="col-sm-12">
                  <div className="row">
                    <div className="col-sm-3">
                      <h1 className="value">ESTIMATED MALICIOUS AMOUNT</h1>
                    </div>
                    <div className="col-sm-9">
                      <h1 className="value"> {screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.estimated_mal_amt).toFixed(3)}</h1>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">
                      <h1 className="value">ESTIMATED MALICIOUS TX</h1>
                    </div>
                    <div className="col-sm-9">
                      <h1 className="value">{screeningWalletDataForModal?.estimated_mal_tx}</h1>
                    </div>
                  </div>
                  <table class="table table-sm table-nowrap card-table">
                    <tbody class="list">
                      <tr>
                        <th className="head-row">Coins</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.mal_amt_dict).map((item) => {
                            return <th>{item}</th>;
                          })}
                      </tr>
                      <tr>
                        <th className="head-row">Amount</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.mal_amt_dict).map((item) => {
                            return <th>{parseFloat(screeningWalletDataForModal?.mal_amt_dict[item]).toFixed(3)}</th>;
                          })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> */}
          <hr style={{ border: "1px solid black", width: "50%", display: "flex", justifyContent: "center" }} />


          <div className="row">
          <Card>
              <Card.Body>
                <Card.Title>
                  <h2 style={{ marginBottom: "2px" }}>ACCOUNT DETAILS</h2>
                </Card.Title>

                <div>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>TOTAL AMOUNT</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.total_amt).toFixed(3)}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>TOTAL TRANSACTION</div>
                    </Col>
                    <Col md={8}>
                      <div style={{ fontSize: 14, marginTop: "5px", fontWeight: 500 }}>{screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.total_amt).toFixed(3)}</div>
                    </Col>
                  </Row>
                  <table class="table table-sm table-nowrap card-table">
                    <tbody class="list">
                      <tr>
                        <th className="head-row">Coins</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.total_amt_dict).map((item) => {
                            return <th>{item}</th>;
                          })}
                      </tr>
                      <tr>
                        <th className="head-row">Amount</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.total_amt_dict).map((item) => {
                            return <th>{parseFloat(screeningWalletDataForModal?.total_amt_dict[item]).toFixed(3)}</th>;
                          })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
            {/* <div class="col-sm-12">
              <div class="card">
                <h1 className="title-head">ACCOUNT DETAILS</h1>
                <div class="col-sm-12">
                  <div className="row">
                    <div className="col-sm-3">
                      <h1 className="value">TOTAL AMOUNT</h1>
                    </div>
                    <div className="col-sm-9">
                      <h1 className="value">{screeningWalletDataForModal && parseFloat(screeningWalletDataForModal?.total_amt).toFixed(3)}</h1>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">
                      <h1 className="value">TOTAL TRANSACTION</h1>
                    </div>
                    <div className="col-sm-9">
                      <h1 className="value">{screeningWalletDataForModal?.total_tx}</h1>
                    </div>
                  </div>
                  <table class="table table-sm table-nowrap card-table">
                    <tbody class="list">
                      <tr>
                        <th className="head-row">Coins</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.total_amt_dict).map((item) => {
                            return <th>{item}</th>;
                          })}
                      </tr>
                      <tr>
                        <th className="head-row">Amount</th>
                        {screeningWalletDataForModal &&
                          Object.keys(screeningWalletDataForModal?.total_amt_dict).map((item) => {
                            return <th>{parseFloat(screeningWalletDataForModal?.total_amt_dict[item]).toFixed(3)}</th>;
                          })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div> */}
          </div>
          <hr style={{ border: "1px solid black", width: "50%", display: "flex", justifyContent: "center" }} />

        </Container>
      </div>
    </div>
  );
}
