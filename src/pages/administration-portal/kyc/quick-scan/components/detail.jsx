import { Button, Col, Container, Form, Row, Card, Nav, Spinner } from "react-bootstrap";
// import { AdministrationIdentityHeader } from "../../../../../widgets";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DowJones from "./entity/dow-jones";
import { FaArrowLeft } from "react-icons/fa";
import InternetSearch from "./entity/internet-search";
import RestrictedList from "./entity/restricted-list";
import KycDynamicHeader from "../../../../../widgets/KycDynamicHeader";
import { getQuickScanScreeningDetailAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import DynamicHeaderAdministration from "../../../../../widgets/DynamicHeaderAdministration";
export default function QuickScanDetail() {
  const cancelTokenSource = axios.CancelToken.source();
  const params = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [screeningDetail, setScreeningDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Add currentPage state

  const handleCurrentPage = (index) => {
    setCurrentPage(index);
  };

  useEffect(() => {
    getScreeningDetail();
  }, []);
  const getScreeningDetail = async () => {
    setIsLoader(true);

    const response = await getQuickScanScreeningDetailAPI(params?.fund_id, params?.quick_scan_detail_id, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setScreeningDetail(response.data);
    } else {
      setIsLoader(false);
    }
  };

  const handleRefreshData = (id) => {
    setScreeningDetail(null);
    getScreeningDetail();
  };

  const handleBack = () => {
    navigate(`/${params.fund_id}/kyc/quick-scan/list`);
  };
  return (
    <div className="main-content">
      <DynamicHeaderAdministration style={{ marginBottom: "0rem" }} title="O'Keefe PLC" titlesmall="ADMINISTRATION PORTAL [GLEASON-O'REILLY]" isShowOrganizationLogo={true} organizationLogo={""} isShowFundLogo={true} fundLogo={""} />
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="main-content">
              <Container fluid>
                <Row className="justify-content-center">
                  <Col xs={12}>
                    <Card>
                      <Card.Header>
                        <KycDynamicHeader title={"Quick Scan"} />
                      </Card.Header>
                      <Card.Body>
                        <div>
                          {/* <Button
                            variant="primary"
                            size="sm"
                            className="mr-2"
                            onClick={handleBack}
                          >
                            BACK
                          </Button> */}
                          <Button
                            variant="outlined"
                            size="sm"
                            className="mr-2"
                            onClick={handleBack}
                            // style={{ visibility: 'hidden', display: 'flex', alignItems: 'center' }}
                          >
                            <FaArrowLeft className="mr-1" />
                          </Button>
                        </div>
                      </Card.Body>
                      <Card.Body>
                        {isLoader ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Spinner animation="grow" />
                          </div>
                        ) : null}
                        {screeningDetail ? (
                          <div className="row">
                            <div className="col-sm-12">
                              <Card>
                                <Card.Header>
                                  <h4 className="card-header-title">Screening Detail</h4>
                                  <Nav variant="tabs" className="nav-tabs-sm">
                                    <Nav.Item>
                                      <Nav.Link active={tabIndex === 0} onClick={(e) => setTabIndex(0)} role="button">
                                        Sanction List
                                      </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                      <Nav.Link active={tabIndex === 1} onClick={(e) => setTabIndex(1)} role="button">
                                        Adverse media News
                                      </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                      <Nav.Link active={tabIndex === 2} onClick={(e) => setTabIndex(2)} role="button">
                                        Internal list
                                      </Nav.Link>
                                    </Nav.Item>
                                  </Nav>
                                </Card.Header>
                                <Card.Body>
                                  {tabIndex == 0 ? <DowJones currentPage={currentPage} handleCurrentPage={handleCurrentPage} screeningDetail={screeningDetail} refreshData={handleRefreshData} /> : null}
                                  {tabIndex == 1 ? <InternetSearch currentPage={currentPage} handleCurrentPage={handleCurrentPage} screeningDetail={screeningDetail} refreshData={handleRefreshData} /> : null}
                                  {tabIndex == 2 ? <RestrictedList currentPage={currentPage} handleCurrentPage={handleCurrentPage} screeningDetail={screeningDetail} refreshData={handleRefreshData} /> : null}
                                </Card.Body>
                              </Card>
                            </div>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
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
