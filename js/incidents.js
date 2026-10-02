// ============================
// LOGIN CHECK
// ============================

const loggedIn = localStorage.getItem("serviceDeskLoggedIn");

if (loggedIn !== "true") {
    window.location.href = "index.html";
}

// ============================
// USER
// ============================

const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;

// ============================
// MOBILE SIDEBAR
// ============================

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// ============================
// LOGOUT
// ============================

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("serviceDeskLoggedIn");
    localStorage.removeItem("serviceDeskUser");
    window.location.href = "index.html";
});

// ============================
// DEFAULT INCIDENTS
// ============================

const defaultIncidents = [
    {
        number: "INC0011211",
        caller: "Enterprise Manager Connector",
        shortDescription: "CPU Utilization threshold exceeded",
        category: "Hardware",
        priority: "high",
        status: "active",
        state: "Open",
        assignmentGroup: "EMSampleGroup",
        assignedTo: "",
        impact: "2",
        urgency: "2",
        contactType: "Phone",
        location: "Grand Rapids",
        subcategory: "CPU",
        configurationItem: "",
        description: "CPU utilization crossed warning threshold",
        comments: "",
        workNotes: "",
        openedBy: "System Administrator",
        opened: "7/7/2015, 12:02:19 PM",
        createdAt: "7/7/2015, 12:02:19 PM"
    },
    {
        number: "INC0011210",
        caller: "Bangalore Office",
        shortDescription: "Network connectivity issue",
        category: "Network",
        priority: "critical",
        status: "progress",
        state: "In Progress",
        assignmentGroup: "Network Operations",
        assignedTo: "",
        impact: "1",
        urgency: "1",
        contactType: "Phone",
        location: "Bangalore",
        subcategory: "Connectivity",
        configurationItem: "",
        description: "Office network connection unavailable",
        comments: "",
        workNotes: "",
        openedBy: "System Administrator",
        opened: "7/7/2015, 11:30:00 AM",
        createdAt: "7/7/2015, 11:30:00 AM"
    },
    {
        number: "INC0011209",
        caller: "Microsoft Exchange",
        shortDescription: "Email service unavailable",
        category: "Software",
        priority: "medium",
        status: "resolved",
        state: "Resolved",
        assignmentGroup: "Messaging Team",
        assignedTo: "",
        impact: "2",
        urgency: "3",
        contactType: "Email",
        location: "Headquarters",
        subcategory: "Email",
        configurationItem: "",
        description: "Mail delivery temporarily unavailable",
        comments: "",
        workNotes: "",
        openedBy: "System Administrator",
        opened: "7/6/2015, 3:15:00 PM",
        createdAt: "7/6/2015, 3:15:00 PM"
    },
    {
        number: "INC0011208",
        caller: "Internal Applications",
        shortDescription: "Application login failure",
        category: "Application",
        priority: "medium",
        status: "active",
        state: "Open",
        assignmentGroup: "Application Support",
        assignedTo: "",
        impact: "2",
        urgency: "3",
        contactType: "Self-service",
        location: "Remote",
        subcategory: "Login",
        configurationItem: "",
        description: "Users unable to access application",
        comments: "",
        workNotes: "",
        openedBy: "System Administrator",
        opened: "7/6/2015, 10:00:00 AM",
        createdAt: "7/6/2015, 10:00:00 AM"
    },
    {
        number: "INC0011207",
        caller: "Production Database",
        shortDescription: "Database performance warning",
        category: "Database",
        priority: "high",
        status: "progress",
        state: "In Progress",
        assignmentGroup: "Database Team",
        assignedTo: "",
        impact: "1",
        urgency: "2",
        contactType: "Phone",
        location: "Data Center",
        subcategory: "Database",
        configurationItem: "",
        description: "Production database response time increased",
        comments: "",
        workNotes: "",
        openedBy: "System Administrator",
        opened: "7/5/2015, 2:45:00 PM",
        createdAt: "7/5/2015, 2:45:00 PM"
    },
    {
        number: "INC0011206",
        caller: "Data Center",
        shortDescription: "Server hardware failure",
        category: "Hardware",
        priority: "critical",
        status: "active",
        state: "Open",
        assignmentGroup: "Infrastructure",
        assignedTo: "",
        impact: "1",
        urgency: "1",
        contactType: "Phone",
        location: "Data Center",
        subcategory: "CPU",
        configurationItem: "",
        description: "Production server reporting hardware fault",
        comments: "",
        workNotes: "",
        openedBy: "System Administrator",
        opened: "7/5/2015, 9:20:00 AM",
        createdAt: "7/5/2015, 9:20:00 AM"
    }
];

// ============================
// INITIALIZE STORAGE
// ============================

function initializeIncidents() {
    const existing = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];

    if (existing.length === 0) {
        localStorage.setItem("serviceDeskIncidents", JSON.stringify(defaultIncidents));
        localStorage.setItem("lastIncidentNumber", "1211");
        return defaultIncidents;
    }

    // Merge: ensure defaults exist but don't overwrite user-created
    const existingNumbers = new Set(existing.map(i => i.number));
    const merged = [...existing];

    defaultIncidents.forEach(def => {
        if (!existingNumbers.has(def.number)) {
            merged.push(def);
        }
    });

    localStorage.setItem("serviceDeskIncidents", JSON.stringify(merged));
    return merged;
}

let allIncidents = initializeIncidents();

// ============================
// RENDER TABLE
// ============================

const table = document.getElementById("incidentTable");
const resultCount = document.getElementById("resultCount");
const totalCount = document.getElementById("totalCount");

function getPriorityLabel(p) {
    if (p === "critical") return "Critical";
    if (p === "high") return "High";
    if (p === "medium") return "Medium";
    return p;
}

function getStatusClass(s) {
    if (s === "active") return "active";
    if (s === "progress") return "progress";
    if (s === "resolved") return "resolved";
    return "active";
}

function getStatusLabel(s) {
    if (s === "active") return "Active";
    if (s === "progress") return "In Progress";
    if (s === "resolved") return "Resolved";
    return s;
}

function renderTable(incidents) {
    table.innerHTML = "";

    incidents.forEach(inc => {
        const row = document.createElement("tr");
        row.dataset.status = inc.status;
        row.dataset.priority = inc.priority;
        row.dataset.search = `${inc.number} ${inc.shortDescription} ${inc.caller} ${inc.assignmentGroup} ${inc.category}`.toLowerCase();

        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>
                <a href="incident.html" class="incident-number" data-number="${inc.number}">
                    ${inc.number}
                </a>
            </td>
            <td>
                <div class="description">
                    <strong>${inc.shortDescription}</strong>
                    <span>${inc.category}</span>
                    ${inc.source === "User Portal" ? '<span class="source-badge">SELF-SERVICE</span>' : ""}
                </div>
            </td>
            <td>${inc.caller}</td>
            <td><span class="priority ${inc.priority}">${getPriorityLabel(inc.priority)}</span></td>
            <td><span class="status ${getStatusClass(inc.status)}">${getStatusLabel(inc.status)}</span></td>
            <td>${inc.createdAt}</td>
        `;

        table.appendChild(row);
    });

    // Attach click handlers for incident links
    document.querySelectorAll(".incident-number").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const num = this.dataset.number;
            localStorage.setItem("selectedIncidentNumber", num);
            window.location.href = "incident.html";
        });
    });

    totalCount.textContent = incidents.length;
    resultCount.textContent = incidents.length;
}

renderTable(allIncidents);

// ============================
// SEARCH + FILTER
// ============================

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

function filterIncidents() {
    const search = searchInput.value.toLowerCase().trim();
    const status = statusFilter.value;
    const priority = priorityFilter.value;
    let visible = 0;

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
        const rowSearch = row.dataset.search || "";
        const rowStatus = row.dataset.status;
        const rowPriority = row.dataset.priority;

        const matchesSearch = rowSearch.includes(search);
        const matchesStatus = status === "all" || rowStatus === status;
        const matchesPriority = priority === "all" || rowPriority === priority;

        if (matchesSearch && matchesStatus && matchesPriority) {
            row.style.display = "";
            visible++;
        } else {
            row.style.display = "none";
        }
    });

    resultCount.textContent = visible;
}

searchInput.addEventListener("input", filterIncidents);
statusFilter.addEventListener("change", filterIncidents);
priorityFilter.addEventListener("change", filterIncidents);

// ============================
// CLEAR FILTERS
// ============================

document.getElementById("clearFilters").addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "all";
    priorityFilter.value = "all";
    filterIncidents();
});

// ============================
// SELECT ALL
// ============================

document.getElementById("selectAll").addEventListener("change", function () {
    const checkboxes = table.querySelectorAll("td input[type='checkbox']");
    checkboxes.forEach(box => {
        if (box.closest("tr").style.display !== "none") {
            box.checked = this.checked;
        }
    });
});

// ============================
// CREATE INCIDENT
// ============================

document.getElementById("createBtn").addEventListener("click", () => {
    window.location.href = "create-incident.html";
});

// ============================
// LIVE SYNC (cross-tab)
// ============================

window.addEventListener("storage", (event) => {
    if (event.key !== "serviceDeskIncidents") return;

    allIncidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
    renderTable(allIncidents);
    filterIncidents();
});
