

import React from "react";

function SpinnerWithBackDrop(props) {
  const { animation = "grow", variant = "primary", size = "md", custom = false, height = "70vh", loaderDescription } = props;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center flex-col"
        style={{ height: height }}
      >
        <div
          className={`animate-spin rounded-full border-t-4 border-${variant === "primary" ? "blue-500" : variant === "secondary" ? "gray-500" : "green-500"} 
          ${size === "sm" ? "w-6 h-6" : size === "md" ? "w-12 h-12" : "w-16 h-16"}`}
          role="status"
        />
        {loaderDescription && (
          <h3 className="text-white mt-5">
            {loaderDescription}
          </h3>
        )}
      </div>
    </>
  );
}

SpinnerWithBackDrop.defaultProps = {
  size: "md",
  variant: "primary",
};

export default SpinnerWithBackDrop;
