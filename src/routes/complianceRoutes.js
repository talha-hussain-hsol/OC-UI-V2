import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";

import "react-toastify/dist/ReactToastify.css";
import ComplianceDashboard from "../pages/compliancePortal/dashboard";

const ComplianceRoutesWrapper = () => {
  return (
    <div
      className={`w-full overflow-hidden bg-custom-gradient text-white pt-[0.5%] pl-[7%] pr-[4%]`}
    >
      <Routes>
        <Route path={"/"} element={<ComplianceDashboard />} />
      </Routes>
    </div>
  );
};

ComplianceRoutesWrapper.propTypes = {
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

export default ComplianceRoutesWrapper;
