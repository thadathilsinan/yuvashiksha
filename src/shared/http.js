import axios from "axios";
import { serverDomain } from "../config";

let http = (
  method,
  url,
  body = null,
  callback = null,
  errorCallback = null
) => {
  axios({
    method: method,
    url: serverDomain + url,
    data: body,
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
