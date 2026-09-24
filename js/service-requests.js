// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }

const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;

// MOBILE SIDEBAR
document.getElementById("mobileMenu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("serviceDeskLoggedIn");
    localStorage.removeItem("serviceDeskUser");
    window.location.href = "index.html";
});

// DEFAULT DATA
const defaultRequests = [
    { number: "REQ001001", requestedBy: "Roshan Kumar", type: "Hardware Request", description: "Need a new laptop for development work", priority: "high", status: "open", assignedGroup: "Hardware Team", createdAt: "7/5/2025, 10:00:00 AM" },
    { number: "REQ001002", requestedBy: "Priya Sharma", type: "Software Installation", description: "Install Adobe Creative Suite on workstation", priority: "medium", status: "in-progress", assignedGroup: "Software Team", createdAt: "7/4/2025, 2:30:00 PM" },
    { number: "REQ001003", requestedBy: "Amit Patel", type: "Account Access", description: "Request access to Salesforce CRM", priority: "high", status: "open", assignedGroup: "Access Management", createdAt: "7/3/2025, 9:15:00 AM" },
    { number: "REQ001004", requestedBy: "Neha Gupta", type: "Email Access", description: "Set up email forwarding for new department", priority: "medium", status: "completed", assignedGroup: "Messaging Team", createdAt: "7/2/2025, 11:45:00 AM" },
    { number: "REQ001005", requestedBy: "Vikram Singh", type: "Network Access", description: "VPN access for remote work setup", priority: "low", status: "open", assignedGroup: "Network Operations", createdAt: "7/1/2025, 3:00:00 PM" },
    { number: "REQ001006", requestedBy: "Ananya Reddy", type: "New Equipment", description: "Dual monitor setup for design team", priority: "medium", status: "in-progress", assignedGroup: "Hardware Team", createdAt: "6/30/2025, 10:20:00 AM" }
];

// INITIALIZE
function initializeRequests() {
    const existing = JSON.parse(localStorage.getItem("serviceDeskRequests")) || [];
    if (existing.length === 0) {
        localStorage.setItem("serviceDeskRequests", JSON.stringify(defaultRequests));
        localStorage.setItem("lastRequestNumber", "1006");
        return defaultRequests;
    }
    return existing;
}

let allRequests = initializeRequests();

// RENDER
const table = document.getElementById("requestTable");
const resultCount = document.getElementById("resultCount");
const totalCount = document.getElementById("totalCount");

function getPriorityClass(p) { return p; }
function getStatusClass(s) { return s; }

function renderTable(requests) {
    table.innerHTML = "";
    requests.forEach(req => {
        const row = document.createElement("tr");
        row.dataset.status = req.status;
        row.dataset.priority = req.priority;
        row.dataset.search = `${req.number} ${req.requestedBy} ${req.type} ${req.description} ${req.assignedGroup}`.toLowerCase();
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td><span class="req-number" style="color:var(--primary);font-weight:600;cursor:pointer" data-number="${req.number}">${req.number}</span></td>
            <td>${req.requestedBy}</td>
            <td><div class="description"><strong>${req.type}</strong></div></td>
            <td><div class="description"><strong>${req.description}</strong></div></td>
            <td><span class="priority ${getPriorityClass(req.priority)}">${req.priority.charAt(0).toUpperCase()+req.priority.slice(1)}</span></td>
            <td><span class="status ${getStatusClass(req.status)}">${req.status.charAt(0).toUpperCase()+req.status.slice(1).replace('-',' ')}</span></td>
            <td>${req.assignedGroup}</td>
            <td>${req.createdAt}</td>
            <td>
                <div class="action-btns">
                    <button onclick="viewRequest('${req.number}')">View</button>
                    <button onclick="editRequest('${req.number}')">Edit</button>
                    <button class="danger" onclick="closeRequest('${req.number}')">Close</button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
    totalCount.textContent = requests.length;
    resultCount.textContent = requests.length;
}

renderTable(allRequests);

// SEARCH + FILTER
function filterRequests() {
    const search = document.getElementById("searchInput").value.toLowerCase().trim();
    const status = document.getElementById("statusFilter").value;
    const priority = document.getElementById("priorityFilter").value;
    let visible = 0;
    table.querySelectorAll("tr").forEach(row => {
        const matchSearch = (row.dataset.search || "").includes(search);
        const matchStatus = status === "all" || row.dataset.status === status;
        const matchPriority = priority === "all" || row.dataset.priority === priority;
        if (matchSearch && matchStatus && matchPriority) { row.style.display = ""; visible++; }
        else { row.style.display = "none"; }
    });
    resultCount.textContent = visible;
}

document.getElementById("searchInput").addEventListener("input", filterRequests);
document.getElementById("statusFilter").addEventListener("change", filterRequests);
document.getElementById("priorityFilter").addEventListener("change", filterRequests);
document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "all";
    document.getElementById("priorityFilter").value = "all";
    filterRequests();
});

document.getElementById("selectAll").addEventListener("change", function () {
    table.querySelectorAll("td input[type='checkbox']").forEach(box => {
        if (box.closest("tr").style.display !== "none") box.checked = this.checked;
    });
});

// TOAST
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// MODAL
const overlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const form = document.getElementById("requestForm");
let editingNumber = null;

function openModal(title, number) {
    modalTitle.textContent = title;
    editingNumber = number || null;
    document.getElementById("modalSubmitBtn").textContent = number ? "Update Request" : "Create Request";
    overlay.classList.add("show");
}

function closeModal() {
    overlay.classList.remove("show");
    form.reset();
    editingNumber = null;
    document.getElementById("reqGroup").value = "Service Desk";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

document.getElementById("createBtn").addEventListener("click", () => {
    let lastNum = parseInt(localStorage.getItem("lastRequestNumber")) || 1006;
    lastNum++;
    document.getElementById("reqNumber").value = "REQ" + String(lastNum).padStart(6, "0");
    localStorage.setItem("lastRequestNumber", lastNum);
    openModal("Create Service Request");
});

// FORM SUBMIT
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const now = new Date().toLocaleString();
    const data = {
        number: document.getElementById("reqNumber").value,
        requestedBy: document.getElementById("reqBy").value.trim(),
        type: document.getElementById("reqType").value,
        description: document.getElementById("reqDesc").value.trim(),
        priority: document.getElementById("reqPriority").value,
        status: "open",
        assignedGroup: document.getElementById("reqGroup").value.trim(),
        createdAt: editingNumber ? allRequests.find(r=>r.number===editingNumber).createdAt : now
    };

    if (editingNumber) {
        const idx = allRequests.findIndex(r => r.number === editingNumber);
        if (idx !== -1) { allRequests[idx] = { ...allRequests[idx], ...data, status: allRequests[idx].status }; }
    } else {
        allRequests.unshift(data);
    }

    localStorage.setItem("serviceDeskRequests", JSON.stringify(allRequests));
    renderTable(allRequests);
    closeModal();
    showToast(editingNumber ? "Request updated." : "Request created: " + data.number);
});

// VIEW / EDIT / CLOSE
window.viewRequest = function(num) {
    const req = allRequests.find(r => r.number === num);
    if (!req) return;
    openModal("View Service Request - " + num, num);
    document.getElementById("reqNumber").value = req.number;
    document.getElementById("reqBy").value = req.requestedBy;
    document.getElementById("reqType").value = req.type;
    document.getElementById("reqDesc").value = req.description;
    document.getElementById("reqPriority").value = req.priority;
    document.getElementById("reqGroup").value = req.assignedGroup;
};

window.editRequest = function(num) {
    const req = allRequests.find(r => r.number === num);
    if (!req) return;
    openModal("Edit Service Request - " + num, num);
    document.getElementById("reqNumber").value = req.number;
    document.getElementById("reqBy").value = req.requestedBy;
    document.getElementById("reqType").value = req.type;
    document.getElementById("reqDesc").value = req.description;
    document.getElementById("reqPriority").value = req.priority;
    document.getElementById("reqGroup").value = req.assignedGroup;
};

window.closeRequest = function(num) {
    if (!confirm("Close request " + num + "?")) return;
    const idx = allRequests.findIndex(r => r.number === num);
    if (idx !== -1) {
        allRequests[idx].status = "closed";
        localStorage.setItem("serviceDeskRequests", JSON.stringify(allRequests));
        renderTable(allRequests);
        showToast("Request " + num + " closed.");
    }
};
