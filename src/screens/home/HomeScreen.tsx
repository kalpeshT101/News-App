import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutAnimation,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
import { colorEmphasis, darkColors } from "utils";
import { useFetch } from "@services/backgroundTask";
import { storage } from "@services/storage";
import Header from "./components/Header";
import NewsItem from "./components/NewsItem";
import QuickActions from "./components/QuickActions";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
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

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      if (storageNewsData.length === 0) {
        clearInterval(timerRef.current);
        fetchNews();
        return;
      }
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
      storage.set("newsData", JSON.stringify(localStorageData));
      setStorageNewsData(localData);
      setCurrentData([...randomNews, ...currentData]);
    }, 10000);
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, storageNewsData]);

  const fetchNews = useCallback(async () => {
    clearInterval(timerRef.current);
    if (storageNewsData.length === 0) {
      storage.clearAll();
      await fetchData();
    } else {
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
      storage.set("newsData", JSON.stringify(localStorageData));
      setCurrentData([...randomNews, ...currentData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      fetchNews();
    } else {
      const newState = [...currentData];
      const filteredState = newState.filter((item: any) => item.id !== itemId);
      setCurrentData(filteredState);
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

  if (!currentData || isPending)
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header pinnedNews={pinnedNews} fetchNews={fetchNews} />
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
