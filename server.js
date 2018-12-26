'use strict';


//set enviromental variables
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const methodOverride= require('method-override');
const app = express();

app.use(cors());

//set PORT
const PORT = process.env.PORT || 3000;

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
