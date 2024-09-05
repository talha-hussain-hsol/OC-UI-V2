import React from "react";

function Button({ className, text, onClick, icon, iconPosition = "left" }) {
  return (
    <button
      className={`flex items-center max-h-7  ${className}`}
      onClick={onClick}
    >
      {icon && iconPosition == "left" && <span className="mr-2">{icon}</span>}
      {text}
      {icon && iconPosition == "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
}

export default Button;
