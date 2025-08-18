// navbarLoader.js
export async function loadHTML(url, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) throw new Error(`Container ${containerSelector} not found`);

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const html = await res.text();
  container.innerHTML = html;

  // Resolve after the DOM is actually updated
  return container;
}

// Export a ready-promise for the navbar specifically
export const navbarReady = loadHTML("./../partials/navbar.html", "#navbar");
