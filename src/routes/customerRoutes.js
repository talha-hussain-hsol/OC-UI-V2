import React from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import { ThemeProvider } from "../contexts/themeContext";
import Dashboard from "../pages/customerPortal/screens/Dashboard"
import UserForm from "../pages/customerPortal/screens/account-wizard/components/UserForm"
import Accounts from "../pages/customerPortal/screens/Accounts"
import Identities from "../pages/customerPortal/screens/Identities"
import MainDocuments from "../pages/customerPortal/screens/MainDocuments"
import FundCode from "../pages/customerPortal/Screens/FundCode"
import Stepper from "../pages/customerPortal/Screens/Stepper"


const CustomerRoutesWrapper = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<ThemeProvider><Dashboard /></ThemeProvider>} />
          <Route path="/user-form" element={<ThemeProvider><UserForm /></ThemeProvider>} />
          <Route path="/accounts" element={<ThemeProvider><Accounts /></ThemeProvider>} />
          <Route path="/identities" element={<ThemeProvider><Identities /></ThemeProvider>} />
          <Route path="/documents" element={<ThemeProvider><MainDocuments /></ThemeProvider>} />
          <Route path="/fund-code" element={<ThemeProvider><FundCode /></ThemeProvider>} />
          <Route path="/stepper" element={<ThemeProvider><Stepper /></ThemeProvider>} />
        </Routes>
    </div>
  );
};

/**
 * Component used to protect the route if user tries to access a URL they do not have permission for
 * @param isAllowed - If user has permission
 * @param redirectPath - Redirect URL
 * @param children - The remaining routes
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

export default CustomerRoutesWrapper;
