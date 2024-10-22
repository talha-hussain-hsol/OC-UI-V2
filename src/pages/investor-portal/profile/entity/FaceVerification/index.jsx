import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Container,
  Row,
  Nav,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";
// import CustomAlert from "../../../../../widgets/bootstrap-component/Alert";
import {
  getDataSignedUrl,
  getIdentityDocument,
  getRequiredDocument,
  getSingleAccountDetailByIdAPI,
  getSingleDocument,
} from "../../../../../api/network/customerApi";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
// import SpinnerWithBackDrop from "../../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../../../components/ui/loader";

const FaceVerification = () => {
  const cancelTokenSource = axios.CancelToken.source();

  //params
  let { identity_id, account_id, type, fund_id } = useParams();
  // use states

  const [imageOneUrl, setImageOneUrl] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [remarks, setRemaks] = useState([]);
  const [status, setStatus] = useState("");
  const [imageTwoUrl, setImageTwoUrl] = useState(null);
  const [accountShareHolderId, setAccountShareHolderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [comment, setComment] = useState("");
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const statusOptions = [
    { value: "", label: "Please Select Status" },
    { value: "request_changes", label: "Request Changes" },
    { value: "rejected", label: "Rejected" },
    { value: "accepted", label: "Accepted" },
  ];

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  // use Efeect
  useEffect(() => {
    handleGetSingleAccountDetailById();
  }, []);

  // api functions
  const handleGetSingleAccountDetailById = async () => {
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      account_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);

      if (
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities
      ) {
        if (
          response?.data?.account_detail?.attach_identities[0]?.meta
            ?.identities[identity_id].faceVerification
        ) {
          setSelectedStatus(
            response?.data?.account_detail?.attach_identities[0]?.meta
              ?.identities[identity_id].faceVerification?.status
          );
          setRemaks(
            response?.data?.account_detail?.attach_identities[0]?.meta
              ?.identities[identity_id].faceVerification?.remarks
          );
          setStatus(
            response?.data?.account_detail?.attach_identities[0]?.meta
              ?.identities[identity_id].faceVerification?.status
          );
        }
        const dataToSend = {
          key: response?.data?.account_detail?.attach_identities[0]?.meta
            ?.identities[identity_id].faceVerification?.images?.face,
        };
        const res = await getDataSignedUrl(dataToSend, cancelTokenSource.token);
        if (res.success) {
          console.log(res?.data, "res?.data");
          setImageOneUrl(res?.data);
          // setImageTwoUrl(res?.data?.identification)
          setAccountShareHolderId(
            response?.data?.account_detail?.attach_identities[0]?.id
          );
        }
      }
      if (
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ].faceVerification?.images?.identification
      ) {
        const dataToSend = {
          key: response?.data?.account_detail?.attach_identities[0]?.meta
            ?.identities[identity_id].faceVerification?.images?.identification,
        };
        const res = await getDataSignedUrl(dataToSend, cancelTokenSource.token);
        if (res.success) {
          console.log(res?.data, "res?.data");
          // setImageOneUrl(res?.data)
          setImageTwoUrl(res?.data);
          setAccountShareHolderId(
            response?.data?.account_detail?.attach_identities[0]?.id
          );
        }
      }
    }
  };

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  return (
    <div className="main-content">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={10}>
          {isLoader ? (
            // <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
            <Loader />
          ) : (
            <Container fluid>
              <Row>
                <Col xs={6} md={6}>
                  {console.log(imageOneUrl, "imageOneUrl")}
                  {imageOneUrl && (
                    <div>
                      <img src={imageOneUrl} alt="capturedImage" />
                    </div>
                  )}
                </Col>
                <Col xs={6} md={6}>
                  {console.log(imageTwoUrl, "imageTwoUrl")}
                  {imageTwoUrl && (
                    <div>
                      <img src={imageTwoUrl} alt="capturedImage" />
                    </div>
                  )}
                </Col>
                {imageOneUrl && imageTwoUrl !== null ? (
                  <>
                    <Row>
                      <Col
                        xs={12}
                        md={12}
                        style={{
                          marginTop: "16px",
                          marginBottom: "20px",
                        }}
                      >
                        <h3>Status: {status}</h3>
                        <h3>Remarks</h3>
                        <ul>
                          {remarks &&
                            remarks.map((item, index) => (
                              <li>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{item?.comment}</span>
                                </div>
                              </li>
                            ))}
                          {remarks?.length == 0 && <h3>No Remark Found</h3>}
                        </ul>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Row>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                      xs={12}
                      md={10}
                    >
                      <h4>Please Upload Images First</h4>
                    </Col>
                  </Row>
                )}
              </Row>
              {/* {alertProps.show && (
                <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
                  {alertProps.message}
                </CustomAlert>
              )} */}
            </Container>
          )}
        </Col>
      </Row>
    </div>
  );
};
export default FaceVerification;
