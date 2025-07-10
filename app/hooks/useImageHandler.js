import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert, Platform } from "react-native";

export function useImageHandler() {
  const [image, setImage] = useState(null);

  // Request permissions for camera and media library access
  // This is done once when the hook is first used
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const mediaStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!cameraStatus.granted || !mediaStatus.granted) {
          Alert.alert(
            "Permissions Required",
            "Camera and Media Library permissions are required to use this feature."
          );
        }
      }
    })();
  }, []);

  // Function to handle image picking and manipulation
  /**
   * Handles image selection from camera or library, resizes it, and prepares it for upload.
   * @param {Function} launchFunction - The function to launch the image picker (camera or library).
   */
  const handleImage = async (launchFunction) => {
    try {
      const result = await launchFunction({
        allowsEditing: true,
        quality: 0.7,
        cameraType: "front",
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const manipulated = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Convert the URI into a form-acceptable file object
        const filename = manipulated.uri.split("/").pop();
        const fileType = filename.split(".").pop();

        setImage({
          uri: manipulated.uri,
          name: filename,
          type: `image/${fileType}`,
        });
      }
    } catch (error) {
      console.log("Error handling image:", error);
    }
  };

  const pickImageFromCamera = () => handleImage(ImagePicker.launchCameraAsync);
  const pickImageFromLibrary = () =>
    handleImage(ImagePicker.launchImageLibraryAsync);

  return { image, pickImageFromCamera, pickImageFromLibrary };
}
