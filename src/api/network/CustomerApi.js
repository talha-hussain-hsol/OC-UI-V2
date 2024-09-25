import { processRequest } from "./CustomerNetwork"
import axios, { CancelTokenSource } from "axios"
let baseURLType = window.BaseUrl
if (localStorage.getItem("x-auth-token"))
  axios.defaults.headers = {
    "x-auth-token": localStorage.getItem("x-auth-token"),
  }

let baseURL = localStorage.getItem("base_url")
let entityId = localStorage.getItem("entity_id")
if (
  baseURL === null &&
  isSubDomain() === true &&
  window.location.host.split(".")[0] != "portal"
) {
  // location.reload()
}

function isSubDomain() {
  let url = window.location.href
  if (url.split(".").length == 2) {
    return false
  } else {
    return true
  }
}

export function getErrorResponse(error) {
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
    customResponse.success = false
    customResponse.status_code = { key: "failed", value: -1, name: "network" }
    customResponse.user_message = "Internet problem"
  }
  return customResponse
}

export const loginCustomer = async (email, password, cancelToken) => {

  const url = `customers/login`
  const data = { email: email, password: password }
  
}
export const getCustomerAccounts = async (offset ,limit,cancelToken) => {
  if(!limit){
    return
  }


  const url = `/${entityId}/${baseURL}/Account/list?offset=${offset}&limit=${limit}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    console.log("loginCustomer Response Headers", response)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

// export const getCustomerProfileList = async (cancelToken) => {
//   const url = `customer-profiles-list`;
//   const request = { type: "GET", urlString: url };

//   try {
//     const response = await processRequest(request, cancelToken);
//     return response.data;
//   } catch (error) {
//     return getErrorResponse(error);
//   }
// };
export const getIdentityList = async (cancelToken, fundId) => {
  let url
  fundId
    ? (url = `/${entityId}/${baseURL}/Identity/list?fundId=${fundId}`)
    : (url = `/${entityId}/${baseURL}/Identity/list`)

  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getRequiredDocument = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/requiredDocuments/${accountId}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const getDocumentListAPI = async (cancelToken) => {
  const url = `organizations/ascent-fs/funds/demo/document-types`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const getFundForJoin = async (fundCode, cancelToken) => {
  const url = `/fund/get/${fundCode}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getIdentityDocument = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/documents`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const postIdentityAttatchWithFund = async (
  identityId,
  data,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/attach`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const logoutCustomer = () => {
  console.log("debug::1")

  axios.defaults.headers = null
  localStorage.removeItem("user-token")
  localStorage.removeItem("section")
}

export const getParticularFieldsApi = async (
  account_id = null,
  cancelToken
) => {
  var url = `/${entityId}/${baseURL}/Identity/fields`
  if (account_id) {
    url = `/${entityId}/${baseURL}/Identity/fields?accountId=${account_id}`
  }
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getParticularFieldsFromFundIdApi = async (
  fund_id = null,
  cancelToken
) => {
  var url = `/${entityId}/${baseURL}/Identity/fields?fundId=${fund_id}`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getSingleDocument = async (documentId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/document`
  const request = {
    type: "POST",
    urlString: url,
    params: { identity_document_id: documentId },
  }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const postIdentityAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/create`
  const request = { type: "POST", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getParticularsDetailByIdentityIdAPI = async (
  identity_id,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/Identity/${identity_id}/get`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getSingleAccountDetailByIdAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/detail/${accountId}`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getCRPsByIdentityIdAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/Crp/list`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const postIdentityDocument = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/IdentityDocument/add`
  const request = { type: "POST", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const updateIdentityDocument = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/IdentityDocument/update`
  const request = { type: "PUT", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const postVerifyUploadDocument = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/IdentityDocument/${identityId}/verifyUpload`
  const request = { type: "POST", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const getCrpRoleMetaAPI = async (cancelToken) => {
  const url = `/crp-roles-meta`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const postVerifyLoginAuth = async (state, cancelToken) => {
  const url = `/oauth/authorize?client_id=6&redirect_uri=http://oms.demo/callback&scope=*${state}&response_type=code`
  const request = { type: "POST", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const postgetToken = async (code, code_challenge, cancelToken) => {
  const url = `/auth/getToken?code=${code}&client_id=${process.env.INVESTOR_CLIENT_ID}&code_verifier=${code_challenge}`
  const request = { type: "POST", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    console.log("ccccccc", response)
    return response
  } catch (error) {
    console.log("errrrrr", error)
    return getErrorResponse(error)
  }
}

export const getAuthUserDetail = async (cancelToken) => {
  const url = `/auth/userDetails`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getAuthUserDetailNew = async (cancelToken) => {
  const url = `/auth/splash/entitiesForSplash`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const logoutAPI = async (cancelToken) => {
  const url = `/auth/user/logout`
  const request = { type: "POST", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getFlatCPRListAPI = async (identity_id, account_id, cancelToken) => {
  //http://localhost:8386/8eadea60-a665-41ea-9428-4e46802c5faa/CAPI/Identity/9fd19b44-1e16-4606-9012-7e760e94f426/account/737cbfcf-ae57-46ed-b815-c8f792b8ff7e/Crp/flatlist?extended=true
  const url = `/${entityId}/${baseURL}/Identity/${identity_id}/account/${account_id}/Crp/flatlist?extended=true`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const getRequiredDocumentAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/requiredDocuments/${accountId}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getSignedURLAPI = async (data, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/identity-document/${id}/sign`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getInitialInvestmentSignAPI = async (account_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/transactions/${account_id}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const handleSubmitScreeningApi = async (
  identityId,
  accountId,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/${identityId}/${accountId}/application/submit`
  const request = { type: "POST", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getWalletAddressListAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/getIdentityWalletAddress`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const addWalletAddressAPI = async (data, identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/addWalletAddress`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getCryptoCurrencyChainListAPI = async (
  account_id,
  cancelToken
) => {
  let url = ""
  if (account_id) {
    url = `/${entityId}/${baseURL}/upsala/getSuppotedNetworks?account_id=${account_id}`
  } else {
    url = `/${entityId}/${baseURL}/upsala/getSuppotedNetworks`
  }
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const updateIdentityStatusAPI = async (
  data,
  identityId,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/updateStatus`
  const request = { type: "PUT", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

//manual download signing document
///:entityId/CAPI/:documentTypeId/download-signing-document/:accountId
export const getDownloadSigningDocument = async (
  nameDocument,
  documentTypeId,
  accountId,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/${documentTypeId}/download-signing-document/${accountId}?choice=${nameDocument}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

//subscription doc add api
//http://localhost:8384/173dad6c-b543-4d24-812e-3a306f7e4f14/CAPI/transaction-document
export const transactionDocAddApi = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/transaction-document`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const transactionDocVerifyUpload = async (
  data,
  accountId,
  cancelToken
) => {
  //http://localhost:8384/173dad6c-b543-4d24-812e-3a306f7e4f14/CAPI/account-document/fdb8dac7-ca05-4437-b119-7b9b84e59dae/verifyUpload
  const url = `/${entityId}/${baseURL}/account-document/${accountId}/verifyUpload`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getDocuSignURLForFinishSigningAPI = async (
  data,
  id,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/identity-document/${id}/docusign-draft-sign`
  const request = { type: "PUT", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getDownloadDocuSignAPI = async (
  transactionID,
  dataToSend,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/transaction/${transactionID}/download-sign-document`
  const request = { type: "POST", urlString: url, params: dataToSend }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const getRequiredDocumentCRP = async (
  accountId,
  identityId,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/Account/requiredDocuments/${accountId}?identityId=${identityId}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
///:entityId/CAPI/registrationProvider/configurations?provider=CORPPASS
export const getRegistrationProviderForSingpass = async (
  singpassValue,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/registrationProvider/configurations?provider=${singpassValue}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const getEntityTypeAPI = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/entity-types-list`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const postRegistrationProviderGetData = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/registrationProvider/get-data`
  const request = { type: "POST", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const getTransactionHistoryAPI = async (account_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/getAccountSubscriptionDocs?accountId=${account_id}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

export const deleteDocument = async (documentId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/document/${documentId}/delete`
  const request = {
    type: "DELETE",
    urlString: url,
    params: { identity_document_id: documentId },
  }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const FaceVerificationApi = async (
  data,
  cancelToken,
  identityId,
  accountShareHolderId
) => {
  // http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/FaceVerification
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/AccountShareHolder/${accountShareHolderId}/FaceVerification`
  const request = { type: "POST", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
};
//REATE | POST | http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/Vcip
export const getVcipSignedUrl = async (data,identityId, accountShareHolderId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/AccountShareHolder/${accountShareHolderId}/Vcip`;
  const request = { type: "POST", urlString: url, params: {"location": data }};
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};


export const validateByPennyDropAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/registrationProvider/get-data`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};



export const postVerifyUploadVideo = async (identityId, accountShareHolderId, data, cancelToken) => {
  //VERIFY UPLOAD | PUT http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/Vcip/verifyUpload
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/AccountShareHolder/${accountShareHolderId}/Vcip/verifyUpload`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getDataSignedUrl = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const submitBankIdentityAPI = async (identityId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/addBankAddress`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const postDownloadStampDpcApi = async (data, cancelToken) => {
  //http://localhost:8384/:entityId/CAPI/getDataSignedUrl
  const url = `/${entityId}/${baseURL}/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};


//1
export const postStampingApi = async (identityId, accountShareHolderId, data, cancelToken) => {
  //http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/DocumentDigitalStamping
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/AccountShareHolder/${accountShareHolderId}/DocumentDigitalStamping`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getBankIdentitiesAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/getIdentityBankList`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const deleteBankWalletAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/BankWalletIdentityDelete/${identityId}`;
  const request = { type: "DELETE", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const doStampingAPI = async (identityId, accountShareHolderId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/AccountShareHolder/${accountShareHolderId}/DocumentDigitalStamping`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const handleDownloadStampDocumentAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const doESignAPI = async (identityId, accountShareHolderId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/AccountShareHolder/${accountShareHolderId}/DocumentAadhaarSigning`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getUserEntitiesAPI = async (cancelToken) => {
  const url = `/user/entities`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};


export const getEntityPermissionAPI = async (entityId, cancelToken) => {
  const url = `/user/entity/${entityId}/permissions`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getSyncedUserEntitiesAPI = async (cancelToken) => {
  const url = `/user/entities?sync=true`;
  const request = { type: "GET", urlString: url };
  
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};


export const getIdentityCount = async (entity_Id,baseURL="CAPI", cancelToken) => {
//http://localhost:8384/:entityId/CAPI/identityCount

  const url = `/${entity_Id}/${baseURL}/identityCount`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const deleteAccountAPI = async (account_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/account/${account_id}/delete`;
  const request = { type: "DELETE", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const submitCustomTransactionDataAPI = async (accountId,data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${accountId}/addAccountTransaction`;
  const request = { type: "POST", urlString: url, params:data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getCustomTransactionAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/transactions/${accountId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const deleteTransaction = async ( accountId,id, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/46e9572d-8ef2-4fd6-80d2-c6fd325f024d/deleteAccountTransaction?id=4f9bcf5b-455e-4189-8302-08352963fd7e
  const url = `/${entityId}/${baseURL}/${accountId}/deleteAccountTransaction?id=${id}`
const request = { type: "DELETE", urlString: url , params: data}
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
};
export const validateByPennyDropVerifyAPI = async (identityId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/registrationProvider/get-data?identity_id=${identityId}`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const verifyFundExist = async ( data, cancelToken) => {
  //post url:CAPI/Account/list/verify

  //
  const url = `/${entityId}/${baseURL}/Account/list/verify`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};



//delete manual subscription document
export const deleteManualSubscriptionDoc = async (docId,data, cancelToken) => {
  //http://localhost:8384/0e1cf9bf-f513-44fc-991b-9d0f0694703c/CAPI/d4399401-f8c7-4d7f-83bb-ae56c0a37e8d/document-delete
    const url = `/${entityId}/${baseURL}/${docId}/document-delete`;
    const request = { type: "POST", urlString: url ,params:data};
    try {
      const response = await processRequest(request, cancelToken);
      return response.data;
    } catch (error) {
      return getErrorResponse(error);
    }
  };