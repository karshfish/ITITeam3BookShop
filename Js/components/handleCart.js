import { generateUniqueId } from "../../seller-dashboard/components/uniqueIdGenerator.js";
import { read } from "../../seller-dashboard/components/storage.js";

export function addBookToCart(b) {
    // const current = JSON.parse(localStorage.getItem('currentUser'))[0] || '';
    // if(current) {
    //     const customerId = read('users').find(x => x.name === current.name).id; 
    // }
    const book = {
        productId: b.id, 
        title: b.title, 
        author: b.author, 
        image: b.image, 
        price: b.price, 
        sellerId: b.sellerId, 
        qty: 1
    };

    // get the existing cart from the local storage.
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        id: generateUniqueId('0'), 
        customerId: customerId?? 'guest', 
        items: [],
         total: 0,
         status: 'pending', 
         createdAt: new Date().toISOString()
        };

    // check if the book already exists in the cart.
    const existingBook = cart.items.find(x => x.productId === b.id);
    
    if(existingBook) {
        existingBook.qty += 1;
    } else {
        cart.items.push(book);  // add the new book.
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // save back to the local storage.
    localStorage.setItem('orders', JSON.stringify(cart));
    console.log(cart.total);
    
}

export function setupCartIcon() {
    const cartIcon = document.getElementById('user-cart');
    const cartDropdown = document.getElementById('cart-dropdown');

    cartIcon.addEventListener('click', function(){
        const cart = JSON.parse(localStorage.getItem('orders')) || {};
        let html = ``;
        if(cart.items.length === 0) {
            cartDropdown.innerHTML = `<li class="text-light dropdown-item-text">Your cart is empty</li>`;   
        } else {
            (cart.items).forEach(book => {
                html += `<li class="text-light dropdown-item-text">${book.title} - $${book.price} (x${book.qty}) </li>`;
            });

            html +=  `<li class="text-light dropdown-item-text">Total - ${cart.total} </li>`;
            cartDropdown.innerHTML = html;
        }
        
        
    });

    cartIcon.addEventListener('dblclick', function() {
        window.location.href = 'cart.html';
    })
}