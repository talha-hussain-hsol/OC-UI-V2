// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../../../contexts/themeContext";
// import useAccountsHook from "../../../../hooks/useAccountsHook";
// import useEntityStore from "../../../../store/useEntityStore";
// import Loader from "../../../../components/ui/loader";
// import SideBar from "../../../../components/sidebar/Sidebar";
// import Header from "../../../../components/header/Header";
// import AccountCard from "../../../../components/cardComponent/AccountCard";
// import IconButton from "../../../../components/ui/button/IconButton";

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
import { useTheme } from "../../../../contexts/themeContext";
import useAccountsHook from "../../../../hooks/useAccountsHook";
import Loader from "../../../../components/ui/loader/index";
import SideBar from "../../../../components/sidebar/Sidebar";
import Header from "../../../../components/header/Header";
import AccountCard from "../../../../components/cardComponent/AccountCard";
import Modal from "../../../../components/ui/modal";
import Alert from "../../../../components/ui/alert";

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