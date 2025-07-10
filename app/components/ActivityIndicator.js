import React from "react";
import LottieView from "lottie-react-native";

function ActivityIndicator({ visible = false }) {
  if (!visible) return null;
  return (
    <LottieView
      autoPlay
      loop
      style={{
        height: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
      source={require("../assets/animations/loading.json")}
    />
  );
}

export default ActivityIndicator;
