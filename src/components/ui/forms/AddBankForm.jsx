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
  const [particularAddedData, setParticularAddedData] = useState([]);

  console.log("Fund ID in AddBankForm: ", fundId);
  const getParticularFields = async () => {
    setIsLoader(true);

    try {
      const response = await getParticularFieldsFromFundIdApi(
        fundId,
        cancelTokenSource.token
      );

      // Print the response to the console
      console.log("Response from getParticularFieldsFromFundIdApi:", response);

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
    } catch (error) {
      console.error("Error fetching particular fields:", error);
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
