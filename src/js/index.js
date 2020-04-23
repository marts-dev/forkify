// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/ShopList";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/shopListView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
/* Global state of the App
- Search object
- Current recipe object
- Shopping 
*/
const state = {};
window.state = state;
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
      recipeView.renderRecipePage(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert(`Error processing your request: ${error}`);
    }
  }
};

//window.addEventListener("hashchange", controlRecipe);
//window.addEventListener('load', controlRecipe);

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//List Controller
const controlList = () => {
  //Create a new list If there is none yet
  if (!state.list) state.list = new List();

  //Add each ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//Handle delete and update list item events
elements.shoppingList.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //Handle delete button click
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //Delete from state
    state.list.deleteItem(id);
    //Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    //handle count update
    const value = parseFloat(e.target.value, 10);
    state.list.updateCount(id, value);
  }
});

//Like controller
//Temp Test
state.likes = new Likes();
likesView.toggleLikemenu(state.likes.getNumLikes());
const controlLikes = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;
  //Check if recipe is already liked ot not
  if (!state.likes.isLiked(currentId)) {
    //Not yet liked
    //Add like to the state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image_url
    );
    //Toggle like button
    likesView.toggleLikeBtn(true);
    console.log(state.likes);
    //Add like to UI list
    likesView.renderLikesList(newLike);
  } else {
    //liked
    state.likes.deleteLike(currentId);
    likesView.toggleLikeBtn(false);
    console.log(state.likes);
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikemenu(state.likes.getNumLikes());
};

//Handling recipe button click(not yet initially rendered)
elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //Decrease buttin clicked, decrease serving
    state.recipe.updateServing("dec");
    recipeView.updateServingIngredients(state.recipe);
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //Increase buttin clicked, increase serving
    state.recipe.updateServing("inc");
    recipeView.updateServingIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn-add, .recipe__btn-add *")) {
    //Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //Likes controller
    controlLikes();
  }
});

window.l = new List();
