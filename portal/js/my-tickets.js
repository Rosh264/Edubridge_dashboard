// =========================================
// PORTAL MY TICKETS
// =========================================

var user = Portal.requireLogin("index.html");

document.getElementById("profileName").textContent = user.name;
document.getElementById("avatar").textContent = Portal.initials(user.name);

document.getElementById("mobileMenu").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open");
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    Portal.logout();
});

document.getElementById("reportBtn").addEventListener("click", function () {
    window.location.href = "report.html";
});

// ---- Data ----
var list = document.getElementById("ticketList");
var statusFilter = document.getElementById("statusFilter");

function render() {
    var filter = statusFilter.value;
    var tickets = Portal.myTickets().filter(function (t) {
        return filter === "all" || t.status === filter;
    });

    document.getElementById("totalCount").textContent = tickets.length;
    document.getElementById("navTicketCount").textContent = Portal.myTickets().length;
    list.innerHTML = "";

    tickets.forEach(function (ticket) {
        var row = document.createElement("div");
        row.className = "ticket-row";
        row.innerHTML =
            '<div class="ticket-id">' + Portal.escapeHTML(ticket.number) + '</div>' +
            '<div class="ticket-description">' +
                '<strong>' + Portal.escapeHTML(ticket.shortDescription) + '</strong>' +
                '<span>' + Portal.escapeHTML(ticket.category) +
                    (ticket.subcategory && ticket.subcategory !== "-- None --" ? " · " + Portal.escapeHTML(ticket.subcategory) : "") +
                    ' · ' + Portal.escapeHTML(ticket.opened) +
                '</span>' +
            '</div>' +
            '<span class="priority ' + Portal.escapeHTML(ticket.priority) + '">' + Portal.priorityLabel(ticket.priority) + '</span>' +
            '<span class="status ' + Portal.statusClass(ticket.status) + '">' + Portal.statusLabel(ticket.status) + '</span>' +
            '<span class="ticket-arrow">›</span>';

        row.addEventListener("click", function () {
            localStorage.setItem(Portal.STORAGE.selected, ticket.number);
            window.location.href = "ticket.html";
        });

        list.appendChild(row);
    });

    if (tickets.length === 0) {
        list.innerHTML =
            '<div class="empty-state">' +
                '<span class="big">▣</span>' +
                (Portal.myTickets().length === 0
                    ? "No tickets yet. Report your first incident."
                    : "No tickets match the selected status.") +
                '<br>' +
                '<button class="create-btn empty-btn" onclick="window.location.href=\'report.html\'">' +
                '<span>+</span>Report Incident</button>' +
            '</div>';
    }
}

statusFilter.addEventListener("change", render);
render();

// =========================================
// LIVE SYNC (cross-tab)
// =========================================

window.addEventListener("storage", function (event) {
    if (event.key !== Portal.STORAGE.incidents) return;
    render();
});