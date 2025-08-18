import { setupSearchComponents } from './components/search.js';
import { setupStickyMainNavbar } from './components/stickyMainNavbar.js';
import { renderFeatureBooks } from './components/featuredBooks.js';
import { loadWhyChooseUs } from './components/why.js';
import { renderNewArrivals } from './components/newArrivals.js';
import { renderCategories } from './components/categories.js';
import { setupCartIcon } from './components/handleCart.js';
import { setupAccountIcon } from './components/accountSetupt.js';
document.addEventListener('DOMContentLoaded', function() {
    setupSearchComponents();
    setupAccountIcon();
    setupStickyMainNavbar();
    renderCategories();
    renderNewArrivals();
    renderFeatureBooks();
    loadWhyChooseUs();
    setupCartIcon();
    
});

