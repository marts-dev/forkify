// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
/* Global state of the App
- Search object
- Current recipe object
- Shopping 
*/
const state = {};

const controlSearch = async () => {
  //1 Get query from view
  const query = searchView.getInput();

  if (query) {
    //2 New Search object and add to state
    state.search = new Search(query);
    //3 Prepare UI for results
    recipeView.clearResults();
    searchView.clearResults();
    searchView.clearInput();
    renderLoader(elements.searchResultDiv);
    //4 Get Search for recipes
    try {
      await state.search.getResults(query);

      //5 Render results to UI
      clearLoader();
      console.log(state.search.recipes);
      searchView.renderOutput(state.search.recipes);
    } catch (error) {
      clearLoader();
      alert(`Error processing your search: ${error}`);
    }
  }
};

//Search controller
elements.searchSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener("click", (e) => {
  const button = e.target.closest(".btn-inline");
  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderOutput(state.search.recipes, goToPage);
    console.log(goToPage);
  }
});

//Recipe Controller
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    //Prepare UI
    recipeView.clearResults();
    renderLoader(elements.recipeDiv);
    //Highlight selected
    if (state.search) searchView.highlightSelected(id);
    //Create new Recipe object
    state.recipe = new Recipe(id);
    try {
      //Get recipe data
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredients);
      //Calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      //console.log(state.recipe.ingredients);
      //Render Recipe
      clearLoader();
      recipeView.renderRecipePage(state.recipe);
    } catch (error) {
      alert(`Error processing your request: ${error}`);
    }
  }
};

//window.addEventListener("hashchange", controlRecipe);
//window.addEventListener('load', controlRecipe);

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
