import React, { useEffect, useState } from "react";
import BankCard from "../../../components/cardComponent/BankCard";
import useBankWalletHook from "../../../hooks/useBankWalletHook";
import Loader from "../../../components/ui/loader";
import { useTheme } from "../../../contexts/themeContext";

const BankWallets = (fundData, dataOfAccountSetups) => {
  const theme = useTheme();
  console.log("Fund Data iss: ", fundData);
  console.log("dataOfAccountSetups6", fundData.dataOfAccountSetups);

  const {
    isLoader,
    isLoaderBank,
    bankIdentities,
    walletAddresses,
    fetchAllData,
    fetchWalletAddresses,
    fetchBankIdentities,
  } = useBankWalletHook();
  const identity_Id =
    fundData.dataOfAccountSetups[0]?.data?.identity?.identity_id;
  useEffect(() => {
    fetchAllData(identity_Id);
  }, [fetchAllData, dataOfAccountSetups]);

  const [walletAddressesState, setWalletAddresses] = useState(walletAddresses);
  const [bankAddressesState, setbankAddresses] = useState(bankIdentities);
  return (
    <div className={` flex flex-col justify-center items-center rounded-md`}>
      {isLoader || isLoaderBank ? (
        <Loader theme={theme} />
      ) : (
        <BankCard
          bankIdentities={bankIdentities}
          walletAddresses={walletAddresses}
          fetchWalletAddresses={fetchWalletAddresses}
          setWalletAddresses={setWalletAddresses}
          fetchBankAddressIdentities={fetchBankIdentities}
          setbankAddresses={setbankAddresses}
          fundId={fundData.fundData.id}
          identityId={identity_Id}
        />
      )}
    </div>
  );
};

export default BankWallets;
