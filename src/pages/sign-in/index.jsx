import { useCallback, useEffect } from "react";
import { getLocalStorage } from "../../utils/cookies";
import {
  authUrl,
  investorClientId,
  investorRedirectUrl,
  scope,
} from "../../api";
import CryptoJS from "crypto-js";
import { generateRandomString } from "../../utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/loader";

const SignIn = () => {
  const navigate = useNavigate()
  const handleSignIn = useCallback(async () => {
    const state = generateRandomString(40);
    const codeVerifier = generateRandomString(128);

    localStorage.setItem("codeVerifier", codeVerifier);
    localStorage.setItem("stateVerifier", state);

    const hash = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const url = `${authUrl}/oauth/authorize?client_id=${investorClientId}&redirect_uri=${investorRedirectUrl}&scope=${scope}&state=${state}&code_challenge=${hash}&code_challenge_method=S256`;

    window.location.href = url;
  }, []);

  useEffect(() => {
    if (!getLocalStorage("x-auth-token")) {
      handleSignIn();
    } else {
      navigate('/splash', {replace: true})
    }
  }, [handleSignIn, navigate]);
  return <Loader theme={theme}/>;
};

export default SignIn;
