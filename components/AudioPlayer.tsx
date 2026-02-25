import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSizes } from "@/constants/theme";

interface AudioPlayerProps {
  title: string;
  duration: string;
}

const WAVEFORM_BARS = 28;
const BAR_HEIGHTS = [
  0.3, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4, 0.85, 0.6, 0.75, 0.5, 0.9, 0.65, 0.4,
  0.7, 0.55, 0.8, 0.45, 0.9, 0.6, 0.35, 0.7, 0.5, 0.85, 0.65, 0.4, 0.75, 0.5,
];

export function AudioPlayer({ title, duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();

      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 / 43;
        });
      }, 1000);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (progressRef.current) clearInterval(progressRef.current);
    }

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.playerRow}>
        <Pressable onPress={togglePlay} style={styles.playButton}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={40}
              color={colors.accent}
            />
          </Animated.View>
        </Pressable>

        <View style={styles.waveformContainer}>
          {BAR_HEIGHTS.map((height, index) => {
            const isActive = index / WAVEFORM_BARS <= progress;
            return (
              <WaveformBar
                key={index}
                heightRatio={height}
                isActive={isActive || (isPlaying && Math.abs(index / WAVEFORM_BARS - progress) < 0.05)}
              />
            );
          })}
        </View>

        <Text style={styles.duration}>{duration}</Text>
      </View>
    </View>
  );
}

function WaveformBar({
  heightRatio,
  isActive,
}: {
  heightRatio: number;
  isActive: boolean;
}) {
  const animVal = useRef(new Animated.Value(isActive ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: isActive ? 1 : 0.5,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {
          height: heightRatio * 28,
          backgroundColor: animVal.interpolate({
            inputRange: [0.5, 1],
            outputRange: [colors.border, colors.accent],
          }),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSizes.md,
    fontFamily: "DMSans_500Medium",
    color: colors.text,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 14,
    padding: spacing.md,
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  waveformContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 32,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
  },
  duration: {
    fontFamily: "DMSans_400Regular",
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    minWidth: 28,
    textAlign: "right",
  },
});
