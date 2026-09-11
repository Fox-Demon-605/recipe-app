import { memo } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeList.css";

function RecipeList({
  recipes,
  favoriteIdSet,
  onToggleFavorite,
  onOpenDetails,
  onEditRecipe,
  onDeleteRecipe,
  emptyTitle = "Рецепты не найдены",
  emptyDescription = "Попробуйте изменить параметры поиска.",
}) {
  if (recipes.length === 0) {
    return (
      <section className="recipe-list__empty" role="status" aria-live="polite">
        <p className="recipe-list__empty-icon" aria-hidden="true">
          🍽
        </p>

        <h2 className="recipe-list__empty-title">{emptyTitle}</h2>

        <p className="recipe-list__empty-description">{emptyDescription}</p>
      </section>
    );
  }

  return (
    <div className="recipe-list" role="list">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-list__item" role="listitem">
          <RecipeCard
            recipe={recipe}
            isFavorite={favoriteIdSet.has(recipe.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetails={onOpenDetails}
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
          />
        </div>
      ))}
    </div>
  );
}

export default memo(RecipeList);