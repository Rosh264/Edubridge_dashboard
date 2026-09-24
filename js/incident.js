// ============================
// LOGIN CHECK
// ============================

const loggedIn = localStorage.getItem("serviceDeskLoggedIn");

if (loggedIn !== "true") {
    window.location.href = "index.html";
}

// ============================
// ELEMENTS
// ============================

const toast = document.getElementById("toast");
const state = document.getElementById("state");
const numberInput = document.getElementById("number");
const descriptionInput = document.getElementById("description");
const callerInput = document.querySelector('input[value="Enterprise Manager Connector"]') || document.querySelectorAll('input')[2];

// ============================
// TOAST
// ============================

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// ============================
// LOAD INCIDENT DATA
// ============================

const selectedNumber = localStorage.getItem("selectedIncidentNumber") || "INC0011211";

function loadIncident() {
    const incidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
    const incident = incidents.find(i => i.number === selectedNumber);

    if (!incident) {
        // Use default data for INC0011211 if not found
        document.querySelector(".page-title strong").textContent = selectedNumber;
        return;
    }

    // Update page title
    document.querySelector(".page-title strong").textContent = selectedNumber;
    document.title = "Incident - " + selectedNumber;

    // Populate form fields
    const inputs = document.querySelectorAll('.field input, .field select');

    // Map fields by their labels
    const fieldMap = {};
    document.querySelectorAll('.field').forEach(field => {
        const label = field.querySelector('label');
        const input = field.querySelector('input') || field.querySelector('select');
        if (label && input) {
            fieldMap[label.textContent.replace('*', '').trim()] = input;
        }
    });

    // Fill in values
    if (fieldMap["Number"]) fieldMap["Number"].value = incident.number;
    if (fieldMap["Opened"]) fieldMap["Opened"].value = incident.opened || "";
    if (fieldMap["Caller"]) fieldMap["Caller"].value = incident.caller;
    if (fieldMap["Opened by"]) fieldMap["Opened by"].value = incident.openedBy || "";
    if (fieldMap["Location"]) fieldMap["Location"].value = incident.location || "";
    if (fieldMap["Contact type"]) fieldMap["Contact type"].value = incident.contactType || "Phone";
    if (fieldMap["Category"]) fieldMap["Category"].value = incident.category || "";
    if (fieldMap["State"]) fieldMap["State"].value = incident.state || "Open";
    if (fieldMap["Subcategory"]) fieldMap["Subcategory"].value = incident.subcategory || "-- None --";
    if (fieldMap["Assignment group"]) fieldMap["Assignment group"].value = incident.assignmentGroup || "";
    if (fieldMap["Configuration item"]) fieldMap["Configuration item"].value = incident.configurationItem || "";
    if (fieldMap["Assigned to"]) fieldMap["Assigned to"].value = incident.assignedTo || "";

    // Priority mapping
    if (fieldMap["Priority"]) {
        if (incident.priority === "critical") fieldMap["Priority"].value = "1 - Critical";
        else if (incident.priority === "high") fieldMap["Priority"].value = "2 - High";
        else fieldMap["Priority"].value = "3 - Medium";
    }

    if (fieldMap["Impact"]) {
        if (incident.impact === "1") fieldMap["Impact"].value = "1 - Critical";
        else if (incident.impact === "2") fieldMap["Impact"].value = "2 - High";
        else fieldMap["Impact"].value = "3 - Medium";
    }

    if (fieldMap["Urgency"]) {
        if (incident.urgency === "1") fieldMap["Urgency"].value = "1 - Critical";
        else if (incident.urgency === "2") fieldMap["Urgency"].value = "2 - High";
        else fieldMap["Urgency"].value = "3 - Medium";
    }

    // Short description
    if (fieldMap["Short description"]) fieldMap["Short description"].value = incident.shortDescription;

    // Activity
    document.getElementById("activityTime").textContent = incident.createdAt || "";
    document.getElementById("activityUser").textContent = incident.openedBy || "System Administrator";
    document.getElementById("activityMessage").textContent = incident.shortDescription;

    // Notes
    if (document.getElementById("comments")) {
        document.getElementById("comments").value = incident.comments || "";
    }
    if (document.getElementById("workNotes")) {
        document.getElementById("workNotes").value = incident.workNotes || "";
    }
}

loadIncident();

// ============================
// BACK
// ============================

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "incidents.html";
});

// ============================
// UPDATE
// ============================

document.getElementById("updateBtn").addEventListener("click", () => {
    // Save changes back to localStorage
    const incidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
    const idx = incidents.findIndex(i => i.number === selectedNumber);

    if (idx !== -1) {
        // Gather current field values
        const fieldMap = {};
        document.querySelectorAll('.field').forEach(field => {
            const label = field.querySelector('label');
            const input = field.querySelector('input') || field.querySelector('select');
            if (label && input) {
                fieldMap[label.textContent.replace('*', '').trim()] = input;
            }
        });

        if (fieldMap["State"]) incidents[idx].state = fieldMap["State"].value;
        if (fieldMap["Caller"]) incidents[idx].caller = fieldMap["Caller"].value;
        if (fieldMap["Category"]) incidents[idx].category = fieldMap["Category"].value;
        if (fieldMap["Assigned to"]) incidents[idx].assignedTo = fieldMap["Assigned to"].value;
        if (fieldMap["Assignment group"]) incidents[idx].assignmentGroup = fieldMap["Assignment group"].value;
        if (fieldMap["Short description"]) incidents[idx].shortDescription = fieldMap["Short description"].value;

        // Update status based on state
        const stateVal = fieldMap["State"] ? fieldMap["State"].value : "";
        if (stateVal === "Resolved" || stateVal === "Closed") {
            incidents[idx].status = "resolved";
        } else if (stateVal === "In Progress") {
            incidents[idx].status = "progress";
        } else {
            incidents[idx].status = "active";
        }

        if (document.getElementById("comments")) {
            incidents[idx].comments = document.getElementById("comments").value;
        }
        if (document.getElementById("workNotes")) {
            incidents[idx].workNotes = document.getElementById("workNotes").value;
        }

        localStorage.setItem("serviceDeskIncidents", JSON.stringify(incidents));
    }

    showToast("Incident updated successfully.");
});

// ============================
// RESOLVE
// ============================

document.getElementById("resolveBtn").addEventListener("click", () => {
    state.value = "Resolved";

    // Update in localStorage
    const incidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
    const idx = incidents.findIndex(i => i.number === selectedNumber);

    if (idx !== -1) {
        incidents[idx].state = "Resolved";
        incidents[idx].status = "resolved";
        localStorage.setItem("serviceDeskIncidents", JSON.stringify(incidents));
    }

    showToast("Incident marked as resolved.");
});

// ============================
// DELETE
// ============================

document.getElementById("deleteBtn").addEventListener("click", () => {
    const confirmDelete = confirm("Delete incident " + selectedNumber + "?");

    if (confirmDelete) {
        // Remove from localStorage
        const incidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];
        const filtered = incidents.filter(i => i.number !== selectedNumber);
        localStorage.setItem("serviceDeskIncidents", JSON.stringify(filtered));

        showToast("Incident deleted.");

        setTimeout(() => {
            window.location.href = "incidents.html";
        }, 800);
    }
});

// ============================
// RELATED SEARCH
// ============================

document.getElementById("relatedBtn").addEventListener("click", () => {
    showToast("Related search results opened.");
});

// ============================
// COLLAPSE NOTES
// ============================

document.getElementById("collapseBtn").addEventListener("click", () => {
    const content = document.getElementById("notesContent");
    const button = document.getElementById("collapseBtn");

    if (content.style.display === "none") {
        content.style.display = "";
        button.textContent = "⌄";
    } else {
        content.style.display = "none";
        button.textContent = "›";
    }
});
