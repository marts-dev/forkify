export const elements = {
  searchSubmit: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultDiv: document.querySelector(".results"),
  searchResultList: document.querySelector(".results__list"),
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
