import { setupStickyMainNavbar } from "./components/stickyMainNavbar.js";
import { renderFeatureBooks } from "./components/featuredBooks.js";
import { loadWhyChooseUs } from "./components/why.js";
import { renderNewArrivals } from "./components/newArrivals.js";
import { renderCategories } from "./components/categories.js";
import { setupCartIcon } from "./components/handleCart.js";
import { setupAccountIcon } from "./components/accountSetupt.js";
import { navbarReady } from "./navbarLoader.js";
// Wait for navbar
await navbarReady;
setupStickyMainNavbar();
setupAccountIcon();
setupCartIcon();
renderCategories();
renderNewArrivals();
renderFeatureBooks();
loadWhyChooseUs();
setupCartIcon();
