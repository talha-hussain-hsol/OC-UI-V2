import {
  Col,
  Container,
  Row,
  Nav,
  Spinner,
  Card,
  Button,
  Alert,
} from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
// import { getMissingDataOfIdentity } from "../../../../helpers";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  getIdentityDocument,
  getDataSignedUrl,
  getVcipSignedUrl,
  postVerifyUploadVideo,
  getSingleAccountDetailByIdAPI,
} from "../../../api/network/CustomerApi";
import SpinnerWithBackDrop from "../../../components/ui/loader";
import { BsFillRecordFill } from "react-icons/bs";
import useWindowWidth from "./widthHook";

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
  const identity_id = props?.dataOfAccountSetup?.identity_id;
  const fund_id = props?.dataOfAccountSetup?.fund_id;
  const account_id = props?.dataOfAccountSetup?.account_id;

  let shareholder_id = props?.dataOfAccountSetup?.accountData?.attach_identities
    ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.id
    : null;
  console.log("sdasjkdhljahsd", params);
  console.log("sdasjkdhljahsd windowWidth", windowWidth);
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  });
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
        handleSubmitVideo();
      } else {
        let data = {
          status: true,
          redirect: true,
        };
        props?.vcipUpload(data);
      }
      props.handleCallAPIForVCIPDataUpdateFalse();
    }
  }, [props.handleCallAPIForVCIPData]);
  useEffect(() => {
    console.log("refrencrefrenceDocument", refrenceDocument);
  }, [refrenceDocument]);

  useEffect(() => {
    handleGetSingleAccountDetailById();
  }, []);

  useEffect(() => {
    if (recordedVideoUrl) {
      setShowCamera(false);
      videoRef.current.srcObject = null;
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

      streamVideo = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

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

        const reader = new FileReader();
        reader.onload = () => {
          const base64Video = reader.result;
          console.log("Base64 video:", base64Video);

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
      video.srcObject = null;
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to retrieve your location. Please check your browser settings."
          );
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleStartRecording = async () => {
    try {
      props.submitVCIP(false);
      getLocation();
      setCountdownStartVideo(0);

      const timer = setInterval(() => {
        setCountdownStartVideo((prevCount) => {
          console.log(prevCount, "prevCount prevCount");
          if (prevCount == 4) {
            clearInterval(timer);
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
      console.error("Error accessing the camera:", error);
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
      cancelTokenSource.token
    );

    console.log("firsct checking respdjaslkdj.nas", response);
    if (response.success) {
      let url = response.data.video_signed_url;
      console.log(videoBlob, "imageBlob file");
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
          axios.defaults.headers["x-auth-token"] = token;
          const dataToSend = {
            upload: true,
          };

          const res = await postVerifyUploadVideo(
            identity_id,
            shareHolderID,
            dataToSend,
            cancelTokenSource.token
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
          console.log("Image Upload Failed Response", err);
          axios.defaults.headers["x-auth-token"] = token;
          setIsLoader(false);
        });
    }
  };
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

  const handleClickSingleDocument = async (data) => {
    console.log(`checking single document`);
    // return
    setIsLoader(true);
    const dataToSend = {
      key: data?.bucket_key?.value,
    };

    const response = await getDataSignedUrl(
      dataToSend,
      cancelTokenSource.token
    );
    console.log("object 1 getSingleDocument", response);
    setIsLoader(false);
    if (response.success == true) {
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
      setShareHolderID(
        response?.data?.account_detail?.attach_identities[0]?.id
      );
      let refrenceDocument;

      if (identityType === "individual") {
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
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ]?.vcip
      );
      if (
        response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
          identity_id
        ]?.vcip !== undefined
      ) {
        setIsLoader(true);
        console.log(
          "response?.data?.account_detail?.attach_identities[0]?.meta?.identities",
          response?.data?.account_detail?.attach_identities[0]?.meta?.identities
        );
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
              borderBottom: "6px solid #1e3c5c",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="mb-0">
              VCIP - Video Based Customer Identification Process
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="col-span-12 md:col-span-8">
              <div className="flex flex-col justify-center">
                <div className="col-span-12">
                  <div className="bg-gray-800 text-white p-4 rounded-md">
                    <div className="text-xl font-bold border-b pb-2">
                      Welcome To the VCIP Step.
                    </div>
                    <div className="overflow-auto h-[430px] mt-4">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Recording */}

            <div className="col-span-12 md:col-span-4">
              <div className="bg-gray-800 text-white p-4 rounded-md">
                <div className="flex flex-col justify-between h-[490px]">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                      <div className="grid grid-cols-1">
                        <div
                          className="flex justify-start items-center mb-8"
                          style={{ height: "30px" }}
                        >
                          <h4 className="text-left mb-3">
                            For Personal Privacy Purpose The Video Recorded Will
                            Be Blurred
                          </h4>
                        </div>
                        <div>
                          {showCamera && (
                            <div>
                              {videoUrl !== null ? (
                                <div
                                  className="flex flex-col items-center"
                                  style={{ filter: "blur(5px)" }}
                                >
                                  <video
                                    controls
                                    autoPlay
                                    className={
                                      windowWidth > 3200
                                        ? "w-1/2"
                                        : windowWidth > 2400
                                        ? "w-7/10"
                                        : windowWidth > 2100
                                        ? "w-4/5"
                                        : windowWidth > 1900
                                        ? "w-5/6"
                                        : windowWidth > 1680
                                        ? "w-9/10"
                                        : "w-full"
                                    }
                                  >
                                    <source src={videoUrl} type="video/mp4" />
                                  </video>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center relative">
                                  <div
                                    className="relative"
                                    style={{ filter: "blur(5px)" }}
                                  >
                                    <video
                                      ref={videoRef}
                                      autoPlay
                                      muted
                                      className={
                                        windowWidth > 3200
                                          ? "w-1/2"
                                          : windowWidth > 2400
                                          ? "w-7/10"
                                          : windowWidth > 2100
                                          ? "w-4/5"
                                          : windowWidth > 1900
                                          ? "w-5/6"
                                          : windowWidth > 1680
                                          ? "w-9/10"
                                          : "w-full"
                                      }
                                      playsInline
                                      
                                    />
                                    {recording && (
                                      <div className="absolute">
                                        <img
                                          src="/img/face.png"
                                          className="h-48 mt-2 mb-2 opacity-100"
                                        />
                                      </div>
                                    )}
                                    {countdownStartVideo &&
                                      countdownStartVideo > 0 && (
                                        <div className="countdown">
                                          {countdownStartVideo !== 4
                                            ? countdownStartVideo
                                            : "Start"}
                                        </div>
                                      )}
                                  </div>
                                  <div className="flex flex-col items-center justify-center mt-2 relative">
                                    {!recording && (
                                      <div className="flex flex-col justify-center items-center my-2 w-full">
                                        <img
                                          src="/img/face.png"
                                          className="h-48 mt-2 mb-2"
                                        />
                                      </div>
                                    )}
                                    {recording ? (
                                      <p>
                                        Recording... {countdown} seconds left
                                      </p>
                                    ) : (
                                      <p className="text-lg mt-2">
                                        Position Your Face In The Designated
                                        Area
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {!showCamera && (
                        <div className="grid grid-cols-1">
                          <div className="flex justify-center items-baseline">
                            <video
                              ref={videoRef}
                              src={recordedVideoUrl}
                              controls
                              className={
                                windowWidth > 3200
                                  ? "w-1/2"
                                  : windowWidth > 2400
                                  ? "w-7/10"
                                  : windowWidth > 2100
                                  ? "w-4/5"
                                  : windowWidth > 1900
                                  ? "w-5/6"
                                  : windowWidth > 1680
                                  ? "w-9/10"
                                  : "w-full"
                              }
                              style={{ filter: "blur(5px)" }}
                            />
                            <div className="flex flex-row justify-between items-center mb-4">
                              {!submited && (
                                <div className="flex justify-center items-center mt-4">
                                 
                                </div>
                              )}
                            </div>
                            {!submited && (
                              <div className="flex justify-center items-center mt-4 w-full"></div>
                            )}
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
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {showCamera && (
                        <>
                          {videoUrl !== null ? (
                            <>
                              {!submited && (
                                <button
                                  style={{ margin: "0px 10px" }}
                                  variant="primary"
                                  onClick={() => {
                                    handleReRecord();
                                  }}
                                >
                                  Re-Record
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {showStopButton && (
                                <button
                                  style={{ margin: "0px 10px" }}
                                  variant="secondary"
                                  className="mt-3"
                                  onClick={() => {
                                    stopRecording();
                                  }}
                                >
                                  Stop Recording
                                </button>
                              )}

                              {recording ? (
                                <></>
                              ) : (
                                // <p>Recording...</p>
                                <>
                                  <button
                                    variant="success"
                                    className="btn btn-success btn-success-custom"
                                    style={{
                                      margin: "0px 10px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    onClick={() => {
                                      handleStartRecording();
                                    }}
                                  >
                                    <BsFillRecordFill
                                      color="red"
                                      size="15px"
                                      style={{ marginRight: "5px" }}
                                    />
                                    Start Recording
                                  </button>
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
                              <button
                                style={{ margin: "0px 10px" }}
                                variant="primary"
                                className="btn btn-danger"
                                onClick={() => {
                                  handleReRecord();
                                }}
                              >
                                Re-Record
                              </button>
                            )}
                          </>
                        )}
                      </>
                      {videoUrl !== null && (
                        <>
                          <button
                            style={{ margin: "0px 10px" }}
                            variant="primary"
                            className="btn btn-danger"
                            onClick={() => {
                              handleReRecord();
                            }}
                          >
                            Re-Record
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
