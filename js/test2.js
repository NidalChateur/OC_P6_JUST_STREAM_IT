let titleUrl = "http://localhost:8000/api/v1/titles/";
let bestFilmsUrl = `${titleUrl}?sort_by=-imdb_score`;
let genresUrl = "http://localhost:8000/api/v1/genres/";
let genresBaseUrl = `${bestFilmsUrl}&genre_contains=`;

/**
 * fetch data from an url
 * @param {string} url
 * @return {Promise<object>}
 */
const fetchData = async (url) => {
  try {
    let response = await fetch(url);

    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      throw new Error(
        `Erreur de réponse du serveur (${response.status} ${response.statusText})`
      );
    }
  } catch (error) {
    throw error;
  }
};

class Genre {
  /**
   * Fisher's algorithm
   * @param {Array<string>} array
   * @return {Array<string>}
   */
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * get the genres list available in the API
   * @return {Promise<Array<string>>}
   */
  static async getGenres() {
    let genresList = [];
    while (genresUrl != null) {
      let data = await fetchData(genresUrl);

      for (let i = 0; i < data.results.length; i++) {
        genresList.push(data.results[i]["name"]);
      }

      genresUrl = data["next"];
    }

    return genresList;
  }
  /**
   * Shuffle the genres list and draw 3 of them whith their url
   * @return {Promise<object<string>>}
   */
  static async draw3Genres() {
    let genreUrl = {};
    let genresList = this.shuffleArray(await this.getGenres());

    genreUrl[genresList[0]] = genresBaseUrl + genresList[0];
    genreUrl[genresList[1]] = genresBaseUrl + genresList[1];
    genreUrl[genresList[2]] = genresBaseUrl + genresList[2];

    return genreUrl;
  }
}

let max = 7;
let category2Ids = [];
let category2Films = {};
let category2LastPage = [];

let category3Ids = [];
let category3Films = {};
let category3LastPage = [];

let category4Ids = [];
let category4Films = [];
let category4LastPage = [];

let category5Ids = [];
let category5Films = [];
let category5LastPage = [];

class Film {
  /**
   * Film class
   * @param {object} data
   * @return {Film}
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.url = data.url;
    this.imageUrl = data.image_url;
    this.genre = data.genres;
    this.year = data.year;
    this.imdbScore = data.imdb_score;
    this.director = data.directors;
    this.actors = data.actors;
    this.duration = data.duration;
    this.country = data.countries;
    this.description = data.description;
  }

  /**
   * return a html document by its class or its id
   * @param {string} classNameEnd
   * @param {number} categoryNumber
   * @param {string} id
   * @return {document}
   */
  static _filmDocument(
    classNameEnd = "",
    categoryNumber = "",
    id = "",
    legend = false
  ) {
    if (id === "" && legend === false) {
      return document.getElementsByClassName(
        `category${categoryNumber}__best-film-${classNameEnd}`
      )[0];
    } else {
      return document.getElementById(id);
    }
  }

  static _editH3(genres) {
    this._filmDocument("", "", "legend2").textContent = "Les Meilleurs Films";
    this._filmDocument("", "", "legend3").textContent = genres[0];
    this._filmDocument("", "", "legend4").textContent = genres[1];
    this._filmDocument("", "", "legend5").textContent = genres[2];
  }

  static _updateHtml(film = "", categoryNumber, filmsNumbers = "", data = "") {
    if (categoryNumber === 1) {
      this._filmDocument("title", 1).textContent = film.title;
      this._filmDocument("description", 1).textContent = film.description;
      this._filmDocument("image", 1).src = film.imageUrl;
      this._filmDocument("image", 1).alt = film.title;
    } else {
      this._filmDocument("", "", `c${categoryNumber}f${filmsNumbers}`).alt =
        data["id"];
      this._filmDocument("", "", `c${categoryNumber}f${filmsNumbers}`).src =
        data["image_url"];
    }
  }

  static async getTheBestFilm(url) {
    let data = await fetchData(url);
    if (data["results"].length > 0) {
      category2Ids.push(data["results"][0]["id"]);
      let data2 = await fetchData(data["results"][0]["url"]);
      let film = new Film(data2);
      this._updateHtml(film, 1);
      category2Films[film.id] = film;
    }
  }

  static async get7Films(
    categoryNumber,
    genreUrl,
    categoryIds,
    categoryLastPage,
    genres
  ) {
    let filmsNumbers = 0;
    let data;
    if (categoryLastPage.length === 0) {
      data = await fetchData(genreUrl);
    } else {
      data = await fetchData(categoryLastPage[categoryLastPage.length - 1]);
    }

    while (filmsNumbers < max) {
      for (let i = 0; i < data.results.length; i++) {
        if (!categoryIds.includes(data["results"][i]["id"])) {
          categoryIds.push(data["results"][i]["id"]);
          let response = await fetch(data["results"][i]["image_url"]);
          if (response.ok) {
            filmsNumbers++;
            this._updateHtml(
              "",
              categoryNumber,
              filmsNumbers,
              data["results"][i]
            );
          }
        }
        if (filmsNumbers === max) {
          break;
        }
      }
      if (data.next === undefined) {
        break;
      }
      categoryLastPage.push(data.next);
      data = await fetchData(data.next);
    }

    return categoryIds;
  }

  static async next(categoryNumber, genreUrl, categoryIds, categoryLastPage) {
    let next = this._filmDocument("", "", `next${categoryNumber}`);
    next.addEventListener("click", async function () {
      return Film.get7Films(
        categoryNumber,
        genreUrl,
        categoryIds,
        categoryLastPage
      );
    });
  }

  static async previous(categoryNumber, categoryIds) {
    let previous = this._filmDocument("", "", `previous${categoryNumber}`);
    previous.addEventListener("click", async function () {
      if (categoryIds.length >= 14) {
        let filmsNumbers = 1;
        categoryIds.splice(-7);
        for (let i = 7; i < 0; i--) {
          data = await fetchData(
            titleUrl + categoryIds[categoryIds.length - i]
          );
          this._updateHtml("", categoryNumber, filmsNumbers, data);
          filmsNumbers++;
        }
      }
    });
  }
  static async previous0(categoryNumber, categoryIds) {
    let previous = this._filmDocument("", "", `previous${categoryNumber}`);
    previous.addEventListener("click", async function () {
      if (categoryIds.length >= 14) {
        let filmsNumbers = 1;
        categoryIds.splice(-7);
        for (let i = 7; i < 0; i--) {
          data = await fetchData(
            titleUrl + categoryIds[categoryIds.length - i]
          );
          this._updateHtml("", categoryNumber, filmsNumbers, data);
          filmsNumbers++;
        }
      }
    });
  }
}

// start running
console.log("La liste des genres :");
console.log(Genre.getGenres());

async function draw() {
  let genreObject = await Genre.draw3Genres();
  console.log(genreObject);
  console.log(Object.keys(genreObject));
  let g = Object.keys(genreObject);
  console.log(g);
  Film._editH3(g);
  Film.get7Films(2, bestFilmsUrl, category2Ids, category2LastPage, g)
    .then((categoryIds) => {
      Film.next(2, bestFilmsUrl, categoryIds, category2LastPage);
    })
    .then((categoryIds) => {
      console.log(categoryIds);
    });

  Film.get7Films(3, genreObject[g[0]], category3Ids, category3LastPage, g)
    .then((categoryIds) => {
      Film.next(3, genreObject[g[0]], categoryIds, category3LastPage);
    })
    .then((categoryIds) => {
      console.log(categoryIds);
    });

  Film.get7Films(4, genreObject[g[1]], category4Ids, category4LastPage, g)
    .then((categoryIds) => {
      Film.next(4, genreObject[g[1]], categoryIds, category4LastPage);
    })
    .then((categoryIds) => {
      console.log(categoryIds);
    });

  Film.get7Films(5, genreObject[g[2]], category5Ids, category5LastPage, g)
    .then((categoryIds) => {
      Film.next(5, genreObject[g[2]], categoryIds, category5LastPage);
    })
    .then((categoryIds) => {
      console.log(categoryIds);
    });
}
draw();
console.log("La data du meilleur film :");
console.log(Film.getTheBestFilm(bestFilmsUrl));

console.log("obtenir les 7 autres meilleurs films :");

// Film.previous(2, categoryIds);
