import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import { useTheme } from "../../../contexts/themeContext";
import { useForm } from "react-hook-form";
import { submitBankIdentityAPI } from "../../../api/userApi";
import axios from "axios";
import Loader from "../loader";

const AddBankForm = ({ isOpen, onClose, fetchBankIdentities }) => {
  const { theme } = useTheme();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoaderBank, setIsLoaderBank] = useState(false);

  const onSubmit = async (data) => {
    debugger;
    onClose();
    //setIsLoaderBank(true);
    const dataToSend = {
      label: `${data.bankName} ${data.accountHolder}`,
      data: {
        "bank.basic.currency": data.currency,
        "bank.basic.bank_name": data.bankName,
        "bank.basic.account_holder_name": data.accountHolder,
        "bank.basic.account_number": data.accountNumber,
        "bank.basic.swift_bic__ifsc_code": data.swiftCode,
        "bank.basic.beneficiary_name": data.name,
        ...(data.iban && { "bank.basic.iban": data.iban }),
        ...(data.sortCode && { "bank.basic.sort_code": data.sortCode }),
        ...(data.routingNumber && {
          "bank.basic.routing_number": data.routingNumber,
        }),
        ...(data.description && { "bank.basic.description": data.description }),
      },
    };
    try {
      const response = await submitBankIdentityAPI(
        dataToSend,
        cancelTokenSource.token
      );
      console.log("Add Bank API Response: ", response);

      if (response && response.success === true) {
        // setIsLoaderBank(true);
        await fetchBankIdentities();
      } else {
        console.error(response?.message || "Failed to add bank address.");
      }
    } catch (error) {
      console.error("Error adding bank address:", error);
    } finally {
      setIsLoaderBank(false);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  if (!isOpen) return null;

  const bankName = watch("bankName") || "";
  const accountHolder = watch("accountHolder") || "";
  const identityLabel = `${bankName} ${accountHolder}`.trim();
  console.log("identityLabel", identityLabel);

  const watchFields = [
    watch("currency"),
    watch("bankName"),
    watch("accountNumber"),
    watch("accountHolder"),
    watch("swiftCode"),
    watch("name"),
    watch("identityLabel"),
  ];
  const showIdentityLabel = watchFields.some((field) => field);

  const getBorderClass = (field, value) => {
    return errors[field]
      ? "border border-[#a9712c]"
      : value
      ? "border-none"
      : "border border-[#a9712c]";
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
                value={identityLabel}
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
          <div className=" md:gap-6 gap-1 px-2 sm:grid sm:grid-cols-2">
            {/* Currency Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Beneficiary Bank Account Currency*
              </label>
              <input
                type="text"
                placeholder="Beneficiary Bank Account Currency"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "currency",
                  watch("currency")
                )}`}
                {...register("currency", { required: "Currency is required" })}
              />
              {errors.currency && (
                <p className="text-red-500 text-sm">
                  {errors.currency.message}
                </p>
              )}
            </div>
            {/* Bank Name */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Beneficiary Bank Name*
              </label>
              <input
                type="text"
                placeholder="Beneficiary Bank Name"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "bankName",
                  bankName
                )}`}
                {...register("bankName", { required: "Bank Name is required" })}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm">
                  {errors.bankName.message}
                </p>
              )}
            </div>
            {/* Account Number */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Beneficiary Bank Account Number*
              </label>
              <input
                type="text"
                placeholder="Beneficiary Bank Account Number"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "accountNumber",
                  watch("accountNumber")
                )}`}
                {...register("accountNumber", {
                  required: "Account Number is required",
                })}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
            {/* Account Holder's Name */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Beneficiary Bank Account Name*
              </label>
              <input
                type="text"
                placeholder="Beneficiary Bank Account Name"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "accountHolder",
                  accountHolder
                )}`}
                {...register("accountHolder", {
                  required: "Account Holder's Name is required",
                })}
              />
              {errors.accountHolder && (
                <p className="text-red-500 text-sm">
                  {errors.accountHolder.message}
                </p>
              )}
            </div>
            {/* SWIFT/BIC/IFSC Code */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Beneficiary Bank SWIFT/BIC/IFSC Code*
              </label>
              <input
                type="text"
                placeholder="Beneficiary Bank SWIFT/BIC/IFSC Code"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "swiftCode",
                  watch("swiftCode")
                )}`}
                {...register("swiftCode", {
                  required: "SWIFT/BIC/IFSC Code is required",
                })}
              />
              {errors.swiftCode && (
                <p className="text-red-500 text-sm">
                  {errors.swiftCode.message}
                </p>
              )}
            </div>
            {/* IBAN */}
            <div>
              <label className="block mb-2 text-sm font-light">IBAN</label>
              <input
                type="text"
                placeholder="IBAN (International Bank Account Number)"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md`}
                {...register("iban")}
              />
            </div>
            {/* Sort Code */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Sort Code (for UK banks)
              </label>
              <input
                type="text"
                placeholder="Sort Code (for UK banks)"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md`}
                {...register("sortCode")}
              />
            </div>
            {/* Routing Number */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Routing Number
              </label>
              <input
                type="text"
                placeholder="Routing Number"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md`}
                {...register("routingNumber")}
              />
            </div>
            {/* Reference Description */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Reference Description
              </label>
              <input
                type="text"
                placeholder="Reference description"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md`}
                {...register("description")}
              />
            </div>
            {/* Beneficiary Name */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Beneficiary Name
              </label>
              <input
                type="text"
                placeholder="Beneficiary Name"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${getBorderClass(
                  "name",
                  watch("name")
                )}`}
                {...register("name", {
                  required: "Beneficiary Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            {/* Bank/Branch Address */}
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-light">
                Bank/Branch Address
              </label>
              <textarea
                placeholder="Bank/Branch Address"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md h-24`}
                {...register("bankAddress")}
              />
            </div>
          </div>
          <div className="mt-6 flex px-2">
            {/* {isLoader && <Loader theme={theme} />} */}
            <Button
              text="Submit"
              disabled={!isValid}
              // className={`py-6 px-8 rounded-lg bg-color-button-${theme}`}
              className={`py-6 px-8 rounded-lg 
                ${
                  isValid
                    ? `bg-color-button-${theme}`
                    : `bg-color-button-${theme} opacity-70`
                }
              `}
              type="submit"
            ></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBankForm;
