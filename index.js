/**
 * @format
 */
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { fetchAndStore } from "@services/backgroundTask";
import BackgroundFetch from "react-native-background-fetch";

const backgroundFetchHeadlessTask = async (event) => {
  if (event.timeout) {
    console.log('[BackgroundFetch] HeadlessTask TIMEOUT: ', event.taskId);
    BackgroundFetch.finish(event.taskId);
    return;
  }
  console.log('[BackgroundFetch] HeadlessTask start: ', event.taskId);
  await fetchAndStore() 
  console.log('fetched')
  BackgroundFetch.finish(event.taskId);
}

BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
