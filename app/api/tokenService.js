// app/api/tokenService.js
import { create } from "apisauce";
import settings from "../config/settings";

const tokenApiClient = create({
  baseURL: settings.apiUrl,
  timeout: 10000,
});

// No auth headers, used for token refresh
const refreshToken = (refresh) =>
  tokenApiClient.post("/token/refresh/", { refresh });

export default {
  refreshToken,
};
