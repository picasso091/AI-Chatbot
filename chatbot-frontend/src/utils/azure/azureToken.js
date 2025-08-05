import Cookie from "universal-cookie";

import axiosInstance from "../axiosInstance";
import { errorNotification } from "../showNotification";

export async function getTokenOrRefresh(fromCookie) {
  const cookie = new Cookie();
  const speechToken = cookie.get("azure-speech-token");

  if (speechToken === undefined || !fromCookie) {
    try {
      const res = await axiosInstance.get("/azure/speech-token");
      const token = res.data.token;
      const region = res.data.region;
      cookie.set("azure-speech-token", region + ":" + token, { maxAge: 90000000, path: "/" });

      console.log("Token fetched from back-end");
      return { authToken: token, region: region };
    } catch (err) {
      errorNotification({ message: "Cannot fetch speech token right now" });
      return { authToken: null, error: err.response.data };
    }
  } else {
    console.log("Token fetched from cookie: " + speechToken);
    const idx = speechToken.indexOf(":");
    return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
  }
}
