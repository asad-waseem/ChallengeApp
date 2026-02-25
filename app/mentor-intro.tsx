import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, fontSizes } from "@/constants/theme";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function MentorIntroScreen() {
  const insets = useSafeAreaInsets();
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const graffitiScale = useRef(new Animated.Value(0.7)).current;
  const graffitiOpacity = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(graffitiScale, {
          toValue: 1,
          tension: 50,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(graffitiOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.push("/mentor-profile");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "web" ? 67 : insets.top,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.headerText,
            {
              opacity: titleFade,
              transform: [{ translateY: titleSlide }],
            },
          ]}
        >
          <Text style={styles.title}>Meet Sam</Text>
        </Animated.View>
        <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
          We think you'll really click.
        </Animated.Text>
      </View>

      <Animated.View
        style={[
          styles.graffitiWrapper,
          {
            opacity: graffitiOpacity,
            transform: [{ scale: graffitiScale }],
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={require("../assets/images/graffiti-blue.png")}
          style={styles.graffitiImage}
          contentFit="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { opacity: buttonFade }]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>See your match</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  content: {
    marginTop: 80,
    alignItems: "center",
  },
  headerText: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xxxl + 8,
    fontFamily: "DMSans_700Bold",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontFamily: "DMSans_400Regular",
    color: colors.textSecondary,
    textAlign: "center",
  },
  graffitiWrapper: {
    position: "absolute",
    left: -30,
    right: -30,
    top: "30%",
    height: height * 0.45,
    alignItems: "center",
    justifyContent: "center",
  },
  graffitiImage: {
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  buttonContainer: {
    paddingBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.black,
    borderRadius: 999,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: fontSizes.lg,
    color: colors.white,
  },
});
