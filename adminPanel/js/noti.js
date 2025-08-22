

// Get admin name from localStorage or sessionStorage
// const currentAdmin = JSON.parse(localStorage.getItem("currentUser")) ||
//     JSON.parse(sessionStorage.getItem("currentUser"));

// const adminNameElement = document.getElementById("adminName");
// if (adminNameElement) {
//     if (currentAdmin && currentAdmin.role === "admin") {
//         adminNameElement.innerHTML = `
//             <h4>${currentAdmin.fullName || "Admin"}</h4>
//             <span>System Admin</span>
//         `;
//     } else {
//         adminNameElement.innerHTML = `
//             <h4>Admin not defined</h4>
//             <span>System Admin</span>
//         `;
//     }
// }

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    if (sidebar && mainContent) {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("collapsed");
    }
}

// Page logic
document.addEventListener("DOMContentLoaded", () => {
    // Chart initialization
    const initializeCharts = () => {
        const salesCanvas = document.getElementById("salesChart");
        if (salesCanvas) {
            new Chart(salesCanvas.getContext("2d"), {
                type: "line",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [{
                        label: "Monthly Sales",
                        data: [12000, 19000, 15000, 22000, 25000, 28000],
                        backgroundColor: "rgba(67, 97, 238, 0.1)",
                        borderColor: "#4361ee",
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const usersCanvas = document.getElementById("usersChart");
        if (usersCanvas) {
            new Chart(usersCanvas.getContext("2d"), {
                type: "bar",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [
                        {
                            label: "New Users",
                            data: [150, 220, 180, 300, 350, 400],
                            backgroundColor: "#4895ef",
                            borderRadius: 6
                        },
                        {
                            label: "New Sellers",
                            data: [20, 35, 25, 45, 50, 60],
                            backgroundColor: "#3f37c9",
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: "top", labels: { usePointStyle: true, pointStyle: "circle" } } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    };

    // LocalStorage keys
    const STORAGE_KEYS = {
        DASHBOARD_DATA: "bookstore_dashboard_data",
        NOTIFICATIONS: "bookstore_notifications",
        ORDERS: "bookstore_orders",
        STATS: "bookstore_stats",
        USERS: "bookstoreUsers",
        PRODUCTS: "products",
        Order: "order"
    };

    // Fetch data from localStorage with error handling
    const fetchLocalData = () => {
        try {
            return {
                dashboardData: JSON.parse(localStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA) || "{}"),
                notifications: JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]"),
                orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]"),
                stats: JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || "{}"),
                users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]"),
                products: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"),
                order: JSON.parse(localStorage.getItem(STORAGE_KEYS.Order) || "[]")
            };
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
            return {
                dashboardData: {},
                notifications: [],
                orders: [],
                stats: {},
                users: [],
                products: [],
                order: []
            };
        }
    };

    // Update stat card
    const updateStatCard = (index, value) => {
        const card = document.querySelector(`.stat-card:nth-child(${index})`);
        if (card) {
            card.querySelector(".number").textContent = value;
        }
    };

    // Update notifications badge
    const updateUnreadNotificationsBadge = (notifications) => {
        const badge = document.querySelector(".notifications .badge");
        if (!badge) return;
        const unreadCount = notifications.filter(n => n.isNew).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? "flex" : "none";
    };

    // Render notifications (limited to 3)
    const renderNotifications = (list) => {
        const container = document.getElementById("notificationsList");
        if (!container) return;
        container.innerHTML = list.length ? "" : "<p class='no-notifications'>No new notifications</p>";

        list.slice(0, 3).forEach(notification => {
            const el = document.createElement("div");
            el.className = "notification";
            el.innerHTML = `
                <div class="notification-avatar">
                    <i class="${notification.icon || 'fas fa-bell'}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        ${notification.title || ""}
                        ${notification.isNew ? '<span class="badge">New</span>' : ""}
                    </div>
                    <div class="notification-message">${notification.message || ""}</div>
                    <div class="notification-time">
                        <i class="far fa-clock"></i> ${notification.time || ""}
                    </div>
                </div>
                <div class="notification-actions">
                    ${Array.isArray(notification.actions) ?
                    notification.actions.map(a => `<button title="${a.title}" aria-label="${a.title}"><i class="${a.icon}"></i></button>`).join("") :
                    ""}
                </div>`;
            container.appendChild(el);
        });
    };

    // Render orders (limited to 3)
    let orderInfo = JSON.parse(localStorage.getItem('order')) || [];
    const updateOrdersTable = (orders) => {
        const tbody = document.getElementById("ordersTbody");
        if (!tbody) return;
        tbody.innerHTML = orders.length ? "" : "<tr><td colspan='6' class='no-orders'>No recent orders</td></tr>";

        orderInfo.forEach((order, index) => {
            order.book_info.forEach(book => {
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><img src="${book.covers?.large || ''}" alt="" width="50">  ${book.title || "N/A"}</td>
                        <td>${order.form_info.inputFName || "N/A"} ${order.form_info.inputLName || "N/A"}</td>
                        <td>${order.order_date}</td>
                        <td>${order.fullName || "N/A"}</td>
                        <td><span class="badge bg-info">Processing</span></td>
                        <td><a href="#" data-bs-toggle="modal" data-bs-target="#orderDetailsModal" data-bs-index="${index}" class="view-details">Details</a></td>
                    </tr>
                `;
            });
        });
    };

    // Append user notifications
    const appendNewUsersNotifications = (users) => {
        const list = document.getElementById("notificationsList");
        if (!list) return;

        users.filter(u => u.role !== "seller").slice(0, 3).forEach(user => {
            const userName = user.name || user.fullName || "Unknown User";
            const userEmail = user.email || "No email";
            const joinTime = new Date(user.joinDate || user.createdAt || Date.now());
            const timeText = formatTimeDifference(joinTime);

            const el = document.createElement("div");
            el.className = "notification";
            el.innerHTML = `
                <div class="notification-avatar"><i class="fas fa-user"></i></div>
                <div class="notification-content">
                    <div class="notification-title">New User <span class="badge">New</span></div>
                    <div class="notification-message">${userName} (${userEmail}) has registered.</div>
                    <div class="notification-time"><i class="far fa-clock"></i> ${timeText}</div>
                </div>`;
            list.appendChild(el);
        });
    };

    // Append approved sellers notifications
    const appendApprovedSellersNotifications = (users) => {
        const list = document.getElementById("notificationsList");
        if (!list) return;

        users.filter(u => u.role === "seller" && u.status === "active").slice(0, 3).forEach(seller => {
            const sellerName = seller.name || seller.fullName || "Unknown Seller";
            const sellerEmail = seller.email || "No email";
            const joinTime = new Date(seller.createdAt || seller.joinDate || Date.now());
            const timeText = formatTimeDifference(joinTime);

            const el = document.createElement("div");
            el.className = "notification";
            el.innerHTML = `
                <div class="notification-avatar"><i class="fas fa-user-tie"></i></div>
                <div class="notification-content">
                    <div class="notification-title">New Seller <span class="badge">New</span></div>
                    <div class="notification-message">${sellerName} (${sellerEmail}) has been approved as a seller.</div>
                    <div class="notification-time"><i class="far fa-clock"></i> ${timeText}</div>
                </div>`;
            list.appendChild(el);
        });
    };

    // Append pending books notifications
    const appendPendingBooksNotifications = (books) => {
        const list = document.getElementById("notificationsList");
        if (!list) return;

        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
        books.filter(b => b.status === "pending").slice(0, 3).forEach(book => {
            const bookName = book.title || "Unknown Book";
            const bookPrice = book.price ? `$${book.price}` : "Unknown price";
            const bookCreatedDate = book.createdAt || "Just now";
            const seller = users.find(u => u.id === book.sellerId);
            const sellerEmail = seller ? seller.email : "Unknown Email";

            const el = document.createElement("div");
            el.className = "notification";
            el.innerHTML = `
                <div class="notification-avatar"><i class="fas fa-book"></i></div>
                <div class="notification-content">
                    <div class="notification-title">Pending Book <span class="badge">New</span></div>
                    <div class="notification-message">${bookName} by ${sellerEmail} priced at ${bookPrice}</div>
                    <div class="notification-time"><i class="far fa-clock"></i> ${bookCreatedDate}</div>
                </div>`;
            list.appendChild(el);
        });
    };

    // Append approved books notifications
    const appendApprovedBooksNotifications = (books) => {
        const list = document.getElementById("notificationsList");
        if (!list) return;

        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
        books.filter(b => b.status === "approved").slice(0, 3).forEach(book => {
            const bookName = book.title || "Unknown Book";
            const bookPrice = book.price ? `$${book.price}` : "Unknown price";
            const bookCreatedDate = book.createdAt || "Just now";
            const seller = users.find(u => u.id === book.sellerId);
            const sellerEmail = seller ? seller.email : "Unknown Email";

            const el = document.createElement("div");
            el.className = "notification";
            el.innerHTML = `
                <div class="notification-avatar"><i class="fas fa-book"></i></div>
                <div class="notification-content">
                    <div class="notification-title">Approved Book <span class="badge">New</span></div>
                    <div class="notification-message">${bookName} by ${sellerEmail} priced at ${bookPrice}</div>
                    <div class="notification-time"><i class="far fa-clock"></i> ${bookCreatedDate}</div>
                </div>`;
            list.appendChild(el);
        });
    };

    // Format time difference
    const formatTimeDifference = (date) => {
        if (!date || isNaN(date.getTime())) return "Just now";
        const now = new Date();
        const diffMs = now - date;
        if (diffMs < 60_000) return "Just now";
        if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} minutes ago`;
        if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)} hours ago`;
        return `${Math.floor(diffMs / 86_400_000)} days ago`;
    };

    // Initialize sample data
    // const initializeSampleData = () => {
    //     if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    //         const sample = {
    //             stats: {
    //                 pendingBooks: 18,
    //             },
    //             notifications: [
    //                 {
    //                     icon: "fas fa-user-tie",
    //                     title: "New Seller",
    //                     isNew: true,
    //                     message: "John Doe has registered as a new seller. Please review their documents.",
    //                     time: "15 minutes ago",
    //                     actions: [{ title: "Details", icon: "fas fa-eye" }]
    //                 },
    //                 {
    //                     icon: "fas fa-book",
    //                     title: "New Book Needs Review",
    //                     message: "Seller Jane Smith added a new book \"JavaScript Fundamentals\" priced at $85.",
    //                     time: "2 hours ago"
    //                 }
    //             ],
    //             orders: [
    //                 { id: "4587", customer: "Alex Johnson", date: "2023-06-15", amount: "$245", status: "Processing" },
    //                 { id: "4586", customer: "Maria Garcia", date: "2023-06-15", amount: "$180", status: "Pending" },
    //                 { id: "4585", customer: "James Wilson", date: "2023-06-14", amount: "$320", status: "Completed" },
    //                 { id: "4584", customer: "Sarah Miller", date: "2023-06-14", amount: "$150", status: "Cancelled" }
    //             ],
    //             users: [
    //                 { id: 1, name: "Basel Essam", email: "basel@example.com", role: "user", joinDate: "2025-08-15T10:20:00" , status:'active'},
    //                 { id: 2, name: "Ali Hassan", email: "ali@example.com", role: "seller", status: "active", joinDate: "2025-08-15T09:45:00" }
    //             ],
    //             products: [
    //                 { id: 1, title: "JavaScript Fundamentals", sellerId: 2, status: "pending", price: 85, createdAt: "2025-08-15T08:00:00" },
    //                 { id: 2, title: "Advanced CSS", sellerId: 2, status: "approved", price: 60, createdAt: "2025-08-14T14:30:00" }
    //             ]
    //         };
    //         localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(sample.stats));
    //         localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(sample.notifications));
    //         localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sample.orders));
    //         localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sample.users));
    //         localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sample.products));
    //     }
    // };

    // Update dashboard
    const updateDashboardWithLocalData = () => {
        const localData = fetchLocalData();

        // Update stats cards
        const sellersCount = localData.users.filter(u => u.role === "seller" && u.status === "active").length;
        const usersCount = localData.users.filter(u => u.status === "active").length;
        const pendingBooksCount = localData.products.filter(b => b.status === "pending").length;
        const approvedBooksCount = localData.products.filter(b => b.status === "approved").length;
        updateStatCard(1, sellersCount);
        updateStatCard(2, usersCount);
        updateStatCard(3, pendingBooksCount);
        updateStatCard(4, approvedBooksCount);

        // Clear existing notifications to avoid duplicates
        const notificationsList = document.getElementById("notificationsList");
        if (notificationsList) notificationsList.innerHTML = "";

        // Render notifications
        renderNotifications(localData.notifications);
        appendNewUsersNotifications(localData.users);
        appendApprovedSellersNotifications(localData.users);
        appendPendingBooksNotifications(localData.products);
        appendApprovedBooksNotifications(localData.products);
        updateUnreadNotificationsBadge(localData.notifications);

        // Update orders
        updateOrdersTable(localData.orders);
    };

    // Initialize page
    const initializePage = () => {
        // initializeSampleData();
        initializeCharts();
        updateDashboardWithLocalData();
    };

    // Handle localStorage changes from other tabs
    window.addEventListener("storage", (event) => {
        if (Object.values(STORAGE_KEYS).includes(event.key)) {
            updateDashboardWithLocalData();
        }
    });

    // Expose helpers for debugging
    window.DASH = {
        // seed: initializeSampleData,
        refresh: updateDashboardWithLocalData,
        fetchData: fetchLocalData
    };

    // Run initialization
    initializePage();
});  // ✅ هنا القوس الناقص
