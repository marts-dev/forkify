import { elements } from "./base";

export const getInput = () => elements.searchInput.value; //has implicit return

export const clearInput = () => {
  elements.searchInput.value = ""; //no default return
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
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

export const renderOutput = (recipes) => {
  recipes.forEach((element) => {
    renderRecipe(element);
  });
  //or
  /* recipes.array.forEach(renderRecipe); */
};
