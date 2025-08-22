import { requireAdmin } from "./auth.js";
import { read, write, findById, saveOrUpdate, removeById } from "./storage.js";

window.addEventListener('DOMContentLoaded', function () {
    requireAdmin();
    loadProducts();
    applyFilters();
    applySearch();
    applyTableActions();
    showProductDetails();
});

function showProductDetails() {
    const tableBody = document.getElementById('products-body');

    tableBody.addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (!row) return;

        if (event.target.closest('button')) return;

        const productId = row.dataset.id;
        const product = findById('products', productId);
        const seller = findById('users', product.sellerId);

        const modalEl = document.getElementById('book-modal');
        const modal = new bootstrap.Modal(modalEl);

        const modalBody = modalEl.querySelector('.modal-body');
        const modalFooter = modalEl.querySelector('.modal-footer');

        // clear previous content.
        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';

        // populate modal body.
        populateBody(modal, modalBody, product, seller);

        // populate modal footer
        populateFooter(modal, modalFooter, product);

        modal.show();

    });

}

function populateBody(modal, modalBody, product, seller) {
    const cover = '../images/book1.jpg';
    const title = 'cloud mountain';
    const author = 'George MacDonald';
    const price = '$10';
    const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia sed, deserunt qui ad error natus velit praesentium dolorem accusantium expedita laborum alias ab est excepturi molestiae sit sequi autem. Expedita!';

    modalBody.innerHTML = `
    <div class="d-flex flex-column flex-md-row align-items-center">
    <!-- Book cover -->
    <div class="me-md-4 mb-3 mb-md-0">
        <img src="${cover}" alt="Book Cover" class="img-fluid rounded" style="max-width: 150px;">
    </div>

    <!-- Book details -->
    <div>
        <h5 class="fw-bold mb-2">${title}</h5>
        <p class="mb-1"><strong>Author:</strong> ${author}</p>
        <p class="mb-1"><strong>Description:</strong> ${description}</p>
        <p class="mb-1"><strong>Price:</strong> ${price}</p>
        <p class="mb-1"><strong>Seller:</strong> ${seller.name}</p>
        <p class="mb-1"><strong>Status:</strong> <span class="badge bg-${statusColor(product.status)}">${product.status}</span></p>
    </div>
</div>

    `;
}

function populateFooter(modal, footer, product) {
    if (product.status === 'pending') {
        const approveBtn = createButton('Approve', 'btn btn-success btn-sm approve-btn');
        approveBtn.addEventListener('click', function () {
            changeStatus(product.id, 'approved');
            modal.hide();
        });
        footer.appendChild(approveBtn);

        const rejectBtn = createButton('Reject', 'btn btn-warning btn-sm reject-btn');
        rejectBtn.addEventListener('click', function () {
            changeStatus(product.id, 'rejected');
            modal.hide();
        });
        footer.appendChild(rejectBtn);
    }

    const deleteBtn = createButton('Delete', 'btn btn-danger btn-sm delete-btn');
    deleteBtn.addEventListener('click', function () {
        deleteProduct(product.id);
        modal.hide();
    });
    footer.appendChild(deleteBtn);

    // close button.
    const closeBtn = createButton('Close', 'btn btn-secondary btn-sm', ['data-bs-dismiss', 'modal']);
    footer.appendChild(closeBtn);

}

function createButton(content, className, attr = []) {
    const btn = document.createElement('button');
    btn.className = className;
    if (attr.length > 0) btn.setAttribute(attr[0], attr[1]);
    btn.textContent = content;
    return btn;
}

function applyTableActions() {
    const tableBody = document.getElementById('products-body');
    tableBody.addEventListener('click', function (event) {
        const target = event.target;
        const row = target.closest('tr');
        if (!row) return;

        const productId = row.dataset.id;
        // console.log(productId);

        if (target.classList.contains('approve-btn')) {
            changeStatus(productId, 'approved');
        } else if (target.classList.contains('reject-btn')) {
            changeStatus(productId, 'rejected');
        } else if (target.classList.contains('delete-btn')) {
            deleteProduct(productId);
        }

    });
}

function applySearch() {
    const searchBox = document.getElementById('search-input');
    searchBox.addEventListener('keyup', filterProducts);
}

function applyFilters() {
    const filterBox = document.getElementById('status-filter');
    filterBox.addEventListener('change', filterProducts);
}

function deleteProduct(id) {
    if (!confirm(`Delete this product permanently`)) return;

    removeById('products', id);
    filterProducts();
}

function changeStatus(id, newStatus) {
    if (!confirm(`Are you sure you want to mark this products as ${newStatus}?`)) return;

    let products = read('products');
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index].status = newStatus;
    }
    write('products', products);
    filterProducts();
}

function filterProducts() {
    const filter = document.getElementById('status-filter').value;
    const searchedTitle = document.getElementById('search-input').value.toLowerCase();

    let products = read('products'); // => [{}, {}, ...]

    if (filter !== 'all') {
        products = products.filter(p => p.status === filter);
    }
    if (searchedTitle) {
        products = products.filter(p => p.title.toLowerCase().includes(searchedTitle));
    }

    renderProducts(products);
}

function statusColor(st) {
    switch (st) {
        case 'pending': return 'secondary';
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        default: return 'light';
    }
}

function renderProducts(list) {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';


    list.forEach(product => {
        const tableRow = document.createElement('tr');

        const id = product.id;
        const title = product.title;
        // const sellerId = product?.sellerId;
        // const sellerName = findById('users', sellerId).name;
        const price = product.price;
        const status = product.status;

        tableRow.dataset.id = id;

        tableRow.innerHTML = `
            <td class="id">${title}</td>
            <td class="title">${title}</td>
            
            <td class="price">$${price}</td>
            <td class="status">
                <span class="badge bg-${statusColor(status)} text-capitalize">${status}</span>
            </td>
            <td class="action">
            <div class="d-flex align-items-center justify-content-around flex-sm-wrap">
                ${status === 'pending' ? `
                        <button class="btn btn-sm btn-success me-1 approve-btn">Approve</button>
                        <button class="btn btn-sm btn-warning me-1 reject-btn">Reject</button>
                    `: ''}
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </div>
            </td>
        `;

        tbody.appendChild(tableRow);
    });
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products") || []);
    renderProducts(products);
    // filterProducts();
}

