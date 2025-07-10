import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useLocation = () => {
  const [location, setLocation] = useState();

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      setLocation({ latitude, longitude });
      //console.log("Location:", { latitude, longitude });
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  useEffect(() => {
    getLocation();

    /* const intervalId = setInterval(() => {
      getLocation();
    }, 20000); // Update location every 20 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount */
  }, []);

  return location;
};

export default useLocation;
