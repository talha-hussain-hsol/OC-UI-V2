import { Spinner } from "react-bootstrap";
import React from "react";

function LoadingSpinner(props) {
  const { animation = "grow", color= '', variant = "primary", size = "md", custom = false, height = "70vh" } = props;

    return (
      <>
     
          <div className="w-100 d-flex justify-content-center align-items-center" style={{ zIndex: 9999,    minHeight: custom ? height : "", alignItems: "center" }}>
          <Spinner animation={animation} color={color} size={size} variant={variant} role="status" />
          </div>
      
      </>
    );
  };
  
  // );


LoadingSpinner.defaultProps = {
  size: "md",
  variant: "primary",
};

export default LoadingSpinner;
