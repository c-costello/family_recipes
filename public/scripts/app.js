console.log('app.js is firing')


//button controls to add additional inputs in the new recipe form
function addIngredients() {
  console.log('addIngredients is firing');
  $(".ingredients-button").before('<input type="text" name="ingredient"/>');
}

function addInstructions() {
  console.log('addInstructions is firing');
  $('.instructions-button').before('<input type="text" name="instructions"/>');
}

//