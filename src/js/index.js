// Global app controller
import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements } from "./views/base";
/* Global state of the App
- Search object
- Current recipe object
- Shopping 
*/
const state = {};

const controlSearch = async () => {
  //1 Get query from view
  const query = searchView.getInput(); //TODO
  console.log(query);
  if (query) {
    //2 New Search object and add to state
    state.search = new Search(query);
    //3 Prepare UI for results
    searchView.clearResults();
    searchView.clearInput();
    //4 Get Search for recipes
    await state.search.getResults(query);

    //5 Render results to UI
    console.log(state.search.recipes);
    searchView.renderOutput(state.search.recipes);
  }
};

elements.searchSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
