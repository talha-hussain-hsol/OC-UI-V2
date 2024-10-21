// import React from "react";
// import CardHeader from "./CardHeader";
// import MiniCards from "./MiniCards";
// import { FiCheckCircle } from "react-icons/fi";
// import { MdOutlineAccessTime } from "react-icons/md";
// import { useTheme } from "../../../contexts/themeContext";

// const AccountCard = () => {
//   const { theme } = useTheme();
//   console.log("theme", theme);

//   const leftContentCard = (
//     <div className="flex flex-col gap-1">
//       <h3 className={`xs:text-lg text-sm font-semibold text-color-${theme}`}>
//         Muhammad Imran AX
//       </h3>
//       <p className={`text-[#6881a3] xs:text-lg text-xs flex items-center gap-2`}>
//         Nationality: Aland Islands{" "}
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//       </p>
//       <p className="text-[#6881a3] xs:text-lg text-xs flex items-center gap-2">
//         Country of residence: Akrotiri{" "}
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//       </p>
//       <p className="text-[#6881a3] xs:text-lg text-xs flex items-center gap-2">
//         Customer Type: Individual{" "}
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//       </p>
//       <p className={`text-color-${theme}`}>Subscription Type: Standalone</p>
//       <p className={`text-color-${theme}`}>Status: Pending</p>
//     </div>
//   );
//   const leftContentCard2 = (
//     <div className="flex flex-col gap-1">
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <MdOutlineAccessTime color="#01cc7a" size={18} />
//         </span>
//         Launch Date: 5 May 2021
//       </p>
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//         Launch Price: SGD 10:00
//       </p>
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//         Last Dividend: 1.50
//       </p>
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//         Dividend Frequency: Monthly
//       </p>
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//         Min Initial Amount: SGD 1,000:00
//       </p>
//     </div>
//   );
//   const rightContentCard2 = (
//     <div className="flex flex-col gap-1">
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//         Latest Nav Price: SGD 6.1595
//       </p>
//       <p className="text-[#6881a3] flex items-center gap-1">
//         <span>
//           <FiCheckCircle color="#01cc7a" size={16} />
//         </span>
//         Past 1 Month: 0.26%
//       </p>
//     </div>
//   );
//   return (
//     <div
//       className={`bg-color-card-${theme}  rounded-lg border-color-${theme} border-[1px] shadow-${theme} mb-6 px-4 lg:ml-0 ml-6 lg:mr-0 mr-6`}
//     >
//       <div className="flex flex-col items-center gap-4">
//         <CardHeader
//           FundName="Demo Funds"
//           fundClassName={`text-color-text-${theme} text-base`}
//           showButton={false}
//           showLogo={true}
//         />

//         <div className="flex flex-col gap-6 md:flex-row justify-center md:justify-center mb-5 w-full">
//           <div className="w-full md:ml-4 ">
//             <MiniCards
//               leftContent={leftContentCard}
//               showUserIcon={true}
//               showLeft={true}
//               showRight={false}
//               leftClassName="text-xs font-medium"
//             />
//           </div>
//           <div className="w-full md:mr-4 ">
//             <MiniCards
//               leftContent={leftContentCard2}
//               rightContent={rightContentCard2}
//               showUserIcon={false}
//               showLeft={true}
//               showRight={true}
//               leftClassName="text-xs font-medium text-[#6881a3] md:my-4"
//               rightClassName="text-xs font-medium text-[#6881a3] md:my-4"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountCard;


import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/themeContext";
import { FiCheckCircle, FiEye, FiTrash2 } from "react-icons/fi";
import { MdOutlineAccessTime, MdOutlineMoneyOff } from "react-icons/md";
import { FaMoneyBillTransfer, FaHandshakeSimple, FaGift, FaSackDollar } from "react-icons/fa6";
import CardHeader from "../CardComponent/CardHeader";
import MiniCards from "../CardComponent/MiniCards";
import Tooltip from "../../Reusable Components/Tooltip";
import { checkSubscriptionAllow } from "../../../helpers/getFundConfiguration";
// import { getCountryNameFromEnums } from "../../../helpers/countries";

const AccountCard = ({ accountData, onDeleteAccount, onSwitchTransfer }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleViewAccount = () => {
    navigate(`/profile/detail/${accountData.identityId}/${accountData.accountId}`);
  };

  const handleAdditionalInvestment = () => {
    navigate(`/profile/detail/${accountData.identityId}/${accountData.accountId}?event="additional"`, {
      state: { isSignAgreement: false },
    });
  };

  const handleRedemptionRequest = () => {
    navigate(`/profile/detail/${accountData.identityId}/${accountData.accountId}?event="redemption"`, {
      state: { isSignAgreement: false },
    });
  };

  const handleSignAgreement = () => {
    navigate(`/profile/detail/${accountData.identityId}/${accountData.accountId}?event=application`);
  };

  const leftContentCard = (
    <div className="flex flex-col gap-1">
      <h3 className={`xs:text-lg text-sm font-semibold text-color-${theme}`}>
        {accountData.identity.label}
      </h3>
      <p className={`text-[#6881a3] xs:text-sm text-xs flex items-center gap-2`}>
        Nationality: Pakistani
        {/* Nationality: {getCountryNameFromEnums(accountData.identity.meta.data[`${accountData.identity.type.toLowerCase()}.basic.nationality_code`]?.value)}{" "} */}
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
      </p>
      <p className="text-[#6881a3] xs:text-sm text-xs flex items-center gap-2">
        Country of residence: Dubai
        {/* Country of residence: {getCountryNameFromEnums(accountData.identity.meta.data[`${accountData.identity.type.toLowerCase()}.basic.country_of_residence_code`]?.value)}{" "} */}
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
      </p>
      <p className="text-[#6881a3] xs:text-sm text-xs flex items-center gap-2">
        Customer Type: {accountData.identity.type}{" "}
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
      </p>
      <p className={`text-color-${theme}`}>Subscription Type: {accountData.account.scount === 1 ? "Standalone" : "Joint Account"}</p>
      <p className={`text-color-${theme}`}>Status: {accountData.account.status}</p>
    </div>
  );

  console.log("Account Data yeh hai:", accountData);
  

  const leftContentCard2 = (
    <div className="flex flex-col gap-1">
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <MdOutlineAccessTime color="#01cc7a" size={18} />
        </span>
        Dealing Cycle: {accountData.account.fund.meta.config.settings.dealing.type.end}
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Fund's KYC: {accountData.account.fund.meta.config.kyb.status}
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Digital Fund: {accountData.account.fund.meta.config.settings.account.applicant.asset.digital.status ? "Active" : "Not Active"}
      </p>
      <p className="text-[#6881a3] flex items-center gap-1">
        <span>
          <FiCheckCircle color="#01cc7a" size={16} />
        </span>
        Fund Domicile: {accountData.account.fund.meta.config.settings.region}
      </p>
    </div>
  );

  return (
    <div className={`bg-color-card-${theme} rounded-lg border-color-${theme} border-[1px] shadow-${theme} mb-6 px-4 lg:ml-0 ml-6 lg:mr-0 mr-6`}>
      <div className="flex flex-col items-center gap-4">
        <CardHeader
          FundName={accountData.account.fund.name}
          fundClassName={`text-color-text-${theme} text-base`}
          showButton={true}
          showLogo={true}
          logoSrc={accountData.account.fund.logoBucketKey}
        >
          <div className="flex gap-2">
            {accountData.account.fundId === "215" && (
              <Tooltip content="New Transaction Request">
                <button
                  onClick={() => navigate(`/profile/detail/${accountData.identityId}/${accountData.accountId}?event=complete`, { state: { isTransaction: true } })}
                  className="p-2 bg-white rounded-full"
                >
                  <MdOutlineMoneyOff size={20} />
                </button>
              </Tooltip>
            )}
            {accountData.account.meta.hasOwnProperty("subscriptionDocuments") && checkSubscriptionAllow(accountData.account.fund) && accountData.account.status === "accepted" && (
              <>
                <Tooltip content="Additional Investment">
                  <button onClick={handleAdditionalInvestment} className="p-2 bg-white rounded-full">
                    <FaMoneyBillTransfer size={20} />
                  </button>
                </Tooltip>
                <Tooltip content="Redemption Request">
                  <button onClick={handleRedemptionRequest} className="p-2 bg-white rounded-full">
                    <FaSackDollar size={20} />
                  </button>
                </Tooltip>
              </>
            )}
            {!accountData.account.meta.hasOwnProperty("subscriptionDocuments") && checkSubscriptionAllow(accountData.account.fund) && (
              <Tooltip content="Sign Agreement">
                <button onClick={handleSignAgreement} className="p-2 bg-white rounded-full">
                  <FaHandshakeSimple size={20} />
                </button>
              </Tooltip>
            )}
            <Tooltip content="Account Detail">
              <button onClick={handleViewAccount} className="p-2 bg-white rounded-full">
                <FiEye size={20} />
              </button>
            </Tooltip>
            {accountData.account.fund.meta.config.settings.account.transfer.enabled && (
              <Tooltip content="Transfer">
                <button onClick={onSwitchTransfer} className="p-2 bg-white rounded-full">
                  <FaMoneyBillTransfer size={20} />
                </button>
              </Tooltip>
            )}
            {accountData.account.fund.meta.config.settings.account.switch.enabled && (
              <Tooltip content="Switch">
                <button onClick={onSwitchTransfer} className="p-2 bg-white rounded-full">
                  <FaGift size={20} />
                </button>
              </Tooltip>
               )} 
            {(accountData.account.status === "draft" || accountData.account.status === "pending") && (
              <Tooltip content="Delete">
                <button onClick={() => onDeleteAccount(accountData.accountId)} className="p-2 bg-white rounded-full">
                  <FiTrash2 size={20} color="red" />
                </button>
              </Tooltip>
             )}
          </div>
        </CardHeader>

        <div className="flex flex-col gap-6 md:flex-row justify-center md:justify-center mb-5 w-full">
          <div className="w-full md:ml-4">
            <MiniCards
              leftContent={leftContentCard}
              showUserIcon={true}
              showLeft={true}
              showRight={false}
              leftClassName="text-xs font-medium"
            />
          </div>
          <div className="w-full md:mr-4">
            <MiniCards
              leftContent={leftContentCard2}
              showUserIcon={false}
              showLeft={true}
              showRight={false}
              leftClassName="text-xs font-medium text-[#6881a3] md:my-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;