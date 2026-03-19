// ─────────────────────────────────────────────
// useEntries — manages the travel entries list
// Loads from AsyncStorage on mount, exposes
// add and remove actions with loading/error states
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { TravelEntry } from '../types';
import {
  loadEntries,
  addEntry,
  removeEntry,
} from '../services/storageService';

interface UseEntriesReturn {
  entries: TravelEntry[];
  isLoading: boolean;
  error: string | null;
  handleAddEntry: (entry: TravelEntry) => Promise<boolean>;
  handleRemoveEntry: (id: string) => Promise<void>;
}

export const useEntries = (): UseEntriesReturn => {
  const [entries, setEntries]   = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Load persisted entries on first mount — mirrors professor's useEffect/loadName pattern
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      const stored = await loadEntries();
      setEntries(stored);
      setIsLoading(false);
    };
    fetchEntries();
  }, []);

  /**
   * Add a new entry to storage and update local state.
   * Returns false if storage write fails so the caller can show an error.
   */
  const handleAddEntry = useCallback(async (entry: TravelEntry): Promise<boolean> => {
    const success = await addEntry(entry);
    if (success) {
      // Prepend to keep newest-first order in the list
      setEntries(prev => [entry, ...prev]);
    } else {
      setError('Failed to save entry. Please try again.');
    }
    return success;
  }, []);

  /**
   * Remove an entry by ID from storage and local state.
   */
  const handleRemoveEntry = useCallback(async (id: string): Promise<void> => {
    const success = await removeEntry(id);
    if (success) {
      setEntries(prev => prev.filter(e => e.id !== id));
    } else {
      setError('Failed to delete entry. Please try again.');
    }
  }, []);

  return { entries, isLoading, error, handleAddEntry, handleRemoveEntry };
};