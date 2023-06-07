export { runMenu };

let visited = false;
let categoryBtn = document.querySelector(".nav__menu--category");
let categoriesMenu = document.querySelectorAll(".nav__menu--hide");

/**
 * display or hide categories menu
 */
function runMenu() {
  categoryBtn.addEventListener("click", function () {
    if (!visited) {
      categoriesMenu.forEach(function (element) {
        element.style.opacity = "1";
      });
      visited = true;
    } else {
      categoriesMenu.forEach(function (element) {
        element.style.opacity = "0";
      });
      visited = false;
    }
  });
}
