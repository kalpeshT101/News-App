import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { colorEmphasis, darkColors } from "utils";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Loader = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContatiner}>
        <Text style={styles.headerText}>News Feed</Text>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
  loadingContatiner: {
    paddingHorizontal: 10,
    paddingTop: 20,
    flex: 1,
    gap: 10,
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
