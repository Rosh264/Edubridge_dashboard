// =========================================
// SHARED HELPERS FOR SELF-SERVICE PORTAL
// =========================================

var Portal = (function () {

    var STORAGE = {
        users: "userPortalUsers",
        loggedIn: "userPortalLoggedIn",
        user: "userPortalUser",
        incidents: "serviceDeskIncidents",
        lastNumber: "lastIncidentNumber",
        selected: "selectedIncidentNumber"
    };

    function getJSON(key, fallback) {
        try {
            var value = JSON.parse(localStorage.getItem(key));
            return value === null || value === undefined ? fallback : value;
        } catch (e) {
            return fallback;
        }
    }

    function setJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function isLoggedIn() {
        return localStorage.getItem(STORAGE.loggedIn) === "true";
    }

    function currentUser() {
        return getJSON(STORAGE.user, null);
    }

    function requireLogin(redirect) {
        if (!isLoggedIn()) {
            window.location.href = redirect || "index.html";
        }
        return currentUser();
    }

    function logout() {
        localStorage.removeItem(STORAGE.loggedIn);
        localStorage.removeItem(STORAGE.user);
        window.location.href = "index.html";
    }

    function getUsers() {
        return getJSON(STORAGE.users, []);
    }

    function saveUsers(users) {
        setJSON(STORAGE.users, users);
    }

    function getIncidents() {
        return getJSON(STORAGE.incidents, []);
    }

    function saveIncidents(incidents) {
        setJSON(STORAGE.incidents, incidents);
    }

    function myTickets() {
        var user = currentUser();
        var all = getIncidents();
        if (!user) return all;
        return all.filter(function (inc) {
            return inc.owner === user.username ||
                inc.caller === user.name;
        });
    }

    function getNextIncidentNumber() {
        var last = parseInt(localStorage.getItem(STORAGE.lastNumber)) || 1211;
        var next = last + 1;
        return "INC" + String(next).padStart(7, "0");
    }

    function issueIncidentNumber(number) {
        var last = parseInt(localStorage.getItem(STORAGE.lastNumber)) || 1211;
        var num = parseInt(number.replace(/\D/g, "")) || (last + 1);
        if (num > last) {
            localStorage.setItem(STORAGE.lastNumber, num);
        }
    }

    function statusLabel(status) {
        if (status === "progress") return "In Progress";
        if (status === "resolved") return "Resolved";
        return "Active";
    }

    function statusClass(status) {
        if (status === "progress") return "progress";
        if (status === "resolved") return "resolved";
        return "active";
    }

    function priorityLabel(priority) {
        if (priority === "critical") return "Critical";
        if (priority === "high") return "High";
        return "Medium";
    }

    function initials(name) {
        if (!name) return "U";
        var parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function showToast(message) {
        var toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(window.portalToastTimer);
        window.portalToastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2200);
    }

    function escapeHTML(value) {
        var div = document.createElement("div");
        div.textContent = value == null ? "" : String(value);
        return div.innerHTML;
    }

    return {
        STORAGE: STORAGE,
        getJSON: getJSON,
        setJSON: setJSON,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        requireLogin: requireLogin,
        logout: logout,
        getUsers: getUsers,
        saveUsers: saveUsers,
        getIncidents: getIncidents,
        saveIncidents: saveIncidents,
        myTickets: myTickets,
        getNextIncidentNumber: getNextIncidentNumber,
        issueIncidentNumber: issueIncidentNumber,
        statusLabel: statusLabel,
        statusClass: statusClass,
        priorityLabel: priorityLabel,
        initials: initials,
        showToast: showToast,
        escapeHTML: escapeHTML
    };
})();