import { runMenu } from "./menu.js";
import { runCarousel } from "./carousel.js";
import { runFetch } from "./fetch.js";

const main = () => {
  runMenu();
  runFetch();
  runCarousel();
};

main();
