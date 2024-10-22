import { Col, Container, Row, Nav, Spinner, Card, Button, Alert } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { getMissingDataOfIdentity } from "../../../../helpers";
import axios, { CancelTokenSource } from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { getIdentityDocument, getDataSignedUrl, getVcipSignedUrl, postVerifyUploadVideo, getSingleAccountDetailByIdAPI } from "../../../../api/network/CustomerApi";
import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
import { AiOutlineConsoleSql } from "react-icons/ai";
import countries from "./../../../../helpers/countries";
import SpinnerWithBackDrop from "../../..../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import { GrView } from "react-icons/gr";
import { format } from "date-fns";
import { BsFillRecordFill } from "react-icons/bs";
import useWindowWidth from './widthHook'; // Assuming the hook is in a separate file


// import VideoRecorder from "./video-recorder/VideoRecorder";

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
  const windowWidth = useWindowWidth();

  // const identity_id = "99ad9198-330e-489d-8297-26ac6c15bdfd";
  const identity_id = props?.dataOfAccountSetup?.identity_id;
  const fund_id = props?.dataOfAccountSetup?.fund_id;
  // const account_id = "ecf8a32c-1da6-4a01-a6bb-bcdad8c70785";
  const account_id = props?.dataOfAccountSetup?.account_id;
  // const account_id = props?.dataOfAccountSetup?.account_id;

  // const shareholder_id = "98427730-d9ff-4f61-8c32-c0429bc64041";
  let shareholder_id = props?.dataOfAccountSetup?.accountData?.attach_identities ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.id : null;
  //d58736d6-237e-4c50-87a5-41a864fa5b69
  //shareholder
  //identties id 704f9694-ea1c-4f1a-98b9-767f1986460a
  console.log("sdasjkdhljahsd", params);
  console.log("sdasjkdhljahsd windowWidth", windowWidth);
  const [locationData, setLocationData] = useState({ latitude: null, longitude: null });
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);

  const params = useParams();
  const identityType = params?.type;
  const [contentTypeData, setContentTypeData] = useState("");
  const docImage = useRef();
  const docImageAdhar = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [panCardFile, setPanCardFile] = useState(null);
  const [adharCardFile, setAdharCardFile] = useState(null);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [refrenceDocument, setRefrenceDocument] = useState([]);
  let streamVideo = null; // Initialize the stream variable

  const [isLoader, setIsLoader] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [countdownStartVideo, setCountdownStartVideo] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [submited, setSubmited] = useState(false);
  // const [stopButton, setStopButton] = useState(false)
  const [showStopButton, setShowStopButton] = useState(false);
  const [showRetakeButton, setShowRetakeButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showSubmited, setShowSubmited] = useState(true);
  const [shareHolderID, setShareHolderID] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  useEffect(() => {
    if (props.handleCallAPIForVCIPData) {
      if (videoBlob) {
        handleSubmitVideo()
      } else {
        let data = {
          status: true,
          redirect: true,
        };
        props?.vcipUpload(data);
      }
      props.handleCallAPIForVCIPDataUpdateFalse()
    }
  }, [props.handleCallAPIForVCIPData])
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
      stopCamera();
    }
  }, [recordedVideoUrl]);
  // useEffect(() => {
  //   console.log("showCamera:", showCamera);
  //   console.log("videoRef.current:", videoRef.current);
  //   console.log("videoRef. recordedVideoUrl:", recordedVideoUrl);

  //   let cameraTimeout; // Variable to store the timeout reference

  //   if (!videoUrl) {
  //     if (showCamera && videoRef.current) {
  //       // Clear the previous timeout if it exists
  //       if (cameraTimeout) {
  //         clearTimeout(cameraTimeout);
  //       }

  //       // Set a new timeout
  //       cameraTimeout = setTimeout(function () {
  //         navigator.mediaDevices
  //           .getUserMedia({ video: true, audio: true })
  //           .then((stream) => {
  //             streamVideo = stream;
  //             videoRef.current.srcObject = stream;
  //           })
  //           .catch((error) => {
  //             console.error("Error accessing the camera:", error);
  //           });
  //       }, 1000);
  //     }
  //   }

  //   return () => {
  //     // Clean up by stopping the camera stream when unmounting
  //     stopCamera();

  //     // Clear the timeout when unmounting
  //     if (cameraTimeout) {
  //       clearTimeout(cameraTimeout);
  //     }
  //   };
  // }, [showCamera, videoRef, videoUrl]);

  const videoStartedClicked = async () => {
    try {
      setShowCamera(true);
      setRecordedVideoUrl(null);
      setVideoUrl(null);
      setShowStopButton(false);
      setShowRetakeButton(false);
      setShowSubmitButton(false);

      streamVideo = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      videoRef.current.srcObject = streamVideo;
      mediaRecorderRef.current = new MediaRecorder(streamVideo);

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
          stopCamera();
          props.submitVCIP(true);
          setRecordedVideoUrl(URL.createObjectURL(videoBlobFromBase64));
        };
        reader.readAsDataURL(videoBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setCountdown(30);
      setShowStopButton(true);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        mediaRecorderRef.current.stop();
        setShowStopButton(false);
        setShowRetakeButton(true);
        setShowSubmitButton(true);
      }, 31000);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamVideo) {
      streamVideo.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null; // Clear the video source
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ latitude, longitude });

          // Optionally, fetch country data from an IP-based API here
          // You can add additional functionality as needed
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(
            'Unable to retrieve your location. Please check your browser settings.',
          );
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleStartRecording = async () => {
    try {
      props.submitVCIP(false);
      getLocation();
      setCountdownStartVideo(0);

      const timer = setInterval(() => {
        setCountdownStartVideo((prevCount) => {
          console.log(prevCount, 'prevCount prevCount');
          if (prevCount == 4) {
            clearInterval(timer);
            // Start recording logic here
          }
          return prevCount + 1;
        });
      }, 1000);

      setTimeout(function () {
        videoStartedClicked();
        setCountdownStartVideo(null);
        clearInterval(timer);
      }, 4000);
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setShowStopButton(false);
    setShowRetakeButton(true);
    setShowSubmitButton(true);
    setSubmited(false);
    stopCamera();
    props.submitVCIP(true);
  };

  const handleReRecord = () => {
    setShowCamera(true);
    setRecordedVideoUrl(null);
    setVideoUrl(null);
    setSubmited(false);
    props.submitVCIP(false);
  };

  const handleSubmitVideo = async () => {
    setIsLoader(true);
    stopCamera();
    const response = await getVcipSignedUrl(
      locationData,
      identity_id,
      shareHolderID,
      cancelTokenSource.token,
    );

    console.log('firsct checking respdjaslkdj.nas', response);
    if (response.success) {
      let url = response.data.video_signed_url;
      console.log(videoBlob, 'imageBlob file');
      //Removing and Adding Token
      let token = axios.defaults.headers['x-auth-token'];

      delete axios.defaults.headers['x-auth-token'];
      console.log(videoBlob, 'imageBlob file');

      axios
        .put(url, videoBlob, {
          headers: {
            'Content-Type': videoBlob?.type,
          },
        })
        .then(async (respond) => {
          axios.defaults.headers['x-auth-token'] = token;
          const dataToSend = {
            upload: true,
          };

          const res = await postVerifyUploadVideo(
            identity_id,
            shareHolderID,
            dataToSend,
            cancelTokenSource.token,
          );
          if (res.success) {
            let data = {
              status: true,
              redirect: true,
            };
            props?.vcipUpload(data);
            setShowSubmited(false);
            setSubmited(true);

            setIsLoader(false);
          }
        })
        .catch((err) => {
          console.log('Image Upload Failed Response', err);
          axios.defaults.headers['x-auth-token'] = token;
          // setErrorMessage(response.system_message);
          setIsLoader(false);
        });
    }
  };
  const handleGetIdentityDocumentApi = async (refrenceDoc) => {
    console.log(`checking`);
    setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token,
    );
    console.log('object 1', response);
    if (response.success == true) {
      setIsLoader(false);
      setIdentityUploadDocList(response?.data?.IdentityDocuments);
      const resulted_refrence_document = refrenceDoc.map((refDoc) => {
        const matchingDocumentType = Object.values(
          response?.data?.IdentityDocuments,
        )
          .flat()
          .find(
            (doc) =>
              doc.documentName.toLowerCase() === refDoc.title.toLowerCase(),
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

      console.log('resulted_refrence_document', resulted_refrence_document);
      setRefrenceDocument(resulted_refrence_document);
    } else {
      setIsLoader(false);
    }
  };

  const handleClickSingleDocument = async (data) => {
    console.log(`checking single document`);
    // return
    setIsLoader(true);
    const dataToSend = {
      key: data?.bucket_key?.value,
    };

    const response = await getDataSignedUrl(
      dataToSend,
      cancelTokenSource.token,
    );
    console.log('object 1 getSingleDocument', response);
    setIsLoader(false);
    if (response.success == true) {
      console.log('object 1 getSingleDocument', response);
      let url = response.data;
      window.open(url, '_blank');
    } else {
      setIsLoader(false);
    }
  };
  const handleGetSingleAccountDetailById = async () => {
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      account_id,
      cancelTokenSource.token,
    );
    setIsLoader(false);

    if (response.success == true) {
      setShareHolderID(
        response?.data?.account_detail?.attach_identities[0]?.id,
      );
      let refrenceDocument;

      if (identityType === 'individual') {
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
        'response?.data?.account_detail?.attach_identi',
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ]?.vcip,
      );
      if (
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ]?.vcip !== undefined
      ) {
        setIsLoader(true);
        console.log(
          'response?.data?.account_detail?.attach_identities[0]?.meta?.identities',
          response?.data?.account_detail?.attach_identities[0]?.meta
            ?.identities,
        );
        const dataToSend = {
          key: response?.data?.account_detail?.attach_identities[0]?.meta
            ?.identities[identity_id]?.vcip?.video,
        };
        const res = await getDataSignedUrl(dataToSend, cancelTokenSource.token);
        if (res.success) {
          setIsLoader(false);

          console.log('url is her', res);
          let url = res?.data;
          setVideoUrl(url);
          setSubmited(true);
          let data = {
            status: true,
            redirect: false,
          };
          props?.vcipUpload(data);
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
      {isLoader ? (
        <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
      ) : (
        <Container fluid>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '25px',
              borderBottom: '6px solid #1e3c5c',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 className="mb-0">
              VCIP - Video Based Customer Identification Process
            </h1>

            {/* <Button
              variant="primary"
              onClick={handleStartRecording}
            >
              Start Recording
            </Button> */}
          </div>
          <Row>
            <Col xs={12} md={8}>
              <Row
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Col xs={12} md={12}>
                  <Card style={{ color: 'white' }}>
                    <Card.Header>Welcome To the VCIP Step.</Card.Header>
                    <Card.Body style={{ overflow: 'auto', height: '430px' }}>
                      {props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity[
                        props?.dataOfAccountSetup?.isIndividual
                          ? 'indivisual'
                          : 'corporate'
                      ]?.provider?.verify?.vcip?.instructions?.indexOf('</') !==
                      -1 ? (
                        <div
                          style={{ fontSize: '16px' }}
                          dangerouslySetInnerHTML={{
                            __html:
                              props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity[
                                props?.dataOfAccountSetup?.isIndividual
                                  ? 'indivisual'
                                  : 'corporate'
                              ]?.provider?.verify?.vcip?.instructions.replace(
                                /(<? *script)/gi,
                                'illegalscript',
                              ),
                          }}
                        ></div>
                      ) : (
                        <div style={{ fontSize: '16px' }}>
                          {
                            props?.dataOfAccountSetup?.fund_data?.fund_setting
                              ?.account?.applicant?.identity[
                              props?.dataOfAccountSetup?.isIndividual
                                ? 'indivisual'
                                : 'corporate'
                            ]?.provider?.verify?.vcip?.instructions
                          }
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* Video Recording */}

            <Col xs={12} md={4}>
              <Card style={{ color: 'white' }}>
                <Card.Body
                  style={{
                    height: '490px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Row>
                      <div
                        className="d-flex justify-content-left"
                        style={{ height: '30px', marginBottom: '2em' }}
                      >
                        <h4 className="text-left mb-3">
                          For Personal Privacy Purpose The Video Recorded Will
                          Be Blurred
                        </h4>
                      </div>
                      <Col>
                        {showCamera && (
                          <div>
                            {videoUrl !== null ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  filter: 'blur(5px)',
                                }}
                              >
                                {/* <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                  }}
                                >
                                  {!submited && (
                                    <Button
                                      variant="primary"
                                      onClick={handleReRecord}
                                    >
                                      Re-Record
                                    </Button>
                                  )}
                                </div> */}
                                <video
                                  controls
                                  autoPlay
                                  style={{
                                    width:
                                      windowWidth > 3200
                                        ? '50%'
                                        : windowWidth > 2400
                                        ? '69%'
                                        : windowWidth > 2100
                                        ? '78%'
                                        : windowWidth > 1900
                                        ? '84%'
                                        : windowWidth > 1680
                                        ? '90%'
                                        : '100%',
                                  }}
                                >
                                  <source src={videoUrl} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  position: 'relative',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  className="video-recorder-container"
                                  style={{
                                    position: 'relative',
                                    filter: 'blur(5px)',
                                  }}
                                >
                                  <video
                                    ref={videoRef}
                                    autoPlay
                                    style={{
                                      width:
                                        windowWidth > 3200
                                          ? '50%'
                                          : windowWidth > 2400
                                          ? '69%'
                                          : windowWidth > 2100
                                          ? '78%'
                                          : windowWidth > 1900
                                          ? '84%'
                                          : windowWidth > 1680
                                          ? '90%'
                                          : '100%',
                                    }}
                                    playsinline
                                    muted
                                  />
                                  {recording && (
                                    <div style={{ position: 'absolute' }}>
                                      <img
                                        src="/img/face.png"
                                        style={{
                                          height: '200px',
                                          marginTop: '10px',
                                          marginBottom: '10px',
                                          opacity: '1',
                                        }}
                                      />
                                    </div>
                                  )}
                                  {countdownStartVideo &&
                                    countdownStartVideo > 0 && (
                                      <div className="countdown">
                                        {countdownStartVideo != 4
                                          ? countdownStartVideo
                                          : 'Start'}
                                      </div>
                                    )}
                                  {/* {showStopButton && (
                                    <Button
                                      variant="secondary"
                                      className="mt-3"
                                      onClick={stopRecording}
                                    >
                                      Stop Recording
                                    </Button>
                                  )} */}
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '5px',
                                    margin: '10px',
                                    position: 'absolute',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {!recording && (
                                    <>
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          margin: '10px',
                                          width: '100%',
                                        }}
                                      >
                                        <img
                                          src="/img/face.png"
                                          className="img-face"
                                          style={{
                                            height: '200px',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                          }}
                                        />
                                      </div>
                                    </>
                                  )}
                                  {recording ? (
                                    <p>Recording... {countdown} seconds left</p>
                                  ) : (
                                    <p
                                      style={{
                                        fontSize: '18px',
                                        marginTop: '10px',
                                      }}
                                    >
                                      Position Your Face In The Designated Area
                                    </p>
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
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'baseline',
                            }}
                          >
                            <video
                              ref={videoRef}
                              src={recordedVideoUrl}
                              controls
                              style={{
                                width:
                                  windowWidth > 3200
                                    ? '50%'
                                    : windowWidth > 2400
                                    ? '69%'
                                    : windowWidth > 2100
                                    ? '78%'
                                    : windowWidth > 1900
                                    ? '84%'
                                    : windowWidth > 1680
                                    ? '90%'
                                    : '100%',
                                filter: 'blur(5px)',
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px',
                              }}
                            >
                              {/* {showSubmited && (
                                <Button
                                  variant="primary"
                                  onClick={handleReRecord}
                                >
                                  Re-Record
                                </Button>
                              )} */}
                              {!submited && (
                                <Row
                                  className="justify-content-center"
                                  style={{ marginTop: '15px' }}
                                >
                                  <Col
                                    xs={12}
                                    md={12}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {/* {showSubmited && (
                                      <Button
                                        variant="primary"
                                        block
                                        onClick={handleSubmitVideo}
                                      >
                                        Submit
                                      </Button>
                                    )} */}
                                  </Col>
                                </Row>
                              )}
                            </div>
                            {submited && (
                              <Alert
                                closeLabel
                                dismissible={true}
                                key="success"
                                variant="success"
                                onClose={() => setSubmited(null)}
                              >
                                VCIP Submitted. Please proceed to the next step
                                to complete the application.
                              </Alert>
                            )}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {showCamera && (
                      <>
                        {videoUrl !== null ? (
                          <>
                            {!submited && (
                              <Button
                                style={{ margin: '0px 10px' }}
                                variant="primary"
                                onClick={() => {
                                  handleReRecord();
                                }}
                              >
                                Re-Record
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            {showStopButton && (
                              <Button
                                style={{ margin: '0px 10px' }}
                                variant="secondary"
                                className="mt-3"
                                onClick={() => {
                                  stopRecording();
                                }}
                              >
                                Stop Recording
                              </Button>
                            )}

                            {recording ? (
                              <></>
                            ) : (
                              // <p>Recording...</p>
                              <>
                                <Button
                                  variant="success"
                                  className="btn btn-success btn-success-custom"
                                  style={{
                                    margin: '0px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  onClick={() => {
                                    handleStartRecording();
                                  }}
                                >
                                  <BsFillRecordFill
                                    color="red"
                                    size="15px"
                                    style={{ marginRight: '5px' }}
                                  />
                                  Start Recording
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <>
                      {!showCamera && (
                        <>
                          {showSubmited && (
                            <Button
                              style={{ margin: '0px 10px' }}
                              variant="primary"
                              className="btn btn-danger"
                              onClick={() => {
                                handleReRecord();
                              }}
                            >
                              Re-Record
                            </Button>
                          )}
                          {/* {!submited && (
                            <>
                              {showSubmited && (
                                <Button
                                  style={{ margin: "0px 10px" }}
                                  variant="primary"
                                  className="btn btn-success"
                                  block
                                  onClick={() => {
                                    handleSubmitVideo();
                                  }}
                                >
                                  Submit
                                </Button>
                              )}
                            </>
                          )} */}
                        </>
                      )}
                    </>
                    {videoUrl !== null && (
                      <>
                        <Button
                          style={{ margin: '0px 10px' }}
                          variant="primary"
                          className="btn btn-danger"
                          onClick={() => {
                            handleReRecord();
                          }}
                        >
                          Re-Record
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
