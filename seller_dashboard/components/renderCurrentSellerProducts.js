import {read, write, findById, saveOrUpdate, removeById} from './storage.js';

export function renderProducts() {
    const current = JSON.parse(localStorage.getItem('currentUser') || '');
    // console.log('current user data: ', current);
    // if(!current || current.role !== 'seller') return location.href = '../../index.html';
    

    const products = read('products').filter(p => p?.sellerId === current.id);
    // console.log('all products of the current seller: ', products);

    const container = document.getElementById('products-table-container');

    if(products.length === 0) {
        container.innerHTML = `<p>No products yet. Click Add Product.</p>`;
        return;
    }

    let html = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Book</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    products.forEach(p => {
        html += `
        <tr data-id="${p.id}">
            <td><img src="${p.image}" style="height:60px; width:42px" /></td>
            <td>${p.title} <br> <small>${p.author || ''}</small></td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn btn-sm btn-secondary edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </td>
        </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

}