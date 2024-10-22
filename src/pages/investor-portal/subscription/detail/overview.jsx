import { Col, Container, Row, Nav, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Details from "./overview/details";
import { getSingleAccountDetailByIdAPI } from "../../../../api/network/customerApi";
// import LoadingSpinner from "../../..../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../components/ui/loader";
// import CustomAlert from "../../../../widgets/bootstrap-component/Alert";

export default function overview() {
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [accountData, setAccountData] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  let path = params["*"];
  const pathSegments = path.split("/");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];
  console.log("params params params params params params params", params);
  useEffect(() => {
    if (account_id) {
      getSingleAccountDetailById(account_id);
    }
  }, []);
  useEffect(() => {
    console.log("isLoader", isLoader);
  }, [isLoader]);
  const getSingleAccountDetailById = async (accountId) => {
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      accountId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      console.log("response", response);
      setAccountData(response?.data?.account_detail);
      const typeUser =
        response?.data?.account_detail?.attach_identities[0]?.identity?.type.toLowerCase();
      const identity_id =
        response?.data?.account_detail?.attach_identities[0]?.identity?.id;
      if (!params?.identity_id) {
        navigate(
          `/profile/identity/${typeUser}/overview/${identity_id}/${accountId}`
        );
      }
    } else {
    }
  };

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };
  return (
    <div className="main-content">
      {/* {showAlert && (
        <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
          {alertProps.message}
        </CustomAlert>
      )} */}
      <Container fluid>
        <Row className="justify-content-center">
          {isLoader ? (
            // <LoadingSpinner animation="grow" custom={true} height="70vh" />
            <Loader />
          ) : (
            <Col xs={10} lg={10} xl={10}>
              <Details
                setAlertProps={setAlertProps}
                getSingleAccountDetailById={getSingleAccountDetailById}
                handleAlert={handleAlert}
                setShowAlert={setShowAlert}
                accountData={accountData}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
