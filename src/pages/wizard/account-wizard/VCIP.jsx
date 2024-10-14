// import React, { useState, useEffect } from "react";
// import Button from "../../../components/ui/button/Button";
// import { useTheme } from "../../../contexts/themeContext";
// import axios from "axios";
// import {
//   getDataSignedUrl,
//   getIdentityDocument,
//   getSingleAccountDetailByIdAPI,
//   getVcipSignedUrl
// } from "../../../api/userApi";
// import { useParams } from "react-router-dom";
// import Loader from "../../../components/ui/loader";
// import vcipvideo from "../../../assets/vcip.mp4";

// function VCIP(props) {
//   const { theme } = useTheme();
//   const identity_id = "53c8a88a-cc42-4da4-958b-71e79df5ad5f";
//   const fund_id = "1";
//   const account_id = "185c546b-cbf1-4550-bdee-705799f6513e";
//   const { dataOfAccountSetups } = props; 
//   console.log('dataOfAccountSetups5',dataOfAccountSetups)

//   const [locationData, setLocationData] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [isLocationEnabled, setIsLocationEnabled] = useState(true);

//   const params = useParams();
//   const identityType = "individual";
//   const [refrenceDocument, setRefrenceDocument] = useState([]);
//   const [identityUploadDocList, setIdentityUploadDocList] = useState([]);

//   const [isLoader, setIsLoader] = useState(false);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [submited, setSubmited] = useState(false);
//   const [shareHolderID, setShareHolderID] = useState(null);
//   const cancelTokenSource = axios.CancelToken.source();

//   useEffect(() => {
    
//     handleGetSingleAccountDetailById();
//   }, []);

//   const handleGetIdentityDocumentApi = async (refrenceDoc) => {
//     console.log(`checking`);
//     setIsLoader(true);

//     const response = await getIdentityDocument(
//       identity_id,
//       cancelTokenSource.token
//     );
//     console.log("object 1", response);
//     if (response.success == true) {
//       setIsLoader(false);
//       setIdentityUploadDocList(response?.data?.IdentityDocuments);
//       const resulted_refrence_document = refrenceDoc((refDoc) => {
//         const matchingDocumentType = Object.values(
//           response?.data?.IdentityDocuments
//         )
//           .flat()
//           .find(
//             (doc) =>
//               doc.documentName.toLowerCase() === refDoc.title.toLowerCase()
//           );

//         if (matchingDocumentType) {
//           const updatedDoc = {
//             ...refDoc,
//             meta: matchingDocumentType.meta || {},
//             isUploaded: matchingDocumentType.meta?.bucket_key?.value
//               ? true
//               : false,
//           };
//           return updatedDoc;
//         } else {
//           return refDoc;
//         }
//       });

//       console.log("resulted_refrence_document", resulted_refrence_document);
//       setRefrenceDocument(resulted_refrence_document);
//     } else {
//       setIsLoader(false);
//     }
//   };

//   const handleGetSingleAccountDetailById = async () => {
//     setIsLoader(true);
//     const response = await getSingleAccountDetailByIdAPI(
//       account_id,
//       cancelTokenSource.token
//     );
//     setIsLoader(false);

//     if (response.success === true) {
//       setShareHolderID(
//         response?.data?.account_detail?.attach_identities[0]?.id
//       );
//       let refrenceDocument;

//       if (identityType === "individual") {
//         refrenceDocument =
//           response?.data?.account_detail?.fund?.meta?.config?.settings?.account
//             ?.applicant?.identity?.indivisual?.provider?.verify?.vcip
//             ?.reference_doc;
//       } else {
//         refrenceDocument =
//           response?.data?.account_detail?.fund?.meta?.config?.settings?.account
//             ?.applicant?.identity?.indivisual?.provider?.verify?.vcip
//             ?.reference_doc;
//       }
//       setRefrenceDocument(refrenceDocument);
//       handleGetIdentityDocumentApi(refrenceDocument);

//       setIsLoader(false);

//       console.log(
//         "response?.data?.account_detail?.attach_identi",
//         response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
//           identity_id
//         ]?.vcip
//       );
//       if (
//         response?.data?.account_detail?.attach_identities[0]?.meta?.identities[
//           identity_id
//         ]?.vcip !== undefined
//       ) {
//         setIsLoader(true);
//         console.log(
//           "response?.data?.account_detail?.attach_identities[0]?.meta?.identities",
//           response?.data?.account_detail?.attach_identities[0]?.meta?.identities
//         );
//         const dataToSend = {
//           key: response?.data?.account_detail?.attach_identities[0]?.meta
//             ?.identities[identity_id]?.vcip?.video,
//         };
//         const res = await getDataSignedUrl(dataToSend, cancelTokenSource.token);
//         if (res.success) {
//           setIsLoader(false);

//           console.log("url is her", res);
//           let url = res?.data;
//           setVideoUrl(vcipvideo);
//           console.log("Video URLs:", videoUrl);
//           setSubmited(true);
//           let data = {
//             status: true,
//             redirect: false,
//           };
//           props?.vcipUpload(data);
//         }
//       } else {
//         setIsLoader(false);
//       }
//     } else {
//     }
//   };

//   return (
//     <>
//       {isLoader ? (
//         <Loader />
//       ) : (
//         <>
//           <div className={`mt-2 border-b-4 border-color-${theme} px-4 `}>
//             <h1 className="text-xl lg:text-[1.625rem] mb-2">
//               VCIP - Video Based Customer Identification Process
//             </h1>
//           </div>
//           <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4 ">
//             <div
//               className={`bg-color-stepper-card-${theme} p-6 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] rounded-lg w-full lg:w-[70%]   mb-8 lg:mb-0`}
//             >
//               <h3 className="text-lg p-4 rounded-md mb-4  shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]">
//                 Welcome to the VCIP Step.
//               </h3>
//               <p className="text-sm lg:text-[16px] mt-10">
//                 To proceed with the VCIP verification when the video recording
//                 begins:
//               </p>
//               <ol className="ml-6 list-decimal list-inside space-y-2">
//                 <li>
//                   Please say out your full name as per your National ID/Passport
//                   clearly.
//                 </li>
//                 <li>Please say out your Birth Date.</li>
//                 <li>
//                   Please show us your National ID/Passport, please ensure it's
//                   clearly visible.
//                 </li>
//               </ol>
//               <p className="text-sm lg:text-[16px] mt-6">
//                 Please click on the [Start Recording] button when you are ready.
//               </p>
//             </div>
//             <div
//               className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[34%]   shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}
//             >
//               <p className="text-sm lg:text-[16px] p-4 mb-4">
//                 For personal privacy purposes, the video recorded will be
//                 blurred.
//               </p>
//               <div className="flex justify-center items-center mb-4 mt-8">
//                 {videoUrl !== null ? (
//                   <video controls autoPlay>
//                     <source src={videoUrl} type="video/mp4" />
//                   </video>
//                 ) : (
//                   <>
//                   <div className="flex flex-col items-center mb-2 mt6">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-24 w-24 text-sky-500"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M2 8a6 6 0 016-6h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8zm12 7a1 1 0 112 0v2a1 1 0 11-2 0v-2zm-1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 10z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <p className="text-center text-sm lg:text-lg mt-10">
//                   Position your face in the designated area.
//                 </p>
//                 <Button
//                   text="Start Recording"
//                   className={`bg-color-button-${theme} hover:bg-green-600 text-white py-4 lg:py-[20px] px-4 lg:px-8 rounded-[18px] mx-auto block mt-10 lg:mt-24`}
//                 />
//                 </div>
//                 </>
//                 )}
//               </div>
              
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// export default VCIP;


import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/button/Button";
import { useTheme } from "../../../contexts/themeContext";
import axios from "axios";
import {
  getDataSignedUrl,
  getIdentityDocument,
  getSingleAccountDetailByIdAPI,
  getVcipSignedUrl,
  postVerifyUploadVideo,
} from "../../../api/userApi";
import { useParams } from "react-router-dom";
import Loader from "../../../components/ui/loader";
import vcipvideo from "../../../assets/vcip.mp4";

function VCIP({ vcipUpload, dataOfAccountSetups }) {
  const { theme } = useTheme();
  const identity_id = "53c8a88a-cc42-4da4-958b-71e79df5ad5f";
  const fund_id = "1";
  const account_id = "185c546b-cbf1-4550-bdee-705799f6513e";
  const identityType = "individual";
  // const { dataOfAccountSetups } = props; 
  console.log('dataOfAccountSetups5',dataOfAccountSetups)
  
  const [locationData, setLocationData] = useState({ latitude: null, longitude: null });
  const [isLoader, setIsLoader] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [shareHolderID, setShareHolderID] = useState(null);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [referenceDocument, setReferenceDocument] = useState([]);
  
  const cancelTokenSource = axios.CancelToken.source();
  const params = useParams();

  // Trigger fetching account and document details on load
  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    setIsLoader(true);
    try {
      const response = await getSingleAccountDetailByIdAPI(account_id, cancelTokenSource.token);
      if (response.success) {
        const shareHolder = response.data.account_detail.attach_identities[0]?.id;
        setShareHolderID(shareHolder);
        const document = extractReferenceDocument(response);
        setReferenceDocument(document);
        fetchIdentityDocuments(document);
        await checkForExistingVideo(response);
      }
    } finally {
      setIsLoader(false);
    }
  };

  const extractReferenceDocument = (response) => {
    const path = response.data.account_detail.fund?.meta?.config?.settings?.account?.applicant?.identity;
    return identityType === "individual"
      ? path?.individual?.provider?.verify?.vcip?.reference_doc
      : path?.corporate?.provider?.verify?.vcip?.reference_doc;
  };

  const fetchIdentityDocuments = async (referenceDoc) => {
    setIsLoader(true);
    const response = await getIdentityDocument(identity_id, cancelTokenSource.token);
    if (response.success) {
      const updatedDocuments = updateDocumentStatus(referenceDoc, response.data.IdentityDocuments);
      setReferenceDocument(updatedDocuments);
      setIdentityUploadDocList(response.data.IdentityDocuments);
    }
    setIsLoader(false);
  };

  const updateDocumentStatus = (referenceDoc, identityDocs) => {
    return referenceDoc.map((doc) => {
      const matchingDoc = identityDocs.flat().find(
        (identityDoc) => identityDoc.documentName.toLowerCase() === doc.title.toLowerCase()
      );
      return matchingDoc
        ? { ...doc, meta: matchingDoc.meta || {}, isUploaded: !!matchingDoc.meta?.bucket_key?.value }
        : doc;
    });
  };

  const checkForExistingVideo = async (response) => {
    const videoKey =
      response.data.account_detail.attach_identities[0]?.meta?.identities[identity_id]?.vcip?.video;
    if (videoKey) {
      setIsLoader(true);
      const res = await getDataSignedUrl({ key: videoKey }, cancelTokenSource.token);
      if (res.success) {
        setVideoUrl(vcipvideo);
        setSubmitted(true);
        vcipUpload({ status: true, redirect: false });
      }
      setIsLoader(false);
    }
  };

  const handleSubmitVideo = async () => {
    setIsLoader(true);
    const response = await getVcipSignedUrl(locationData, identity_id, shareHolderID, cancelTokenSource.token);

    if (response.success) {
      const { video_signed_url: signedUrl } = response.data;
      const token = axios.defaults.headers["x-auth-token"];
      delete axios.defaults.headers["x-auth-token"];

      try {
        await axios.put(signedUrl, videoBlob, { headers: { "Content-Type": videoBlob.type } });
        axios.defaults.headers["x-auth-token"] = token;
        const verifyResponse = await postVerifyUploadVideo(identity_id, shareHolderID, { upload: true }, cancelTokenSource.token);

        if (verifyResponse.success) {
          setSubmitted(true);
          setShowSubmited(false);
          vcipUpload({ status: true, redirect: true });
        }
      } catch (error) {
        console.error("Video upload failed", error);
        axios.defaults.headers["x-auth-token"] = token;
      } finally {
        setIsLoader(false);
      }
    }
  };

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          <div className={`mt-2 border-b-4 border-color-${theme} px-4`}>
            <h1 className="text-xl lg:text-[1.625rem] mb-2">
              VCIP - Video Based Customer Identification Process
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
            <div className={`bg-color-stepper-card-${theme} p-6 shadow-lg rounded-lg w-full lg:w-[70%] mb-8 lg:mb-0`}>
              <h3 className="text-lg p-4 rounded-md mb-4 shadow-md">Welcome to the VCIP Step.</h3>
              <p className="text-sm lg:text-[16px] mt-10">
                Please follow these instructions during the video recording:
              </p>
              <ol className="ml-6 list-decimal list-inside space-y-2">
                <li>Say your full name as per your National ID/Passport.</li>
                <li>Say your date of birth.</li>
                <li>Show your National ID/Passport clearly.</li>
              </ol>
              <p className="text-sm lg:text-[16px] mt-6">Click [Start Recording] when ready.</p>
            </div>

            <div className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[34%] shadow-lg`}>
              <p className="text-sm lg:text-[16px] p-4 mb-4">The video will be blurred for privacy.</p>
              <div className="flex justify-center items-center mb-4 mt-8">
                {videoUrl ? (
                  <video controls autoPlay>
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-sky-500" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M2 8a6 6 0 016-6h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8zm12 7a1 1 0 112 0v2a1 1 0 11-2 0v-2zm-1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-center text-sm lg:text-lg mt-10">Position your face in the designated area.</p>
                    <Button
                      text="Start Recording"
                      className={`bg-color-button-${theme} hover:bg-green-600 text-white py-4 px-8 rounded-lg mt-10`}
                      onClick={handleSubmitVideo}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default VCIP;

