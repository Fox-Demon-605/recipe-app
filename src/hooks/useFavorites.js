import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "recipe-app:favorites";

function readStoredFavorites() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (id) => typeof id === "number" || typeof id === "string"
    );
  } catch {
    return [];
  }
}

export function useFavorites(initialIds = []) {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const storedFavorites = readStoredFavorites();

    return storedFavorites.length > 0 ? storedFavorites : initialIds;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Например, localStorage недоступен или переполнен.
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((recipeId) => {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(recipeId)) {
        return currentIds.filter((id) => id !== recipeId);
      }

      return [...currentIds, recipeId];
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
  }, []);

  const favoriteIdSet = useMemo(() => {
    return new Set(favoriteIds);
  }, [favoriteIds]);

  return {
    favoriteIds,
    favoriteIdSet,
    favoriteCount: favoriteIds.length,
    toggleFavorite,
    clearFavorites,
  };
}