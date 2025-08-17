let products;
let Qs = window.location.search;
const pagination = document.getElementById("pagination")
if (Qs) {
    Qs = Qs.split("?")[1].split("=")
    console.log(Qs)
}
subjectIndex=Qs.indexOf("catagory")
let subject = Qs[subjectIndex+1]
console.log(subject);



 function productsJson() {
    let fetchedProducts = JSON.parse(localStorage.getItem("products"), [])
    // console.log(fetchedProducts)
    let subjected_products=[]
    for(let i=0;i<fetchedProducts.length;i++){
        if(fetchedProducts[i].subjects.indexOf(subject)>-1){
            subjected_products.push({...fetchedProducts[i]})
        }
    }
    if(subjected_products.length>0){
        console.log(subjected_products)
        return subjected_products
    }
    else{
        alert(`There are no ${subject} books availabe right now check our other collection` );
        return fetchedProducts;
    }
        
        
};

productsJson();
function getProducts() {
    let products=productsJson();
    // addPages(products)
    // console.log(products)
    // let page;
    // let pageIndex=Qs.indexOf("page")
    // if (Qs && Qs[pageIndex] === "page") {
    //     page = +Qs[1]
    //     page--;

    // }
    // else {
    //     page = 0
    // }
    // pagination.children[page].className += " active";
    for (let i = 0; i < products.length; i++) {
        // itemNum = i + ((page) * 12);
        try{
            let coverSrc = getCover(products[i])
            addCard(products[i], coverSrc);
        }
        catch(e){
            console.log(i+e)
        }

    }

}
getProducts();

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
    let price = _product.price
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

        const existingItemIndex = cart.findIndex(item => item.title === _product.title);

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
// function addPages(_product) {
//     let pages = Math.ceil(_product.length / 12)
//     // console.log(pages)
//     for (let i = 1; i <= pages; i++) {
//         let newPage = document.createElement("li")
//         newPage.className = "page-item"
//         pageAnchor = document.createElement("a")
//         pageAnchor.className = "page-link"
//         pageAnchor.setAttribute("href", `productCatalog.html?page=${i}`)
//         pageAnchor.textContent = i;
//         newPage.appendChild(pageAnchor)
//         pagination.appendChild(newPage)
//     }
// }
function getCover(_product) {
    let src=_product.covers?.large;
    // if(_product.covers){
    //     return src= _product.covers?.large
    // }
    // else{
    //     return 0
    // }
    return src;
      
}
