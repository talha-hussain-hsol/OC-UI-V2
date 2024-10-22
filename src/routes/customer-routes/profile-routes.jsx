import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IdentitySummary from "../../pages/investor-portal/profile/entity/summary";
import IdentityCRPParticular from "../../pages/investor-portal/profile/entity/crp-particular";
import IdentityParticular from "../../pages/investor-portal/profile/entity/particular";
import IdentityOrganizationChart from "../../pages/investor-portal/profile/entity/organization-chart";
import IdentityDocument from "../../pages/investor-portal/profile/entity/documents";
import IdentityWallets from "../../pages/investor-portal/profile/entity/wallets";
import FaceVerification from "../../pages/investor-portal/profile/entity/FaceVerification";
import { Col, Container, Row, Nav, Spinner } from "react-bootstrap";
import SubscriptionDetailOverView from "../../pages/investor-portal/subscription/detail/overview";
import SubscriptionDetailInvestment from "../../pages/investor-portal/subscription/detail/investment";
import axios from "axios";
import { getSingleAccountDetailByIdAPI } from "../../api/network/customerApi";
import { IdentityHeader } from "../../widgets";
import { useLocation, useParams } from "react-router-dom";
import { checkSubscriptionAllow } from "../../helpers/getFundConfiguration";
import Vcip from "../../pages/investor-portal/subscription/detail/Vcip";

function ProfileRoutes(props) {
  console.log("kitno bar");
  const params = useParams();
  const history = useLocation();

  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [accountData, setAccountData] = useState(null);
  console.log("history is the kdn ", history);
  const [faceVerificationDocumentId, setFaceVerificationDocumentId] =
    useState(null);
  const [uppsalaStatus, setUppsalaStatus] = useState(false);

  const handleUpsalla = (result) => {
    setUppsalaStatus(result);
  };

  const handleFaceVerification = (id) => {
    setFaceVerificationDocumentId(id);
  };
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

  console.log("in");
  return (
    <>
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={10}>
              <IdentityHeader
                handleUpsalla={handleUpsalla}
                uppsalaStatus={uppsalaStatus}
                faceVerificationDocumentId={faceVerificationDocumentId}
                handleFaceVerification={handleFaceVerification}
                isShowInvestmentTab={checkSubscriptionAllow(accountData?.fund)}
                fundConfigurationData={accountData?.fund}
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Routes>
        <Route path="/summary" element={<IdentitySummary />} />
        <Route path="/particular" element={<IdentityParticular />} />
        <Route
          path="/organization-chart"
          element={<IdentityOrganizationChart />}
        />
        <Route path="/documents" element={<IdentityDocument />} />
        <Route path="/wallets" element={<IdentityWallets />} />
        <Route path="/face-verification" element={<FaceVerification />} />
        <Route path="/overview" element={<SubscriptionDetailOverView />} />
        {/* With Identity Id */}
        <Route path="/summary/:identity_id" element={<IdentitySummary />} />
        <Route
          path="/particular/:identity_id"
          element={<IdentityParticular />}
        />
        <Route
          path="/organization-chart/:identity_id"
          element={<IdentityOrganizationChart />}
        />
        <Route path="/documents/:identity_id" element={<IdentityDocument />} />
        <Route path="/wallets/:identity_id" element={<IdentityWallets />} />
        <Route
          path="/face-verification/:identity_id"
          element={<FaceVerification />}
        />
        <Route
          path="/overview/:identity_id"
          element={<SubscriptionDetailOverView />}
        />
        {/* With Identity Id and Account Id */}
        <Route
          path="/summary/:identity_id/:account_id"
          element={<IdentitySummary />}
        />
        <Route
          path="/particular/:identity_id/:account_id"
          element={<IdentityParticular />}
        />
        <Route
          path="/organization-chart/:identity_id/:account_id"
          element={<IdentityOrganizationChart />}
        />
        <Route
          path="/documents/:identity_id/:account_id"
          element={
            <IdentityDocument
              isShowInvestmentTab={checkSubscriptionAllow(accountData?.fund)}
              t
              faceVerificationDocumentId={faceVerificationDocumentId}
              uppsalaStatus={uppsalaStatus}
            />
          }
        />
        <Route
          path="/wallets/:identity_id/:account_id"
          element={
            <IdentityWallets
              isShowInvestmentTab={checkSubscriptionAllow(accountData?.fund)}
            />
          }
        />
        <Route
          path="/face-verification/:identity_id/:account_id"
          element={
            <FaceVerification
              isShowInvestmentTab={checkSubscriptionAllow(accountData?.fund)}
              uppsalaStatus={uppsalaStatus}
            />
          }
        />
        <Route
          path="/overview/:identity_id/:account_id"
          element={<SubscriptionDetailOverView />}
        />
        {accountData && (
          <Route
            path="/investments/:identity_id/:account_id"
            element={
              <SubscriptionDetailInvestment
                accountData={accountData}
                fundConfigurationData={accountData?.fund}
                refreshAccountDetail={handleCallBackRefreshAccountDetail}
              />
            }
          />
        )}{" "}
        {accountData && (
          <Route
            path="/vcip/:identity_id/:account_id"
            element={
              <Vcip
                accountData={accountData}
                fundConfigurationData={accountData?.fund}
                refreshAccountDetail={handleCallBackRefreshAccountDetail}
              />
            }
          />
        )}{" "}
        {/*with over view */}
        {/* <Route path="/detail/overview/:accountId" element={<SubscriptionDetailOverView />} /> */}
      </Routes>
    </>
  );
}

export default ProfileRoutes;
