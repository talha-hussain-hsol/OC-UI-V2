// This is the sample project used to apply dynamic themeing in the portals


import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";

const MiniCards = ({ theme }) => {
  return (
    <div
      className={`bg-color-card-${theme} border-color-${theme} p-4 rounded-lg shadow-md`}
    >
      <div className="flex flex-col gap-4">
        <p className={`text-color-${theme} flex items-center gap-2`}>
          Nationality: Aland Islands <FiCheckCircle />
        </p>
        <p className={`text-color-${theme} flex items-center gap-2`}>
          Country of residence: Akrotiri <FiCheckCircle />
        </p>
        <p className={`text-color-${theme} flex items-center gap-2`}>
          Launch Date: 5 May 2021 <MdOutlineAccessTime />
        </p>
      </div>
    </div>
  );
};

export default MiniCards;
