/* eslint-disable react/no-unstable-nested-components */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutAnimation,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { LightSpeedOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
// @ts-ignore
import { useFetch } from "@services/backgroundTask";

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

const Item = ({ item }: { item: any }) => {
  return (
    <Animated.View style={styles.item} exiting={LightSpeedOutLeft}>
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
    "https://newsapi.org/v2/everything?page=1&pageSize=40&domains=bbc.co.uk,techcrunch.com,engadget.com&apiKey=8d8e62acd6c248109eafe31fef011b3e",
  );

  const [datas, setDatas] = useState(newsData || []);
  const [currentData, setCurrentData] = useState([]);
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
    timerRef.current = setInterval(() => {
      if (datas.length === 0) return;
      const randomNews: any = [];
      const localData = datas;

      for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * localData.length);
        randomNews.push(localData[index]);
        localData.splice(index, 1);
      }

      setDatas(localData);
      setCurrentData([...randomNews, ...currentData]);
      LayoutAnimation.configureNext(layoutAnimConfig);
    }, 5000);
  }, [currentData, datas]);

  useEffect(() => {
    if (newsData) {
      setDatas(newsData);
      setCurrentData(newsData.splice(0, 10));
    }
  }, [newsData]);

  useEffect(() => {
    if (datas) {
      clearInterval(timerRef.current);
      startTimer();
    }

    return () => clearInterval(timerRef.current);
  }, [datas, startTimer, fetchData]);

  const deleteItem = (itemId: any) => {
    const newState = [...currentData];
    const filteredState = newState.filter((item) => item.id !== itemId);
    setCurrentData(filteredState);
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

  const QuickActions = (qaItem: any) => {
    return (
      <View style={styles.qaContainer}>
        <View style={[styles.button, styles.button2Text]}>
          <Pressable onPress={() => pinItem(qaItem)}>
            <Text style={[styles.buttonText, styles.button2Text]}>Pin</Text>
          </Pressable>
        </View>
        <View style={[styles.button, styles.button3Text]}>
          <Pressable onPress={() => deleteItem(qaItem.id)}>
            <Text style={[styles.buttonText, styles.button3Text]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (!currentData || isPending) return <Text>Loading...</Text>;

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Latest News</Text>
          {pinned ? <Item item={pinned} /> : null}
        </View>
        <SwipeableFlatList
          keyExtractor={(item: any) => item.id.toString()}
          data={currentData}
          renderItem={({ item }: { item: any }) => <Item item={item} />}
          maxSwipeDistance={160}
          renderQuickActions={({ item }: { item: any }) => QuickActions(item)}
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
