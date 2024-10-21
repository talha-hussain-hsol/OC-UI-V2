// Hard Coded Previous Code

// import React, { useEffect } from "react";
// import SideBar from "../Reusable Components/SideBar";
// import Header from "../Reusable Components/Header";
// import AccountCard from "../Reusable Components/CardComponent/AccountCard";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../contexts/themeContext";

// const Accounts = () => {
//   const { theme } = useTheme();

//   useEffect(() => {
//     console.log("Current theme:", theme);

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
//   const navigate = useNavigate();
//   function handleClick() {
//     navigate("/fund-code");
//   }

//   return (
//     <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
//       <SideBar portalType="Customer" />
//       <div className="flex-1 py-6 lg:ml-9 lg:px-10 px-2">
//         <Header
//           heading="My Accounts"
//           subheading="Overview"
//           showButton={true}
//           onButtonClick={handleClick}
//           theme={theme}
//         />
//         <hr className=" border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 lg:ml-0 ml-6 sm:mr-6 lg:mr-0 mr-6" />
//         <AccountCard />
//         <AccountCard />
//         <AccountCard />
//       </div>
//     </div>
//   );
// };

// export default Accounts;




// Product Code From Github
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Button,
//   Col,
//   Form,
//   InputGroup,
//   Row,
//   Spinner,
//   Alert,
//   Modal,
//   Container,
//   Tooltip,
//   OverlayTrigger,
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { DynamicHeader } from "../../OurComponents/Reusable Components/Header";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import {
//   getCustomerAccounts,
//   deleteAccountAPI,
// } from "../../api/userApi";
// import axios, { CancelTokenSource } from "axios";
// import FeatherIcon from "feather-icons-react";
// import {
//   faTrash,
//   faMoneyBillTransfer,
//   faShuffle,
//   faEye,
//   faHandshakeSimple,
//   faGift,
//   faSackDollar,
// } from "@fortawesome/free-solid-svg-icons";
// import LoadingSpinner from "../../../widgets/bootstrap-component/Spinner";
// import EntityIcon from "./../../../icons/entity-icon-small.svg";
// import { checkSubscriptionAllow } from "../../../helpers/getFundConfiguration";
// import { AiOutlineConsoleSql } from "react-icons/ai";
// import Countries from "../../../helpers/countries";
// import { setCustomerAccounts } from "./../../../components/store/slices/customerAccountSlice";
// import { useSelector, useDispatch } from "react-redux";
// import CustomAlert from "../../../widgets/bootstrap-component/Alert";
// var theme = localStorage.getItem("portal_theme");
// export default function InvestorSubscriptionList({ ...props }) {
//   const [accountsData, setAccountsData] = useState([]);
//   const [isLoader, setIsLoader] = useState(false);
//   const [isLoaderAccount, setIsLoaderAccount] = useState(false);
//   const [deleteAccountModal, setDeleteAccountModal] = useState(false);
//   const [deleteAccountId, setDeleteAccountId] = useState(null);
//   const [switchTransferModal, setSwitchTransferModal] = useState(false);

//   const cancelTokenSource = axios.CancelToken.source();
//   const history = useLocation();
//   const navigate = useNavigate();
//   const [offset, setOffset] = useState(0);
//   const [limit] = useState(10);

//   const dispatch = useDispatch();

//   const customerAccounts = useSelector((state) => state?.customerAccount);
//   const [activeItem, setActiveItem] = useState(null);
//   const handleItemClick = (item) => {
//     setActiveItem(item);
//   };

//   const headerButtonCallBack = (e) => {
//     e.preventDefault();
//     navigate("/subscription/request");
//   };

//   useEffect(() => {
//     console.log("isLoaderAccount", isLoaderAccount);
//   }, [isLoaderAccount]);
//   useEffect(() => {
//     console.log("accountsData", accountsData);
//   }, [accountsData]);
//   useEffect(() => {
//     console.log(
//       "customerAccountscustomerAccountscustomerAccountscustomerAccountscustomerAccounts",
//       customerAccounts
//     );
//   }, [customerAccounts]);

//   useEffect(() => {
//     const abortController = new AbortController();

//     loadMoreAccounts(abortController);

//     return () => {
//       abortController.abort(); // Cancel the request on component unmount or route change
//     };
//   }, []);
//   // useEffect(() => {
//   //   const handleScroll = () => {
//   //     if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
//   //       loadMoreAccounts();
//   //     }
//   //   };

//   //   window.addEventListener("scroll", handleScroll);
//   //   return () => window.removeEventListener("scroll", handleScroll);
//   // }, [offset, limit]);

//   const loadMoreAccounts = async (abortController) => {
//     setIsLoader(true); // Main loader to indicate the entire loading process
//     let currentOffset = offset;
//     let keepLoading = true;

//     while (keepLoading && !abortController.signal.aborted) {
//       try {
//         setIsLoaderAccount(true);

//         const response = await getCustomerAccounts(
//           currentOffset,
//           limit,
//           cancelTokenSource.token
//         );
//         const newAccounts = response.data?.customer_accounts || [];

//         if (response?.success && newAccounts.length > 0) {
//           setAccountsData((prevAccounts) => [...prevAccounts, ...newAccounts]);
//           currentOffset += limit;
//           setOffset(currentOffset);
//         } else {
//           keepLoading = false; // Stop loading if no more accounts are returned
//         }
//       } catch (error) {
//         if (abortController.signal.aborted) {
//           console.log("Fetch aborted");
//         } else {
//           console.error("Error fetching accounts", error);
//         }
//         keepLoading = false; // Stop loading on error
//       } finally {
//         // Hide the loader after each API call
//         setIsLoaderAccount(false);
//       }
//     }

//     // Main loader off after the entire process
//     setIsLoader(false);
//   };

//   const handleGetCustomersAccounts = async () => {
//     console.log(`checking`);
//     setIsLoaderAccount(true);

//     const response = await getCustomerAccounts(0, 10, cancelTokenSource.token);
//     if (response.success === true) {
//       setIsLoaderAccount(false);
//       setAccountsData(response?.data?.customer_accounts);
//       dispatch(setCustomerAccounts(response?.data?.customer_accounts));
//     } else {
//       setIsLoaderAccount(false);
//     }
//   };

//   const hanleDeleteAccount = (e, accountId) => {
//     setDeleteAccountId(accountId);
//     setDeleteAccountModal(true);
//   };
//   const handleDeleteAccountConfirm = async (e) => {
//     setIsLoaderAccount(true);
//     setDeleteAccountModal(false);
//     const response = await deleteAccountAPI(
//       deleteAccountId,
//       cancelTokenSource.token
//     );
//     if (response.success === true) {
//       setIsLoaderAccount(false);
//       handleGetCustomersAccounts();
//       props?.handleAlert({
//         variant: "success",
//         message: "Account Deleted Successfully",
//         show: true,
//         hideAuto: true,
//       });
//     } else {
//       setIsLoaderAccount(false);
//     }
//   };
//   const closeModal = () => {
//     setDeleteAccountModal(false);
//   };
//   const closeModalSwitchModal = () => {
//     setSwitchTransferModal(false);
//   };
//   const handleClickSwicthTransfer = (e) => {
//     setSwitchTransferModal(true);
//   };
//   const getCountryNameFromEnums = (countryCode) => {
//     let countryName = "";
//     if (Countries.length > 0) {
//       for (let a of Countries) {
//         if (a.code == countryCode) {
//           countryName = a.key;
//         }
//       }
//     }
//     if (countryName == "") {
//       return countryCode;
//     } else {
//       return countryName;
//     }
//   };
//   return (
//     <>
//       <div className="main-content">
//         <DynamicHeader
//           style={{ marginBottom: "0rem" }}
//           title="My Accounts"
//           titlesmall="OverView"
//           buttontext={"Create An Account"}
//           buttoncallback={headerButtonCallBack}
//           isShowFundLogo={true}
//         />

//         <Row className="justify-content-center">
//           {accountsData.length > 0
//             ? accountsData.map((item, index) => {
//                 return (
//                   <div className="card" key={index}>
//                     <div className="card-header">
//                       <h4 className="card-header-title custom-responsive-header">
//                         <img
//                           src={item?.account?.fund?.logoBucketKey}
//                           style={{
//                             maxHeight: "30px",
//                             textAlign: "left",
//                             marginRight: "5px",
//                           }}
//                           alt=""
//                           className="rounded "
//                         />
//                         {item?.account?.fund?.name}
//                       </h4>

//                       {/* {item?.account?.status == 'accepted' && ( */}
//                       {/* http://customer.oc.sg:8002/profile/detail/098d9e73-f3e5-47c3-b8eb-92d45f5d3306/252cd9e4-17c3-4e78-90ea-62a7e88ffe29 */}
//                       {(item?.account?.fundId === 215 ||
//                         item?.account?.fundId === "215") && (
//                         <button
//                           onClick={() =>
//                             navigate(
//                               `/profile/detail/${item?.identityId}/${item?.accountId}?event=complete`,
//                               {
//                                 state: { isTransaction: true },
//                               }
//                             )
//                           }
//                           className="btn btn-sm btn-white  custom-responsive-btn"
//                           style={{ marginRight: "10px", padding: "4px 8px" }}
//                         >
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>New Transaction Request</Tooltip>}
//                           >
//                             <span>
//                               <img
//                                 style={{ height: "35px", width: "35px" }}
//                                 className={"subscription_list_icons"}
//                                 src={
//                                   "/img/transaction-icons/add_new_transactions.png"
//                                 }
//                               />
//                             </span>
//                           </OverlayTrigger>
//                         </button>
//                       )}

//                       {/* )} */}
//                       <>
//                         {item?.account?.meta.hasOwnProperty(
//                           "subscriptionDocuments"
//                         ) ? (
//                           <>
//                             {checkSubscriptionAllow(item?.account?.fund) &&
//                               item?.account?.status == "accepted" && (
//                                 <>
//                                   <button
//                                     onClick={() =>
//                                       navigate(
//                                         `/profile/detail/${item?.identityId}/${item?.accountId}?event="additional"`,
//                                         {
//                                           state: { isSignAgreement: false },
//                                         }
//                                       )
//                                     }
//                                     className="btn btn-sm btn-white  custom-responsive-btn"
//                                     style={{
//                                       marginRight: "10px",
//                                       padding: "10px 15px",
//                                     }}
//                                   >
//                                     <OverlayTrigger
//                                       placement="top"
//                                       overlay={
//                                         <Tooltip>Additional Investment</Tooltip>
//                                       }
//                                     >
//                                       <span>
//                                         <img
//                                           className={"subscription_list_icons"}
//                                           src={
//                                             "/img/transaction-icons/subscription.svg"
//                                           }
//                                         />
//                                       </span>
//                                     </OverlayTrigger>
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       navigate(
//                                         `/profile/detail/${item?.identityId}/${item?.accountId}?event="redemption"`,
//                                         {
//                                           state: { isSignAgreement: false },
//                                         }
//                                       )
//                                     }
//                                     className="btn btn-sm btn-white  custom-responsive-btn"
//                                     style={{
//                                       marginRight: "10px",
//                                       padding: "10px 15px",
//                                     }}
//                                   >
//                                     <OverlayTrigger
//                                       placement="top"
//                                       overlay={
//                                         <Tooltip>Redemption Request</Tooltip>
//                                       }
//                                     >
//                                       <span>
//                                         <img
//                                           className={"subscription_list_icons"}
//                                           src={
//                                             "/img/transaction-icons/Redemption.svg"
//                                           }
//                                         />
//                                       </span>
//                                     </OverlayTrigger>
//                                   </button>
//                                 </>
//                               )}
//                           </>
//                         ) : checkSubscriptionAllow(item?.account?.fund) ? (
//                           <Link
//                             to={`/profile/detail/${item?.identityId}/${item?.accountId}?event=application`}
//                             className="btn btn-sm btn-white  custom-responsive-btn"
//                             style={{
//                               marginRight: "10px",
//                               padding: "10px 15px",
//                             }}
//                           >
//                             <OverlayTrigger
//                               placement="top"
//                               overlay={<Tooltip>Sign Agreement</Tooltip>}
//                             >
//                               <span>
//                                 <img
//                                   className={"subscription_list_icons"}
//                                   src={
//                                     "/img/transaction-icons/sign_agreement.png"
//                                   }
//                                 />
//                               </span>
//                             </OverlayTrigger>
//                           </Link>
//                         ) : null}
//                       </>
//                       <Link
//                         to={`/profile/detail/${item?.identityId}/${item?.accountId}`}
//                         className="btn btn-sm btn-white  custom-responsive-btn"
//                         style={{ marginRight: "10px", padding: "10px 15px" }}
//                       >
//                         <OverlayTrigger
//                           placement="top"
//                           overlay={<Tooltip>Account Detail</Tooltip>}
//                         >
//                           <span>
//                             {/* <img className={"subscription_list_icons"} src={"/img/transaction-icons/sign_agreement.png"} /> */}
//                             <FontAwesomeIcon
//                               color="#2C7BE5"
//                               icon={faEye}
//                               style={{ fontSize: "16" }}
//                             />
//                           </span>
//                         </OverlayTrigger>
//                       </Link>

//                       {item?.account?.fund?.meta?.config?.settings?.account
//                         ?.transfer?.enabled && (
//                         <div
//                           style={{ marginRight: "10px", padding: "10px 15px" }}
//                           onClick={(e) => {
//                             handleClickSwicthTransfer(e);
//                           }}
//                           className="btn btn-sm btn-white  custom-responsive-btn"
//                         >
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Transfer</Tooltip>}
//                           >
//                             <span>
//                               <img
//                                 className={"subscription_list_icons"}
//                                 src={"/img/transaction-icons/icons.svg"}
//                               />
//                             </span>
//                           </OverlayTrigger>
//                         </div>
//                       )}
//                       {item?.account?.fund?.meta?.config?.settings?.account
//                         ?.switch?.enabled && (
//                         <div
//                           style={{ marginRight: "10px", padding: "10px 15px" }}
//                           onClick={(e) => {
//                             handleClickSwicthTransfer(e);
//                           }}
//                           className="btn btn-sm btn-white  custom-responsive-btn"
//                         >
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Switch</Tooltip>}
//                           >
//                             <span>
//                               <img
//                                 className={"subscription_list_icons"}
//                                 src={"/img/transaction-icons/switch.png"}
//                               />
//                             </span>
//                           </OverlayTrigger>
//                         </div>
//                       )}
//                       {(item?.account?.status == "draft" ||
//                         item?.account?.status == "pending") && (
//                         <div
//                           style={{ marginRight: "10px", padding: "10px 15px" }}
//                           onClick={(e) => {
//                             hanleDeleteAccount(e, item.accountId);
//                           }}
//                           className="btn btn-sm btn-white  custom-responsive-btn"
//                         >
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Delete</Tooltip>}
//                           >
//                             <span>
//                               <FontAwesomeIcon
//                                 color="red"
//                                 icon={faTrash}
//                                 style={{ fontSize: "16" }}
//                               />
//                             </span>
//                           </OverlayTrigger>
//                         </div>
//                       )}
//                     </div>
//                     <div className="card-body mt-2">
//                       <div className="row">
//                         <div className="col-12 col-md-6">
//                           <div className="card mb-2">
//                             <div className="card-body">
//                               <div className="row align-items-center">
//                                 <div className="col-auto">
//                                   <a href="#!" className="avatar avatar-lg">
//                                     {
//                                       item?.identity?.type == "INDIVIDUAL" ? (
//                                         <img
//                                           src="/img/investor/default-avatar.png"
//                                           alt="..."
//                                           className="avatar-img rounded-circle"
//                                         />
//                                       ) : (
//                                         <EntityIcon
//                                           className={"nodeIcon"}
//                                           fontSize={"large"}
//                                           color={"action"}
//                                           style={{
//                                             fill:
//                                               theme == "dark" ||
//                                               theme == undefined
//                                                 ? "white"
//                                                 : "black",
//                                           }}
//                                         />
//                                       )
//                                       // <img src="/img/office-building-icon-32.png" alt="..." className="avatar-img rounded-circle" />
//                                     }
//                                   </a>
//                                 </div>
//                                 <div className="col ms-n2">
//                                   <h4 className="mb-1">
//                                     <p
//                                       style={{ marginBottom: "0px" }}
//                                     >{`${item?.identity?.label}`}</p>
//                                   </h4>

//                                   <p className="small text-muted mb-1">
//                                     {/* {item?.identity?.type.toLowerCase() ==
//                                       "corporate"
//                                       ? "Country of Incorporation: "
//                                       : "Citizenship: "} */}
//                                     {item?.identity?.type.toLowerCase() ===
//                                       "corporate" && (
//                                       <>
//                                         Country of Incorporation:{" "}
//                                         {item?.identity?.meta?.data[
//                                           item?.identity?.type.toLowerCase() +
//                                             ".basic.country_of_residence_code"
//                                         ]?.value ||
//                                           item?.identity?.meta?.data[
//                                             item?.identity?.type.toLowerCase() +
//                                               ".basic.incorporate_country_code"
//                                           ]?.value}{" "}
//                                         <span class="text-success">
//                                           <FeatherIcon
//                                             className={`text-success`}
//                                             icon="check-circle"
//                                             color="green"
//                                             size="15"
//                                           />
//                                           <br />
//                                         </span>
//                                       </>
//                                     )}
//                                     {item?.identity?.type.toLowerCase() !==
//                                       "corporate" && (
//                                       <>
//                                         <p className="small mb-0">
//                                           Nationality:{" "}
//                                           {getCountryNameFromEnums(
//                                             item?.identity?.meta?.data[
//                                               item?.identity?.type.toLowerCase() +
//                                                 ".basic.country_of_residence_code"
//                                             ]?.value
//                                               ? item?.identity?.meta?.data[
//                                                   item?.identity?.type.toLowerCase() +
//                                                     ".basic.nationality_code"
//                                                 ]?.value
//                                               : item?.identity?.meta?.data[
//                                                   item?.identity?.type.toLowerCase() +
//                                                     ".basic.nationality_code"
//                                                 ]?.value
//                                           )}{" "}
//                                           <span class="text-success">
//                                             <FeatherIcon
//                                               className={`text-success`}
//                                               icon="check-circle"
//                                               color="green"
//                                               size="15"
//                                             />
//                                           </span>
//                                         </p>

//                                         <p className="small mb-0">
//                                           Country Of Residence:{" "}
//                                           <span
//                                             style={{
//                                               textTransform: "capitalize",
//                                             }}
//                                           >
//                                             {getCountryNameFromEnums(
//                                               item?.identity?.meta?.data[
//                                                 item?.identity?.type.toLowerCase() +
//                                                   ".basic.country_of_residence_code"
//                                               ]?.value ||
//                                                 item?.identity?.meta?.data[
//                                                   item?.identity?.type.toLowerCase() +
//                                                     ".basic.incorporate_country_code"
//                                                 ]?.value
//                                             )}
//                                           </span>{" "}
//                                           <span className="text-success">
//                                             <FeatherIcon
//                                               className={`text-success`}
//                                               icon="check-circle"
//                                               color="green"
//                                               size="15"
//                                             />
//                                           </span>
//                                         </p>
//                                       </>
//                                     )}
//                                     {/* <br /> */}
//                                     Customer Type:
//                                     <>
//                                       <span
//                                         style={{
//                                           textTransform: "capitalize",
//                                         }}
//                                       >
//                                         {item?.identity?.type.toLowerCase()}
//                                       </span>{" "}
//                                       <span class="text-success">
//                                         <FeatherIcon
//                                           className={`text-success`}
//                                           icon="check-circle"
//                                           color="green"
//                                           size="15"
//                                         />
//                                       </span>
//                                     </>
//                                   </p>

//                                   <p className="small mb-0">
//                                     <span className="text-success"> </span>{" "}
//                                     Subscription Type:{" "}
//                                     {item?.account?.scount == 1
//                                       ? "Standalone"
//                                       : "Joint Account"}
//                                   </p>
//                                   <p className="small mb-0">
//                                     <span
//                                       className={
//                                         item?.account?.status == "pending" ||
//                                         item?.account?.status == "draft"
//                                           ? "text-warning"
//                                           : "text-success"
//                                       }
//                                     >
//                                       {" "}
//                                     </span>{" "}
//                                     Status:{" "}
//                                     {item?.account?.status?.replace(
//                                       /^\w/,
//                                       (c) => c.toUpperCase()
//                                     )}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         {(item?.account?.fund?.meta?.config?.settings?.display
//                           ?.fund_info === true ||
//                           item?.account?.fund?.meta?.config?.settings?.display
//                             ?.fund_info == "true") && (
//                           <>
//                             {item?.account?.fundId == 3 ||
//                             item?.account?.fundId == 351 ||
//                             item?.account?.fundId == 1 ||
//                             item?.account?.fundId == 215 ? (
//                               <div className="col-12 col-md-6">
//                                 <div className="card mb-2">
//                                   <div className="card-body">
//                                     <div className="row align-items-cente mb-3 mt-3">
//                                       <div className="col-sm-6">
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="clock"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             {/* Dealing Every Month */}
//                                             {/* Dealing Cycle: Open  */}
//                                             Launch Date: 5 May 2021
//                                             {/* {item?.account?.fund?.meta?.config?.settings?.dealing?.period ? item?.account?.fund?.meta?.config?.settings?.dealing?.period : item?.account?.fund?.meta?.config?.settings?.dealing?.period} */}
//                                           </small>
//                                         </div>

//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Launch Price: SGD: 10:00
//                                           </small>
//                                         </div>
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Last Dividend: 1.50
//                                           </small>
//                                         </div>
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Dividend Frequency: Monthly
//                                           </small>
//                                         </div>
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Min Initial Amount: SGD 1,000:00
//                                           </small>
//                                         </div>
//                                       </div>
//                                       <div className="col-sm-6">
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Latest Nav Price: SGD 6.1595
//                                           </small>
//                                         </div>
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Past 1 Month: 0.26%
//                                           </small>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="col-12 col-md-6">
//                                 <div className="card mb-2">
//                                   <div className="card-body">
//                                     <div className="row align-items-cente mb-3 mt-3">
//                                       <div className="col ms-n2">
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="clock"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             {/* Dealing Every Month */}
//                                             {/* Dealing Cycle: Open  */}
//                                             Dealing Cycle:{" "}
//                                             {item?.account?.fund?.meta?.config
//                                               ?.settings?.dealing?.type?.end
//                                               ? item?.account?.fund?.meta
//                                                   ?.config?.settings?.dealing
//                                                   ?.type?.end
//                                               : item?.account?.fund?.meta
//                                                   ?.config?.settings?.dealing
//                                                   ?.type?.end}
//                                             {/* {item?.account?.fund?.meta?.config?.settings?.dealing?.period ? item?.account?.fund?.meta?.config?.settings?.dealing?.period : item?.account?.fund?.meta?.config?.settings?.dealing?.period} */}
//                                           </small>
//                                         </div>

//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Fund's KYC:
//                                             {
//                                               item?.account?.fund?.meta?.config
//                                                 ?.kyb?.status
//                                             }
//                                           </small>
//                                         </div>
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Digital Fund:
//                                             {item?.account?.fund?.meta?.config
//                                               ?.settings?.account?.applicant
//                                               ?.asset?.digital?.status
//                                               ? "Active"
//                                               : "Not Active"}
//                                           </small>
//                                         </div>
//                                         <div className="row align-items-center">
//                                           <small className="text-muted">
//                                             <span class="text-success">
//                                               <FeatherIcon
//                                                 className={`text-success`}
//                                                 icon="check-circle"
//                                                 color="green"
//                                                 size="15"
//                                               />
//                                             </span>{" "}
//                                             Fund Domicile:
//                                             {
//                                               item?.account?.fund?.meta?.config
//                                                 ?.settings?.region
//                                             }
//                                           </small>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             : null}
//         </Row>
//         {isLoaderAccount && (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "20rem",
//             }}
//           >
//             <LoadingSpinner animation="grow" custom={true} height="36vh" />
//           </div>
//         )}
//         {/* {
//           isLoader && (
//             <LoadingSpinner animation="grow" custom={true} height="20vh" />
//           )
//         } */}
//       </div>
//       <Modal
//         size="md"
//         show={deleteAccountModal}
//         onHide={closeModal}
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <div>
//               <h3>Confirmation Message</h3>
//             </div>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="show-grid">
//           <Container>
//             <div>
//               <h4>Are you sure, you would like to delete this application?</h4>
//               <div style={{ display: "flex", justifyContent: "center" }}>
//                 <Button
//                   className="btn btn-sm btn-danger  custom-responsive-btn"
//                   onClick={(e) => {
//                     handleDeleteAccountConfirm(e);
//                   }}
//                 >
//                   Confirm
//                 </Button>
//               </div>
//             </div>
//           </Container>
//         </Modal.Body>
//       </Modal>
//       <Modal
//         size="md"
//         show={switchTransferModal}
//         onHide={closeModalSwitchModal}
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <div>
//               <h3>Coming Soon!</h3>
//             </div>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="show-grid">
//           <Container>
//             <div>
//               <h4>This Feature is in progress!</h4>
//               <div style={{ display: "flex", justifyContent: "center" }}>
//                 <Button
//                   className="btn btn-sm btn-danger  custom-responsive-btn"
//                   onClick={(e) => {
//                     setSwitchTransferModal(false);
//                   }}
//                 >
//                   OK
//                 </Button>
//               </div>
//             </div>
//           </Container>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }




// Api Hitting manual Code
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../contexts/themeContext";
// import useAccountsHook from "../../hooks/useAccountHook";
// import useEntityStore from "../../store/useEntityStore";
// import Loader from "../../components/ui/loader";
// import SideBar from "../../OurComponents/Reusable Components/SideBar";
// import Header from "../../OurComponents/Reusable Components/Header";
// import AccountCard from "../../OurComponents/Reusable Components/CardComponent/AccountCard";

// const Accounts = () => {
//   const { accounts, isLoader, fetchMoreAccounts } = useAccountsHook();
//   const { entityId } = useEntityStore.getState();
//   const { theme } = useTheme();
//   const observerRef = useRef();
//   const [isFetchingMore, setIsFetchingMore] = useState(false);

//   const navigate = useNavigate();
//   function handleClick() {
//     navigate("/fund-code");
//   }

//   // Use the observer to trigger API call when reaching the bottom of the list
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isFetchingMore && !isLoader) {
//           setIsFetchingMore(true);
//           fetchMoreAccounts().finally(() => {
//             setIsFetchingMore(false);
//           });
//         }
//       },
//       { threshold: 1 }
//     );

//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observer.unobserve(observerRef.current);
//       }
//     };
//   }, [isFetchingMore, isLoader]);

//   return (
//     <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
//       <SideBar portalType="Customer" />
//       <div className="flex-1 py-6 lg:ml-9 lg:px-10 px-2">
//         <Header
//           heading="My Accounts"
//           subheading="Overview"
//           showButton={true}
//           onButtonClick={handleClick}
//           theme={theme}
//         />
//         <hr className=" border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 lg:ml-0 ml-6 sm:mr-6 lg:mr-0 mr-6" />
//         {isLoader && <Loader theme={theme} />}
//         {accounts.length > 0 && (
//           <>
//             {accounts.map((account) => (
//               <AccountCard key={account.id} accountData={account} />
//             ))}
//           </>
//         )}
//         <div ref={observerRef}>
//           {isFetchingMore && <Loader theme={theme} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Accounts;



import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/themeContext";
import useAccountsHook from "../../hooks/useAccountHook";
import Loader from "../../components/ui/loader";
import SideBar from "../../OurComponents/Reusable Components/SideBar";
import Header from "../../OurComponents/Reusable Components/Header";
import AccountCard from "../Reusable Components/CardComponent/AccountCard";
import Modal from "../../components/ui/modal";
import Alert from "../../components/ui/alert";

const Accounts = () => {
  const { accounts, isLoader, fetchMoreAccounts, deleteAccount } = useAccountsHook();
  const { theme } = useTheme();
  const observerRef = useRef();
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [switchTransferModal, setSwitchTransferModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  const navigate = useNavigate();
  
  function handleCreateAccount() {
    navigate("/fund-code");
  }

  const handleDeleteAccount = (accountId) => {
    setDeleteAccountId(accountId);
    setDeleteAccountModal(true);
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleteAccountModal(false);
    const response = await deleteAccount(deleteAccountId);
    if (response.success) {
      setAlert({
        show: true,
        variant: "success",
        message: "Account Deleted Successfully",
      });
    } else {
      setAlert({
        show: true,
        variant: "error",
        message: "Failed to delete account",
      });
    }
  };

  const handleSwitchTransfer = () => {
    setSwitchTransferModal(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !isLoader) {
          setIsFetchingMore(true);
          fetchMoreAccounts().finally(() => {
            setIsFetchingMore(false);
          });
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isFetchingMore, isLoader, fetchMoreAccounts]);

  return (
    <div className={`bg-color-${theme} flex flex-col md:flex-row`}>
      <SideBar portalType="Customer" />
      <div className="flex-1 py-6 lg:ml-9 lg:px-10 px-2">
        <Header
          heading="My Accounts"
          subheading="Overview"
          showButton={true}
          buttontext="Create An Account"
          onButtonClick={handleCreateAccount}
          theme={theme}
        />
        <hr className="border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 mt-4 lg:ml-0 ml-6 sm:mr-6 lg:mr-0 mr-6" />
        {alert.show && (
          <Alert variant={alert.variant} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        )}
        {/* {isLoader && <Loader theme={theme} />} */}
        {accounts.length > 0 && (
          <>
            {accounts.map((account) => (
              <AccountCard 
                key={account.accountId} 
                accountData={account} 
                onDeleteAccount={handleDeleteAccount}
                onSwitchTransfer={handleSwitchTransfer}
              />
            ))}
          </>
        )}
        <div ref={observerRef}>
          {isFetchingMore && <Loader theme={theme} />}
        </div>
      </div>
      <Modal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        title="Confirmation Message"
      >
        <div className="p-4">
          <h4 className="text-lg mb-4">Are you sure you would like to delete this application?</h4>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteAccountConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={switchTransferModal}
        onClose={() => setSwitchTransferModal(false)}
        title="Coming Soon!"
      >
        <div className="p-4">
          <h4 className="text-lg mb-4">This Feature is in progress!</h4>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSwitchTransferModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Accounts;


