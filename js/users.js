// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }
const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;
document.getElementById("mobileMenu").addEventListener("click", () => { document.getElementById("sidebar").classList.toggle("open"); });
document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("serviceDeskLoggedIn"); localStorage.removeItem("serviceDeskUser"); window.location.href = "index.html"; });

const defaultUsers = [
    { id: 1, name: "Admin User", email: "admin@company.com", department: "IT", role: "Administrator", status: "Active", lastLogin: "7/7/2025, 9:00 AM" },
    { id: 2, name: "Roshan Kumar", email: "roshan@company.com", department: "IT", role: "Service Desk Agent", status: "Active", lastLogin: "7/7/2025, 8:45 AM" },
    { id: 3, name: "Priya Sharma", email: "priya@company.com", department: "HR", role: "Manager", status: "Active", lastLogin: "7/6/2025, 5:30 PM" },
    { id: 4, name: "Amit Patel", email: "amit@company.com", department: "Engineering", role: "Employee", status: "Active", lastLogin: "7/7/2025, 8:30 AM" },
    { id: 5, name: "Neha Gupta", email: "neha@company.com", department: "Finance", role: "Employee", status: "Active", lastLogin: "7/5/2025, 4:15 PM" },
    { id: 6, name: "Vikram Singh", email: "vikram@company.com", department: "Operations", role: "Service Desk Agent", status: "Active", lastLogin: "7/7/2025, 7:50 AM" },
    { id: 7, name: "Ananya Reddy", email: "ananya@company.com", department: "Marketing", role: "Employee", status: "Inactive", lastLogin: "6/15/2025, 10:00 AM" },
    { id: 8, name: "Karthik Menon", email: "karthik@company.com", department: "IT", role: "Service Desk Agent", status: "Active", lastLogin: "7/6/2025, 9:15 AM" }
];

function initialize() {
    const existing = JSON.parse(localStorage.getItem("serviceDeskUsers")) || [];
    if (existing.length === 0) {
        localStorage.setItem("serviceDeskUsers", JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return existing;
}
let allUsers = initialize();
let nextId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;

const table = document.getElementById("userTable");
const resultCount = document.getElementById("resultCount");
const totalCount = document.getElementById("totalCount");

function renderTable(users) {
    table.innerHTML = "";
    users.forEach(u => {
        const row = document.createElement("tr");
        row.dataset.role = u.role;
        row.dataset.status = u.status;
        row.dataset.search = `${u.name} ${u.email} ${u.department} ${u.role}`.toLowerCase();
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td><span class="user-name">${u.name}</span></td>
            <td>${u.email}</td>
            <td>${u.department}</td>
            <td><span class="role ${u.role}">${u.role}</span></td>
            <td><span class="status ${u.status}">${u.status}</span></td>
            <td>${u.lastLogin}</td>
            <td>
                <div class="action-btns">
                    <button onclick="editUser(${u.id})">Edit</button>
                    <button class="toggle" onclick="toggleStatus(${u.id})">${u.status === "Active" ? "Deactivate" : "Activate"}</button>
                    <button class="danger" onclick="deleteUser(${u.id})">Delete</button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
    totalCount.textContent = users.length;
    resultCount.textContent = users.length;
}
renderTable(allUsers);

function filterUsers() {
    const s = document.getElementById("searchInput").value.toLowerCase().trim();
    const r = document.getElementById("roleFilter").value;
    const st = document.getElementById("statusFilter").value;
    let v = 0;
    table.querySelectorAll("tr").forEach(row => {
        const ok = (row.dataset.search||"").includes(s) && (r==="all"||row.dataset.role===r) && (st==="all"||row.dataset.status===st);
        row.style.display = ok ? "" : "none";
        if (ok) v++;
    });
    resultCount.textContent = v;
}
document.getElementById("searchInput").addEventListener("input", filterUsers);
document.getElementById("roleFilter").addEventListener("change", filterUsers);
document.getElementById("statusFilter").addEventListener("change", filterUsers);
document.getElementById("clearFilters").addEventListener("click", () => { document.getElementById("searchInput").value=""; document.getElementById("roleFilter").value="all"; document.getElementById("statusFilter").value="all"; filterUsers(); });
document.getElementById("selectAll").addEventListener("change", function(){ table.querySelectorAll("td input[type='checkbox']").forEach(b=>{ if(b.closest("tr").style.display!=="none") b.checked=this.checked; }); });

function showToast(m){ const t=document.getElementById("toast"); t.textContent=m; t.classList.add("show"); clearTimeout(wt); wt=setTimeout(()=>t.classList.remove("show"),2200); }
let wt;

const overlay = document.getElementById("modalOverlay");
const form = document.getElementById("userForm");
let editingId = null;

function openModal(title) {
    document.getElementById("modalTitle").textContent = title;
    overlay.classList.add("show");
}
function closeModal() { overlay.classList.remove("show"); form.reset(); editingId = null; }
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if(e.target===overlay) closeModal(); });

document.getElementById("createBtn").addEventListener("click", () => {
    editingId = null;
    document.getElementById("modalSubmitBtn").textContent = "Add User";
    openModal("Add User");
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
        name: document.getElementById("uName").value.trim(),
        email: document.getElementById("uEmail").value.trim(),
        department: document.getElementById("uDept").value,
        role: document.getElementById("uRole").value,
        status: document.getElementById("uStatus").value,
        lastLogin: "Never"
    };

    if (editingId) {
        const idx = allUsers.findIndex(u => u.id === editingId);
        if (idx !== -1) { allUsers[idx] = { ...allUsers[idx], ...data }; }
    } else {
        data.id = nextId++;
        allUsers.unshift(data);
    }
    localStorage.setItem("serviceDeskUsers", JSON.stringify(allUsers));
    renderTable(allUsers);
    closeModal();
    showToast(editingId ? "User updated." : "User added: " + data.name);
});

window.editUser = function(id) {
    const u = allUsers.find(x => x.id === id);
    if (!u) return;
    editingId = id;
    document.getElementById("modalSubmitBtn").textContent = "Update User";
    document.getElementById("uName").value = u.name;
    document.getElementById("uEmail").value = u.email;
    document.getElementById("uDept").value = u.department;
    document.getElementById("uRole").value = u.role;
    document.getElementById("uStatus").value = u.status;
    openModal("Edit User - " + u.name);
};

window.toggleStatus = function(id) {
    const idx = allUsers.findIndex(u => u.id === id);
    if (idx === -1) return;
    allUsers[idx].status = allUsers[idx].status === "Active" ? "Inactive" : "Active";
    localStorage.setItem("serviceDeskUsers", JSON.stringify(allUsers));
    renderTable(allUsers);
    showToast("User " + allUsers[idx].status.toLowerCase() + ".");
};

window.deleteUser = function(id) {
    const u = allUsers.find(x => x.id === id);
    if (!u || !confirm("Delete user " + u.name + "?")) return;
    allUsers = allUsers.filter(x => x.id !== id);
    localStorage.setItem("serviceDeskUsers", JSON.stringify(allUsers));
    renderTable(allUsers);
    showToast("User deleted.");
};
