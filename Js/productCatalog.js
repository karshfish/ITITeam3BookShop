let products;
let Qs = window.location.search;
const pagination = document.getElementById("pagination")
if (Qs) {
    Qs = Qs.split("?")[1].split("=")
    console.log(Qs)
}
let subject = "adventure"



async function productsJson() {
    const fetchedProducts = await fetch(`http://openlibrary.org/subjects/${subject}.json?limit=100`, { cache: 'force-cache' })
    console.log(fetchedProducts)
    json = await fetchedProducts.json()
    console.log(json)
    return json.works;
};

(async function getProducts() {
    let products = await productsJson();
    addPages(products)
    console.log(products)
    let page;

    if (Qs && Qs[0] === "page") {
        page = +Qs[1]
        page--;

    }
    else {
        page = 0
    }
    pagination.children[page].className += " active";
    for (let i = 0; i < 12; i++) {
        itemNum = i + ((page) * 12);
        if (products[itemNum]) {
            let coverSrc = getCover(products[itemNum])
            addCard(products[itemNum], coverSrc);
        }

    }

})()

// console.log(products)
//create a card to a product 
function addCard(_product, _src) {
    const mainWrapper = document.getElementById("row")
    let cardWrapper = document.createElement("div");
    cardWrapper.className = `col-12 col-md-6 col-lg-3 mb-4`;
    let card = document.createElement("div")
    card.className = "card h-100 "
    let cardHeader = document.createElement("div")
    cardHeader.className = "card-header"
    cardHeader.innerHTML = `<img src="${_src}" alt = "Book" class="card-img-top">`
    let cardBody = document.createElement("div")
    cardBody.className = "card-body"
    let price = ((Math.random() * 100)).toFixed(2)
    cardBody.innerHTML = `<p>Author: ${_product.authors[0].name}</p>
    <p>title: ${_product.title}</p>
    <p>Price: ${price}$`;
    card.setAttribute("data-price", price)
    link = document.createElement("a")
    link.setAttribute("href", `productDetails.html?id=${_product.cover_id}&price=${price}`)
    link.className = "stretched-link"
    cardFooter = document.createElement("div")
    cardFooter.className = "card-footer"
    addToCart = document.createElement("button")
    addToCart.className = "btn btn-primary"
    addToCart.textContent="Add to Cart"
    addToCart.addEventListener("click", function (e) {
        
        let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve or initialize cart

        const existingItemIndex = cart.findIndex(item => item.cover_id === _product.cover_id);

        if (existingItemIndex > -1) {
            // Item already in cart, update quantity
            cart[existingItemIndex].quantity +=  1;
        } else {
            // New item, add to cart
            cart.push({ ..._product, quantity:  1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    })
    cardFooter.appendChild(addToCart);
    card.appendChild(cardHeader);
    card.appendChild(cardBody)
    // card.appendChild(link);
    card.appendChild(cardFooter);
    cardWrapper.appendChild(card);
    mainWrapper.appendChild(cardWrapper);


}
function addPages(_product) {
    let pages = Math.ceil(_product.length / 12)
    for (let i = 1; i <= pages; i++) {
        let newPage = document.createElement("li")
        newPage.className = "page-item"
        pageAnchor = document.createElement("a")
        pageAnchor.className = "page-link"
        pageAnchor.setAttribute("href", `productCatalog.html?page=${i}`)
        pageAnchor.textContent = i;
        newPage.appendChild(pageAnchor)
        pagination.appendChild(newPage)
    }
}
function getCover(_product) {
    const key = "id"
    let value = _product.cover_id;
    let size = "L";
    let src = `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg`;
    return src
}
