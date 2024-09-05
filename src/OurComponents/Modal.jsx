import React from "react";

const Modal = ({ id, title, children, onClose, selectedType }) => {
  return (
    <div
      id={id}
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-[#152e4d] rounded-lg shadow-lg w-full max-w-4xl mx-4 md:mx-6 lg:mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-[#151c39] rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            className="text-white bg-transparent hover:bg-[#151c39] hover:text-gray-200 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col items-center justify-center bg-[#152e4d] p-4 md:p-6 lg:p-8 rounded-l-lg lg:w-[50%] w-full">
            {children}
          </div>
          <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 w-full lg:w-[50%]">
            <div className="mb-2">
              <label htmlFor="">Document Type</label>
              <div className="mb-4 mt-2">
                <select
                  name=""
                  id=""
                  className="w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] rounded-lg bg-[#152e4d] text-white placeholder-gray-300"
                >
                  <option value="">{selectedType}</option>
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="">Document Number</label>
              <div className="mb-4 mt-2">
                <input
                  type="text"
                  placeholder="Document Number"
                  className="w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] rounded-lg bg-[#152e4d] text-white placeholder-gray-300"
                />
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="">Issue Date</label>
              <div className="mb-4 mt-2">
                <input
                  type="text"
                  placeholder="Issue Date (DD/MM/YYYY)"
                  className="w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] rounded-lg bg-[#152e4d] text-white placeholder-gray-300"
                />
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="">Expiry Date (Optional)</label>
              <div className="mb-4 mt-2">
                <input
                  type="text"
                  placeholder="Expiry Date"
                  className="w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] rounded-lg bg-[#152e4d] text-white placeholder-gray-300"
                />
              </div>
            </div>

            <button className="w-[180px] bg-blue-600 py-2 px-2 mt-6 rounded-2xl text-white">
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
