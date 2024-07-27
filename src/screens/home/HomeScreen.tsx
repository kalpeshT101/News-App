/* eslint-disable react/no-unstable-nested-components */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
// @ts-ignore
import { useFetch } from "@services/backgroundTask";
import { storage } from "@services/storage";
import { ArrowUp, Fetch } from "./components/Icons";
import NewsItem from "./components/NewsItem";
import QuickActions from "./components/QuickActions";

const windowWidth = Dimensions.get("window").width;
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

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
  const [currentData, setCurrentData] = useState([]);
  const [pinned, setPinned] = useState(null);
  const timerRef = useRef();
  const [scrollRef, setScrollRef] = useState(false);
  const ref = useRef<ScrollView>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      if (datas.length === 0) {
        clearInterval(timerRef.current);
        return;
      }
      const randomNews: any = [];
      const localData = datas;

      for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * localData.length);
        randomNews.push(localData[index]);
        localData.splice(index, 1);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDatas(localData);
      setCurrentData([...randomNews, ...currentData]);
    }, 5000);
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, datas]);

  const fetchNews = useCallback(async () => {
    clearInterval(timerRef.current);
    if (datas.length === 0) {
      storage.clearAll();
      await fetchData();
    } else {
      const randomNews: any = [];
      const localData = datas;

      for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * localData.length);
        randomNews.push(localData[index]);
        localData.splice(index, 1);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDatas(localData);
      setCurrentData([...randomNews, ...currentData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (scrollRef) {
      clearInterval(timerRef.current);
    }
  }, [scrollRef]);

  const deleteItem = (itemId: any) => {
    const newState = [...currentData];
    const filteredState = newState.filter((item) => item.id !== itemId);
    setCurrentData(filteredState);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const pinItem = (item: any) => {
    setPinned(item);
    const newState = [...currentData];
    const filteredState = newState.filter((items) => items.id !== item.id);
    setCurrentData(filteredState);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  if (!currentData || isPending)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContatiner}>
          <Text style={styles.headerText}>News Feed</Text>
          {Array(10)
            .fill("")
            .map((_, idx) => (
              <ShimmerPlaceholder
                key={idx}
                style={styles.shimmer}
                width={windowWidth - 20}
                height={100}
                shimmerColors={["#3a3a3a", "#4a4a4a"]}
              />
            ))}
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={pinned ? styles.header : {}}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>News Feed</Text>
          <Pressable style={styles.fetch} onPress={fetchNews}>
            <Fetch />
          </Pressable>
        </View>
        {pinned ? <NewsItem item={pinned} /> : null}
      </View>
      <ScrollView
        style={styles.container}
        onMomentumScrollBegin={() => setScrollRef(true)}
        onMomentumScrollEnd={() => setScrollRef(false)}
        bounces={false}
        ref={ref}
      >
        <SwipeableFlatList
          keyExtractor={(item: any) => item.id.toString()}
          data={currentData}
          renderItem={({ item }: { item: any }) => <NewsItem item={item} />}
          maxSwipeDistance={160}
          renderQuickActions={({ item }: { item: any }) =>
            QuickActions(item, pinItem, deleteItem)
          }
          contentContainerStyle={styles.contentContainerStyle}
          shouldBounceOnMount={true}
          ItemSeparatorComponent={renderItemSeparator}
        />
      </ScrollView>
      <Animated.View style={styles.scrollTopButton} entering={FadeInDown}>
        <Pressable
          onPress={async () => {
            // storage.clearAll();
            // await fetchData();
            ref?.current?.scrollTo({ x: 0, y: 0, animated: true });
          }}
        >
          <ArrowUp />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContatiner: {
    paddingHorizontal: 10,
    paddingTop: 20,
    flex: 1,
    gap: 10,
  },
  shimmer: {
    borderRadius: 8,
  },
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
  header: {
    borderBottomColor: "gray",
    borderBottomWidth: 2,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    flexDirection: "row",
    position: "relative",
  },
  fetch: {
    position: "absolute",
    right: 25,
    top: 25,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: darkColors.onBackground,
    opacity: colorEmphasis.high,
  },

  scrollTopButton: {
    backgroundColor: "gray",
    padding: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 999,
  },

  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: darkColors.onBackground,
    opacity: colorEmphasis.medium,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: darkColors.background,
  },
});

export default HomeScreen;
