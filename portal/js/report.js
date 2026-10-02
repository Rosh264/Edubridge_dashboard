// =========================================
// PORTAL REPORT INCIDENT
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

document.getElementById("cancelBtn").addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

// ---- Opens ----
var now = new Date();
var openedDate = now.toLocaleString();
document.getElementById("opened").value = openedDate;
document.getElementById("openedBy").value = user.name;
document.getElementById("number").value = Portal.getNextIncidentNumber();

// ---- Category -> Subcategory ----
var category = document.getElementById("category");
var subcategory = document.getElementById("subcategory");

var subOptions = {
    "Hardware": ["Laptop / Desktop", "Printer", "Monitor", "Peripheral", "Other Hardware"],
    "Software": ["Application", "Installation", "License", "Email", "Other Software"],
    "Network": ["Connectivity", "VPN", "Wi-Fi", "Slow Internet", "Other Network"],
    "Database": ["Database", "Query", "Backup", "Performance"],
    "Application": ["Login", "Feature", "Bug / Error", "Enhancement"],
    "Account & Access": ["Password reset", "Account locked", "New account", "Permission / Role"]
};

category.addEventListener("change", function () {
    var value = this.value;
    subcategory.innerHTML = '<option>-- None --</option>';

    var options = subOptions[value];
    if (!options) return;

    options.forEach(function (item) {
        var option = document.createElement("option");
        option.textContent = item;
        subcategory.appendChild(option);
    });
});

// =========================================
// SUBMIT
// =========================================

var form = document.getElementById("reportForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    var shortDescription = document.getElementById("shortDescription").value.trim();

    if (!category.value) {
        category.focus();
        Portal.showToast("Please select a category.");
        return;
    }

    if (!shortDescription) {
        document.getElementById("shortDescription").focus();
        Portal.showToast("Short description is required.");
        return;
    }

    var ticketNumber = Portal.getNextIncidentNumber();

    var newTicket = {
        number: ticketNumber,
        caller: user.name,
        owner: user.username,
        source: "User Portal",
        contactType: "Self-service",
        location: document.getElementById("location").value.trim(),
        category: category.value,
        subcategory: subcategory.value,
        assignmentGroup: "Service Desk",
        configurationItem: "",
        assignedTo: "",
        impact: "3",
        urgency: "3",
        priority: document.getElementById("priority").value,
        state: "New",
        status: "active",
        shortDescription: shortDescription,
        errorMessage: "",
        description: document.getElementById("description").value.trim(),
        comments: document.getElementById("description").value.trim(),
        workNotes: "",
        troubleshooting: "",
        openedBy: user.name,
        opened: openedDate,
        createdAt: openedDate
    };

    var incidents = Portal.getIncidents();
    incidents.unshift(newTicket);
    Portal.saveIncidents(incidents);
    Portal.issueIncidentNumber(ticketNumber);

    localStorage.setItem(Portal.STORAGE.selected, ticketNumber);

    Portal.showToast("Incident " + ticketNumber + " reported to the service desk.");

    setTimeout(function () {
        window.location.href = "ticket.html";
    }, 900);
});