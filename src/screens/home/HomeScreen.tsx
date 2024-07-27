import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutAnimation, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
import { colorEmphasis, darkColors } from "utils";
import { useFetch } from "@services/backgroundTask";
import { storage } from "@services/storage";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NewsItem from "./components/NewsItem";
import QuickActions from "./components/QuickActions";

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
    "https://newsapi.org/v2/everything?q=india&from=2024-06-27&sortBy=publishedAt&apiKey=8d8e62acd6c248109eafe31fef011b3e&page=1&pageSize=100",
  );

  const [storageNewsData, setStorageNewsData] = useState(newsData || []);
  const [currentData, setCurrentData] = useState<any>([]);
  const [pinnedNews, setPinnedNews] = useState<any>(null);
  const timerRef = useRef<any>();
  const [scrollRef, setScrollRef] = useState(false);

  const fetchRandomNews = useCallback(() => {
    const randomNews: any = [];
    const localData = storageNewsData;
    const localStorageData = JSON.parse(storage.getString("newsData")!);

    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * localData.length);
      randomNews.push(localData[index]);
      localData.splice(index, 1);
      localStorageData.splice(index, 1);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStorageNewsData(localData);
    setCurrentData([...randomNews, ...currentData]);
    storage.set("newsData", JSON.stringify(localStorageData));
  }, [storageNewsData, currentData]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      if (storageNewsData.length === 0) {
        clearInterval(timerRef.current);
        fetchNewsManually();
        return;
      } else {
        fetchRandomNews();
      }
    }, 10000);
  }, [currentData, storageNewsData]);

  const fetchNewsManually = useCallback(async () => {
    clearInterval(timerRef.current);
    if (storageNewsData.length === 0) {
      storage.clearAll();
      await fetchData();
    } else {
      fetchRandomNews();
    }
  }, [currentData, storageNewsData]);

  useEffect(() => {
    if (newsData) {
      setStorageNewsData(newsData);
      setCurrentData((newsData as any).splice(0, 10));
    }
  }, [newsData]);

  useEffect(() => {
    if (storageNewsData) {
      clearInterval(timerRef.current);
      startTimer();
    }

    return () => clearInterval(timerRef.current);
  }, [storageNewsData, startTimer, fetchData]);

  useEffect(() => {
    if (scrollRef) {
      clearInterval(timerRef.current);
    }
  }, [scrollRef]);

  const deleteItem = (itemId: any) => {
    if (currentData.length < 5) {
      fetchNewsManually();
    } else {
      const newState = [...currentData];
      const filteredState = newState.filter((item: any) => item.id !== itemId);
      setCurrentData(filteredState);
      const localStorageData = JSON.parse(storage.getString("newsData")!);
      const id = localStorageData.findIndex((news: any) => news.id === itemId);
      localStorageData.splice(id, 1);
      storage.set("newsData", JSON.stringify(localStorageData));
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const pinItem = (item: any) => {
    setPinnedNews(item);
    const newState = [...currentData];
    const filteredState = newState.filter((items: any) => items.id !== item.id);
    setCurrentData(filteredState);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  if (!currentData || isPending) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header pinnedNews={pinnedNews} fetchNews={fetchNewsManually} />
      <View style={styles.container}>
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
          onMomentumScrollBegin={() => setScrollRef(true)}
          onMomentumScrollEnd={() => setScrollRef(false)}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
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
