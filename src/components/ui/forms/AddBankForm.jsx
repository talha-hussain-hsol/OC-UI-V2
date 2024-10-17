import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import { useTheme } from "../../../contexts/themeContext";
import { useForm } from "react-hook-form";
import { submitBankIdentityAPI } from "../../../api/userApi";
import axios from "axios";
import Loader from "../loader";
import { getParticularFieldsFromFundIdApi } from "../../../api/userApi";

const AddBankForm = ({ isOpen, onClose, fundId, fetchBankIdentities, identityId }) => {
  const { theme } = useTheme();
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [isLoaderBank, setIsLoaderBank] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [showIdentityLabel, setShowIdentityLabel] = useState(true);
  const [label, setLabel] = useState("");
  const [particularAddedData, setParticularAddedData] = useState([]);
  const [identityDataFields, setIdentityDataFields] = useState({
    bankName: "",
    accountHolderName: "",
  });
  const getParticularFields = async () => {
    try {
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

        setParticularFields(filteredObj);
      } else {
        setIsLoaderBank(false);
      }
    } catch (error) {
      console.error("Error fetching particular fields:", error);
      setIsLoaderBank(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getParticularFields();
    }
  }, [isOpen, fundId]);

  const autoPopulateLabel = () => {
    const { bankName, accountHolderName } = identityDataFields;
    const newLabel = `${bankName} ${accountHolderName}`.trim();
    setLabel(newLabel);
  };

  useEffect(() => {
    autoPopulateLabel();
  }, [identityDataFields]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
  });

  if (!isOpen) return null;

  const getBorderClass = (field, value, required) => {
    if (required) {
      return errors[field]
        ? "border border-[#a9712c]"
        : value
        ? "border-none"
        : "border border-[#a9712c]";
    }
    return "border-none";
  };

  const onSubmit = async (data) => {
    if (!isValid) {
      // Trigger a re-validation to show errors if form is not valid
      return;
    }
    onClose();
    const payload = {
      label,
      data: data,
    };

    try {
      const response = await submitBankIdentityAPI(
        identityId,
        payload,
        cancelTokenSource.token
      );
      console.log("Add Bank API Response: ", response);

      if (response && response.success === true) {
        await fetchBankIdentities(identityId);
      } else {
        console.error(response?.message || "Failed to add bank address.");
      }
    } catch (error) {
      console.error("Error adding bank address:", error);
    } finally {
      setIsLoaderBank(false);
    }
  };

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
          {/* Identity Label field */}
          {showIdentityLabel && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-light">
                Identity Label
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Label Of Identity"
                value={label}
                readOnly
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md`}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {particularFields.map((fieldObj, index) => {
              const fieldKey = Object.keys(fieldObj)[0];
              const field = fieldObj[fieldKey];

              if (!field.enabled) return null;

              return (
                <>
                  <div className="mb-4" key={index}>
                    <label className="block mb-2 text-sm font-light">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.label}
                      className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                        fieldKey,
                        watch(fieldKey),
                        field.required
                      )}`}
                      {...register(fieldKey, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                        onChange: (e) => {
                          if (fieldKey === "bank.basic.bank_name") {
                            setIdentityDataFields((prev) => ({
                              ...prev,
                              bankName: e.target.value,
                            }));
                          } else if (
                            fieldKey === "bank.basic.account_holder_name"
                          ) {
                            setIdentityDataFields((prev) => ({
                              ...prev,
                              accountHolderName: e.target.value,
                            }));
                          }
                        },
                      })}
                    />
                    {errors[fieldKey] && (
                      <p className="text-red-500 text-sm">
                        {errors[fieldKey].message}
                      </p>
                    )}
                  </div>
                </>
              );
            })}
          </div>
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
