import { processRequest } from "./CustomerNetwork";
import axios, { CancelTokenSource } from "axios";
let baseURLType = window.BaseUrl;
if (localStorage.getItem("x-auth-token")) axios.defaults.headers = { "x-auth-token": localStorage.getItem("x-auth-token") };


let baseURL = localStorage.getItem('base_url')
let entityId = localStorage.getItem('entity_id')
if (baseURL === null && isSubDomain() === true && window.location.host.split('.')[0] != 'portal') {
  // location.reload()
}

function isSubDomain() {
  let url = window.location.href;
  if (url.split('.').length == 2) {
    return false;
  } else {
    return true;
  }
}

export function getErrorResponse(error) {
  console.log(error, "error error    error ");
  let customResponse = [];
  try {
    if (error.data?.masssage == "timeout exceeded") {
      customResponse.success = false;
      customResponse.status_code = { key: "failed", value: -1, name: "timeout" };
      customResponse.user_message = "Timeout Exceeded";
    } else if (error && error?.toJSON().message === "Network Error") {
      customResponse.success = false;
      customResponse.status_code = { key: "failed", value: -1, name: "network" };
      customResponse.user_message = "Internet problem";
    } else {
      customResponse = error?.response.data;
      !!error && console.error(`FAILED API = ${error.response.config.url} | Error Code = ${customResponse.status_code?.value} | System Message = ${customResponse.system_message}`);
      !!!error && console.log("FAILED API with undefined error");
    }
  } catch (e) {
    console.log(e, "error catch");
    customResponse.success = false;
    customResponse.status_code = { key: "failed", value: -1, name: "network" };
    customResponse.user_message = "Internet problem";
  }
  return customResponse;
}


export const logoutAPI = async (cancelToken) => {
  const url = `/auth/user/logout`;
  const request = { type: "POST", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const logoutCustomer = () => {
  console.log("debug::1");

  axios.defaults.headers = null;
  localStorage.removeItem("user-token");
  localStorage.removeItem("section");
  localStorage.clear();

  const cookies = document.cookie.split(";");
  const url = new URL(window.location.href);
  const domain = url.hostname.split(".").slice(-2).join(".");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + `=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`;
  }

};