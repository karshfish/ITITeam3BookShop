export function setupAccountIcon() {
  const iconHTML = document.getElementById("user-account");
  let current = localStorage.getItem("currentUser");
  if (!current) {
    iconHTML.innerHTML = "Sign up or Login";
  } else {
    let name = JSON.parse(current);
    name = name.fullName;
    iconHTML.innerHTML = `Welcom ${name} `;
    let parent = iconHTML.parentNode;

    parent.setAttribute("href", "#");
    console.log(parent);
  }
}
