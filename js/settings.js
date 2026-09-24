// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }
const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;
document.getElementById("mobileMenu").addEventListener("click", () => { document.getElementById("sidebar").classList.toggle("open"); });
document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("serviceDeskLoggedIn"); localStorage.removeItem("serviceDeskUser"); window.location.href = "index.html"; });

const defaultSettings = {
    name: username,
    email: username.toLowerCase().replace(/\s/g, ".") + "@company.com",
    department: "IT",
    nIncidents: true,
    nRequests: true,
    nDesktop: false,
    nSummary: false,
    aCompact: false,
    aConfirm: true,
    cGroup: "Service Desk",
    cAutoAssign: false
};

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem("serviceDeskSettings")) || defaultSettings;
    document.getElementById("sName").value = saved.name || defaultSettings.name;
    document.getElementById("sEmail").value = saved.email || defaultSettings.email;
    document.getElementById("sDept").value = saved.department || defaultSettings.department;
    document.getElementById("nIncidents").checked = saved.nIncidents !== false;
    document.getElementById("nRequests").checked = saved.nRequests !== false;
    document.getElementById("nDesktop").checked = saved.nDesktop === true;
    document.getElementById("nSummary").checked = saved.nSummary === true;
    document.getElementById("aCompact").checked = saved.aCompact === true;
    document.getElementById("aConfirm").checked = saved.aConfirm !== false;
    document.getElementById("cGroup").value = saved.cGroup || "Service Desk";
    document.getElementById("cAutoAssign").checked = saved.cAutoAssign === true;
}
loadSettings();

function showToast(m) {
    const t = document.getElementById("toast");
    t.textContent = m;
    t.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

document.getElementById("saveBtn").addEventListener("click", () => {
    const settings = {
        name: document.getElementById("sName").value.trim(),
        email: document.getElementById("sEmail").value.trim(),
        department: document.getElementById("sDept").value,
        nIncidents: document.getElementById("nIncidents").checked,
        nRequests: document.getElementById("nRequests").checked,
        nDesktop: document.getElementById("nDesktop").checked,
        nSummary: document.getElementById("nSummary").checked,
        aCompact: document.getElementById("aCompact").checked,
        aConfirm: document.getElementById("aConfirm").checked,
        cGroup: document.getElementById("cGroup").value,
        cAutoAssign: document.getElementById("cAutoAssign").checked
    };
    localStorage.setItem("serviceDeskSettings", JSON.stringify(settings));

    // Update user name in localStorage
    if (settings.name) {
        localStorage.setItem("serviceDeskUser", settings.name);
        document.getElementById("profileName").textContent = settings.name;
    }

    showToast("Settings saved successfully.");
});

document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all settings to default?")) return;
    localStorage.removeItem("serviceDeskSettings");
    loadSettings();
    showToast("Settings reset to default.");
});
