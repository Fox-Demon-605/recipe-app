export function normalizeText(value = "") {
  return String(value).trim().toLocaleLowerCase("ru");
}

export function recipeMatchesSearch(recipe, searchQuery) {
  const normalizedQuery = normalizeText(searchQuery);

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    recipe.title,
    recipe.description,
    recipe.category,
    recipe.cookTime,
    ...(recipe.ingredients || []),
  ]
    .join(" ")
    .toLocaleLowerCase("ru");

  return searchableText.includes(normalizedQuery);
}

export function sortRecipes(recipes, sortValue) {
  const copiedRecipes = [...recipes];

  switch (sortValue) {
    case "title-asc":
      return copiedRecipes.sort((first, second) =>
        first.title.localeCompare(second.title, "ru")
      );

    case "title-desc":
      return copiedRecipes.sort((first, second) =>
        second.title.localeCompare(first.title, "ru")
      );

    case "time-asc":
      return copiedRecipes.sort(
        (first, second) =>
          Number(first.cookTimeMinutes || 0) -
          Number(second.cookTimeMinutes || 0)
      );

    case "time-desc":
      return copiedRecipes.sort(
        (first, second) =>
          Number(second.cookTimeMinutes || 0) -
          Number(first.cookTimeMinutes || 0)
      );

    case "default":
    default:
      return copiedRecipes;
  }
}