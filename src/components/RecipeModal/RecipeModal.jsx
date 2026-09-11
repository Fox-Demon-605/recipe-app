import { useEffect } from "react";
import "./RecipeModal.css";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400?text=%D0%9D%D0%B5%D1%82+%D1%84%D0%BE%D1%82%D0%BE";

function RecipeModal({ recipe, isOpen, onClose, onEditRecipe }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !recipe) {
    return null;
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleEditClick() {
    onClose();
    onEditRecipe(recipe);
  }

  return (
    <div
      className="recipe-modal"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="recipe-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
      >
        <button
          type="button"
          className="recipe-modal__close-btn"
          onClick={onClose}
          aria-label="Закрыть окно подробностей"
          autoFocus
        >
          ×
        </button>

        <img
          className="recipe-modal__image"
          src={recipe.image || PLACEHOLDER_IMAGE}
          alt={recipe.title}
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

        <div className="recipe-modal__body">
          <div className="recipe-modal__top">
            {recipe.category && (
              <span className="recipe-modal__category">{recipe.category}</span>
            )}

            <span className="recipe-modal__time">
              ⏱ {recipe.cookTime}
            </span>
          </div>

          <h2 id="recipe-modal-title" className="recipe-modal__title">
            {recipe.emoji ? `${recipe.emoji} ` : ""}
            {recipe.title}
          </h2>

          <p className="recipe-modal__description">{recipe.description}</p>

          <section className="recipe-modal__section">
            <h3 className="recipe-modal__section-title">Ингредиенты</h3>

            {recipe.ingredients?.length ? (
              <ul className="recipe-modal__ingredients">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="recipe-modal__empty-text">
                Ингредиенты пока не добавлены.
              </p>
            )}
          </section>

          <section className="recipe-modal__section">
            <h3 className="recipe-modal__section-title">Способ приготовления</h3>

            <p className="recipe-modal__instructions">
              {recipe.instructions || "Описание приготовления пока не добавлено."}
            </p>
          </section>

          <div className="recipe-modal__actions">
            <button
              type="button"
              className="recipe-modal__edit-btn"
              onClick={handleEditClick}
            >
              Редактировать рецепт
            </button>

            <button
              type="button"
              className="recipe-modal__secondary-btn"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipeModal;