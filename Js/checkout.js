// to save the payment method into the object 
import { navbarReady } from "./navbarLoader.js";
import { setupAccountIcon } from "./components/accountSetupt.js";
import { setupStickyMainNavbar } from "./components/stickyMainNavbar.js";
import { setupCartIcon } from "./components/handleCart.js";

// Wait for navbar
await navbarReady;
setupAccountIcon();
setupCartIcon();
setupStickyMainNavbar();

document.querySelectorAll(".payment-option").forEach(option => {
    option.addEventListener("click", () => {
        document.getElementById("paymentMethod").value = option.dataset.method;
        console.log("Payment method set to:", option.dataset.method);
    });
});

