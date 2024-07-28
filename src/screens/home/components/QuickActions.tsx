import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

const QuickActions = (newsItem: any, pinItem: any, deleteItem: any) => {
  return (
    <View style={styles.qaContainer}>
      <Pressable style={styles.button} onPress={() => pinItem(newsItem)}>
        <Text style={[styles.buttonText, styles.button2Text]}>Pin</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => deleteItem(newsItem.id)}>
        <Text style={[styles.buttonText, styles.button3Text]}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default QuickActions;
