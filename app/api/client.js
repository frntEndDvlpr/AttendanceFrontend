import { create } from "apisauce";
import authStorage from "../auth/storage";
import settings from "../config/settings";
import Bugsnag from "@bugsnag/expo";
import tokenService from "./tokenService";

const apiClient = create({
  baseURL: settings.apiUrl,
  timeout: 10000,
});

// Attach access token before each request
apiClient.addAsyncRequestTransform(async (request) => {
  const accessToken = await authStorage.getAccessToken();
  if (accessToken) {
    request.headers["Authorization"] = `JWT ${accessToken}`;
  }
});

// Refresh token on 401 response
apiClient.addResponseTransform(async (response) => {
  if (response.status !== 401 || response.config._retry) return;

  response.config._retry = true; // prevent infinite loop

  try {
    const refreshToken = await authStorage.getRefreshToken();
    if (!refreshToken) return;

    const refreshResponse = await tokenService.refreshToken(refreshToken);

    if (refreshResponse.ok && refreshResponse.data?.access) {
      const newAccessToken = refreshResponse.data.access;
      await authStorage.storeTokens(newAccessToken, refreshToken);

      // Retry original request with new token
      const newRequest = { ...response.config };
      newRequest.headers["Authorization"] = `JWT ${newAccessToken}`;
      return apiClient.any(newRequest);
    } else {
      await authStorage.removeTokens();
    }
  } catch (error) {
    Bugsnag.notify(error);
  }
});

export default apiClient;
