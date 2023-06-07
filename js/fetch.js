export { runFetch };

let titles = "http://localhost:8000/api/v1/titles/";
let categories = {
  2: {
    name: "bestFilms",
    url: titles + "?sort_by=-imdb_score",
    ids: [],
  },
  3: {
    name: "Sci-Fi",
    url: titles + "?sort_by=-imdb_score&genre_contains=Sci-Fi",
    ids: [],
  },
  4: {
    name: "Comedy",
    url: titles + "?sort_by=-imdb_score&genre_contains=Comedy",
    ids: [],
  },
  5: {
    name: "Crime",
    url: titles + "?sort_by=-imdb_score&genre_contains=Crime",
    ids: [],
  },
};

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

/**
 * test the fetch's response for an image url
 * @param {string} url
 * @return {boolean}
 */
const canFetch = async (url) => {
  let response = await fetch(url);

  if (response.ok) {
    return true;
  } else {
    return false;
  }
};

/**
 * update hero html
 * @param {object<string>} data
 */
const updateHero = (data) => {
  let baseClass = ".category1__best-film-";

  let title = document.querySelector(baseClass + "title");
  title.textContent = data["title"];

  let description = document.querySelector(baseClass + "description");
  description.textContent = data["description"];

  let image = document.querySelector(baseClass + "image");
  image.src = data["image_url"];
  image.alt = data["id"];
};

/**
 * fetch the hero and update html
 */
async function getHero() {
  let data = await fetchData(categories[2]["url"]);
  if (data["results"].length > 0) {
    categories[2]["ids"].push(data["results"][0]["id"]);
    let data2 = await fetchData(data["results"][0]["url"]);
    updateHero(data2);
  }
}

/**
 * update category html (one film of a category)
 * @param {number} categoryNumber
 * @param {number} filmNumber
 * @param {object<string>} data
 */
const updateCategory = (categoryNumber, filmNumber, data) => {
  let image = document.getElementById(`c${categoryNumber}f${filmNumber}`);
  image.src = data["image_url"];
  image.alt = data["id"];
};

/**
 * fetch the seven best films from a category and update html
 * @param {number} categoryNumber
 */
async function get7Best(categoryNumber) {
  let max = 7;
  let filmNumber = 0;
  let ids = categories[categoryNumber]["ids"];
  let data = await fetchData(categories[categoryNumber]["url"]);

  while (filmNumber < max) {
    for (let i = 0; i < data.results.length; i++) {
      if (!ids.includes(data["results"][i]["id"])) {
        ids.push(data["results"][i]["id"]);
        if (await canFetch(data["results"][i]["image_url"])) {
          filmNumber++;
          updateCategory(categoryNumber, filmNumber, data["results"][i]);
        }
      }
      if (filmNumber === max) {
        break;
      }
    }
    if (data.next === undefined) {
      break;
    }
    data = await fetchData(data.next);
  }
}

/**
 * fetch film data
 * @param {number} id
 * @return {Promise<object<string>}
 */
async function getFilm(id) {
  return await fetchData(titles + id);
}

/**
 * Open and close the modal window
 */
function opencloseModal() {
  document.querySelector(".modal").style.display = "block";
  document.querySelector(".modal__closeBtn").onclick = function () {
    document.querySelector(".modal").style.display = "none";
  };
}

/**
 * check the data list length and update hmtl
 * @param {string} key
 * @param {object<string>} data
 * @param {string} single
 * @param {string} plural
 */
function countData(key, data, single, plural) {
  if (data[key].length > 1) {
    document.querySelector(".modal__" + key).textContent = plural;
    data[key].forEach(function (element) {
      document.querySelector(".modal__" + key).textContent += element + ", ";
    });
    document.querySelector(".modal__" + key).textContent = document
      .querySelector(".modal__" + key)
      .textContent.slice(0, -2);
  } else {
    document.querySelector(".modal__" + key).textContent = single + data[key];
  }
}
function updateBudjet(data) {
  document.querySelector(".modal__budjet").textContent = "";
  if (data["budget"] != null) {
    document.querySelector(".modal__budjet").textContent =
      "Budjet : " + data["budget"] + " " + data["budget_currency"];
  } else {
    document.querySelector(".modal__budjet").textContent = "";
  }
}

/**
 * update modal window html and open/close it
 * @param {object<string>} data
 */
function updateModal(data) {
  countData("actors", data, "Actor : ", "Actors : ");
  countData("directors", data, "Director : ", "Directors : ");
  countData("countries", data, "Country : ", "Countries : ");
  countData("genres", data, "Genre : ", "Genres : ");
  updateBudjet(data);
  document.querySelector(".modal__image").src = data["image_url"];
  document.querySelector(".modal__image").alt = data["title"];
  document.querySelector(".modal__title").textContent = data["title"];
  document.querySelector(".modal__date").textContent =
    "Release date : " + data["date_published"];
  document.querySelector(".modal__description").textContent =
    data["long_description"];
  document.querySelector(".modal__duration").textContent =
    "Duration : " + data["duration"] + " mn";
  document.querySelector(".modal__imdb").textContent =
    "Imdb Score : " + data["imdb_score"];
  opencloseModal();
}

/**
 * fetch all films data for the web site, then return their ids
 */
async function runFetch() {
  getHero().then(() => {
    document.getElementById("c1f1").onclick = async function () {
      updateModal(await getFilm(document.getElementById("c1f1").alt));
    };
    document.getElementById("title").onclick = async function () {
      updateModal(await getFilm(document.getElementById("c1f1").alt));
    };
  });

  Object.keys(categories).forEach(function (element) {
    get7Best(element).then(() => {
      for (let j = 1; j < 8; j++) {
        let id = `c${element}f${j}`;
        document.getElementById(id).onclick = async function () {
          let data = await getFilm(document.getElementById(id).alt);
          updateModal(data);
        };
      }
    });
  });
}
