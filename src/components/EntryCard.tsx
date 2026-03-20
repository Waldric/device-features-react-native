import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TravelEntry } from "../types";
import { useTheme } from "../hooks/useTheme";
import { useThemeContext } from "../context/ThemeContext";
import { BlurView } from "expo-blur";

interface EntryCardProps {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}

function parseAddress(address: string): {
  cityRegion: string;
  streetDetail: string;
} {
  const parts = address.split(",").map((p) => p.trim());

  if (parts.length >= 3) {
    // Split region and postal code apart
    const regionParts = parts[2].split(" ");
    const postalCode = regionParts[regionParts.length - 1];
    const regionOnly = regionParts.slice(0, -1).join(" ");
    const hasPostal = /^\d{4,5}$/.test(postalCode);

    return {
      // No postal code dito
      cityRegion: `${parts[1]}, ${hasPostal ? regionOnly : parts[2]}`,
      streetDetail: `${parts[0]}${hasPostal ? ", " + postalCode : ""}`,
    };
  }

  return { cityRegion: address, streetDetail: "" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const { width } = Dimensions.get("window");

const EntryCard: React.FC<EntryCardProps> = ({ entry, onRemove }) => {
  const { theme } = useTheme();
  const { showToast } = useThemeContext();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [imageError, setImageError] = useState(false);
  const { cityRegion, streetDetail } = parseAddress(entry.address);

  const confirmRemove = () => {
    Alert.alert(
      "Remove Entry",
      "Are you sure you want to remove this travel memory?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 280,
              useNativeDriver: true,
            }).start(() => {
              onRemove(entry.id);
              showToast("Entry removed successfully");
            });
          },
        },
      ],
    );
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          shadowColor: theme.dark ? "#000" : "#94a3b8",
        },
      ]}
    >
      <View style={styles.card}>
        {/* Full-bleed image  */}
        {imageError ? (
          <View
            style={[
              styles.imageFallback,
              { backgroundColor: theme.dark ? "#2a2a2e" : "#f0f0f0" },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={36}
              color={theme.colors.subText}
            />
            <Text
              style={[
                styles.imageFallbackText,
                { color: theme.colors.subText },
              ]}
            >
              Image unavailable
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: entry.imageUri }}
            style={styles.image}
            resizeMode="cover"
            onError={() => {
              console.warn("[EntryCard] Image failed to load:", entry.imageUri);
              setImageError(true);
            }}
          />
        )}

        <LinearGradient
          colors={
            theme.dark
              ? ["transparent", "rgba(0,0,0,0.20)", "rgba(0,0,0,0.50)"]
              : ["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.70)"]
          }
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        />

        <View style={styles.textBlock}>
          {/* City, Region*/}
          <Text style={styles.cityText} numberOfLines={1}>
            {cityRegion}
          </Text>

          {/* Street address left then right date */}
          <View style={styles.detailRow}>
            <Text
              style={styles.streetText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {streetDetail}
            </Text>
            <Text style={styles.dateText}>{formatDate(entry.createdAt)}</Text>
          </View>
        </View>

        {/* Circular trash button */}
        <Pressable
          style={styles.deleteBtn}
          onPress={confirmRemove}
          accessibilityLabel="Delete this travel entry"
          accessibilityRole="button"
        >
          <BlurView
            intensity={theme.dark ? 40 : 10}
            tint={theme.dark ? "dark" : "light"}
            style={styles.deleteBtnBlur}
          >
            <Ionicons name="trash" size={18} color="#f13e3b" />
          </BlurView>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    width: width - 32,
    backgroundColor: "#1a1a1a",
  },
  image: {
    width: "100%",
    height: 240,
  },
  imageFallback: {
    width: "100%",
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imageFallbackText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },

  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
  },

  textBlock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 6,
    gap: 3,
  },

  cityText: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 1,
  },

  streetText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    flex: 1,
    marginRight: 8,
  },

  dateText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    flexShrink: 0,
  },

  deleteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  deleteBtnBlur: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EntryCard;
