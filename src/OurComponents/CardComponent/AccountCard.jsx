import React from "react";
import CardHeader from "./CardHeader";
import MiniCards from "./MiniCards";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";

const AccountCard = () => {
  const leftContentCard = (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-semibold text-white">Muhammad Imran AX</h3>
      <p className="text-[#6881a3] flex items-center gap-2">
        Nationality: Aland Islands{" "}
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
      </p>
      <p className="text-[#6881a3] flex items-center gap-2">
        Country of residence: Akrotiri{" "}
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
      </p>
      <p className="text-[#6881a3] flex items-center gap-2">
        Customer Type: Individual{" "}
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
      </p>
      <p className="text-white">Subscription Type: Standalone</p>
      <p className="text-white">Status: Pending</p>
    </div>
  );
  const leftContentCard2 = (
    <div className="flex flex-col gap-1">
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <MdOutlineAccessTime color="#01cc7a" size={18} />
        </span>
        Launch Date: 5 May 2021
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Launch Price: SGD 10:00
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Last Dividend: 1.50
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Dividend Frequency: Monthly
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Min Initial Amount: SGD 1,000:00
      </p>
    </div>
  );
  const rightContentCard2 = (
    <div className="flex flex-col gap-1">
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Latest Nav Price: SGD 6.1595
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Past 1 Month: 0.26%
      </p>
    </div>
  );
  return (
    <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% w-full rounded-lg border-[#1b3050] border-[1px] shadow-[1px_10px_24px_rgba(0,0,0,0.9)] mb-6 px-4">
      <div className="flex flex-col items-center gap-4">
        <CardHeader FundName="Demo Funds" fundClassName="text-white" showButton={false} showLogo={true} />

        <div className="flex flex-col gap-6 md:flex-row justify-center md:justify-center mb-5 w-full">
          <div className="w-full md:ml-4 ">
            <MiniCards
              leftContent={leftContentCard}
              showUserIcon={true}
              showLeft={true}
              showRight={false}
              leftClassName="text-xs font-medium"
            />
          </div>
          <div className="w-full md:mr-4 ">
            <MiniCards
              leftContent={leftContentCard2}
              rightContent={rightContentCard2}
              showUserIcon={false}
              showLeft={true}
              showRight={true}
              leftClassName="text-xs font-medium text-[#6881a3] md:my-4"
              rightClassName="text-xs font-medium text-[#6881a3] md:my-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
