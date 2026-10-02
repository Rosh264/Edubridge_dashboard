// =========================================
// PORTAL TICKET DETAIL
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

// =========================================
// DATA + RENDER
// =========================================

var selectedNumber = localStorage.getItem(Portal.STORAGE.selected) || "";
var key = Portal.STORAGE.incidents;

function findTicket() {
    return Portal.getIncidents().find(function (t) { return t.number === selectedNumber; });
}

function notFound() {
    document.querySelector(".content").innerHTML =
        '<div class="panel empty-state">' +
            '<span class="big">⚠</span>' +
            'Ticket not found.<br>' +
            '<button class="create-btn empty-btn" onclick="window.location.href=\'my-tickets.html\'">' +
            '<span>›</span>Back to My Tickets</button>' +
        '</div>';
    throw new Error("Ticket not found");
}

var ticket = findTicket();
if (!ticket) notFound();

function isOwner(t) {
    return t.owner === user.username || t.caller === user.name;
}

if (!isOwner(ticket)) {
    document.querySelector(".content").innerHTML =
        '<div class="empty-state">' +
            '<span class="big">🔒</span>' +
            'You do not have access to this ticket.' +
            '<br>' +
            '<button class="create-btn empty-btn" onclick="window.location.href=\'my-tickets.html\'">' +
            '<span>›</span>Back to My Tickets</button>' +
        '</div>';
    throw new Error("Not your ticket");
}

function render() {
    ticket = findTicket();
    if (!ticket) return notFound();

    document.title = "Service Desk | " + ticket.number;
    document.getElementById("titleNumber").textContent = ticket.number;
    document.getElementById("titleDesc").textContent = ticket.shortDescription;

    document.getElementById("dNumber").textContent = ticket.number;
    document.getElementById("dDescription").textContent = ticket.shortDescription;
    document.getElementById("dOpened").textContent = ticket.opened;
    document.getElementById("dCategory").textContent = ticket.category;
    document.getElementById("dSubcategory").textContent =
        ticket.subcategory && ticket.subcategory !== "-- None --" ? ticket.subcategory : "—";
    document.getElementById("dPriority").textContent = Portal.priorityLabel(ticket.priority);
    document.getElementById("dPriority").className = "priority " + ticket.priority;
    document.getElementById("dDetails").textContent = ticket.description || "—";
    document.getElementById("dContact").textContent =
        ticket.caller + " · " + (ticket.contactType || "Self-service") +
        (ticket.location ? " · " + ticket.location : "");

    var statusEl = document.getElementById("dStatus");
    statusEl.textContent = Portal.statusLabel(ticket.status);
    statusEl.className = "status " + Portal.statusClass(ticket.status);

    var headerStatus = document.getElementById("headerStatus");
    headerStatus.textContent = Portal.statusLabel(ticket.status);
    headerStatus.className = "status " + Portal.statusClass(ticket.status);

    renderComments();
}

// =========================================
// CONVERSATION
// =========================================

var commentsArea = document.getElementById("commentsArea");

function renderComments() {
    commentsArea.innerHTML = "";

    var items = [];

    if (Array.isArray(ticket.conversation) && ticket.conversation.length > 0) {
        items = ticket.conversation.slice();
    } else if (ticket.comments) {
        items.push({
            author: ticket.openedBy || ticket.caller,
            role: "user",
            text: ticket.comments,
            time: ticket.opened
        });
    }

    if (items.length === 0) {
        commentsArea.innerHTML =
            '<div class="empty-state">' +
                '<span class="big">💬</span>' +
                'No messages yet. Send a reply below.' +
            '</div>';
        return;
    }

    items.forEach(function (msg) {
        var bubble = document.createElement("div");
        bubble.className = "comment-bubble " + (msg.role === "staff" ? "staff" : "mine");
        bubble.innerHTML =
            '<div class="comment-meta">' +
                '<strong>' + Portal.escapeHTML(msg.author) + '</strong>' +
                '<span>' + Portal.escapeHTML(msg.time) + '</span>' +
            '</div>' +
            '<div class="comment-text">' + Portal.escapeHTML(msg.text) + '</div>';
        commentsArea.appendChild(bubble);
    });
}

// =========================================
// SEND REPLY
// =========================================

var newComment = document.getElementById("newComment");

function saveTicket() {
    var incidents = Portal.getIncidents();
    var index = incidents.findIndex(function (t) { return t.number === selectedNumber; });
    if (index !== -1) {
        incidents[index] = ticket;
        Portal.saveIncidents(incidents);
    }
}

document.getElementById("sendComment").addEventListener("click", function () {
    var text = newComment.value.trim();
    if (!text) {
        newComment.focus();
        Portal.showToast("Type a message before sending.");
        return;
    }

    ticket.conversation = ticket.conversation || [];
    ticket.conversation.push({
        author: user.name,
        role: "user",
        text: text,
        time: new Date().toLocaleString()
    });

    ticket.comments = text;

    saveTicket();

    newComment.value = "";
    renderComments();
    Portal.showToast("Reply sent to the service desk.");
});

render();

// =========================================
// LIVE SYNC (cross-tab)
// =========================================

function snapshot() {
    return (ticket ? ticket.number : "") + "|" +
        (ticket ? ticket.status : "") + "|" +
        (ticket && ticket.conversation ? ticket.conversation.length : 0);
}

var lastSnapshot = snapshot();

window.addEventListener("storage", function (event) {
    if (event.key !== key) return;

    var oldStatus = ticket ? ticket.status : "";
    var oldConversationLength = ticket && ticket.conversation ? ticket.conversation.length : 0;

    render();

    var newStatus = ticket ? ticket.status : "";
    var newConversationLength = ticket && ticket.conversation ? ticket.conversation.length : 0;

    if (snapshot() === lastSnapshot) return;
    lastSnapshot = snapshot();

    if (oldStatus !== newStatus) {
        Portal.showToast("Your ticket status changed to " + Portal.statusLabel(newStatus) + ".");
    } else if (newConversationLength > oldConversationLength) {
        Portal.showToast("New message from the service desk.");
    }
});