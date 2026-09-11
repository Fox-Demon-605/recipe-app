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
    return EMPTY_RECIPE;
  }

  return {
    title: recipe.title || "",
    description: recipe.description || "",
    image: recipe.image || "",
    cookTime: recipe.cookTime || "",
    cookTimeMinutes: String(recipe.cookTimeMinutes || ""),
    category: recipe.category || "",
    emoji: recipe.emoji || "🍽",
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join("")
      : "",
    instructions: recipe.instructions || "",
  };
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

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
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

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Введите название рецепта.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Введите краткое описание рецепта.";
    }

    if (!formData.category.trim()) {
      nextErrors.category = "Выберите или введите категорию.";
    }

    if (!formData.cookTime.trim()) {
      nextErrors.cookTime = "Введите время приготовления, например: 30 мин.";
    }

    const parsedCookTime = Number(formData.cookTimeMinutes);

    if (
      !formData.cookTimeMinutes.trim() ||
      Number.isNaN(parsedCookTime) ||
      parsedCookTime <= 0
    ) {
      nextErrors.cookTimeMinutes =
        "Введите длительность приготовления в минутах больше 0.";
    }

    if (!formData.instructions.trim()) {
      nextErrors.instructions = "Добавьте способ приготовления.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const preparedRecipe = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      cookTime: formData.cookTime.trim(),
      cookTimeMinutes: Number(formData.cookTimeMinutes),
      category: formData.category.trim(),
      emoji: formData.emoji.trim() || "🍽",
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
              Заполните основные данные рецепта.
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

        <form className="recipe-form" onSubmit={handleSubmit}>
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
                aria-describedby={errors.title ? "recipe-title-error" : undefined}
              />

              {errors.title && (
                <span id="recipe-title-error" className="recipe-form__error">
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
              />

              <datalist id="recipe-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

              {errors.category && (
                <span className="recipe-form__error">{errors.category}</span>
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
              <span className="recipe-form__label">Время текстом *</span>

              <input
                type="text"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                placeholder="Например: 45 мин"
                aria-invalid={Boolean(errors.cookTime)}
              />

              {errors.cookTime && (
                <span className="recipe-form__error">{errors.cookTime}</span>
              )}
            </label>

            <label className="recipe-form__field">
              <span className="recipe-form__label">Минуты для сортировки *</span>

              <input
                type="number"
                name="cookTimeMinutes"
                value={formData.cookTimeMinutes}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="45"
                aria-invalid={Boolean(errors.cookTimeMinutes)}
              />

              {errors.cookTimeMinutes && (
                <span className="recipe-form__error">
                  {errors.cookTimeMinutes}
                </span>
              )}
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
              <span className="recipe-form__label">Краткое описание *</span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Кратко опишите блюдо..."
                aria-invalid={Boolean(errors.description)}
              />

              {errors.description && (
                <span className="recipe-form__error">
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
                Способ приготовления *
              </span>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="7"
                placeholder="Опишите этапы приготовления..."
                aria-invalid={Boolean(errors.instructions)}
              />

              {errors.instructions && (
                <span className="recipe-form__error">
                  {errors.instructions}
                </span>
              )}
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

            <button type="submit" className="recipe-form__submit-btn">
              {isEditing ? "Сохранить изменения" : "Добавить рецепт"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default RecipeFormModal;