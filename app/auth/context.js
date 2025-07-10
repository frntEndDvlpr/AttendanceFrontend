import React, { createContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import Bugsnag from "@bugsnag/expo";
import authStorage from "./storage";
import authApi from "../api/auth"; // should include getMe()
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = await authStorage.getAccessToken();
      if (token) {
        // ✅ Decode to verify token format
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // ✅ Fetch full user details (with is_staff, employee, etc.)
        const result = await authApi.getMe(token);
        if (result.ok) {
          console.log("Full user profile:", result.data);
          setUser(result.data); // ✅ Full user info including is_staff
        } else {
          console.log("Failed to fetch user details:", result.problem);
        }
      }
    } catch (error) {
      Bugsnag.notify(error);
      console.log("Error loading user:", error);
    }
  };

  const refreshToken = async () => {
    const refresh = await authStorage.getRefreshToken();
    if (!refresh) return logout();

    const result = await authApi.refreshToken(refresh);
    if (result.ok && result.data?.access) {
      await authStorage.storeTokens(result.data.access, refresh);
      const decoded = jwtDecode(result.data.access);
      console.log("Token refreshed:", decoded);

      const userResult = await authApi.getMe(result.data.access);
      if (userResult.ok) {
        console.log("Refreshed user profile:", userResult.data);
        setUser(userResult.data);
      }
    }
  };

  const logout = async () => {
    setUser(null);
    await authStorage.removeTokens();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          await refreshToken();
        }
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  const restoreUser = async () => {
    const storedUser = await authStorage.getUser();
    if (storedUser) setUser(storedUser);
    setLoading(false);
  };

  useEffect(() => {
    restoreUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
