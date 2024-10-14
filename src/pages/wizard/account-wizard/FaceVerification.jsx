
//Mine Work
// import React, { useState, useEffect } from "react";
// import Button from "../../../components/ui/button/Button";
// import { useTheme } from "../../../contexts/themeContext";
// import {
//   getDataSignedUrl,
//   getSingleAccountDetailByIdAPI,
//   FaceVerificationApi,
// } from "../../../api/userApi";
// import axios from "axios";
// import Loader from "../../../components/ui/loader";
// import faceimg from "../../../assets/face.png";
// import CameraCapture from "../../../components/camera/captureImage";

// function FaceVerification(props) {
//   const { dataOfAccountSetups } = props;
//   console.log("dataOfAccountSetups4", dataOfAccountSetups);
//   const { theme } = useTheme();
//   const [isLoader, setIsLoader] = useState(false);
//   const [apiResponse, setApiResponse] = useState([]);
//   const [face, setFace] = useState(null);
//   const [identification, setIdentification] = useState(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
//     error: false,
//     message: "",
//   });
//   const [faceKey, setFaceKey] = useState(
//     props?.dataOfAccountSetups?.fund_data?.fund_setting?.account?.applicant
//       ?.identity[
//       props?.dataOfAccountSetup?.isIndividual ? "indivisual" : "corporate"
//     ]?.provider?.verify?.face?.steps[0]?.key
//   );
//   const [assistanceData, setAssistanceData] = useState(
//         identity_id
//           ? props?.dataOfAccountSetups?.accountData?.attach_identities[0]?.meta
//               ?.identities[identity_id]?.faceVerification
//           : null
//       );

//   const [imageDataOne, setImageDataOne] = useState(null);
//     const [isLocationEnabled, setIsLocationEnabled] = useState(true);


//   const cancelTokenSource = axios.CancelToken.source();

//   const handleGetAccountDetail = async () => {
//     setIsLoader(true);
//     try {
//       const response = await getSingleAccountDetailByIdAPI(
//         "e00edd10-4270-4073-8c69-e0d718012999",
//         cancelTokenSource.token
//       );
//       setIsLoader(false);

//       if (response.success === true) {
//         const accountDetails =
//           response?.data?.account_detail?.attach_identities?.[0]?.meta
//             ?.identities?.["53c8a88a-cc42-4da4-958b-71e79df5ad5f"]
//             ?.faceVerification;

//         setApiResponse(accountDetails);
//         console.log("setApiResponse1", accountDetails);
//         console.log("setApiResponsess", apiResponse);
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log("Request canceled:", error.message);
//       } else {
//         console.error("Error fetching account details:", error);
//       }
//       setIsLoader(false);
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
//         cancelTokenSource.token
//       );
//       setIsLoader(false);
//       if (response.success === true) {
//         console.log(response?.data, "response?.data");
//         setFace(faceimg);
//       } else {
//         console.log(response, "error");
//       }
//     }
//     if (apiResponse?.images?.identification) {
//       setIsLoader(true);
//       const dataToSend = {
//         key: apiResponse?.images?.identification,
//       };
//       const response = await getDataSignedUrl(
//         dataToSend,
//         cancelTokenSource.token
//       );
//       setIsLoader(false);
//       if (response.success === true) {
//         console.log(response?.data, "response?.data");
//         setIdentification(faceimg);
//       } else {
//         console.log(response, "error");
//       }
//     }
//   };
//   useEffect(() => {
//     handleGetAccountDetail();
//   }, []);

//   useEffect(() => {
//     renderImages();
//   }, [apiResponse]);

//   const submitFaceVerification = async () => {
//     props?.handleApiResponseFace(false);
//     setIsLoader(true);

//     if (capturedMediaStream) {
//       capturedMediaStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//     }

//     const modifiedImageCapturedData = { ...imageCapturedData };

//     if (
//       !modifiedImageCapturedData.img1_base64 ||
//       !modifiedImageCapturedData.img2_base64
//     ) {
//       console.error("Image capture data is missing!");
//       setIsLoader(false);
//       setIsFaceSnapsUploaded({
//         error: true,
//         message: "Please capture both images before proceeding.",
//       });
//       return;
//     }

//     modifiedImageCapturedData.img1_base64 =
//       modifiedImageCapturedData.img1_base64.startsWith("data:")
//         ? modifiedImageCapturedData.img1_base64.split(",")[1]
//         : modifiedImageCapturedData.img1_base64;

//     modifiedImageCapturedData.img2_base64 =
//       modifiedImageCapturedData.img2_base64.startsWith("data:")
//         ? modifiedImageCapturedData.img2_base64.split(",")[1]
//         : modifiedImageCapturedData.img2_base64;

//     modifiedImageCapturedData.location = locationData;

//     if (locationData?.latitude === null) {
//       setIsLocationEnabled(false);
//     } else {
//       setIsLocationEnabled(true);
//     }

//     try {
//       const response = await FaceVerificationApi(
//         modifiedImageCapturedData,
//         identity_id,
//         shareHolderID,
//         cancelTokenSource.token
//       );
//       setIsLoader(false);

//       if (response.success) {
//         props?.handleApiResponseFace(true);
//         setAssistanceData(response.data?.faceVerification);
//         setIsAssistance(
//           response.data?.faceVerification?.hasOwnProperty("assistance")
//         );
//         if (response.data?.faceVerification?.hasOwnProperty("assistance")) {
//           props?.handleAssistanceData(true);
//           handleShow(true);
//         } else {
//           handleShow(false);
//           props?.advanceSection();
//           props?.faceVerificationCompleted(true);
//         }
//         setApiResponse(response.data?.faceVerification);
//         setIsFaceSnapsUploaded({ error: false, message: "" });
//       } else {
//         setIsFaceSnapsUploaded({
//           error: true,
//           message: `${response?.user_message} Please capture the images again.`,
//         });
//         props?.handleApiResponseFace(false);
//       }
//     } catch (error) {
//       console.error("API error:", error);
//       setIsLoader(false);
//     }
//   };


//   const handleProceedClick = () => {
//     setIsCameraActive(true);
//   };

//   const handleChangeLocation = (data) => {
//     setLocationData(data);
//   };

//   const handleImageCaptureOne = (data) => {
//     if (data?.faceSnapkey === "img1_base64") {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img1_base64: imageCapturedData["img1_base64"],
//       });
//     } else {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img2_base64: imageCapturedData["img2_base64"],
//       });
//     }
//   };

//   setImageDataOne(capturedImageData);
//   console.log("data handleImageCaptureOne");

//   const cameraClose = (stream, videoRef) => {
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         console.log("Stopping camera track", track);
//         track.stop();
//       });
//     }
//   };

//   const resetData = (faceSnapkey = null) => {
//     if (faceSnapkey === "img1_base64") {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img1_base64: null,
//       });
//     } else if (faceSnapkey === "img2_base64") {
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
//   useEffect(() => {
//     if (face && identification) {
//       props?.faceVerificationCompleted(true, false);
//       props?.handleSetFaceImages({
//         img2_base64: face,
//         img1_base64: identification,
//       });
//     }
//   }, [face, identification]);

//   return (
//     <>
//       {isLoader ? (
//         <Loader />
//       ) : (
//         <>
//           <div className={`mt-2 border-b-4 border-color-${theme} px-2`}>
//             <h1 className="text-xl lg:text-2xl mb-2">Liveliness Test</h1>
//             <p className="text-sm lg:text-md mb-6 mt-4 uppercase">
//               To meet the regulatory KYC and AML/CFT requirements, this step
//               helps us to ensure that you are who you say you are.
//             </p>
//           </div>
//           <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
//             <>
//               <div
//                 className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
//               >
//                 <h2
//                   className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
//                 >
//                   Face Verification
//                 </h2>
//                 {face !== null ? (
//                   <img src={face} alt="" className="w-full h-auto rounded-lg" />
//                 ) : isCameraActive ? (
//                   <CameraCapture
//                     handleChangeLocation={handleChangeLocation}
//                     onImageCapture={handleImageCaptureOne}
//                     cameraCloseBrowser={cameraClose}
//                     resetData={resetData}
//                     isFaceSnapsUploaded={isFaceSnapsUploaded}
//                     handleSetFaceImages={props?.handleSetFaceImages}
//                     faceImages={props?.faceImages}
//                     dataOfAccountSetup={dataOfAccountSetups}
//                     faceSnapKey={faceKey}
//                   />
//                 ) : (
//                   <>
//                     <div className="flex flex-col items-center mb-4 mt-20">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-24 w-24 text-sky-500"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <p className="text-center text-sm lg:text-lg mt-10 uppercase">
//                         Position your face within the designated area.
//                       </p>
//                       <Button
//                         text="Proceed"
//                         className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
//                         onClick={handleProceedClick}
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
              // <div
              //   className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
              // >
              //   <h2
              //     className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
              //   >
              //     National ID / Passport with Photo
              //   </h2>
              //   {identification !== null ? (
              //     <img
              //       src={identification}
              //       alt=""
              //       className="w-full h-auto rounded-lg"
              //     />
              //   ) : (
              //     <>
              //       <div className="flex flex-col items-center mb-4 mt-20">
              //         <svg
              //           xmlns="http://www.w3.org/2000/svg"
              //           className="h-24 w-24 text-sky-500"
              //           viewBox="0 0 24 24"
              //           fill="currentColor"
              //         >
              //           <path
              //             fillRule="evenodd"
              //             d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
              //             clipRule="evenodd"
              //           />
              //         </svg>
              //         <p className="text-center text-sm lg:text-lg mt-10 uppercase">
              //           Position your face within the designated area.
              //         </p>
              //         <Button
              //           text="Proceed"
              //           className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
              //           onClick={handleProceedClick}
              //         />
              //       </div>
              //     </>
              //   )}
              // </div>
//             </>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
// export default FaceVerification;



import React, { useState, useEffect, useRef } from "react";
import Button from "../../../components/ui/button/Button";
import { useTheme } from "../../../contexts/themeContext";
import {
  getDataSignedUrl,
  getSingleAccountDetailByIdAPI,
  FaceVerificationApi,
} from "../../../api/userApi";
import axios from "axios";
import Loader from "../../../components/ui/loader";
import faceimg from "../../../assets/face.png";
import CameraCapture from "../../../components/camera/captureImage";

function FaceVerification(props) {
  const { dataOfAccountSetups } = props;
  const { theme } = useTheme();
  const [isLoader, setIsLoader] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [face, setFace] = useState(null);
  const [identification, setIdentification] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // Controls camera visibility
  const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
    error: false,
    message: "",
  });
  const [faceKey, setFaceKey] = useState(
    props?.dataOfAccountSetups?.fund_data?.fund_setting?.account?.applicant
      ?.identity[
      dataOfAccountSetups?.isIndividual ? "individual" : "corporate"
    ]?.provider?.verify?.face?.steps?.[0]?.key || null
  );
  const [assistanceData, setAssistanceData] = useState(null);
  const [imageDataOne, setImageDataOne] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [capturedMediaStream, setCapturedMediaStream] = useState(null);
  const [imageCapturedData, setImageCapturedData] = useState({});



  const cancelTokenSource = axios.CancelToken.source();
  const videoRef = useRef(null); // Reference for the video element (camera)

  const handleGetAccountDetail = async () => {
    setIsLoader(true);
    try {
      const response = await getSingleAccountDetailByIdAPI(
        "e00edd10-4270-4073-8c69-e0d718012999",
        cancelTokenSource.token
      );
      setIsLoader(false);

      if (response.success) {
        const accountDetails =
          response?.data?.account_detail?.attach_identities?.[0]?.meta
            ?.identities?.["53c8a88a-cc42-4da4-958b-71e79df5ad5f"]
            ?.faceVerification;

        setApiResponse(accountDetails);
      }
    } catch (error) {
      setIsLoader(false);
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching account details:", error);
      }
    }
  };

  const renderImages = async () => {
    if (apiResponse?.images?.face) {
      setIsLoader(true);
      const dataToSend = { key: apiResponse?.images?.face };
      try {
        const response = await getDataSignedUrl(
          dataToSend,
          cancelTokenSource.token
        );
        setIsLoader(false);
        if (response.success) {
          setFace(faceimg);
        }
      } catch (error) {
        setIsLoader(false);
        console.error("Error fetching face image:", error);
      }
    }
    if (apiResponse?.images?.identification) {
      setIsLoader(true);
      const dataToSend = { key: apiResponse?.images?.identification };
      try {
        const response = await getDataSignedUrl(
          dataToSend,
          cancelTokenSource.token
        );
        setIsLoader(false);
        if (response.success) {
          setIdentification(faceimg);
        }
      } catch (error) {
        setIsLoader(false);
        console.error("Error fetching identification image:", error);
      }
    }
  };

  useEffect(() => {
    handleGetAccountDetail();
  }, []);

  useEffect(() => {
    if (apiResponse) renderImages();
  }, [apiResponse]);

  const handleImageCaptureOne = (data) => {
    if (data?.faceSnapkey === "img1_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img1_base64: data["img1_base64"],
      });
    } else {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img2_base64: data["img2_base64"],
      });
    }
  };

  const submitFaceVerification = async () => {
    debugger
    props?.handleApiResponseFace(false);
    setIsLoader(true);

    if (capturedMediaStream) {
      capturedMediaStream.getTracks().forEach((track) => track.stop());
    }

    const modifiedImageCapturedData = { ...imageCapturedData };

    if (
      !modifiedImageCapturedData.img1_base64 ||
      !modifiedImageCapturedData.img2_base64
    ) {
      setIsLoader(false);
      setIsFaceSnapsUploaded({
        error: true,
        message: "Please capture both images before proceeding.",
      });
      return;
    }

    modifiedImageCapturedData.img1_base64 =
      modifiedImageCapturedData.img1_base64.startsWith("data:")
        ? modifiedImageCapturedData.img1_base64.split(",")[1]
        : modifiedImageCapturedData.img1_base64;

    modifiedImageCapturedData.img2_base64 =
      modifiedImageCapturedData.img2_base64.startsWith("data:")
        ? modifiedImageCapturedData.img2_base64.split(",")[1]
        : modifiedImageCapturedData.img2_base64;

    modifiedImageCapturedData.location = locationData;

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
        if (response.data?.faceVerification?.assistance) {
          props?.handleAssistanceData(true);
          handleShow(true);
        } else {
          handleShow(false);
          props?.advanceSection();
          props?.faceVerificationCompleted(true);
        }
      } else {
        setIsFaceSnapsUploaded({
          error: true,
          message: `${response?.user_message} Please capture the images again.`,
        });
        props?.handleApiResponseFace(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.error("API error:", error);
    }
  };

  const cameraClose = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
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

  const handleChangeLocation = (data) => {
    setLocationData(data);
  };

  const handleProceedClick = () => setIsCameraActive(true); // Activates camera
  const handleProceedClicks = () => setIsCameraActive(true); // Activates camera


  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          <div className={`mt-2 border-b-4 border-color-${theme} px-2`}>
            <h1 className="text-xl lg:text-2xl mb-2">Liveliness Test</h1>
            <p className="text-sm lg:text-md mb-6 mt-4 uppercase">
              To meet the regulatory KYC and AML/CFT requirements, this step
              helps us to ensure that you are who you say you are.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
            <div
              className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
            >
              <h2
                className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
              >
                Face Verification
              </h2>
              {face ? (
                <img src={face} alt="Face" className="w-full h-auto rounded-lg" />
              ) : isCameraActive ? (
                <CameraCapture
                  handleChangeLocation={handleChangeLocation}
                  onImageCapture={handleImageCaptureOne}
                  cameraCloseBrowser={cameraClose}
                  resetData={resetData}
                  isFaceSnapsUploaded={isFaceSnapsUploaded}
                  handleSetFaceImages={props?.handleSetFaceImages}
                  faceImages={props?.faceImages}
                  dataOfAccountSetup={dataOfAccountSetups}
                  faceSnapKey={faceKey}
                  videoRef={videoRef} 
                />
              ) : (
                <div className="flex flex-col items-center mb-4 mt-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-sky-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2v-9a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zM9 8a3 3 0 116 0v1H9V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-center text-sm lg:text-lg mt-10 uppercase">
                    Please proceed with Face Verification to complete the
                    application.
                  </p>
                  <Button
                    text="Proceed"
                    onClick={handleProceedClick}
                    className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
                    />
                </div>
              )}

            </div>
            <div
                className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
              >
                <h2
                  className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
                >
                  National ID / Passport with Photo
                </h2>
                {identification  ? (
                  <img
                    src={identification}
                    alt=""
                    className="w-full h-auto rounded-lg"
                  />
                ) : isCameraActive ? (
                  <CameraCapture
                    handleChangeLocation={handleChangeLocation}
                    onImageCapture={handleImageCaptureOne}
                    cameraCloseBrowser={cameraClose}
                    resetData={resetData}
                    isFaceSnapsUploaded={isFaceSnapsUploaded}
                    handleSetFaceImages={props?.handleSetFaceImages}
                    faceImages={props?.faceImages}
                    dataOfAccountSetup={dataOfAccountSetups}
                    faceSnapKey={faceKey}
                    videoRef={videoRef} 
                  />
                )  : (
                  <>
                    <div className="flex flex-col items-center mb-4 mt-20">
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
                      <p className="text-center text-sm lg:text-lg mt-10 uppercase">
                        Position your face within the designated area.
                      </p>
                      <Button
                        text="Proceed"
                        className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
                        onClick={handleProceedClicks}
                      />
                    </div>
                  </>
                )}
              </div>
          </div>
              <Button
                        text="API Hitt"
                        className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
                        onClick={submitFaceVerification}
                      />
        </>
      )}
    </>
  );
}

export default FaceVerification;
