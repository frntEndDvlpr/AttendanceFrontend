/* This code defines an UploadScreen component that displays a progress circle or a success animation
/  based on the upload progress. It uses a modal to show the upload status and handles the completion of the upload with a timeout.*/

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";
import colors from "../config/colors";

function UploadScreen({
  progress = 0,
  visible = false,
  onDone,
  timeout = 2000,
}) {
  const hasFinished = useRef(false);

  useEffect(() => {
    if (progress >= 1 && !hasFinished.current) {
      hasFinished.current = true;
      const timer = setTimeout(onDone, timeout);
      return () => clearTimeout(timer);
    }
  }, [progress, onDone, timeout]);

  const handleAnimationFinish = () => {
    if (!hasFinished.current) {
      hasFinished.current = true;
      onDone();
    }
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        {progress < 1 ? (
          <Progress.Circle
            size={150}
            indeterminate={true}
            progress={progress}
            color={colors.secondary}
          />
        ) : (
          <LottieView
            autoPlay
            loop={false}
            onAnimationFinish={handleAnimationFinish}
            source={require("../assets/animations/done.json")}
            style={styles.doneAninmation}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  doneAninmation: {
    width: 200,
    height: 200,
  },
});

export default UploadScreen;
