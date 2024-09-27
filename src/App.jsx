import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import useEntityStore from "./store/useEntityStore";
import {  } from "./utils/helperFunctions";
import Callback from "./pages/callback";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";        // will use the useEffect in future
import PropTypes from "prop-types";
import axios from "axios";                          //will use this in future
import Loader from "./components/ui/loader";
import { getLocalStorage } from "./utils/cookies";  //will use this in future

import 'react-toastify/dist/ReactToastify.css';
import SignIn from "./pages/sign-in";
import SplashScreen from "./pages/splash";
import Compliance from "./pages/compliancePortal";
import Customer from "./pages/customerPortal";
import ComplianceDashboard from "./pages/compliancePortal/dashboard";
import { ThemeProvider } from "./contexts/themeContext";

import Dashboard from "./pages/customerPortal/screen/dashboard/index"
import UserForm from "./pages/wizard/account-wizard/UserForm"
import Accounts from "./pages/customerPortal/screen/accounts/index"
import Identities from "./pages/customerPortal/screen/identities/index"
import MainDocuments from "./pages/customerPortal/screen/maindocuments/index"
import Stepper from "./pages/wizard/Stepper"
import FundCode from "./pages/wizard/account-wizard/FundCode";




function App() {
  return (
 
    <div className="flex ">
  <BrowserRouter>
    {/* Conditionally render based on the URL */}
    {window.location.href.includes('compliance') ? (
      <ComplianceRoutesWrapper />
    ) : window.location.href.includes('customer') ? (
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
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden bg-custom-gradient text-white `}
    >
      <Routes>
        <Route path={"/"} element={<SignIn />} />
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/customer" element={<ThemeProvider><Customer /></ThemeProvider> } />
      </Routes>
    </div>
  );
};

const ComplianceRoutesWrapper = () => {
  return (
    <div
      className={`w-full overflow-hidden bg-custom-gradient text-white `}
    >
      <Routes>
        <Route path={"/"} element={<ComplianceDashboard />} />
      </Routes>
    </div>
  );
};


const CustomerRoutesWrapper = () => {
  return (
    <div
      className={`w-full overflow-hidden bg-custom-gradient text-white `}
    ><Routes>
    <Route path="/" element={<ThemeProvider><Dashboard/></ThemeProvider>} />
    <Route path="/user-form" element={<ThemeProvider><UserForm /></ThemeProvider>} />
    <Route path="/accounts" element={<ThemeProvider><Accounts /></ThemeProvider>} />
    <Route path="/identities" element={<ThemeProvider><Identities /></ThemeProvider>} />
    <Route path="/documents" element={<ThemeProvider><MainDocuments /></ThemeProvider>} />
    <Route path="/fund-code" element={<ThemeProvider><FundCode/></ThemeProvider>} />
    <Route path="/stepper" element={<ThemeProvider><Stepper /></ThemeProvider>} />
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
