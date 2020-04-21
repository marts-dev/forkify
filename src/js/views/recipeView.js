import { elements } from "./base";
import { Fraction } from "fractional";

export const clearResults = () => {
  elements.recipeDiv.innerHTML = "";
};

const formatCount = (count) => {
  if (count) {
    const [int, dec] = count
      .toString()
      .split(".")
      .map((el) => parseInt(el, 10));
    if (!dec) return count;
    if (int === 0) {
      const fr = new Fraction(count.toFixed(1));
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(count.toFixed(1) - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return "";
};

const renderIngredient = (ingredient) => {
  return `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
    `;
};

const renderRecipeIngredients = (ingredients) => {
  const markUp = `
  <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${ingredients.map(renderIngredient).join("")}
        </ul>

        <button class="btn-small recipe__btn">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>
  `;
  elements.recipeDiv.insertAdjacentHTML("beforeend", markUp);
};

const renderRecipeImage = (title, image_url) => {
  const figure = `
    <figure class="recipe__fig">
        <img src="${image_url}" alt="${title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${title}</span>
        </h1>
    </figure>
    `;
  elements.recipeDiv.insertAdjacentHTML("beforeend", figure);
};

const renderRecipeDetail = (time, servings) => {
  const details = `
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart-outlined"></use>
            </svg>
        </button>
    </div>
      `;
  elements.recipeDiv.insertAdjacentHTML("beforeend", details);
};

export const renderRecipePage = (recipe) => {
  //Render the image of recipe
  renderRecipeImage(recipe.title, recipe.image_url);
  //Render the details(Prep time, serving and buttons)
  renderRecipeDetail(recipe.time, recipe.servings);
  //Render the ingredients
  renderRecipeIngredients(recipe.ingredients);
  //Render directions
};
