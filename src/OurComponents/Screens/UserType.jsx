// import React, { useState, useMemo } from 'react';
// import formData from '../Data/fieldsData.json';
// import SideBar from '../SideBar';
// import DropdownField from '../DropdownField';
// import TextField from '../TextField';

// const UserType = () => {
//   const [userType, setUserType] = useState('');
//   const [formValues, setFormValues] = useState({});
//   const [showForm, setShowForm] = useState(false); // State to manage form visibility

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handleNationalityChange = (e) => {
//     const { name, value } = e.target;
//     const selectedNationality = formData.fields['nationality'].source.data.find(
//       (option) => option.id === value
//     );
//     const nationalityCode = selectedNationality ? selectedNationality.code : '';

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//       nationality_code: nationalityCode,
//     }));
//   };

//   const filteredFields = useMemo(() => {
//     if (!formData?.fields) return [];

//     return Object.entries(formData.fields).filter(([key, field]) => {
//       if (userType === 'individual') {
//         return key.startsWith('individual') && (field.for === 'all' || field.for === 'root');
//       } else if (userType === 'crp') {
//         return key.startsWith('corporate') && (field.for === 'all' || field.for === 'crp' || field.for === 'root');
//       }
//       return false;
//     });
//   }, [userType]);

//   const renderOptions = (field) => {
//     if (field.source?.type === 'table') {
//       return field.source.data.map((option) => (
//         <option key={option.id} value={option[field.source.returnKey]}>
//           {option.name}
//         </option>
//       ));
//     } else if (field.source?.type === 'enum') {
//       return Object.entries(field.source.data).map(([key, option]) => (
//         <option key={key} value={option.key}>
//           {option.name}
//         </option>
//       ));
//     }
//     return null;
//   };

//   const renderField = (key, field) => {
//     const fieldId = key.split('.').join('_');
//     const commonProps = {
//       id: fieldId,
//       name: fieldId,
//       required: field.required,
//       value: formValues[fieldId] || '',
//       onChange: field.type === 'radio' ? handleInputChange : (fieldId === 'nationality' ? handleNationalityChange : handleInputChange),
//       label: field.label,
//     };

//     switch (field.type) {
//       case 'select':
//       case 'dd':
//         return <DropdownField {...commonProps} options={renderOptions(field)} />;
//       case 'text':
//       case 'email':
//       case 'password':
//       case 'date':
//         return <TextField {...commonProps} type={field.type} placeholder={field.label} />;
//       case 'radio':
//         return (
//           <div>
//             {Object.entries(field.source.data).map(([key, option]) => (
//               <div key={key} className="flex items-center mb-2">
//                 <input
//                   type="radio"
//                   id={`${fieldId}_${key}`}
//                   name={fieldId}
//                   value={option.key}
//                   checked={formValues[fieldId] === option.key}
//                   onChange={handleInputChange}
//                   className="mr-2"
//                 />
//                 <label htmlFor={`${fieldId}_${key}`} className="text-white">
//                   {option.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return <div className="text-red-500">Unsupported field type: {field.type}</div>;
//     }
//   };

//   const handleNextClick = () => {
//     // Log the form values or handle navigation as needed
//     console.log('Form Values:', formValues);
//   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90%">
// //     <SideBar portalType="Customer" />
// //     <div className=" bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-2xl w-[80%] flex flex-col justify-center items-center"></div>
// //     <div className=" p-6 bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-2xl w-[80%] mx-[11%]">
// //       {!showForm ? (
// //         <div className="mb-4 w-[80%] mx-[10%]">
// //           <label className="block text-sm mb-2 text-white">Select User Type:</label>
// //           <select
// //             value={userType}
// //             onChange={(e) => {
// //               setUserType(e.target.value);
// //               setShowForm(true); // Show form after selecting user type
// //             }}
// //             className="bg-[#1e3a5c] p-3 rounded-md text-white h-11 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           >
// //             <option value="">Select User Type</option>
// //             <option value="individual">Individual</option>
// //             <option value="crp">Corporate</option>
// //           </select>
// //         </div>
// //       ) : (
// //         <div>
// //           <button
// //             className="mb-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
// //             onClick={() => setShowForm(false)}
// //           >
// //             Back
// //           </button>
// //           <form onSubmit={(e) => e.preventDefault()}>
// //             {filteredFields.map(([key, field]) => (
// //               <div key={key} className="mb-4">
// //                 <label
// //                   className={`block text-sm mb-2 ${field.required ? 'text-white' : 'text-white'}`}
// //                   htmlFor={key.split('.').join('_')}
// //                 >
// //                   {field.label}
// //                   {field.required && <span className="text-red-500">*</span>}
// //                 </label>
// //                 {renderField(key, field)}
// //               </div>
// //             ))}
// //             <button
// //               className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
// //               onClick={handleNextClick}
// //             >
// //               Next
// //             </button>
// //           </form>
// //         </div>
// //       )}
// //     </div>
// //     </div>
// //   );
// return (
//     <div className="min-h-screen flex bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90%">
//       <SideBar portalType="Customer" />
//       <div className="bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-2xl w-[80%] ml-[15%] flex flex-col items-center justify-center">
//         {!showForm ? (
//           <div className="mb-4 w-[80%]">
//             <label className="block text-sm mb-2 text-white">Select User Type:</label>
//             <select
//               value={userType}
//               onChange={(e) => {
//                 setUserType(e.target.value);
//                 setShowForm(true); // Show form after selecting user type
//               }}
//               className="bg-[#1e3a5c] p-3 rounded-md text-white h-11 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select User Type</option>
//               <option value="individual">Individual</option>
//               <option value="crp">Corporate</option>
//             </select>
//           </div>
//         ) : (
//           <div className="w-full flex flex-col justify-between h-full">
//             <button
//               className="mb-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 self-start"
//               onClick={() => setShowForm(false)}
//             >
//               Back
//             </button>
//             <form onSubmit={(e) => e.preventDefault()} className="flex-grow flex flex-col justify-center items-center">
//               {filteredFields.map(([key, field]) => (
//                 <div key={key} className="mb-4 w-[80%]">
//                   <label
//                     className={`block text-sm mb-2 ${field.required ? 'text-white' : 'text-white'}`}
//                     htmlFor={key.split('.').join('_')}
//                   >
//                     {field.label}
//                     {field.required && <span className="text-red-500">*</span>}
//                   </label>
//                   {renderField(key, field)}
//                 </div>
//               ))}
//             </form>
//             <div className="mt-auto flex justify-end w-full p-6">
//               <button
//                 className="bg-green-500 text-white p-2 rounded hover:bg-green-600 ml-auto"
//                 onClick={handleNextClick}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

// };

// export default UserType;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import SideBar from '../SideBar';
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { FaRegClock } from "react-icons/fa6";

// const EntityTypeSelection = () => {
//   const navigate = useNavigate();

//   const handleSelection = (type) => {
//     navigate('/user-form', { state: { userType: type } });
//   };

//   return (
//     <>
//     <SideBar portalType="Customer" />
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90%">
//     <div className="bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-2xl w-[80%] flex flex-col items-center h-[600px]">
//         <h3 className='text-white text-2xl font-light mt-6'>Let’s start with the basics.</h3>
//         <p className='text-slate-500 text-xs font-light mt-2'>Please select if you are applying as an individual or corporate. You may an attach an existing identity or create a new one.</p>

//       <div className='flex bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] h-[10%] w-[80%] mt-8 items-center'>
//         <div className='flex items-center ml-2'>
//             <img src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png" alt="Image" className='w-15 h-12 mr-2 rounded-[3px]' />
//             <h2 className='text-white text-sm font-normal'>Demo Fund</h2>
//         </div>

//         {/* Column 2: Two-line Text */}
//         <div className='text-white ml-[20%] text-xs font-light'>
//             <p className='flex items-center'><IoCheckmarkDoneCircleOutline color='green' />Fund's KYC: Accepted</p>
//             <p className='text-slate-500 flex items-center'><IoCheckmarkDoneCircleOutline color='green' />Fund Domicile:Singapore</p>
//         </div>

//         {/* Column 3: Two-line Text */}
//         <div className='text-white ml-[20%] text-xs font-light'>
//             <p className='flex items-center'><FaRegClock color='green'/> Dealing Cycle: Interval</p>
//             <p className='text-slate-500 flex items-center'><IoCheckmarkDoneCircleOutline color='green' /> Digital Fund:Active </p>
//         </div>
//       </div>

//     <div className='bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] h-[20%] w-[80%] mt-8'>
//     <div className='flex bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] h-[50%] w-[100%]'>
//        <p className='text-white text-xs font-light m-3'>Account Description</p>
//     </div>
//        <p className='text-white text-xs font-light p-3'> Demo </p>
//     </div>

//     <div className='flex bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] h-[10%] mt-4 w-[80%]'>
//        <p className='text-white text-xs font-light m-3'>Reference Documents</p>
//     </div>

//     <hr className=" w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

//       <div className="bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] w-[80%] p-3 flex flex-col items-center mt-4">
//         <div className="w-full">
//           <label className="block text-sm mb-2 text-white">Select User Type:</label>
//           <select
//             onChange={(e) => handleSelection(e.target.value)}
//             className="bg-[#1e3a5c] p-3 rounded-md text-white h-11 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select User Type</option>
//             <option value="individual">Individual</option>
//             <option value="crp">Corporate</option>
//           </select>
//         </div>
//       </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default EntityTypeSelection;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SideBar from "../Reusable Components/SideBar";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { FaRegClock } from "react-icons/fa6";

// function UserType() {
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState("");

//   const handleSelection = (type) => {
//     setUserType(type);
//   };

//   const handleNextClick = () => {
//     if (userType) {
//       navigate("/user-form", { state: { userType } });
//     } else {
//       console.log("No user type selected");
//       // Optionally, display an error or prompt the user to select a type
//     }
//   };

//   return (
//     <>
//       {/* <SideBar portalType="Customer" /> */}
//       <div className=" w-full flex flex-col items-center h-[700px]">
//         <h3 className="text-white text-2xl font-light mt-6">
//           Let’s start with the basics.
//         </h3>
//         <p className="text-slate-500 text-xs font-light mt-2">
//           Please select if you are applying as an individual or corporate. You
//           may attach an existing identity or create a new one.
//         </p>

//         {/* Additional Content */}
//         <div className="flex bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] h-[10%] w-[80%] mt-8 items-center">
//           <div className="flex items-center ml-2">
//             <img
//               src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
//               alt="Image"
//               className="w-15 h-12 mr-2 rounded-[3px]"
//             />
//             <h2 className="text-white text-sm font-normal">Demo Fund</h2>
//           </div>
//           <div className="text-white ml-[20%] text-xs font-light">
//             <p className="flex items-center">
//               <IoCheckmarkDoneCircleOutline color="green" /> Fund's KYC:
//               Accepted
//             </p>
//             <p className="text-slate-500 flex items-center">
//               <IoCheckmarkDoneCircleOutline color="green" /> Fund Domicile:
//               Singapore
//             </p>
//           </div>
//           <div className="text-white ml-[20%] text-xs font-light">
//             <p className="flex items-center">
//               <FaRegClock color="green" /> Dealing Cycle: Interval
//             </p>
//             <p className="text-slate-500 flex items-center">
//               <IoCheckmarkDoneCircleOutline color="green" /> Digital Fund:
//               Active
//             </p>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] h-[20%] w-[80%] mt-8">
//           <div className="flex bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] h-[50%] w-[100%]">
//             <p className="text-white text-xs font-light m-3">
//               Account Description
//             </p>
//           </div>
//           <p className="text-white text-xs font-light p-3">Demo</p>
//         </div>

//         <div className="flex bg-gradient-to-r from-[#0f3057] from-10% to-[#13203f] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] h-[10%] mt-4 w-[80%]">
//           <p className="text-white text-xs font-light m-3">
//             Reference Documents
//           </p>
//         </div>

//         <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

//         {/* Toggle Buttons for User Type Selection */}
//         <div className="flex w-[80%]">
//           <div className="w-[50] mr-[20%]">
//             <p className="text-white text-sm">
//               Are you applying as an Individual or Corporate?
//             </p>
//             <div className="flex mt-5">
//               <button
//                 onClick={() => handleSelection("individual")}
//                 className={`w-[100%] py-2 rounded-l-full text-white ${
//                   userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                 } hover:bg-[#3e9b3e] focus:outline-none`}
//               >
//                 Individual
//               </button>
//               <button
//                 onClick={() => handleSelection("crp")}
//                 className={`w-[100%] py-2 rounded-r-full text-white ${
//                   userType === "crp" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
//                 } hover:bg-[#3e9b3e] focus:outline-none`}
//               >
//                 Corporate
//               </button>
//             </div>
//           </div>
//           <div className="flex w-[50]">
//             <p className="text-white text-sm">
//               How would you like to create your identity?
//             </p>
//           </div>
//         </div>
//         <hr className="w-[100%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-4 mx-8 mt-[10%]" />
//         {/* <div className='text-white space-x-[850px]'> */}
//         <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4 xs:justify-center">
//           <button
//             onClick={handleNextClick}
//             className="py-2 px-4 mb-3 border-[0.01px] text-white p-3 rounded-md hover:border-[#6e84a3] focus:outline-none"
//           >
//             Back
//           </button>
//           <button
//             onClick={handleNextClick}
//             className="py-2 px-4 mb-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserType

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { useTheme } from "../../contexts/themeContext";

const UserType = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [userType, setUserType] = useState("");

  const handleSelection = (type) => {
    setUserType(type);
  };

  const handleNextClick = () => {
    if (userType) {
      navigate("/user-form", { state: { userType } });
    } else {
      console.log("No user type selected");
    }
  };

  return (
    <div
      className={`w-full flex flex-col items-center h-[700px] bg-gradient-stepper-card-${theme} font-${theme} text-${theme}`}
    >
      <h3 className={`text-color-h3-${theme} text-2xl font-light mt-6`}>
        Let's start with the basics.
      </h3>
      <p className="text-slate-500 text-xs font-light mt-2">
        Please select if you are applying as an individual or corporate. You may
        attach an existing identity or create a new one.
      </p>

      <div
        className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] w-[80%] mt-8 items-center`}
      >
        <div className="flex items-center ml-2">
          <img
            src="https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.investor.entity.png"
            alt="Image"
            className="w-15 h-12 mr-2 rounded-[3px]"
          />
          <h2 className={`text-color-${theme} text-sm font-normal`}>
            Demo Fund
          </h2>
        </div>
        <div className={`text-color-${theme} ml-[20%] text-xs font-light`}>
          <p className="flex items-center">
            <IoCheckmarkDoneCircleOutline
              className={`text-color-button1-${theme}`}
            />{" "}
            Fund's KYC: Accepted
          </p>
          <p className="text-slate-500 flex items-center">
            <IoCheckmarkDoneCircleOutline
              className={`text-color-button1-${theme}`}
            />{" "}
            Fund Domicile: Singapore
          </p>
        </div>
        <div className={`text-color-${theme} ml-[20%] text-xs font-light`}>
          <p className="flex items-center">
            <FaRegClock className={`text-color-button1-${theme}`} /> Dealing
            Cycle: Interval
          </p>
          <p className="text-slate-500 flex items-center">
            <IoCheckmarkDoneCircleOutline
              className={`text-color-button1-${theme}`}
            />{" "}
            Digital Fund: Active
          </p>
        </div>
      </div>

      <div
        className={`bg-color-card-${theme} rounded-lg shadow-lg h-[20%] w-[80%] mt-8`}
      >
        <div
          className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[50%] w-[100%]`}
        >
          <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
            Account Description
          </p>
        </div>
        <p className={`text-color-${theme} text-xs font-light p-3`}>Demo</p>
      </div>

      <div
        className={`flex bg-color-card-${theme} rounded-lg shadow-lg h-[10%] mt-4 w-[80%]`}
      >
        <p className={`text-color-${theme} text-xs font-extrabold m-3`}>
          Reference Documents
        </p>
      </div>

      <hr className="w-[80%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />

      <div className="flex w-[80%]">
        <div className="w-[50] mr-[20%]">
          <p className={`text-color-${theme} text-sm`}>
            Are you applying as an Individual or Corporate?
          </p>
          {/* <div className="flex mt-5">
            <button
              onClick={() => handleSelection("individual")}
              className={`w-[100%] py-2 rounded-l-full text-color-${theme} ${
                userType === "individual" ? `bg-color-button1-${theme}` : `bg-color-button-${theme}`
              } hover:bg-color-${theme}-hover focus:outline-none`}
            >
              Individual
            </button>
            <button
              onClick={() => handleSelection("crp")}
              className={`w-[100%] py-2 rounded-r-full text-color-${theme} ${
                userType === "crp" ? `bg-color-button1-${theme}` : `bg-color-button-${theme}`
              } hover:bg-color-${theme}-hover focus:outline-none`}
            >
              Corporate
            </button>
          </div> */}
          <div className="flex mt-4">
            <button
              onClick={() => handleSelection("individual")}
              className={`flex-1 py-2 rounded-l-full text-white ${
                userType === "individual" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
              } hover:bg-[#3e9b3e] focus:outline-none`}
            >
              Individual
            </button>
            <button
              onClick={() => handleSelection("crp")}
              className={`flex-1 py-2 rounded-r-full text-white ${
                userType === "crp" ? "bg-[#3e9b3e]" : "bg-[#1e3a5c]"
              } hover:bg-[#3e9b3e] focus:outline-none`}
            >
              Corporate
            </button>
          </div>
        </div>
        <div className="flex w-[50]">
          <p className={`text-color-${theme} text-sm`}>
            How would you like to create your identity?
          </p>
        </div>
      </div>
      <hr className="w-[100%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-4 mx-8 mt-[10%]" />
      <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4 xs:justify-center">
        <button
          onClick={handleNextClick}
          className={`py-2 px-4 mb-3 border-[0.01px] text-color-${theme} p-3 rounded-md hover:border-[#6e84a3] focus:outline-none`}
        >
          Back
        </button>
        <button
          onClick={handleNextClick}
          className={`py-2 px-4 mb-3 bg-color-button1-${theme} text-color-${theme} p-3 rounded-md hover:bg-color-${theme}-hover focus:outline-none`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserType;
