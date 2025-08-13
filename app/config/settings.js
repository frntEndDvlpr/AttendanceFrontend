import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "http://192.168.0.101:8000/",
  },
  staging: {
    apiUrl: "https://attendance-ksa-247f689c4e51.herokuapp.com/",
  },
  prod: {
    apiUrl: "https://attendance-ksa-247f689c4e51.herokuapp.com/",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;

  const manifest = Constants.expoConfig || Constants.manifest;
  const releaseChannel = manifest?.releaseChannel;

  if (releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
