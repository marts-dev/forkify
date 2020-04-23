import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      this.image_url = res.data.recipe.image_url;
      this.result = res.data.recipe;
    } catch (error) {
      console.log(error);
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
      "pound",
      "kilograms",
      "gram",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "lbs",
      "lb",
      "kg",
      "g",
    ];
    const newIngredients = this.ingredients
      .filter((el) => {
        let ingredient = el.toLowerCase().trim();

        //Remove parenthesis
        ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
        return ingredient !== " ";
      })
      .map((el) => {
        //Uniform units
        let ingredient = el;
        unitsLong.forEach((elem, it) => {
          ingredient = ingredient.replace(elem, unitsShort[it]);
        });

        //Remove parenthesis
        ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
        //Parse ingredients into count, unit and ingrdient
        const arrIng = ingredient.split(" ");
        const unitIndex = arrIng.findIndex((el2) => unitsShort.includes(el2));

        let objIng;
        if (unitIndex > -1) {
          //There is a unit
          const arrCount = arrIng.slice(0, unitIndex);
          let count;
          if (arrCount.length === 1) {
            //Only single count
            count = eval(arrCount[0].replace("-", "+"));
          } else {
            //Has fraction
            count = eval(arrCount.join("+"));
          }
          objIng = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(" "),
          };
        } else if (parseInt(arrIng[0], 10)) {
          //There is no unit but there is number
          objIng = {
            count: parseInt(arrIng[0], 10),
            unit: "",
            ingredient: arrIng.slice(1).join(" "),
          };
        } else if (unitIndex === -1) {
          //There is no unit and number
          objIng = {
            count: 1,
            unit: "",
            ingredient,
          };
        }
        return objIng;
      });
    this.ingredients = newIngredients;
  }

  updateServing(type) {
    //Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    //Ingredients
    if (newServings >= 1) {
      this.ingredients.forEach((ing) => {
        ing.count *= newServings / this.servings;
      });

      this.servings = newServings;
    }
  }
}
