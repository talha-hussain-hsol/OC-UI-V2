import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import FundConfigGeneral from "../pages/administration-portal/fund-config/general";
import AccountList from "../pages/administration-portal/kyc/account-list";
import DueDiligenceList from "../pages/administration-portal/kyc/due-diligence";
import ExpiringDocumentList from "../pages/administration-portal/kyc/expiring-document";
import PeriodicReviewList from "../pages/administration-portal/kyc/periodic-review";
import QuickScanList from "../pages/administration-portal/kyc/quick-scan";
import QuickScanDetail from "../pages/administration-portal/kyc/quick-scan/components/detail";
import SelectFund from "../pages/administration-portal/select-fund";
import Dashboard from "../pages/administration-portal/dashboard";
// Profile
import CreateIdentity from "../pages/administration-portal/kyc/create-identity";

import DueDiligenceListKyw from "../pages/administration-portal/kyw/due-diligence";
import PeriodicReviewListKyw from "../pages/administration-portal/kyw/periodic-review";
import QuickScanListKyw from "../pages/administration-portal/kyw/quick-scan";
import WalletList from "../pages/administration-portal/kyw/wallet";
import CustomersList from "../pages/administration-portal/customerList";

import RestrictedList from "../pages/administration-portal/restricted";
import RestrictedListSingle from "../pages/administration-portal/restricted/restricted-single-id";
// Transaction
import WalletScreening from "../pages/administration-portal/kyw/wallet/components/screening";
import TransactionMonitoring from "../pages/administration-portal/transactions/components/monitoring";
import TransactionList from "../pages/administration-portal/transactions/components/transaction";
import TransactionSummary from "../pages/administration-portal/transactions/components/transactionSummary";
import TransactionUpload from "../pages/administration-portal/transactions/components/upload";
import ImportEntities from "../pages/administration-portal/transactions/components/importEntities";
import IdentityDetailRoutes from "./organization-routes/identity-detail-routes";

import axios from "axios";
import { useParams } from "react-router-dom";
import {
  getFundDetailAPI,
  getPermissionAPI,
} from "../api/network/administrationApi/administrationAPI";
import utilsData from "../helpers/utils";

// import SpinnerWithBackDrop from "../../src/widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../components/ui/loader";
import CustomerList from "../pages/administration-portal/customerList/index";

import {
  addEntityPermissions,
  addPermissions,
} from "./../store/slices/permissionSlice";
import { addFundConfig } from "./../store/slices/FundConfigSlice";
// import MyApp from './../pages/_app';
import { useSelector, useDispatch } from "react-redux";
// import CustomAlert from "../widgets/bootstrap-component/Alert";
function SystemRoutes(props) {
  const params = useParams();
  const [isLoader, setIsLoader] = useState(false);
  const [fundDetails, setFundDetails] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  useEffect(() => {
    console.log("Sdasdsad0,alertProps", alertProps);
  }, [alertProps]);

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };
  const dispatch = useDispatch();
  let fund_id = parseInt(location.pathname.split("/")[1]);
  useEffect(() => {
    if (!isNaN(fund_id)) {
      getFundConfiguration(fund_id);
      getPermission(fund_id);
    }
  }, [fund_id]);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("entity_permissions")).length > 0) {
      dispatch(
        addEntityPermissions(
          JSON.parse(localStorage.getItem("entity_permissions"))
        )
      );
    }
    console.log(
      "localStorage.getIteme",
      JSON.parse(localStorage.getItem("entity_permissions"))
    );
  }, [localStorage.getItem("entity_permissions")]);
  useEffect(() => {
    console.log("fundDetails", fundDetails);
  }, [fundDetails]);

  const getFundConfiguration = async (fund_id) => {
    setIsLoader(true);
    const response = await getFundDetailAPI(fund_id, cancelTokenSource.token);
    if (response.success == true) {
      dispatch(addFundConfig(response?.data));
      setFundDetails(response?.data);

      localStorage.setItem(
        "fundConfigurationData",
        JSON.stringify(response?.data)
      );
      localStorage.setItem("fundRegion", response?.data?.fund_setting?.region);

      localStorage.setItem("name_id", response?.data?.named_id);
      setIsLoader(false);
    }
  };
  const getPermission = async (fund_id) => {
    setIsLoader(true);
    let dataToSend = {
      sessionTerminated: false,
    };
    const response = await getPermissionAPI(
      fund_id,
      dataToSend,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      const apiPermissions = response?.data?.permissions; // Assume this is an array

      // Retrieve and parse the array from local storag
      const localStoragePermissions =
        JSON.parse(localStorage.getItem("entity_permissions")) || [];

      // Extract the 'name' property from objects in the local storage array
      const localStoragePermissionNames = localStoragePermissions.map(
        (item) => item
      );

      // Combine the API and local storage arrays
      const resultantArray = [
        ...apiPermissions,
        ...localStoragePermissionNames,
      ];

      console.log(resultantArray);

      function removeDuplicates(arr) {
        const uniqueValues = [];
        const seenValues = new Set();

        for (const value of arr) {
          if (!seenValues.has(value)) {
            uniqueValues.push(value);
            seenValues.add(value);
          }
        }

        return uniqueValues;
      }

      const uniquePermissions = removeDuplicates(resultantArray);
      console.log("uniquePermissions", uniquePermissions);

      console.log(uniquePermissions);
      dispatch(addPermissions(uniquePermissions));
      // dispatch(addEntityPermissions(localStorage.getItem('entity_permissions')))
      localStorage.setItem(
        "permissionData",
        JSON.stringify(response?.data?.permissions)
      );
    }
  };
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log(parts, "parts");
    console.log(parts.length, "parts.length");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  localStorage.setItem("entity_id", getCookie("entity_id"));
  localStorage.setItem("entity_permissions", getCookie("entity_permissions"));
  localStorage.setItem("x-auth-token", getCookie("token"));
  localStorage.setItem("base_url", props.baseURL);
  localStorage.setItem("login_user_id", getCookie("login_user_id"));
  utilsData.setPortalType(props.baseURL);
  axios.defaults.headers = { "x-auth-token": getCookie("token") };

  return (
    <>
      {/* {location.pathname != '/' &&
                <AdministrationKYWHeader smallTitle={"ADMINISTRATION PORTAL [SCHMITT, EFFERTZ AND MARQUARDT]"} type="Glover Group" pageType={"Summary"} entityName="Kailey Cremin PhD" isShowOrganizationLogo={true} organizationLogo="" />
            } */}
      {/* {alertProps.show && (
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
      )} */}
      {isLoader && fundDetails === null ? (
        // <SpinnerWithBackDrop animation="grow" custom={true} height="80vh" />
        <Loader />
      ) : (
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/:fund_id/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SelectFund />} />
          <Route path="/domains" element={<SelectFund />} />
          <Route
            path="/:fund_id/fund-configuration"
            element={<FundConfigGeneral />}
          />
          {/* KYC */}
          <Route path="/:fund_id/kyc/account/list" element={<AccountList />} />
          <Route
            path="/:fund_id/kyc/expiring-document/list"
            element={<ExpiringDocumentList />}
          />
          <Route
            path="/:fund_id/kyc/periodic-review/list"
            element={<PeriodicReviewList />}
          />
          <Route
            path="/:fund_id/kyc/due-diligence/list"
            element={<DueDiligenceList />}
          />
          <Route
            path="/:fund_id/kyc/quick-scan/list"
            element={<QuickScanList />}
          />
          <Route
            path="/:fund_id/kyc/quick-scan-detail/:quick_scan_detail_id"
            element={<QuickScanDetail />}
          />

          {/* Identity detail */}
          <Route
            path="/:fund_id/kyc/account/identity/:type/*"
            element={<IdentityDetailRoutes />}
          />
          <Route
            path="/:fund_id/kyc/create/identity"
            element={<CreateIdentity />}
          />
          {/* <Route path="/:fund_id/kyc/account/identity/:type/summary/:identity_id/:account_id" element={<IdentitySummary />} />
                <Route path="/:fund_id/kyc/account/identity/:type/particular/:identity_id/:account_id" element={<IdentityParticular />} />
                <Route path="/:fund_id/kyc/account/identity/:type/organization-chart/:identity_id/:account_id" element={<IdentityOrganizationChart />} />
                <Route path="/:fund_id/kyc/account/identity/:type/documents/:identity_id/:account_id" element={<IdentityDocument />} />
                <Route path="/:fund_id/kyc/account/identity/:type/screening/:identity_id/:account_id" element={<IdentityScreening />} />
                <Route path="/:fund_id/kyc/account/identity/:type/risk-assessment/:identity_id/:account_id" element={<IdentityRiskAssessment />} />
                <Route path="/:fund_id/kyc/account/identity/:type/report/:identity_id/:account_id" element={<IdentityReport />} />
                <Route path="/:fund_id/kyc/account/identity/:type/subscriptions/:identity_id/:account_id" element={<IdentitySubscriptions />} />
                <Route path="/:fund_id/kyc/create/identity" element={<CreateIdentity />} /> */}
          {/* KYW */}
          <Route
            path="/:fund_id/kyw/wallets/list"
            element={<WalletList fundDetail={fundDetails} />}
          />
          <Route
            path="/:fund_id/kyw/periodic-review/list"
            element={<PeriodicReviewListKyw />}
          />
          <Route
            path="/:fund_id/kyw/due-diligence/list"
            element={<DueDiligenceListKyw />}
          />
          <Route
            path="/:fund_id/kyw/quick-scan/list"
            element={<QuickScanListKyw />}
          />
          <Route
            path="/:fund_id/kyw/wallets/screening/:wallet_id"
            element={<WalletScreening handleAlert={handleAlert} />}
          />

          {/* Restricted */}
          <Route
            path="/:fund_id/restricted/list"
            element={<RestrictedList />}
          />
          <Route path="/:fund_id/customer/list" element={<CustomerList />} />
          <Route
            path="/:fund_id/restricted/list/:listId"
            element={<RestrictedListSingle />}
          />
          {/* Transactions */}
          <Route
            path="/:fund_id/transactions/list"
            element={<TransactionList fundDetail={fundDetails} />}
          />
          <Route
            path="/:fund_id/transactions/summary"
            element={<TransactionSummary fundDetail={fundDetails} />}
          />
          <Route
            path="/:fund_id/transactions/monitoring"
            element={
              <TransactionMonitoring
                fundDetail={fundDetails}
                handleAlert={handleAlert}
              />
            }
          />
          <Route
            path="/:fund_id/transactions/upload"
            element={<TransactionUpload fundDetail={fundDetails} />}
          />
          <Route
            path="/:fund_id/entities/upload"
            element={<ImportEntities />}
          />
          <Route path="/customers/list" element={<CustomersList />} />

          {/* <Route path="/profile/identities" element={<Identities />} />
                <Route path="/profile/identity/:type/summary" element={<IdentitySummary />} />
                <Route path="/profile/identity/:type/particular" element={<IdentityParticular />} />
                <Route path="/profile/identity/:type/organization-chart" element={<IdentityOrganizationChart />} />
                <Route path="/profile/identity/:type/documents" element={<IdentityDocument />} />
                <Route path="/subscription-list" element={<SubscriptionList />} />
                <Route path="/subscription/request" element={<SubscriptionRequest />} />
                <Route path="/subscription/detail/overview" element={<SubscriptionDetailOverView />} />
                <Route path="/subscription/detail/capitalization" element={<SubscriptionDetailCapitalization />} />
                <Route path="/subscription/detail/my-nav" element={<SubscriptionDetailMyNav />} />
                <Route path="/subscription/detail/investments" element={<SubscriptionDetailInvestment />} />
                <Route path="/subscription/detail/sign-agreement" element={<SubscriptionDetailSignAgreement />} /> */}
        </Routes>
      )}
    </>
  );
}

export default SystemRoutes;
