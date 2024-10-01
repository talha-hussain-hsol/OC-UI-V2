import React from "react";
import { getBankIdentitiesAPI, getWalletAddressListAPI } from "../api/userApi";
import useEntityStore from "../store/useEntityStore";
import axios from "axios";
import { useParams } from "react-router-dom";

const useBankWalletHook = (props) => {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  let identity_id = props?.dataOfAccountSetup?.identity_id;
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderBank, setIsLoaderBank] = useState(false);
  return {};
};

export default useBankWalletHook;
