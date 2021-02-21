import axios from "axios";
import { serverDomain } from "../config";
import parseCookie from "./parseCookie";

let http = (
  method = "GET",
  url = "/",
  body = null,
  callback = null,
  errorCallback = null
) => {
  if (method == "POST") {
    body = { ...body, cookies: parseCookie() };
  }

  axios({
    method: method,
    url: serverDomain + url,
    data: body,
    withCredentials: true,
  })
    .then((response) => {
      console.log(`${method} request send to ${serverDomain + url}`);
      console.log("Response from server: ", response);

      if (callback) callback(response);
    })
    .catch((err) => {
      alert("Error occured during http request. \n Check console for log data");
      console.log(err);
      if (errorCallback) errorCallback(err);
    });
};

export default http;
