import { findById } from "./storage.js";

export function sellerAvatar() {
    const current = JSON.parse(localStorage.getItem('currentUser'))[0];
    if(current) {
        document.getElementById('seller-name').textContent = current.name;
        document.getElementById('seller-image').src = findById('users', current.id).profileImage;
    }
}