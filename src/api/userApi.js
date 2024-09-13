import { investorClientId } from ".";
import ResponseModel, {
  processError,
  processRequest,
  RequestType,
} from "./config";

export const getToken = async (code, code_verifier, cancelToken) => {
  const customResponse = new ResponseModel();
  const url = `/auth/getToken?code=${code}&client_id=${investorClientId}&code_verifier=${code_verifier}`;
  const request = {
    type: RequestType.POST,
    urlString: url,
  };
  try {
    // setAxiosHeader({});
    const response = await processRequest(request, cancelToken);
    customResponse.response = response;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};

export const getEntities = async () => {
  const customResponse = new ResponseModel();
  const url = `/user/entities`;
  const request = {
    type: RequestType.GET,
    urlString: url,
  };
  try {
    const response = await processRequest(request);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};

export const getEntityPermission = async (entityId, cancelToken) => {
  const customResponse = new ResponseModel();
  const url = `/user/entity/${entityId}/permissions`;
  const request = {
    type: RequestType.GET,
    urlString: url,
  };
  try {
    // setAxiosHeader({});
    const response = await processRequest(request, cancelToken);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
}

export const getIdentityCount = async (entityId, baseURL="CAPI", cancelToken) => {
  const customResponse = new ResponseModel();
  const url = `/${entityId}/${baseURL}/identityCount`;
  const request = {
    type: RequestType.GET,
    urlString: url,
  };
  try {
    // setAxiosHeader({});
    const response = await processRequest(request, cancelToken);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
}
