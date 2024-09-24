import axios from "axios";
import { processRequest } from "./CustomerNetwork"

export function getErrorResponse(error) {
    console.log(error, "error error    error ")
    let customResponse = []
    try {
      if (error.data?.masssage == "timeout exceeded") {
        customResponse.success = false
        customResponse.status_code = { key: "failed", value: -1, name: "timeout" }
        customResponse.user_message = "Timeout Exceeded"
      } else if (error && error?.toJSON().message === "Network Error") {
        customResponse.success = false
        customResponse.status_code = { key: "failed", value: -1, name: "network" }
        customResponse.user_message = "Internet problem"
      } else {
        customResponse = error?.response.data
        !!error &&
          console.error(
            `FAILED API = ${error.response.config.url} | Error Code = ${customResponse.status_code?.value} | System Message = ${customResponse.system_message}`
          )
        !!!error && console.log("FAILED API with undefined error")
      }
    } catch (e) {
      console.log(e, "error catch")
      customResponse.success = false
      customResponse.status_code = { key: "failed", value: -1, name: "network" }
      customResponse.user_message = "Internet problem"
    }
    return customResponse
  }

export const getIdentityList = async (cancelToken, fundId) => {
    let baseURL = localStorage.getItem("base_url")
    let entityId = localStorage.getItem("entity_id")

//   const entityId = "yourEntityId"; // Replace with actual value
//   const baseURL = "yourBaseURL"; // Replace with actual value

  let url = `/${entityId}/${baseURL}/Identity/list`;
  if (fundId) {
    url += `?fundId=${fundId}`;
  }

  const request = {
    type: "GET",
    urlString: url,
    signal: signal, // Pass the signal for aborting the request
    // cancelToken: cancelToken, // Pass the cancel token here
  };

  try {
    const response = await processRequest(request, cancelToken); // Pass the token here
    return response.data;
  } catch (error) {
    return getErrorResponse(error); // Handle error
  }
};



// import axios from "axios";

// const cancelTokenSource = axios.CancelToken.source(); // Updated way to create a cancel token

// const handleGetIdentityList = async () => {
//   console.log("checking");
//   setIsLoader(true);

//   try {
//     const response = await getIdentityList(cancelTokenSource.token);
//     console.log("API response", response);
//     if (response.success === true) {
//       setProfileListData(response?.data);
//     }
//   } catch (error) {
//     console.error("Failed to fetch identity list", error);
//   } finally {
//     setIsLoader(false);
//   }
// };

// // Clean up cancel token when the component unmounts
// useEffect(() => {
//   return () => {
//     cancelTokenSource.cancel("Request canceled by the user.");
//   };
// }, []);

// export const getIdentityList = async (cancelToken, fundId) => {
//     let url
//     fundId
//       ? (url = `/${entityId}/${baseURL}/Identity/list?fundId=${fundId}`)
//       : (url = `/${entityId}/${baseURL}/Identity/list`)
  
//     const request = { type: "GET", urlString: url }
  
//     try {
//       const response = await processRequest(request, cancelToken)
//       return response.data
//     } catch (error) {
//       return getErrorResponse(error)
//     }
//   }
