import "./RecipeToolbar.css";

function RecipeToolbar({
  searchQuery,
  selectedCategory,
  sortValue,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
}) {
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    sortValue !== "default";

  return (
    <section className="recipe-toolbar" aria-label="Поиск и фильтрация рецептов">
      <div className="recipe-toolbar__field recipe-toolbar__field--search">
        <label className="recipe-toolbar__label" htmlFor="recipe-search">
          Поиск рецепта
        </label>

        <input
          id="recipe-search"
          className="recipe-toolbar__input"
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Например: паста, суп, курица..."
          autoComplete="off"
        />
      </div>

      <div className="recipe-toolbar__field">
        <label className="recipe-toolbar__label" htmlFor="recipe-category">
          Категория
        </label>

        <select
          id="recipe-category"
          className="recipe-toolbar__select"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">Все категории</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="recipe-toolbar__field">
        <label className="recipe-toolbar__label" htmlFor="recipe-sort">
          Сортировка
        </label>

        <select
          id="recipe-sort"
          className="recipe-toolbar__select"
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="default">По умолчанию</option>
          <option value="title-asc">По названию: А–Я</option>
          <option value="title-desc">По названию: Я–А</option>
          <option value="time-asc">По времени: быстрее</option>
          <option value="time-desc">По времени: дольше</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="recipe-toolbar__reset-btn"
          onClick={onResetFilters}
        >
          Сбросить
        </button>
      )}
    </section>
  );
}

export default RecipeToolbar;