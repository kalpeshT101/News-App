import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    flexDirection: "row",
    position: "relative",
  },
  fetch: {
    position: "absolute",
    right: 25,
    top: 25,
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
});
