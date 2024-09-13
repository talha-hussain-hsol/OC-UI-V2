import PropTypes from "prop-types";
import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Loader from "./components/ui/loader";
import Callback from "./pages/callback";
import useEntityStore from "./store/useEntityStore";
import {} from "./utils/helperFunctions";

import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/sign-in";
import SplashScreen from "./pages/splash";

import Accounts from "./OurComponents/Screens/Accounts";
import Dashboard from "./OurComponents/Screens/Dashboard";
import Identities from "./OurComponents/Screens/Identities";
import MainDocuments from "./OurComponents/Screens/MainDocuments";
import Stepper from "./OurComponents/Screens/Stepper";
import UserForm from "./OurComponents/Screens/UserForm";
import FundCode from "./OurComponents/Screens/FundCode"
import "./App.css";
import { ThemeProvider } from "./contexts/themeContext";
import UserType from "./OurComponents/Screens/UserType";
import Card from "./sample-theming/Card";
import ThemeSwitcher from "./components/themeSwitcher";
import UserInfo from "./components/testingTheming";
import FundAccounts from "./OurComponents/ComplianceScreens/FundAccounts";
import ComplianceDashboard from "./OurComponents/ComplianceScreens/ComplianceDashboard";
import KYW from "./OurComponents/ComplianceScreens/KYW";
import DomainAccounts from "./OurComponents/ComplianceScreens/DomainAccounts";
import TransactionMonitoring from "./OurComponents/ComplianceScreens/TransactionMonitoring";

import MainScreenCompliance from "./OurComponents/ComplianceScreens/MainScreenCompliance";
import CustomerList from "./OurComponents/ComplianceScreens/CustomerList";

function App() {
  
  return (

    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ThemeProvider> <Dashboard /> </ThemeProvider> } />
      <Route path="/user-form" element={<ThemeProvider> <UserForm /> </ThemeProvider> } />
      <Route path="/accounts" element={<ThemeProvider> <Accounts /> </ThemeProvider> } />
      <Route path="/identities" element={<ThemeProvider> <Identities /> </ThemeProvider> } />
      <Route path="/documents" element={<ThemeProvider> <MainDocuments /> </ThemeProvider> } />
      <Route path="/fund-code"  element={<ThemeProvider> <FundCode /> </ThemeProvider> } />
      <Route path="/stepper"  element={<ThemeProvider> <Stepper /> </ThemeProvider> } />
      <Route path="/fundsAccounts"  element={<ThemeProvider> <FundAccounts /> </ThemeProvider> } />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/compliance-dashboard" element={<ThemeProvider> <ComplianceDashboard /> </ThemeProvider> } />
      <Route path="/kyw" element={<ThemeProvider> <KYW /> </ThemeProvider> } />
      <Route path="/domain-accounts" element={<ThemeProvider> <DomainAccounts /> </ThemeProvider>} />
      <Route path="/compliance" element={<ThemeProvider> <MainScreenCompliance /> </ThemeProvider> } />
      <Route path="/transaction-monitoring" element={<ThemeProvider> <TransactionMonitoring /> </ThemeProvider>} />
      <Route path="/customers-list" element={<ThemeProvider> <CustomerList /> </ThemeProvider>} />

    </Routes>
  </BrowserRouter>
       

    // <div className="flex h-screen">

    //   <BrowserRouter>
    //     <AppWrapper isHome={false} />

    //   </BrowserRouter>
    //   <ToastContainer position="bottom-right" />
    // </div>

    // <ThemeProvider>
    //   <div className="flex w-full h-screen place-items-center place-content-center">
    //     <div className="flex  flex-col gap-4 max-w-lg">
    //       <ThemeSwitcher />
    //       <UserInfo />
    //       <Card />
    //     </div>
    //   </div>
    // </ThemeProvider>
  );
}
const AppWrapper = () => {
  const [loading, setLoading] = useState(false);
  const setEntityId = useEntityStore((state) => state.setEntityId);

  // useEffect(() => {
  //   localStorage.setItem("entity_id", getCookie("entity_id"));
  //   setEntityId(getCookie("entity_id"));
  //   localStorage.setItem("entity_permissions", getCookie("entity_permissions"));
  //   localStorage.setItem("x-auth-token", getCookie("token"));
  //   localStorage.setItem("login_user_id", getCookie("login_user_id"));
  //   axios.defaults.headers = { "x-auth-token": getCookie("token") };
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

  //   const entitiesCount = getCookie("entities_length");

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
      className={`w-full overflow-hidden bg-custom-gradient text-white`}
    >
      <Routes>
        {/* <Route path={"/"} element={<SignIn />} /> */}
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/splash" element={<SplashScreen />} />
        
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
