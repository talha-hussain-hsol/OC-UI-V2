// components/ui/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Return null if the modal is not open

  const modalBg = "bg-white"; // Static background color
  const overlayBg = "bg-black bg-opacity-50"; // Overlay background

  return (
    <div className={`fixed inset-0 ${overlayBg} flex items-center justify-center`}>
      <div className={`w-11/12 max-w-lg p-6 rounded-md shadow-lg ${modalBg}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
