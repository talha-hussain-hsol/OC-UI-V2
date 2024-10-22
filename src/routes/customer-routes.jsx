import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/investor-portal/dashboard/index";
import PerformanceDocument from "../pages/investor-portal/performance-documents/index";
import Identities from "../pages/investor-portal/profile/identities";
import IdentityCRPParticular from "../pages/investor-portal/profile/entity/crp-particular";
import SubscriptionList from "../pages/investor-portal/subscription/subscription-list";
import SubscriptionRequest from "../pages/investor-portal/account-wizard/index";
// import particularWizard from './../pages/investor-portal/profile/entity/particulars/wizard';
import { verifyFundExist } from "../api/network/customerApi";
// import LoadingSpinner from "../";

import ProfileIdentitiesRoutes from "./customer-routes/profile-routes";
import SubscriptionRoutes from "./customer-routes/SubscriptionRoutes";

import axios from "axios";
import utilsData from "../helpers/utils";
import { useLocation, useSearchParams } from "react-router-dom";
// import LoadingSpinner from "../widgets/bootstrap-component/Spinner";
import Loader from "../components/ui/loader";
// import CustomAlert from "../widgets/bootstrap-component/Alert";

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
];

function customerRoutes(props) {
  const cancelTokenSource = axios.CancelToken.source();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoader, setIsLoader] = useState(false);
  const [isSCB, setIsSCB] = useState(false);
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
  // function getCookie(name) {
  //     const value = `; ${document.cookie}`;
  //     const parts = value.split(`; ${name}=`);
  //     if (parts.length === 2) return parts.pop().split(';').shift();
  // }
  useEffect(() => {
    handleGetCustomersAccounts();
  }, []);
  const handleGetCustomersAccounts = async () => {
    setIsLoader(true);
    const response = await verifyFundExist(
      { fund_ids: [3, 215, 1] },
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      console.log("responseresponse", response);

      setIsSCB(response?.data?.count);

      // dispatch(setCustomerAccounts(response?.data?.customer_accounts))
    } else {
      setIsLoader(false);
    }
  };
  function getCookie(name) {
    const cookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`));
    if (!!cookie) {
      return cookie.split("=")[1];
    }
    return undefined;
  }
  localStorage.setItem("entity_id", getCookie("entity_id"));
  localStorage.setItem("x-auth-token", getCookie("token"));
  localStorage.setItem("base_url", props.baseURL);
  localStorage.setItem("login_user_id", getCookie("login_user_id"));
  localStorage.setItem("login_user_email", getCookie("user_email"));
  localStorage.setItem("user_email", getCookie("user_email"));
  utilsData.setPortalType(props.baseURL);
  axios.defaults.headers = { "x-auth-token": getCookie("token") };

  // const url = new URL(window.location.href);
  // const domain = url.hostname.split(".").slice(-2).join(".");
  // const entity_id_params = searchParams.get('entity_id');

  // if (entity_id_params) {
  //     let tokenValue = getCookie('token')
  //     let login_user_id = getCookie('login_user_id')
  //     let entity_logo = getCookie('entity_logo')
  //     let profile_pic = getCookie('profile_pic')
  //     deleteAllCookies()
  //     document.cookie = `entity_id=${entity_id_params};domain=${domain};path=/`;
  //     document.cookie = `key=${entity_id_params};domain=${domain};path=/`;
  //     document.cookie = `token=${tokenValue};domain=${domain};path=/`;
  //     document.cookie = `login_user_id=${login_user_id};domain=${domain};path=/`;
  //     document.cookie = `entity_logo=${entity_logo};domain=${domain};path=/`;
  //     document.cookie = `profile_pic=${profile_pic};domain=${domain};path=/`;
  //     localStorage.setItem('entity_id', entity_id_params)
  //     localStorage.setItem('token', tokenValue)
  //     localStorage.setItem('x-auth-token', tokenValue)
  //     searchParams.delete('entity_id');
  //     // location.reload()
  // }
  // function deleteAllCookies() {
  //     const cookies = document.cookie.split(";");
  //     const url = new URL(window.location.href);
  //     const domain = url.hostname.split(".").slice(-2).join(".");
  //     for (let i = 0; i < cookies.length; i++) {
  //         const cookie = cookies[i];
  //         const eqPos = cookie.indexOf("=");
  //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //         document.cookie = name + `=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`;
  //     }
  // }

  return (
    <>
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
      {isLoader ? (
        // <LoadingSpinner animation="grow" custom={true} height="50vh" />
        <Loader />
      ) : (
        <Routes>
          {/* {window.location.host.split(".")[0] == "customer" &&
                        window.location.host.split(".")[1] == "one-constellation" && (
                            <Route path="/" element={<Dashboard />} />
                        )} */}
          {isSCB ? (
            <Route path="/" element={<Dashboard />} />
          ) : (
            <Route path="/" element={<SubscriptionList />} />
          )}

          <Route
            path="/performance-document"
            element={<PerformanceDocument />}
          />
          {/* <Route path="/" element={<Dashboard />} /> */}
          {/* <Route path="/subscription/request/wizard" element={<particularWizard />} /> */}
          <Route
            path="/profile/identity/:type/*"
            element={<ProfileIdentitiesRoutes />}
          />
          <Route
            path="/profile/detail/:identity_id/:account_id"
            element={<SubscriptionRequest />}
          />
          {/* <Route path="/profile/detail/:account_id" element={<SubscriptionRequest />} /> */}

          <Route
            path="/profile/identity/:type/particular/crp/:identity_id"
            element={<IdentityCRPParticular />}
          />
          <Route
            path="/profile/identity/:type/particular/crp/:identity_id/:crp_id"
            element={<IdentityCRPParticular />}
          />

          <Route path="/profile/identities" element={<Identities />} />

          <Route
            path="/subscription/request"
            element={<SubscriptionRequest />}
          />

          <Route
            path="/subscription/request/:identity_id"
            element={<SubscriptionRequest />}
          />
          <Route path="/subscription/*" element={<SubscriptionRoutes />} />

          <Route
            path="/subscription-list"
            element={<SubscriptionList handleAlert={handleAlert} />}
          />
        </Routes>
      )}
    </>
  );
}

export default customerRoutes;
