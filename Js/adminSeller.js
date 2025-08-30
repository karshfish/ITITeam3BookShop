// Example users in localStorage
// localStorage.setItem('users', JSON.stringify([
//   { id: 'U001', name: 'John Doe', role: 'buyer', status: 'active' },
//   { id: 'U002', name: 'Mary Smith', role: 'seller', status: 'inactive' },
//   { id: 'U003', name: 'Alex Brown', role: 'buyer', status: 'active' }
// ]));

// Example seller requests in localStorage

// Load users from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('bookstoreUsers')) || [];
}

// Load seller requests from localStorage
function getSellerRequests() {
  return JSON.parse(localStorage.getItem('sellerRequests')) || [];
}

// Render Users Table
function renderUsersTable() {
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';
  const filter = document.getElementById('userFilter').value;
  getUsers().forEach(user => {
    if (filter !== 'all' && user.role !== filter) return;
    const tr = document.createElement('tr');
    tr.setAttribute('data-role', user.role);
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.fullName}</td>
      <td>${capitalize(user.role)}</td>
      <td class="${user.status === 'active' ? 'status-active' : 'status-inactive'}">${capitalize(user.status)}</td>
      <td class="text-center">
        <button class="btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'} toggle-status">
          ${user.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  bindUserEvents();
}

// Render Seller Requests Table
function renderSellerRequests() {
  const tbody = document.querySelector('#sellerApprovalTable tbody');
  tbody.innerHTML = '';
  getSellerRequests().forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td id ="ID">${req.id}</td>
      <td>${req.name}</td>
      <td>${capitalize(req.role)}</td>
      <td class="text-center">
        <button class="btn btn-primary btn-sm approve-seller">Approve as Seller</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  bindApprovalEvents();
}

// Toggle Status
function bindUserEvents() {
  document.querySelectorAll('.toggle-status').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      console.log(row)
      const userId = row.querySelector('td').textContent;
      console.log(userId)
      let users = getUsers();
      console.log(users)
      let user = users.find(u => u.id === +userId);
      console.log(user)
      user.status = (user.status === 'active') ? 'inactive' : 'active';
      localStorage.setItem('bookstoreUsers', JSON.stringify(users));
      renderUsersTable();
    });
  });
}

// Approve Seller
function bindApprovalEvents() {
  document.querySelectorAll('.approve-seller').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      const userId = row.querySelector('td').textContent;
      let users = getUsers();
      let requests = getSellerRequests();

      // Find request
      let req = requests.find(r => r.id === userId);
      if (req) {
        // Update in users list
        users.push({ id: req.id, name: req.name, role: 'seller', status: 'active' });
        // Remove from requests
        requests = requests.filter(r => r.id !== userId);
        localStorage.setItem('bookstoreUsers', JSON.stringify(users));
        localStorage.setItem('sellerRequests', JSON.stringify(requests));
        renderUsersTable();
        renderSellerRequests();
      }
    });
  });
}

// Utility: Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Filter event
document.getElementById('userFilter').addEventListener('change', renderUsersTable);

// Initial render
renderUsersTable();
renderSellerRequests();
