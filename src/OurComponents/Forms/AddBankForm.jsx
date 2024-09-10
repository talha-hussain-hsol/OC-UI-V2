import React, { useState } from "react";
import Button from "../Reusable Components/Button";
import { useTheme } from "../../contexts/themeContext";

const AddBankForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currency: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    swiftCode: "",
  });
  const { theme } = useTheme(); 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFieldEmpty = (field) => !formData[field];
  const isFormValid = () => {
    return (
      formData.currency &&
      formData.bankName &&
      formData.accountNumber &&
      formData.accountHolder &&
      formData.swiftCode
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center z-50 items-center overflow-y-auto">
      <div className={`bg-gradient-stepper-card-${theme} rounded-md w-full sm:w-1/2 lg:w-8/12 mb-5 mt-40 py-6 px-6 shadow-sm text-white`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-light">Add Bank</h2>
          <button onClick={onClose} className="text-[#6e84a3] text-sm">
            ✕
          </button>
        </div>
        <hr className="w-full border-t-[1px] border-t-[#6e84a3] opacity-30 my-8" />
        <form>
          <div className="grid grid-cols-1 gap-6 px-2 sm:grid-cols-2">
            {/* Currency Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-light">Currency*</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="Currency"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${
                  isFieldEmpty("currency")
                    ? "border border-[#a9712c]"
                    : "border border-[#1c3758]"
                }`}
              />
            </div>
            {/* Bank Name */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Bank Name*
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${
                  isFieldEmpty("bankName")
                    ? "border border-[#a9712c]"
                    : "border border-[#1c3758]"
                }`}
              />
            </div>
            {/* Account Number */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Account Number*
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account Number"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${
                  isFieldEmpty("accountNumber")
                    ? "border border-[#a9712c]"
                    : "border border-[#1c3758]"
                }`}
              />
            </div>
            {/* Account Holder's Name */}
            <div>
              <label className="block mb-2 text-sm font-light">
                Account Holder's Name*
              </label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                placeholder="Account Holder's Name"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${
                  isFieldEmpty("accountHolder")
                    ? "border border-[#a9712c]"
                    : "border border-[#1c3758]"
                }`}
              />
            </div>
            {/* SWIFT/BIC/IFSC Code */}
            <div>
              <label className="block mb-2 text-sm font-light">
                SWIFT/BIC/IFSC Code*
              </label>
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                placeholder="SWIFT/BIC/IFSC Code"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white rounded-md ${
                  isFieldEmpty("swiftCode")
                    ? "border border-[#a9712c]"
                    : "border border-[#1c3758]"
                }`}
              />
            </div>
            {/* IBAN */}
            <div>
              <label className="block mb-2 text-sm font-light">IBAN</label>
              <input
                type="text"
                placeholder="IBAN (International Bank Account Number)"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md`}
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
              />
            </div>
            {/* Bank/Branch Address */}
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-light">
                Bank/Branch Address
              </label>
              <textarea
                placeholder="Bank/Branch Address"
                className={`w-full p-2 bg-color-textfield-${theme} shadow-[0px_6px_20px_rgba(0,0,0,0.9)] placeholder-[#6e84a3] placeholder:text-sm text-white border border-[#1c3758] rounded-md h-24`}
              />
            </div>
          </div>
          <div className="mt-6 flex px-2">
            <Button
              text="Submit"
              className={`py-6 px-8 rounded-lg ${
                isFormValid() ? "bg-[#2c7be5]" : "bg-[#2c7be5] opacity-70"
              }`}
              disabled={!isFormValid()}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBankForm;
