import React from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { colorEmphasis, darkColors } from "utils";
import { Fetch } from "./Icons";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Loader = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          source={require("../../../assets/splash/google.png")}
        />
        <Text style={styles.headerText}>News Feed</Text>
        <View style={styles.fetch}>
          <Fetch />
        </View>
      </View>
      {Array(10)
        .fill("")
        .map((_, idx) => (
          <View style={styles.shimmerContainer} key={idx}>
            <View style={{ gap: 10 }}>
              <ShimmerPlaceholder
                style={styles.shimmer}
                width={200}
                height={50}
                shimmerColors={["#3a3a3a", "#4a4a4a", "#3a3a3a"]}
              />
              <ShimmerPlaceholder
                style={styles.shimmer}
                width={50}
                height={10}
                shimmerColors={["#3a3a3a", "#4a4a4a", "#3a3a3a"]}
              />
            </View>
            <ShimmerPlaceholder
              style={styles.shimmer}
              width={60}
              height={60}
              shimmerColors={["#3a3a3a", "#4a4a4a", "#3a3a3a"]}
            />
          </View>
        ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },

  headerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
    position: "relative",
  },
  fetch: {
    borderRadius: 999,
    padding: 2,
  },
  logo: {
    width: 24,
    height: 24,
  },
  shimmerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  shimmer: {
    borderRadius: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: darkColors.onBackground,
    opacity: colorEmphasis.high,
  },
});

export default Loader;
