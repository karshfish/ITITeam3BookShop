import { populateProductModal, showProductModal } from "./productModal.js";
import { generateUniqueId } from "./uniqueIdGenerator.js";

export function addProduct() {
    const addBtn = document.getElementById('add-product-button')
    console.log(addBtn)
    addBtn.addEventListener('click', () => {
        
        populateProductModal({
            id: generateUniqueId(),
            sellerId: '',
            title: '',
            author: '',
            price: 0,
            stock: 0,
            category: '',
            image: '',
            description: '',
            visible: true,
            status: 'pending', 
            createdAt: new Date().toISOString()
        });
        showProductModal();
    });
}