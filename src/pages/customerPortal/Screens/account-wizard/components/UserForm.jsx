import React, { useState } from 'react';
import formData from '../../../../../OurComponents/Data/fieldsData.json';
import DropdownField from "../../../../../OurComponents/Reusable Components/DropdownField";
import TextField from "../../../../../OurComponents/Reusable Components/TextField";
import { useTheme } from "../../../../../contexts/themeContext";

const UserForm = ({ userType, onNext }) => { // Pass `userType` and `onNext` callback as props
  const { theme } = useTheme();
  const [formValues, setFormValues] = useState({});

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
    } else if (userType === 'corporate') {
      return key.startsWith('corporate') && (field.for === 'all' || field.for === 'crp' || field.for === 'root');
    }
    return false;
  });

  const handleNextClick = () => {
    console.log('Form Values:', formValues);
    onNext(formValues); // Call the `onNext` callback to move to the next step
  };

  return (
        <div className="w-full flex flex-col justify-between h-full">
          <form onSubmit={(e) => e.preventDefault()} className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFields.map(([key, field]) => (
              <div key={key} className="w-full">
                <label className="block text-sm mb-2 text-white" htmlFor={key.split('.').join('_')}>
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderField(key, field)}
              </div>
            ))}
          </form>
          {/* <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
          <div className="mt-auto flex justify-end w-full p-6">
            <button
              className="py-2 px-4 mb-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div> */}
        </div>
  );
};

export default UserForm;
