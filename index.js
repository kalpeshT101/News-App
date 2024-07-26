/**
 * @format
 */
import { AppRegistry } from "react-native";
import BackgroundFetch from "react-native-background-fetch";
import performBackgroundSync from "@services/backgroundTask";
import App from "./App";
import { name as appName } from "./app.json";

BackgroundFetch.configure(
  {
    minimumFetchInterval: 1,
    stopOnTerminate: false,
    startOnBoot: true,
  },
  async () => {
    // Perform background tasks here
    console.log("trigger");
    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
  },
  (error) => {
    console.error("Background fetch error:", error);
  },
);

AppRegistry.registerComponent(appName, () => App);
