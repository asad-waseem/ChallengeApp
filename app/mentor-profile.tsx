import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { colors, spacing, fontSizes, radius } from "@/constants/theme";
import { MENTOR_DATA } from "@/data/mentor";
import { AudioPlayer } from "@/components/AudioPlayer";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function MentorProfileScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Haptics.selectionAsync();
    router.push("/");
  };

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/");
  };

  const handleFindNew = () => {
    Haptics.selectionAsync();
    router.push("/");
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Pressable
        style={[styles.closeButton, { top: topInset + 12 }]}
        onPress={handleClose}
        hitSlop={12}
      >
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 16, paddingBottom: bottomInset + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <View style={styles.divider} />
        <AudioSection />
        <View style={styles.divider} />
        <SharedTraitsSection />
        <View style={styles.divider} />
        <TextSection title="What I'm working on..." body={MENTOR_DATA.workingOn} />
        <View style={styles.divider} />
        <TopicsSection />
        <View style={styles.divider} />
        <TextSection
          title="Advice to my younger self"
          body={MENTOR_DATA.advice}
        />
        <View style={styles.divider} />
        <SpotifySection />
        <View style={styles.divider} />
        <TextSection title="What I'm up to..." body={MENTOR_DATA.whatsUp} />
        <View style={styles.divider} />
        <WeekendSection />
        <View style={styles.divider} />
        <NotMatchSection onFindNew={handleFindNew} />
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: bottomInset + 16 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function ProfileHeader() {
  return (
    <View style={styles.profileHeader}>
      <Text style={styles.meetText}>Meet {MENTOR_DATA.name}</Text>
      <Text style={styles.tagline}>{MENTOR_DATA.tagline}</Text>
      <View style={styles.profileImageContainer}>
        <Image
          source={MENTOR_DATA.profileImage}
          style={styles.profileImage}
          contentFit="cover"
        />
      </View>
    </View>
  );
}

function AudioSection() {
  return (
    <View style={styles.section}>
      <AudioPlayer
        title={MENTOR_DATA.audioTitle}
        duration={MENTOR_DATA.audioDuration}
      />
    </View>
  );
}

function SharedTraitsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>We both...</Text>
      <View style={styles.traitsContainer}>
        {MENTOR_DATA.sharedTraits.map((trait, index) => (
          <View key={index} style={styles.traitRow}>
            <View style={styles.traitIconContainer}>
              <Ionicons
                name={trait.icon as any}
                size={18}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.traitText}>{trait.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TextSection({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </View>
  );
}

function TopicsSection() {
  const rows: typeof MENTOR_DATA.topics[] = [];
  const topics = MENTOR_DATA.topics;
  for (let i = 0; i < topics.length; i += 2) {
    rows.push(topics.slice(i, i + 2));
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Things we can talk about...</Text>
      <View style={styles.topicsGrid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.topicsRow}>
            {row.map((topic, index) => (
              <View key={index} style={styles.topicTag}>
                <Ionicons
                  name={topic.icon as any}
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.topicText}>{topic.label}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function SpotifySection() {
  const { currentlyListening } = MENTOR_DATA;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>What I'm listening to...</Text>
      <View style={styles.spotifyCard}>
        <Image
          source={{ uri: currentlyListening.albumArt }}
          style={styles.albumArt}
          contentFit="cover"
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentlyListening.song}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentlyListening.artist}
          </Text>
        </View>
        <View style={styles.spotifyLogo}>
          <Ionicons name="musical-notes" size={18} color={colors.spotifyGreen} />
        </View>
      </View>
    </View>
  );
}

function WeekendSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>My weekends look like</Text>
      <Text style={styles.bodyText}>{MENTOR_DATA.weekendDescription}</Text>
      <View style={styles.weekendImageContainer}>
        <Image
          source={{ uri: MENTOR_DATA.weekendImage }}
          style={styles.weekendImage}
          contentFit="cover"
        />
        <View style={styles.graffitiOverlay} pointerEvents="none">
          <Image
            source={require("../assets/images/graffiti-green.png")}
            style={styles.graffitiSmall}
            contentFit="contain"
          />
        </View>
      </View>
    </View>
  );
}

function NotMatchSection({ onFindNew }: { onFindNew: () => void }) {
  return (
    <View style={styles.notMatchSection}>
      <View>
        <Text style={styles.notMatchTitle}>Not the right match?</Text>
        <Text style={styles.notMatchSubtitle}>We can find someone new</Text>
      </View>
      <Pressable onPress={onFindNew}>
        <Text style={styles.findNewLink}>Find new match</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  closeButton: {
    position: "absolute",
    right: spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.tagBg,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  meetText: {
    fontSize: fontSizes.xxl + 4,
    fontFamily: "DMSans_700Bold",
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: fontSizes.md,
    fontFamily: "DMSans_400Regular",
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  section: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontFamily: "DMSans_700Bold",
    color: colors.text,
  },
  bodyText: {
    fontSize: fontSizes.md,
    fontFamily: "DMSans_400Regular",
    color: colors.text,
    lineHeight: 24,
  },
  traitsContainer: {
    gap: spacing.md,
  },
  traitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  traitIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.tagBg,
    alignItems: "center",
    justifyContent: "center",
  },
  traitText: {
    flex: 1,
    fontSize: fontSizes.md,
    fontFamily: "DMSans_400Regular",
    color: colors.text,
    lineHeight: 22,
    paddingTop: 3,
  },
  topicsGrid: {
    gap: spacing.sm,
  },
  topicsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  topicTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.tagBg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  topicText: {
    fontFamily: "DMSans_400Regular",
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  spotifyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.spotifyDark,
    borderRadius: radius.lg,
    padding: spacing.sm + 4,
    gap: spacing.md,
  },
  albumArt: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: fontSizes.md,
    color: colors.white,
    marginBottom: 2,
  },
  artistName: {
    fontFamily: "DMSans_400Regular",
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.65)",
  },
  spotifyLogo: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  weekendImageContainer: {
    borderRadius: radius.lg,
    overflow: "hidden",
    height: 220,
    position: "relative",
  },
  weekendImage: {
    width: "100%",
    height: "100%",
  },
  graffitiOverlay: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 130,
    height: 130,
    opacity: 0.6,
  },
  graffitiSmall: {
    width: "100%",
    height: "100%",
  },
  notMatchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
  },
  notMatchTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: 2,
  },
  notMatchSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  findNewLink: {
    fontFamily: "DMSans_500Medium",
    fontSize: fontSizes.sm,
    color: colors.text,
    textDecorationLine: "underline",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  continueButton: {
    backgroundColor: colors.black,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    fontFamily: "DMSans_700Bold",
    fontSize: fontSizes.lg,
    color: colors.white,
  },
});
