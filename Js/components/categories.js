export async function renderCategories() {
    const row = document.getElementById('categories-row');
    row.innerHTML = '';

    const categories = [
        { name: "Science Fiction", subject: "science_fiction" },
        { name: "History", subject: "history" },
        { name: "Romance", subject: "romance" },
        { name: "Fantasy", subject: "fantasy" },
        { name: "Mystery", subject: "mystery" },
        { name: "Children's Books", subject: "children" }
    ];

    for (const category of categories) {
        try {
            // fetch the first book of the category to get cover.
            const response = await fetch(`https://openlibrary.org/subjects/${category.subject}.json?limit=1`,{ cache: 'force-cache' });
            const data = await response.json();
            const book = data.works[0];
            const cover = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : '../../images/book1.jpg';

            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-2 mb-4';
            col.innerHTML = `
            <div class="category-card text-center p-3 shadow-sm rounded h-100 category-click" data-subject="${category.subject}">
                <img src="${cover}" alt="${category.name}" class="img-fluid mb-2 rounded">
                <h6>${category.name}</h6>
            </div>
            `;

            col.querySelector('.category-click').addEventListener('click', function() {
                const subject = this.dataset.subject;
                location.href = `productCatalog.html?catagory=${encodeURIComponent(subject)}`;
            });

            row.appendChild(col);


        } catch(error) {
            console.error(`Failed to load category ${category.name}: `, error);
        }
    }


}