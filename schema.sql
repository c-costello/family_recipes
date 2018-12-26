DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  created_by VARCHAR(255),
  source VARCHAR (255)
);
CREATE TABLE instructions(
  id SERIAL PRIMARY KEY,
  step_number INT,
  instruction TEXT,
  recipe_id INTEGER NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes (id)
);

CREATE TABLE ingredients(
  id SERIAL PRIMARY KEY,
  ingredient_number INT,
  ingredients TEXT,
  recipe_id INTEGER NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes (id)
);

