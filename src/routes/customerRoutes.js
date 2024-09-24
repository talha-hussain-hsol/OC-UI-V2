// import React from 'react'
// import { ThemeProvider } from '../contexts/themeContext'
// import Dashboard from '../OurComponents/Screens/Dashboard'
// import UserForm from '../OurComponents/Screens/UserForm'
// import Accounts from '../OurComponents/Screens/Accounts'
// import Identities from '../OurComponents/Screens/Identities'
// import MainDocuments from '../OurComponents/Screens/MainDocuments'
// import FundCode from '../OurComponents/Screens/FundCode'
// import Stepper from '../OurComponents/Screens/Stepper'

// const customerRoutes = () => {
//   return (
//     <div>
//        <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<ThemeProvider> <Dashboard /> </ThemeProvider> } />
//         <Route path="/user-form" element={<ThemeProvider> <UserForm /> </ThemeProvider> } />
//         <Route path="/accounts" element={<ThemeProvider> <Accounts /> </ThemeProvider> } />
//         <Route path="/identities" element={<ThemeProvider> <Identities /> </ThemeProvider> } />
//         <Route path="/documents" element={<ThemeProvider> <MainDocuments /> </ThemeProvider> } />
//         <Route path="/fund-code"  element={<ThemeProvider> <FundCode /> </ThemeProvider> } />
//         <Route path="/stepper"  element={<ThemeProvider> <Stepper /> </ThemeProvider> } />
        
//       </Routes>
//     </BrowserRouter>
//     </div>
//   )
// }

// export default customerRoutes



import React from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import { ThemeProvider } from "../contexts/themeContext";
import Dashboard from "../pages/customerPortal/Screens/Dashboard"
import UserForm from "../pages/customerPortal/Screens/UserForm"
import Accounts from "../pages/customerPortal/Screens/Accounts"
import Identities from "../pages/customerPortal/Screens/Identities"
import MainDocuments from "../pages/customerPortal/Screens/MainDocuments"
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
