
import { addBookToCart } from "./handleCart.js";

export async function renderFeatureBooks() {
    const booksRow = document.querySelector('#featured-books-row');
    const limit = 8; // number of books to render.
    
    try {
        const response = JSON.parse(localStorage.getItem("products"), [])

         let books = response.slice(0, limit);
        
         books = books.sort((a, b) => a.price -b.price);
        
        booksRow.innerHTML = ' ';
    
        books.slice(0, limit).forEach(book => {
            // const cover = book.cover_i? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '../../images/book1.jpg';
            const cover = book.covers?.medium;
            const title = book?.title;
            // const author = book.author_name.toString();
            const author = book.authors;
            // const price = '$10';
            const price = book?.price;

            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-3 mb-4';
    
            col.innerHTML = `
                <div class="book-card d-flex flex-column p-3 shadow-sm rounded h-100 text-center">
                    <img src="${cover}" alt="book cover" class="book-img img-fluid mb-3"  data-title="${title}" data-author="${author}" data-cover="${cover}">
                    <h5 class="book-title"  data-title="${title}" data-author="${author}" data-cover="${cover}">${title}</h5>
                    <p class="book-author text-muted mb-1">${author}</p>
                    <p class="book-price fw-semibold mb-2">${price}</p>
                    <button class="btn mt-auto btn-sm add-btn">Add to Cart</button>
                </div>
            `;

            function goToBookPage(book) {
                const title = book.title;
                const author = book.authors[0].name;
                const cover = book.cover?.medium;
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
    
            booksRow.appendChild(col);
        });
    
    } catch(error) {
        console.error("Failed to load the featured books: ", error);
    }

}