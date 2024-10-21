// import React, { useState, useEffect } from "react";
// import Table from "../../../../components/table/Table";
// import Header from "../../../../components/header/Header";
// import Button from "../../../../components/ui/button/Button";
// import SideBar from "../../../../components/sidebar/Sidebar";
// import { AiFillEdit } from "react-icons/ai";
// import TabBar from "../../../../components/tabBar/TabBar";
// import { useTheme } from "../../../../contexts/themeContext";
// import { useNavigate } from "react-router-dom";
// import useIdentityHook from "../../../../hooks/useIdentityHook";
// import Loader from "../../../../components/ui/loader";

// const Identities = () => {
//   const [profileListData, setProfileListData] = useState([]);
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const {
//     entites,
//     activePortal,
//     portals,
//     handleActivePortal,
//     isLoader,
//     fetchIdentities,
//   } = useIdentityHook(setProfileListData); // Pass state setter function

//   // Fetch identity list on mount
//   useEffect(() => {
//     fetchIdentities();
//   }, []);

//   // Change theme based on user's choice
//   useEffect(() => {
//     document.body.style.backgroundColor =
//       theme === "SC"
//         ? "#ffffff"
//         : theme === "Ascent"
//         ? "rgba(18, 38, 63)"
//         : theme === "lightTheme"
//         ? "#000000"
//         : "";

//     return () => {
//       document.body.style.backgroundColor = "";
//     };
//   }, [theme]);

//   const handleClick = () => {
//     navigate("/stepper");
//   };

//   const handleToggle = () => {
//     console.log("Toggle Button Clicked!");
//   };

//   const headers = ["Name", "Type", "Status", "Actions"];

//   // Manage toggle status for rows
//   const [status, setStatus] = useState(
//     profileListData.map((row) => row.status === "Active")
//   );
//   const handleToggleStatus = (index) => {
//     setStatus((prevStatus) =>
//       prevStatus.map((stat, i) => (i === index ? !stat : stat))
//     );
//   };

//   return (
//     <div className={`bg-color-${theme}`}>
//       <SideBar portalType="Customer" />
//       <div className="py-6 lg:ml-12 ml-4 lg:px-10 ">
//         <div className="w-full">
//           <Header
//             heading="My Identities"
//             subheading="Overview"
//             showButton={false}
//             theme={theme}
//           />

//           <hr className=" border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 sm:ml-6 sm:mr-6 lg:mr-0 ml-6 mr-6" />
//           <div className="flex items-center justify-between ml-6 sm:ml-0 lg:mr-0 mr-6 ">
//             <TabBar
//               tabs={["My Identities"]}
//               className={`text-color-h1-${theme} font-medium sm:ml-6 pt-8 pb-8`}
//             />
//             <Button
//               className={`bg-color-button-${theme} text-white font-light rounded-lg xs:py-6 xs:px-8 py-6 px-4 text-sm sm:text-md`}
//               text="Create New Identity"
//               onClick={handleClick}
//             />
//           </div>
//           <hr className="border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 ml-6 lg:mr-0 mr-6" />
//         </div>
//         <div className="flex flex-col  items-center justify-center ml-6 lg:mr-0 mr-6">
//           <div
//             className={`bg-color-card-${theme} shadow-${theme} rounded-md w-full`}
//           >
//             <div
//               className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme} flex flex-col items-center justify-center h-full w-full`}
//             >
//               <p
//                 className={`py-2 text-color-para-${theme} sm:text-xs text-[8px] w-full px-4`}
//               >
//                 Please note that you can set your identities to "Inactive" or
//                 "Active" by using the toggle button. Your submitted account
//                 applications will not be impacted if you set your identities as
//                 "Inactive" <br />
//                 To delete/withdraw an account application, please proceed to the
//                 Account Details page to perform this action. <br />
//                 Please note that you can only delete/withdraw an application
//                 which are in "Draft" or "Pending" statuses. Applications that
//                 have already been processed for KYC screening cannot be deleted
//                 or withdrawn. <br />
//                 You may contact your Account Manager to assist you in this case.
//               </p>
//             </div>
//             {isLoader ? (
//               <Loader theme={theme} />
//             ) : (
//               <Table
//                 headers={headers}
//                 rows={profileListData}
//                 headerClassName={`bg-color-table-color-${theme}`}
//                 renderRow={(row, index) => (
//                   <>
//                     <td className="py-4 px-6 font-light">{row.label}</td>
//                     <td className="py-4 px-6 font-light">{row.type}</td>
//                     <td
//                       className={`py-4 px-6 text-color-status-${theme} font-light`}
//                     >
//                       {status[index] ? "Active" : "Inactive"}
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-4">
//                         <AiFillEdit
//                           className={`text-color-h1-${theme} cursor-pointer hover:text-[#ee9d0b]`}
//                         />
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={status[index]}
//                             onChange={() => handleToggle(index)}
//                             className="sr-only peer"
//                           />
//                           <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c7be5]"></div>
//                         </label>
//                         <p className="font-light">Active</p>
//                       </div>
//                     </td>
//                   </>
//                 )}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Identities;




import React, { useState, useEffect } from "react";
import Table from "../../../../components/table/Table";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/ui/button/Button";
import SideBar from "../../../../components/sidebar/Sidebar";
import { AiFillEdit } from "react-icons/ai";
import TabBar from "../../../../components/tabBar/TabBar";
import { useTheme } from "../../../../contexts/themeContext";
import { useNavigate } from "react-router-dom";
import useIdentityHook from "../../../../hooks/useIdentityHook";


import {
  getCustomerIdentityList,
  updateIdentityStatusAPI,
} from "../../../../api/userApi";
import axios from "axios";
import Loader from "../../../../components/ui/loader";
// import Pagination from "../../shared-components/pagination";

export default function Identities() {
  const { theme } = useTheme();

  const [profileListData, setProfileListData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderIdentites, setIsLoaderIdentities] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalIdentitiesCount, setTotalIdentitiesCount] = useState(0);
  const [pageOptions, setPageOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetIdentityList();
  }, [pageIndex]);

  const handleGetIdentityList = async () => {
    if (!hasMore) return;

    setIsLoaderIdentities(true);
    try {
      const response = await getCustomerIdentityList(
        offset,
        limit,
        cancelTokenSource.token
      );
      const newIdentities = response.data?.rows || [];
      setTotalIdentitiesCount(response.data?.count || 0);

      if (response?.success && newIdentities.length > 0) {
        setProfileListData(newIdentities);
        setOffset((prevOffset) => prevOffset + limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching identities", error);
    } finally {
      setIsLoaderIdentities(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    handleGetIdentityList(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  const handleEditClick = (identityId, identityType) => {
    navigate(
      `/profile/identity/${identityType.toLowerCase()}/particular/${identityId}`
    );
  };

  const handleChangeStatus = async (value, identityId) => {
    let dataToSend = { status: value };
    setIsLoader(true);
    const response = await updateIdentityStatusAPI(
      dataToSend,
      identityId,
      cancelTokenSource.token
    );
    if (response.success === true) {
      setIsLoader(false);
      handleGetIdentityList();
    } else {
      setIsLoader(false);
    }
  };

  const headerButtonCallBack = (e) => {
    e.preventDefault();
    navigate("/profile/identities");
  };

  const handleClickPrevious = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
      setOffset((pageIndex - 1) * limit);
    }
  };

  const handleClickNext = () => {
    if ((pageIndex + 1) * limit < totalIdentitiesCount) {
      setPageIndex(pageIndex + 1);
      setOffset((pageIndex + 1) * limit);
    }
  };

  const totalPages = Math.ceil(totalIdentitiesCount / limit);
  const Headers = ["Name", "Type", "Status", "Actions"];
  const {
    entites,
    activePortal,
    portals,
    handleActivePortal,
    fetchIdentities,
  } = useIdentityHook(setProfileListData);

  useEffect(() => {
    fetchIdentities();
  }, []);

  return (
    <div className={`bg-color-${theme}`}>
      <SideBar portalType="Customer" />
      <div className="py-6 lg:ml-12 ml-4 lg:px-10 ">
        <div className="w-full">
          <Header
            heading="My Identities"
            subheading="Overview"
            showButton={false}
            theme={theme}
          />
          <hr className=" border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 sm:ml-6 sm:mr-6 lg:mr-0 ml-6 mr-6" />
          <div className="flex items-center justify-between ml-6 sm:ml-0 lg:mr-0 mr-6 ">
            <TabBar
              tabs={["My Identities"]}
              className={`text-color-h1-${theme} font-medium sm:ml-6 pt-8 pb-8`}
            />
            <Button
              className={`bg-color-button-${theme} text-white font-light rounded-lg xs:py-6 xs:px-8 py-6 px-4 text-sm sm:text-md`}
              text="Create New Identity"
              onClick={headerButtonCallBack}
            />
          </div>
          <hr className="border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 ml-6 lg:mr-0 mr-6" />
        </div>
        <div className="flex flex-col  items-center justify-center ml-6 lg:mr-0 mr-6">
          <div
            className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme} flex flex-col items-center justify-center h-full w-full`}
          >
            <p
              className={`py-2 text-color-para-${theme} sm:text-xs text-[8px] w-full px-4`}
            >
              Please note that you can set your identities to "Inactive" or
              "Active" by using the toggle button. Your submitted account
              applications will not be impacted if you set your identities as
              "Inactive" <br />
              To delete/withdraw an account application, please proceed to the
              Account Details page to perform this action. <br />
              Please note that you can only delete/withdraw an application which
              are in "Draft" or "Pending" statues. Applications that has been
              already processed for KYC screening cannot be deleted/withdrawn.
              <br />
              You may contact your Account Manager to assist you in this case.
            </p>
          </div>
          <div
            className={`bg-color-card-${theme} shadow-${theme} rounded-b-md border-color-${theme} border-[1px] w-full`}
          >
            {isLoader ? (
              <Loader theme={theme} />
            ) : (
              <Table
                headers={Headers}
                rows={profileListData}
                headerClassName={`bg-color-table-color-${theme}`}
                renderRow={(row, index) => (
                  <>
                    <td className="py-4 px-6 font-light">{row.label}</td>
                    <td className="py-4 px-6 font-light">{row.type}</td>
                    <td
                      className={`py-4 px-6 text-color-status-${theme} font-light`}
                    >
                      {status[index] ? "Active" : "Inactive"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <AiFillEdit
                          className={`text-color-h1-${theme} cursor-pointer hover:text-[#ee9d0b] transition-colors duration-200`}
                          onClick={() => handleEditClick(row.id, row.type)}
                        />

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={status[index]}
                            onChange={(event) => {
                              handleChangeStatus(
                                event.target.checked
                                  ? "activate"
                                  : "deactivate",
                                index
                              );
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                        </label>
                        <p className="font-light">Active</p>
                      </div>
                    </td>
                  </>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
