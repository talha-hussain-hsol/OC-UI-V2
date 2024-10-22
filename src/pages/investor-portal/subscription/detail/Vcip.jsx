import {
  Col,
  Container,
  Row,
  Nav,
  Spinner,
  Card,
  Button,
} from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { getMissingDataOfIdentity } from "../../../../helpers";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import {
  getIdentityDocument,
  getDataSignedUrl,
  getVcipSignedUrl,
  postVerifyUploadVideo,
  getSingleAccountDetailByIdAPI,
} from "../../../../api/network/customerApi";

// import SpinnerWithBackDrop from "../../..../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../../components/ui/loader";

const refrence_Document = [
  {
    step: "1",
    title: "PAN card",
    description: "PAN card",
    document_key: "PAN_CARD",
  },
  {
    step: "2",
    title: "AADHAAR CARD",
    description: "AADHAAR CARD",
    document_key: "AADHAAR CARD",
  },
];

export default function FaceVerification(props) {
  const params = useParams();
  let path = params["*"];
  const pathSegments = path.split("/");
  const identity_id = pathSegments[1];
  const account_id = pathSegments[2];
  console.log("params params params params params params params", identity_id);
  console.log(
    "params params params params params params account_id",
    account_id
  );
  const [remarks, setRemaks] = useState([]);

  // const identity_id = "99ad9198-330e-489d-8297-26ac6c15bdfd";
  // const identity_id = props?.dataOfAccountSetup?.identity_id;
  const fund_id = props?.accountData?.fundId;
  // const account_id = "ecf8a32c-1da6-4a01-a6bb-bcdad8c70785";
  // const account_id = props?.dataOfAccountSetup?.account_id;

  console.log("sdasjkdhljahsd", params?.type);
  console.log("sdasjkdhljahsd pathSegments[2]", pathSegments[0]);
  // const shareholder_id = "98427730-d9ff-4f61-8c32-c0429bc64041";
  const shareholder_id = props?.accountData?.attach_identities[0]?.id;
  //d58736d6-237e-4c50-87a5-41a864fa5b69
  //shareholder
  //identties id 704f9694-ea1c-4f1a-98b9-767f1986460a

  const [contentTypeData, setContentTypeData] = useState("");
  const docImage = useRef();
  const docImageAdhar = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [panCardFile, setPanCardFile] = useState(null);
  const [adharCardFile, setAdharCardFile] = useState(null);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [refrenceDocument, setRefrenceDocument] = useState([]);

  const [isLoader, setIsLoader] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    console.log("refrencrefrenceDocument", refrenceDocument);
  }, [refrenceDocument]);

  useEffect(() => {
    handleGetSingleAccountDetailById();
  }, []);

  useEffect(() => {
    if (recordedVideoUrl) {
      setShowCamera(false);
      videoRef.current.srcObject = null; // Stop the camera stream when showing the recorded video
    }
  }, [recordedVideoUrl]);
  useEffect(() => {
    console.log("showCamera:", showCamera);
    console.log("videoRef.current:", videoRef.current);

    if (showCamera && videoRef.current) {
      setTimeout(function () {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            videoRef.current.srcObject = stream;
          })
          .catch((error) => {
            console.error("Error accessing the camera:", error);
          });
      }, 1000);
    }
  }, [showCamera, videoRef]);

  const handleGetIdentityDocumentApi = async (refrenceDoc) => {
    console.log(`checking`);
    setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token
    );
    console.log("object 1", response);
    if (response.success == true) {
      setIsLoader(false);
      setIdentityUploadDocList(response?.data?.IdentityDocuments);
      const resulted_refrence_document = refrenceDoc.map((refDoc) => {
        const matchingDocumentType = Object.values(
          response?.data?.IdentityDocuments
        )
          .flat()
          .find(
            (doc) =>
              doc.documentName.toLowerCase() === refDoc.title.toLowerCase()
          );

        if (matchingDocumentType) {
          const updatedDoc = {
            ...refDoc,
            meta: matchingDocumentType.meta || {},
            isUploaded: matchingDocumentType.meta?.bucket_key?.value
              ? true
              : false,
          };
          return updatedDoc;
        } else {
          return refDoc;
        }
      });

      console.log("resulted_refrence_document", resulted_refrence_document);
      setRefrenceDocument(resulted_refrence_document);
    } else {
      setIsLoader(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      setShowCamera(true);
      setRecordedVideoUrl(null);
      setVideoUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setRecording(false);
        setCountdown(30);

        const videoBlob = new Blob(chunksRef.current, { type: "video/mp4" });
        chunksRef.current = [];

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Video = reader.result;
          console.log("Base64 video:", base64Video);

          // Convert Base64 to Blob
          const binaryData = atob(base64Video.split(",")[1]);
          const length = binaryData.length;
          const uint8Array = new Uint8Array(length);
          for (let i = 0; i < length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
          const videoBlobFromBase64 = new Blob([uint8Array], {
            type: "video/mp4",
          });
          console.log("Blob from Base64:", videoBlobFromBase64);
          setVideoBlob(videoBlobFromBase64);

          // Set the Blob as the video source
          setRecordedVideoUrl(URL.createObjectURL(videoBlobFromBase64));
        };
        reader.readAsDataURL(videoBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setCountdown(30);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        mediaRecorderRef.current.stop();
      }, 31000);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const handleReRecord = () => {
    setShowCamera(true);
    setRecordedVideoUrl(null);
    setVideoUrl(null);
  };

  const handleSubmitVideo = async () => {
    setIsLoader(true);
    const response = await getVcipSignedUrl(
      identity_id,
      shareholder_id,
      cancelTokenSource.token
    );
    console.log("firsct checking respdjaslkdj.nas", response);
    if (response.success) {
      let url = response.data.video_signed_url;
      console.log(videoBlob, "imageBlob file");
      //Removing and Adding Token
      let token = axios.defaults.headers["x-auth-token"];

      delete axios.defaults.headers["x-auth-token"];
      console.log(videoBlob, "imageBlob file");

      axios
        .put(url, videoBlob, {
          headers: {
            "Content-Type": videoBlob?.type,
          },
        })
        .then(async (respond) => {
          console.log("Image Upload Success awais ", res);

          axios.defaults.headers["x-auth-token"] = token;
          const dataToSend = {
            upload: true,
          };

          const res = await postVerifyUploadVideo(
            identity_id,
            shareholder_id,
            dataToSend,
            cancelTokenSource.token
          );
          if (res.success) {
            setIsLoader(false);
          }
        })
        .catch((err) => {
          console.log("Image Upload Failed Response", err);
          axios.defaults.headers["x-auth-token"] = token;
          // setErrorMessage(response.system_message);
          setIsLoader(false);
        });
    }
  };

  const handleClickSingleDocument = async (data) => {
    console.log(`checking single document`);
    setIsLoader(true);
    const dataToSend = {
      key: data?.bucket_key?.value,
    };

    const response = await getDataSignedUrl(
      dataToSend,
      cancelTokenSource.token
    );
    console.log("object 1 getSingleDocument", response);
    if (response.success == true) {
      setIsLoader(false);

      console.log("object 1 getSingleDocument", response);
      let url = response.data;
      window.open(url, "_blank");
    } else {
      setIsLoader(false);
    }
  };
  const handleGetSingleAccountDetailById = async () => {
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      account_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      setRemaks(
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ].vcip?.remarks
      );
      let refrenceDocument;

      if (params?.type === "individual") {
        refrenceDocument =
          response?.data?.account_detail?.fund?.meta?.config?.settings?.account
            ?.applicant?.identity?.indivisual?.provider?.verify?.vcip
            ?.reference_doc;
      } else {
        refrenceDocument =
          response?.data?.account_detail?.fund?.meta?.config?.settings?.account
            ?.applicant?.identity?.indivisual?.provider?.verify?.vcip
            ?.reference_doc;
      }
      setRefrenceDocument(refrenceDocument);
      handleGetIdentityDocumentApi(refrenceDocument);

      setIsLoader(false);

      console.log(
        "response?.data?.account_detail?.attach_identi",
        response?.data?.account_detail
      );
      if (
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ]?.vcip !== undefined
      ) {
        setIsLoader(true);
        const dataToSend = {
          key: response?.data?.account_detail?.attach_identities[0]?.meta
            ?.identities[identity_id]?.vcip?.video,
        };
        const res = await getDataSignedUrl(dataToSend, cancelTokenSource.token);
        if (res.success) {
          setIsLoader(false);

          console.log("url is her", res);
          let url = res?.data;
          setVideoUrl(url);
          // window.open(url, "_blank");
        }
      } else {
        setIsLoader(false);
      }

      // setAccountData(response?.data?.account_detail);
    } else {
    }
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
                <Col xs={12} md={5} lg={5} xl={5}>
                  <Row
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Col xs={12} md={12}>
                      <Card style={{ color: "white", background: "#3f5a7b" }}>
                        <Card.Header>Instructions</Card.Header>
                        <Card.Body style={{ overflow: "scroll" }}>
                          <ul>
                            <li>The file must be in CSV format.</li>
                            <li>Only one file can be uploaded at a time.</li>
                            <li>
                              The file can only contain alphanumeric characters.
                            </li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    {/* <Col xs={12} md={12} style={{ display: "flex", justifyContent: "start", maxHeight: "100%", overflow: "scroll" }}>
                  {refrenceDocument.map((item) => (
                    <div style={{ marginRight: "1.5em" }}>
                      <div className="card" style={{ minHeight: "100%!important" }}>
                        <div className="card-body">
                          <h2 className="">{item?.title}</h2>
                          <div className="row" style={{ alignItems: "center", marginTop: "1px", justifyContent: "space-between" }}>
                            <div className="col-sm-9 col-md-9 col-lg-9 " style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" }}>
                              <div>
                                <small className="text-muted" style={{ marginRight: "0.5em" }}>
                                  Issue Date:
                                </small>
                                <small className="text-muted">{item?.meta?.issued_date?.value != null ? (item?.meta?.issued_date?.value ? format(new Date(item?.meta?.issued_date?.value), "dd/MM/yyyy") : "") : "N/A"}</small>
                              </div>
                              <div className="col-sm-9 col-md-9 col-lg-9" style={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
                                <small className="text-muted" style={{ marginRight: "0.5em" }}>
                                  Document Uploaded:
                                </small>
                                <small className="text-muted">{ item?.meta?.is_upload_verified ? "yes" : "N/A"}
                                </small>
                              </div>
                            </div>
                            {
                              console.log("itemitemitemitemitemitem",item)
                            }

                          {item?.meta &&  <div style={{ display: "flex", justifyContent: "right" }} className="col-sm-3 col-md-3 col-lg-3">
                              <Button style={{ color: "white!important" }} onClick={() => handleClickSingleDocument(item?.meta)}>
                                <GrView style={{ stroke: "white!important" }} stroke="white" />
                              </Button>
                            </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Col> */}
                  </Row>
                </Col>

                {/* Video Recording */}
                <Col xs={5} md={5}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Row>
                      <Col>
                        {showCamera && (
                          <div>
                            {videoUrl !== null ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <Button
                                    variant="primary"
                                    onClick={handleReRecord}
                                  >
                                    Re-Record
                                  </Button>
                                </div>
                                <video
                                  controls
                                  autoPlay
                                  muted
                                  style={{ width: "35em" }}
                                >
                                  <source src={videoUrl} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <video
                                  ref={videoRef}
                                  autoPlay
                                  muted
                                  style={{ width: "35em" }}
                                />

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: "5px",
                                  }}
                                >
                                  {recording ? (
                                    <p>Recording... {countdown} seconds left</p>
                                  ) : (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Button
                                          variant="primary"
                                          onClick={handleStartRecording}
                                        >
                                          Start Recording
                                        </Button>
                                        <p>
                                          Click the "Start Recording" button to
                                          begin recording.
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Col>
                    </Row>

                    {!showCamera && (
                      <Row>
                        <Col>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "15px",
                              }}
                            >
                              <h4>Recorded Video:</h4>
                              <Button
                                variant="primary"
                                onClick={handleReRecord}
                              >
                                Re-Record
                              </Button>
                            </div>

                            <video
                              ref={videoRef}
                              src={recordedVideoUrl}
                              controls
                              style={{ width: "35em" }}
                            />
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Submit Button */}
              <Row
                className="justify-content-center"
                style={{ marginTop: "15px" }}
              >
                <Col
                  xs={12}
                  md={10}
                  lg={10}
                  xl={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button variant="primary" block onClick={handleSubmitVideo}>
                    Submit
                  </Button>
                </Col>
              </Row>
              {/* Submit Button */}
              <Row>
                {remarks?.length > 0 && remarks != undefined && (
                  <Col
                    xs={12}
                    md={12}
                    style={{
                      marginTop: "16px",
                      marginBottom: "20px",
                    }}
                  >
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
                    </ul>
                  </Col>
                )}
              </Row>
            </Container>
          )}
        </Col>
      </Row>
    </div>
  );
}
