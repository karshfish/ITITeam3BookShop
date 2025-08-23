export async function loadHTMl(id, path){
    const targetElement=document.querySelector(`#${id}`);
    if(!targetElement) throw new Error(`missing sidebar element in your file`);
    const res = await fetch(path, {cache:'no-cache'});
    if(!res.ok) throw new Error(`missing sidebar file`);
    const html = await res.text();
    targetElement.innerHTML=html;
    document.getElementById("sidebarToggle").addEventListener("click", toggleSidebar)
    return targetElement;
}

export const sidebarReady = await loadHTMl("sidebar", "./../html/partials/sidebar.html")

export function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    if (sidebar && mainContent) {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("collapsed");
    }
}