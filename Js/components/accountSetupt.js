export function setupAccountIcon() {
  const iconHTML = document.getElementById("user-account");
  let current = localStorage.getItem("currentUser");
  let menu = document.getElementById("dropdown-menu");
  console.log(menu);
  if (!current) {
    iconHTML.innerHTML = "Sign up or Login";
    let parent = iconHTML.parentNode;

    parent.setAttribute("href", "log_reg.html");
  } else {
    let name = JSON.parse(current);
    name = name.fullName;
    iconHTML.innerHTML = `Welcom ${name} `;
    let parent = iconHTML.parentNode;

    let logout = document.createElement("a");
    logout.className = `dropdown-item`;
    logout.innerHTML = "Logout";
    logout.addEventListener("click", function () {
      localStorage.removeItem("cart");
      localStorage.removeItem("currentUser");
      window.location.href = "home.html";
    });

    menu.appendChild(logout);
    parent.setAttribute("href", "#");
    parent.appendChild(dropDown);
    console.log(parent);
  }
}
