// ============================
// CHECK LOGIN
// ============================

const loggedIn = localStorage.getItem("serviceDeskLoggedIn");

if (loggedIn !== "true") {
    window.location.href = "index.html";
}

// ============================
// USER
// ============================

const username = localStorage.getItem("serviceDeskUser") || "Admin";

document.getElementById("userName").textContent = username;
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
// CREATE INCIDENT
// ============================

document.getElementById("createIncident").addEventListener("click", () => {
    window.location.href = "create-incident.html";
});

// ============================
// LOAD DASHBOARD DATA
// ============================

function loadDashboardData() {
    const incidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];

    // Calculate stats
    const total = incidents.length;
    const open = incidents.filter(i => i.status === "active").length;
    const inProgress = incidents.filter(i => i.status === "progress").length;
    const resolved = incidents.filter(i => i.status === "resolved").length;
    const critical = incidents.filter(i => i.priority === "critical").length;

    // Update stat cards
    const statValues = document.querySelectorAll(".stat-info strong");
    if (statValues.length >= 4) {
        statValues[0].textContent = open;
        statValues[1].textContent = inProgress;
        statValues[2].textContent = resolved;
        statValues[3].textContent = critical;
    }

    // Update incident count in sidebar
    const incCount = document.getElementById("incCount");
    if (incCount) {
        incCount.textContent = total;
    }

    // Load recent incidents
    const incidentList = document.querySelector(".incident-list");
    if (incidentList) {
        incidentList.innerHTML = "";

        const recent = incidents.slice(0, 5);

        recent.forEach(inc => {
            const row = document.createElement("div");
            row.className = "incident-row";

            const priorityClass = inc.priority;
            const statusClass = inc.status;

            let statusLabel = "Active";
            if (inc.status === "progress") statusLabel = "In Progress";
            else if (inc.status === "resolved") statusLabel = "Resolved";

            let priorityLabel = "Medium";
            if (inc.priority === "critical") priorityLabel = "Critical";
            else if (inc.priority === "high") priorityLabel = "High";

            row.innerHTML = `
                <div class="incident-id">${inc.number}</div>
                <div class="incident-description">
                    <strong>${inc.shortDescription}</strong>
                    <span>${inc.caller}${inc.source === "User Portal" ? ' · <span class="source-badge">SELF-SERVICE</span>' : ""}</span>
                </div>
                <span class="priority ${priorityClass}">${priorityLabel}</span>
                <span class="status ${statusClass}">${statusLabel}</span>
            `;

            row.style.cursor = "pointer";
            row.addEventListener("click", () => {
                localStorage.setItem("selectedIncidentNumber", inc.number);
                window.location.href = "incident.html";
            });

            incidentList.appendChild(row);
        });

        if (recent.length === 0) {
            incidentList.innerHTML = '<div style="padding:20px;text-align:center;color:#71808a;">No incidents found</div>';
        }
    }
}

loadDashboardData();

// ============================
// LIVE SYNC (cross-tab)
// ============================

const toast = document.getElementById("toast");
const notifDot = document.querySelector(".notification-dot");

function newestNumber() {
    const store = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
    return store.length ? store[0].number : "none";
}

let lastNewest = newestNumber();

function showToast(message, isNew) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("new", !!isNew);
    toast.classList.add("show");
    clearTimeout(window.adminToastTimer);
    window.adminToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

window.addEventListener("storage", (event) => {
    if (event.key !== "serviceDeskIncidents") return;

    const fresh = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
    const current = fresh.length ? fresh[0].number : "none";

    // Flash notification + toast only when a brand-new ticket arrives
    if (current !== "none" && current !== lastNewest) {
        if (notifDot) notifDot.style.display = "block";
        showToast("New incident reported by a user. Check Incidents.", true);
    }

    lastNewest = current;
    loadDashboardData();
});
