/* eslint-disable react/no-unstable-nested-components */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Easing,
  LayoutAnimation,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  LightSpeedOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useFetch } from "@services/backgroundTask";
import { storage } from "@services/storage";

const darkColors = {
  background: "#121212",
  primary: "#BB86FC",
  primary2: "#3700b3",
  secondary: "#03DAC6",
  onBackground: "#FFFFFF",
  error: "#CF6679",
};

const colorEmphasis = {
  high: 0.87,
  medium: 0.6,
  disabled: 0.38,
};

const Item = ({ item, keys }: { item: any; keys?: any }) => {
  return (
    <Animated.View key={keys} style={styles.item} exiting={LightSpeedOutLeft}>
      <View style={styles.avatar} />
      <View style={styles.messageContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.author ?? ""}
        </Text>
        <Text style={styles.subject} numberOfLines={1}>
          {item.content}
        </Text>
        <Text style={styles.text} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Animated.View>
  );
};

function renderItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

const HomeScreen = () => {
  const {
    data: newsData,
    isPending,
    fetchData,
  } = useFetch(
    // eslint-disable-next-line max-len
    "https://newsapi.org/v2/everything?page=1&pageSize=20&domains=bbc.co.uk,techcrunch.com,engadget.com&apiKey=8d8e62acd6c248109eafe31fef011b3e",
  );

  const [datas, setDatas] = useState(newsData || []);
  const [pinned, setPinned] = useState(null);
  const timerRef = useRef();

  const layoutAnimConfig = {
    duration: 500,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 200,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      const isStored = storage.getString("newsData");
      if (!isStored) return;
      const stored = JSON.parse(isStored);
      const randomNews: any = [];
      for (let i = 0; i < 5; i++) {
        randomNews.push(
          stored.articles[Math.floor(Math.random() * stored.articles.length)],
        );
      }
      setDatas([...randomNews, ...datas]);
      LayoutAnimation.configureNext(layoutAnimConfig);
    }, 5000);
  }, [datas]);

  useEffect(() => {
    if (newsData) {
      const storedData = newsData;
      const removedData =
        storedData.length > 10 ? storedData.splice(0, 10) : storedData;
      setDatas(removedData);
    }
  }, [newsData]);

  useEffect(() => {
    // startTimer();

    return () => clearTimeout(timerRef.current);
  }, [startTimer]);

  const deleteItem = (itemId: any) => {
    const newState = [...datas];
    const filteredState = newState.filter(
      (item) => item.publishedAt !== itemId,
    );
    setDatas(filteredState);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const addItem = (itemId: any) => {
    // setDatas(newData);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const pinItem = (item: any) => {
    setPinned(item);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const QuickActions = (index: any, qaItem: any) => {
    return (
      <View style={styles.qaContainer}>
        <View style={[styles.button, styles.button2Text]}>
          <Pressable onPress={() => pinItem(qaItem)}>
            <Text style={[styles.buttonText, styles.button2Text]}>Pin</Text>
          </Pressable>
        </View>
        <View style={[styles.button, styles.button3Text]}>
          <Pressable onPress={() => deleteItem(qaItem.publishedAt)}>
            <Text style={[styles.buttonText, styles.button3Text]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (!datas || isPending) return <Text>Loading...</Text>;

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Latest News</Text>
          {pinned ? <Item item={pinned} /> : null}
        </View>
        <SwipeableFlatList
          keyExtractor={(item: any, index: any) => index.toString()}
          data={datas}
          renderItem={({ item, index }: { item: any; index: any }) => (
            <Item keys={index} item={item} />
          )}
          maxSwipeDistance={160}
          renderQuickActions={({ index, item }) => QuickActions(index, item)}
          contentContainerStyle={styles.contentContainerStyle}
          shouldBounceOnMount={true}
          ItemSeparatorComponent={renderItemSeparator}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "800",
    color: darkColors.onBackground,
    opacity: colorEmphasis.high,
  },
  item: {
    backgroundColor: "#121212",
    height: 80,
    flexDirection: "row",
    padding: 10,
  },
  messageContainer: {
    backgroundColor: darkColors.background,
    maxWidth: 300,
  },
  name: {
    fontSize: 16,
    color: darkColors.primary,
    opacity: colorEmphasis.high,
    fontWeight: "800",
  },
  subject: {
    fontSize: 14,
    color: darkColors.onBackground,
    opacity: colorEmphasis.high,
    fontWeight: "bold",
    textShadowColor: darkColors.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  text: {
    fontSize: 10,
    color: darkColors.onBackground,
    opacity: colorEmphasis.medium,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: darkColors.onBackground,
    opacity: colorEmphasis.high,
    borderColor: darkColors.primary,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 7,
    alignSelf: "center",
    shadowColor: darkColors.secondary,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: colorEmphasis.high,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: darkColors.onBackground,
    opacity: colorEmphasis.medium,
  },
  qaContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    opacity: colorEmphasis.high,
  },
  button1Text: {
    color: darkColors.primary,
  },
  button2Text: {
    color: darkColors.secondary,
  },
  button3Text: {
    color: darkColors.error,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: darkColors.background,
  },
});

export default HomeScreen;
