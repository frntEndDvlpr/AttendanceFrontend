import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const storeTokens = async (access, refresh) => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
  } catch (error) {
    console.log("Error storing tokens", error);
  }
};

const getAccessToken = async () => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.log("Error getting access token", error);
  }
};

const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.log("Error getting refresh token", error);
  }
};

const getUser = async () => {
  const token = await getAccessToken();
  return token ? jwtDecode(token) : null;
};

const removeTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.log("Error removing tokens", error);
  }
};

export default {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  getUser,
  removeTokens,
};
