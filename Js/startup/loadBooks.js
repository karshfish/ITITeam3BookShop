async function loadBooks() {

    const response = await fetch("../booksv3.0.json");
    const data = await response.json();

    // Only keep first 50
    const limitedBooks = data.slice(60, 120);

    localStorage.setItem("products", JSON.stringify(limitedBooks));
    // console.log("50 Books saved to localStorage:", limitedBooks);

  } 

// Run
loadBooks();
