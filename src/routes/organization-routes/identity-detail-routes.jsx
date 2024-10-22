import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Nav, Spinner, Modal } from "react-bootstrap";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

// Profile components
import IdentitySummary from "../../pages/administration-portal/kyc/profile/entity/summary";
import IdentityParticular from "../../pages/administration-portal/kyc/profile/entity/particular";
import IdentityOrganizationChart from "../../pages/administration-portal/kyc/profile/entity/organization-chart";
import IdentityDocument from "../../pages/administration-portal/kyc/profile/entity/documents";
import IdentityScreening from "../../pages/administration-portal/kyc/profile/entity/screening";
import IdentityRiskAssessment from "../../pages/administration-portal/kyc/profile/entity/risk-assessment";
import IdentityReport from "../../pages/administration-portal/kyc/profile/entity/report";
import CreateIdentity from "../../pages/administration-portal/kyc/create-identity";
import IdentitySubscriptions from "../../pages/administration-portal/kyc/profile/entity/subscriptions";
import IdentityCompliance from "../../pages/administration-portal/kyc/profile/entity/compliance";
import IdentityWallets from "../../pages/administration-portal/kyc/profile/entity/wallets";
import IdentityFaceVerification from "../../pages/administration-portal/kyc/profile/entity/FaceVerification";
import Vcip from "../../pages/administration-portal/kyc/profile/entity/vcip/Vcip";
import Transactions from "../../pages/administration-portal/kyc/profile/entity/Transactions";

import { getComplianceDataAPI, getParticularsDetailByIdentityIdAPI, getSingleAccountDetailByIdAPI } from "../../api/network/administrationApi/administrationAPI";
import { AdministrationIdentityHeader } from "../../widgets";
// import SpinnerWithBackDrop from "../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../components/ui/loader";
import { useDispatch } from "react-redux";
import { addAccountDetail } from "../../store/slices/accountDetailSlice";
import { addIdentityDetail } from "../../store/slices/identityDetailSlice";
import axios from "axios";
// import CustomAlert from "../../widgets/bootstrap-component/Alert";

function SystemRoutes(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cancelTokenSource = axios.CancelToken.source();

  const [complianceDataMissing, setComplianceDataMissing] = useState([]);
  const [riskAssessmentStatusTab, setRiskAssessmentStatusTab] = useState(false);
  const [isLoaderFull, setIsLoaderFull] = useState(false);
  const [complianceDataFields, setComplianceDataFields] = useState([]);
  const [riskAssessmentStatusData, setRiskAssessmentStatusData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [isInformationSaveFace, setIsInformationSaveFace] = useState(false);
  const [isInformationSaveVcip, setIsInformationSaveVcip] = useState(false);
  const [dataFromCustomerIdentity, setDataFromCustomerIdentity] = useState(null);
  const [alertState,setAlertState]=useState([]);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  // useEffect(() => {
  //   handleAlert({
  //     variant: "danger",
  //     message: `Failed to fetch account detail`,
  //     show: true,
  //     hideAuto: true,
  //   });
  // }, []); // This ensures that the alert is shown only once when the component mounts.

  const params = useParams();
  const pathSegments = params["*"].split("/");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];

  useEffect(() => {
    if (account_id) {
      getSingleAccountDetailById(account_id);
    }
  }, [account_id]);

  useEffect(() => {
    if (identity_id) {
      getSpecificIdentity(identity_id);
    }
  }, [identity_id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const refreshHeaderIdentity = queryParams.get("refresh_header_identity");

    if (refreshHeaderIdentity) {
      getSingleAccountDetailById(account_id);
    }

    navigate(location.pathname.split("?")[0]);
  }, [location.search, account_id]);

  useEffect(() => {
    getComplianceData();
  }, [identity_id]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : undefined;
  };

  useEffect(() => {
    localStorage.setItem("entity_id", getCookie("entity_id"));
    localStorage.setItem("x-auth-token", getCookie("token"));
    localStorage.setItem("login_user_id", getCookie("login_user_id"));
    axios.defaults.headers = { "x-auth-token": getCookie("token") };
  }, []);

  const getComplianceData = async () => {
    try {
      setIsLoaderFull(true);
      const response = await getComplianceDataAPI(account_id, identity_id, cancelTokenSource.token);

      if (response.success && response.data) {
        const identityDataValues = { type: params?.type };
        Object.keys(response.data).forEach((item) => {
          const value = response.data[item]?.value;
          if (value !== undefined) {
            identityDataValues[item] = value;
          }
        });
        setComplianceDataFields(identityDataValues);
      }
    } catch (error) {
      console.error("Failed to get compliance data:", error);
    } finally {
      setIsLoaderFull(false);
    }
  };

  const getSingleAccountDetailById = async (accountId) => {
    try {
      setIsLoaderFull(true);
      const response = await getSingleAccountDetailByIdAPI(accountId, cancelTokenSource.token);

      if (response.success) {
        const accountDetail = response.data.account_detail;
        setAccountData(accountDetail);
        dispatch(addAccountDetail(accountDetail));

        const attachedIdentities = accountDetail.attach_identities[0]?.meta?.identities;
        const faceVerificationRemarks = attachedIdentities?.[identity_id]?.faceVerification?.remarks;
        const vcipRemarks = attachedIdentities?.[identity_id]?.vcip?.remarks;

        if (faceVerificationRemarks?.length > 0) {
          setIsInformationSaveFace(true);
        }
        if (vcipRemarks?.length > 0) {
          setIsInformationSaveVcip(true);
        }
      }
    } catch (error) {
      console.error("Failed to get account details:", error);
    } finally {
      setIsLoaderFull(false);
    }
  };

  const getSpecificIdentity = async (identity_id) => {
    try {
      console.log("Fetching details for identity ID:", identity_id);
      const response = await getParticularsDetailByIdentityIdAPI(identity_id, cancelTokenSource.token);

      if (response.success) {
        dispatch(addIdentityDetail(response));
        const matchedRiskAssessment = response.data?.riskAccessment?.find((risk) => risk.fundId === parseInt(params?.fund_id, 10));
  
          // Set the risk status object if a match is found
          if (matchedRiskAssessment) {
            console.log(matchedRiskAssessment?.approvalStatus,'matchedRiskAssessment?.approvalStatus')
            setRiskAssessmentStatusData(matchedRiskAssessment?.approvalStatus);
          }
        console.log("Identity details fetched successfully:", response.data);
      } else {
        console.error("Failed to fetch identity details:", response.message || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred while fetching identity details:", error);
    }
  };
const handleRefreshAccountData = ()=>{
  getSingleAccountDetailById(account_id);
  getSpecificIdentity(identity_id);
}
  return (
    <>
    {/* {alertProps.show && (
      <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
{alertProps.message}
      </CustomAlert>
    )}
     */}
      {isLoaderFull ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Loader />
        </div>
      ) : (
        <>
          <AdministrationIdentityHeader
            handleDataFromCustomerIdentity={setDataFromCustomerIdentity}
            isInformationSaveFace={isInformationSaveFace}
            isInformationSaveVcip={isInformationSaveVcip}
            getSingleAccountDetailById={getSingleAccountDetailById}
            handleCompliance={setComplianceDataMissing}
            riskAssessmentStatusTab={riskAssessmentStatusTab}
            handleSetRiskAssessmentTab={setRiskAssessmentStatusTab}
            setHandleRiskStatusObject={setRiskAssessmentStatusData}
            location={location.state}
            smallTitle="ADMINISTRATION PORTAL [SCHMITT, EFFERTZ AND MARQUARDT]"
            type="Glover Group"
            pageType="KYC Documents"
            entityName="Kailey Cremin PhD"
            isShowOrganizationLogo={true}
            organizationLogo=""
            complianceDataFields={complianceDataFields}
          />
          <Routes>
            <Route path="/summary/:identity_id/:account_id" element={<IdentitySummary accountData={accountData} complianceDataMissing={complianceDataMissing} riskAssesmentstatusData={riskAssessmentStatusData} riskAssessmentStatusTab={riskAssessmentStatusTab} />} />
            <Route path="/particular/:identity_id/:account_id" element={<IdentityParticular />} />
            <Route path="/organization-chart/:identity_id/:account_id" element={<IdentityOrganizationChart />} />
            <Route path="/documents/:identity_id/:account_id" element={<IdentityDocument />} />
            <Route path="/screening/:identity_id/:account_id" element={<IdentityScreening />} />
            <Route path="/risk-assessment/:identity_id/:account_id" element={<IdentityRiskAssessment handleRefreshAccountData={handleRefreshAccountData} handleAlert ={handleAlert}/>} />
            <Route path="/compliance/:identity_id/:account_id" element={<IdentityCompliance getComplianceData={getComplianceData} complianceDataFields={complianceDataFields} dataFromCustomerIdentity={dataFromCustomerIdentity} handleAlert ={handleAlert}/>} />
            <Route path="/report/:identity_id/:account_id" element={<IdentityReport />} />
            <Route path="/subscriptions/:identity_id/:account_id" element={<IdentitySubscriptions />} />
            <Route path="/wallets/:identity_id/:account_id" element={<IdentityWallets accountData={accountData} />} />
            <Route path="/face-verification/:identity_id/:account_id" element={<IdentityFaceVerification getSingleAccountDetailById={getSingleAccountDetailById} handleAlert ={handleAlert}  />} />
            <Route path="/vcip/:identity_id/:account_id" element={<Vcip getSingleAccountDetailById={getSingleAccountDetailById} handleAlert ={handleAlert}/>} />
            <Route path="/transactions/:identity_id/:account_id" element={<Transactions />} />
          </Routes>
        </>
      )}
      
    </>
  );
}

export default SystemRoutes;
