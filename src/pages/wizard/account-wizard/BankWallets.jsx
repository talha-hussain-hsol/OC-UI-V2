import React, { useEffect, useState } from "react";
import BankCard from "../../../components/cardComponent/BankCard";
import useBankWalletHook from "../../../hooks/useBankWalletHook";
import Loader from "../../../components/ui/loader";
import { useTheme } from "../../../contexts/themeContext";

const BankWallets = () => {
  const theme = useTheme();

  const {
    isLoader,
    isLoaderBank,
    bankIdentities,
    walletAddresses,
    fetchAllData,
    fetchWalletAddresses,
    fetchBankIdentities,
  } = useBankWalletHook();
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
        />
      )}
    </div>
  );
};

export default BankWallets;
