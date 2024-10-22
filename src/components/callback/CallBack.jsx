import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Nav,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";

import { useLocation, useNavigate } from "react-router-dom";
import {
  postgetToken,
  getAuthUserDetailNew,
  logoutAPI,
  getUserEntitiesAPI,
  getEntityPermissionAPI,
  getSyncedUserEntitiesAPI,
  getIdentityCount,
} from "../../api/network/customerApi";
import axios from "axios";
import userUtils from "../../helpers/utils";
import { FaSignOutAlt } from "react-icons/fa";
import CryptoJS from "crypto-js";
// import LoadingSpinner from "../../widgets/bootstrap-component/Spinner";
// import SpinnerWithBackDrop from "../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../ui/loader";
// import { useDispatch } from "react-redux";
import {
  setEntityId,
  setEntityLogo,
  setEntityProfileImage,
} from "../../store/slices/entitySlice";
// import CustomAlert from "./../../widgets/bootstrap-component/Alert";
// import {setEntityID,setEntityLogo,setEntityProfileImage,setToken} from './'

const CallBack = (props) => {
  const [identityCustomerCount, setIdentityCustomerCount] = useState(null);
  const [identityAccountCount, setIdentityAccountCount] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  // const dispatch = useDispatch();
  const [entitiesList, setEntitiesList] = useState([]);
  const [entityName, setEntityName] = useState(
    localStorage.getItem("login_user_name")
      ? localStorage.getItem("login_user_name")
      : ""
  );
  const [entityProfilePic, setEntityProfilePic] = useState(null);
  const [entitiesListLength, setEntitiesListLength] = useState(1);
  const [oneEntityType, setOneEntityType] = useState(null);
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [customerEntities, setCustomerEntities] = useState([]);
  const [managerEntities, setManagerEntities] = useState([]);
  const [administrationEntities, setAdministrationEntities] = useState([]);
  const [entitiesListSpecific, SetEntitiesListSpecific] = useState([]);
  const [callFunction, setCallFunction] = useState(true);
  const [userData, setUserData] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEntityData, setIsEntityData] = useState(false);
  const [stateVerifier, setStateVerifier] = useState(null);
  const [isErrorIp, setIsErrorIp] = useState(false);
  const [numOfSyncing, setNumOfSyncing] = useState(0);

  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  useEffect(() => {
    if (callFunction) {
      console.log(location.pathname, "location.pathname");
      const queryParams = new URLSearchParams(location.search);
      if (queryParams) {
        const code = queryParams.get("code");
        const state = queryParams.get("state");

        const error = queryParams.get("error");

        if (error) {
          navigate("/");
        }
        if (code) {
          let codeVerifier = localStorage.getItem("codeVerifier");
          const oldState = localStorage.getItem("stateVerifier");
          //stateVerifier
          localStorage.setItem("user-code", code);
          console.log("eerrrror", state);
          console.log("oldState", oldState);

          if (state == oldState) {
            GetTokenApi(code, codeVerifier);
          } else {
            console.log("eerrrror", state);
            console.log("oldState", oldState);
            handleAlert({
              variant: "danger",
              message: "There's some issue in state code",
              show: true,
              hideAuto: true,
            });
          }
        } else {
        }
        if (location.pathname == "/splash" || location.pathname == "/") {
          // getUserDetailApi();

          getUserEntities();
        }
      }
      setCallFunction(false);
    }
    // if (code) {
    //   localStorage.setItem("user-code", code);
    //   GetTokenApi(code);

    //     queryParams.delete("code");
    //     window.history.replaceState(null, "", `${location.pathname}?${queryParams.toString()}`);
    // } else {
    // }
  }, [callFunction]);
  useEffect(() => {
    if (location.pathname == "/splash" || location.pathname == "/") {
      setCallFunction(true);
    }
  }, [location.pathname]);
  useEffect(() => {
    console.log("numOfSyncing", numOfSyncing);
  }, [numOfSyncing]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const event = queryParams.get("ipWhiteList");

    if (event !== null) {
      setIsErrorIp(true);
      queryParams.delete("ipWhiteList");
      const queryString = queryParams.toString();
      const newUrl = queryString ? `?${queryString}` : ""; // Add "?" only if there are remaining query parameters
      const finalUrl = location.pathname + newUrl; // Combine pathname and query string
      history.replaceState(null, null, finalUrl);
    } else {
      setIsErrorIp(false);
    }
  }, [location.search]);
  useEffect(() => {
    console.log(entitiesList, "entitiesList");
    // return;
    //check account count
    // return;
    if (entitiesList?.length != 0) {
      console.log(entitiesList, "entitiesList inside");
      if (entitiesList?.length == 1) {
        const url = new URL(window.location.href);
        const domain = url.hostname.split(".").slice(-2).join(".");
        localStorage.setItem("entity_id", entitiesList[0]?.entityId);
        // localStorage.setItem(
        //   "entity_permissions",
        //   JSON.stringify(entitiesList[0].permissions)
        // ) // store entityLogo in localStorage

        localStorage.setItem(
          "entity_logo",
          entitiesList[0]?.entityMeta?.entity_logo
        ); // store entityLogo in localStorage
        localStorage.setItem("profile_pic", entityProfilePic); //
        localStorage.setItem("entities_length", entitiesListLength); //
        localStorage.setItem("entity-one-portal-type", oneEntityType); //
        document.cookie = `profile_pic=${entityProfilePic};domain=${domain};path=/`;
        document.cookie = `entity_logo=${entitiesList[0]?.entityMeta?.entity_logo};domain=${domain};path=/`;
        // document.cookie = `entity_permissions=${JSON.stringify(
        //   entitiesList[0]?.permissions
        // )};domain=${domain};path=/`

        document.cookie = `entity_id=${entitiesList[0]?.entityId};domain=${domain};path=/`;
        document.cookie = `entities_length=${entitiesListLength};domain=${domain};path=/`;
        document.cookie = `entity-one-portal-type=${oneEntityType};domain=${domain};path=/`;
        document.cookie = `key=${entitiesList[0]?.entityId};domain=${domain};path=/`;

        document.cookie = `token=${localStorage.getItem(
          "x-auth-token"
        )};domain=${domain};path=/`;
        let port = "";
        if (window.location.port) {
          port = ":" + window.location.port;
        }

        // let environment = '';
        //  ;
        // if (window.location.hostname.search("-") == -1) {
        //    ;
        //   environment = '';
        // } else {
        //   environment = window.location.hostname.split('-')[0] + '-';
        // }
        //  ;
        let hostName = window.location.hostname;

        let subDomain = hostName.split(".");

        subDomain = subDomain[0];

        let extractEnv = subDomain.split("-");
        let environment = null;

        if (extractEnv.length > 0 && extractEnv != subDomain) {
          environment = extractEnv[0] + "-";
        } else {
          environment = "";
        }
        userUtils.setEntityID(entitiesList[0]?.entityId);
        if (
          // entitiesList[0]?.identityCount == 0 &&
          entitiesList[0]?.type == "customer"
        ) {
          if (identityCustomerCount !== null) {
            if (identityCustomerCount > 0) {
              if (identityAccountCount > 0) {
                console.log(
                  "Awais",
                  `${window.location.protocol}//${environment}${entitiesList[0]?.type}.${domain}${port}?refresh=yes`
                );

                window.location.href = `${window.location.protocol}//${environment}${entitiesList[0]?.type}.${domain}${port}?refresh=yes`;
              } else {
                window.location.href = `${window.location.protocol}//${environment}${entitiesList[0]?.type}.${domain}${port}/subscription/request?refresh=yes`;
              }
            } else {
              window.location.href = `${window.location.protocol}//${environment}${entitiesList[0]?.type}.${domain}${port}/subscription/request?refresh=yes`;
            }
          } else {
            getIdentityCountApi(entitiesList[0]?.entityId);
          }
        } else {
          setFullPageLoader(false);
          setIsLoader(false);
          getEntityPermission(entitiesList[0]);
        }
      } else {
        setFullPageLoader(false);
        setIsLoader(false);
      }
    } else if (entitiesList?.length == 0 && isEntityData) {
      handleSyncData();
    }

    console.log("identityCustomerCount", identityCustomerCount);
  }, [entitiesList, identityCustomerCount]);
  useEffect(() => {
    let customerEntities = [];
    let administrationEntities = [];
    let managerEntities = [];
    if (entitiesList?.length > 0) {
      for (let item of entitiesList) {
        if (item?.type == "customer") {
          customerEntities.push(item);
        }
        if (item?.type == "management") {
          managerEntities.push(item);
        }
        if (item?.type == "compliance") {
          administrationEntities.push(item);
        }
      }
    }
    if (administrationEntities.length > 0) {
      setActiveTab(0);
      SetEntitiesListSpecific(administrationEntities);
    } else if (customerEntities.length > 0) {
      setActiveTab(1);
      SetEntitiesListSpecific(customerEntities);
    } else if (managerEntities.length > 0) {
      setActiveTab(2);
      SetEntitiesListSpecific(managerEntities);
    }
    // if (administrationEntities.length == 0) {
    setCustomerEntities(customerEntities);
    // }
    setManagerEntities(managerEntities);
    setAdministrationEntities(administrationEntities);
  }, [entitiesList]);
  useEffect(() => {
    if (activeTab == 0) {
      SetEntitiesListSpecific(administrationEntities);
    } else if (activeTab == 1) {
      SetEntitiesListSpecific(customerEntities);
    } else if (activeTab == 2) {
      SetEntitiesListSpecific(managerEntities);
    }
  }, [activeTab]);

  const GetTokenApi = async (code, code_challenge) => {
    setFullPageLoader(true);
    console.log("checking", code);
    const response = await postgetToken(
      code,
      code_challenge,
      cancelTokenSource.token
    );
    console.log("checking rrrrr", response?.headers);

    if (
      response?.data?.success == true &&
      response?.headers != null &&
      response?.headers["x-auth-token"] != null
    ) {
      console.log(
        response?.data,
        "response?.dataresponse?.dataresponse?.dataresponse?.data"
      );
      setUserData(response?.data?.data);
      document.cookie = `lastSynced=${response?.data?.data?.entity?.sync_time};domain=${domain};path=/`;
      localStorage.setItem(
        "lastSynced",
        response?.data?.data?.entity?.sync_time
      );
      const userImage = response?.data?.data?.meta?.user_image;
      setEntityName(response?.data?.data?.name);
      setEntityProfilePic(userImage);
      const url = new URL(window.location.href);
      const domain = url.hostname.split(".").slice(-2).join(".");

      document.cookie = `login_user_id=${response?.data?.data?.id};domain=${domain};path=/`;
      document.cookie = `user_email=${response?.data?.data?.email};domain=${domain};path=/`;
      document.cookie = `login_user_name=${response?.data?.data?.name};domain=${domain};path=/`;
      localStorage.setItem("login_user_id", response?.data?.data?.id);
      localStorage.setItem("login_user_name", response?.data?.data?.name);
      localStorage.setItem("user_email", response?.data?.data?.email);
      axios.defaults.headers = {
        "x-auth-token": response?.headers["x-auth-token"],
      };
      localStorage.setItem("x-auth-token", response.headers["x-auth-token"]);
      navigate("/splash");
    } else {
      handleSignIn();
    }
  };

  const getUserDetailApi = async () => {
    const response = await getAuthUserDetailNew(cancelTokenSource.token);
    console.log("trrrrrrrr");

    if (response.success == true) {
      console.log(response, "response");
      // checkAccountList();

      const userImage = JSON.parse(response?.data?.meta).user_image;
      const url = new URL(window.location.href);
      const domain = url.hostname.split(".").slice(-2).join(".");

      setEntitiesList(response?.data?.entities);
      console.log("Sdasdasd", response?.data);
      setEntitiesListLength(response?.data?.entitiesCount);
      setEntityName(response?.data?.name);
      setEntityProfilePic(userImage);

      document.cookie = `login_user_id=${response?.data?.id};domain=${domain};path=/`;
      localStorage.setItem("login_user_id", response?.data?.id);
    } else {
      handleSignIn();
    }
  };
  const getUserEntities = async () => {
    const response = await getUserEntitiesAPI(cancelTokenSource.token);
    console.log("trrrrrrrr");
    setIsLoader(false);
    if (response.success == true) {
      if (response?.data?.count === 0) {
        setIsLoader(false);
        if (numOfSyncing < 1) {
          handleAlert({
            variant: "info",
            message: `Entities are zero. Start syncing process.`,
            show: true,
            hideAuto: true,
          });

          setNumOfSyncing((prevNum) => prevNum + 1);

          getSyncedUserEntities();
          return;
        }
      }
      setIsEntityData(true);
      setEntitiesList(response?.data?.rows);
      setEntitiesListLength(response?.data?.count);
      if (response?.data?.count === 1) {
        setOneEntityType(response?.data?.rows[0]?.type);
      } else {
        setOneEntityType(null);
      }

      let lastSyncedTime = localStorage.getItem("lastSynced");
      setLastSynced(parseInt(lastSyncedTime));
      const result = isOlderThanTenMinutes(parseInt(lastSyncedTime));
      if (result && numOfSyncing === 0) {
        getSyncedUserEntities();
      }
    } else {
      handleSignIn();
    }
  };
  const getSyncedUserEntities = async () => {
    setIsSyncing(true);
    const response = await getSyncedUserEntitiesAPI(cancelTokenSource.token);
    if (response.success) {
      setIsLoader(false);
      setIsSyncing(false);
      handleAlert({
        variant: "success",
        message: "Entities Synced Successfully",
        show: true,
        hideAuto: true,
      });
      setLastSynced(Date.now());
      const url = new URL(window.location.href);
      const domain = url.hostname.split(".").slice(-2).join(".");
      document.cookie = `lastSynced=${Date.now()};domain=${domain};path=/`;
      localStorage.setItem("lastSynced", Date.now());
      console.log(response, "response");
      setEntitiesList(response?.data?.rows);
      setEntitiesListLength(response?.data?.count);
      if (response?.data?.count === 0) {
        setFullPageLoader(false);
        handleAlert({
          variant: "info",
          message: "No entities found in your account",
          show: true,
          hideAuto: true,
        });
      } else {
        handleAlert({
          variant: "success",
          message: "“Entities Synced Successfully",
          show: true,
          hideAuto: true,
        });
      }
      if (response?.data?.count === 1) {
        setOneEntityType(response?.data?.rows[0]?.type);
      } else {
        setOneEntityType(null);
      }
    } else {
      handleAlert({
        variant: "danger",
        message: "Entities Synced Failed",
        show: true,
        hideAuto: true,
      });
      handleSignIn();
    }
  };
  const getEntityPermission = async (data) => {
    console.log(data, "data");

    // return
    setIsLoader(true);
    const response = await getEntityPermissionAPI(
      data?.entityId,
      cancelTokenSource.token
    );

    if (response.success == true) {
      // response.data.length = 0;
      if (response?.data?.length == 0) {
        setIsLoader(false);
        setPermissionsErorr(true);
        return;
      }

      const url = new URL(window.location.href);
      const domain = url.hostname.split(".").slice(-2).join(".");
      let port = "";
      if (window.location.port) {
        port = ":" + window.location.port;
      }

      let hostName = window.location.hostname;

      let subDomain = hostName.split(".");

      subDomain = subDomain[0];

      let extractEnv = subDomain.split("-");
      let environment = null;

      if (extractEnv.length > 0 && extractEnv != subDomain) {
        environment = extractEnv[0] + "-";
      } else {
        environment = "";
      }
      localStorage.setItem(
        "entity_permissions",
        JSON.stringify(response?.data)
      ); // store entityLogo in localStorage
      document.cookie = `entity_permissions=${JSON.stringify(
        response?.data
      )};domain=${domain};path=/`;

      console.log(response, "response");

      const identityCount =
        data?.type == "customer"
          ? await getIdentityCountApi(data?.entityId)
          : null;

      if (identityCount == 0 && data?.type == "customer") {
        window.location.href = `${window.location.protocol}//${environment}${data?.type}.${domain}${port}/subscription/request?refresh=yes`;
      } else {
        if (identityCount?.accountCount == 0 && data?.type == "customer") {
          window.location.href = `${window.location.protocol}//${environment}${data?.type}.${domain}${port}/subscription/request?refresh=yes`;
        } else {
          window.location.href = `${window.location.protocol}//${environment}${data?.type}.${domain}${port}?refresh=yes`;
        }
      }
    }
  };

  function generateRandomString(number) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < number; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const handleSignIn = async () => {
    let scope = process.env.AUTH_SCOPE;
    let state = generateRandomString(40);
    let codeVerifier = generateRandomString(128);
    console.log(codeVerifier, "codeVerifier");
    localStorage.setItem("codeVerifier", codeVerifier);
    localStorage.setItem("stateVerifier", state);
    setStateVerifier(state);

    let hash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);
    hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    console.log(hash, "hash");
    const regex = /\+/g;
    const regex2 = /\//g;
    const regex3 = /=+$/g;
    const outputString = hash
      .replace(regex, "-")
      .replace(regex2, "_")
      .replace(regex3, "");
    let url = `${process.env.AUTH_API_URL}/oauth/authorize?client_id=${process.env.INVESTOR_CLIENT_ID}&redirect_uri=${process.env.INVESTOR_REDIRECT_URL}&scope=${scope}&state=${state}&response_type=${process.env.INVESTOR_RESPONSE_TYPE}&code_challenge=${outputString}&code_challenge_method=S256`;
    console.log(url, "url");
    window.location.href = url;
    // hash(codeVerifier).then((hex) => {
    //   let url = `${process.env.AUTH_API_URL}/oauth/authorize?client_id=${process.env.INVESTOR_CLIENT_ID}&redirect_uri=${process.env.INVESTOR_REDIRECT_URL}&scope=*&staet=${state}&response_type=${process.env.INVESTOR_RESPONSE_TYPE}&code_challenge=${hex}&code_challenge_method=S256`;
    //   window.location.href = url;
    // })
  };
  const handleEntityClick = async (e, data) => {
    console.log(data, "data");
    // return;
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");

    // dispatch(setEntityId(data?.entityId));
    // dispatch(setEntityLogo(data?.entityMeta?.entity_logo));
    // dispatch(setEntityProfileImage(entityProfilePic));

    localStorage.setItem("entity_id", data?.entityId);
    localStorage.setItem("entity_logo", data?.entityMeta?.entity_logo); // store entityLogo in localStorage
    localStorage.setItem("profile_pic", entityProfilePic); // store entityLogo in localStorage
    // localStorage.setItem("entity_permissions", JSON.stringify(data.permissions)) // store entityLogo in localStorage

    document.cookie = `key=${data?.entityUserId};domain=${domain};path=/`;
    document.cookie = `entity_logo=${data?.entityMeta?.entity_logo};domain=${domain};path=/`;
    document.cookie = `profile_pic=${entityProfilePic};domain=${domain};path=/`;
    document.cookie = `entity_id=${data?.entityId};domain=${domain};path=/`;
    // document.cookie = `entity_permissions=${JSON.stringify(data?.permissions)};domain=${domain};path=/`
    document.cookie = `entities_length=${entitiesListLength};domain=${domain};path=/`;
    document.cookie = `token=${localStorage.getItem(
      "x-auth-token"
    )};domain=${domain};path=/`;
    let port = "";
    console.log(window.location.port, "location.port");
    if (window.location.port) {
      port = ":" + window.location.port;
    }
    userUtils.setEntityID(data?.entityId);
    // let environment = '';
    // if (window.location.hostname.search("-") == -1) {
    //   environment = '';
    // } else {
    //   environment = window.location.hostname.split('-')[0] + '-';
    // }

    let hostName = window.location.hostname;

    let subDomain = hostName.split(".");

    subDomain = subDomain[0];

    let extractEnv = subDomain.split("-");
    let environment = null;

    if (extractEnv.length > 0 && extractEnv != subDomain) {
      environment = extractEnv[0] + "-";
    } else {
      environment = "";
    }

    //check account count
    console.log(data, "dataTocheck");

    // return;
    if (data?.type == "customer") {
      const identityCount = await getIdentityCountApi(data?.entityUserId);

      if (identityCount?.identityCount == 0 && data?.type == "customer") {
        window.location.href = `${window.location.protocol}//${environment}${data?.type}.${domain}${port}/subscription/request?refresh=yes`;
      } else {
        if (identityCount?.accountCount == 0 && data?.type == "customer") {
          window.location.href = `${window.location.protocol}//${environment}${data?.type}.${domain}${port}/subscription/request?refresh=yes`;
        } else {
          console.log(
            "Awais",
            `${window.location.protocol}//${environment}${entitiesList[0]?.type}.${domain}${port}?refresh=yes`
          );

          window.location.href = `${window.location.protocol}//${environment}${data?.type}.${domain}${port}?refresh=yes`;
        }
      }
    } else {
      getEntityPermission(data);
    }
  };
  const [isLoader, setIsLoader] = useState(true);
  const [permissionsErorr, setPermissionsErorr] = useState(false);

  function handleLogout() {
    logoutApiHandle();
  }
  function deleteAllCookies() {
    const cookies = document.cookie.split(";");
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name +
        `=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`;
    }
  }
  const logoutApiHandle = async () => {
    setIsLoader(true);
    const response = await logoutAPI(cancelTokenSource.token);
    // return;
    if (response.success == true) {
      deleteAllCookies();
      let port = "";
      if (location.port) {
        port = ":" + location.port;
      }
      setIsLoader(false);
      let url = `${
        process.env.AUTH_API_URL
      }/logout?user_id=${localStorage.getItem("login_user_id")}&redirect_url=${
        process.env.LOGOUT_REDIRECT_URL
      }`;
      localStorage.clear();
      window.location.href = url;
    } else {
      deleteAllCookies();
      setIsLoader(false);

      let port = "";
      if (location.port) {
        port = ":" + location.port;
      }
      let url = `${
        process.env.AUTH_API_URL
      }/logout?user_id=${localStorage.getItem("login_user_id")}&redirect_url=${
        process.env.LOGOUT_REDIRECT_URL
      }`;
      localStorage.clear();
      window.location.href = url;
    }
  };
  function isOlderThanTenMinutes(timestamp) {
    const date = new Date(timestamp);
    const difference = Date.now() - date.getTime();
    return difference > 600000;
  }
  function timestampToHHMMSSAMPM(timestamp) {
    const date = new Date(timestamp);

    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Format the result as hh:mm:ss AM/PM
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }
  const handleSyncData = (e) => {
    getSyncedUserEntities();
  };
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  const getIdentityCountApi = async (entity_id) => {
    try {
      const res = await getIdentityCount(
        entity_id,
        "CAPI",
        cancelTokenSource.token
      );
      if (res?.success) {
        console.log("res?.success", res);

        setIdentityCustomerCount(res.data.identityCount);
        setIdentityAccountCount(res.data.accountCount);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching identity count:", error);
      return null;
    }
  };

  const handleClickConfigurationPortal = (data) => {
    console.log("dhasbdkhasbdj,bsajd", data);
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");

    // Set cookies for fund_id and entity_id
    document.cookie = `entity_id=${data?.entityId};domain=${domain};path=/`;
    document.cookie = `x-auth-token=${localStorage.getItem(
      "x-auth-token"
    )};domain=${domain};path=/`;
    document.cookie = `token=${localStorage.getItem(
      "x-auth-token"
    )};domain=${domain};path=/`;

    let port = "";
    if (window.location.port) {
      port = ":" + "8003";
    }

    let hostName = window.location.hostname;
    let subDomain = "config"; // Change subDomain to "configuration-portal"

    let extractEnv = subDomain;
    let environment =
      hostName.split("-")[0] === "dev" || hostName.split("-")[0] === "staging"
        ? hostName.split("-")[0] + "-"
        : "";

    if (data?.entityId) {
      // Open navigation link in new tab
      window.open(
        `${window.location.protocol}//${environment}${subDomain}.${domain}${port}/entity-configuration`,
        "_blank"
      );
    }
  };

  return (
    <div className="container-fluid">
      {console.log(userData, "userData")}
      {fullPageLoader ? (
        // <SpinnerWithBackDrop animation="grow" custom={true} height="80vh" />
        <Loader />
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-6 col-xl-5">
            <div
              className="px-lg-6 my-5"
              style={{ maxHeight: "90vh", overflow: "auto" }}
            >
              <h1 className="display-4 mb-3">
                Welcome!
                <br />
                {entityName}
              </h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <p className="text-muted mb-5">What do we want to do today ?</p>
                <div>
                  <Button variant="primary" size="sm" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </Button>
                </div>
              </div>

              <Nav variant="tabs" className="modal-header-tabs nav-tabs-sm">
                {administrationEntities.length > 0 && (
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      active={activeTab === 0}
                      onClick={() => setActiveTab(0)}
                    >
                      Compliance Portal
                    </Nav.Link>
                  </Nav.Item>
                )}
                {customerEntities.length > 0 && (
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      active={activeTab === 1}
                      onClick={() => setActiveTab(1)}
                    >
                      Customer Portal
                    </Nav.Link>
                  </Nav.Item>
                )}
                {managerEntities.length > 0 && (
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      active={activeTab === 2}
                      onClick={() => setActiveTab(2)}
                    >
                      Client Portal
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
              {isLoader ? (
                // <LoadingSpinner animation="grow" custom={true} height="50vh" />
                <Loader />
              ) : (
                <div className="list-group list-group-flush pt-4 my-n3">
                  {permissionsErorr && (
                    <span style={{ color: "red", fontSize: "16px" }}>
                      You Dont have Permissions
                    </span>
                  )}
                  {isErrorIp && (
                    <span style={{ color: "red", fontSize: "16px" }}>
                      This entity is IP restricted, You are not allowed access
                      this entity outside the designated IP address{" "}
                    </span>
                  )}
                  {entitiesListSpecific &&
                    entitiesListSpecific?.map((item, index) => (
                      <>
                        <div className="list-group-item" key={index}>
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <div
                                onClick={(e) => {
                                  handleEntityClick(e, item);
                                }}
                                className="avatar"
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  style={{ height: "2.7em", width: "4em" }}
                                  src={
                                    item?.entityMeta?.entity_logo == undefined
                                      ? !(item?.type == "compliance")
                                        ? "/img/entity_logo.png"
                                        : "/img/admin_entity_logo.png"
                                      : item?.entityMeta?.entity_logo
                                  }
                                  alt="..."
                                  className="ascent logo"
                                />
                              </div>
                            </div>
                            <div className="col">
                              <h4 className="fw-normal mb-1">
                                <a
                                  href="javascript:void(0);"
                                  onClick={(e) => {
                                    handleEntityClick(e, item);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {item?.entityTitle}
                                </a>
                              </h4>

                              <small className="text-muted">{item?.type}</small>
                            </div>
                            <div className="col-auto">
                              {/* @if($entity->status == 'active')
                    <span className="text-success"> </span>
                    @elseif($entity->status == 'review')
                    <span className="text-warning"> </span>
                    @elseif($entity->status == 'blocked')
                    <span className="text-danger"> </span>
                    @else
                    <span className="text-default"> </span>
                    @endif */}
                              {/* <span className="text-success"> </span> */}
                              {/* Review */}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6 col-xl-7 d-none d-lg-block">
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: "9999",
              }}
            >
              <h5
                style={{
                  color: "white",
                  padding: "10px",
                  border: "1px solid #11263f",
                  borderRadius: "15px",
                  cursor: isSyncing ? "not-allowed" : "pointer", // Disable cursor if syncing
                  backgroundColor: "#2c7be5",
                  opacity: isSyncing ? 0.7 : 1, // Reduce opacity to show disabled effect
                }}
                onClick={(e) => {
                  if (!isSyncing) {
                    handleSyncData(e);
                  }
                }}
              >
                {isSyncing ? (
                  <span>
                    Syncing... {/* Or add a spinner component here */}
                  </span>
                ) : (
                  <>
                    Last Synced At: {timestampToHHMMSSAMPM(lastSynced)}
                    {/* <p style={{ color: "white", textAlign: "center", marginBottom: "0px" }}>Synced</p> */}
                  </>
                )}
              </h5>
            </div>

            {/* <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: "9999",
              }}
            >
              <h5
                style={{ color: "white", padding: "10px", border: "1px solid #11263f", borderRadius: "15px", cursor: "pointer", backgroundColor: "#2c7be5" }}
                onClick={(e) => {
                  handleSyncData(e);
                }}
              >
                Last Synced at: {timestampToHHMMSSAMPM(lastSynced)}
                <p style={{ color: "white", textAlign: "center", marginBottom: "0px" }}>{isSyncing ? "Syncing" : "Synced"}</p>
              </h5>
            </div> */}
            <div className="bg-cover h-100 min-vh-100 mt-n1 me-n3 splash_background">
              <img
                src={"/img/splash.jpg"}
                style={{ height: "100vh", width: "100%" }}
              />
            </div>
          </div>
        </div>
      )}

      {alertProps.show && (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {/* <CustomAlert
            top={false} // Remove the top positioning if it exists
            handleCloseAlert={handleCloseAlert}
            message={alertProps.message}
            variant={alertProps.variant}
            show={alertProps.show}
            hideAuto={alertProps.hideAuto}
            onClose={() => setAlertProps({ ...alertProps, show: false })}
            style={{ width: "400px" }} // Adjust width if necessary
          >
            {alertProps.message}
          </CustomAlert> */}
        </div>
      )}
    </div>
  );
};

export default CallBack;
