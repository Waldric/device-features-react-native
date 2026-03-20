// ─────────────────────────────────────────────
// storageService — AsyncStorage CRUD abstraction
// Based directly on professor's AsyncStorage pattern
// Screens never call AsyncStorage directly
// ─────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types';
import { STORAGE_KEY } from '../constants';

/**
 * Load all saved entries.
 * Returns empty array on failure so UI never crashes.
 */
export const loadEntries = async (): Promise<TravelEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as TravelEntry[];
  } catch (error) {
    console.error('[storageService] loadEntries failed:', error);
    return [];
  }
};

/**
 * Overwrite the entire entries list in storage.
 * Single source of truth — no partial updates.
 */
export const saveEntries = async (entries: TravelEntry[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('[storageService] saveEntries failed:', error);
    return false;
  }
};

/**
 * Prepend a new entry so newest appears first in the list.
 */
export const addEntry = async (entry: TravelEntry): Promise<boolean> => {
  try {
    const existing = await loadEntries();
    return await saveEntries([entry, ...existing]);
  } catch (error) {
    console.error('[storageService] addEntry failed:', error);
    return false;
  }
};

/**
 * Remove a single entry by its UUID.
 */
export const removeEntry = async (id: string): Promise<boolean> => {
  try {
    const existing = await loadEntries();
    return await saveEntries(existing.filter(e => e.id !== id));
  } catch (error) {
    console.error('[storageService] removeEntry failed:', error);
    return false;
  }
};
