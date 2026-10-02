// =========================================
// PORTAL DASHBOARD
// =========================================

var user = Portal.requireLogin("index.html");

// ---- Header ----
document.getElementById("userName").textContent = user.name;
document.getElementById("profileName").textContent = user.name;
document.getElementById("avatar").textContent = Portal.initials(user.name);

// ---- Mobile sidebar ----
document.getElementById("mobileMenu").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open");
});

// ---- Logout ----
document.getElementById("logoutBtn").addEventListener("click", function () {
    Portal.logout();
});

// ---- Report ----
document.getElementById("reportBtn").addEventListener("click", function () {
    window.location.href = "report.html";
});

// =========================================
// LOAD DATA
// =========================================

function openTicket(number) {
    localStorage.setItem(Portal.STORAGE.selected, number);
    window.location.href = "ticket.html";
}

function loadDashboard() {
    var tickets = Portal.myTickets();

    var open = tickets.filter(function (t) { return t.status === "active"; }).length;
    var progress = tickets.filter(function (t) { return t.status === "progress"; }).length;
    var resolved = tickets.filter(function (t) { return t.status === "resolved"; }).length;

    document.getElementById("statOpen").textContent = open;
    document.getElementById("statProgress").textContent = progress;
    document.getElementById("statResolved").textContent = resolved;
    document.getElementById("statTotal").textContent = tickets.length;
    document.getElementById("navTicketCount").textContent = tickets.length;

    var list = document.getElementById("recentTickets");
    list.innerHTML = "";

    var recent = tickets.slice(0, 5);

    recent.forEach(function (ticket) {
        var row = document.createElement("div");
        row.className = "ticket-row";
        row.innerHTML =
            '<div class="ticket-id">' + Portal.escapeHTML(ticket.number) + '</div>' +
            '<div class="ticket-description">' +
                '<strong>' + Portal.escapeHTML(ticket.shortDescription) + '</strong>' +
                '<span>' + Portal.escapeHTML(ticket.category) +
                    (ticket.subcategory && ticket.subcategory !== "-- None --" ? " · " + Portal.escapeHTML(ticket.subcategory) : "") +
                '</span>' +
            '</div>' +
            '<span class="priority ' + Portal.escapeHTML(ticket.priority) + '">' + Portal.priorityLabel(ticket.priority) + '</span>' +
            '<span class="status ' + Portal.statusClass(ticket.status) + '">' + Portal.statusLabel(ticket.status) + '</span>' +
            '<span class="ticket-arrow">›</span>';

        row.addEventListener("click", function () {
            openTicket(ticket.number);
        });

        list.appendChild(row);
    });

    if (recent.length === 0) {
        list.innerHTML =
            '<div class="empty-state">' +
                '<span class="big">✓</span>' +
                'You have no tickets yet.<br>' +
                '<button class="create-btn primary empty-btn" onclick="window.location.href=\'report.html\'">' +
                '<span>+</span>Report your first incident</button>' +
            '</div>';
    }
}

loadDashboard();

// =========================================
// LIVE SYNC (cross-tab)
// =========================================

function ticketsSnapshot() {
    return Portal.myTickets().map(function (t) {
        return t.number + ":" + t.status;
    }).join("|");
}

var lastSnapshot = ticketsSnapshot();

window.addEventListener("storage", function (event) {
    if (event.key !== Portal.STORAGE.incidents) return;

    var snapshot = ticketsSnapshot();
    var changed = snapshot !== lastSnapshot;

    lastSnapshot = snapshot;
    loadDashboard();

    if (changed) {
        Portal.showToast("Your ticket status just changed — check My Tickets.");
    }
});