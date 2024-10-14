// import React, { useEffect, useState } from 'react';
// import DropdownField from "../../../components/ui/dropdown/DropdownField";
// import TextField from "../../../components/ui/input/TextField";
// import { useTheme } from "../../../contexts/themeContext";
// import Loader from '../../../components/ui/loader';
// import { getParticularFieldsFromFundIdApi, postIdentityAPI } from '../../../api/userApi';
// import axios from 'axios';

// const UserForm = ({ userType, onNext, fundData }) => {
//   const { theme } = useTheme();
//   const [formValues, setFormValues] = useState({});
//   const [newFields, setNewFields] = useState({});
//   const [isLoader, setIsLoader] = useState(true);
//   const [submitLoader, setSubmitLoader] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const cancelTokenSource = axios.CancelToken.source();

//   // Handle form field value changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     if (fundData) {
//       handleParticularFields();
//     }

//     return () => {
//       cancelTokenSource.cancel();
//     };
//   }, [fundData]);

//   const handleParticularFields = async () => {
//     try {
//       const response = await getParticularFieldsFromFundIdApi(fundData?.id, cancelTokenSource.token);
//       if (response?.success) {
//         console.log("New Fields API Response:", response);
//         setNewFields(response.data.account_fields);
//       }
//     } catch (error) {
//       console.error("Error fetching fields:", error);
//     }
//   };

//   let combinedArray = [];

//   if (fundData?.fund_setting?.sections?.show_cf_to_customer) {
//     combinedArray = [
//       ...(newFields?.s_f || []),
//       ...(newFields?.c_f || []),
//       ...(newFields?.e_f || []),
//     ];
//     console.log("Combined Array is:", combinedArray);
//   } else {
//     combinedArray = [
//       ...(newFields?.s_f || []),
//       ...(newFields?.e_f || []),
//     ];
//     console.log("Combined Array is:", combinedArray);
//   }

//   const renderOptions = (data) => {
//     if (data?.source?.type === 'table' && Array.isArray(data.source.data)) {
//       return data.source.data.map((option) => (
//         <option key={option.id} value={option[data.source.returnKey]}>
//           {option.name}
//         </option>
//       ));
//     } else if (data?.source?.type === 'enum' && data.source.data) {
//       return Object.entries(data.source.data).map(([key, option]) => (
//         <option key={key} value={option.key}>
//           {option.name}
//         </option>
//       ));
//     }
//     return null;
//   };

//   const renderInput = (key, data) => {
//     if (!data) return null; // Add a safeguard to prevent errors

//     const inputId = key.split('.').join('_');
//     const commonProps = {
//       id: inputId,
//       name: inputId,
//       required: data.required,
//       value: formValues[inputId] || '',
//       onChange: handleInputChange,
//       label: data.label,
//     };

//     switch (data.type) {
//       case 'select':
//       case 'dd':
//         return <DropdownField {...commonProps} options={renderOptions(data)} />;

//       case 'text':
//       case 'email':
//       case 'password':
//       case 'date':
//         return <TextField {...commonProps} type={data.type} placeholder={data.label} />;

//       case 'check':
//         return (
//           <div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="radio"
//                 id={`${inputId}_yes`}
//                 name={inputId}
//                 value="yes"
//                 checked={formValues[inputId] === "yes"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <label htmlFor={`${inputId}_yes`} className="mr-4">
//                 Yes
//               </label>

//               <input
//                 type="radio"
//                 id={`${inputId}_no`}
//                 name={inputId}
//                 value="no"
//                 checked={formValues[inputId] === "no"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <label htmlFor={`${inputId}_no`} className="mr-4">
//                 No
//               </label>

//               <input
//                 type="radio"
//                 id={`${inputId}_na`}
//                 name={inputId}
//                 value="not_applicable"
//                 checked={formValues[inputId] === "not_applicable"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <label htmlFor={`${inputId}_na`} className="mr-4">
//                 Not Applicable
//               </label>
//             </div>
//           </div>
//         );

//       default:
//         return <div className="text-red-500">Unsupported input type: {data.type}</div>;
//     }
//   };

//   const filteredData = combinedArray?.flatMap((data) =>
//     Object.entries(data || {}).filter(([key, value]) => {
//       if (userType === 'individual') {
//         return key.startsWith('individual') && (value.for === 'all' || value.for === 'root');
//       } else if (userType === 'corporate') {
//         return key.startsWith('corporate') && (value.for === 'all' || value.for === 'crp' || value.for === 'root');
//       }
//       return false;
//     })
//   ).sort((a, b) => {
//     const indexA = a[Object.keys(a)[0]]?.index;
//     const indexB = b[Object.keys(b)[0]]?.index;
//     return indexA - indexB;
//   }) || [];

//   // Handle form submission
//   const handleSubmitCall = async (data) => {
//     console.log(formValues, 'Data of the Handle Submit');
//     setSubmitLoader(true);
//     try {
//       const response = await postIdentityAPI(data, cancelTokenSource.token);
//       if (response.success) {
//         // Handle successful response
//         console.log("Identity created successfully:", response);
//         setMessage(true); // Optionally set a success message
//       } else {
//         // Handle errors from API
//         setErrorMessage({ error: true, message: response.user_message });
//       }
//     } catch (error) {
//       setErrorMessage({ error: true, message: "An error occurred while submitting the form." });
//       console.error("Error during submission:", error);
//     } finally {
//       setSubmitLoader(false);
//     }
//   };

//   // Handle the Next button click
//   const handleNextClick = async () => {
//     await handleSubmitCall(formValues); // Submit the form
//     onNext(formValues); // Proceed to next step
//   };

//   return (
//     <div className="w-full flex flex-col justify-between h-full">
//       <form onSubmit={(e) => e.preventDefault()} className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
//         {filteredData.map(([key, data]) => (
//           <div key={key} className="w-full">
//             <label className="block text-sm mb-2 text-white" htmlFor={key.split('.').join('_')}>
//               {data.label}
//               {data.required && <span className="text-red-500">*</span>}
//             </label>
//             {renderInput(key, data)}
//           </div>
//         ))}
//       </form>
//       {errorMessage && <div className="text-red-500">{errorMessage.message}</div>}
//       <div className="mt-auto flex justify-end w-full p-6">
//         <button
//           className="py-2 px-4 mb-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
//           onClick={handleNextClick}
//           disabled={submitLoader} // Disable button while loading
//         >
//           {submitLoader ? 'Submitting...' : 'Save'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserForm;

// //My Code
// import React, { useEffect, useState } from 'react';
// import DropdownField from "../../../components/ui/dropdown/DropdownField";
// import TextField from "../../../components/ui/input/TextField";
// import { useTheme } from "../../../contexts/themeContext";
// import Loader from '../../../components/ui/loader';
// import { getParticularFieldsFromFundIdApi, postIdentityAPI, getEntityTypeAPI } from '../../../api/userApi';
// import axios from 'axios';

// const UserForm = ({ userType, onNext, fundData }) => {
//   const { theme } = useTheme();
//   const [formValues, setFormValues] = useState({});
//   const [newFields, setNewFields] = useState({});
//   const [isLoader, setIsLoader] = useState(true);
//   const [submitLoader, setSubmitLoader] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [entityTypeList, setEntityTypeList] = useState([]);
//   const cancelTokenSource = axios.CancelToken.source();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     if (fundData) {
//       handleParticularFields();
//       handleEntityType();
//     }

//     return () => {
//       cancelTokenSource.cancel();
//     };
//   }, [fundData]);

//     const handleEntityType = async () => {
//       setIsLoader(true);
//       const response = await getEntityTypeAPI(cancelTokenSource.token);
//       if (response.success === true) {
//         setIsLoader(false);
//         setEntityTypeList(response?.data);
//       } else {
//         setIsLoader(false);
//       }
//       console.log("Entity Tyoe List API Called!");
//     };

//   const handleParticularFields = async () => {
//     setIsLoader(true);
//     try {
//       const response = await getParticularFieldsFromFundIdApi(fundData?.id, cancelTokenSource.token);
//       if (response?.success) {
//         console.log("New Fields API Response:", response);
//         setNewFields(response.data.account_fields);
//       }
//     } catch (error) {
//       console.error("Error fetching fields:", error);
//     } finally {
//       setIsLoader(false);
//     }
//   };

//   let combinedArray = [];

//   if (fundData?.fund_setting?.sections?.show_cf_to_customer) {
//     combinedArray = [
//       ...(newFields?.s_f || []),
//       ...(newFields?.c_f || []),
//       ...(newFields?.e_f || []),
//     ];
//     console.log("Combined Array is:", combinedArray);
//   } else {
//     combinedArray = [
//       ...(newFields?.s_f || []),
//       ...(newFields?.e_f || []),
//     ];
//     console.log("Combined Array is:", combinedArray);
//   }

//   const renderOptions = (data) => {
//     if (data?.source?.type === 'table' && Array.isArray(data.source.data)) {
//       return data.source.data.map((option) => (
//         <option key={option.id} value={option[data.source.returnKey]}>
//           {option.name}
//         </option>
//       ));
//     } else if (data?.source?.type === 'enum' && data.source.data) {
//       return Object.entries(data.source.data).map(([key, option]) => (
//         <option key={key} value={option.key}>
//           {option.name}
//         </option>
//       ));
//     }
//     return null;
//   };

//   const renderInput = (key, data) => {
//     if (!data) return null;

//     const inputId = key.split('.').join('_');
//     const commonProps = {
//       id: inputId,
//       name: inputId,
//       required: data.required,
//       value: formValues[inputId] || '',
//       onChange: handleInputChange,
//       label: data.label,
//     };

//     switch (data.type) {
//       case 'select':
//       case 'dd':
//         return <DropdownField {...commonProps} options={renderOptions(data)} />;

//       case 'text':
//       case 'email':
//       case 'password':
//       case 'date':
//         return <TextField {...commonProps} type={data.type} placeholder={data.label} />;

//       case 'check':
//         return (
//           <div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="radio"
//                 id={`${inputId}_yes`}
//                 name={inputId}
//                 value="yes"
//                 checked={formValues[inputId] === "yes"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <label htmlFor={`${inputId}_yes`} className="mr-4">
//                 Yes
//               </label>

//               <input
//                 type="radio"
//                 id={`${inputId}_no`}
//                 name={inputId}
//                 value="no"
//                 checked={formValues[inputId] === "no"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <label htmlFor={`${inputId}_no`} className="mr-4">
//                 No
//               </label>

//               <input
//                 type="radio"
//                 id={`${inputId}_na`}
//                 name={inputId}
//                 value="not_applicable"
//                 checked={formValues[inputId] === "not_applicable"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <label htmlFor={`${inputId}_na`} className="mr-4">
//                 Not Applicable
//               </label>
//             </div>
//           </div>
//         );

//       default:
//         return <div className="text-red-500">Unsupported input type: {data.type}</div>;
//     }
//   };

//   const filteredData = combinedArray?.flatMap((data) =>
//     Object.entries(data || {}).filter(([key, value]) => {
//       if (userType === 'individual') {
//         return key.startsWith('individual') && (value.for === 'all' || value.for === 'root');
//       } else if (userType === 'corporate') {
//         return key.startsWith('corporate') && (value.for === 'all' || value.for === 'crp' || value.for === 'root');
//       }
//       return false;
//     })
//   ).sort(([keyA, valueA], [keyB, valueB]) => valueA.index - valueB.index) || [];

//   const handleSubmitCall = async (data) => {
//     debugger

//     console.log('Data of the Handle Submit',formValues);
//     setSubmitLoader(true);
//     try {
//       const response = await postIdentityAPI(data, cancelTokenSource.token);
//       if (response) {

//         console.log("Identity created successfully:", response);
//         setMessage(true);
//       } else {

//         setErrorMessage({ error: true, message: response.user_message });
//       }
//     } catch (error) {
//       setErrorMessage({ error: true, message: "An error occurred while submitting the form." });
//       console.error("Error during submission:", error);
//     } finally {
//       setSubmitLoader(false);
//     }
//   };

//   const handleNextClick = async () => {
//     await handleSubmitCall(formValues);
//     onNext(formValues);
//   };

//   return (
//     <div className="w-full flex flex-col justify-between h-full">
//       {isLoader ? (
//         <Loader theme={theme} />
//       ) : (
//         <form onSubmit={(e) => e.preventDefault()} className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
//           {filteredData.map(([key, data]) => (
//             <div key={key} className="w-full">
//               <label className="block text-sm mb-2 text-white" htmlFor={key.split('.').join('_')}>
//                 {data.label}
//                 {data.required && <span className="text-red-500">*</span>}
//               </label>
//               {renderInput(key, data)}
//             </div>
//           ))}
//         </form>
//       )}
//       {errorMessage && <div className="text-red-500">{errorMessage.message}</div>}
//       <div className="mt-auto flex justify-end w-full p-6">
//         <button
//           className="py-2 px-4 mb-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
//           onClick={handleNextClick}
//           disabled={submitLoader}
//         >
//           {submitLoader ? 'Submitting...' : 'Save'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserForm;



// Code in use
    // import React, { useEffect, useState } from "react";
    // import DropdownField from "../../../components/ui/dropdown/DropdownField";
    // import TextField from "../../../components/ui/input/TextField";
    // import { useTheme } from "../../../contexts/themeContext";
    // import Loader from "../../../components/ui/loader";
    // import {
    //   getParticularFieldsFromFundIdApi,
    //   postIdentityAPI,
    //   getEntityTypeAPI,
    //   getParticularsDetailByIdentityIdAPI,
    // } from "../../../api/userApi";
    // import axios from "axios";

    // const UserForm = ({ userType, onNext, fundData, identitiesData }) => {
      // const { theme } = useTheme();
      // const [formValues, setFormValues] = useState({});
      // const [newFields, setNewFields] = useState({});
      // const [isLoader, setIsLoader] = useState(true);
      // const [submitLoader, setSubmitLoader] = useState(false);
      // const [errorMessage, setErrorMessage] = useState(null);
      // const [entityTypeList, setEntityTypeList] = useState([]);
      // const [entityType, setEntityType] = useState([]);
      // const [label, setLabel] = useState("");
      // const fund_id = fundData?.id;
      // // const identity_id = identitiesData?.data?.accountShareHolders?.identityId;
      // const [identityId, setIdentityId] = useState('');
      // const cancelTokenSource = axios.CancelToken.source();

      // console.log("Fund Data iss: ", fundData);
      
    //   const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     const updatedValues = { ...formValues, [name]: value };
    //     setFormValues(updatedValues);
    //     if (
    //       name.includes("first_name") ||
    //       name.includes("last_name") ||
    //       name.includes("nationality_code") ||
    //       name.includes("country_of_major_operation_code") ||
    //       name.includes("name")
    //     ) {
    //       handleIdentityLabel(updatedValues);
    //     }
    //   };

    //   useEffect(() => {
    //     if (fundData) {
    //       handleParticularFields();
    //       handleEntityType();
    //       getSpecificIdentity();
    //     }

    //     return () => {
    //       cancelTokenSource.cancel();
    //     };
    //   }, [fundData]);

    //   const handleEntityType = async () => {
    //     setIsLoader(true);
    //     const response = await getEntityTypeAPI(cancelTokenSource.token);
    //     if (response.success === true) {
    //       setEntityTypeList(response?.data);
    //     }
    //     setIsLoader(false);
    //   };

    //   const handleParticularFields = async () => {
    //     setIsLoader(true);
    //     try {
    //       const response = await getParticularFieldsFromFundIdApi(
    //         fundData?.id,
    //         cancelTokenSource.token
    //       );
    //       if (response?.success) {
    //         setNewFields(response.data.account_fields);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching fields:", error);
    //     } finally {
    //       setIsLoader(false);
    //     }
    //   };

    //   const handleIdentityLabel = (data) => {
    //     if (data) {
    //       let newLabel = "";
    //       if (userType === "individual") {
    //         const firstName = data["individual_basic_first_name"] || "";
    //         const lastName = data["individual_basic_last_name"] || "";
    //         const country = data["individual_basic_nationality_code"] || "";
    //         newLabel = `${firstName} ${lastName} ${country}`;
    //       }
    //       else{
    //         const companyName = data["corporate_basic_name"] || "";
    //         const country = data["corporate_basic_country_of_major_operation_code"] || "";
    //         newLabel = `${companyName} ${country}`;
    //       }
    //       setLabel(newLabel);
    //       setFormValues((prev) => ({ ...prev, label: newLabel }));
    //     }
    //   };

    //   const getSpecificIdentity = async (identity_id) => {
    //     identity_id = '569c71f5-8944-4c01-b51a-ad2047e7ae27';
    //     setIdentityId(identity_id);
    //     setIsLoader(true);
    //     const response = await getParticularsDetailByIdentityIdAPI(
    //       identity_id,
    //       cancelTokenSource.token,
    //     );
    //     if (response == true) {
    //       setIsLoader(false);
    //       // if (props?.outDated == null) {
    //       //   props?.updateUpdatedData(response.data?.meta?.identity?.outDated);
    //       // }
    //       setParticularAddedData(response.data?.meta?.data);
    //       // setParticularEditMetaData(response.data?.meta);
    //       setEntityType(response.data?.entityTypeId);
    //       // props?.handleEntityType(response.data?.entityTypeId);
    //       console.log(response.data?.label, 'response.data?.label');
    //       // setLabel(response.data?.label);
    //       // setIsCrp(response.data?.parentId == "0" ? false : true);
    //       if (response.data?.meta?.data) {

    //         const transformedData = {};

    //         for (const key in response.data?.meta?.data) {
    //           const property = response.data?.meta?.data[key];
    //           transformedData[key] = property.value;
    //         }
    //         setNewFields(transformedData);
    //       }

    //       setIsLoader(false);
    //     } else {
    //       setIsLoader(false);
    //     }
    //   };

    //   const combinedArray = fundData?.fund_setting?.sections?.show_cf_to_customer
    //     ? [
    //         ...(newFields?.s_f || []),
    //         ...(newFields?.c_f || []),
    //         ...(newFields?.e_f || []),
    //       ]
    //     : [...(newFields?.s_f || []), ...(newFields?.e_f || [])];

    //   const renderOptions = (data) => {
    //     if (data?.source?.type === "table" && Array.isArray(data.source.data)) {
    //       return data.source.data.map((option) => (
    //         <option key={option.id} value={option[data.source.returnKey]}>
    //           {option.name}
    //         </option>
    //       ));
    //     } else if (data?.source?.type === "enum" && data.source.data) {
    //       return Object.entries(data.source.data).map(([key, option]) => (
    //         <option key={key} value={option.key}>
    //           {option.name}
    //         </option>
    //       ));
    //     }
    //     return null;
    //   };

    //   const renderInput = (key, data) => {
    //     if (!data) return null;
    //     const inputId = key.split(".").join("_");
    //     const commonProps = {
    //       id: inputId,
    //       name: inputId,
    //       required: data.required,
    //       value: formValues[inputId] || "",
    //       onChange: handleInputChange,
    //       label: data.label,
    //     };

    //     switch (data.type) {
    //       case "select":
    //       case "dd":
    //         return <DropdownField {...commonProps} options={renderOptions(data)} />;

    //       case "text":
    //       case "email":
    //       case "password":
    //       case "date":
    //         return (
    //           <TextField
    //             {...commonProps}
    //             type={data.type}
    //             placeholder={data.label}
    //           />
    //         );

    //       case "check":
    //         return (
    //           <div>
    //             <div className="flex items-center mb-2">
    //               <input
    //                 type="radio"
    //                 id={`${inputId}_yes`}
    //                 name={inputId}
    //                 value="yes"
    //                 checked={formValues[inputId] === "yes"}
    //                 onChange={handleInputChange}
    //                 className="mr-2"
    //               />
    //               <label htmlFor={`${inputId}_yes`} className="mr-4">
    //                 Yes
    //               </label>
    //               <input
    //                 type="radio"
    //                 id={`${inputId}_no`}
    //                 name={inputId}
    //                 value="no"
    //                 checked={formValues[inputId] === "no"}
    //                 onChange={handleInputChange}
    //                 className="mr-2"
    //               />
    //               <label htmlFor={`${inputId}_no`} className="mr-4">
    //                 No
    //               </label>
    //               <input
    //                 type="radio"
    //                 id={`${inputId}_na`}
    //                 name={inputId}
    //                 value="not_applicable"
    //                 checked={formValues[inputId] === "not_applicable"}
    //                 onChange={handleInputChange}
    //                 className="mr-2"
    //               />
    //               <label htmlFor={`${inputId}_na`} className="mr-4">
    //                 Not Applicable
    //               </label>
    //             </div>
    //           </div>
    //         );

    //       default:
    //         return (
    //           <div className="text-red-500">
    //             Unsupported input type: {data.type}
    //           </div>
    //         );
    //     }
    //   };

    //   const filteredData =
    //     combinedArray
    //       ?.flatMap((data) =>
    //         Object.entries(data || {}).filter(([key, value]) => {
    //           if (userType === "individual") {
    //             return (
    //               key.startsWith("individual") &&
    //               (value.for === "all" || value.for === "root")
    //             );
    //           } else if (userType === "corporate") {
    //             return (
    //               key.startsWith("corporate") &&
    //               (value.for === "all" ||
    //                 value.for === "crp" ||
    //                 value.for === "root")
    //             );
    //           }
    //           return false;
    //         })
    //       )
    //       .sort(([keyA, valueA], [keyB, valueB]) => valueA.index - valueB.index) ||
    //     [];

    //   const handleSubmitCall = async (data) => {
    //     setSubmitLoader(true);
    //     try {
    //       const response = await postIdentityAPI(data, cancelTokenSource.token);
    //       if (response) {
    //         setErrorMessage(null); // Clear error if submission was successful
    //       } else {
    //         setErrorMessage({ error: true, message: response.user_message });
    //       }
    //     } catch (error) {
    //       setErrorMessage({
    //         error: true,
    //         message: "An error occurred while submitting the form.",
    //       });
    //     } finally {
    //       setSubmitLoader(false);
    //     }
    //   };

    //   const dataToSend = {
    //     label: label,
    //     fund_id: fund_id,
    //     customer_type_key:
    //       identitiesData?.type === "INDIVIDUAL" ? "INDIVIDUAL" : "CORPORATE",
    //     data: formValues,
    //     entity_type_id:
    //       identitiesData?.type === "INDIVIDUAL"
    //         ? null
    //         : entityType?.toString() || null,
    //   };

    //   const handleNextClick = async () => {
    //     await handleSubmitCall(dataToSend);
    //     onNext(dataToSend);
    //     console.log("These are the Values of Form:", dataToSend);
    //   };

    //   return (
    //     <div className="w-full flex flex-col justify-between h-full">
    //       {isLoader ? (
    //         <Loader theme={theme} />
    //       ) : (
    //         <>
    //           {(
    //             <div className="my-3">
    //               Identity Label:
    //               <TextField
    //                 name="label"
    //                 value={label}
    //                 placeholder="Label Of Identity"
    //                 label="Identity Label"
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //           )}
    //           <form
    //             onSubmit={(e) => e.preventDefault()}
    //             className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4"
    //           >
    //             {filteredData.map(([key, data]) => (
    //               <div key={key} className="w-full">
    //                 <label
    //                   className="block text-sm mb-2 text-white"
    //                   htmlFor={key.split(".").join("_")}
    //                 >
    //                   {data.label}
    //                   {data.required && <span className="text-red-500">*</span>}
    //                 </label>
    //                 {renderInput(key, data)}
    //               </div>
    //             ))}
    //           </form>
    //         </>
    //       )}
    //       {errorMessage && (
    //         <div className="text-red-500">{errorMessage.message}</div>
    //       )}
    //       <div className="mt-auto flex justify-end w-full p-6">
    //         <button
    //           className="py-2 px-4 mb-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
    //           onClick={handleNextClick}
    //           disabled={submitLoader}
    //         >
    //           {submitLoader ? "Submitting..." : "Save"}
    //         </button>
    //       </div>
    //     </div>
    //   );
    // };

    // export default UserForm;






import React, { useEffect, useState } from "react";
import DropdownField from "../../../components/ui/dropdown/DropdownField";
import TextField from "../../../components/ui/input/TextField";
import { useTheme } from "../../../contexts/themeContext";
import Loader from "../../../components/ui/loader";
import {
  getParticularFieldsFromFundIdApi,
  getEntityTypeAPI,
  getParticularsDetailByIdentityIdAPI,
} from "../../../api/userApi";
import axios from "axios";

const UserForm = ({ userType, fundData, identitiesData, onFormChange, dataOfAccountSetups,fundId, updateDataOfAccountSetups,onNext  }) => {
  const { theme } = useTheme();
  const [formValues, setFormValues] = useState({});
  const [newFields, setNewFields] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [entityTypeList, setEntityTypeList] = useState([]);
  const [entityType, setEntityType] = useState([]);
  const [label, setLabel] = useState("");
  const fund_id = fundData?.id;
  let fund_named_id=fundData?.named_id;
  var account_id;
  var field_data;
  console.log("fund_named_id",fund_named_id)
  let identity_id;
  var identities;
  const cancelTokenSource = axios.CancelToken.source();

  console.log("Fund Data iss: ", fundData);
  
  // const identity_id = identitiesData?.data?.accountShareHolders?.identityId;
  const [identityId, setIdentityId] = useState('');

  console.log("Fund Data iss: ", fundData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);
    if (
      name.includes("first_name") ||
      name.includes("last_name") ||
      name.includes("nationality_code") ||
      name.includes("country_of_major_operation_code") ||
      name.includes("name")
    ) {
      handleIdentityLabel(updatedValues);
    }
    
    // Notify parent component of form changes
    onFormChange({
      label,
      fund_id,
      customer_type_key: identitiesData?.type === "INDIVIDUAL" ? "INDIVIDUAL" : "CORPORATE",
      data: updatedValues,
      entity_type_id: identitiesData?.type === "INDIVIDUAL" ? null : entityType?.toString() || null,
    });
  };

  useEffect(() => {
    if (fundData) {
      handleParticularFields();
      handleEntityType();
      getSpecificIdentity();
    }

    return () => {
      cancelTokenSource.cancel();
    };
  }, [fundData]);

  const handleEntityType = async () => {
    setIsLoader(true);
    const response = await getEntityTypeAPI(cancelTokenSource.token);
    if (response.success === true) {
      setEntityTypeList(response?.data);
    }
    setIsLoader(false);
  };

  const handleParticularFields = async () => {
    setIsLoader(true);
    try {
      const response = await getParticularFieldsFromFundIdApi(
        fundData?.id,
        cancelTokenSource.token
      );
      if (response?.success) {
        setNewFields(response.data.account_fields);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setIsLoader(false);
    }
  };

  const handleIdentityLabel = (data) => {
    if (data) {
      let newLabel = "";
      if (userType === "individual") {
        const firstName = data["individual_basic_first_name"] || "";
        const lastName = data["individual_basic_last_name"] || "";
        const country = data["individual_basic_nationality_code"] || "";
        newLabel = `${firstName} ${lastName} ${country}`;
      }
      else{
        const companyName = data["corporate_basic_name"] || "";
        const country = data["corporate_basic_country_of_major_operation_code"] || "";
        newLabel = `${companyName} ${country}`;
      }
      setLabel(newLabel);
      setFormValues((prev) => ({ ...prev, label: newLabel }));
    }
  };

  const getSpecificIdentity = async (identity_id) => {
    identity_id = '569c71f5-8944-4c01-b51a-ad2047e7ae27';
    setIdentityId(identity_id);
    setIsLoader(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token,
    );
    if (response == true) {
      setIsLoader(false);
      // if (props?.outDated == null) {
      //   props?.updateUpdatedData(response.data?.meta?.identity?.outDated);
      // }
      setParticularAddedData(response.data?.meta?.data);
      // setParticularEditMetaData(response.data?.meta);
      setEntityType(response.data?.entityTypeId);
      // props?.handleEntityType(response.data?.entityTypeId);
      console.log(response.data?.label, 'response.data?.label');
      // setLabel(response.data?.label);
      // setIsCrp(response.data?.parentId == "0" ? false : true);
      if (response.data?.meta?.data) {

        const transformedData = {};

        for (const key in response.data?.meta?.data) {
          const property = response.data?.meta?.data[key];
          transformedData[key] = property.value;
        }
        setNewFields(transformedData);
      }

      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };

  const combinedArray = fundData?.fund_setting?.sections?.show_cf_to_customer
    ? [
        ...(newFields?.s_f || []),
        ...(newFields?.c_f || []),
        ...(newFields?.e_f || []),
      ]
    : [...(newFields?.s_f || []), ...(newFields?.e_f || [])];

  const renderOptions = (data) => {
    if (data?.source?.type === "table" && Array.isArray(data.source.data)) {
      return data.source.data.map((option) => (
        <option key={option.id} value={option[data.source.returnKey]}>
          {option.name}
        </option>
      ));
    } else if (data?.source?.type === "enum" && data.source.data) {
      return Object.entries(data.source.data).map(([key, option]) => (
        <option key={key} value={option.key}>
          {option.name}
        </option>
      ));
    }
    return null;
  };

  const renderInput = (key, data) => {
    if (!data) return null;
    const inputId = key.split(".").join("_");
    const commonProps = {
      id: inputId,
      name: inputId,
      required: data.required,
      value: formValues[inputId] || "",
      onChange: handleInputChange,
      label: data.label,
    };

    switch (data.type) {
      case "select":
      case "dd":
        return <DropdownField {...commonProps} options={renderOptions(data)} />;

      case "text":
      case "email":
      case "password":
      case "date":
        return (
          <TextField
            {...commonProps}
            type={data.type}
            placeholder={data.label}
          />
        );

      case "check":
        return (
          <div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id={`${inputId}_yes`}
                name={inputId}
                value="yes"
                checked={formValues[inputId] === "yes"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor={`${inputId}_yes`} className="mr-4">
                Yes
              </label>
              <input
                type="radio"
                id={`${inputId}_no`}
                name={inputId}
                value="no"
                checked={formValues[inputId] === "no"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor={`${inputId}_no`} className="mr-4">
                No
              </label>
              <input
                type="radio"
                id={`${inputId}_na`}
                name={inputId}
                value="not_applicable"
                checked={formValues[inputId] === "not_applicable"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor={`${inputId}_na`} className="mr-4">
                Not Applicable
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-red-500">
            Unsupported input type: {data.type}
          </div>
        );
    }
  };

  const filteredData =
    combinedArray
      ?.flatMap((data) =>
        Object.entries(data || {}).filter(([key, value]) => {
          if (userType === "individual") {
            return (
              key.startsWith("individual") &&
              (value.for === "all" || value.for === "root")
            );
          } else if (userType === "corporate") {
            return (
              key.startsWith("corporate") &&
              (value.for === "all" ||
                value.for === "crp" ||
                value.for === "root")
            );
          }
          return false;
        })
      )
      .sort(([keyA, valueA], [keyB, valueB]) => valueA.index - valueB.index) ||
    [];

 
  const handleSubmitCall = async (data) => {
    setSubmitLoader(true);
    try {
      const response = await postIdentityAPI(data, cancelTokenSource.token);
      if (response) {
        setErrorMessage(null); 
        identity_id = response?.data?.id; 
        field_data = response?.data;
        console.log("Identity ID is here:", identity_id);
        
        await handleCreateAccount(identity_id, fund_named_id, data, response?.data);
        
      } else {
        setErrorMessage({ error: true, message: response.user_message });
      }
    } catch (error) {
      setErrorMessage({
        error: true,
        message: "An error occurred while submitting the form.",
      });
    } finally {
      setSubmitLoader(false);
    }
  };
  

  const dataToSend = {
    label: label,
    fund_id: fund_id,
    customer_type_key:
      identitiesData?.type === "INDIVIDUAL" ? "INDIVIDUAL" : "CORPORATE",
    data: formValues,
    entity_type_id:
      identitiesData?.type === "INDIVIDUAL"
        ? null
        : entityType?.toString() || null,
  };

  const handleNextClick = async () => {
    try {
      await handleSubmitCall(dataToSend);
  
      if (identity_id) {
       
        if (account_id) {
          dataOfAccountSetups[0].data.identity.identity_id = identity_id;
          dataOfAccountSetups[0].data.account.account_id = account_id;
          dataOfAccountSetups[0].data.identity.field_data = field_data;

  
          updateDataOfAccountSetups({
            dataOfAccountSetups,
          });
  
          console.log("Updated Account Setup:", dataOfAccountSetups);
        } else {
          console.log("Account ID is not available");
        }
      } else {
        console.log("Identity creation failed, identity_id is undefined.");
      }
  
      onNext(dataToSend);
      console.log("Form Values:", dataToSend);
    } catch (error) {
      console.error("An error occurred during submission:", error);
    }
  };


  const handleCreateAccount = async (
    identity_id,
    fund_named_id,
    identityData,
    addedIdentityData,
  ) => {
    setIsLoader(true);
    const data = {
      joint_account: false,
      fund_id: fund_named_id,
      share_holder_count: 0,
      joint_account_emails: [],
      termAccepted: true,
    };

    const response = await postIdentityAttatchWithFund(
      identity_id,
      data,
      cancelTokenSource.token,
    );
    console.log('checking response', response);
    if(response){
      account_id=response?.data?.accountId;
      console.log("account_id",account_id);
    }
  };
  

  return (
    <div className="w-full flex flex-col justify-between h-full">
      {isLoader ? (
        <Loader theme={theme} />
      ) : (
        <>
          <div className="my-3">
            Identity Label:
            <TextField
              name="label"
              value={label}
              placeholder="Label Of Identity"
              label="Identity Label"
              onChange={handleInputChange}
            />
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredData.map(([key, data]) => (
              <div key={key} className="w-full">
                <label
                  className="block text-sm mb-2 text-white"
                  htmlFor={key.split(".").join("_")}
                >
                  {data.label}
                  {data.required && <span className="text-red-500">*</span>}
                </label>
                {renderInput(key, data)}
              </div>
            ))}
          </form>
        </>
      )}
    </div>
  );
};

export default UserForm;