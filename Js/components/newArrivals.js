
import { addBookToCart } from "./handleCart.js";

export async function renderNewArrivals() {
    const row = document.getElementById('new-arrivals-row');
    const limit = 8;
    try{
        const response =  JSON.parse(localStorage.getItem("products"), [])

         let books = response.slice(0, limit);
         console.log(books)

// ================================= load new arrivals from local storage ====================================
        
        


        row.innerHTML = '';

        books.forEach(book => {
            let cover = book.covers?.medium
            
            const title = book?.title;
            // const author = book.author_name ?  book.author_name.toString() : 'unknown author';
            const author = book.authors[0]?.name;
            // const price = '$10';
            const price = book?.price;

            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-3 mb-4';

            col.innerHTML = `
                <div class="book-card d-flex flex-column p-3 shadow-sm rounded h-100 text-center">
                    <img src="${cover}" alt=" book cover" class="book-img img-fluid mb-3"  data-title="${title}" data-author="${author}" data-cover="${cover}">
                    <h5 class="book-title" data-title="${title}" data-author="${author}" data-cover="${cover}">${title}</h5>
                    <p class="book-author text-muted mb-1">${author}</p>
                    <p class="book-price fw-semibold mb-2">${price}</p>
                    <button class="btn mt-auto btn-sm add-btn ">Add to Cart</button>
                </div>
            `;

            function goToBookPage(book) {
                const title = book?.title;
                const author = book?.author;
                const cover = book?.cover;
                location.href = `book-details-page.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&cover=${encodeURIComponent(cover)}`;
            }

            col.querySelector('.book-img').addEventListener('click', function() {
                goToBookPage(this);
            });
            col.querySelector('.book-title').addEventListener('click', function() {
                goToBookPage(this);
            });
            col.querySelector('.add-btn').addEventListener('click', function(event) {
                event.stopPropagation();
                
                addBookToCart(book);
            });

            row.appendChild(col);
        });

        
    } catch(error) {
        console.error('Failed to load new arrivals: ', error);
    }
}

