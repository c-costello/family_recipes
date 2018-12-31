'use strict';


//set enviromental variables
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const methodOverride= require('method-override');
const app = express();

app.use(cors());

//set PORT
const PORT = process.env.PORT || 4000;

//set static root
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//set up method override
app.use(
    methodOverride((req, res) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
);

//set dontenv 
require('dotenv').config();

//ser up client 
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();


//Listening
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
//function calls
app.get('/', getHomePage);
app.get('/new', getNewRecipe);
app.post('/new', saveNewRecipe);
app.get('/allrecipes', getSavedRecipes);
app.get(`/recipe/:id`, getRecipeDetails);

//index functions
function getHomePage(req, res){
  res.render('pages/index.ejs');
}



//new recipe functions
//render the form to save a new recipe
function getNewRecipe(req, res){
  res.render('pages/recipes/new.ejs')
}
//saves the new recipe when submit button is selected 
function saveNewRecipe(req, res){
  let { title, description, created_by, source } = req.body;
  let SQL = `INSERT INTO recipes (title, description, created_by, source) VALUES($1,$2,$3,$4) RETURNING id;`;
  let values = [title, description, created_by, source];
  return client
    .query(SQL, values)
    .then(results => {
      saveInstructions(req, res, results.rows)
      saveIngredients(req, res, results.rows) 
    })
    .then(res.redirect('/allrecipes'))
}


function saveIngredients(x, y, id) {
  let ingredientsArr = x.body.ingredient;
  var newIngredientsArr = [];
  console.log(ingredientsArr);
  for (let i = 0; i < ingredientsArr.length; i ++){
    let a = new Ingredients(ingredientsArr, i);
    newIngredientsArr.push(a);
  }
  console.log('id', id[0].id);
  newIngredientsArr.forEach(ingredient => {
    let SQLIng = `INSERT INTO ingredients (ingredient_number, ingredients, recipe_id) VALUES($1,$2,$3) RETURNING id;`;
    let valuesIng = [ingredient.ingredientNumber, ingredient.ing, id[0].id]
    return client.query(SQLIng, valuesIng)
  })
  console.log('testing')
}

function saveInstructions(x, y, id) {
  let instructionsArr = x.body.instructions
  var newInstructionsArr = [];
  for (let i = 0; i < instructionsArr.length; i ++){
    let a = new Instructions(instructionsArr, i);
    newInstructionsArr.push(a);
  }
  console.log('id', id[0].id);
  newInstructionsArr.forEach(instruction => {
    let SQLIng = `INSERT INTO instructions (step_number, instruction, recipe_id) VALUES($1,$2,$3) RETURNING id;`;
    let valuesIng = [instruction.instructionNumber, instruction.instructions, id[0].id]
    return client.query(SQLIng, valuesIng)
  })
  console.log('testing')
}

//generate list of all recipes
function getSavedRecipes(req, res,){
  let SQL = `SELECT * FROM recipes`;
  return client
  .query(SQL)
  .then( results => {
      res.render('../views/pages/recipes/savedrecipes.ejs', { savedRecipes: results.rows})
  })
}

//detailed view of recipes
function getRecipeDetails(req, res){
  let SQL = `SELECT * FROM recipes INNER JOIN ingredients ON recipes.id = ingredients.recipe_id WHERE recipes.id = $1`
  let SQLinst = `SELECT * FROM instructions WHERE recipe_id = $1`
  let values = [req.params.id];
  client.query(SQLinst, values)
    .then ( result => {
      console.log('result', result.rows)
      client.query(SQL, values)
        .then (results => {
          console.log('results', results.rows);
          res.render('../views/pages/recipes/recipe.ejs', {details : results.rows , instructions : result.rows})
        })
    })
}

//Constructor functions
function Ingredients(data, counter) {
  this.ingredientNumber = counter + 1;
  this.ing = data[counter];
}

function Instructions(data, counter) {
  this.instructionNumber = counter + 1;
  this.instructions = data[counter];
}




