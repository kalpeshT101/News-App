import React, { useEffect } from "react";
import { LogBox, StatusBar, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import BackgroundFetch from "react-native-background-fetch";
import BootSplash from "react-native-bootsplash";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { fetchAndStore } from "@services/backgroundTask";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";

LogBox.ignoreAllLogs();

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const initBackgroundFetch = async () => {
    await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        forceAlarmManager: true,
      },
      async (taskId: string) => {
        await fetchAndStore();
        // console.log("fetched and stored the data");
        BackgroundFetch.finish(taskId);
      },
      (taskId: string) => {
        console.log("[Fetch] TIMEOUT taskId:", taskId);
        BackgroundFetch.finish(taskId);
      },
    );

    // uncomment to simulate background task execution in less time
    // BackgroundFetch.scheduleTask({
    //   taskId: "com.foo.customtask",
    //   delay: 60000, // milliseconds
    //   forceAlarmManager: true,
    //   enableHeadless: true,
    //   periodic: true,
    //   stopOnTerminate: false,
    // });
  };

  useEffect(() => {
    initBackgroundFetch();
  }, []);

  useEffect(() => {
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
