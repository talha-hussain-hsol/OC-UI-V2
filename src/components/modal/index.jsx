import PropTypes from "prop-types";
import React from "react";
import { useTheme } from "../../contexts/themeContext";

function DynamicModal({ show, handleClose, handleConfirm, title, body }) {
  const { theme } = useTheme();
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
      {/* Overlay */}
      <div
        className={`relative bg-color-modal-${theme} rounded-lg shadow-lg md:w-1/3 w-full mx-4`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className={`text-2xl font-light text-color-modal-${theme} my-4 px-6`}>
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className={`px-8 my-6 text-color-modal-${theme} font-light text-lg`}>{body}</div>
        <div className="flex justify-end gap-4 py-8 px-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            className={`px-8 py-4 text-lg font-light text-white bg-color-modal-button-${theme} rounded-md hover:bg-gray-300 focus:outline-none`}
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            className={`px-8 py-4 text-lg font-light text-white bg-color-modal-button-${theme} rounded-md hover:bg-blue-700 focus:outline-none`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

DynamicModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
};

export default DynamicModal;
