// import axios from "axios";
// import { authUrl, base_url, logoutRedirectUrl } from ".";
// import { clearAllCookies } from "../utils/cookies";

// const TIMEOUT = 15000;

// const axiosAPI = axios.create({
//   baseURL: base_url,
//   responseType: "json",
// });

// export default class ResponseModel {
//   constructor() {
//     this.response = undefined;
//     this.error = undefined;
//   }
// }

// export const RequestType = {
//   GET: "GET",
//   POST: "POST",
//   PUT: "PUT",
//   DELETE: "DELETE",
// };

// const handleLogout = () => {
//   const userData = localStorage.getItem("userData");
//   const parsedData = JSON.parse(userData);
//   const logoutUrl = `${authUrl}/logout?user_id=${parsedData?.response?.data?.user_info.id}&redirect_url=${logoutRedirectUrl}`;
//   localStorage.clear();
//   clearAllCookies();
//   window.location.href = logoutUrl;
// };
// export function processError(error) {
//   if (!error) return { code: -1 };
//   console.log("error", error, error?.response?.data?.message);
//   if (error.toJSON().message === "Network Error") {
//     return { code: -1 };
//   } else if (error.data?.message === "timeout exceeded") {
//     return { code: -2 };
//   } else if (error?.response?.status === 401) {
//     handleLogout();
//     return { code: 401, message: "Authentication failed!" };
//   } else {
//     return {
//       code: error?.response?.status || -1,
//       message:
//         error?.response?.data?.message ||
//         error?.message ||
//         error?.response?.data?.user_message ||
//         error?.response?.data?.system_message,
//     };
//   }
// }

// export async function setAxiosHeader(header) {
//   axiosAPI.defaults.headers.common = await header || {
//     "x-auth-token": localStorage.getItem("x-auth-token"),
//   };
// }
// export async function processRequest(request, token) {
//   const headers = {
//     ...axios.defaults.headers,
//     ...request.headers,
//     // "User-Agent": utils.userAgent,
//   };
//   switch (request.type) {
//     case RequestType.POST: {
//       const postResponse = await axiosAPI.post(
//         request.urlString,
//         request.params,
//         {
//           headers: headers,
//           timeout: TIMEOUT,
//           cancelToken: token,
//         }
//       );
//       return postResponse;
//     }
//     case RequestType.PUT: {
//       const putResponse = await axiosAPI.put(
//         request.urlString,
//         request.params,
//         {
//           headers: headers,
//           timeout: TIMEOUT,
//           cancelToken: token,
//         }
//       );
//       return putResponse;
//     }
//     case RequestType.DELETE: {
//       const deleteResponse = await axiosAPI.delete(request.urlString, {
//         headers: headers,
//         timeout: TIMEOUT,
//         cancelToken: token,
//       });
//       return deleteResponse;
//     }
//     default: {
//       const getResponse = await axiosAPI.get(request.urlString, {
//         headers: headers,
//         timeout: TIMEOUT,
//         cancelToken: token,
//       });
//       return getResponse;
//     }
//   }
// }

import axios from "axios";
import { authUrl, base_url, logoutRedirectUrl } from ".";
import { clearAllCookies } from "../utils/cookies";

const TIMEOUT = 200000;

const axiosAPI = axios.create({
  baseURL: base_url,
  responseType: "json",
});

export default class ResponseModel {
  constructor() {
    this.response = undefined;
    this.error = undefined;
  }
}

export const RequestType = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const handleLogout = () => {
  const userData = localStorage.getItem("userData");
  const parsedData = JSON.parse(userData);
  const logoutUrl = `${authUrl}/logout?user_id=${parsedData?.response?.data?.user_info.id}&redirect_url=${logoutRedirectUrl}`;
  localStorage.clear();
  clearAllCookies();
  window.location.href = logoutUrl;
};
export function processError(error) {
  if (!error) return { code: -1 };
  if (error.toJSON().message === "Network Error") {
    return { code: -1 };
  } else if (error.data?.message === "timeout exceeded") {
    return { code: -2 };
  } else if (error?.response?.status === 401) {
    handleLogout();
    return { code: 401, message: "Authentication failed!" };
  } else {
    return {
      code: error?.response?.status || -1,
      message:
        error?.response?.data?.message ||
        error?.message ||
        error?.response?.data?.user_message ||
        error?.response?.data?.system_message,
    };
  }
}

export async function setAxiosHeader(header) {
  axiosAPI.defaults.headers.common = (await header) || {
    "x-auth-token": localStorage.getItem("x-auth-token"),
  };
}
export async function processRequest(request, token) {
  
  const authToken = localStorage.getItem("x-auth-token");
  if (authToken) {
    setAxiosHeader({
      "x-auth-token": authToken,
    });
  }
  const headers = {
    ...axios.defaults.headers,
    common: authToken
      ? {
          ...axios.defaults.headers.common,
          "x-auth-token": authToken,
        }
      : {
          ...axios.defaults.headers.common,
        },
    ...request.headers,
    // "User-Agent": utils.userAgent,
  };
  switch (request.type) {
    case RequestType.POST: {
      const postResponse = await axiosAPI.post(
        request.urlString,
        request.params,
        {
          headers: headers,
          timeout: TIMEOUT,
          cancelToken: token,
        }
      );
      return postResponse;
    }
    case RequestType.PUT: {
      const putResponse = await axiosAPI.put(
        request.urlString,
        request.params,
        {
          headers: headers,
          timeout: TIMEOUT,
          cancelToken: token,
        }
      );
      return putResponse;
    }
    case RequestType.DELETE: {
      const deleteResponse = await axiosAPI.delete(request.urlString, {
        headers: headers,
        timeout: TIMEOUT,
        cancelToken: token,
      });
      return deleteResponse;
    }
    default: {
      const getResponse = await axiosAPI.get(request.urlString, {
        headers: headers,
        timeout: TIMEOUT,
        cancelToken: token,
      });
      return getResponse;
    }
  }
}
