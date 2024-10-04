import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import { useTheme } from "../../../contexts/themeContext";
import { useForm } from "react-hook-form";
import { submitBankIdentityAPI } from "../../../api/userApi";
import axios from "axios";
import Loader from "../loader";
import { getParticularFieldsFromFundIdApi } from "../../../api/userApi";

const AddBankForm = ({ isOpen, onClose, fundId, fetchBankIdentities }) => {
  const { theme } = useTheme();
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [isLoaderBank, setIsLoaderBank] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [showIdentityLabel, setShowIdentityLabel] = useState(false);
  const [label, setLabel] = useState("");
  const [particularAddedData, setParticularAddedData] = useState([])

  console.log("Fund ID in AddBankForm: ", fundId);
  const getParticularFields = async () => {
    setIsLoader(true);

    const response = await getParticularFieldsFromFundIdApi(
      fundId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    let array = [];
    if (response.success === true) {
      array = [
        ...response.data.account_fields.s_b_f,
        ...response.data.account_fields.e_b_f,
      ];
      const filteredObj = array
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]].index;
          const indexB = b[Object.keys(b)[0]].index;
          return indexA - indexB;
        })
        .sort((a, b) => {
          if (Object.keys(a)[0] === "bank.extended.bank_branch_address")
            return 1;
          if (Object.keys(b)[0] === "bank.extended.bank_branch_address")
            return -1;
          return 0;
        });

      console.log(filteredObj, "filteredObj filteredObj filteredObj");
      setParticularFields(filteredObj);
    } else {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getParticularFields();
    }
  }, [isOpen, fundId]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  if (!isOpen) return null;
  const getUpdatedData = (key) => {
    return particularAddedData[key]?.value == null
      ? ""
      : particularAddedData[key]?.value
  }

  const getBorderClass = (field, value) => {
    return errors[field]
      ? "border border-[#a9712c]"
      : value
      ? "border-none"
      : "border border-[#a9712c]";
  };
  const onSubmit = async (data) => {
    console.log("Form data:", data);
  };

  const handleChange = (e) => {
    setShowLabel(true)
    console.log(e.target.name, "e.target.name")
    console.log(
      identityDataFields,
      "identityDataFields identityDataFields handleChange"
    )
    if (e.target.name === "Phone") {
      // If the input is the phone number field, update the phone number
      setIdentityDataFields({
        ...identityDataFields,
        phone: e,
      })
    } else {
      setIdentityDataFields({
        ...identityDataFields,
        [e.target.name]: e.target.value,
      })
    }
    if (e.target.name == "bank.basic.account_number") {
      setAccountNumber(e.target.value)
    }
    if (e.target.name == "bank.basic.swift_bic__ifsc_code") {
      setSwiftCode(e.target.value)
    }
  }
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center z-50 items-center overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`bg-gradient-stepper-card-${theme} rounded-md sm:w-8/12 w-full mb-5 lg:mt-40 sm:mt-0 xs:mt-40 2xs:mt-10 py-6 px-6 shadow-sm text-white`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-light">Add Bank</h2>
          <button onClick={onClose} className="text-white text-sm">
            ✕
          </button>
        </div>
        <hr className="w-full border-t-[1px] border-t-[#6e84a3] opacity-30 my-8" />
        {isLoaderBank && <Loader theme={theme} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          {showIdentityLabel && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-light">
                Identity Label
              </label>
              <input
                type="text"
                value={label}
                readOnly
                placeholder="Label Of Identity"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "identityLabel",
                  watch("identityLabel")
                )}`}
                {...register("identityLabel", {
                  required: "Identity Label is required",
                })}
              />
              {errors.identityLabel && (
                <p className="text-red-500 text-sm">
                  {errors.identityLabel.message}
                </p>
              )}
            </div>
          )}
          {particularFields &&
              particularFields.map((item, index) => {
                let key = Object.keys(item);
                let checkFieldsShow =
                  item[key[0]].hasOwnProperty('enabled');
                  if (checkFieldsShow && item[key[0]]?.enabled) {
                    if (
                      item[key[0]]?.for == 'all' ||
                      item[key[0]]?.for == 'root'
                    ) {
                      if (key) {
                        let keyValues = key[0].split('.');
                        let customerType = keyValues[0];
                        let formType = keyValues[1];
                        let fieldName = keyValues[2];
                        let label = fieldName?.replace(/\b\w/g, (char) => char.toUpperCase());
                        let formKeyVal = key[0];
                        const arr = label.split(' ');

                        for (var i = 0; i < arr?.length; i++) {
                          arr[i] =
                            arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                        }
                        const str2 = arr.join(' ');

                        label = str2;
                        let labelFromApi = item[key[0]]?.label;
                        if (labelFromApi) {
                          label = item[key[0]]?.label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                        } else {
                          label = label;

                        }
                        let fieldType = item[key[0]]?.type;
                        let sourceType = item[key[0]]?.source?.type;
                        let returnKey = item[key[0]]?.source?.returnKey;
                        let fieldData = item[key[0]]?.source?.data;
                        let requiredField = item[key[0]]?.required;
                        let valueField = item[key[0]]?.DefaultValue;
                        let editableField = '';
                        if (item[key[0]].hasOwnProperty('DefaultValue')) {
                          editableField = false;
                        } else {
                          editableField = true;
                        }


                
                        if (
                          customerType ===
                          props?.dataOfAccountSetup?.isIndividual
                            ? 'individual'
                            : 'corporate' && formType !== 'crp'
                        ) {
                          if (requiredField) {
                            allRequiredField.push(key[0]);
                          }
                          if (fieldType === 'text') {
                            console.log('the label is :', label);
                            if (fieldName === 'phone') {
                              return (
                                <div className="col-6 col-md-6">
                                  <div className="form-group">
                                    <label className="form-label">
                                      {label}
                                      {requiredField && (
                                        <span className="text-danger">*</span>
                                      )}
                                    </label>
                                    <div
                                      className={
                                        requiredField &&
                                        !identityDataFields?.[formKeyVal] &&
                                        (getUpdatedData(formKeyVal) == '' ||
                                          getUpdatedData(formKeyVal) == null)
                                          ? 'form-control field_warning'
                                          : 'form-control' && darkMode
                                          ? 'darkMode'
                                          : ''
                                      }
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <PhoneInput
                                          value={getUpdatedData(formKeyVal)}
                                          country={'sg'}
                                          name={fieldName}
                                          onChange={(e) => {
                                            handlePhoneNumber(e, formKeyVal);
                                          }}
                                          inputProps={{
                                            name: 'phone',
                                            required: true,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else if (label === 'Bank/Branch Address') {
                              return (
                                <div className="col-12 col-md-12">
                                  <div className="form-group">
                                    <label className="form-label">
                                      {label}
                                      {requiredField && (
                                        <span className="text-danger">*</span>
                                      )}
                                    </label>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <textarea
                                        // type={fieldType}
                                        className={
                                          requiredField &&
                                          !identityDataFields?.[formKeyVal] &&
                                          (getUpdatedData(formKeyVal) == '' ||
                                            getUpdatedData(formKeyVal) ==
                                              null)
                                            ? 'form-control field_warning'
                                            : 'form-control'
                                        }
                                        defaultValue={
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        name={formKeyVal}
                                        placeholder={label}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="col-6 col-md-6">
                                  <div className="form-group">
                                    <label className="form-label">
                                      {label}
                                      {requiredField && (
                                        <span className="text-danger">*</span>
                                      )}
                                    </label>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <input
                                        type={fieldType}
                                        className={
                                          requiredField &&
                                          !identityDataFields?.[formKeyVal] &&
                                          (getUpdatedData(formKeyVal) == '' ||
                                            getUpdatedData(formKeyVal) ==
                                              null)
                                            ? 'form-control field_warning'
                                            : 'form-control'
                                        }
                                        defaultValue={
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        name={formKeyVal}
                                        placeholder={label}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                          if (fieldType == 'dd') {
                            if (
                              sourceType == 'table' ||
                              sourceType == 'custom'
                            ) {
                              return (
                                <div className="col-6 col-md-6">
                                  <div className="form-group">
                                    <label className="form-label">
                                      {label}
                                      {requiredField && (
                                        <span className="text-danger">*</span>
                                      )}
                                    </label>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <select
                                        className={
                                          requiredField &&
                                          !identityDataFields?.[formKeyVal] &&
                                          (getUpdatedData(formKeyVal) == '' ||
                                            getUpdatedData(formKeyVal) ==
                                              null)
                                            ? 'form-control field_warning'
                                            : 'form-control'
                                        }
                                        defaultValue={
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        name={formKeyVal}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      >
                                        <option value="">
                                          Select {label}
                                        </option>
                                        {fieldData &&
                                          fieldData.map((dat, index) => (
                                            <option
                                              value={dat[returnKey]}
                                              selected={
                                                editableField == false &&
                                                valueField == dat[returnKey]
                                                  ? true
                                                  : getUpdatedData(
                                                      formKeyVal,
                                                    ) == dat[returnKey]
                                                  ? true
                                                  : false
                                              }
                                            >
                                              {dat?.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (fieldType == 'check') {
                              return (
                                <div
                                  className="col-6 col-md-6"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '25px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Form.Check
                                      // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                      className={'checkbox-field'}
                                      type={'checkbox'}
                                      id={formKeyVal}
                                      name={formKeyVal}
                                      label={label}
                                      defaultChecked={
                                        editableField == false
                                          ? valueField
                                          : getUpdatedData(formKeyVal)
                                      }
                                      onChange={(e) => {
                                        handleChangeCheckBox(e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          }
                        }
                      }
                    }
              
            })}

          <div className="mt-6 flex px-2">
            <Button
              text="Submit"
              disabled={!isValid}
              className={`py-6 px-8 rounded-lg ${
                isValid
                  ? `bg-color-button-${theme}`
                  : `bg-color-button-${theme} opacity-70`
              }`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBankForm;
