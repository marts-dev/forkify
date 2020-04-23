export const elements = {
  searchSubmit: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultDiv: document.querySelector(".results"),
  searchResultList: document.querySelector(".results__list"),
  searchResultPages: document.querySelector(".results__pages"),
  recipeDiv: document.querySelector(".recipe"),
  shoppingList: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
};

const elementStrings = {
  loader: "loader",
};

export const renderLoader = (parent) => {
  //Parent is the element the loader will attach to
  const loader = `
    <div class="${elementStrings.loader}">
    <svg>
        <use href="/img/icons.svg#icon-cw">
    </svg>
    </div>
    `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};

export const limitRecipeTitle = (title, limit = 17) => {
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
