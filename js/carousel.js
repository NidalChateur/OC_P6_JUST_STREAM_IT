export { runCarousel };

let categoriesList = {
  2: "Les Meilleurs Films",
  3: "Science-fiction",
  4: "Comédie",
  5: "Crime",
};

let visitedBtn = {
  2: { previous: false, next: false },
  3: { previous: false, next: false },
  4: { previous: false, next: false },
  5: { previous: false, next: false },
};

/**
 * hide the first three films and display the last three of one category
 * @param {number} categoryNumber
 */
function next(categoryNumber) {
  let nextBtn = document.getElementById(`btn-next${categoryNumber}`);
  let firstThree = document.querySelectorAll(`.previous${categoryNumber}`);
  let lastThree = document.querySelectorAll(`.next${categoryNumber}`);

  nextBtn.addEventListener("click", function () {
    if (!visitedBtn[categoryNumber]["next"]) {
      firstThree.forEach(function (element) {
        element.style.display = "none";
      });

      lastThree.forEach(function (element) {
        element.style.display = "flex";
      });

      visitedBtn[categoryNumber]["next"] = true;
      visitedBtn[categoryNumber]["previous"] = false;
    }
  });
}

/**
 * hide the last three films and display the first three of one category
 * @param {number} categoryNumber
 */
function previous(categoryNumber) {
  let previousBtn = document.getElementById(`btn-previous${categoryNumber}`);
  let firstThree = document.querySelectorAll(`.previous${categoryNumber}`);
  let lastThree = document.querySelectorAll(`.next${categoryNumber}`);

  previousBtn.addEventListener("click", function () {
    if (!visitedBtn[categoryNumber]["previous"]) {
      lastThree.forEach(function (element) {
        element.style.display = "none";
      });

      firstThree.forEach(function (element) {
        element.style.display = "flex";
      });

      visitedBtn[categoryNumber]["previous"] = true;
      visitedBtn[categoryNumber]["next"] = false;
    }
  });
}

/**
 * call previous() and next() for one category
 * @param {number} categoryNumber
 */
function carousel(categoryNumber) {
  previous(categoryNumber);
  next(categoryNumber);
}

/**
 * run the carousel for all categories
 */
function runCarousel() {
  Object.keys(categoriesList).forEach(function (element) {
    carousel(element);
  });
}
