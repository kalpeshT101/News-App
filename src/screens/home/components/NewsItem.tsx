import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

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

const NewsItem = ({ item }: { item: any }) => {
  return (
    <Animated.View
      key={item.id}
      style={styles.item}
      entering={Platform.OS === "android" ? FadeInUp : undefined}
    >
      <View style={styles.messageContainer}>
        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.name}>{item.author ?? ""}</Text>
      </View>
      <Image
        style={styles.avatar}
        source={{
          uri: item.urlToImage ?? "https://reactnative.dev/img/tiny_logo.png",
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#121212",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageContainer: {
    backgroundColor: darkColors.background,
    flexShrink: 1,
  },
  name: {
    fontSize: 14,
    color: darkColors.primary,
    opacity: colorEmphasis.high,
    fontWeight: "600",
    paddingTop: 4,
  },
  text: {
    fontSize: 16,
    color: darkColors.onBackground,
    opacity: colorEmphasis.medium,
    fontWeight: "500",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 10,
    alignSelf: "center",
    overflow: "hidden",
  },
});

export default NewsItem;
