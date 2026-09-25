import { memo, useCallback, useState } from "react";
import HighlightedText from "../HighlightedText/HighlightedText";
import "./RecipeCard.css";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400?text=%D0%9D%D0%B5%D1%82+%D1%84%D0%BE%D1%82%D0%BE";

function RecipeCard({
  recipe,
  isFavorite,
  searchQuery = "",
  onToggleFavorite,
  onOpenDetails,
  onEditRecipe,
  onDeleteRecipe,
}) {
  const [imageError, setImageError] = useState(false);

  const imageSource =
    imageError || !recipe.image ? PLACEHOLDER_IMAGE : recipe.image;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleFavoriteClick = useCallback(
    (event) => {
      event.stopPropagation();
      onToggleFavorite(recipe.id);
    },
    [onToggleFavorite, recipe.id]
  );

  const handleOpenDetails = useCallback(() => {
    onOpenDetails(recipe);
  }, [onOpenDetails, recipe]);

  const handleEditClick = useCallback(
    (event) => {
      event.stopPropagation();
      onEditRecipe(recipe);
    },
    [onEditRecipe, recipe]
  );

  const handleDeleteClick = useCallback(
    (event) => {
      event.stopPropagation();

      const isConfirmed = window.confirm(
        `Удалить рецепт «${recipe.title}»? Это действие нельзя отменить.`
      );

      if (isConfirmed) {
        onDeleteRecipe(recipe.id);
      }
    },
    [onDeleteRecipe, recipe.id, recipe.title]
  );

  return (
    <article
      className={`recipe-card${isFavorite ? " recipe-card--favorite" : ""}`}
      aria-label={`Рецепт: ${recipe.title}`}
    >
      <div className="recipe-card__image-wrapper">
        <img
          className="recipe-card__image"
          src={imageSource}
          alt={recipe.title}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />

        {recipe.emoji && (
          <span className="recipe-card__emoji" aria-hidden="true">
            {recipe.emoji}
          </span>
        )}

        <button
          type="button"
          className={
            "recipe-card__favorite-btn" +
            (isFavorite ? " recipe-card__favorite-btn--active" : "")
          }
          onClick={handleFavoriteClick}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Удалить «${recipe.title}» из избранного`
              : `Добавить «${recipe.title}» в избранное`
          }
          title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <span className="recipe-card__star" aria-hidden="true">
            {isFavorite ? "★" : "☆"}
          </span>
        </button>
      </div>

      <div className="recipe-card__body">
        {recipe.category && (
          <span className="recipe-card__category">{recipe.category}</span>
        )}

        <h3 className="recipe-card__title">
          <HighlightedText text={recipe.title} query={searchQuery} />
        </h3>

        <p className="recipe-card__description">{recipe.description}</p>

        <div className="recipe-card__meta">
          <span className="recipe-card__time title=Время приготовления">
            <span aria-hidden="true">⏱</span>
            {" "}
            {recipe.cookTime}
          </span>
        </div>

        <div className="recipe-card__actions">
          <button
            type="button"
            className="recipe-card__details-btn"
            onClick={handleOpenDetails}
          >
            Подробнее
          </button>

          <button
            type="button"
            className="recipe-card__edit-btn"
            onClick={handleEditClick}
            aria-label={`Редактировать рецепт «${recipe.title}»`}
          >
            Редактировать
          </button>

          <button
            type="button"
            className="recipe-card__delete-btn"
            onClick={handleDeleteClick}
            aria-label={`Удалить рецепт «${recipe.title}»`}
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}

function areEqual(previousProps, nextProps) {
  return (
    previousProps.recipe === nextProps.recipe &&
    previousProps.isFavorite === nextProps.isFavorite &&
    previousProps.searchQuery === nextProps.searchQuery &&
    previousProps.onToggleFavorite === nextProps.onToggleFavorite &&
    previousProps.onOpenDetails === nextProps.onOpenDetails &&
    previousProps.onEditRecipe === nextProps.onEditRecipe &&
    previousProps.onDeleteRecipe === nextProps.onDeleteRecipe
  );
}

export default memo(RecipeCard, areEqual);