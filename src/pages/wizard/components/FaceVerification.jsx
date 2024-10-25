import {
    Button,
    Col,
    Container,
    Row,
    Card,
    Alert,
    Modal,
  } from 'react-bootstrap';
  import axios from 'axios';
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import {
    FaceVerificationApi,
    getDataSignedUrl,
    getSingleAccountDetailByIdAPI,
  } from '../../../api/network/CustomerApi';
  import CameraCapture from './captureImage';
  import LoadingSpinner from '../../../components/ui/loader';
  import SpinnerWithBackDrop from "../../../components/ui/loader";
  import Stepper from 'react-stepper-horizontal';
  import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
  import CustomAlert from '../../../widgets/components/Alerts';

  export default function FaceVerification(props) {
    console.log(props, 'props');
    console.log(props?.dataOfAccountSetup, 'props?.dataOfAccountSetup');
    const identity_id = props?.dataOfAccountSetup?.identity_id;
  
    const cancelTokenSource = axios.CancelToken.source();
    const [capturedMediaStream, setCapturedMediaStream] = useState(null);
    const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
      error: false,
      message: '',
    });
  
    const [imageDataOne, setImageDataOne] = useState(null);
    const [imageCapturedData, setImageCapturedData] = useState({});
  
    const [assistanceData, setAssistanceData] = useState(() => {
      const accountData = props?.dataOfAccountSetup?.accountData;
    
      // Check if accountData, attach_identities exist, and if attach_identities is an array with at least one item
      if (accountData?.attach_identities && Array.isArray(accountData.attach_identities) && accountData.attach_identities.length > 0) {
        const attachIdentities = accountData.attach_identities;
        
        // Check if meta exists within attachIdentities[0]
        if (attachIdentities[0]?.meta) {
          const identities = attachIdentities[0]?.meta?.identities;
    
          // Check if identities and identity_id exist, and return faceVerification if available
          if (identities && identities[identity_id]?.faceVerification) {
            return identities[identity_id]?.faceVerification;
          }
        }
      }
      return null;
    });
    
    const [isAssistance, setIsAssistance] = useState(() => {
      const accountData = props?.dataOfAccountSetup?.accountData;
    
      // Check if accountData, attach_identities exist, and if attach_identities is an array with at least one item
      if (accountData?.attach_identities && Array.isArray(accountData.attach_identities) && accountData.attach_identities.length > 0) {
        const attachIdentities = accountData.attach_identities;
    
        // Check if meta exists within attachIdentities[0]
        if (attachIdentities[0]?.meta) {
          const identities = attachIdentities[0]?.meta?.identities;
    
          // Check if identities and identity_id exist, and if faceVerification contains 'assistance'
          if (identities && identities[identity_id]?.faceVerification) {
            return identities[identity_id]?.faceVerification?.hasOwnProperty('assistance') ? true : false;
          }
        }
      }
      return false; // Default to false if conditions are not met
    });
    
    
    const [imageDataTwo, setImageDataTwo] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoader, setIsLoader] = useState(false);
    const [face, setFace] = useState(null);
    const [isImageCompleted, setIsImageCompleted] = useState(false);
    const [identification, setIdentification] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [faceSnapDataConfiguration, setFaceSnapDataConfiguration] = useState(
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity[
        props?.dataOfAccountSetup?.isIndividual ? 'indivisual' : 'corporate'
      ]?.provider?.verify?.face,
    );
    const [faceKey, setFaceKey] = useState(
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity[
        props?.dataOfAccountSetup?.isIndividual ? 'indivisual' : 'corporate'
      ]?.provider?.verify?.face?.steps[0]?.key,
    );
    const [proceed, setProceed] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [shareHolderID, setShareHolderID] = useState(null);
    const [steps, setSteps] = useState([
      { title: 'Step 1' },
      { title: 'Step 2' },
    ]);
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [locationData, setLocationData] = useState({
      latitude: null,
      longitude: null,
    });
    const [isLocationEnabled, setIsLocationEnabled] = useState(true);
    const [alertProps, setAlertProps] = useState({
      variant: '',
      message: '',
      show: false,
      hideAuto: false,
    });
  
    const fund_id = props?.dataOfAccountSetup?.fund_id;
    const account_id = props?.dataOfAccountSetup?.account_id;
  
    let shareholder_id = props?.dataOfAccountSetup?.accountData?.attach_identities
      ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.id
      : null;
  
    useEffect(() => {
      renderImages();
    }, [apiResponse]);
  
    useEffect(() => {
      console.log('locationDatalocationData', locationData);
    }, [locationData]);
  
    useEffect(() => {
      props?.isHandleAssistanceData(
        props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
          ?.identities
          ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[
              identity_id
            ]?.faceVerification?.hasOwnProperty('assistance')
            ? true
            : false
          : false,
      );
    }, []);
    useEffect(() => {
      console.log('vvvface', face);
      console.log('vvvface faceSnapDataConfiguration', faceSnapDataConfiguration);
    }, [face, faceSnapDataConfiguration]);
    useEffect(() => {
      if (face && identification) {
        props?.faceVerificationCompleted(true, false);
        props?.handleSetFaceImages({
          img2_base64: face,
          img1_base64: identification,
        });
        // props.submitFaceVerification(true);
      }
    }, [face, identification]);
    useEffect(() => {
      if (props.handleCallAPIForFaceVerficationData) {
        console.log(imageCapturedData, 'imageCapturedData');
        // return;
        if (
          imageCapturedData['img1_base64'] &&
          imageCapturedData['img2_base64']
        ) {
          submitFaceVerfication();
        } else {
          props?.faceVerificationCompleted(true, true);
        }
        props.handleCallAPIForFaceVerficationDataUpdateFalse();
      }
    }, [props.handleCallAPIForFaceVerficationData]);
    useEffect(() => {
      handleGetAccountDetail();
    }, []);
    useEffect(() => {
      console.log('imageCapturedData', imageCapturedData);
  
      if (imageCapturedData['img1_base64'] && imageCapturedData['img2_base64']) {
        props?.handleSetFaceImages({
          img2_base64: imageCapturedData['img1_base64'],
          img1_base64: imageCapturedData['img2_base64'],
        });
      }
    }, [imageCapturedData]);
  
    const handleChangeLocation = (data) => {
      setLocationData(data);
    };
    const handleGetAccountDetail = async () => {
      setIsLoader(true);
      const response = await getSingleAccountDetailByIdAPI(
        props?.dataOfAccountSetup?.account_id,
        cancelTokenSource.token,
      );
      setIsLoader(false);
      if (response.success == true) {
        console.log(
          response?.data?.account_detail?.attach_identities[0]?.id,
          'response?.data?.account_detail?.attach_identities[0]?.id',
        );
        setShareHolderID(
          response?.data?.account_detail?.attach_identities[0]?.id,
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
                        ?.faceVerification,
                    );
                  }
                }
              }
            }
          }
        }
      }
    };
  
    // useEffect(() => {
    //   console.log(props?.dataOfAccountSetup, 'props?.dataOfAccountSetup')
    //   if (props?.dataOfAccountSetup?.accountData?.attach_identities?.length > 0) {
    //     if (props?.dataOfAccountSetup?.accountData?.attach_identities[0]) {
    //       if (props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities) {
    //         if (props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[props?.dataOfAccountSetup?.identity_id]) {
    //           if (props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[props?.dataOfAccountSetup?.identity_id]?.faceVerification) {
    //             if (props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[props?.dataOfAccountSetup?.identity_id]?.faceVerification?.images) {
    //               setApiResponse(props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta?.identities[props?.dataOfAccountSetup?.identity_id]?.faceVerification)
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }, [props?.dataOfAccountSetup])
  
    console.log(
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant
        ?.identity[
        props?.dataOfAccountSetup?.isIndividual ? 'indivisual' : 'corporate'
      ]?.provider?.verify?.face,
      'dataOfAccountSetup faceverification',
    );
  
    console.log(shareHolderID, 'shareHolderID');
    const handleImageCaptureOne = (data) => {
      if (data?.faceSnapkey === 'img1_base64') {
        props?.handleSetFaceImages({
          ...props?.faceImages,
          img1_base64: imageCapturedData['img1_base64'],
        });
      } else {
        props?.handleSetFaceImages({
          ...props?.faceImages,
          img2_base64: imageCapturedData['img2_base64'],
        });
      }
  
      setImageDataOne(data?.capturedImageData);
      console.log(data, 'data handleImageCaptureOne');
      imageCapturedData[data?.faceSnapkey] = data?.capturedImageData;
      setImageCapturedData(imageCapturedData);
      console.log(imageCapturedData, 'imageCapturedData');
  
      if (faceSnapDataConfiguration?.steps[data?.index + 1]) {
        setFaceKey(faceSnapDataConfiguration?.steps[data?.index + 1]?.key);
        if (
          data?.faceSnapkey === 'img1_base64' &&
          imageCapturedData['img2_base64']
        ) {
          props.submitFaceVerification(true);
        }
      } else {
        if (
          imageCapturedData['img1_base64'] &&
          imageCapturedData['img2_base64']
        ) {
          props.submitFaceVerification(true);
          setShowSubmit(true);
        }
      }
      console.log(data, 'data');
    };
    const handleImageCaptureTwo = (data) => {
      setImageDataTwo(data);
      console.log(data, 'data');
    };
    const confirmatioinModal = (
      <Modal
        size="md"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {' '}
        <Modal.Header closeButton>
          <Modal.Title>Face Verification Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              {/* Increase font size for 'Status' */}
              <small
                className="fund_info_small"
                style={{ fontSize: '1.0625rem', color: 'white' }}
              >
                <span
                  className={
                    assistanceData?.assistance?.match
                      ? 'text-success'
                      : 'text-danger'
                  }
                >
                  <FeatherIcon
                    className={
                      assistanceData?.assistance?.match
                        ? 'text-success'
                        : 'text-danger'
                    }
                    icon="check-circle"
                    color={assistanceData?.assistance?.match ? 'green' : 'red'}
                    size="20"
                  />
                </span>{' '}
                Status: {/* Added space after colon */}
                <span
                  style={{
                    color: assistanceData?.assistance?.match ? 'green' : 'red',
                  }}
                >
                  {assistanceData?.assistance?.match ? 'Matched' : 'Not Matched'}
                </span>
              </small>
            </div>
  
            {/*
      {assistanceData?.assistance?.match ? (
        <>
          <div>
  
            <small className="fund_info_small" style={{ fontSize: "1.0625rem", color: "white" }}>
              <FeatherIcon
                className={assistanceData?.assistance?.match ? "text-success" : "text-danger"}
                icon="clock"
                color={assistanceData?.assistance?.match ? "green" : "red"}
                size="20"
              />
              {" "}Score:{" "}
              <span style={{ color: assistanceData?.assistance?.match ? "green" : "red" }}>
                {Math.floor(assistanceData?.assistance?.score * 100)}%
              </span>
            </small>
          </div>
        </>
      ) : (
        <>
          <div>
  
            <small className="fund_info_small" style={{ fontSize: "20px", color: "white" }}>
              <FeatherIcon
                className={assistanceData?.assistance?.match ? "text-success" : "text-danger"}
                icon="clock"
                color={assistanceData?.assistance?.match ? "green" : "red"}
                size="20"
              />
              {" "}Score:{" "}
              <span style={{ color: assistanceData?.assistance?.match ? "green" : "red" }}>0</span>
            </small>
          </div>
        </>
      )}
      */}
  
            {/* Additional information can be added here */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button variant="secondary" onClick={handleClose}>
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    );
    const handleClickConfirmatioinNext = () => {
      props?.faceVerificationCompleted(true, true);
      setIsImageCompleted(true);
    };
  
    const cameraClose = (stream, videoRef) => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          console.log('Stopping camera track', track);
          track.stop();
        });
      }
  
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video source
      }
    };
  
    // const showResults = async () => {}
  
    const submitFaceVerfication = async () => {
      props?.handleApiResponseFace(false);
      setIsLoader(true);
      // const dataToSend = {
      //   img1_base64: imageDataOne,
      //   img2_base64: imageDataTwo,
      // }
      if (capturedMediaStream) {
        capturedMediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      console.log(imageCapturedData, 'dataToSend');
      // Copying the imageCapturedData object
      const modifiedImageCapturedData = { ...imageCapturedData };
  
      // Remove the prefix "data:image/png;base64," from img1_base64 and img2_base64
      modifiedImageCapturedData.img1_base64 =
        modifiedImageCapturedData.img1_base64.split('data:image/png;base64,')[1];
      modifiedImageCapturedData.img2_base64 =
        modifiedImageCapturedData.img2_base64.split('data:image/png;base64,')[1];
      modifiedImageCapturedData.location = locationData;
  
      // Logging the modified data
      console.log('modifiedImageCapturedData', modifiedImageCapturedData);
      if (locationData?.latitude === null) {
        setIsLocationEnabled(false);
      } else {
        setIsLocationEnabled(true);
      }
  
      const response = await FaceVerificationApi(
        modifiedImageCapturedData,
        cancelTokenSource.token,
        identity_id,
        shareHolderID,
      );
      setIsLoader(false);
      if (response.success == true) {
        props?.handleApiResponseFace(true);
  
        setAssistanceData(response.data?.faceVerification);
        setIsAssistance(
          response.data?.faceVerification?.hasOwnProperty('assistance')
            ? true
            : false,
        );
  
        if (response.data?.faceVerification?.hasOwnProperty('assistance')) {
          props?.handleAssistanceData(true);
          handleShow(true);
          props?.isHandleAssistanceData(true);
        } else {
          handleShow(false);
          props?.isHandleAssistanceData(false);
          props?.advanceSection();
          props?.faceVerificationCompleted(true);
        }
  
        console.log(
          response.data?.faceVerification,
          'response.data?.faceVerification',
        );
        setApiResponse(response.data?.faceVerification);
        setIsFaceSnapsUploaded({ error: false, message: '' });
      } else {
        console.log(response, 'error');
        setIsFaceSnapsUploaded({
          error: true,
          message: `${response?.user_message} Please again capture the images`,
        });
        props?.handleApiResponseFace(false);
        setAlertProps({
          variant: 'danger',
          message: ` Please again capture the images`,
          show: true,
          hideAuto: true,
        });
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
          cancelTokenSource.token,
        );
        setIsLoader(false);
        if (response.success == true) {
          console.log(response?.data, 'response?.data');
          setFace(response?.data);
        } else {
          console.log(response, 'error');
        }
      }
      if (apiResponse?.images?.identification) {
        setIsLoader(true);
        const dataToSend = {
          key: apiResponse?.images?.identification,
        };
        const response = await getDataSignedUrl(
          dataToSend,
          cancelTokenSource.token,
        );
        setIsLoader(false);
        if (response.success == true) {
          console.log(response?.data, 'response?.data');
          setIdentification(response?.data);
        } else {
          console.log(response, 'error');
        }
      }
    };
  
    const handleProceedClick = (key) => {
      setFaceKey(key);
      imageCapturedData[key] = {};
      console.log(imageCapturedData, 'imageCapturedData');
      setImageCapturedData(imageCapturedData);
      setProceed(true);
    };
    const resetData = (faceSnapkey = null) => {
      setFace(null);
      setIdentification(null);
      props.submitFaceVerification(false);
      props?.handleAssistanceData(false);
  
      if (faceSnapkey === 'img1_base64') {
        props?.handleSetFaceImages({
          ...props?.faceImages,
          img1_base64: null,
        });
      } else if (faceSnapkey === 'img2_base64') {
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
  
      // // Make a copy of imageCapturedData and delete the entry corresponding to faceSnapkey
      // const updateImageCapture = { ...imageCapturedData };
      // if (faceSnapkey !== null) {
      //   delete updateImageCapture[faceSnapkey];
      //   delete updateImageCapture[undefined]
      // }
  
      // setImageCapturedData(updateImageCapture);
    };
  
    // return (
    //   /**
    //    * Renders the Face Verification component.
    //    * @param {Object} props - The props object containing data for account setup.
    //    * @returns {JSX.Element} - The JSX element representing the Face Verification component.
    //    */
    //   <div className="main-content">
    //     {console.log(face, 'face face face face')}
    //     <div
    //       style={{
    //         display: 'flex',
    //         justifyContent: 'space-between',
    //         marginBottom: '25px',
    //         borderBottom: '6px solid #1e3c5c',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //         margin: '0px 20px',
    //       }}
    //     >
    //       <div>
    //         <h1>Liveliness Test</h1>
    //         <div>
    //           {faceSnapDataConfiguration?.instructions.indexOf('</') !== -1 ? (
    //             <div
    //               dangerouslySetInnerHTML={{
    //                 __html: faceSnapDataConfiguration?.instructions.replace(
    //                   /(<? *script)/gi,
    //                   'illegalscript',
    //                 ),
    //               }}
    //             ></div>
    //           ) : (
    //             faceSnapDataConfiguration?.instructions
    //           )}
    //         </div>
    //       </div>
       
    //       {face && (
    //         <div>
    //           <button className="btn btn-danger" onClick={resetData}>
    //             Retake
    //           </button>
    //         </div>
    //       )}
    //     </div>

    //     <div className="border-none">
    //         <div className="mt-5">
    //             <div className="flex justify-center">
    //             <div className="w-full lg:w-full xl:w-full">
    //                 {isImageCompleted && (
    //                 <div className="mb-4">
    //                     <div
    //                     className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
    //                     role="alert"
    //                     >
    //                     <span className="block sm:inline">
    //                         Liveliness Submitted. Please proceed to the next step to
    //                         complete the application.
    //                     </span>
    //                     <span
    //                         className="absolute top-0 bottom-0 right-0 px-4 py-3"
    //                         onClick={() => setIsImageCompleted(null)}
    //                     >
    //                         <svg
    //                         className="fill-current h-6 w-6 text-green-500"
    //                         role="button"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         viewBox="0 0 20 20"
    //                         >
    //                         <title>Close</title>
    //                         <path d="M14.348 14.849a1 1 0 001.415 0l.707-.707a1 1 0 000-1.415l-4.243-4.243 4.243-4.243a1 1 0 000-1.415l-.707-.707a1 1 0 00-1.415 0L10 7.586 5.757 3.343a1 1 0 00-1.415 0l-.707.707a1 1 0 000 1.415l4.243 4.243-4.243 4.243a1 1 0 000 1.415l.707.707a1 1 0 001.415 0L10 12.414l4.243 4.243z" />
    //                         </svg>
    //                     </span>
    //                     </div>
    //                 </div>
    //                 )}
    //                 {!isLocationEnabled && locationData?.latitude === null && (
    //                 <div className="mb-4">
    //                     <div
    //                     className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    //                     role="alert"
    //                     >
    //                     <span className="block sm:inline">
    //                         To Capture The Longitude And Latitude, Please Enable Location
    //                         Services In Both Your Browser And System Settings.
    //                     </span>
    //                     <span
    //                         className="absolute top-0 bottom-0 right-0 px-4 py-3"
    //                         onClick={() => setIsLocationEnabled(true)}
    //                     >
    //                         <svg
    //                         className="fill-current h-6 w-6 text-red-500"
    //                         role="button"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         viewBox="0 0 20 20"
    //                         >
    //                         <title>Close</title>
    //                         <path d="M14.348 14.849a1 1 0 001.415 0l.707-.707a1 1 0 000-1.415l-4.243-4.243 4.243-4.243a1 1 0 000-1.415l-.707-.707a1 1 0 00-1.415 0L10 7.586 5.757 3.343a1 1 0 00-1.415 0l-.707.707a1 1 0 000 1.415l4.243 4.243-4.243 4.243a1 1 0 000 1.415l.707.707a1 1 0 001.415 0L10 12.414l4.243 4.243z" />
    //                         </svg>
    //                     </span>
    //                     </div>
    //                 </div>
    //                 )}

    //                 {isLoader && (
    //                 <div className="flex justify-center items-center" style={{ height: '20rem' }}>
    //                     <LoadingSpinner
    //                     animation="grow"
    //                     custom={true}
    //                     height="70vh"
    //                     />
    //                 </div>
    //                 ) : (
    //                         <div className="flex justify-center">
    //                             {faceSnapDataConfiguration?.steps &&
    //                                 faceSnapDataConfiguration?.steps.map((item, index) => (
    //                                 <div
    //                                     key={index}
    //                                     className={`w-full lg:w-5/12 xl:w-5/12 m-2`}
    //                                     style={{
    //                                     opacity:
    //                                         faceKey == item?.key || imageCapturedData[item?.key] || face
    //                                         ? 1
    //                                         : 0.5,
    //                                     }}
    //                                 >
    //                                     <div className="bg-white shadow-lg rounded-lg" style={{ height: '560px' }}>
    //                                     <div className="p-4">
    //                                         <div className="bg-gray-100 p-2 rounded-t-lg">
    //                                         <div className="flex justify-center">
    //                                             <h3 className="text-xl font-semibold">{item?.title}</h3>
    //                                         </div>
    //                                         </div>
    //                                         {props?.dataOfAccountSetup?.fund_data?.fund_setting?.account
    //                                         ?.applicant?.identity?.indivisual?.provider?.verify?.face
    //                                         ?.isBlured && (
    //                                         <h5 className="text-center mb-3 mt-3 text-gray-600">
    //                                             For Personal Privacy Purpose The Captured Images Will Be
    //                                             Blurred.
    //                                         </h5>
    //                                         )}
    //                                         {face ? (
    //                                         <div className="flex justify-center">
    //                                             <img
    //                                             style={{
    //                                                 height: '420px',
    //                                                 maxWidth: '410px',
    //                                                 filter: props?.dataOfAccountSetup?.fund_data?.fund_setting
    //                                                 ?.account?.applicant?.identity?.indivisual?.provider
    //                                                 ?.verify?.face?.isBlured
    //                                                 ? 'blur(8px)'
    //                                                 : '',
    //                                             }}
    //                                             src={index === 0 ? identification : face}
    //                                             alt="capturedImage"
    //                                             />
    //                                         </div>
    //                                         ) : (!proceed || faceKey != item?.key) &&
    //                                         !imageCapturedData[item?.key] ? (
    //                                         <div className="flex flex-col items-center">
    //                                             <img
    //                                             src={item?.isIdCard ? '/img/idcardscanner.png' : '/img/face.png'}
    //                                             className="h-72 pt-11 pb-11"
    //                                             />
    //                                             {item?.instructions.indexOf('</') !== -1 ? (
    //                                             <div
    //                                                 className="text-lg text-center"
    //                                                 dangerouslySetInnerHTML={{
    //                                                 __html: item?.instructions.replace(
    //                                                     /(<? *script)/gi,
    //                                                     'illegalscript',
    //                                                 ),
    //                                                 }}
    //                                             ></div>
    //                                             ) : (
    //                                             <div className="text-lg text-center">
    //                                                 {item?.instructions
    //                                                 ?.split(' ')
    //                                                 .map(
    //                                                     (word) =>
    //                                                     word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    //                                                 )
    //                                                 .join(' ')}
    //                                             </div>
    //                                             )}
    //                                             <button
    //                                             disabled={faceKey != item?.key}
    //                                             className="bg-red-500 text-white mt-4 px-6 py-2 rounded-lg disabled:opacity-50"
    //                                             onClick={() => {
    //                                                 handleProceedClick(item?.key);
    //                                             }}
    //                                             >
    //                                             Proceed
    //                                             </button>
    //                                         </div>
    //                                         ) : (
    //                                         ((proceed && faceKey == item?.key) || imageCapturedData[item?.key]) && (
    //                                             <div className="flex flex-col items-center">
    //                                             <CameraCapture
    //                                                 handleChangeLocation={handleChangeLocation}
    //                                                 onImageCapture={handleImageCaptureOne}
    //                                                 handleSetFaceImages={props?.handleSetFaceImages}
    //                                                 faceImages={props?.faceImages}
    //                                                 faceSnapkey={item?.key}
    //                                                 index={index}
    //                                                 isIdCard={item?.isIdCard}
    //                                                 resetData={resetData}
    //                                                 cameraCloseBrowser={cameraClose}
    //                                                 dataOfAccountSetup={props?.dataOfAccountSetup}
    //                                             />
    //                                             </div>
    //                                         )
    //                                         )}
    //                                     </div>
    //                                     </div>
    //                                 </div>
    //                                 ))}
    //                             {face &&
    //                                 faceSnapDataConfiguration?.integration?.enabled &&
    //                                 isAssistance && (
    //                                 <div className="flex justify-center w-10/12 mt-4">
    //                                     <div className="bg-white shadow-lg rounded-lg w-full">
    //                                     <div className="p-4">
    //                                         <div className="flex">
    //                                         <div className="w-1/2 lg:w-1/3 flex items-center">
    //                                             <span className="text-lg font-medium">Result</span>
    //                                         </div>
    //                                         <div className="w-1/2 lg:w-1/3">
    //                                             <div>
    //                                             <small
    //                                                 className="text-lg text-white"
    //                                                 style={{
    //                                                 color: assistanceData?.assistance?.match ? 'green' : 'red',
    //                                                 }}
    //                                             >
    //                                                 <span
    //                                                 className={
    //                                                     assistanceData?.assistance?.match ? 'text-green-500' : 'text-red-500'
    //                                                 }
    //                                                 >
    //                                                 <FeatherIcon
    //                                                     icon="check-circle"
    //                                                     color={assistanceData?.assistance?.match ? 'green' : 'red'}
    //                                                     size="20"
    //                                                 />
    //                                                 </span>{' '}
    //                                                 Status: 
    //                                                 <span
    //                                                 style={{
    //                                                     color: assistanceData?.assistance?.match ? 'green' : 'red',
    //                                                 }}
    //                                                 >
    //                                                 {assistanceData?.assistance?.match ? 'Matched' : 'Not Matched'}
    //                                                 </span>
    //                                             </small>
    //                                             </div>
    //                                         </div>
    //                                         </div>
    //                                     </div>
    //                                     </div>
    //                                 </div>
    //                                 )}
    //                             </div>
    //                             )}
    //                             </div>
    //                         </div>

            
    //                     {isFaceSnapsUploaded?.error && (
    //                         <div style={{ display: 'flex', justifyContent: 'center' }}>
    //                         <Row style={{ width: '82%' }} className="justify-content-center">
    //                         <Card>
    //                             <Card.Body>
    //                             <Row>
    //                                 <div className="d-flex" style={{ alignItems: 'center' }}>
    //                                 {/* Increase font size for 'Assistance' */}
    //                                 <span style={{ fontSize: '15px', color: 'red' }}>
    //                                     {isFaceSnapsUploaded?.message}
    //                                 </span>
    //                                 </div>
    //                             </Row>
    //                             </Card.Body>
    //                         </Card>
    //                         </Row>
    //                     </div>
    //                     )}
    //                     {alertProps.show && (
    //                         <CustomAlert
    //                         variant={alertProps.variant}
    //                         message={alertProps.message}
    //                         hideAuto={alertProps.hideAuto}
    //                         />
    //                     )}
    //                     {isAssistance && show && confirmatioinModal}
    //                     </div>
    //                 </div>
    //         </div>
           
    // );
/**
 * Renders the Face Verification component.
 * @param {Object} props - The props object containing data for account setup.
 * @returns {JSX.Element} - The JSX element representing the Face Verification component.
 */
return (
    <div className="main-content">
      {console.log(face, 'face face face face')}
      <div
        className="flex justify-between mb-6 border-b-4 border-blue-900 px-5 py-2"
      >
        <div>
          <h1>Liveliness Test</h1>
          <div>
            {faceSnapDataConfiguration?.instructions.includes('</') ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: faceSnapDataConfiguration?.instructions.replace(
                    /(<? *script)/gi,
                    'illegalscript'
                  ),
                }}
              />
            ) : (
              faceSnapDataConfiguration?.instructions
            )}
          </div>
        </div>
  
        {face && (
          <div>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={resetData}>
              Retake
            </button>
          </div>
        )}
      </div>
  
      <div className="border-none mt-5">
        <div className="flex justify-center">
          <div className="w-full lg:w-full xl:w-full">
            {isImageCompleted && (
              <div className="mb-4">
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">
                    Liveliness Submitted. Please proceed to the next step to complete the application.
                  </span>
                  <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                    onClick={() => setIsImageCompleted(null)}
                  >
                    <svg
                      className="fill-current h-6 w-6 text-green-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1 1 0 001.415 0l.707-.707a1 1 0 000-1.415l-4.243-4.243 4.243-4.243a1 1 0 000-1.415l-.707-.707a1 1 0 00-1.415 0L10 7.586 5.757 3.343a1 1 0 00-1.415 0l-.707.707a1 1 0 000 1.415l4.243 4.243-4.243 4.243a1 1 0 000 1.415l.707.707a1 1 0 001.415 0L10 12.414l4.243 4.243z" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
            {!isLocationEnabled && locationData?.latitude === null && (
              <div className="mb-4">
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">
                    To Capture The Longitude And Latitude, Please Enable Location Services In Both Your Browser And System Settings.
                  </span>
                  <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                    onClick={() => setIsLocationEnabled(true)}
                  >
                    <svg
                      className="fill-current h-6 w-6 text-red-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1 1 0 001.415 0l.707-.707a1 1 0 000-1.415l-4.243-4.243 4.243-4.243a1 1 0 000-1.415l-.707-.707a1 1 0 00-1.415 0L10 7.586 5.757 3.343a1 1 0 00-1.415 0l-.707.707a1 1 0 000 1.415l4.243 4.243-4.243 4.243a1 1 0 000 1.415l.707.707a1 1 0 001.415 0L10 12.414l4.243 4.243z" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
  
            {isLoader ? (
              <div className="flex justify-center items-center h-80">
                <LoadingSpinner animation="grow" custom={true} height="70vh" />
              </div>
            ) : (
              <div className="flex justify-center">
                {faceSnapDataConfiguration?.steps?.map((item, index) => (
                  <div
                    key={index}
                    className="w-full lg:w-5/12 xl:w-5/12 m-2"
                    style={{
                      opacity: faceKey === item.key || imageCapturedData[item.key] || face ? 1 : 0.5,
                    }}
                  >
                    <div className="bg-white shadow-lg rounded-lg" style={{ height: '560px' }}>
                      <div className="p-4">
                        <div className="bg-gray-100 p-2 rounded-t-lg">
                          <div className="flex justify-center">
                            <h3 className="text-xl font-semibold">{item?.title}</h3>
                          </div>
                        </div>
                        {props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity?.indivisual?.provider?.verify?.face?.isBlured && (
                          <h5 className="text-center mb-3 mt-3 text-gray-600">
                            For Personal Privacy Purpose The Captured Images Will Be Blurred.
                          </h5>
                        )}
                        {face ? (
                          <div className="flex justify-center">
                            <img
                              style={{
                                height: '420px',
                                maxWidth: '410px',
                                filter: props?.dataOfAccountSetup?.fund_data?.fund_setting?.account?.applicant?.identity?.indivisual?.provider?.verify?.face?.isBlured
                                  ? 'blur(8px)'
                                  : '',
                              }}
                              src={index === 0 ? identification : face}
                              alt="capturedImage"
                            />
                          </div>
                        ) : (!proceed || faceKey !== item.key) && !imageCapturedData[item.key] ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={item.isIdCard ? '/img/idcardscanner.png' : '/img/face.png'}
                              className="h-72 pt-11 pb-11"
                              alt="placeholder"
                            />
                            <div className="text-lg text-center">
                              {item.instructions.includes('</') ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.instructions.replace(
                                      /(<? *script)/gi,
                                      'illegalscript'
                                    ),
                                  }}
                                />
                              ) : (
                                item.instructions
                                  ?.split(' ')
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                  .join(' ')
                              )}
                            </div>
                            <button
                              disabled={faceKey !== item.key}
                              className="bg-red-500 text-white mt-4 px-6 py-2 rounded-lg disabled:opacity-50"
                              onClick={() => handleProceedClick(item.key)}
                            >
                              Proceed
                            </button>
                          </div>
                        ) : (
                          ((proceed && faceKey === item.key) || imageCapturedData[item.key]) && (
                            <div className="flex flex-col items-center">
                              <CameraCapture
                                handleChangeLocation={handleChangeLocation}
                                onImageCapture={handleImageCaptureOne}
                                handleSetFaceImages={props.handleSetFaceImages}
                                faceImages={props.faceImages}
                                faceSnapkey={item.key}
                                index={index}
                                isIdCard={item.isIdCard}
                                resetData={resetData}
                                cameraCloseBrowser={cameraClose}
                                dataOfAccountSetup={props.dataOfAccountSetup}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {face && faceSnapDataConfiguration?.integration?.enabled && isAssistance && (
                  <div className="flex justify-center w-10/12 mt-4">
                    <div className="bg-white shadow-lg rounded-lg w-full">
                      <div className="p-4">
                        <div className="flex">
                          <div className="w-1/2 lg:w-1/3 flex items-center">
                            <span className="text-lg font-semibold mr-2">
                              Upload Image With Assistance
                            </span>
                          </div>
                          <div className="w-1/2 lg:w-1/3 flex items-center justify-center">
                            <img src={face} className="h-56 rounded-lg shadow-lg" alt="uploaded" />
                          </div>
                          <div className="w-1/2 lg:w-1/3 flex items-center justify-end">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleChangeLocation}
                              className="border border-gray-300 text-sm leading-4 rounded-md text-gray-700 py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => uploadAndProceed(face)}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg mt-4"
                          >
                            Upload & Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  

}
  