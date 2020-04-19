import { elements } from "./base";

export const getInput = () => elements.searchInput.value; //has implicit return

export const clearInput = () => {
  elements.searchInput.value = ""; //no default return
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResultPages.innerHTML = "";
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link results__link--active" href="#${
          recipe.recipe_id
        }">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(
                  recipe.title,
                  20
                )}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

//type can either be 'prev' or 'next'
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto="${
  type === "next" ? page + 1 : page - 1
}">
    <span>Page ${type === "next" ? page + 1 : page - 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "next" ? "right" : "left"
        }"></use>
    </svg>
</button>`;

const renderButtons = (page, numResults, itemPerPage) => {
  const pages = Math.ceil(numResults / itemPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // at first page show only next button
    button = createButton(page, "next");
  } else if (page < pages) {
    // show both buttons
    button = `${createButton(page, "next")} ${createButton(page, "prev")}`;
  } else if (page === pages && pages > 1) {
    //at last page show only back button
    button = createButton(page, "prev");
  }
  elements.searchResultPages.insertAdjacentHTML("afterbegin", button);
};

export const renderOutput = (recipes, page = 1, itemPerPage = 10) => {
  //render results to page
  const start = (page - 1) * itemPerPage;
  const end = start + itemPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  //render pagination button
  renderButtons(page, recipes.length, itemPerPage);
  //or
  /* 
  recipes.forEach((element) => {
    renderRecipe(element);
  });
  recipes.array.forEach(renderRecipe); */
};
