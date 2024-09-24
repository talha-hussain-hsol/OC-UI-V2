// export const apiBaseUrl: string = "ht"

import axios from "axios";
import { CancelToken, AxiosResponse } from "axios";
// import { useNavigate } from "react-router-dom";
import { logoutCustomer } from "./CommonAPI";
import { APIEventName } from './APIEventName';
// const navigate = useNavigate()

const TIMEOUT = 360000;

const API = axios.create({
  baseURL: _baseUrl(),
  responseType: "json",
});
function deleteAllCookies() {
  const cookies = document.cookie.split(";");
  const url = new URL(window.location.href);
  const domain = url.hostname.split(".").slice(-2).join(".");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + `=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`;
  }
}
API.interceptors.response.use(
  function (response) {
    console.log(response, "responseresponseresponseresponseresponse");
    generateResponseForLoggin(response, true)
    if (response?.data?.success == false && response?.data?.status_code?.value == 401) {
      console.log(response, "response in response");

      // logoutCustomer();
      // navigate('/sign-in');
    }

    return response;
  },
  function (error) {
    generateResponseForLoggin(error, false)
    console.log("responseresponseresponseresponseresponse error", error);
    console.log(error?.toJSON(), "response?.data?.status_code?.value");
    console.log(error?.response?.status, "error?.response?.status");
    if (401 === error?.response?.status && error?.toJSON()?.config?.url != "/auth/userDetails") {
      localStorage.clear();
      deleteAllCookies();
      window.location.href = `${process.env.LOGOUT_REDIRECT_URL}`;

      return Promise.reject(error);
    } else if (403 === error?.response?.status) {

      console.log("error", error);
      if (error?.response?.data?.system_message === "This entity is IP restricted, You are not allowed access this entity outside the designated IP address ") {
        handleSplashScreenForIp();
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);
API.interceptors.request.use(function (config) {
  config.metadata = { startTime: Date.now() };
  return config;
}, function (error) {
  return Promise.reject(error);
});
function getEventNameByAPIURL(url) {
  for (let key in APIEventName) {
    let extractedUrl = url.replace(/.*\/(AAPI|CAPI|MAPI)(\/[^\/]*)/, '$2');

    extractedUrl = extractedUrl.replace(/[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/g, ':id');
    extractedUrl = extractedUrl.replace(/\/(\d+)\//, '/:id/');
    extractedUrl = extractedUrl.replace(/\/(\d+)($|\/)/, '/:id$2');
    if (extractedUrl.endsWith('/:id')) {
      extractedUrl = extractedUrl.slice(0, -4);
    }
    let index = extractedUrl.indexOf('?');

    if (index !== -1) {
      extractedUrl = extractedUrl.substring(0, index);
    } else {
      extractedUrl = extractedUrl;
    }
    if (extractedUrl.endsWith('/:id')) {
      extractedUrl = extractedUrl.slice(0, -4); // Remove the last 4 characters (/':id')
    }
    let indexMatchingUrl = key.indexOf(extractedUrl);
    if (indexMatchingUrl !== -1) {
      return APIEventName[key]
    }
    // if (APIEventName.hasOwnProperty(extractedUrl)) {
    //   return APIEventName[extractedUrl];
    // } 
  }
  return null; // Return null if no match found
}
var IPAddress = '';
var userCountry = '';
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    IPAddress = data.ip

    console.log('Your IP address is:', data.ip);
  })
  .catch(error => {
    console.error('Error fetching IP address:', error);
  });

const apiUrl = 'https://ipapi.co/json/';
// Fetching data from the API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    userCountry = data.country_name
    console.log('Country:', data.country_name);
  })
  .catch(error => {
    console.error('Error fetching location:', error);
  });
function getAllUrlParameters(url) {
  const urlParams = new URLSearchParams(url);
  const params = {};

  // Iterating over all parameters
  for (const [key, value] of urlParams) {
    params[key] = value;
  }

  return params;
}
let entityId = localStorage.getItem('entity_id')
let userID = localStorage.getItem('login_user_id')
function generateResponseForLoggin(data, status) {
  try {
    let dataToSave = {
      "event_name": getEventNameByAPIURL(data?.config?.url),
      "service": "oc_portal",
      "source_identifier": "gcp_prod_oc_portal",
      "status": status,
      "browser": {
        "url": data?.request?.responseURL,
        "useragent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "userip": IPAddress,
        "user_location": userCountry
      },
      "action": {
        "type": "API_REQUEST",
        "details": {
          "api_tag": getEventNameByAPIURL(data?.config?.url),
          "method": data?.config?.method.toUpperCase(),
          "url": data?.request?.responseURL,
          "params": getAllUrlParameters(data?.request?.responseURL),
          "body": data?.config?.data ? JSON.parse(data?.config?.data) : {},
          "headers": data?.headers,
          "http_code": data?.status ? data?.status : data?.response?.status,
          "response_identifier": ""
        }
      },
      "actor": {
        "type": "entity",
      
        "user": {
          "id": userID
        }
      },
      "file_details": {
        "file_name": "null",
        "function_name": "null"
      },
      "api_response": {
        "http_status_code": data?.status ? data?.status : data?.response?.status,
        "http_error_response": data?.status == 200 ? 'null' : data?.response?.status != 200 ? data?.response?.data : 'null'
      },
      // "descriptiveInfo": data?.status ? data?.status : data?.response?.status !== 200 ? data?.response?.data : data?.data?.success,
      "log_severity": data?.status == 200 ? "INFO" : data?.status == 500 ? "ERROR" : (data?.status == 400 || data?.status == 404 || data?.status == 522 || data?.status == 402) ? "WARN" : 'FATAL',
      "time_in_msec": data.config.metadata.startTime,
      "time_out_msec": Date.now()
    }
    if (entityId) {
      dataToSave.actor.entity = { id: entityId };
    }
    handleSaveDataAudit(dataToSave)
  } catch (e) {

  }
  
}
async function handleSaveDataAudit(data) {
  // https://dev-telemetry.one-constellation.com/logs/api/ingest
  const url = process.env.LOGS_API_URL
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json();
}
function handleSplashScreenForIp(e) {
  localStorage.setItem("base_url", null);
  let port = "";
  if (window.location.port) {
    port = ":" + window.location.port;
  }
  const url = new URL(window.location.href);
  const domain = url.hostname.split(".").slice(-2).join(".");
  if (window.location.host.search("staging") != -1) {
    window.location.href = `${window.location.protocol}//staging-portal.${domain}${port}/splash?ipWhiteList=${false}`;
  } else if (window.location.host.search("dev") != -1) {
    window.location.href = `${window.location.protocol}//dev-portal.${domain}${port}/splash?ipWhiteList=${false}`;
  } else {
    window.location.href = `${window.location.protocol}//portal.${domain}${port}/splash?ipWhiteList=${false}`;
  }
}

function _baseUrl() {
  console.log(process.env.API_URL);
  return process.env.API_URL;
}

export async function processRequest(request, token) {
  const headers = { ...axios.defaults.headers, ...request.headers };
  switch (request.type) {
    case "GET":
      console.log("API ==>", request.urlString);
      const getResponse = await API.get(request.urlString, { cancelToken: token, headers: headers, timeout: TIMEOUT });
      return getResponse;
    case "POST":
      const postResponse = await API.post(request.urlString, request.params, { cancelToken: token, headers: headers, timeout: TIMEOUT });
      return postResponse;
    case "PUT":
      const putResponse = await API.put(request.urlString, request.params, { cancelToken: token, headers: headers, timeout: TIMEOUT });
      return putResponse;
    case "DELETE":
      const deleteResponse = await API.delete(request.urlString, { cancelToken: token, headers: headers, timeout: TIMEOUT });
      return deleteResponse;
  }
}
