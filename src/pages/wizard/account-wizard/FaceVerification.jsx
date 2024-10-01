import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/button/Button";
import { useTheme } from "../../../contexts/themeContext";
import {
  FaceVerificationApi,
  getDataSignedUrl,
  getSingleAccountDetailByIdAPI,
} from "../../../api/userApi";
import axios from "axios";
import CameraCapture from "../../../components/camera/captureImage";

function FaceVerification(props) {
  const { theme } = useTheme();
  const [isLoader, setIsLoader] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [capturedMediaStream, setCapturedMediaStream] = useState(null);
  const [imageCapturedData, setImageCapturedData] = useState({});
  const [face, setFace] = useState(null);
  const [identification, setIdentification] = useState(null);

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  });
  const [imageDataOne, setImageDataOne] = useState(null);
  const [faceSnapDataConfiguration, setFaceSnapDataConfiguration] = useState(
    props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
      ?.identity[
      props?.dataOfAccountSetup?.isIndividual ? "indivisual" : "corporate"
    ]?.provider?.verify?.face
  );
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const identity_id =
    props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
      ?.identity_id || null;
  const [assistanceData, setAssistanceData] = useState(
    identity_id
      ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
          ?.identities[identity_id]?.faceVerification
      : null
  );
  const [faceKey, setFaceKey] = useState(
    props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
      ?.identity[
      props?.dataOfAccountSetup?.isIndividual ? "indivisual" : "corporate"
    ]?.provider?.verify?.face?.steps[0]?.key
  );
  const [isAssistance, setIsAssistance] = useState(
    identity_id
      ? !!props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
          ?.identities[identity_id]?.faceVerification?.assistance
      : null
  );
  const [shareHolderID, setShareHolderID] = useState(null);
  const [show, setShow] = useState(false);
  const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
    error: false,
    message: "",
  });
  const [apiResponse, setApiResponse] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChangeLocation = (data) => {
    setLocationData(data);
  };
  const handleImageCaptureOne = (data) => {
    if (data?.faceSnapkey === "img1_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img1_base64: imageCapturedData["img1_base64"],
      });
    } else {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img2_base64: imageCapturedData["img2_base64"],
      });
    }

    setImageDataOne(data?.capturedImageData);
    console.log(data, "data handleImageCaptureOne");
    imageCapturedData[data?.faceSnapkey] = data?.capturedImageData;
    setImageCapturedData(imageCapturedData);
    console.log(imageCapturedData, "imageCapturedData");

    if (faceSnapDataConfiguration?.steps[data?.index + 1]) {
      setFaceKey(faceSnapDataConfiguration?.steps[data?.index + 1]?.key);
      if (
        data?.faceSnapkey === "img1_base64" &&
        imageCapturedData["img2_base64"]
      ) {
        props.submitFaceVerification(true);
      }
    } else {
      if (
        imageCapturedData["img1_base64"] &&
        imageCapturedData["img2_base64"]
      ) {
        props.submitFaceVerification(true);
        setShowSubmit(true);
      }
    }
    console.log(data, "data");
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setIsLocationEnabled(false);
        }
      );
    }
  };
  useEffect(() => {
    captureLocation();
  }, []);
  let shareholder_id = props?.dataOfAccountSetup?.accountData?.attach_identities
    ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.id
    : null;

  useEffect(() => {
    renderImages();
  }, [apiResponse]);

  useEffect(() => {
    handleGetAccountDetail();
  }, []);
  useEffect(() => {
    console.log("locationDatalocationData", locationData);
  }, [locationData]);

  useEffect(() => {
    props?.isHandleAssistanceData(
      props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
        ?.identities
        ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[
            identity_id
          ]?.faceVerification?.hasOwnProperty("assistance")
          ? true
          : false
        : false
    );
  }, []);
  useEffect(() => {
    console.log("vvvface", face);
    console.log("vvvface faceSnapDataConfiguration", faceSnapDataConfiguration);
  }, [face, faceSnapDataConfiguration]);
  useEffect(() => {
    if (face && identification) {
      props?.faceVerificationCompleted(true, false);
      props?.handleSetFaceImages({
        img2_base64: face,
        img1_base64: identification,
      });
    }
  }, [face, identification]);

  useEffect(() => {
    if (props.handleCallAPIForFaceVerficationData) {
      console.log(imageCapturedData, "imageCapturedData");
      // return;
      if (
        imageCapturedData["img1_base64"] &&
        imageCapturedData["img2_base64"]
      ) {
        submitFaceVerification();
      } else {
        props?.faceVerificationCompleted(true, true);
      }
      props.handleCallAPIForFaceVerficationDataUpdateFalse();
    }
  }, [props.handleCallAPIForFaceVerficationData]);

  const handleProceedClick = () => {
    setIsCameraActive(true);
  };

  const submitFaceVerification = async () => {
    props?.handleApiResponseFace(false);
    setIsLoader(true);
  
    if (capturedMediaStream) {
      capturedMediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  
    const modifiedImageCapturedData = { ...imageCapturedData };
  
    if (!modifiedImageCapturedData.img1_base64 || !modifiedImageCapturedData.img2_base64) {
      console.error("Image capture data is missing!");
      setIsLoader(false);
      setIsFaceSnapsUploaded({
        error: true,
        message: "Please capture both images before proceeding.",
      });
      return;
    }
  
    modifiedImageCapturedData.img1_base64 = modifiedImageCapturedData.img1_base64.startsWith("data:")
      ? modifiedImageCapturedData.img1_base64.split(",")[1]
      : modifiedImageCapturedData.img1_base64;
  
    modifiedImageCapturedData.img2_base64 = modifiedImageCapturedData.img2_base64.startsWith("data:")
      ? modifiedImageCapturedData.img2_base64.split(",")[1]
      : modifiedImageCapturedData.img2_base64;
  
    modifiedImageCapturedData.location = locationData;
  
    if (locationData?.latitude === null) {
      setIsLocationEnabled(false);
    } else {
      setIsLocationEnabled(true);
    }
  
    try {
      const response = await FaceVerificationApi(
        modifiedImageCapturedData,
        identity_id,
        shareHolderID,
        cancelTokenSource.token
      );
      setIsLoader(false);
  
      if (response.success) {
        props?.handleApiResponseFace(true);
        setAssistanceData(response.data?.faceVerification);
        setIsAssistance(response.data?.faceVerification?.hasOwnProperty("assistance"));
        if (response.data?.faceVerification?.hasOwnProperty("assistance")) {
          props?.handleAssistanceData(true);
          handleShow(true);
        } else {
          handleShow(false);
          props?.advanceSection();
          props?.faceVerificationCompleted(true);
        }
        setApiResponse(response.data?.faceVerification);
        setIsFaceSnapsUploaded({ error: false, message: "" });
      } else {
        setIsFaceSnapsUploaded({
          error: true,
          message: `${response?.user_message} Please capture the images again.`,
        });
        props?.handleApiResponseFace(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setIsLoader(false);
    }
  };

  const resetData = (faceSnapkey = null) => {
    if (faceSnapkey === "img1_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img1_base64: null,
      });
    } else if (faceSnapkey === "img2_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img2_base64: null,
      });
    } else {
      props?.handleSetFaceImages({
        img1_base64: null,
        img2_base64: null,
      });
    }
  };
  const cameraClose = (stream, videoRef) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log("Stopping camera track", track);
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  const handleGetAccountDetail = async () => {
    setIsLoader(true);
    const response = await getSingleAccountDetailByIdAPI(
      props?.dataOfAccountSetup?.account_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      console.log(
        response?.data?.account_detail?.attach_identities[0]?.id,
        "response?.data?.account_detail?.attach_identities[0]?.id"
      );
      setShareHolderID(
        response?.data?.account_detail?.attach_identities[0]?.id
      );
      shareholder_id = response?.data?.account_detail?.attach_identities[0]?.id;
      if (response?.data?.account_detail?.attach_identities) {
        if (response?.data?.account_detail?.attach_identities.length > 0) {
          if (response?.data?.account_detail?.attach_identities) {
            if (
              response?.data?.account_detail?.attach_identities[0]?.meta
                ?.identities
            ) {
              if (
                response?.data?.account_detail?.attach_identities[0]?.meta
                  ?.identities[props?.dataOfAccountSetup?.identity_id]
              ) {
                if (
                  response?.data?.account_detail?.attach_identities[0]?.meta
                    ?.identities[props?.dataOfAccountSetup?.identity_id]
                    ?.faceVerification
                ) {
                  setApiResponse(
                    response?.data?.account_detail?.attach_identities[0]?.meta
                      ?.identities[props?.dataOfAccountSetup?.identity_id]
                      ?.faceVerification
                  );
                }
              }
            }
          }
        }
      }
    }
  };

  const renderImages = async () => {
    if (apiResponse?.images?.face) {
      setIsLoader(true);
      const dataToSend = {
        key: apiResponse?.images?.face,
      };
      const response = await getDataSignedUrl(
        dataToSend,
        cancelTokenSource.token
      );
      setIsLoader(false);
      if (response.success == true) {
        console.log(response?.data, "response?.data");
        setFace(response?.data);
      } else {
        console.log(response, "error");
      }
    }
    if (apiResponse?.images?.identification) {
      setIsLoader(true);
      const dataToSend = {
        key: apiResponse?.images?.identification,
      };
      const response = await getDataSignedUrl(
        dataToSend,
        cancelTokenSource.token
      );
      setIsLoader(false);
      if (response.success == true) {
        console.log(response?.data, "response?.data");
        setIdentification(response?.data);
      } else {
        console.log(response, "error");
      }
    }
  };

  return (
    <>
      <div className={`mt-2 border-b-4 border-color-${theme} px-2`}>
        <h1 className="text-xl lg:text-2xl mb-2">Liveliness Test</h1>
        <p className="text-sm lg:text-md mb-6 mt-4 uppercase">
          To meet the regulatory KYC and AML/CFT requirements, this step helps
          us to ensure that you are who you say you are.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
        <div
          className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
        >
          <h2
            className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
          >
            Face Snap
          </h2>

          <p className="text-center text-sm lg:text-lg mt-10 uppercase">
            Position your face within the designated area.
          </p>

          {isCameraActive ? (
            <CameraCapture
              handleChangeLocation={handleChangeLocation}
              onImageCapture={handleImageCaptureOne}
              cameraCloseBrowser={cameraClose}
              resetData={resetData}
              isFaceSnapsUploaded={isFaceSnapsUploaded}
              handleSetFaceImages={
                props?.handleSetFaceImages
              }
              faceImages={props?.faceImages}
              dataOfAccountSetup={
                props?.dataOfAccountSetup
              }
              faceSnapKey={faceKey}
            />
          ) : (
            <>
              {" "}
              <div className="flex justify-center items-center mb-4 mt-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Button
                text="Proceed"
                className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
                onClick={handleProceedClick}
              />
            </>
          )}
        </div>
        <div
          className={`bg-color-stepper-card-${theme}  p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}
        >
          <h2 className="text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase">
            National ID / Passport with Photo
          </h2>
          <p className="text-center text-sm lg:text-lg mt-10 uppercase">
            Position the front of your National ID / Passport within the frame.
          </p>
          {isCameraActive ? (
            <CameraCapture
            handleChangeLocation={handleChangeLocation}
            onImageCapture={handleImageCaptureOne}
            cameraCloseBrowser={cameraClose}
            resetData={resetData}
            isFaceSnapsUploaded={isFaceSnapsUploaded}
            handleSetFaceImages={
              props?.handleSetFaceImages
            }
            faceImages={props?.faceImages}
            dataOfAccountSetup={
              props?.dataOfAccountSetup
            }
            faceSnapKey={faceKey}


            />
          ) : (
            <>
              <div className="flex justify-center items-center mb-4 mt-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a6 6 0 016-6h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8zm12 7a1 1 0 112 0v2a1 1 0 11-2 0v-2zm-1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Button
                text="Proceed"
                className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
                onClick={handleProceedClick}
              />
            </>
          )}
        </div>
      </div>
      <Button
        text="API Hitting"
        className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
        onClick={submitFaceVerification}
      />
    </>
  );
}

export default FaceVerification;




// import {
//   Button,
//   Col,
//   Container,
//   Row,
//   Card,
//   Alert,
//   Modal,
// } from 'react-bootstrap';
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaceVerificationApi,
//   getDataSignedUrl,
//   getSingleAccountDetailByIdAPI,
// } from '../../../api/userApi';
// import CameraCapture from '../../../components/camera/captureImage';
// // import Loader from '../../../../widgets/bootstrap-component/Spinner';
// import Loader from "../../../components/ui/loader";

// // import SpinnerWithBackDrop from '../../../../widgets/bootstrap-component/SpinnerWithBackDrop';

// // import Stepper from 'react-stepper-horizontal';
// import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
// // import CustomAlert from '../../../../widgets/bootstrap-component/Alert';

// export default function FaceVerification(props) {
//   console.log(props, 'props');
//   console.log(props?.dataOfAccountSetup, 'props?.dataOfAccountSetup');
//   const identity_id = props?.dataOfAccountSetup?.identity_id;

//   const cancelTokenSource = axios.CancelToken.source();
//   const [capturedMediaStream, setCapturedMediaStream] = useState(null);
//   const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
//     error: false,
//     message: '',
//   });

//   const [imageDataOne, setImageDataOne] = useState(null);
//   const [imageCapturedData, setImageCapturedData] = useState({});
//   const [assistanceData, setAssistanceData] = useState(
//     props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
//       ?.identities
//       ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
//           ?.identities[identity_id]?.faceVerification
//       : null,
//   );
//   const [isAssistance, setIsAssistance] = useState(
//     props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
//       ?.identities
//       ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[
//           identity_id
//         ]?.faceVerification?.hasOwnProperty('assistance')
//         ? true
//         : false
//       : null,
//   );
//   const [imageDataTwo, setImageDataTwo] = useState(null);
//   const [apiResponse, setApiResponse] = useState(null);
//   const [isLoader, setIsLoader] = useState(false);
//   const [face, setFace] = useState(null);
//   const [isImageCompleted, setIsImageCompleted] = useState(false);
//   const [identification, setIdentification] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const [currentSection, setCurrentSection] = useState(0);
//   const [faceSnapDataConfiguration, setFaceSnapDataConfiguration] = useState(
//     props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
//       ?.identity[
//       props?.dataOfAccountSetup?.isIndividual ? 'indivisual' : 'corporate'
//     ]?.provider?.verify?.face,
//   );
//   const [faceKey, setFaceKey] = useState(
//     props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
//       ?.identity[
//       props?.dataOfAccountSetup?.isIndividual ? 'indivisual' : 'corporate'
//     ]?.provider?.verify?.face?.steps[0]?.key,
//   );
//   const [proceed, setProceed] = useState(false);
//   const [showSubmit, setShowSubmit] = useState(false);
//   const [shareHolderID, setShareHolderID] = useState(null);
//   const [steps, setSteps] = useState([
//     { title: 'Step 1' },
//     { title: 'Step 2' },
//   ]);
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const [locationData, setLocationData] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [isLocationEnabled, setIsLocationEnabled] = useState(true);
//   const [alertProps, setAlertProps] = useState({
//     variant: '',
//     message: '',
//     show: false,
//     hideAuto: false,
//   });

//   const fund_id = props?.dataOfAccountSetup?.fund_id;
//   const account_id = props?.dataOfAccountSetup?.account_id;

//   let shareholder_id = props?.dataOfAccountSetup?.accountData?.attach_identities
//     ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.id
//     : null;

//   useEffect(() => {
//     renderImages();
//   }, [apiResponse]);

//   useEffect(() => {
//     console.log('locationDatalocationData', locationData);
//   }, [locationData]);

//   useEffect(() => {
//     props?.isHandleAssistanceData(
//       props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
//         ?.identities
//         ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[
//             identity_id
//           ]?.faceVerification?.hasOwnProperty('assistance')
//           ? true
//           : false
//         : false,
//     );
//   }, []);
//   useEffect(() => {
//     console.log('vvvface', face);
//     console.log('vvvface faceSnapDataConfiguration', faceSnapDataConfiguration);
//   }, [face, faceSnapDataConfiguration]);
//   useEffect(() => {
//     if (face && identification) {
//       props?.faceVerificationCompleted(true, false);
//       props?.handleSetFaceImages({
//         img2_base64: face,
//         img1_base64: identification,
//       });
//     }
//   }, [face, identification]);
//   useEffect(() => {
//     if (props.handleCallAPIForFaceVerficationData) {
//       console.log(imageCapturedData, 'imageCapturedData');
//       // return;
//       if (
//         imageCapturedData['img1_base64'] &&
//         imageCapturedData['img2_base64']
//       ) {
//         submitFaceVerfication();
//       } else {
//         props?.faceVerificationCompleted(true, true);
//       }
//       props.handleCallAPIForFaceVerficationDataUpdateFalse();
//     }
//   }, [props.handleCallAPIForFaceVerficationData]);
//   useEffect(() => {
//     handleGetAccountDetail();
//   }, []);
//   useEffect(() => {
//     console.log('imageCapturedData', imageCapturedData);

//     if (imageCapturedData['img1_base64'] && imageCapturedData['img2_base64']) {
//       props?.handleSetFaceImages({
//         img2_base64: imageCapturedData['img1_base64'],
//         img1_base64: imageCapturedData['img2_base64'],
//       });
//     }
//   }, [imageCapturedData]);

//   const handleChangeLocation = (data) => {
//     setLocationData(data);
//   };
//   const handleGetAccountDetail = async () => {
//     setIsLoader(true);
//     const response = await getSingleAccountDetailByIdAPI(
//       props?.dataOfAccountSetup?.account_id,
//       cancelTokenSource.token,
//     );
//     setIsLoader(false);
//     if (response.success == true) {
//       console.log(
//         response?.data?.account_detail?.attach_identities[0]?.id,
//         'response?.data?.account_detail?.attach_identities[0]?.id',
//       );
//       setShareHolderID(
//         response?.data?.account_detail?.attach_identities[0]?.id,
//       );
//       shareholder_id = response?.data?.account_detail?.attach_identities[0]?.id;
//       if (response?.data?.account_detail?.attach_identities) {
//         if (response?.data?.account_detail?.attach_identities.length > 0) {
//           if (response?.data?.account_detail?.attach_identities) {
//             if (
//               response?.data?.account_detail?.attach_identities[0]?.meta
//                 ?.identities
//             ) {
//               if (
//                 response?.data?.account_detail?.attach_identities[0]?.meta
//                   ?.identities[props?.dataOfAccountSetup?.identity_id]
//               ) {
//                 if (
//                   response?.data?.account_detail?.attach_identities[0]?.meta
//                     ?.identities[props?.dataOfAccountSetup?.identity_id]
//                     ?.faceVerification
//                 ) {
//                   setApiResponse(
//                     response?.data?.account_detail?.attach_identities[0]?.meta
//                       ?.identities[props?.dataOfAccountSetup?.identity_id]
//                       ?.faceVerification,
//                   );
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   };


//   console.log(
//     props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
//       ?.identity[
//       props?.dataOfAccountSetup?.isIndividual ? 'indivisual' : 'corporate'
//     ]?.provider?.verify?.face,
//     'dataOfAccountSetup faceverification',
//   );

//   console.log(shareHolderID, 'shareHolderID');
//   const handleImageCaptureOne = (data) => {
//     if (data?.faceSnapkey === 'img1_base64') {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img1_base64: imageCapturedData['img1_base64'],
//       });
//     } else {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img2_base64: imageCapturedData['img2_base64'],
//       });
//     }

//     setImageDataOne(data?.capturedImageData);
//     console.log(data, 'data handleImageCaptureOne');
//     imageCapturedData[data?.faceSnapkey] = data?.capturedImageData;
//     setImageCapturedData(imageCapturedData);
//     console.log(imageCapturedData, 'imageCapturedData');

//     if (faceSnapDataConfiguration?.steps[data?.index + 1]) {
//       setFaceKey(faceSnapDataConfiguration?.steps[data?.index + 1]?.key);
//       if (
//         data?.faceSnapkey === 'img1_base64' &&
//         imageCapturedData['img2_base64']
//       ) {
//         props.submitFaceVerification(true);
//       }
//     } else {
//       if (
//         imageCapturedData['img1_base64'] &&
//         imageCapturedData['img2_base64']
//       ) {
//         props.submitFaceVerification(true);
//         setShowSubmit(true);
//       }
//     }
//     console.log(data, 'data');
//   };
//   const handleImageCaptureTwo = (data) => {
//     setImageDataTwo(data);
//     console.log(data, 'data');
//   };
//   const confirmatioinModal = (
//     <Modal
//       size="md"
//       show={show}
//       onHide={handleClose}
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       {' '}
//       <Modal.Header closeButton>
//         <Modal.Title>Face Verification Analysis</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//           }}
//         >
//           <div style={{ marginBottom: '2rem' }}>
//             <small
//               className="fund_info_small"
//               style={{ fontSize: '1.0625rem', color: 'white' }}
//             >
//               <span
//                 className={
//                   assistanceData?.assistance?.match
//                     ? 'text-success'
//                     : 'text-danger'
//                 }
//               >
//                 <FeatherIcon
//                   className={
//                     assistanceData?.assistance?.match
//                       ? 'text-success'
//                       : 'text-danger'
//                   }
//                   icon="check-circle"
//                   color={assistanceData?.assistance?.match ? 'green' : 'red'}
//                   size="20"
//                 />
//               </span>{' '}
//               Status: 
//               <span
//                 style={{
//                   color: assistanceData?.assistance?.match ? 'green' : 'red',
//                 }}
//               >
//                 {assistanceData?.assistance?.match ? 'Matched' : 'Not Matched'}
//               </span>
//             </small>
//           </div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </div>
//       </Modal.Footer>
//     </Modal>
//   );
//   const handleClickConfirmatioinNext = () => {
//     props?.faceVerificationCompleted(true, true);
//     setIsImageCompleted(true);
//   };

//   const cameraClose = (stream, videoRef) => {
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         console.log('Stopping camera track', track);
//         track.stop();
//       });
//     }

//     if (videoRef.current) {
//       videoRef.current.srcObject = null; 
//     }
//   };


//   const submitFaceVerfication = async () => {
//     props?.handleApiResponseFace(false);
//     setIsLoader(true);
    
//     if (capturedMediaStream) {
//       capturedMediaStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//     }
//     console.log(imageCapturedData, 'dataToSend');
//     const modifiedImageCapturedData = { ...imageCapturedData };

//     modifiedImageCapturedData.img1_base64 =
//       modifiedImageCapturedData.img1_base64.split('data:image/png;base64,')[1];
//     modifiedImageCapturedData.img2_base64 =
//       modifiedImageCapturedData.img2_base64.split('data:image/png;base64,')[1];
//     modifiedImageCapturedData.location = locationData;

//     console.log('modifiedImageCapturedData', modifiedImageCapturedData);
//     if (locationData?.latitude === null) {
//       setIsLocationEnabled(false);
//     } else {
//       setIsLocationEnabled(true);
//     }

//     const response = await FaceVerificationApi(
//       modifiedImageCapturedData,
//       cancelTokenSource.token,
//       identity_id,
//       shareHolderID,
//     );
//     setIsLoader(false);
//     if (response.success == true) {
//       props?.handleApiResponseFace(true);

//       setAssistanceData(response.data?.faceVerification);
//       setIsAssistance(
//         response.data?.faceVerification?.hasOwnProperty('assistance')
//           ? true
//           : false,
//       );

//       if (response.data?.faceVerification?.hasOwnProperty('assistance')) {
//         props?.handleAssistanceData(true);
//         handleShow(true);
//         props?.isHandleAssistanceData(true);
//       } else {
//         handleShow(false);
//         props?.isHandleAssistanceData(false);
//         props?.advanceSection();
//         props?.faceVerificationCompleted(true);
//       }

//       console.log(
//         response.data?.faceVerification,
//         'response.data?.faceVerification',
//       );
//       setApiResponse(response.data?.faceVerification);
//       setIsFaceSnapsUploaded({ error: false, message: '' });
//     } else {
//       console.log(response, 'error');
//       setIsFaceSnapsUploaded({
//         error: true,
//         message: `${response?.user_message} Please again capture the images`,
//       });
//       props?.handleApiResponseFace(false);
//       setAlertProps({
//         variant: 'danger',
//         message: ` Please again capture the images`,
//         show: true,
//         hideAuto: true,
//       });
//     }
//   };
//   const renderImages = async () => {
//     if (apiResponse?.images?.face) {
//       setIsLoader(true);
//       const dataToSend = {
//         key: apiResponse?.images?.face,
//       };
//       const response = await getDataSignedUrl(
//         dataToSend,
//         cancelTokenSource.token,
//       );
//       setIsLoader(false);
//       if (response.success == true) {
//         console.log(response?.data, 'response?.data');
//         setFace(response?.data);
//       } else {
//         console.log(response, 'error');
//       }
//     }
//     if (apiResponse?.images?.identification) {
//       setIsLoader(true);
//       const dataToSend = {
//         key: apiResponse?.images?.identification,
//       };
//       const response = await getDataSignedUrl(
//         dataToSend,
//         cancelTokenSource.token,
//       );
//       setIsLoader(false);
//       if (response.success == true) {
//         console.log(response?.data, 'response?.data');
//         setIdentification(response?.data);
//       } else {
//         console.log(response, 'error');
//       }
//     }
//   };

//   const handleProceedClick = (key) => {
//     setFaceKey(key);
//     imageCapturedData[key] = {};
//     console.log(imageCapturedData, 'imageCapturedData');
//     setImageCapturedData(imageCapturedData);
//     setProceed(true);
//   };
//   const resetData = (faceSnapkey = null) => {
//     setFace(null);
//     setIdentification(null);
//     props.submitFaceVerification(false);
//     props?.handleAssistanceData(false);

//     if (faceSnapkey === 'img1_base64') {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img1_base64: null,
//       });
//     } else if (faceSnapkey === 'img2_base64') {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img2_base64: null,
//       });
//     } else {
//       props?.handleSetFaceImages({
//         img1_base64: null,
//         img2_base64: null,
//       });
//     }

//   };

//   return (
//     /**
//      * Renders the Face Verification component.
//      * @param {Object} props - The props object containing data for account setup.
//      * @returns {JSX.Element} - The JSX element representing the Face Verification component.
//      */
//     <div className="main-content">
//       {console.log(face, 'face face face face')}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           marginBottom: '25px',
//           borderBottom: '6px solid #1e3c5c',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           margin: '0px 20px',
//         }}
//       >
//         <div>
//           <h1>Liveliness Test</h1>
//           <div>
//             {faceSnapDataConfiguration?.instructions.indexOf('</') !== -1 ? (
//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: faceSnapDataConfiguration?.instructions.replace(
//                     /(<? *script)/gi,
//                     'illegalscript',
//                   ),
//                 }}
//               ></div>
//             ) : (
//               faceSnapDataConfiguration?.instructions
//             )}
//           </div>
//         </div>
        
//         {face && (
//           <div>
//             <button className="btn btn-danger" onClick={resetData}>
//               Retake
//             </button>
//           </div>
//         )}
//       </div>
//       <Card className="remove-card-border">
//         <Card.Body style={{ marginTop: '20px' }}>
//           <Row className="justify-content-center">
//             <Col xs={12} lg={12} xl={12}>
//               {isImageCompleted && (
//                 <div>
//                   <Alert
//                     closeLabel
//                     dismissible={true}
//                     key="success"
//                     variant="success"
//                     onClose={() => setIsImageCompleted(null)}
//                   >
//                     Liveliness Submitted. Please proceed to the next step to
//                     complete the application.
//                   </Alert>
//                 </div>
//               )}
//               {!isLocationEnabled && locationData?.latitude === null && (
//                 <div>
//                   <Alert
//                     closeLabel
//                     dismissible={true}
//                     key="danger"
//                     variant="danger"
//                     onClose={() => setIsLocationEnabled(true)}
//                   >
//                     To Capture The Longitude And Latitude, Please Enable
//                     Location Services In Both Your Browser And System Settings.
//                   </Alert>
//                 </div>
//               )}
//               {isLoader ? (
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     height: '20rem',
//                   }}
//                 >
//                   <Loader
//                     animation="grow"
//                     custom={true}
//                     height="70vh"
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <Row className="justify-content-center">
//                     {faceSnapDataConfiguration?.steps &&
//                       faceSnapDataConfiguration?.steps.map((item, index) => (
//                         <Col
//                           xs={12}
//                           lg={5}
//                           xl={5}
//                           style={{
//                             opacity:
//                               faceKey == item?.key ||
//                               imageCapturedData[item?.key] ||
//                               face
//                                 ? 1
//                                 : '0.5',
//                           }}
//                         >
//                           {console.log(
//                             imageCapturedData[item?.key] ? 'true' : 'false',
//                             'imageCapturedData[item?.key]',
//                           )}
//                           <Card style={{ height: '560px' }}>
//                             <Card.Body>
//                               <Card.Header>
//                                 <div className="d-flex flex-row justify-content-center">
//                                   <h3>{item?.title}</h3>
//                                 </div>
//                               </Card.Header>
//                               {props?.dataOfAccountSetup?.fund_data
//                                 ?.fund_setting?.account?.applicant?.identity
//                                 ?.indivisual?.provider?.verify?.face
//                                 ?.isBlured && (
//                                 <h5 className="text-center mb-3 mt-3">
//                                   For Personal Privacy Purpose The Captured
//                                   Images Will Be Blurred.
//                                 </h5>
//                               )}
//                               {face ? (
//                                 <div className="d-flex flex-row justify-content-center">
//                                   {console.log(
//                                     'talha',
//                                     props?.dataOfAccountSetup?.fund_data
//                                       ?.fund_setting?.account?.applicant
//                                       ?.identity[
//                                       props?.dataOfAccountSetup?.isIndividual
//                                         ? 'individual'
//                                         : 'corporate'
//                                     ]?.provider?.verify?.face?.isBlured,
//                                   )}
//                                   <img
//                                     style={{
//                                       height: '420px',
//                                       maxWidth: '410px',
//                                       filter: props?.dataOfAccountSetup
//                                         ?.fund_data?.fund_setting?.account
//                                         ?.applicant?.identity?.indivisual
//                                         ?.provider?.verify?.face?.isBlured
//                                         ? 'blur(8px)'
//                                         : '',
//                                     }}
//                                     src={index === 0 ? identification : face}
//                                     alt="capturedImage"
//                                   />
//                                 </div>
//                               ) : 
//                               (!proceed || faceKey != item?.key) &&
//                                 !imageCapturedData[item?.key] ? (
//                                 <div
//                                   className="d-flex justify-content-center"
//                                   style={{
//                                     flexDirection: 'column',
//                                     alignItems: 'center',
//                                   }}
//                                 >
//                                   {item?.isIdCard ? (
//                                     <img
//                                       src={'/img/idcardscanner.png'}
//                                       style={{
//                                         height: '280px',
//                                         paddingTop: '45px',
//                                         paddingBottom: '45px',
//                                       }}
//                                     />
//                                   ) : (
//                                     <img
//                                       src={'/img/face.png'}
//                                       style={{
//                                         height: '280px',
//                                         paddingTop: '45px',
//                                         paddingBottom: '45px',
//                                       }}
//                                     />
//                                   )}

//                                   {item?.instructions.indexOf('</') !== -1 ? (
//                                     <div
//                                       style={{
//                                         fontSize: '20px',
//                                         textAlign: 'center',
//                                       }}
//                                       dangerouslySetInnerHTML={{
//                                         __html: item?.instructions.replace(
//                                           /(<? *script)/gi,
//                                           'illegalscript',
//                                         ),
//                                       }}
//                                     ></div>
//                                   ) : (
//                                     <div
//                                       style={{
//                                         fontSize: '20px',
//                                         textAlign: 'center',
//                                       }}
//                                     >
//                                       {item?.instructions
//                                         ?.split(' ')
//                                         .map(
//                                           (word) =>
//                                             word.charAt(0).toUpperCase() +
//                                             word.slice(1).toLowerCase(),
//                                         )
//                                         .join(' ')}
//                                     </div>
//                                   )}
//                                   <button
//                                     disabled={faceKey != item?.key}
//                                     className="btn btn-danger mt-4"
//                                     onClick={() => {
//                                       handleProceedClick(item?.key);
//                                     }}
//                                   >
//                                     Proceed
//                                   </button>
//                                 </div>
//                               ) : (
//                                 ((proceed && faceKey == item?.key) ||
//                                   imageCapturedData[item?.key]) && (
//                                   <div
//                                     className="d-flex justify-content-center"
//                                     style={{
//                                       flexDirection: 'column',
//                                       alignItems: 'center',
//                                     }}
//                                   >
//                                     <CameraCapture
//                                       handleChangeLocation={
//                                         handleChangeLocation
//                                       }
//                                       onImageCapture={handleImageCaptureOne}
//                                       handleSetFaceImages={
//                                         props?.handleSetFaceImages
//                                       }
//                                       faceImages={props?.faceImages}
//                                       faceSnapkey={item?.key}
//                                       index={index}
//                                       isIdCard={item?.isIdCard}
//                                       resetData={resetData}
//                                       cameraCloseBrowser={cameraClose}
//                                       dataOfAccountSetup={
//                                         props?.dataOfAccountSetup
//                                       }
//                                     />
//                                   </div>
//                                 )
//                               )}
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       ))}
//                     {console.log('vvvface 1', face)}
//                     {face &&
//                       faceSnapDataConfiguration?.integration?.enabled &&
//                       isAssistance && (
//                         <Row
//                           style={{ width: '82%' }}
//                           className="justify-content-center"
//                         >
//                           <Card>
//                             <Card.Body>
//                               <Row>
//                                 <Col xs={6} lg={4} xl={4} className="d-flex">
//                                   <div
//                                     className="d-flex"
//                                     style={{ alignItems: 'center' }}
//                                   >
//                                     <span
//                                       className="fund-name-box"
//                                       style={{ fontSize: '1.0625rem;' }}
//                                     >
//                                       Result
//                                     </span>
//                                   </div>
//                                 </Col>
//                                 <Col xs={6} lg={4} xl={4}>
//                                   <>
//                                     <div>
//                                       <small
//                                         className="fund_info_small"
//                                         style={{
//                                           fontSize: '1.0625rem;',
//                                           color: 'white',
//                                         }}
//                                       >
//                                         <span
//                                           className={
//                                             assistanceData?.assistance?.match
//                                               ? 'text-success'
//                                               : 'text-danger'
//                                           }
//                                         >
//                                           <FeatherIcon
//                                             className={
//                                               assistanceData?.assistance?.match
//                                                 ? 'text-success'
//                                                 : 'text-danger'
//                                             }
//                                             icon="check-circle"
//                                             color={
//                                               assistanceData?.assistance?.match
//                                                 ? 'green'
//                                                 : 'red'
//                                             }
//                                             size="20"
//                                           />
//                                         </span>{' '}
//                                         Status: {/* Added space after colon */}
//                                         <span
//                                           style={{
//                                             color: assistanceData?.assistance
//                                               ?.match
//                                               ? 'green'
//                                               : 'red',
//                                           }}
//                                         >
//                                           {assistanceData?.assistance?.match
//                                             ? 'Matched'
//                                             : 'Not Matched'}
//                                         </span>
//                                       </small>
//                                     </div>
//                                   </>
//                                 </Col>
                                
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Row>
//                       )}
//                   </Row>
//                 </>
//               )}
//             </Col>
//           </Row>

//           {isFaceSnapsUploaded?.error && (
//             <div style={{ display: 'flex', justifyContent: 'center' }}>
//               <Row style={{ width: '82%' }} className="justify-content-center">
//                 <Card>
//                   <Card.Body>
//                     <Row>
//                       <div className="d-flex" style={{ alignItems: 'center' }}>
//                         {/* Increase font size for 'Assistance' */}
//                         <span style={{ fontSize: '15px', color: 'red' }}>
//                           {isFaceSnapsUploaded?.message}
//                         </span>
//                       </div>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Row>
//             </div>
//           )}
         
//           {isAssistance && show && confirmatioinModal}
//         </Card.Body>
//       </Card>
//     </div>
//   );
// }
