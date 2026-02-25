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
const CARD_MARGIN = 14;
const CARD_RADIUS = 16;
const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

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

  const handleBack = () => {
    Haptics.selectionAsync();
    router.back();
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
      {/* Subtle background shapes behind content */}
      <View style={styles.backgroundShapes} pointerEvents="none">
        <Image
          source={require("../assets/images/graffiti-blue.png")}
          style={styles.bgShapeBlue}
          contentFit="contain"
        />
        <Image
          source={require("../assets/images/graffiti-green.png")}
          style={styles.bgShapeGreen}
          contentFit="contain"
        />
      </View>

      <Pressable
        style={[styles.backButton, { top: topInset + 12 }]}
        onPress={handleBack}
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 52, paddingBottom: bottomInset + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <View style={styles.card}>
          <AudioSection />
        </View>
        <View style={styles.card}>
          <SharedTraitsSection />
        </View>
        <View style={styles.card}>
          <TextSection title="What I'm working on..." body={MENTOR_DATA.workingOn} />
        </View>
        <View style={styles.card}>
          <TopicsSection />
        </View>
        <View style={styles.card}>
          <TextSection
            title="Advice to my younger self"
            body={MENTOR_DATA.advice}
          />
        </View>
        <View style={styles.card}>
          <SpotifySection />
        </View>
        <View style={styles.card}>
          <TextSection title="What I'm up to..." body={MENTOR_DATA.whatsUp} />
        </View>
        <View style={styles.card}>
          <WeekendSection />
        </View>
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
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Things we can talk about...</Text>
      <View style={styles.topicsGrid}>
        {MENTOR_DATA.topics.map((topic, index) => (
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
        <View style={styles.spotifyLogoBadge}>
          <Ionicons name="musical-notes" size={16} color={colors.white} />
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
    backgroundColor: colors.backgroundBeige,
  },
  backgroundShapes: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bgShapeBlue: {
    position: "absolute",
    top: "15%",
    right: -width * 0.2,
    width: width * 0.5,
    height: width * 0.5,
    opacity: 0.2,
  },
  bgShapeGreen: {
    position: "absolute",
    bottom: "20%",
    left: -width * 0.15,
    width: width * 0.4,
    height: width * 0.4,
    opacity: 0.18,
  },
  backButton: {
    position: "absolute",
    left: spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    padding: spacing.lg,
    marginBottom: CARD_MARGIN,
    ...CARD_SHADOW,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
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
    ...CARD_SHADOW,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontFamily: "DMSans_700Bold",
    color: colors.text,
    marginBottom: 2,
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
    flexDirection: "row",
    flexWrap: "wrap",
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
    padding: spacing.md,
    gap: spacing.md,
    position: "relative",
    minHeight: 72,
  },
  albumArt: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
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
    color: "rgba(255,255,255,0.7)",
  },
  spotifyLogoBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.spotifyGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  weekendImageContainer: {
    borderRadius: radius.lg,
    overflow: "hidden",
    height: 200,
    marginTop: spacing.sm,
  },
  weekendImage: {
    width: "100%",
    height: "100%",
  },
  notMatchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xl,
    paddingHorizontal: 2,
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    zIndex: 10,
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
