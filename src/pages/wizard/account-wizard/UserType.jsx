// import React, { useState, useEffect } from "react";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { FaRegClock } from "react-icons/fa";
// import { FaEye } from "react-icons/fa";
// import { HiUserAdd } from "react-icons/hi";
// import { useTheme } from "../../../contexts/themeContext";
// import { getIdentityList } from "../../../api/userApi";
// import Loader from "../../../components/ui/loader";
// import axios from "axios";

// const UserType = ({ onSelection, fundData, referenceDocuments }) => {
//   const { theme } = useTheme();
//   const [userType, setUserType] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [isNewIdentity, setIsNewIdentity] = useState(false);
//   const [selectedIdentity, setSelectedIdentity] = useState({ value: "", label: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [identitiesData, setIdentitiesData] = useState([]);
//   const cancelTokenSource = axios.CancelToken.source();

//   useEffect(() => {
//     loadIdentitiesData();
//   }, [fundData]);

//   const loadIdentitiesData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getIdentityList(cancelTokenSource.token, fundData?.id);
//       if (response.success) {
//         setIdentitiesData(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching identities:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelection = (type) => {
//     setUserType(type);
//     onSelection(type);
//   };

//     const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleIdentityChange = (e) => {
//     const selectedOption = identitiesData.find(option => option.value === e.target.value);
//     setSelectedIdentity(selectedOption);
//   };

//   return (
//     <div className={`w-full flex flex-col items-center bg-transparent font-${theme} text-${theme}`}>
//       <h3 className={`text-color-h3-${theme} text-2xl sm:text-xl md:text-2xl font-light mt-6`}>
//         Let's start with the basics.
//       </h3>
//       <p className="text-slate-500 text-xs sm:text-sm font-light mt-2 text-center sm:text-left">
//         Please select if you are applying as an individual or corporate. You may attach an existing identity or create a new one.
//       </p>

//       <div
//           className={`flex flex-col sm:flex-row bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[10%] w-[90%] sm:w-[80%] mt-8 items-center p-4`}
//         >
//           <div className="flex items-center mb-4 sm:mb-0 sm:ml-2">
//             <img
//               src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
//               alt="Image"
//               className="w-15 h-12 mr-2 rounded-[3px]"
//             />
//             <h2 className={`text-color-${theme} text-sm font-normal`}>
//               Demo Fund
//             </h2>
//           </div>
//           <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light mb-4 sm:mb-0`}>
//             <p className="flex items-center">
//               <IoCheckmarkDoneCircleOutline
//                 className={`text-color-button1-${theme}`}
//               />{" "}
//               Fund's KYC: Accepted
//             </p>
//             <p className="text-slate-500 flex items-center">
//               <IoCheckmarkDoneCircleOutline
//                 className={`text-color-button1-${theme}`}
//               />{" "}
//               Fund Domicile: Singapore
//             </p>
//           </div>
//           <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light`}>
//             <p className="flex items-center">
//               <FaRegClock className={`text-color-button1-${theme}`} /> Dealing
//               Cycle: Interval
//             </p>
//             <p className="text-slate-500 flex items-center">
//               <IoCheckmarkDoneCircleOutline
//                 className={`text-color-button1-${theme}`}
//               />{" "}
//               Digital Fund: Active
//             </p>
//           </div>
//         </div>
//         <div
//         className={`bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[20%] w-[90%] sm:w-[80%] mt-8 p-4`}
//       >
//         <div
//           className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}
//         >
//           <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
//             Account Description
//           </p>
//         </div>
//         <p className={`text-color-${theme} text-xs sm:text-sm font-light p-3`}>Demo</p>
//       </div>


//         <div
//           className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] sm:h-[10%] sm:w-[80%] mt-4 w-[80%] justify-between items-center`}
//         >
//           <p className={`text-color-${theme} text-xs sm:text-sm font-extrabold m-3`}>
//             Reference Documents
//           </p>
//           <button
//             onClick={toggleCollapse}
//             className="text-slate-500 hover:text-slate-700"
//           >
//             {isCollapsed ? <FaRegClock /> : <IoCheckmarkDoneCircleOutline />}
//           </button>
//         </div>

//         {!isCollapsed && (
//           <div className="w-[80%] mt-4">
//             {referenceDocuments?.length > 0 ? (
//               referenceDocuments.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-lg p-3 mb-2`}
//                 >
//                   <div>
//                     <p className={`mb-0 text-xs font-semibold text-color-${theme}`}>{item?.title}</p>
//                     <p className={`mb-0 text-xs text-gray-500`}>{item?.description}</p>
//                   </div>
//                   <button
//                     className={`p-2 rounded-full bg-gradient-card-${theme} flex items-center justify-center`}
//                     style={{
//                       height: '30px',
//                       width: '30px',
//                     }}
//                   >
//                     <FaEye />
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className={`text-color-${theme} text-xs`}>
//                 No reference documents available.
//               </p>
//             )}
//           </div>
//         )}

//         <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

//       {/* Identity Selection Section */}
//       <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%] mt-8">
//         {isNewIdentity ? (
//           // <div className="w-[50%]">
//           //   <p className={`text-color-${theme} text-sm`}>
//           //     Are you applying as an Individual or Corporate?
//           //   </p>
//           //   <div className="flex mt-4">
//           //     <button
//           //       onClick={() => handleSelection("individual")}
//           //       className={`flex-1 py-2 rounded-l-full text-white ${userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"} hover:bg-[#3e9b3e]`}
//           //     >
//           //       Individual
//           //     </button>
//           //     <button
//           //       onClick={() => handleSelection("corporate")}
//           //       className={`flex-1 py-2 rounded-r-full text-white ${userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"} hover:bg-[#3e9b3e]`}
//           //     >
//           //       Corporate
//           //     </button>
//           //   </div>
//           // </div>
//           <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%]">
//                  <div className="w-full sm:w-[50%] mr-0 sm:mr-[5%]">
//                    <p className={`text-color-${theme} text-sm`}>
//                      Are you applying as an Individual or Corporate?
//                    </p>

//                    <div className="flex mt-4 lg:w-[80%]">
//                      <button
//                       onClick={() => handleSelection("individual")}
//                       className={`flex-1 py-2 rounded-l-full text-white ${
//                         userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                       } hover:bg-[#3e9b3e] focus:outline-none`}
//                     >
//                       Individual
//                     </button>
//                     <button
//                       onClick={() => handleSelection("corporate")}
//                       className={`flex-1 py-2 rounded-r-full text-white ${
//                         userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                       } hover:bg-[#3e9b3e] focus:outline-none`}
//                     >
//                       Corporate
//                     </button>
//                   </div>
//                 </div>
//                 <div className="w-full sm:w-[50%] mt-6 sm:mt-0">
//                   <p className={`text-color-${theme} text-sm`}>
//                     How would you like to create your identity?
//                   </p>
//                 </div>
//               </div>
          
//         ) : (
//           <div className="w-full">
//             {isLoading ? (
//               <Loader /> // Show loader while API is pending
//             ) : (
//               <>
//                 <p className={`text-color-${theme} text-sm `}>Select your identity</p>
//               <div className="flex mt-4">
//               <select
//                 style={{ width: '80%', borderRadius: '15px', backgroundColor: "#152e4d" }}
//                 value={selectedIdentity?.value || ""}
//                 onChange={(e) => {
//                   handleIdentityChange(e);
//                   const selectedIdentity = identitiesData.find(identity => identity.value === e.target.value);
                  
//                   console.log("E target value:", e.target.value);  // Correct logging of the event value
//                   if (selectedIdentity) {
//                     console.log("Selected Identity Value:", selectedIdentity.value);  // Correctly log selected identity's value
//                     console.log("Selected Identity:", selectedIdentity);  // Log full selected identity object
//                   } else {
//                     console.log("No identity found for the selected value");
//                   }
//                 }}
//               >
//                 {/* Placeholder option */}
//                 <option value="" disabled>Select the identity</option>

//                 {/* Render identities */}
//                 {identitiesData.length > 0
//                   ? identitiesData.map((identity, index) => (
//                       <option key={identity.value || index} value={identity.value}>
//                         {identity.label}
//                       </option>
//                     ))
//                   : <option value="">No Identity Available</option>
//                 }
//               </select>


//                 <button
//                   className="ml-3 p-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
//                   onClick={() => setIsNewIdentity(true)}
//                 >
//                   <HiUserAdd color="white" size="24px" />
//                 </button>
//               </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserType;


// 2nd Last

// import React, { useState, useEffect } from "react";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { FaRegClock } from "react-icons/fa";
// import { FaEye } from "react-icons/fa";
// import { HiUserAdd } from "react-icons/hi";
// import { useTheme } from "../../../contexts/themeContext";
// import { getIdentityList } from "../../../api/userApi";
// import Loader from "../../../components/ui/loader";
// import axios from "axios";

// const UserType = ({ onSelection, fundData, referenceDocuments }) => {
//   const { theme } = useTheme();
//   const [userType, setUserType] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [isNewIdentity, setIsNewIdentity] = useState(false);
//   const [selectedIdentity, setSelectedIdentity] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [identitiesData, setIdentitiesData] = useState([]);
//   const cancelTokenSource = axios.CancelToken.source();

//   useEffect(() => {
//     loadIdentitiesData();
//     return () => {
//       cancelTokenSource.cancel("Component unmounted");
//     };
//   }, [fundData]);

//   const loadIdentitiesData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getIdentityList(cancelTokenSource.token, fundData?.id);
//       if (response.success) {
//         setIdentitiesData(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching identities:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelection = (type) => {
//     setUserType(type);
//     onSelection(type);
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleIdentityChange = (e) => {
//     const selectedOption = identitiesData.find(option => option.value === e.target.value);
//     setSelectedIdentity(selectedOption);
//     onSelection(selectedOption);
//   };

//   const isNextButtonDisabled = () => {
//     if (isNewIdentity) {
//       return !userType;
//     } else {
//       return !selectedIdentity;
//     }
//   };

//   return (
//     <div className={`w-full flex flex-col items-center bg-transparent font-${theme} text-${theme}`}>
//       <h3 className={`text-color-h3-${theme} text-2xl sm:text-xl md:text-2xl font-light mt-6`}>
//         Let's start with the basics.
//       </h3>
//       <p className="text-slate-500 text-xs sm:text-sm font-light mt-2 text-center sm:text-left">
//         Please select if you are applying as an individual or corporate. You may attach an existing identity or create a new one.
//       </p>

//       <div
//           className={`flex flex-col sm:flex-row bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[10%] w-[90%] sm:w-[80%] mt-8 items-center p-4`}
//         >
//           <div className="flex items-center mb-4 sm:mb-0 sm:ml-2">
//             <img
//               src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
//               alt="Image"
//               className="w-15 h-12 mr-2 rounded-[3px]"
//             />
//             <h2 className={`text-color-${theme} text-sm font-normal`}>
//               Demo Fund
//             </h2>
//           </div>
//           <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light mb-4 sm:mb-0`}>
//             <p className="flex items-center">
//               <IoCheckmarkDoneCircleOutline
//                 className={`text-color-button1-${theme}`}
//               />{" "}
//               Fund's KYC: Accepted
//             </p>
//             <p className="text-slate-500 flex items-center">
//               <IoCheckmarkDoneCircleOutline
//                 className={`text-color-button1-${theme}`}
//               />{" "}
//               Fund Domicile: Singapore
//             </p>
//           </div>
//           <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light`}>
//             <p className="flex items-center">
//               <FaRegClock className={`text-color-button1-${theme}`} /> Dealing
//               Cycle: Interval
//             </p>
//             <p className="text-slate-500 flex items-center">
//               <IoCheckmarkDoneCircleOutline
//                 className={`text-color-button1-${theme}`}
//               />{" "}
//               Digital Fund: Active
//             </p>
//           </div>
//         </div>
//         <div
//         className={`bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[20%] w-[90%] sm:w-[80%] mt-8 p-4`}
//       >
//         <div
//           className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}
//         >
//           <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
//             Account Description
//           </p>
//         </div>
//         <p className={`text-color-${theme} text-xs sm:text-sm font-light p-3`}>Demo</p>
//       </div>


//         <div
//           className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] sm:h-[10%] sm:w-[80%] mt-4 w-[80%] justify-between items-center`}
//         >
//           <p className={`text-color-${theme} text-xs sm:text-sm font-extrabold m-3`}>
//             Reference Documents
//           </p>
//           <button
//             onClick={toggleCollapse}
//             className="text-slate-500 hover:text-slate-700"
//           >
//             {isCollapsed ? <FaRegClock /> : <IoCheckmarkDoneCircleOutline />}
//           </button>
//         </div>

//         {!isCollapsed && (
//           <div className="w-[80%] mt-4">
//             {referenceDocuments?.length > 0 ? (
//               referenceDocuments.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-lg p-3 mb-2`}
//                 >
//                   <div>
//                     <p className={`mb-0 text-xs font-semibold text-color-${theme}`}>{item?.title}</p>
//                     <p className={`mb-0 text-xs text-gray-500`}>{item?.description}</p>
//                   </div>
//                   <button
//                     className={`p-2 rounded-full bg-gradient-card-${theme} flex items-center justify-center`}
//                     style={{
//                       height: '30px',
//                       width: '30px',
//                     }}
//                   >
//                     <FaEye />
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className={`text-color-${theme} text-xs`}>
//                 No reference documents available.
//               </p>
//             )}
//           </div>
//         )}

//         <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

//       {/* Identity Selection Section */}
//       <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%] mt-8">
//         {isNewIdentity ? (
//           <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%]">
//             <div className="w-full sm:w-[50%] mr-0 sm:mr-[5%]">
//               <p className={`text-color-${theme} text-sm`}>
//                 Are you applying as an Individual or Corporate?
//               </p>

//               <div className="flex mt-4 lg:w-[80%]">
//                 <button
//                   onClick={() => handleSelection("individual")}
//                   className={`flex-1 py-2 rounded-l-full text-white ${
//                     userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                   } hover:bg-[#3e9b3e] focus:outline-none`}
//                 >
//                   Individual
//                 </button>
//                 <button
//                   onClick={() => handleSelection("corporate")}
//                   className={`flex-1 py-2 rounded-r-full text-white ${
//                     userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                   } hover:bg-[#3e9b3e] focus:outline-none`}
//                 >
//                   Corporate
//                 </button>
//               </div>
//             </div>
//             <div className="w-full sm:w-[50%] mt-6 sm:mt-0">
//               <p className={`text-color-${theme} text-sm`}>
//                 How would you like to create your identity?
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="w-full">
//             {isLoading ? (
//               <Loader theme={theme} />
//             ) : (
//               <>
//                 <p className={`text-color-${theme} text-sm`}>Select your identity</p>
//                 <div className="flex mt-4">
//                   <select
//                     style={{ width: '80%', borderRadius: '15px', backgroundColor: "#152e4d" }}
//                     value={selectedIdentity?.value || ""}
//                     onChange={handleIdentityChange}
//                   >
//                     <option value="" disabled>Select the identity</option>
//                     {identitiesData.length > 0
//                       ? identitiesData.map((identity) => (
//                           <option key={identity.value} value={identity.value}>
//                             {identity.label}
//                           </option>
//                         ))
//                       : <option value="">No Identity Available</option>
//                     }
//                   </select>

//                   <button
//                     className="ml-3 p-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
//                     onClick={() => setIsNewIdentity(true)}
//                   >
//                     <HiUserAdd color="white" size="24px" />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>

//       {/* NEXT button */}
//       <button
//         className={`mt-6 px-6 py-2 rounded-full text-white ${
//           isNextButtonDisabled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3e9b3e] hover:bg-[#45b145]'
//         } focus:outline-none`}
//         disabled={isNextButtonDisabled()}
//         onClick={() => setIsNewIdentity(true)}
//       >
//         NEXT
//       </button>
//     </div>
//   );
// };

// export default UserType;



//Best Code
import React, { useState, useEffect } from "react";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { useTheme } from "../../../contexts/themeContext";
import { getIdentityList, getParticularsDetailByIdentityIdAPI } from "../../../api/userApi";
import Loader from "../../../components/ui/loader";
import axios from "axios";

const UserType = ({ onSelection, onNext, fundData, referenceDocuments }) => {
  const { theme } = useTheme();
  const [userType, setUserType] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isNewIdentity, setIsNewIdentity] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [identitiesData, setIdentitiesData] = useState([]);
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    loadIdentitiesData();
    return () => {
      cancelTokenSource.cancel("Component unmounted");
    };
  }, [fundData]);

  const loadIdentitiesData = async () => {
    setIsLoading(true);
    try {
      const response = await getIdentityList(cancelTokenSource.token, fundData?.id);
      if (response.success) {
        setIdentitiesData(response.data);
      }
    } catch (error) {
      console.error("Error fetching identities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentityChange = async (e) => {
    const selectedOption = identitiesData.find((option) => option.id === e.target.value);
    setSelectedIdentity(selectedOption);

    console.log("Selected Identity:", selectedOption);
    
    // Call API only when identity is selected, not when a new identity is created
    if (!isNewIdentity && selectedOption) {
      try {
        const response = await getParticularsDetailByIdentityIdAPI(selectedOption.id, cancelTokenSource.token);
        if (response.success) {
          console.log("Particulars Detail:", response.data);
          onSelection(selectedOption);  // Proceed with selected identity data
        }
      } catch (error) {
        console.error("Error fetching particulars detail:", error);
      }
    }
  };

  //   const handleSelection = (type) => {
  //   setUserType(type);
  //   onSelection(type);
  // };
  const handleSelection = (type) => {
    setUserType(type);
    onSelection({ type, isNewIdentity: true });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // const isNextButtonDisabled = () => {
  //   if (isNewIdentity) {
  //     return !userType;
  //   } else {
  //     return !selectedIdentity;
  //   }
  // };

  return (
    <div className={`w-full flex flex-col items-center bg-transparent font-${theme} text-${theme}`}>
      <h3 className={`text-color-h3-${theme} text-2xl sm:text-xl md:text-2xl font-light mt-6`}>
        Let's start with the basics.
      </h3>
      <p className="text-slate-500 text-xs sm:text-sm font-light mt-2 text-center sm:text-left">
        Please select if you are applying as an individual or corporate. You may attach an existing identity or create a new one.
      </p>

      <div className={`flex flex-col sm:flex-row bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[10%] w-[90%] sm:w-[80%] mt-8 items-center p-4`}>
        <div className="flex items-center mb-4 sm:mb-0 sm:ml-2">
          <img
            src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
            alt="Image"
            className="w-15 h-12 mr-2 rounded-[3px]"
          />
          <h2 className={`text-color-${theme} text-sm font-normal`}>Demo Fund</h2>
        </div>
        <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light mb-4 sm:mb-0`}>
          <p className="flex items-center">
            <IoCheckmarkDoneCircleOutline className={`text-color-button1-${theme}`} />{" "}
            Fund's KYC: Accepted
          </p>
          <p className="text-slate-500 flex items-center">
            <IoCheckmarkDoneCircleOutline className={`text-color-button1-${theme}`} />{" "}
            Fund Domicile: Singapore
          </p>
        </div>
        <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light`}>
          <p className="flex items-center">
            <FaRegClock className={`text-color-button1-${theme}`} /> Dealing Cycle: Interval
          </p>
          <p className="text-slate-500 flex items-center">
            <IoCheckmarkDoneCircleOutline className={`text-color-button1-${theme}`} />{" "}
            Digital Fund: Active
          </p>
        </div>
      </div>

      <div className={`bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[20%] w-[90%] sm:w-[80%] mt-8 p-4`}>
        <div className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}>
          <p className={`text-color-${theme} text-xs font-extrabold m-3`}>Account Description</p>
        </div>
        <p className={`text-color-${theme} text-xs sm:text-sm font-light p-3`}>Demo</p>
      </div>

      <div className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] sm:h-[10%] sm:w-[80%] mt-4 w-[80%] justify-between items-center`}>
        <p className={`text-color-${theme} text-xs sm:text-sm font-extrabold m-3`}>Reference Documents</p>
        <button
          onClick={toggleCollapse}
          className="text-slate-500 hover:text-slate-700"
        >
          {isCollapsed ? <FaRegClock /> : <IoCheckmarkDoneCircleOutline />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="w-[80%] mt-4">
          {referenceDocuments?.length > 0 ? (
            referenceDocuments.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-lg p-3 mb-2`}
              >
                <div>
                  <p className={`mb-0 text-xs font-semibold text-color-${theme}`}>{item?.title}</p>
                  <p className="mb-0 text-xs text-gray-500">{item?.description}</p>
                </div>
                <button
                  className={`p-2 rounded-full bg-gradient-card-${theme} flex items-center justify-center`}
                  style={{ height: '30px', width: '30px' }}
                >
                  <FaEye />
                </button>
              </div>
            ))
          ) : (
            <p className={`text-color-${theme} text-xs`}>No reference documents available.</p>
          )}
        </div>
      )}

      <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

      {/* Identity selection UI */}
      {/* <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%] mt-8">
        {isNewIdentity ? (
          <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%]">
            <div className="w-full sm:w-[50%] mr-0 sm:mr-[5%]">
              <p className={`text-color-${theme} text-sm`}>Are you applying as an Individual or Corporate?</p>
                <div className="flex mt-4 lg:w-[80%]">
                 <button
                  onClick={() => handleSelection("individual")}
                  className={`flex-1 py-2 rounded-l-full text-white ${
                    userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
                  } hover:bg-[#3e9b3e] focus:outline-none`}
                >
                  Individual
                </button>
                <button
                  onClick={() => handleSelection("corporate")}
                  className={`flex-1 py-2 rounded-r-full text-white ${
                    userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
                  } hover:bg-[#3e9b3e] focus:outline-none`}
                >
                  Corporate
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isLoading ? (
              <div className="min-h-[50px] flex justify-center items-center">
                <Loader theme={theme} />
              </div>
            ) : (
              <>
                <p className={`text-color-${theme} text-sm`}>Select your identity</p>
                <div className="flex mt-4">
                  <select
                    style={{ width: '80%', borderRadius: '15px', backgroundColor: "#152e4d" }}
                    value={selectedIdentity ? selectedIdentity.id : ""}
                    onChange={handleIdentityChange}
                  >
                    <option value="" disabled>Select the identity</option>
                    {identitiesData.length > 0
                      ? identitiesData.map((identity) => (
                          <option key={identity.id} value={identity.id}>
                            {identity.label}
                          </option>
                        ))
                      : <option value="">No Identity Available</option>
                    }
                  </select>

                  <button
                    className="ml-3 p-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    onClick={() => setIsNewIdentity(true)}
                  >
                    <HiUserAdd color="white" size="24px" />
                  </button>
                </div>
              </> */}
              <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%] mt-8">
        {isNewIdentity ? (
          <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%]">
            <div className="w-full sm:w-[50%] mr-0 sm:mr-[5%]">
              <p className={`text-color-${theme} text-sm`}>Are you applying as an Individual or Corporate?</p>
                <div className="flex mt-4 lg:w-[80%]">
                 <button
                  onClick={() => handleSelection("individual")}
                  className={`flex-1 py-2 rounded-l-full text-white ${
                    userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
                  } hover:bg-[#3e9b3e] focus:outline-none`}
                >
                  Individual
                </button>
                <button
                  onClick={() => handleSelection("corporate")}
                  className={`flex-1 py-2 rounded-r-full text-white ${
                    userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
                  } hover:bg-[#3e9b3e] focus:outline-none`}
                >
                  Corporate
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isLoading ? (
              <div className="min-h-[50px] flex justify-center items-center">
                <Loader theme={theme} />
              </div>
            ) : (
              <>
                <p className={`text-color-${theme} text-sm`}>Select your identity</p>
                <div className="flex mt-4">
                  <select
                    style={{ width: '80%', borderRadius: '15px', backgroundColor: "#152e4d" }}
                    value={selectedIdentity ? selectedIdentity.id : ""}
                    onChange={handleIdentityChange}
                  >
                    <option value="" disabled>Select the identity</option>
                    {identitiesData.length > 0
                      ? identitiesData.map((identity) => (
                          <option key={identity.id} value={identity.id}>
                            {identity.label}
                          </option>
                        ))
                      : <option value="">No Identity Available</option>
                    }
                  </select>

                  <button
                    className="ml-3 p-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    onClick={() => setIsNewIdentity(true)}
                  >
                    <HiUserAdd color="white" size="24px" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* <button
        onClick={onNext}
        disabled={isNextButtonDisabled()}
        className={`mt-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-full ${
          isNextButtonDisabled() ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
        }`}
      >
        Next
      </button> */}
    </div>
  );
};

export default UserType;




// import React, { useState } from "react";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { FaRegClock } from "react-icons/fa6";
// import { FaEye } from "react-icons/fa";
// import { useTheme } from "../../../contexts/themeContext";
// import DropdownField from "../../../components/ui/dropdown/DropdownField";

// const UserType = ({ onSelection, referenceDocuments, fundFields }) => {
//   const { theme } = useTheme();
//   const [userType, setUserType] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [isNewIdentity, setIsNewIdentity] = useState(true);

//   const handleSelection = (type) => {
//     setUserType(type);
//     onSelection(type);
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   let arrayCombined = [
//     ...(Array.isArray(fundFields?.s_f) ? fundFields.s_f : []),
//     ...(Array.isArray(fundFields?.e_f) ? fundFields.e_f : []),
//     ...(Array.isArray(fundFields?.c_f) ? fundFields.c_f : []),
//   ];
  
//   console.log("Combined Array is:", arrayCombined);
  
  

//   return (
//     <>
//       <div
//         className={`w-full flex flex-col items-center bg-transparent font-${theme} text-${theme}`}
//       >
//         <h3 className={`text-color-h3-${theme} text-2xl sm:text-xl md:text-2xl font-light mt-6`}>
//           Let's start with the basics.
//         </h3>
//         <p className="text-slate-500 text-xs sm:text-sm font-light mt-2 text-center sm:text-left">
//           Please select if you are applying as an individual or corporate. You
//           may attach an existing identity or create a new one.
//         </p>

      //   <div
      //     className={`flex flex-col sm:flex-row bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[10%] w-[90%] sm:w-[80%] mt-8 items-center p-4`}
      //   >
      //     <div className="flex items-center mb-4 sm:mb-0 sm:ml-2">
      //       <img
      //         src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
      //         alt="Image"
      //         className="w-15 h-12 mr-2 rounded-[3px]"
      //       />
      //       <h2 className={`text-color-${theme} text-sm font-normal`}>
      //         Demo Fund
      //       </h2>
      //     </div>
      //     <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light mb-4 sm:mb-0`}>
      //       <p className="flex items-center">
      //         <IoCheckmarkDoneCircleOutline
      //           className={`text-color-button1-${theme}`}
      //         />{" "}
      //         Fund's KYC: Accepted
      //       </p>
      //       <p className="text-slate-500 flex items-center">
      //         <IoCheckmarkDoneCircleOutline
      //           className={`text-color-button1-${theme}`}
      //         />{" "}
      //         Fund Domicile: Singapore
      //       </p>
      //     </div>
      //     <div className={`text-color-${theme} sm:ml-[10%] lg:ml-[20%] text-xs font-light`}>
      //       <p className="flex items-center">
      //         <FaRegClock className={`text-color-button1-${theme}`} /> Dealing
      //         Cycle: Interval
      //       </p>
      //       <p className="text-slate-500 flex items-center">
      //         <IoCheckmarkDoneCircleOutline
      //           className={`text-color-button1-${theme}`}
      //         />{" "}
      //         Digital Fund: Active
      //       </p>
      //     </div>
      //   </div>
      //   <div
      //   className={`bg-color-card-${theme} rounded-lg shadow-lg h-auto sm:h-[20%] w-[90%] sm:w-[80%] mt-8 p-4`}
      // >
      //   <div
      //     className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}
      //   >
      //     <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
      //       Account Description
      //     </p>
      //   </div>
      //   <p className={`text-color-${theme} text-xs sm:text-sm font-light p-3`}>Demo</p>
      // </div>


      //   <div
      //     className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] sm:h-[10%] sm:w-[80%] mt-4 w-[80%] justify-between items-center`}
      //   >
      //     <p className={`text-color-${theme} text-xs sm:text-sm font-extrabold m-3`}>
      //       Reference Documents
      //     </p>
      //     <button
      //       onClick={toggleCollapse}
      //       className="text-slate-500 hover:text-slate-700"
      //     >
      //       {isCollapsed ? <FaRegClock /> : <IoCheckmarkDoneCircleOutline />}
      //     </button>
      //   </div>

      //   {!isCollapsed && (
      //     <div className="w-[80%] mt-4">
      //       {referenceDocuments?.length > 0 ? (
      //         referenceDocuments.map((item, index) => (
      //           <div
      //             key={index}
      //             className={`flex justify-between items-center bg-color-card-${theme} rounded-lg shadow-lg p-3 mb-2`}
      //           >
      //             <div>
      //               <p className={`mb-0 text-xs font-semibold text-color-${theme}`}>{item?.title}</p>
      //               <p className={`mb-0 text-xs text-gray-500`}>{item?.description}</p>
      //             </div>
      //             <button
      //               className={`p-2 rounded-full bg-gradient-card-${theme} flex items-center justify-center`}
      //               style={{
      //                 height: '30px',
      //                 width: '30px',
      //               }}
      //             >
      //               <FaEye />
      //             </button>
      //           </div>
      //         ))
      //       ) : (
      //         <p className={`text-color-${theme} text-xs`}>
      //           No reference documents available.
      //         </p>
      //       )}
      //     </div>
      //   )}

      //   <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

        
//         {/* Started Working on the UserType Screen from here */}

//                   { !isNewIdentity && (
//               <Row className="justify-content-center">
//                 <Col xs={12} md={12} lg={12} xl={12}>
//                   {shouldShowSelect && (
//                     <Form.Label>
//                       Select the identity you would like to attach this
//                       account
//                     </Form.Label>
//                   )}
//                   <div className="d-flex">
//                     {shouldShowSelect ? (
//                       <div
//                         className="form-group"
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           width: '100%',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <div style={{ width: '90%' }}>
//                           <DropdownField
//                             placeholder="Select Identity"
//                             isSearchable={true}
//                             styles={customStyles}
//                             filterOption={customFilter}
//                             options={
//                               options[0] != undefined &&
//                               options[0] != 'undefined'
//                                 ? options
//                                 : {
//                                     value: '',
//                                     label: (
//                                       <div
//                                         style={{
//                                           display: 'flex',
//                                           alignItems: 'center',
//                                         }}
//                                       >
//                                         There is no Identity available to
//                                         attached this fund
//                                       </div>
//                                     ),
//                                   }
//                             }
//                             value={
//                               selectedIdentity.value == ''
//                                 ? {
//                                     value: '',
//                                     label: 'Please select an identity', // Change this to your desired prompt
//                                   }
//                                 : selectedIdentity
//                             }
//                             onChange={(selectedOption) =>
//                               setSelectedIdentity(selectedOption)
//                             }
//                           />
//                         </div>
//                         <OverlayTrigger
//                           overlay={<Tooltip>Create New Identity</Tooltip>}
//                         >
//                           <div
//                             style={{
//                               marginLeft: '10px',
//                               cursor: 'pointer',
//                             }}
//                             onClick={(e) => {
//                               setSelectedIdentity({ value: null }),
//                                 setIsNewIdentity(true);
//                               props.setIsNewIdentity(true);
//                             }}
//                           >
//                             <HiUserAdd color="green" size="50px" />
//                           </div>
//                         </OverlayTrigger>
//                       </div>
//                     ) : (
//                       <>
//                       <OverlayTrigger
//                           overlay={<Tooltip>Create New Identity</Tooltip>}
//                         >
//                           <div
//                             style={{
//                               marginLeft: '10px',
//                               cursor: 'pointer',
//                             }}
//                             onClick={(e) => {
//                               setSelectedIdentity({ value: null }),
//                                 setIsNewIdentity(true);
//                               props.setIsNewIdentity(true);
//                             }}
//                           >
//                             <HiUserAdd color="green" size="50px" />
//                           </div>
//                         </OverlayTrigger>
//                       </>
//                     )}
//                   </div>
//                     {!shouldShowSelect && (
//                       <div
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'center',
//                           flexDirection: 'column',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <p style={{ color: 'gray' }}>
//                           No options available. Please create a new one.
//                         </p>
//                         <OverlayTrigger
//                           overlay={<Tooltip>Create New Identity</Tooltip>}
//                         >
//                           <div
//                             style={{
//                               marginLeft: '10px',
//                               cursor: 'pointer',
//                             }}
//                             onClick={(e) => {
//                               setSelectedIdentity({ value: null }),
//                                 setIsNewIdentity(true);
//                             }}
//                           >
//                             <HiUserAdd color="green" size="50px" />
//                           </div>
//                         </OverlayTrigger>
//                       </div>
//                     )}
//                   </Col>
//                 </Row>
//               ) : (
//                 <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%]">
//                 <div className="w-full sm:w-[50%] mr-0 sm:mr-[5%]">
//                   <p className={`text-color-${theme} text-sm`}>
//                     Are you applying as an Individual or Corporate?
//                   </p>

//                   <div className="flex mt-4 lg:w-[80%]">
//                     <button
//                       onClick={() => handleSelection("individual")}
//                       className={`flex-1 py-2 rounded-l-full text-white ${
//                         userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                       } hover:bg-[#3e9b3e] focus:outline-none`}
//                     >
//                       Individual
//                     </button>
//                     <button
//                       onClick={() => handleSelection("corporate")}
//                       className={`flex-1 py-2 rounded-r-full text-white ${
//                         userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                       } hover:bg-[#3e9b3e] focus:outline-none`}
//                     >
//                       Corporate
//                     </button>
//                   </div>
//                 </div>
//                 <div className="w-full sm:w-[50%] mt-6 sm:mt-0">
//                   <p className={`text-color-${theme} text-sm`}>
//                     How would you like to create your identity?
//                   </p>
//                 </div>
//               </div>
//             )}

//           {/* Till Here */}

//       </div>
//     </>
//   );
// };

// export default UserType;



{/* <div className="flex flex-col sm:flex-row w-[90%] sm:w-[80%]">
          <div className="w-full sm:w-[50%] mr-0 sm:mr-[5%]">
            <p className={`text-color-${theme} text-sm`}>
              Are you applying as an Individual or Corporate?
            </p>

            <div className="flex mt-4 lg:w-[80%]">
              <button
                onClick={() => handleSelection("individual")}
                className={`flex-1 py-2 rounded-l-full text-white ${
                  userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
                } hover:bg-[#3e9b3e] focus:outline-none`}
              >
                Individual
              </button>
              <button
                onClick={() => handleSelection("corporate")}
                className={`flex-1 py-2 rounded-r-full text-white ${
                  userType === "corporate" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
                } hover:bg-[#3e9b3e] focus:outline-none`}
              >
                Corporate
              </button>
            </div>
          </div>
          <div className="w-full sm:w-[50%] mt-6 sm:mt-0">
            <p className={`text-color-${theme} text-sm`}>
              How would you like to create your identity?
            </p>
          </div>
        </div> */}