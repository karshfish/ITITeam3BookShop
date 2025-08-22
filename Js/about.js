import { navbarReady } from "./navbarLoader.js";
import { setupAccountIcon } from "./components/accountSetupt.js";
import { setupStickyMainNavbar } from "./components/stickyMainNavbar.js";
import { setupCartIcon } from "./components/handleCart.js";

// Wait for navbar
await navbarReady;
setupAccountIcon();
setupCartIcon();
setupStickyMainNavbar();