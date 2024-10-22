import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubscriptionDetailOverView from "../../pages/investor-portal/subscription/detail/overview";
import SubscriptionDetailCapitalization from "../../pages/investor-portal/subscription/detail/capitalization";
import SubscriptionDetailMyNav from "../../pages/investor-portal/subscription/detail/my-nav";
import SubscriptionDetailInvestment from "../../pages/investor-portal/subscription/detail/investment";
import SubscriptionDetailSignAgreement from "../../pages/investor-portal/subscription/detail/sign-agreement/index";
import SubscriptionDashboard from "../../pages/investor-portal/subscription/detail/dashboard";
import { Col, Container, Row, Nav, Spinner } from "react-bootstrap";
import { SubscriptionDetailHeader } from "../../widgets";
import axios from "axios";
import { getSingleAccountDetailByIdAPI } from "../../api/network/customerApi";
// import SpinnerWithBackDrop from "../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../components/ui/loader";
import { checkSubscriptionAllow } from "../../helpers/getFundConfiguration";

function ProfileRoutes(props) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [accountData, setAccountData] = useState(null);
  console.log("history", history);
  const history = useLocation();

  useEffect(() => {
    let path = params["*"];
    const pathSegments = path.split("/")[path.split("/").length - 1];
    if (pathSegments) {
      getSingleAccountDetailById(pathSegments);
    }
  }, []);

  const getSingleAccountDetailById = async (accountId) => {
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      accountId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      console.log(
        "response?.data?.account_detail?.accountData?.fund?.meta",
        response?.data
      );
      setAccountData(response?.data?.account_detail);
    } else {
    }
  };
  const handleCallBackRefreshAccountDetail = async () => {
    let path = params["*"];
    const pathSegments = path.split("/")[path.split("/").length - 1];
    let accountId = "";
    if (pathSegments) {
      accountId = pathSegments;
    }
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      accountId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      console.log(
        "response?.data?.account_detail?.accountData?.fund?.meta",
        response?.data
      );
      setAccountData(response?.data?.account_detail);
    } else {
    }
  };
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          <div className="main-content">
            {isLoader ? (
              <Loader />
            ) : (
              // <></>
              <Container fluid>
                <Row className="justify-content-center">
                  <Col xs={12} lg={12} xl={12}>
                    <SubscriptionDetailHeader
                      forTabsCheck={history?.state}
                      isShowInvestmentTab={checkSubscriptionAllow(
                        accountData?.fund
                      )}
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </div>

          <Routes>
            <Route
              path="/detail/overview/:accountId"
              element={<SubscriptionDetailOverView />}
            />
            <Route
              path="/detail/capitalization/:accountId"
              element={<SubscriptionDetailCapitalization />}
            />
            <Route
              path="/detail/my-nav/:accountId"
              element={<SubscriptionDetailMyNav />}
            />
            <Route
              path="/detail/investments/:accountId"
              element={
                <SubscriptionDetailInvestment
                  accountData={accountData}
                  fundConfigurationData={accountData?.fund}
                  refreshAccountDetail={handleCallBackRefreshAccountDetail}
                />
              }
            />
            <Route
              path="/detail/sign-agreement/:accountId"
              element={<SubscriptionDetailSignAgreement />}
            />
            <Route
              path="/dashboard/:account-id"
              element={<SubscriptionDashboard />}
            />
          </Routes>
        </>
      )}
    </>
  );
}

export default ProfileRoutes;
