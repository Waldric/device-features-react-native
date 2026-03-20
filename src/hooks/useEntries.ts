import { useState, useCallback } from 'react';
import { TravelEntry } from '../types';
import {
  loadEntries,
  addEntry,
  removeEntry,
} from '../services/storageService';

interface UseEntriesReturn {
  entries:           TravelEntry[];
  isLoading:         boolean;
  error:             string | null;
  reload:            () => Promise<void>;
  handleAddEntry:    (entry: TravelEntry) => Promise<boolean>;
  handleRemoveEntry: (id: string) => Promise<void>;
}

export const useEntries = (): UseEntriesReturn => {
  const [entries,   setEntries]   = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  /**
   * Load entries from AsyncStorage into local state.
   * Called on screen focus rather than once on mount
   * so HomeScreen always reflects latest saved data.
   */
  const reload = useCallback(async () => {
    setIsLoading(true);
    const stored = await loadEntries();
    setEntries(stored);
    setIsLoading(false);
  }, []);

  /**
   * Save a new entry and prepend it to local state.
   * Returns false so the caller can surface an error.
   */
  const handleAddEntry = useCallback(
    async (entry: TravelEntry): Promise<boolean> => {
      const success = await addEntry(entry);
      if (success) {
        setEntries(prev => [entry, ...prev]);
      } else {
        setError('Failed to save entry. Please try again.');
      }
      return success;
    },
    [],
  );


  //Delete entry by ID from storage and local state.

  const handleRemoveEntry = useCallback(async (id: string): Promise<void> => {
    const success = await removeEntry(id);
    if (success) {
      setEntries(prev => prev.filter(e => e.id !== id));
    } else {
      setError('Failed to delete entry. Please try again.');
    }
  }, []);

  return {
    entries,
    isLoading,
    error,
    reload,
    handleAddEntry,
    handleRemoveEntry,
  };
};
