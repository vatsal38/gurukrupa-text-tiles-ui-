import axios, { AxiosRequestConfig } from "axios";
import AuthServices from "./AuthServices";
import toast from "react-hot-toast";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URI;
const instance = axios.create({ baseURL: apiBaseUrl });

function responseHelper(response: any) {
  if (response?.status === 200 || response?.status === 201) {
    return response.data;
  }
  return null;
}

function errorHelper(error: any) {
  if (error?.response?.data) {
    const message = error.response.data;
    if (
      message?.code != undefined ||
      message?.code != "ERR_USER_SUBSCRIPTION_NOT_FOUND"
    ) {
      const errorMessages = message.message;
      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((errorMessage) => {
          toast.error(errorMessage);
        });
      } else {
        toast.error(errorMessages);
      }
    }
  }
  return null;
}

instance.interceptors.request.use(
  function configHeader(config: any) {
    var authtoken: any = AuthServices.getAccessToken();
    if (authtoken != undefined) {
      config.headers = {
        ...config.headers,
        Authorization: AuthServices.getAccessToken(),
      } as AxiosRequestConfig["headers"];
    } else {
      config.headers = { ...config.headers };
    }

    return config;
  },
  function configError(error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(responseHelper, errorHelper);

export default instance;
