import React from "react";
import { LogBox, StatusBar, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import BootSplash from "react-native-bootsplash";
import { isAndroid } from "@freakycoder/react-native-helpers";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";

LogBox.ignoreAllLogs();

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }

    const init = async () => {
      await setTimeout(async () => await true, 4000);
    };
    init()
      .finally(async () => {
        await BootSplash.hide({ fade: true });
      })
      .catch((err) => err);
  }, [scheme, isDarkMode]);

  return <Navigation />;
};

export default App;
