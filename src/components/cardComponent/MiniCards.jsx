// import React from "react";
// import UserIcon from "../../assets/UserIcon.jpg";
// import { useTheme } from "../../contexts/themeContext";

// const MiniCards = ({
//   leftContent,
//   rightContent,
//   showUserIcon = true,
//   showLeft = true,
//   showRight = true,
//   leftClassName = "",
//   rightClassName = "",
// }) => {
//   const { theme } = useTheme();

//   return (
//     <div>
//       <div
//         className={`bg-color-card-${theme} rounded-lg border-color-${theme} border-[1px] shadow-${theme} py-2 px-4 w-full`}
//       >
//         <div className="flex flex-col md:flex-row justify-between gap-1 w-full">
//           {showLeft && (
//             <div className={`flex gap-4 w-full ${leftClassName}`}>
//               {showUserIcon && (
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={UserIcon}
//                     alt="User Icon"
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                 </div>
//               )}
//               <div>{leftContent}</div>
//             </div>
//           )}
//           {showRight && (
//             <div className={`flex flex-col w-full ${rightClassName}`}>
//               {rightContent}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MiniCards;

import React from "react";
import UserIcon from "../../assets/UserIcon.jpg";
import { useTheme } from "../../contexts/themeContext";

const MiniCards = ({
  leftContent,
  rightContent,
  showUserIcon = true,
  showLeft = true,
  showRight = true,
  leftClassName = "",
  rightClassName = "",
}) => {
  const { theme } = useTheme();

  return (
    <div>
      <div
        className={`bg-color-card-${theme} rounded-lg border-color-${theme} border-[1px] shadow-${theme} py-2 px-4 w-full`}
      >
        <div className="flex flex-col md:flex-row justify-between gap-1 w-full">
          {showLeft && (
            <div className={`flex gap-4 w-full ${leftClassName}`}>
              {showUserIcon && (
                <div className="flex items-center space-x-4">
                  <img
                    src={UserIcon}
                    alt="User Icon"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              )}
              <div>{leftContent}</div>
            </div>
          )}
          {showRight && (
            <div className={`flex flex-col w-full ${rightClassName}`}>
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCards;
