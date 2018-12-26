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
  console.log('save new recipe is firing');
  console.log(req.body);
  let { title, description, created_by, source } = req.body;
  let SQL = `INSERT INTO recipes (title, description, created_by, source) VALUES($1,$2,$3,$4) RETURNING id;`;
  let values = [title, description, created_by, source];
  client
    .query(SQL, values)
    .then(res.redirect('/new'))
}