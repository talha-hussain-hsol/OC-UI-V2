import React from "react";
import CardHeader from "./CardHeader";
import Button from "../Button";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import StepsStatus from "./StepsStatus";

const SummaryCard = () => {
  const rightContent = (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-white text-xs sm:text-sm flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Dealing Cycle: Open
      </p>
    </div>
  );
  const middleContent = (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-white text-xs sm:text-sm flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Fund's KYC: Accepted
      </p>
      <p className="text-[#6881a3] text-xs sm:text-sm flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Fund Domicile: united-states-of-america-(USA)
      </p>
    </div>
  );
  return (
    <>
    
      {/* <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-md border-[#1b3050] border-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mb-8 flex flex-col items-center justify-center h-full w-full">
       
      </div> */}
      <CardHeader
        FundName="Demo Fund"
        fundClassName="text-white text-sm sm:text-lg"
        showButton={false}
        showLogo={true}
        logoClassname="rounded-none sm:w-20 w-12"
        className="py-0 rounded-md mb-6 flex flex-col sm:flex-row "
        rightContent={rightContent}
        middleContent={middleContent}
      />
      <CardHeader
        FundName="Reference Documents"
        fundClassName="text-white text-xs sm:text-md"
        showButton={false}
        showLogo={false}
        className="mb-6"
      />
      <div className="sm:flex-row sm:gap-6 flex flex-col  w-full">
        <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-md border-[#1b3050] border-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mb-8 flex flex-col  justify-center h-full w-full">
          <CardHeader
            FundName="Profile"
            showButton={false}
            showLogo={false}
            fundClassName="text-[#6881a3]"
            // className="w-full"
          />
          <div className="flex flex-col ml-4 my-8 gap-3">
            <p className="text-[#6881a3] text-sm">Name : testa daSA AX</p>
            <p className="text-[#6881a3] text-sm">
              Nationality : Aland Islands
            </p>
            <p className="text-[#6881a3] text-sm">
              Country of Residence: Afghanistan
            </p>
            <p className="text-[#6881a3] text-sm">Customer Type : INDIVIDUAL</p>
            <p className="text-[#6881a3] text-sm">Email : undefined</p>
            <p className="text-[#6881a3] text-sm">Phone : 9386767676</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <StepsStatus
            FormName="Particular Form"
            className="text-sm"
            statusClassname="text-[#01cc7a] font-light"
            status="Completed"
            iconClassname="text-[#01cc7a]"
          />
          <StepsStatus
            FormName="Document Upload"
            className="text-sm"
            statusClassname="text-[#01cc7a] font-light"
            status="Completed"
            iconClassname="text-[#01cc7a]"
          />
          <StepsStatus
            FormName="Face Verification"
            className="text-sm"
            statusClassname="text-[#01cc7a] font-light"
            status="Completed"
            iconClassname="text-[#01cc7a]"
          />
          <StepsStatus
            FormName="VCIP"
            className="text-sm"
            statusClassname="text-[#01cc7a] font-light"
            status="Completed"
            iconClassname="text-[#01cc7a]"
          />
          <StepsStatus
            FormName="Bank Wallet"
            className="text-sm"
            statusClassname="text-[#01cc7a] font-light"
            status="Completed"
            iconClassname="text-[#01cc7a]"
          />
          <StepsStatus
            FormName="Application Document"
            className="text-sm"
            statusClassname="text-[#e63757] font-light"
            status="Incomplete"
            iconClassname="text-[#e63757]"
          />
        </div>
      </div>
      
    </>
  );
};

export default SummaryCard;
