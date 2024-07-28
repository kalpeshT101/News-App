## Quick Start

- `clone the repo`
- `make sure react native environment has been setup`
- `npm i`
- `cd ios && pod install`
- `npm run ios/android to run the app`

## Note

- App uses `react-native-background-fetch` to setup background task which periodically fetches the data from the api and sets the local storage of the app
- Please note there are some limitations of the library: https://github.com/transistorsoft/react-native-background-fetch?tab=readme-ov-file#ios
- To test the background task execution would advise to run the app in android and enter `adb logcat -s ReactNative:V ReactNativeJS:V TSBackgroundFetch:V` once the app has been started v
- Please uncomment the line 40-47 in `App.tsx` and save the file to schedule the task and keep in app in background or terminate(only works in android due to headless task) and observe the logs
- the above step is just to test the functionality in less time as the minimum allowed time to initiate the background task is 15mins
