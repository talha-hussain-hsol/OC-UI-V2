// src/Components/Screens/UserForm.jsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import formData from '../Data/fieldsData.json';
// import DropdownField from '../DropdownField';
// import TextField from '../TextField';
// import SideBar from '../SideBar';

// const UserForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [formValues, setFormValues] = useState({});
//   const [userType, setUserType] = useState(location.state?.userType || '');

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
//     console.log('Form Values:', formValues);
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90%">
//     <SideBar portalType="Customer" />
//     {/* <div className="bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-2xl w-[80%] flex flex-col items-center h-[700px]"> */}
//       {/* <div className="my-8 bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-2xl w-[80%] ml-[10%] flex flex-col items-center justify-center"> */}
//         <div className="my-8 mt-[8%] bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] w-[90%] ml-[7%] p-6 flex flex-col items-center justify-center">
//         <div className="w-full flex flex-col justify-between h-full">
//           <form onSubmit={(e) => e.preventDefault()} className="flex-grow flex flex-wrap gap-4">
//             {filteredFields.map(([key, field]) => (
//               <div key={key} className="w-[48%] mb-4">
//                 <label
//                   className={`block text-sm mb-2 text-white`}
//                   htmlFor={key.split('.').join('_')}
//                 >
//                   {field.label}
//                   {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 {renderField(key, field)}
//               </div>
//             ))}
//           </form>
//           <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
//           <div className="mt-auto flex justify-end w-full p-6">
//           <button
//              className="py-2 px-4 mb-3 border-[0.01px] text-white p-3 rounded-md hover:border-[#6e84a3] focus:outline-none"
//             onClick={() => navigate('/')}
//           >
//             Back
//           </button>
//             <button
//               className="py-2 px-4 mb-3 ml-auto bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
//               onClick={handleNextClick}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     {/* </div> */}
//     </div>
//   );
// };

// export default UserForm;



// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import formData from "../Data/fieldsData.json";
// import DropdownField from "../Reusable Components/DropdownField";
// import TextField from "../Reusable Components/TextField";

// const UserForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [formValues, setFormValues] = useState({});
//   const userType = location.state?.userType || "";

//   // Function to handle changes in form inputs
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   // Render options for select fields
//   const renderOptions = (field) => {
//     if (field.source?.type === "table") {
//       return field.source.data.map((option) => (
//         <option key={option.id} value={option[field.source.returnKey]}>
//           {option.name}
//         </option>
//       ));
//     } else if (field.source?.type === "enum") {
//       return Object.entries(field.source.data).map(([key, option]) => (
//         <option key={key} value={option.key}>
//           {option.name}
//         </option>
//       ));
//     }
//     return null;
//   };

//   // Render different field types
//   const renderField = (key, field) => {
//     const fieldId = key.split(".").join("_");
//     const commonProps = {
//       id: fieldId,
//       name: fieldId,
//       required: field.required,
//       value: formValues[fieldId] || "",
//       onChange: handleInputChange,
//       label: field.label,
//     };

//     switch (field.type) {
//       case "select":
//       case "dd":
//         return (
//           <DropdownField {...commonProps} options={renderOptions(field)} />
//         );

//       case "text":
//       case "email":
//       case "password":
//       case "date":
//         return (
//           <TextField
//             {...commonProps}
//             type={field.type}
//             placeholder={field.label}
//           />
//         );

//       case "radio":
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
//         return (
//           <div className="text-red-500">
//             Unsupported field type: {field.type}
//           </div>
//         );
//     }
//   };

//   // Filter the fields to be displayed based on user type
//   const filteredFields = Object.entries(formData.fields).filter(
//     ([key, field]) => {
//       if (userType === "individual") {
//         return (
//           key.startsWith("individual") &&
//           (field.for === "all" || field.for === "root")
//         );
//       } else if (userType === "crp") {
//         return (
//           key.startsWith("corporate") &&
//           (field.for === "all" || field.for === "crp" || field.for === "root")
//         );
//       }
//       return false;
//     }
//   );

//   const handleNextClick = () => {
//     console.log("Form Values:", formValues);
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90%">
//       {/* <SideBar portalType="Customer" /> */}
//       <div className="my-8 mt-[8%] bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] w-[90%] ml-[7%] p-6 flex flex-col items-center justify-center">
//         <div className="w-full flex flex-col justify-between h-full">
//           <form
//             onSubmit={(e) => e.preventDefault()}
//             className="flex-grow flex flex-wrap gap-4"
//           >
//             {filteredFields.map(([key, field]) => (
//               <div key={key} className="w-[48%] mb-4">
//                 <label
//                   className={`block text-sm mb-2 text-white`}
//                   htmlFor={key.split(".").join("_")}
//                 >
//                   {field.label}
//                   {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 {renderField(key, field)}
//               </div>
//             ))}
//           </form>
//           <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
//           <div className="mt-auto flex justify-end w-full p-6">
//             <button
//               className="py-2 px-4 mb-3 border-[0.01px] text-white p-3 rounded-md hover:border-[#6e84a3] focus:outline-none"
//               onClick={() => navigate("/")}
//             >
//               Back
//             </button>
//             <button
//               className="py-2 px-4 mb-3 ml-auto bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
//               onClick={handleNextClick}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserForm;

// Responsive Code for user Form
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import formData from '../Data/fieldsData.json';
import DropdownField from "../Reusable Components/DropdownField";
import TextField from "../Reusable Components/TextField";
// import SideBar from '../Reusable Components/SideBar';
import { useTheme } from "../../contexts/themeContext";

const UserForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();
  const [formValues, setFormValues] = useState({});
  const userType = location.state?.userType || '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const renderOptions = (field) => {
    if (field.source?.type === 'table') {
      return field.source.data.map((option) => (
        <option key={option.id} value={option[field.source.returnKey]}>
          {option.name}
        </option>
      ));
    } else if (field.source?.type === 'enum') {
      return Object.entries(field.source.data).map(([key, option]) => (
        <option key={key} value={option.key}>
          {option.name}
        </option>
      ));
    }
    return null;
  };

  const renderField = (key, field) => {
    const fieldId = key.split('.').join('_');
    const commonProps = {
      id: fieldId,
      name: fieldId,
      required: field.required,
      value: formValues[fieldId] || '',
      onChange: handleInputChange,
      label: field.label,
    };

    switch (field.type) {
      case 'select':
      case 'dd':
        return <DropdownField {...commonProps} options={renderOptions(field)} />;

      case 'text':
      case 'email':
      case 'password':
      case 'date':
        return <TextField {...commonProps} type={field.type} placeholder={field.label} />;

      case 'radio':
        return (
          <div>
            {Object.entries(field.source.data).map(([key, option]) => (
              <div key={key} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`${fieldId}_${key}`}
                  name={fieldId}
                  value={option.key}
                  checked={formValues[fieldId] === option.key}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`${fieldId}_${key}`} className="text-white">
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-red-500">Unsupported field type: {field.type}</div>;
    }
  };

  const filteredFields = Object.entries(formData.fields).filter(([key, field]) => {
    if (userType === 'individual') {
      return key.startsWith('individual') && (field.for === 'all' || field.for === 'root');
    } else if (userType === 'crp') {
      return key.startsWith('corporate') && (field.for === 'all' || field.for === 'crp' || field.for === 'root');
    }
    return false;
  });

  const handleNextClick = () => {
    console.log('Form Values:', formValues);
  };

  return (
    // <div className="min-h-screen flex bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90%">
    <div className={`min-h-screen flex bg-color-card-${theme}`}>
      {/* <SideBar portalType="Customer" /> */}
      {/* <div className="my-8 mt-[8%] bg-gradient-to-r from-[#0d3b66] from-10% to-[#0b1e33] to-90% rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] w-full md:w-[85%] lg:w-[80%] ml-[10%] p-6 flex flex-col items-center justify-center md:items-center md:mr-[10%] md:mt-[8%] sm:w-[80%] xs:w-[80%] xs:mt-[15%]"> */}
      <div className={`my-8 mt-[8%] bg-gradient-card-${theme} rounded-lg shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] w-full md:w-[85%] lg:w-[80%] ml-[10%] p-6 flex flex-col items-center justify-center md:items-center md:mr-[10%] md:mt-[8%] sm:w-[80%] xs:w-[80%] xs:mt-[15%]`}>
        <div className="w-full flex flex-col justify-between h-full">
          <form onSubmit={(e) => e.preventDefault()} className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFields.map(([key, field]) => (
              <div key={key} className="w-full">
                <label
                  className={`block text-sm mb-2 text-white`}
                  htmlFor={key.split('.').join('_')}
                >
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderField(key, field)}
              </div>
            ))}
          </form>
          <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
          <div className="mt-auto flex lg:space-x-[85%] md:justify-end sm: justify-center w-full p-6">
            <button
              className="py-2 px-4 mb-3 border-[0.01px] text-white p-3 rounded-md hover:border-[#6e84a3] focus:outline-none"
              onClick={() => navigate('/stepper')}
            >
              Back
            </button>
            <button
              className="py-2 px-4 mb-3 ml-2 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;