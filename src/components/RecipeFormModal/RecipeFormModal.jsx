import { useEffect, useMemo, useState } from "react";
import "./RecipeFormModal.css";

const EMPTY_RECIPE = {
  title: "",
  description: "",
  image: "",
  cookTime: "",
  cookTimeMinutes: "",
  category: "",
  emoji: "🍽",
  ingredients: "",
  instructions: "",
};

function convertRecipeToFormData(recipe) {
  if (!recipe) {
    return { ...EMPTY_RECIPE };
  }

  return {
    title: recipe.title || "",
    description: recipe.description || "",
    image: recipe.image || "",
    cookTime: recipe.cookTime || "",
    cookTimeMinutes: String(recipe.cookTimeMinutes || ""),
    category: recipe.category || "",
    emoji: recipe.emoji || "🍽",

    // Каждая строка textarea — отдельный ингредиент.
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join("")
      : "",

    instructions: recipe.instructions || "",
  };
}

// Валидация именно по требованиям задания.
function validateFormData(formData) {
  const nextErrors = {};

  if (!formData.title.trim()) {
    nextErrors.title = "Название обязательно";
  }

  if (!formData.description.trim()) {
    nextErrors.description = "Описание обязательно";
  }

  if (!formData.category.trim()) {
    nextErrors.category = "Категория обязательна";
  }

  return nextErrors;
}

function RecipeFormModal({
  isOpen,
  recipe,
  categories,
  onClose,
  onAddRecipe,
  onUpdateRecipe,
}) {
  const isEditing = Boolean(recipe);

  const initialFormData = useMemo(() => {
    return convertRecipeToFormData(recipe);
  }, [recipe]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Пока заполнены не все обязательные поля,
  // в объекте errors есть хотя бы одна ошибка.
  const hasValidationErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);

      // Сразу после открытия формы вычисляем ошибки.
      // Поэтому кнопка отправки неактивна, если обязательные поля пусты.
      setErrors(validateFormData(initialFormData));
    }
  }, [isOpen, initialFormData]);

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

  if (!isOpen) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);

    /*
      Ошибки пересчитываются при каждом изменении поля.

      Например:
      - пользователь вводит название;
      - title становится непустым;
      - ошибка «Название обязательно» сразу исчезает;
      - когда заполнены название, описание и категория,
        кнопка отправки автоматически становится активной.
    */
    setErrors(validateFormData(nextFormData));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateFormData(formData);

    setErrors(validationErrors);

    // Нельзя отправить форму, если есть хотя бы одна ошибка.
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const preparedRecipe = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      cookTime: formData.cookTime.trim(),
      cookTimeMinutes: Number(formData.cookTimeMinutes) || 0,
      category: formData.category.trim(),
      emoji: formData.emoji.trim() || "🍽",

      // Делим textarea по строкам, а пустые строки игнорируем.
      ingredients: formData.ingredients
        .split("")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),

      instructions: formData.instructions.trim(),
    };

    if (isEditing) {
      onUpdateRecipe({
        ...recipe,
        ...preparedRecipe,
      });
    } else {
      onAddRecipe(preparedRecipe);
    }

    onClose();
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="recipe-form-modal"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="recipe-form-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-form-modal-title"
      >
        <div className="recipe-form-modal__header">
          <div>
            <h2
              id="recipe-form-modal-title"
              className="recipe-form-modal__title"
            >
              {isEditing ? "Редактирование рецепта" : "Новый рецепт"}
            </h2>

            <p className="recipe-form-modal__subtitle">
              Поля со звёздочкой обязательны для заполнения.
            </p>
          </div>

          <button
            type="button"
            className="recipe-form-modal__close-btn"
            onClick={onClose}
            aria-label="Закрыть форму"
          >
            ×
          </button>
        </div>

        <form className="recipe-form" onSubmit={handleSubmit} noValidate>
          <div className="recipe-form__grid">
            <label className="recipe-form__field recipe-form__field--full">
              <span className="recipe-form__label">Название *</span>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Домашняя пицца"
                autoFocus
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "recipe-title-error" : undefined
                }
              />

              {errors.title && (
                <span
                  id="recipe-title-error"
                  className="recipe-form__error"
                  role="alert"
                >
                  {errors.title}
                </span>
              )}
            </label>

            <label className="recipe-form__field">
              <span className="recipe-form__label">Категория *</span>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                list="recipe-categories"
                placeholder="Например: Десерты"
                aria-invalid={Boolean(errors.category)}
                aria-describedby={
                  errors.category ? "recipe-category-error" : undefined
                }
              />

              <datalist id="recipe-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

              {errors.category && (
                <span
                  id="recipe-category-error"
                  className="recipe-form__error"
                  role="alert"
                >
                  {errors.category}
                </span>
              )}
            </label>

            <label className="recipe-form__field">
              <span className="recipe-form__label">Эмодзи</span>

              <input
                type="text"
                name="emoji"
                value={formData.emoji}
                onChange={handleChange}
                maxLength="4"
                placeholder="🍽"
              />
            </label>

            <label className="recipe-form__field">
              <span className="recipe-form__label">Время текстом</span>

              <input
                type="text"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                placeholder="Например: 45 мин"
              />
            </label>

            <label className="recipe-form__field">
              <span className="recipe-form__label">
                Минуты для сортировки
              </span>

              <input
                type="number"
                name="cookTimeMinutes"
                value={formData.cookTimeMinutes}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="45"
              />
            </label>

            <label className="recipe-form__field recipe-form__field--full">
              <span className="recipe-form__label">Ссылка на изображение</span>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              <span className="recipe-form__hint">
                Поле необязательное: если оставить пустым, будет использована
                заглушка.
              </span>
            </label>

            <label className="recipe-form__field recipe-form__field--full">
              <span className="recipe-form__label">Описание *</span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Кратко опишите блюдо..."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "recipe-description-error" : undefined
                }
              />

              {errors.description && (
                <span
                  id="recipe-description-error"
                  className="recipe-form__error"
                  role="alert"
                >
                  {errors.description}
                </span>
              )}
            </label>

            <label className="recipe-form__field recipe-form__field--full">
              <span className="recipe-form__label">
                Ингредиенты — по одному на строку
              </span>

              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="6"
                placeholder={"Мука — 300 г Яйца — 2 шт. Молоко — 250 мл"}
              />
            </label>

            <label className="recipe-form__field recipe-form__field--full">
              <span className="recipe-form__label">
                Способ приготовления
              </span>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="7"
                placeholder="Опишите этапы приготовления..."
              />
            </label>
          </div>

          <div className="recipe-form__actions">
            <button
              type="button"
              className="recipe-form__cancel-btn"
              onClick={onClose}
            >
              Отмена
            </button>

            <button
              type="submit"
              className="recipe-form__submit-btn"
              disabled={hasValidationErrors}
              title={
                hasValidationErrors
                  ? "Заполните название, описание и категорию."
                  : undefined
              }
            >
              {isEditing ? "Сохранить изменения" : "Добавить рецепт"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default RecipeFormModal;