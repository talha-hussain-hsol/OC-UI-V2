import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams
} from "react-router-dom";
import useEntityStore from "./store/useEntityStore";
// import {} from "./utils/helperFunctions";
import Callback from "./pages/callback";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react"; // will use the useEffect in future
import PropTypes from "prop-types";
import axios from "axios"; //will use this in future
import Loader from "./components/ui/loader";
import { getLocalStorage } from "./utils/cookies"; //will use this in future
import SelectFund from "./pages/administration-portal/select-fund";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/sign-in";
import SplashScreen from "./pages/splash";
import Compliance from "./pages/compliancePortal";
import Customer from "./pages/customerPortal";
import ComplianceDashboard from "./pages/compliancePortal/complianceScreens/ComplianceDashboard";
import AccountList from "./pages/administration-portal/kyc/account-list";
// import DomainAccounts from "./pages/compliancePortal/complianceScreens/DomainAccounts";

import { ThemeProvider } from "./contexts/themeContext";

import Dashboard from "./pages/customerPortal/screen/dashboard/index";
// import UserForm from "./pages/wizard/account-wizard/UserForm"
import Accounts from "./pages/customerPortal/screen/accounts/index";
import Identities from "./pages/customerPortal/screen/identities/index";
import MainDocuments from "./pages/customerPortal/screen/maindocuments/index";
import Wiard from "./pages/wizard";
// import Stepper from "./pages/wizard/Stepper"
// import FundCode from "./pages/wizard/account-wizard/FundCode";
import KYW from "./pages/compliancePortal/complianceScreens/KYW";
import DomainAccounts from "./pages/compliancePortal/complianceScreens/DomainAccounts";
import MainScreenCompliance from "./pages/compliancePortal/complianceScreens/MainScreenCompliance";
import TransactionMonitoring from "./pages/compliancePortal/complianceScreens/TransactionMonitoring";
import CustomerList from "./pages/compliancePortal/complianceScreens/CustomerList";
import SummaryDetails from "./pages/compliancePortal/complianceScreens/SummaryDetails";
import RestrictedLists from "./pages/administration-portal/restricted";
import DueDilligence from "./pages/administration-portal/kyc/due-diligence";
import ExpiringDocuments from "./pages/administration-portal/kyc/expiring-document";
import PeriodicReview from "./pages/administration-portal/kyc/periodic-review";
import QuickScan from "./pages/administration-portal/kyc/quick-scan";
import QuickScanDetail from "./pages/administration-portal/kyc/quick-scan/components/detail";
import WalletList from "./pages/administration-portal/kyw/wallet";
import PeriodicReviewListKyw from "./pages/administration-portal/kyw/periodic-review";
import DueDiligenceListKyw from "./pages/administration-portal/kyw/due-diligence";
import QuickScanListKyw from "./pages/administration-portal/kyw/quick-scan";
import WalletScreening from "./pages/administration-portal/kyw/wallet/components/screening";

import { useDispatch } from "react-redux";
import utilsData from "./helpers/utils";


function App() {

  return (
    
      <div className="flex ">
      <BrowserRouter>
        {/* Conditionally render based on the URL */}
        {window.location.href.includes("compliance") ? (
          <ComplianceRoutesWrapper />
        ) : window.location.href.includes("customer") ? (
          <ThemeProvider>
            <CustomerRoutesWrapper />
          </ThemeProvider>
        ) : (
          <AppWrapper isHome={false} />
        )}
      </BrowserRouter>

      <ToastContainer position="bottom-right" />
    </div>
  

  );
}
const AppWrapper = () => {
  const [loading, setLoading] = useState(false);
  const setEntityId = useEntityStore((state) => state.setEntityId);

  // useEffect(() => {
  //   localStorage.setItem("entity_id", getLocalStorage("entity_id"));
  //   setEntityId(getLocalStorage("entity_id"));
  //   localStorage.setItem("entity_permissions", getLocalStorage("entity_permissions"));
  //   localStorage.setItem("x-auth-token", getLocalStorage("token"));
  //   localStorage.setItem("login_user_id", getLocalStorage("login_user_id"));
  //   axios.defaults.headers = { "x-auth-token": getLocalStorage("token") };
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // }, [setEntityId]);

  // const matchSubdomain = useCallback((type) => {
  //   const subdomain = window.location.host.split(".")[0];
  //   return subdomain === portalTypes?.[type] || subdomain.search(type) > -1;
  // }, []);

  // const renderNavigation = () => {
  //   if (authPages.includes(history.pathname) || !isSubDomain()) return null;

  //   const entitiesCount = getLocalStorage("entities_length");

  //   if (matchSubdomain("customer")) {
  //     return <CustomerNav entitiesCount={entitiesCount} />;
  //   }

  //   if (matchSubdomain("administration")) {
  //     return <Sidenav entitiesCount={entitiesCount} portal="compliance" />;
  //   }

  //   if (matchSubdomain("management") || matchSubdomain("manager")) {
  //     return <Sidenav entitiesCount={entitiesCount} portal="management" />;
  //   }

  //   return null;
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full">
        <Loader theme={theme} />
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden bg-custom-gradient text-white `}>
      <Routes>
        <Route path={"/"} element={<SignIn />} />
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/compliance" element={<ThemeProvider><Compliance /></ThemeProvider>} />
        <Route
          path="/customer"
          element={
            <ThemeProvider>
              <Customer />
            </ThemeProvider>
          }
        />
      </Routes>
    </div>
  );
};

const ComplianceRoutesWrapper = (props) => {
  const params = useParams();

  const [isFundConfigLoaded, setIsFundConfigLoaded] = useState(false);
  const [isPermissionLoaded, setIsPermissionLoaded] = useState(false);
  const [fundDetails, setFundDetails] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
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
  const dispatch = useDispatch();
  let fund_id = parseInt(location.pathname.split("/")[1]);
  useEffect(() => {
    if (!isNaN(fund_id)) {
      getFundConfiguration(fund_id);
      getPermission(fund_id);
    }
  }, [fund_id]);

  // Monitor both API states to control the loader

  const getFundConfiguration = async (fund_id) => {
    setIsFundConfigLoaded(true); // Mark FundConfig API as loaded

    const response = await getFundDetailAPI(fund_id, cancelTokenSource.token);
    if (response.success) {
      setIsFundConfigLoaded(false); // Mark FundConfig API as loaded

      dispatch(addFundConfig(response?.data));
      setFundDetails(response?.data);

      localStorage.setItem("fundConfigurationData", JSON.stringify(response?.data));
      localStorage.setItem("fundRegion", response?.data?.fund_setting?.region);
      localStorage.setItem("name_id", response?.data?.named_id);
    } else {
      setIsFundConfigLoaded(false); // Mark FundConfig API as loaded
    }
  };

  const getPermission = async (fund_id) => {
    setIsPermissionLoaded(true); // Mark Permission API as loaded

    let dataToSend = {
      sessionTerminated: false,
    };
    const response = await getPermissionAPI(fund_id, dataToSend, cancelTokenSource.token);
    if (response.success) {
      setIsPermissionLoaded(false); // Mark Permission API as loaded

      const apiPermissions = response?.data?.permissions;
      const localStoragePermissions = JSON.parse(localStorage.getItem("entity_permissions")) || [];
      const localStoragePermissionNames = localStoragePermissions.map((item) => item);
      const resultantArray = [...apiPermissions, ...localStoragePermissionNames];

      const uniquePermissions = Array.from(new Set(resultantArray));
      dispatch(addPermissions(uniquePermissions));
      localStorage.setItem("permissionData", JSON.stringify(response?.data?.permissions));
    } else {
      setIsPermissionLoaded(false); // Mark Permission API as loaded
    }
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("entity_permissions")).length > 0) {
      dispatch(addEntityPermissions(JSON.parse(localStorage.getItem("entity_permissions"))));
    }
    console.log("localStorage.getIteme", JSON.parse(localStorage.getItem("entity_permissions")));
  }, [localStorage.getItem("entity_permissions")]);
  useEffect(() => {
    console.log("isPermissionLoadedisPermissionLoaded", isPermissionLoaded);
    console.log("isPermissionLoadedisPermissionLoaded isFundConfigLoaded", isFundConfigLoaded);
  }, [isFundConfigLoaded, isPermissionLoaded]);

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
    <div className={`w-full overflow-hidden bg-custom-gradient text-white `}>
      <Routes>
      <Route path="/" element={<ThemeProvider> <ComplianceDashboard /> </ThemeProvider> } />
      <Route path="/kyw" element={<ThemeProvider> <KYW /> </ThemeProvider> } />
      <Route path="/domain-accounts" element={<ThemeProvider> <DomainAccounts /> </ThemeProvider>} />
      <Route path="/domains" element={<ThemeProvider> < SelectFund/> </ThemeProvider>} />
      <Route path="/1/kyc/account/list" element={<ThemeProvider> < AccountList/> </ThemeProvider>} />
      <Route path="/1/kyc/expiring-document/list" element={<ExpiringDocuments />} />
      <Route path="/1/kyc/due-diligence/list" element={<DueDilligence />} />
      <Route path="/1/kyc/periodic-review/list" element={<PeriodicReview />} />
      <Route path="/1/kyc/quick-scan/list" element={<QuickScan />} />
      <Route path="/1/kyc/quick-scan-detail/:quick_scan_detail_id" element={<QuickScanDetail />} />
      <Route path="/1/restricted/list" element={<RestrictedLists />} />
      <Route path="/compliance" element={<ThemeProvider> <MainScreenCompliance /> </ThemeProvider> } />
      <Route path="/transaction-monitoring" element={<ThemeProvider> <TransactionMonitoring /> </ThemeProvider>} />
      <Route path="/customers-list" element={<ThemeProvider> <CustomerList /> </ThemeProvider>} />
      <Route path="/summary-details" element={<ThemeProvider> <SummaryDetails /> </ThemeProvider>} />

         {/* KYW */}
         <Route path="/:fund_id/kyw/wallets/list" element={<WalletList fundDetail={fundDetails} />} />
          <Route path="/:fund_id/kyw/periodic-review/list" element={<PeriodicReviewListKyw />} />
          <Route path="/:fund_id/kyw/due-diligence/list" element={<DueDiligenceListKyw />} />
          <Route path="/:fund_id/kyw/quick-scan/list" element={<QuickScanListKyw />} />
          <Route path="/:fund_id/kyw/wallets/screening/:wallet_id" element={<WalletScreening handleAlert={handleAlert} />} />
      </Routes>
    </div>
  );
};

const CustomerRoutesWrapper = () => {
  return (
    <div className={`w-full overflow-hidden bg-custom-gradient text-white `}>
      <Routes>
        <Route
          path="/"
          element={
            <ThemeProvider>
              <Dashboard />
            </ThemeProvider>
          }
        />
        <Route
          path="/accounts"
          element={
            <ThemeProvider>
              <Accounts />
            </ThemeProvider>
          }
        />
        <Route
          path="/identities"
          element={
            <ThemeProvider>
              <Identities />
            </ThemeProvider>
          }
        />
        <Route
          path="/documents"
          element={
            <ThemeProvider>
              <MainDocuments />
            </ThemeProvider>
          }
        />
        <Route
          path="/subscription/request"
          element={
            <ThemeProvider>
              <Wiard />
            </ThemeProvider>
          }
        />
        <Route
          path="/subscription-list"
          element={
            <ThemeProvider>
              <Accounts />
            </ThemeProvider>
          }
        />
        <Route
          path="/profile/detail/:identity_id/:account_id"
          element={
            <ThemeProvider>
              <Wiard />
            </ThemeProvider>
          }
        />
        <Route
          path="/subscription/request/:identity_id"
          element={
            <ThemeProvider>
              <Wiard />
            </ThemeProvider>
          }
        />
      </Routes>
    </div>
  );
};

AppWrapper.propTypes = {
  isHome: PropTypes.any,
};

/**
 * Component used to protect the route if user try to access the URL that he/she does not have permission
 * @Param isAllowed -> If user have permission
 * @Param redirectPath -> Redirect URL
 * @Param children -> it is the remaining routes
 */

const ProtectedRoute = ({ isAllowed, redirectPath = "/", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  isAllowed: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string,
  children: PropTypes.node,
};

export default App;
