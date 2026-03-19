// ─────────────────────────────────────────────
// storageService — AsyncStorage abstraction
// Based on professor's AsyncStorage pattern
// All entry CRUD lives here — screens never
// call AsyncStorage directly
// ─────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types';
import { STORAGE_KEY } from '../constants';

/**
 * Load all saved travel entries from AsyncStorage.
 * Returns an empty array if nothing is stored yet.
 */
export const loadEntries = async (): Promise<TravelEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as TravelEntry[];
  } catch (error) {
    // Storage read failure — return safe default so UI never crashes
    console.error('[storageService] Failed to load entries:', error);
    return [];
  }
};

/**
 * Persist an array of entries to AsyncStorage.
 * Overwrites the entire list (single source of truth).
 */
export const saveEntries = async (entries: TravelEntry[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('[storageService] Failed to save entries:', error);
    return false;
  }
};

/**
 * Add a single new entry to the existing list.
 * Prepends so newest entries appear at the top.
 */
export const addEntry = async (entry: TravelEntry): Promise<boolean> => {
  try {
    const existing = await loadEntries();
    const updated = [entry, ...existing];
    return await saveEntries(updated);
  } catch (error) {
    console.error('[storageService] Failed to add entry:', error);
    return false;
  }
};

/**
 * Remove a single entry by its unique ID.
 */
export const removeEntry = async (id: string): Promise<boolean> => {
  try {
    const existing = await loadEntries();
    const filtered = existing.filter(e => e.id !== id);
    return await saveEntries(filtered);
  } catch (error) {
    console.error('[storageService] Failed to remove entry:', error);
    return false;
  }
};