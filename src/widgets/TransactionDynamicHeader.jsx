import { Link, useLocation, useParams } from "react-router-dom";
import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";
import {
  Dropdown,
  DropdownButton,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { downloadTransactionReportAPI } from "../api/network/administrationApi/administrationAPI";
import Loader from "../components/ui/loader/index";
// import CustomAlert from './bootstrap-component/Alert';

export default function TransactionDynamicHeader({ ...props }) {
  const history = useLocation();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
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

  // let identity_id_value = '';
  // if (params.identity_id) {
  //     identity_id_value = '/' + params.identity_id
  // }
  // if (params.account_id) {
  //     identity_id_value = identity_id_value + '/' + params.account_id
  // }
  const handleDownloadReport = async (mode) => {
    setIsLoader(true);

    try {
      const response = await downloadTransactionReportAPI(
        mode,
        params?.fund_id,
        cancelTokenSource.token
      );
      setIsLoader(false);
      if (response.success) {
        handleAlert({
          variant: "success",
          message: "Download Transaction Report Successfully",
          show: true,
          hideAuto: true,
        });
        console.log(response?.data, "response?.data");
        window.open(response?.data, "_blank").focus();
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoader(false);
    }
  };
  const handleSelect = (eventKey) => {
    handleDownloadReport(eventKey);
  };

  return (
    <div className="card-header">
      {/* {alertProps.show && (
        <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
          {alertProps.message}
        </CustomAlert>
      )} */}
      <h4 className="card-header-title">{props?.title}</h4>

      {!props?.isEntitiesUpload && (
        <>
          <ul className="nav nav-tabs nav-tabs-sm card-header-tabs me-2">
            <li className="nav-item">
              <Link
                to={`/${params?.fund_id}/transactions/summary`}
                className={
                  history.pathname.indexOf("transactions/summary") > -1
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Summary
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/${params?.fund_id}/transactions/list`}
                className={
                  history.pathname.indexOf("transactions/list") > -1
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/${params?.fund_id}/transactions/monitoring`}
                className={
                  history.pathname.indexOf("monitoring") > -1
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Alerts
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/${params?.fund_id}/transactions/upload`}
                className={
                  history.pathname.indexOf("upload") > -1
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Upload
              </Link>
            </li>
            <li className="nav-item" style={{ marginTop: "10px" }}>
              <OverlayTrigger
                overlay={<Tooltip>Download Transaction Report</Tooltip>}
              >
                <DropdownButton
                  title={
                    isLoader ? (
                      <Loader />
                    ) : (
                      <FeatherIcon icon="download" size="14" />
                    )
                  }
                  id="dropdown-basic-button"
                  onSelect={handleSelect}
                  disabled={isLoader}
                  className="no-caret"
                >
                  <Dropdown.Item eventKey="csv">Download As .CSV</Dropdown.Item>
                  <Dropdown.Item eventKey="pdf">Download As .PDF</Dropdown.Item>
                </DropdownButton>
              </OverlayTrigger>
            </li>
          </ul>

          {/* <Link to={`#`} className="btn btn-sm btn-white">
            <FeatherIcon icon="download" size="14"></FeatherIcon>Download
          </Link> */}
        </>
      )}
    </div>
  );
}
