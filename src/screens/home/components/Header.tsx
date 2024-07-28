import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colorEmphasis, darkColors } from "utils";
import { Fetch } from "./Icons";
import NewsItem from "./NewsItem";

export default function Header({
  pinnedNews,
  fetchNews,
}: {
  pinnedNews: any;
  fetchNews: any;
}) {
  return (
    <View style={pinnedNews ? styles.header : {}}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          source={require("../../../assets/splash/google.png")}
        />
        <Text style={styles.headerText}>News Feed</Text>
        <Pressable
          onPress={fetchNews}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#A9A9A9" : "black",
            },
            styles.fetch,
          ]}
        >
          <Fetch />
        </Pressable>
      </View>
      {pinnedNews ? <NewsItem item={pinnedNews} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomColor: "gray",
    borderBottomWidth: 2,
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
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: darkColors.onBackground,
    opacity: colorEmphasis.high,
  },
  logo: {
    width: 24,
    height: 24,
  },
});
