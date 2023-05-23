function displaySearch() {
  // Sélectionnez l'élément de l'image et l'élément de saisie
  let image = document.getElementById("myImage");
  let input = document.getElementById("myInput");
  let clicked = false;
  // Ajoutez un gestionnaire d'événement de clic à l'image
  image.addEventListener("click", function () {
    if (!clicked) {
      // Ajoutez la classe "clicked" à l'élément de saisie
      input.classList.add("clicked");
      clicked = true;
    } else {
      if (input.classList.contains("clicked")) {
        // Retirez la classe "clicked" de l'élément de saisie
        input.classList.remove("clicked");
        clicked = false;
      }
    }
  });
}

displaySearch();
