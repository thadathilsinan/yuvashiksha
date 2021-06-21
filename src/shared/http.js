import axios from "axios";
import config from "../config";
import parseCookie from "./parseCookie";

let http = (
  method = "GET",
  url = "/",
  body = null,
  callback = null,
  errorCallback = null
) => {
  //Variable for storing response from server
  let responseFromServer;

  if (method == "POST") {
    body = { ...body, cookies: parseCookie() };
  }

  axios({
    method: method,
    url: config.serverUrl + url,
    data: body,
    withCredentials: true,
  })
    .then((response) => {
      console.log(`${method} request send to ${config.serverUrl + url}`);
      console.log("Response from server: ", response);
      responseFromServer = response;

      if (callback) callback(response);
    })
    .catch((err) => {
      alert("Error occured during http request. \n Check console for log data");
      console.log(err);
      if (errorCallback) errorCallback(err);
    });

  return responseFromServer;
};

export default http;
