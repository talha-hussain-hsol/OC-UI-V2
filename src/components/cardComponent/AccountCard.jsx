import React from "react";
import CardHeader from "../header/CardHeader";
import MiniCards from "./MiniCards";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import { useTheme } from "../../contexts/themeContext";

const AccountCard = ({ accountData }) => {
  console.log("accountDataa", accountData)
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div
        key={accountData.id}
        className={`bg-color-card-${theme} w-full rounded-lg border-color-${theme} border-[1px] shadow-${theme} mb-6 px-4`}
      >
        <div className="flex flex-col items-center gap-4">
          <CardHeader
            FundName={accountData.account.fund.name}
            logoUrl={accountData.account.fund.logoBucketKey}
            fundClassName={`text-color-text-${theme} text-base`}
            showButton={false}
            showLogo={true}
          />

          <div className="flex flex-col gap-6 md:flex-row justify-center mb-5 w-full">
            <div className="w-full md:ml-4 ">
              <MiniCards
                leftContent={
                  <div className="flex flex-col gap-1">
                    <h3 className={`text-lg font-semibold text-color-${theme}`}>
                      {accountData.identity.label}
                    </h3>
                    <p className="text-[#6881a3] flex items-center gap-2">
                      Nationality:{" "}
                      {
                        accountData.identity.meta.data[
                          "individual.basic.nationality_code"
                        ]?.value
                      }
                      <FiCheckCircle color="#01cc7a" size={16} />
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-2">
                      Country of residence:{" "}
                      {
                        accountData.identity.meta.data[
                          "individual.basic.country_of_residence_code"
                        ]?.value
                      }
                      <FiCheckCircle color="#01cc7a" size={16} />
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-2">
                      Customer Type: {accountData.identity.type}
                      <FiCheckCircle color="#01cc7a" size={16} />
                    </p>
                    <p className={`text-color-${theme}`}>
                      Subscription Type:{" "}
                      {accountData.account.scount === 1
                        ? "Standalone"
                        : "Joint Account"}
                    </p>
                    <p className={`text-color-${theme}`}>
                      Status: {accountData.account.status}
                    </p>
                  </div>
                }
                showUserIcon={true}
                showLeft={true}
                showRight={false}
                leftClassName="text-xs font-medium"
              />
            </div>

            <div className="w-full md:mr-4 ">
              <MiniCards
                leftContent={
                  <div className="flex flex-col gap-1">
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <MdOutlineAccessTime color="#01cc7a" size={18} />
                      Launch Date: 5 May 2021
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <FiCheckCircle color="#01cc7a" size={16} />
                      Launch Price: SGD 10:00
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <FiCheckCircle color="#01cc7a" size={16} />
                      Last Dividend: 1.50
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <FiCheckCircle color="#01cc7a" size={16} />
                      Dividend Frequency: Monthly
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <FiCheckCircle color="#01cc7a" size={16} />
                      Min Initial Amount: SGD 1,000:00
                    </p>
                  </div>
                }
                rightContent={
                  <div className="flex flex-col gap-1">
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <FiCheckCircle color="#01cc7a" size={16} />
                      Latest Nav Price: SGD 6.1595
                    </p>
                    <p className="text-[#6881a3] flex items-center gap-1">
                      <FiCheckCircle color="#01cc7a" size={16} />
                      Past 1 Month: 0.26%
                    </p>
                  </div>
                }
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
    </div>
  );
};

export default AccountCard;
