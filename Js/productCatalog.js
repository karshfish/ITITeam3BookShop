import { navbarReady } from "./navbarLoader.js";
import { setupAccountIcon } from "./components/accountSetupt.js";

// Wait for navbar
const navbarContainer = await navbarReady;
const cartBtn = navbarContainer.querySelector("#user-cart");
console.log("Cart button:", cartBtn);
function setupCartIcon() {
  const cartIcon = document.getElementById("user-cart");
  const cartDropdown = document.getElementById("cart-dropdown");

  // Force dropdown styling from JS
  cartDropdown.classList.add("bg-dark"); // dark background
  cartDropdown.classList.add("p-2"); // padding (optional)

  cartIcon.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let html = ``;

    if (cart.length === 0) {
      html = `<li class="dropdown-item-text text-light">Your cart is empty</li>`;
    } else {
      cart.forEach((book) => {
        html += `<li class="dropdown-item-text text-light">${book.title} - $${book.price} (x${book.quantity})</li>`;
      });

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      html += `<li class="dropdown-item-text fw-bold text-light">Total - $${total}</li>`;
    }

    cartDropdown.innerHTML = html;
  });
}

setupCartIcon();

setupAccountIcon();
// Get query params
const params = new URLSearchParams(window.location.search);
console.log(params);
const subject = params.get("catagory") ?? params.get("category");
console.log("Subject:", subject);

// Get products from storage
function productsJson() {
  const fetchedProducts = JSON.parse(localStorage.getItem("products") || "[]");
  if (!subject) return fetchedProducts;

  const filtered = fetchedProducts.filter(
    (p) => Array.isArray(p.subjects) && p.subjects.includes(subject)
  );

  if (filtered.length > 0) return filtered;

  alert(`There are no ${subject} books available right now. Showing all.`);
  return fetchedProducts;
}

// Build catalog
function getProducts() {
  const products = productsJson();
  for (const product of products) {
    try {
      const coverSrc = getCover(product);
      addCard(product, coverSrc);
    } catch (e) {
      console.error("Error with product:", product, e);
    }
  }
}
getProducts();

// Helpers
function getCover(product) {
  return product.covers?.large ?? "assets/placeholder.png";
}

function addCard(product, src) {
  const mainWrapper = document.getElementById("row");

  const cardWrapper = document.createElement("div");
  cardWrapper.className = "col-12 col-md-6 col-lg-3 mb-4";

  const card = document.createElement("div");
  card.className = "card h-100";
  card.setAttribute("data-price", product.price);

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  cardHeader.innerHTML = `<img src="${src}" alt="Book" class="card-img-top">`;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.innerHTML = `
    <p>Author: ${product.authors?.[0]?.name ?? "Unknown"}</p>
    <p>Title: ${product.title}</p>
    <p>Price: ${product.price}$</p>
  `;

  const link = document.createElement("a");
  link.href = `productDetails.html?id=${product.cover_id}&price=${product.price}`;
  link.className = "stretched-link";

  const cardFooter = document.createElement("div");
  cardFooter.className = "card-footer";

  const addToCart = document.createElement("button");
  addToCart.className = "btn btn-primary";
  addToCart.textContent = "Add to Cart";
  addToCart.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const ix = cart.findIndex((item) => item.title === product.title);

    if (ix > -1) cart[ix].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
  });

  cardFooter.appendChild(addToCart);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  cardWrapper.appendChild(card);
  mainWrapper.appendChild(cardWrapper);
}
