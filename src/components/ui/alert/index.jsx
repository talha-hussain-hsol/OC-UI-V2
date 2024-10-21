// components/ui/Alert.jsx
import React from "react";

const Alert = ({ variant = "info", message, onClose }) => {
  const variantStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    danger: "bg-red-100 text-red-800 border-red-300",
  };

  const defaultStyle = "border shadow-sm"; // Static styling

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-md ${variantStyles[variant]} ${defaultStyle}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-lg font-bold focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
