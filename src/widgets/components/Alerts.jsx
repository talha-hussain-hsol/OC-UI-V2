import React, { useState, useEffect } from 'react';

function CustomAlert(props) {
  const { variant, message, onClose, hideAuto, handleCloseAlert, show: propsShow } = props;
  const [show, setShow] = useState(propsShow);

  useEffect(() => {
    if (hideAuto) {
      const timer = setTimeout(() => {
        setShow(false);
        handleCloseAlert();
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [hideAuto]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const variantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'danger':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    show && (
      <div
        className={`relative border p-4 rounded-md ${variantClasses()} ${props?.top ? 'fixed top-0' : 'my-4'}`}
        role="alert"
      >
        <span className="block sm:inline">{message}</span>
        <button
          type="button"
          className="absolute top-0 right-0 mt-1 mr-2 text-2xl font-bold text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
    )
  );
}

export default CustomAlert;
