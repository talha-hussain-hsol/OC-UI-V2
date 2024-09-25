import React from "react";

function Button({ className, text, onClick, icon, iconPosition = "left" , iconClassName}) {
  return (
    <button
      className={`flex items-center max-h-7  ${className}`}
      onClick={onClick}
    >
      {icon && iconPosition == "left" && <span className={`${iconClassName}`}>{icon}</span>}
      {text}
      {icon && iconPosition == "right" && <span className={`${iconClassName}`}>{icon}</span>}
    </button>
  );
}

export default Button;
