
const libraryImages = [
    "https://images.unsplash.com/photo-1615324606662-5d6d2ae148f0?q=80&w=1074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1660188100834-66898d065661?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1642192951264-387e9dce63d0?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1613753584258-965377a71662?w=600&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1703701579680-3b4c2761aa47?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1699536813779-55557d54891a?w=600&auto=format&fit=crop&q=60"
];

let currentImageIndex = 0;
const imageSlider = document.getElementById('imageSlider');
const formContainer = document.getElementById('formContainer');
const book = document.getElementById('book');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return re.test(password);
}

function validateName(name) {
    const re = /^[\p{L}\s]{3,}$/u;
    return re.test(name);
}

function swapAndFlip() {
    imageSlider.classList.toggle('left');
    imageSlider.classList.toggle('right');
    formContainer.classList.toggle('left');
    formContainer.classList.toggle('right');
    book.classList.toggle('flipped');
    changeImage();
    setRandomQuotes();
}

function changeImage() {
    currentImageIndex = (currentImageIndex + 1) % libraryImages.length;
    imageSlider.style.backgroundImage = `url(${libraryImages[currentImageIndex]})`;
}

const loginQuotes = [
    "« Books are like friends, choose them wisely. »",
    "« A reader lives a thousand lives before he dies. »",
    "« Books are magic you can hold in your hands. »",
    "« Reading is dreaming with your eyes open. »"
];

const registerQuotes = [
    "« A room without books is like a body without a soul. »",
    "« Once you learn to read, you will be forever free. »",
    "« Today a reader, tomorrow a leader. »",
    "« Books are mirrors: you only see in them what you already have inside you. »"
];

function randomQuote(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function setRandomQuotes() {
    document.getElementById("loginQuote").textContent = randomQuote(loginQuotes);
    document.getElementById("registerQuote").textContent = randomQuote(registerQuotes);
}

function showMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = isSuccess ? "green" : "red";
        element.style.display = "block";
        setTimeout(() => {
            element.style.display = "none";
        }, 3000);
    }
}

function encryptPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

async function handleRegister() {
    try {
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const role = document.getElementById("regRole").value;

        if (!name || !email || !password) {
            showMessage("regError", "Please fill all fields", false);
            return;
        }
        
        if (!validateName(name)) {
            showMessage("regError", "Name must be at least 3 characters", false);
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage("regError", "Invalid email address", false);
            return;
        }
        
        if (!validatePassword(password)) {
            showMessage("regError", "Password must contain uppercase, lowercase, number and special character", false);
            return;
        }

        const admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];
        const users = JSON.parse(localStorage.getItem("bookstoreUsers")) || [];
        
        if (admins.some(admin => admin.email === email) || users.some(user => user.email === email)) {
            showMessage("regError", "Email already exists", false);
            return;
        }

        const hashedPassword = encryptPassword(password);
        const newUser = {
            id: users.length + 1,
            fullName: name,
            email,
            password: hashedPassword,
            role,
            status: role === "seller" ? "pending" : "active",
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem("bookstoreUsers", JSON.stringify(users)); //set user data
        showMessage("regSuccess", "Account created successfully!", true);
        
        document.getElementById("regName").value = "";
        document.getElementById("regEmail").value = "";
        document.getElementById("regPassword").value = "";
    } catch (error) {
        console.error("Registration error:", error);
        showMessage("regError", "An error occurred during registration", false);
    }
}

async function handleLogin() {
    try {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const remember = document.getElementById("rememberMe")?.checked;

        if (!email || !password) {
            showMessage("loginError", "Please fill all fields", false);
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage("loginError", "Invalid email address", false);
            return;
        }

        const hashedPassword = encryptPassword(password);
        const admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];
        const users = JSON.parse(localStorage.getItem("bookstoreUsers")) || [];
        
        const foundAdmin = admins.find(admin => admin.email === email && admin.password === hashedPassword);
        if (foundAdmin) {
            const storage = localStorage;
            storage.setItem("currentUser", JSON.stringify(foundAdmin));
            window.location.href = "adminPanel/html/noti.html";
            return;
        }

        const foundUser = users.find(user => user.email === email && user.password === hashedPassword);
        if (foundUser) {
            if (foundUser.role === "seller" && foundUser.status === "pending") {
                showMessage("loginError", "Your seller account is pending approval", false);
                return;
            }

            const storage = localStorage ;
            storage.setItem("currentUser", JSON.stringify(foundUser)); //set current user
            
            const redirectPage = foundUser.role === "seller" ? "seller_dashboard/seller_dashboard-2.html" : "home.html";
            window.location.href = redirectPage;
        } else {
            showMessage("loginError", "Invalid email or password", false);
        }
    } catch (error) {
        console.error("Login error:", error);
        showMessage("loginError", "An error occurred during login", false);
    }
}

function showResetPopup() {
    document.getElementById("resetPopup").style.display = "flex";
}

function closeResetPopup() {
    document.getElementById("resetPopup").style.display = "none";
}

function handleResetPassword() {
    const email = document.getElementById("resetEmail").value.trim();
    const newPassword = document.getElementById("resetNewPassword").value;

    if (!email || !newPassword) {
        showMessage("resetError", "Please fill all fields", false);
        return;
    }

    if (!validateEmail(email)) {
        showMessage("resetError", "Invalid email address", false);
        return;
    }

    if (!validatePassword(newPassword)) {
        showMessage("resetError", "Password must contain uppercase, lowercase, number and special character", false);
        return;
    }

    let users = JSON.parse(localStorage.getItem("bookstoreUsers")) || [];
    let admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];

    const hashedPassword = encryptPassword(newPassword);
    let updated = false;

    users = users.map(user => {
        if (user.email === email) {
            user.password = hashedPassword;
            updated = true;
        }
        return user;
    });

    admins = admins.map(admin => {
        if (admin.email === email) {
            admin.password = hashedPassword;
            updated = true;
        }
        return admin;
    });

    if (updated) {
        localStorage.setItem("bookstoreUsers", JSON.stringify(users));
        localStorage.setItem("bookstoreAdmins", JSON.stringify(admins));
        showMessage("resetSuccess", "Password updated successfully!", true);
        setTimeout(closeResetPopup, 2000);
    } else {
        showMessage("resetError", "Email not found!", false);
    }
}


window.addEventListener('DOMContentLoaded', function() {
    imageSlider.style.backgroundImage = `url(${libraryImages[currentImageIndex]})`;
    setRandomQuotes();
    setInterval(changeImage, 5000);

    const savedUser = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));
    if (savedUser) {
        let redirectPage = "#";
        if (savedUser.role === "admin") {
            redirectPage = "adminPanel/html/noti.html";
        } else if (savedUser.role === "seller") {
            redirectPage = savedUser.status === "pending" ? "pending_approval.html" : "seller_dashboard/seller_dashboard-2.html";
        }
        window.location.href = redirectPage;
    }
});
function createStaticAdmin() {
    const admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];

    // لو لسه مفيش أدمين
    if (admins.length === 0) {
        const plainPassword = "Admin@123"; // الباسورد العادي
        const hashedPassword = CryptoJS.SHA256(plainPassword).toString(); // هاش

        const staticAdmin = {
            id: 1,
            fullName: "Static Admin",
            email: "admin@bookstore.com",
            password: hashedPassword,   // نخزن الهاش اللي هيستخدم في اللوجين
            passwordPlain: plainPassword, // نخزن كمان الباس العادي (للتجربة فقط)
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString()
        };

        admins.push(staticAdmin);
        localStorage.setItem("bookstoreAdmins", JSON.stringify(admins));
        console.log("✅ Static admin created:", staticAdmin);
    }
}
// 🔐 إضافة أدمن ثابت (Static Admin) في localStorage لو مش موجود
function createStaticAdmin() {
    const admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];

    // لو لسه مفيش أدمين
    if (admins.length === 0) {
        const plainPassword = "Admin@123"; // الباسورد العادي
        const hashedPassword = CryptoJS.SHA256(plainPassword).toString(); // هاش

        const staticAdmin = {
            id: 1,
            fullName: "Static Admin",
            email: "admin@bookstore.com",
            password: hashedPassword,   // نخزن الهاش اللي هيستخدم في اللوجين
            passwordPlain: plainPassword, // نخزن كمان الباس العادي (للتجربة فقط)
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString()
        };

        admins.push(staticAdmin);
        localStorage.setItem("bookstoreAdmins", JSON.stringify(admins));
        console.log("✅ Static admin created:", staticAdmin);
    }
}

// ننده الفانكشن دي أول ما الصفحة تفتح
(function createStaticAdmin() {
    const admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];
if (admins.length === 0) {
        const plainPassword = "Admin@123"; // الباسورد العادي
        const hashedPassword = CryptoJS.SHA256(plainPassword).toString(); // هاش

        const staticAdmin = {
            id: 1,
            fullName: "Admin1",
            email: "admin@admin.com",
            password: hashedPassword,   // نخزن الهاش اللي هيستخدم في اللوجين
            passwordPlain: plainPassword, // نخزن كمان الباس العادي (للتجربة فقط)
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString()
        };

        admins.push(staticAdmin);
        localStorage.setItem("bookstoreAdmins", JSON.stringify(admins));
        console.log("✅ Static admin created:", staticAdmin);
    }
})()


// ننده الفانكشن دي أول ما الصفحة تفتح
// 🔐 إضافة أدمن ثابت (Static Admin) في localStorage لو مش موجود
function createStaticAdmin() {
    const admins = JSON.parse(localStorage.getItem("bookstoreAdmins")) || [];

    // لو لسه مفيش أدمين
    if (admins.length === 0) {
        const plainPassword = "Admin@123"; // الباسورد العادي
        const hashedPassword = CryptoJS.SHA256(plainPassword).toString(); // هاش

        const staticAdmin = {
            id: 1,
            fullName: "Static Admin",
            email: "admin@bookstore.com",
            password: hashedPassword,   // نخزن الهاش اللي هيستخدم في اللوجين
            passwordPlain: plainPassword, // نخزن كمان الباس العادي (للتجربة فقط)
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString()
        };

        admins.push(staticAdmin);
        localStorage.setItem("bookstoreAdmins", JSON.stringify(admins));
        console.log("✅ Static admin created:", staticAdmin);
    }
}


