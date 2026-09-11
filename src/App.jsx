import { useCallback, useMemo, useState } from "react";
import RecipeFormModal from "./components/RecipeFormModal/RecipeFormModal";
import RecipeList from "./components/RecipeList/RecipeList";
import RecipeModal from "./components/RecipeModal/RecipeModal";
import RecipeToolbar from "./components/RecipeToolbar/RecipeToolbar";
import { useFavorites } from "./hooks/useFavorites";
import { useModal } from "./hooks/useModal";
import { useRecipes } from "./hooks/useRecipes";
import { recipeMatchesSearch, sortRecipes } from "./utils/recipeUtils";
import "./App.css";

function App() {
  const { recipes, categories, addRecipe, updateRecipe, deleteRecipe } =
    useRecipes();

  const {
    favoriteIdSet,
    favoriteCount,
    toggleFavorite,
    clearFavorites,
  } = useFavorites();

  const detailsModal = useModal();
  const formModal = useModal();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editedRecipe, setEditedRecipe] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortValue, setSortValue] = useState("default");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const displayedRecipes = useMemo(() => {
    const filteredRecipes = recipes.filter((recipe) => {
      const matchesSearch = recipeMatchesSearch(recipe, searchQuery);

      const matchesCategory =
        selectedCategory === "all" || recipe.category === selectedCategory;

      const matchesFavorite =
        !showOnlyFavorites || favoriteIdSet.has(recipe.id);

      return matchesSearch && matchesCategory && matchesFavorite;
    });

    return sortRecipes(filteredRecipes, sortValue);
  }, [
    recipes,
    searchQuery,
    selectedCategory,
    showOnlyFavorites,
    favoriteIdSet,
    sortValue,
  ]);

  const handleOpenDetails = useCallback(
    (recipe) => {
      setSelectedRecipe(recipe);
      detailsModal.openModal();
    },
    [detailsModal]
  );

  const handleCloseDetails = useCallback(() => {
    detailsModal.closeModal();
    setSelectedRecipe(null);
  }, [detailsModal]);

  const handleOpenCreateForm = useCallback(() => {
    setEditedRecipe(null);
    formModal.openModal();
  }, [formModal]);

  const handleOpenEditForm = useCallback(
    (recipe) => {
      setEditedRecipe(recipe);
      formModal.openModal();
    },
    [formModal]
  );

  const handleCloseForm = useCallback(() => {
    formModal.closeModal();
    setEditedRecipe(null);
  }, [formModal]);

  const handleToggleFavoritesFilter = useCallback(() => {
    setShowOnlyFavorites((currentValue) => !currentValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortValue("default");
    setShowOnlyFavorites(false);
  }, []);

  const handleDeleteRecipe = useCallback(
    (recipeId) => {
      deleteRecipe(recipeId);

      if (selectedRecipe?.id === recipeId) {
        handleCloseDetails();
      }
    },
    [deleteRecipe, handleCloseDetails, selectedRecipe]
  );

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__title-block">
          <h1 className="app__title">🍽 Книга рецептов</h1>

          <p className="app__subtitle" aria-live="polite">
            Всего рецептов: <strong>{recipes.length}</strong>
            {" · "}
            Показано: <strong>{displayedRecipes.length}</strong>
            {favoriteCount > 0 && (
              <>
                {" · "}
                Избранное: <strong>{favoriteCount}</strong>
              </>
            )}
          </p>
        </div>

        <div className="app__header-actions">
          <button
            type="button"
            className="app__add-btn"
            onClick={handleOpenCreateForm}
          >
            + Добавить рецепт
          </button>

          <button
            type="button"
            className={
              "app__favorite-filter-btn" +
              (showOnlyFavorites ? " app__favorite-filter-btn--active" : "")
            }
            onClick={handleToggleFavoritesFilter}
            aria-pressed={showOnlyFavorites}
          >
            {showOnlyFavorites
              ? "Показать все"
              : `★ Избранное${favoriteCount ? ` (${favoriteCount})` : ""}`}
          </button>

          {favoriteCount > 0 && (
            <button
              type="button"
              className="app__clear-btn"
              onClick={clearFavorites}
            >
              Очистить избранное
            </button>
          )}
        </div>
      </header>

      <main>
        <RecipeToolbar
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sortValue={sortValue}
          categories={categories}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortValue}
          onResetFilters={handleResetFilters}
        />

        <RecipeList
          recipes={displayedRecipes}
          favoriteIdSet={favoriteIdSet}
          onToggleFavorite={toggleFavorite}
          onOpenDetails={handleOpenDetails}
          onEditRecipe={handleOpenEditForm}
          onDeleteRecipe={handleDeleteRecipe}
          emptyTitle={
            showOnlyFavorites
              ? "В избранном пока ничего нет"
              : "Рецепты не найдены"
          }
          emptyDescription={
            showOnlyFavorites
              ? "Добавьте рецепт в избранное, нажав на звёздочку в карточке."
              : "Попробуйте изменить поисковый запрос, фильтр или сортировку."
          }
        />
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={detailsModal.isOpen}
        onClose={handleCloseDetails}
        onEditRecipe={handleOpenEditForm}
      />

      <RecipeFormModal
        isOpen={formModal.isOpen}
        recipe={editedRecipe}
        categories={categories}
        onClose={handleCloseForm}
        onAddRecipe={addRecipe}
        onUpdateRecipe={updateRecipe}
      />
    </div>
  );
}

export default App;