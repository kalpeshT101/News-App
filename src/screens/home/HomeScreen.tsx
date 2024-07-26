/* eslint-disable react/no-unstable-nested-components */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  FadeInDown,
  LightSpeedOutLeft,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import Svg, { Path } from "react-native-svg";
// @ts-ignore
import SwipeableFlatList from "react-native-swipeable-list";
// @ts-ignore
import { useFetch } from "@services/backgroundTask";
import { storage } from "@services/storage";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

const SvgComponent = () => (
  <Svg
    xmlSpace="preserve"
    width={16}
    height={16}
    fill="#fff"
    stroke="#fff"
    viewBox="0 0 330 330"
  >
    <Path d="m325.606 229.393-150.004-150a14.997 14.997 0 0 0-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.953 14.953 0 0 0 315 255a14.95 14.95 0 0 0 10.607-4.394c5.857-5.858 5.857-15.355-.001-21.213z" />
  </Svg>
);

const Fetch = () => (
  <Svg width={24} height={24} fill="none" stroke="#fff" viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.393 5.374c3.632 1.332 5.505 5.378 4.183 9.038a7.008 7.008 0 0 1-5.798 4.597m0 0 1.047-1.754m-1.047 1.754 1.71.991m-4.881-1.374c-3.632-1.332-5.505-5.378-4.183-9.038a7.008 7.008 0 0 1 5.798-4.597m0 0-1.047 1.754m1.047-1.754L9.512 4"
    />
  </Svg>
);

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
  const ref = useRef(null);

  const layoutAnimConfig = {
    duration: 300,
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
    }, 10000);
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

      setDatas(localData);
      setCurrentData([...randomNews, ...currentData]);
      LayoutAnimation.configureNext(layoutAnimConfig);
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
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const addItem = (itemId: any) => {
    // setDatas(newData);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const pinItem = (item: any) => {
    setPinned(item);
    const newState = [...currentData];
    const filteredState = newState.filter((items) => items.id !== item.id);
    setCurrentData(filteredState);
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>News Feed</Text>
        <Pressable style={styles.fetch} onPress={fetchNews}>
          <Fetch />
        </Pressable>
      </View>
      {pinned ? <Item item={pinned} /> : null}
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
          renderItem={({ item }: { item: any }) => <Item item={item} />}
          maxSwipeDistance={160}
          renderQuickActions={({ item }: { item: any }) => QuickActions(item)}
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
          <SvgComponent />
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
  scrollTopButton: {
    backgroundColor: "gray",
    padding: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 999,
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
