import React, { useCallback, useEffect } from "react";
import { getToken } from "../../api/userApi";
import { generateRandomString } from "../../utils/helperFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setAxiosHeader } from "../../api/config";
import {
  authUrl,
  investorClientId,
  investorRedirectUrl,
  scope,
} from "../../api";
import CryptoJS from "crypto-js";
import { removeLocalStorage, setLocalStorage } from "../../utils/cookies";
import useEntityStore from "../../store/useEntityStore";
import Loader from "../../components/ui/loader";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  const { setSingleAccount } = useEntityStore((state) => ({
    setSingleAccount: state.setSingleAccount,
  }));

  function removeParams() {
    const url = window.location.href;
    const urlWithoutParams = url.split("?")[0];
    window.history.replaceState({}, document.title, urlWithoutParams);
  }

  const handleAuthFlow = useCallback(async () => {
    const cancelTokenSource = axios.CancelToken.source();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams) {
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      if (code) {
        const codeVerifier = localStorage.getItem("codeVerifier");
        const stateVerifier = localStorage.getItem("stateVerifier");
        localStorage.setItem("user-code", code);
        if (state === stateVerifier) {
          try {
            const response = await getToken(
              code,
              codeVerifier,
              cancelTokenSource.token
            );
            if (
              response.error ||
              response.response.data.error ||
              response.response.data.data.code === 401 ||
              response.response.error ||
              response.response.data.code === 401
            ) {
              toast.error(response.error.message || response.response.data.message || 'Something went wrong!')
              const newState = generateRandomString(40);
              const newCodeVerifier = generateRandomString(128);

              localStorage.setItem("codeVerifier", newCodeVerifier);
              localStorage.setItem("stateVerifier", newState);

              const hash = CryptoJS.SHA256(newCodeVerifier)
                .toString(CryptoJS.enc.Base64)
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");
              const url = `${authUrl}/oauth/authorize?client_id=${investorClientId}&redirect_uri=${investorRedirectUrl}&scope=${scope}&state=${newState}&code_challenge=${hash}&code_challenge_method=S256`;

              removeLocalStorage();
              window.location.href = url;
            } else {
              const responsedData = response?.response || {};
              const token = responsedData?.headers["x-auth-token"];
              if (token) {
                setAxiosHeader({ "x-auth-token": token });
                const entityData = responsedData?.data?.data;
                setLocalStorage("x-auth-token", token);
                setLocalStorage("login_user_id", entityData?.id);
                setLocalStorage("user_email", entityData?.email);
                setLocalStorage("login_user_name", entityData?.name);
                setLocalStorage("profile_pic", entityData?.meta?.user_image);
                setSingleAccount(responsedData?.data?.data);
                removeParams();
                navigate("/splash", { replace: true });
              }
            }
          } catch (error) {
            console.error("Error handling authentication:", error);
          }
        } else {
          toast.error("State does not match");
        }
      }
    }

    // Cleanup to cancel request if component unmounts
    return () => cancelTokenSource.cancel("Request canceled by the user.");
  }, [navigate, setSingleAccount]);

  useEffect(() => {
    handleAuthFlow();
  }, [handleAuthFlow]);

  return <Loader />;
};

export default Callback;
