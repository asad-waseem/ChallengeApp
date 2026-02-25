import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, fontSizes } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

const ANIMATION_TAGS = [
  "I love music & art",
  "I struggle with anxiety",
  "Night owl life",
  "Family can be complicated",
  "I find comfort in nature",
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const tagAnims = useRef(ANIMATION_TAGS.map(() => new Animated.Value(0))).current;
  const graffitiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        180,
        tagAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 70,
            friction: 9,
            useNativeDriver: true,
          })
        )
      ),
      Animated.timing(graffitiAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.push("/mentor-intro");
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "web" ? 67 : insets.top,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.headingContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.heading}>Just a moment while</Text>
        <Text style={styles.heading}>we find your match...</Text>
      </Animated.View>

      <View style={styles.tagsContainer}>
        {ANIMATION_TAGS.map((tag, index) => (
          <AnimatedTag key={tag} label={tag} anim={tagAnims[index]} />
        ))}
      </View>

      <Animated.View
        style={[styles.graffitiContainer, { opacity: graffitiAnim }]}
        pointerEvents="none"
      >
        <Image
          source={require("../assets/images/graffiti-blue.png")}
          style={styles.graffitiImage}
          contentFit="contain"
        />
      </Animated.View>

      <View style={styles.dotsContainer}>
        <LoadingDots />
      </View>
    </View>
  );
}

function AnimatedTag({ label, anim }: { label: string; anim: Animated.Value }) {
  return (
    <Animated.View
      style={[
        styles.tag,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.tagText}>{label}</Text>
    </Animated.View>
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -6,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.delay(500),
        ])
      );

    bounce(dot1, 0).start();
    bounce(dot2, 160).start();
    bounce(dot3, 320).start();
  }, []);

  return (
    <View style={styles.dots}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            { transform: [{ translateY: dot }] },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
  },
  headingContainer: {
    marginTop: 80,
    marginBottom: spacing.xl,
  },
  heading: {
    fontSize: fontSizes.xxxl,
    fontFamily: "DMSans_700Bold",
    color: colors.text,
    lineHeight: 44,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.tagBg,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagText: {
    fontFamily: "DMSans_400Regular",
    fontSize: fontSizes.md,
    color: colors.text,
  },
  graffitiContainer: {
    position: "absolute",
    bottom: 80,
    right: -40,
    width: width * 0.65,
    height: width * 0.65,
    opacity: 0.35,
  },
  graffitiImage: {
    width: "100%",
    height: "100%",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 60,
    left: spacing.lg,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-end",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});
