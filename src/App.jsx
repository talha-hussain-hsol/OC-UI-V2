// import {
//   BrowserRouter,
//   Navigate,
//   Outlet,
//   Route,
//   Routes,
// } from "react-router-dom";
// import useEntityStore from "./store/useEntityStore";
// import {  } from "./utils/helperFunctions";
// import Callback from "./pages/callback";
// import { ToastContainer } from "react-toastify";
// import { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import Loader from "./components/ui/loader";
// import { getLocalStorage } from "./utils/cookies";

// import 'react-toastify/dist/ReactToastify.css';
// import SignIn from "./pages/sign-in";
// import SplashScreen from "./pages/splash";
// import Compliance from "./pages/compliancePortal";
// import Customer from "./pages/customerPortal";
// import ComplianceDashboard from "./pages/compliancePortal/dashboard";
// import { ThemeProvider } from "./contexts/themeContext";
// import Dashboard from "./pages/customerPortal/Screens/Dashboard"
// import UserForm from "./pages/customerPortal/Screens/UserForm"
// import Accounts from "./pages/customerPortal/Screens/Accounts"
// import Identities from "./pages/customerPortal/Screens/Identities"
// import MainDocuments from "./pages/customerPortal/Screens/MainDocuments"
// import FundCode from "./pages/customerPortal/Screens/FundCode"
// import Stepper from "./pages/customerPortal/Screens/Stepper"

// function App() {
//   return (
//     // <div className="flex h-screen">
//     //   <BrowserRouter>
//     //     {window.location.href.includes('compliance') ? <ComplianceRoutesWrapper /> :<AppWrapper isHome={false} />}
//     //   </BrowserRouter>
//     //   <BrowserRouter>
//     //     {window.location.href.includes('customer') ? <CustomerRoutesWrapper /> :<AppWrapper isHome={false} />}
//     //   </BrowserRouter>
//     //   <ToastContainer position="bottom-right" />
//     // </div>
//     <div className="flex ">
//   <BrowserRouter>
//     {/* Conditionally render based on the URL */}
//     {window.location.href.includes('compliance') ? (
//       <ComplianceRoutesWrapper />
//     ) : window.location.href.includes('customer') ? (
//       <ThemeProvider>
//         <CustomerRoutesWrapper />
//         </ThemeProvider>
//     ) : (
//       <AppWrapper isHome={false} />
//     )}
//   </BrowserRouter>

//   <ToastContainer position="bottom-right" />
// </div>

//   );
// }
// const AppWrapper = () => {
//   const [loading, setLoading] = useState(false);
//   const setEntityId = useEntityStore((state) => state.setEntityId);

//   // useEffect(() => {
//   //   localStorage.setItem("entity_id", getLocalStorage("entity_id"));
//   //   setEntityId(getLocalStorage("entity_id"));
//   //   localStorage.setItem("entity_permissions", getLocalStorage("entity_permissions"));
//   //   localStorage.setItem("x-auth-token", getLocalStorage("token"));
//   //   localStorage.setItem("login_user_id", getLocalStorage("login_user_id"));
//   //   axios.defaults.headers = { "x-auth-token": getLocalStorage("token") };
//   //   setTimeout(() => {
//   //     setLoading(false);
//   //   }, 3000);
//   // }, [setEntityId]);

//   // const matchSubdomain = useCallback((type) => {
//   //   const subdomain = window.location.host.split(".")[0];
//   //   return subdomain === portalTypes?.[type] || subdomain.search(type) > -1;
//   // }, []);

//   // const renderNavigation = () => {
//   //   if (authPages.includes(history.pathname) || !isSubDomain()) return null;

//   //   const entitiesCount = getLocalStorage("entities_length");

//   //   if (matchSubdomain("customer")) {
//   //     return <CustomerNav entitiesCount={entitiesCount} />;
//   //   }

//   //   if (matchSubdomain("administration")) {
//   //     return <Sidenav entitiesCount={entitiesCount} portal="compliance" />;
//   //   }

//   //   if (matchSubdomain("management") || matchSubdomain("manager")) {
//   //     return <Sidenav entitiesCount={entitiesCount} portal="management" />;
//   //   }

//   //   return null;
//   // };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center w-full">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`w-full overflow-hidden bg-custom-gradient text-white `}
//     >
//       <Routes>
//         <Route path={"/"} element={<SignIn />} />
//         <Route path={"/sign-in"} element={<SignIn />} />
//         <Route path="/callback" element={<Callback />} />
//         <Route path="/splash" element={<SplashScreen />} />
//         <Route path="/compliance" element={<Compliance />} />
//         <Route path="/customer" element={<ThemeProvider><Customer /></ThemeProvider> } />
//       </Routes>
//     </div>
//   );
// };

// const ComplianceRoutesWrapper = () => {
//   return (
//     <div
//       className={`w-full overflow-hidden bg-custom-gradient text-white `}
//     >
//       <Routes>
//         <Route path={"/"} element={<ComplianceDashboard />} />
//       </Routes>
//     </div>
//   );
// };

// const CustomerRoutesWrapper = () => {
//   return (
//     <div
//       className={`w-full overflow-hidden bg-custom-gradient text-white `}
//     ><Routes>
//     <Route path="/" element={<ThemeProvider><Dashboard /></ThemeProvider>} />
//     <Route path="/user-form" element={<ThemeProvider><UserForm /></ThemeProvider>} />
//     <Route path="/accounts" element={<ThemeProvider><Accounts /></ThemeProvider>} />
//     <Route path="/identities" element={<ThemeProvider><Identities /></ThemeProvider>} />
//     <Route path="/documents" element={<ThemeProvider><MainDocuments /></ThemeProvider>} />
//     <Route path="/fund-code" element={<ThemeProvider><FundCode /></ThemeProvider>} />
//     <Route path="/stepper" element={<ThemeProvider><Stepper /></ThemeProvider>} />
//   </Routes>
//     </div>
//   );
// };

// AppWrapper.propTypes = {
//   isHome: PropTypes.any,
// };

// /**
//  * Component used to protect the route if user try to access the URL that he/she does not have permission
//  * @Param isAllowed -> If user have permission
//  * @Param redirectPath -> Redirect URL
//  * @Param children -> it is the remaining routes
//  */

// const ProtectedRoute = ({ isAllowed, redirectPath = "/", children }) => {
//   if (!isAllowed) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   return children ? children : <Outlet />;
// };

// ProtectedRoute.propTypes = {
//   isAllowed: PropTypes.bool.isRequired,
//   redirectPath: PropTypes.string,
//   children: PropTypes.node,
// };

// export default App;

import "./App.css";
// import './styles/theme.scss';
import React, { useState, useEffect } from "react";
import {
  // BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Info from "./pages/investor-portal/profile/info";

import CallBack from "../src/components/callback/CallBack";
import { Sidenav, CustomerNav } from "./components";
import { useLocation, useParams } from "react-router-dom";
import CustomerRoutes from "./routes/customer-routes";
// import ManagerRoutes from "./routes/manager-routes";
// import OrganizationRoutes from "./routes/organization-routes";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import portalTypes from "./data/portalTypes";
import { getEntityPermissionAPI } from "./api/network/customerApi";
var theme = localStorage.getItem("portal_theme");
if (theme == null) {
  theme = "dark";
}
if (theme == "light") {
  require("./styles/theme.scss");
} else {
  // require("./styles/theme-dark.scss");
}
const body = document.body;
if (theme == "dark") {
  body.classList.add("dark-mode-active");
}
if (
  window.location.host.split(".")[0] == portalTypes?.customer ||
  window.location.host.split(".")[0].search("customer") > -1
) {
  // require("./styles/customer-theme.scss");
}
if (
  window.location.host.split(".")[0] == portalTypes?.compliance ||
  window.location.host.split(".")[0].search("compliance") > -1 ||
  window.location.host.split(".")[0] == portalTypes?.management ||
  window.location.host.split(".")[0].search("management") > -1
) {
  require("./styles/compliance-theme.scss");
}
document.documentElement.style.setProperty("--my-variable", theme);
const authPages = [
  "/error-illustration",
  "/error",
  "/password-reset-cover",
  "/password-reset-illustration",
  "/password-reset",
  "/sign-in-cover",
  "/sign-in-illustration",
  "/sign-in",
  "/sign-up-cover",
  "/sign-up-illustration",
  "/sign-up",
  "/callback",
];

function isSubDomain() {
  let url = window.location.href;
  if (url.split(".").length == 2) {
    return false;
  } else {
    return true;
  }
}
function App() {
  const cancelTokenSource = axios.CancelToken.source();
  const isManagement = window.location.href?.includes("management");
  const isCompliance = window.location.href?.includes("compliance");

  const [searchParams, setSearchParams] = useSearchParams();
  console.log(
    localStorage.getItem("base_url"),
    "localStorage.getItem localStorage.getItem"
  );
  const history = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  let token = localStorage.getItem("x-auth-token");
  let state = generateRandomString();

  useEffect(() => {
    console.log(location.pathname, "location.pathname");
    const param = searchParams.get("refresh");
    if (param) {
      searchParams.delete("refresh");
      setSearchParams(searchParams);
      location.reload();
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (isManagement || isCompliance) {
      if (getCookie("entity_id")) {
        getEntityPermission(getCookie("entity_id"));
      }
    }
  }, [getCookie("entity_id")]);

  // if(!token){
  //     let url = `${process.env.AUTH_API_URL}/oauth/authorize?client_id=${process.env.INVESTOR_CLIENT_ID}&redirect_uri=${process.env.INVESTOR_REDIRECT_URL}&scope=*&staet=${state}&response_type=${process.env.INVESTOR_RESPONSE_TYPE}`
  //     window.location.href=url
  // }
  const getEntityPermission = async (data) => {
    console.log(data, "data");

    // return
    // setIsLoader(true);
    const response = await getEntityPermissionAPI(
      entityId,
      cancelTokenSource.token
    );

    if (response.success == true) {
      // response.data.length = 0;
      if (response?.data?.length == 0) {
        // setIsLoader(false);
        setPermissionsErorr(true);
        return;
      }

      localStorage.setItem(
        "entity_permissions",
        JSON.stringify(response?.data)
      ); // store entityLogo in localStorage
      document.cookie = `entity_permissions=${JSON.stringify(
        response?.data
      )};domain=${domain};path=/`;
    }
  };

  function generateRandomString() {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 40; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let baseURL = localStorage.getItem("base_url");
  console.log(baseURL, "baseURL baseURL baseURL baseURL baseURL");
  let entityId = localStorage.getItem("entity_id");
  // if (baseURL === null && isSubDomain() === true && window.location.host.split('.')[0].search('portal') == -1) {
  //     location.reload()
  // }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  if (window.location.host.split(".")[0].search("portal") == -1) {
    localStorage.setItem("entity_id", getCookie("entity_id"));
    localStorage.setItem("entity_logo", getCookie("entity_logo"));
    localStorage.setItem("profile_pic", getCookie("profile_pic"));
    localStorage.setItem("x-auth-token", getCookie("token"));
    localStorage.setItem("x-auth-token", getCookie("entities_length"));
    localStorage.setItem(
      "entity-one-portal-type",
      getCookie("entity-one-portal-type")
    );
    localStorage.setItem("entity_permissions", getCookie("entity_permissions"));

    if (
      window.location.host.split(".")[0] == portalTypes?.customer ||
      window.location.host.split(".")[0].search("customer") > -1
    ) {
      localStorage.setItem("base_url", "CAPI");
    } else if (
      window.location.host.split(".")[0] == portalTypes?.management ||
      window.location.host.split(".")[0].search("manager") > -1
    ) {
      localStorage.setItem("base_url", "MAPI");
    } else if (
      window.location.host.split(".")[0] == portalTypes?.administration ||
      window.location.host.split(".")[0].search("compliance") > -1
    ) {
      localStorage.setItem("base_url", "AAPI");
    }
    localStorage.setItem("login_user_name", getCookie("login_user_name"));
    localStorage.setItem("login_user_id", getCookie("login_user_id"));
    localStorage.setItem("user_email", getCookie("user_email"));
    axios.defaults.headers = { "x-auth-token": getCookie("token") };
  }

  const url = new URL(window.location.href);
  const domain = url.hostname.split(".").slice(-2).join(".");
  const entity_id_params = searchParams.get("entity_id");

  if (entity_id_params) {
    // debugger;
    let tokenValue = getCookie("token");
    let login_user_id = getCookie("login_user_id");
    let user_email = getCookie("user_email");
    let entity_logo = getCookie("entity_logo");
    let profile_pic = getCookie("profile_pic");
    let login_user_name = getCookie("login_user_name");
    let entity_permissions = getCookie("entity_permissions");
    deleteAllCookies();
    document.cookie = `entity_id=${entity_id_params};domain=${domain};path=/`;
    document.cookie = `login_user_name=${login_user_name};domain=${domain};path=/`;
    document.cookie = `key=${entity_id_params};domain=${domain};path=/`;
    document.cookie = `token=${tokenValue};domain=${domain};path=/`;
    document.cookie = `login_user_id=${login_user_id};domain=${domain};path=/`;
    document.cookie = `user_email=${user_email};domain=${domain};path=/`;
    document.cookie = `entity_logo=${entity_logo};domain=${domain};path=/`;
    document.cookie = `profile_pic=${profile_pic};domain=${domain};path=/`;
    document.cookie = `entity_permissions=${entity_permissions};domain=${domain};path=/`;
    localStorage.setItem("entity_id", entity_id_params);
    if (isManagement || isCompliance) {
      getEntityPermission(entity_id_params);
    }
    // localStorage.setItem('entity_permissions', entity_permissions)
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("x-auth-token", tokenValue);

    searchParams.delete("entity_id");
    // location.reload()
  }

  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

      // Get all paths for the cookie
      var cookiePaths = getAllCookiePaths(name);

      // Delete the cookie for each path
      for (var j = 0; j < cookiePaths.length; j++) {
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" +
          cookiePaths[j];
      }
    }
  }
  function getAllCookiePaths(name) {
    var pathArray = window.location.pathname.split("/");
    var paths = ["/"]; // Root path

    for (var i = 1; i < pathArray.length; i++) {
      var path = pathArray.slice(0, i).join("/");
      paths.push(path + "/");
    }

    return paths;
  }

  return (
    <>
      {!authPages.includes(history.pathname) &&
        isSubDomain() &&
        (window.location.host.split(".")[0] == portalTypes?.customer ||
          window.location.host.split(".")[0].search("customer") > -1) && (
          <CustomerNav entitiesCount={getCookie("entities_length")} />
        )}
      {!authPages.includes(history.pathname) &&
        isSubDomain() &&
        (window.location.host.split(".")[0] == portalTypes?.administration ||
          window.location.host.split(".")[0].search("compliance") > -1) && (
          <Sidenav
            entitiesCount={getCookie("entities_length")}
            portal={"compliance"}
          />
        )}
      {!authPages.includes(history.pathname) &&
        isSubDomain() &&
        (window.location.host.split(".")[0] == portalTypes?.management ||
          window.location.host.split(".")[0].search("manager") > -1 ||
          window.location.host.split(".")[0].search("management") > -1) && (
          <Sidenav
            entitiesCount={getCookie("entities_length")}
            portal={"management"}
          />
        )}

      <div
        className={
          window.location.host.split(".")[0].search("portal") == -1
            ? "administration-parent-container-root"
            : ""
        }
      >
        {isSubDomain() &&
          (window.location.host.split(".")[0] == portalTypes?.customer ||
            window.location.host.split(".")[0].search("customer") > -1) && (
            <CustomerRoutes baseURL={"CAPI"} />
          )}
        {/* {isSubDomain() &&
          (window.location.host.split(".")[0] == portalTypes?.management ||
            window.location.host.split(".")[0].search("manager") > -1 ||
            window.location.host.split(".")[0].search("management") > -1) && (
            <ManagerRoutes baseURL={"MAPI"} />
          )} */}
        {/* {isSubDomain() &&
          (window.location.host.split(".")[0] == portalTypes?.administration ||
            window.location.host.split(".")[0].search("compliance") > -1) && (
            <OrganizationRoutes baseURL={"AAPI"} />
          )} */}

        {/* Common Routes */}
        <Routes>
          {(window.location.host.split(".")[0] == "portal" ||
            window.location.host.split(".")[0].search("portal") > -1) && (
            <Route path="/" element={<CallBack />} />
          )}

          <Route path="/profile/info" element={<Info />} />
          {/* <Route path="/profile/dashboard" element={<Dashb />} /> */}
          <Route path="/sign-in" element={<Navigate to={`/`} />} />
          <Route path="/sign-up" element={<Navigate to={`/`} />} />
          <Route path="/password-reset" element={<Navigate to={`/`} />} />
          <Route path="/callback" element={<CallBack />} />
          <Route path="/splash" element={<CallBack />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
