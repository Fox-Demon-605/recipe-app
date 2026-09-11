import { useCallback, useEffect, useMemo, useState } from "react";
import initialRecipes from "../data/recipes";

const STORAGE_KEY = "recipe-app:recipes";

function readStoredRecipes() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function createRecipeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState(() => {
    return readStoredRecipes() || initialRecipes;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch {
      // Сохранение не удалось — приложение продолжит работать в памяти.
    }
  }, [recipes]);

  const addRecipe = useCallback((recipeData) => {
    const newRecipe = {
      ...recipeData,
      id: createRecipeId(),
    };

    setRecipes((currentRecipes) => [newRecipe, ...currentRecipes]);
  }, []);

  const updateRecipe = useCallback((updatedRecipe) => {
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  }, []);

  const deleteRecipe = useCallback((recipeId) => {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.id !== recipeId)
    );
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      recipes
        .map((recipe) => recipe.category)
        .filter((category) => Boolean(category))
    );

    return [...uniqueCategories].sort((first, second) =>
      first.localeCompare(second, "ru")
    );
  }, [recipes]);

  return {
    recipes,
    categories,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
}