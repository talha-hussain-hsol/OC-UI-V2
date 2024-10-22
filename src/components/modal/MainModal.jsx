import React from 'react';

function Modal({ size, show, onHide, centered, children }) {
  if (!show) return null;

  const sizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      default:
        return 'max-w-md';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        centered ? 'min-h-screen' : ''
      } bg-black bg-opacity-50`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden w-full ${sizeClasses()} p-6 relative`}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onHide}
        >
          &times;
        </button>
        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}

export default Modal;
