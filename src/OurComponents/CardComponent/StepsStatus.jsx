import React from "react";
import { LuEye } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

const StepsStatus = ({
  FormName,
  className = "",
  status = null,
  statusClassname = '',
  iconClassname = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-lg border-[#1b3050] border-[1px] shadow-[2px_6px_20px_rgba(0,0,0,0.9)] py-1 px-4 flex items-center justify-between  w-full ${className}`}
    >
      <div className="flex items-center gap-1 my-2">
        <h3 className="font-normal text-white">{FormName}</h3>
      </div>
      <div className="flex items-center gap-1">
        <FiCheckCircle className={`${iconClassname}`}  size={16} />
        {status && <div className={ `${statusClassname}`}>{status}</div>}

        <LuEye color="white" size={18} />
      </div>
    </div>
  );
};

export default StepsStatus;
