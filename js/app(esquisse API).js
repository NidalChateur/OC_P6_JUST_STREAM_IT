//  ici nous faisons un exemple avec du texte simple

// installer WAMP pour émuler un serveur ?

// Récupère le contenu de la balise demo
var demo = document.getElementById("demo");

// Instantie un nouvel objet XMLHttpRequest
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  console.log(this);
  //   test si la réponse de la requête est correcte
  if (this.readyState == 4 && this.status == 200) {
    // attribue le texte de la réponse de la requete à la balise html d'id demo
    demo.innerHTML = this.responseText;
    // cas ou la requête n'a pas pu aboutir
  } else if (this.readyState == 4 && this.status == 404) {
    alert("error 404 :/");
  }
};

// Crée la requête, true pour asynchrone
xhr.open("GET", "url", true);

// choisir le type de la réponse
xhr.responseType = "text";
// xhr.responseType = "json";

// Envoi la requête
xhr.send();
