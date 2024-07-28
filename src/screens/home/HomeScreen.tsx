import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
import { colorEmphasis, darkColors, NEWS_API_URL } from "utils";
import { NewsActionsType, newsReducer } from "@services/newsReducer";
import { storage } from "@services/storage";
import { useFetch } from "@services/useFetch";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NewsItem from "./components/NewsItem";
import QuickActions from "./components/QuickActions";

const renderItemSeparator = () => {
  return <View style={styles.itemSeparator} />;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const HomeScreen = () => {
  const { data: newsData, isPending, fetchData } = useFetch(NEWS_API_URL);

  const [{ storageNewsData, currentData, pinnedNews }, dispatch] = useReducer(
    newsReducer,
    {
      storageNewsData: newsData || [],
      currentData: [],
      pinnedNews: null,
    },
  );

  const timerRef = useRef<any>();
  const [isScrolling, setIsScrolling] = useState(false);
  const listRef = useRef<any>(null);

  const deleteItem = (itemId: any) => {
    if (currentData.length < 5) {
      fetchNewsManually();
    } else {
      const newState = [...currentData];
      const filteredState = newState.filter((item: any) => item.id !== itemId);
      dispatch({
        type: NewsActionsType.SET_LIST_VIEW_DATA,
        payload: filteredState,
      });
      const localStorageData = JSON.parse(storage.getString("newsData")!);
      const id = localStorageData.findIndex((news: any) => news.id === itemId);
      localStorageData.splice(id, 1);
      storage.set("newsData", JSON.stringify(localStorageData));
    }
    Platform.OS === "android"
      ? LayoutAnimation.configureNext(
          LayoutAnimation.create(200, "easeInEaseOut", "opacity"),
        )
      : LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const pinItem = useCallback(
    (item: any) => {
      const newState = [...currentData];
      const filteredState = newState.filter(
        (items: any) => items.id !== item.id,
      );
      dispatch({ type: NewsActionsType.PIN_NEWS, payload: item });
      dispatch({
        type: NewsActionsType.SET_LIST_VIEW_DATA,
        payload: filteredState,
      });
      Platform.OS === "android"
        ? LayoutAnimation.configureNext(
            LayoutAnimation.create(200, "easeInEaseOut", "opacity"),
          )
        : LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    [currentData, pinnedNews],
  );

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

    Platform.OS === "android"
      ? LayoutAnimation.configureNext(
          LayoutAnimation.create(200, "easeInEaseOut", "opacity"),
        )
      : LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch({ type: NewsActionsType.STORE_LOCAL_DATA, payload: localData });
    dispatch({
      type: NewsActionsType.SET_LIST_VIEW_DATA,
      payload: [...randomNews, ...currentData],
    });

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
      dispatch({ type: NewsActionsType.STORE_LOCAL_DATA, payload: newsData });
      dispatch({
        type: NewsActionsType.SET_LIST_VIEW_DATA,
        payload: (newsData as any).splice(0, 10),
      });
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
    if (isScrolling) {
      clearInterval(timerRef.current);
    }
  }, [isScrolling]);

  const renderNewsItem = useCallback(({ item }: { item: any }) => {
    return <NewsItem item={item} />;
  }, []);
  const renderQuickActions = useCallback(
    ({ item }: { item: any }) => {
      return QuickActions(item, pinItem, deleteItem);
    },
    [pinItem, deleteItem],
  );

  if (!currentData || isPending) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header pinnedNews={pinnedNews} fetchNews={fetchNewsManually} />
      <View style={styles.container}>
        <SwipeableFlatList
          keyExtractor={(item: any) => item.id.toString()}
          data={currentData}
          renderItem={renderNewsItem}
          maxSwipeDistance={140}
          renderQuickActions={renderQuickActions}
          contentContainerStyle={styles.contentContainerStyle}
          shouldBounceOnMount={true}
          ItemSeparatorComponent={renderItemSeparator}
          onMomentumScrollBegin={() => setIsScrolling(true)}
          onMomentumScrollEnd={() => setIsScrolling(false)}
          ref={listRef}
          initialNumToRender={10}
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
