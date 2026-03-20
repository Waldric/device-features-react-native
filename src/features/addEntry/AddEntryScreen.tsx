import React, { useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useCamera } from "../../hooks/useCamera";
import { useEntries } from "../../hooks/useEntries";
import { useTheme } from "../../hooks/useTheme";

type AddEntryNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddEntry"
>;

const { width } = Dimensions.get("window");

const AddEntryScreen: React.FC = () => {
  const navigation = useNavigation<AddEntryNavProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    imageUri,
    address,
    isFetchingLocation,
    isSaving,
    handleTakePhoto,
    handleSave,
    resetForm,
  } = useCamera();

  const { handleAddEntry } = useEntries();

  // hide the title since we render our own large title below
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "", // Hide native title
      headerStyle: { backgroundColor: theme.colors.background },
      headerShadowVisible: false, // Remove bottom border line
      headerTintColor: theme.colors.text,
    });
  }, [navigation, theme]);

  // Reset form when user navigates away without saving
  useFocusEffect(
    useCallback(() => {
      return () => resetForm();
    }, [resetForm]),
  );

  const onPressSave = () => {
    if (!imageUri) {
      Alert.alert("No Photo", "Please take a photo before saving.");
      return;
    }
    if (isFetchingLocation) {
      Alert.alert(
        "Please Wait",
        "Still fetching your location. Try again in a moment.",
      );
      return;
    }

    Alert.alert(
      "Save this entry?",
      "Photo and location will be saved to your travel diary. Tap Cancel to retake.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          style: "default",
          onPress: async () => {
            const success = await handleSave(handleAddEntry);
            if (success) navigation.goBack();
          },
        },
      ],
    );
  };

  const isSaveDisabled = !imageUri || isFetchingLocation || isSaving;

  // Glassy card surface
  const glassCard = {
    backgroundColor: theme.dark
      ? "rgba(40, 40, 45, 0.85)"
      : "rgba(255, 255, 255, 0.85)",
    borderColor: theme.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/*Large title*/}
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
          New Travel Entry
        </Text>

        {/*Photo card */}
        <Pressable
          style={[
            styles.photoCard,
            glassCard,
            {
              shadowColor: theme.dark ? "#000" : "#94a3b8",
              opacity: isFetchingLocation ? 0.6 : 1,
            },
          ]}
          onPress={handleTakePhoto}
          disabled={isSaving || isFetchingLocation}
          accessibilityLabel="Tap to take a photo"
          accessibilityRole="button"
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons
                name="camera-outline"
                size={44}
                color={theme.colors.subText}
              />
              <Text
                style={[
                  styles.placeholderText,
                  { color: theme.colors.subText },
                ]}
              >
                Tap to take a photo
              </Text>
            </View>
          )}
        </Pressable>

        {/*Retake link*/}
        {imageUri && (
          <Pressable
            onPress={handleTakePhoto}
            disabled={isSaving || isFetchingLocation}
            style={[
              styles.retakeBtn,
              { opacity: isFetchingLocation ? 0.4 : 1 }, 
            ]}
            accessibilityLabel="Retake photo"
            accessibilityRole="button"
          >
            <Text style={[styles.retakeText, { color: theme.colors.primary }]}>
              Retake Photo
            </Text>
          </Pressable>
        )}

        {/*Address card */}
        <View style={[styles.addressCard, glassCard]}>
          {isFetchingLocation ? (
            <View style={styles.addressRow}>
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text
                style={[styles.addressText, { color: theme.colors.subText }]}
              >
                Fetching your location…
              </Text>
            </View>
          ) : (
            <View style={styles.addressRow}>
              <Ionicons
                name="location"
                size={16}
                color={address ? "#E53935" : theme.colors.subText}
                style={{ marginRight: 8, marginTop: 1 }}
              />
              <Text
                style={[
                  styles.addressText,
                  { color: address ? theme.colors.text : theme.colors.subText },
                ]}
              >
                {address || "Address will appear here after taking a photo"}
              </Text>
            </View>
          )}
        </View>

        {/*Save Entry button*/}
        <Pressable
          style={[
            styles.saveBtn,
            {
              backgroundColor: isSaveDisabled
                ? theme.colors.border
                : theme.colors.primary,
            },
          ]}
          onPress={onPressSave}
          disabled={isSaveDisabled}
          accessibilityLabel="Save travel entry"
          accessibilityRole="button"
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={[
                styles.saveBtnText,
                { color: isSaveDisabled ? theme.colors.subText : "#FFFFFF" },
              ]}
            >
              Save Entry
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8, 
    gap: 16,
  },

  screenTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  // ── Photo card ──
  photoCard: {
    width: width - 40,
    height: 230,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  placeholderText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },

  // Retake link
  retakeBtn: {
    alignSelf: "center",
    marginTop: -4,
    paddingVertical: 4,
  },
  retakeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },

  // Address card 
  addressCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  // Save button
  saveBtn: {
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  saveBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});

export default AddEntryScreen;
