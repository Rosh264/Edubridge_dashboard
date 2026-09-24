// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }
const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;
document.getElementById("mobileMenu").addEventListener("click", () => { document.getElementById("sidebar").classList.toggle("open"); });
document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("serviceDeskLoggedIn"); localStorage.removeItem("serviceDeskUser"); window.location.href = "index.html"; });

const defaultChanges = [
    { number: "CHG001001", description: "Upgrade database server to latest version", changeType: "Normal", risk: "high", priority: "high", status: "approval", requestedBy: "Ravi Kumar", assignedGroup: "Database Team", plannedDate: "2025-08-15", createdAt: "7/1/2025, 10:00:00 AM" },
    { number: "CHG001002", description: "Deploy new firewall rules for security compliance", changeType: "Standard", risk: "medium", priority: "medium", status: "scheduled", requestedBy: "Neha Gupta", assignedGroup: "Network Operations", plannedDate: "2025-08-10", createdAt: "6/28/2025, 2:30:00 PM" },
    { number: "CHG001003", description: "Emergency patch for critical vulnerability CVE-2025-1234", changeType: "Emergency", risk: "high", priority: "critical", status: "implementation", requestedBy: "System Administrator", assignedGroup: "Security Team", plannedDate: "2025-07-20", createdAt: "6/25/2025, 9:15:00 AM" },
    { number: "CHG001004", description: "Migrate email service to cloud platform", changeType: "Normal", risk: "medium", priority: "high", status: "assessment", requestedBy: "Priya Sharma", assignedGroup: "Messaging Team", plannedDate: "2025-09-01", createdAt: "6/20/2025, 11:45:00 AM" },
    { number: "CHG001005", description: "Update SSL certificates for web applications", changeType: "Standard", risk: "low", priority: "medium", status: "completed", requestedBy: "Amit Patel", assignedGroup: "Infrastructure", plannedDate: "2025-07-15", createdAt: "6/18/2025, 3:00:00 PM" }
];

function initialize() {
    const existing = JSON.parse(localStorage.getItem("serviceDeskChanges")) || [];
    if (existing.length === 0) {
        localStorage.setItem("serviceDeskChanges", JSON.stringify(defaultChanges));
        localStorage.setItem("lastChangeNumber", "1005");
        return defaultChanges;
    }
    return existing;
}
let allChanges = initialize();

const table = document.getElementById("changeTable");
const resultCount = document.getElementById("resultCount");
const totalCount = document.getElementById("totalCount");

function renderTable(changes) {
    table.innerHTML = "";
    changes.forEach(c => {
        const row = document.createElement("tr");
        row.dataset.status = c.status;
        row.dataset.type = c.changeType;
        row.dataset.search = `${c.number} ${c.description} ${c.changeType} ${c.requestedBy}`.toLowerCase();
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td><span style="color:var(--primary);font-weight:600;cursor:pointer" onclick="viewChange('${c.number}')">${c.number}</span></td>
            <td><div class="description"><strong>${c.description}</strong></div></td>
            <td>${c.changeType}</td>
            <td><span class="risk ${c.risk}">${c.risk.charAt(0).toUpperCase()+c.risk.slice(1)}</span></td>
            <td><span class="priority ${c.priority}">${c.priority.charAt(0).toUpperCase()+c.priority.slice(1)}</span></td>
            <td><span class="status ${c.status}">${c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
            <td>${c.requestedBy}</td>
            <td>${c.plannedDate}</td>
            <td><div class="action-btns"><button onclick="viewChange('${c.number}')">View</button><button onclick="editChange('${c.number}')">Edit</button><button onclick="completeChange('${c.number}')">Complete</button><button class="danger" onclick="cancelChange('${c.number}')">Cancel</button></div></td>
        `;
        table.appendChild(row);
    });
    totalCount.textContent = changes.length;
    resultCount.textContent = changes.length;
}
renderTable(allChanges);

function filterChanges() {
    const s = document.getElementById("searchInput").value.toLowerCase().trim();
    const st = document.getElementById("statusFilter").value;
    const ty = document.getElementById("typeFilter").value;
    let v = 0;
    table.querySelectorAll("tr").forEach(r => {
        const ok = (r.dataset.search||"").includes(s) && (st==="all"||r.dataset.status===st) && (ty==="all"||r.dataset.type===ty);
        r.style.display = ok ? "" : "none";
        if (ok) v++;
    });
    resultCount.textContent = v;
}
document.getElementById("searchInput").addEventListener("input", filterChanges);
document.getElementById("statusFilter").addEventListener("change", filterChanges);
document.getElementById("typeFilter").addEventListener("change", filterChanges);
document.getElementById("clearFilters").addEventListener("click", () => { document.getElementById("searchInput").value=""; document.getElementById("statusFilter").value="all"; document.getElementById("typeFilter").value="all"; filterChanges(); });
document.getElementById("selectAll").addEventListener("change", function(){ table.querySelectorAll("td input[type='checkbox']").forEach(b=>{ if(b.closest("tr").style.display!=="none") b.checked=this.checked; }); });

function showToast(m){ const t=document.getElementById("toast"); t.textContent=m; t.classList.add("show"); clearTimeout(wt); wt=setTimeout(()=>t.classList.remove("show"),2200); }
let wt;

const overlay = document.getElementById("modalOverlay");
const form = document.getElementById("changeForm");
let editing = null;

function openModal(title, num) {
    document.getElementById("modalTitle").textContent = title;
    editing = num || null;
    document.getElementById("modalSubmitBtn").textContent = num ? "Update" : "Create Change";
    overlay.classList.add("show");
}
function closeModal() { overlay.classList.remove("show"); form.reset(); editing = null; document.getElementById("chgGroup").value = "Service Desk"; }
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if(e.target===overlay) closeModal(); });

document.getElementById("createBtn").addEventListener("click", () => {
    let n = parseInt(localStorage.getItem("lastChangeNumber")) || 1005;
    n++;
    document.getElementById("chgNumber").value = "CHG" + String(n).padStart(6, "0");
    localStorage.setItem("lastChangeNumber", n);
    openModal("Create Change");
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
        number: document.getElementById("chgNumber").value,
        description: document.getElementById("chgDesc").value.trim(),
        changeType: document.getElementById("chgType").value,
        risk: document.getElementById("chgRisk").value,
        priority: document.getElementById("chgPriority").value,
        status: document.getElementById("chgStatus").value,
        requestedBy: document.getElementById("chgBy").value.trim() || username,
        assignedGroup: document.getElementById("chgGroup").value.trim(),
        plannedDate: document.getElementById("chgDate").value,
        createdAt: editing ? allChanges.find(c=>c.number===editing).createdAt : new Date().toLocaleString()
    };
    if (editing) { const i = allChanges.findIndex(c=>c.number===editing); if(i!==-1) allChanges[i]={...allChanges[i],...data}; }
    else allChanges.unshift(data);
    localStorage.setItem("serviceDeskChanges", JSON.stringify(allChanges));
    renderTable(allChanges);
    closeModal();
    showToast(editing ? "Change updated." : "Change created: " + data.number);
});

window.viewChange = function(num) {
    const c = allChanges.find(x=>x.number===num);
    if(!c) return;
    openModal("View Change - " + num, num);
    document.getElementById("chgNumber").value = c.number;
    document.getElementById("chgDesc").value = c.description;
    document.getElementById("chgType").value = c.changeType;
    document.getElementById("chgRisk").value = c.risk;
    document.getElementById("chgPriority").value = c.priority;
    document.getElementById("chgStatus").value = c.status;
    document.getElementById("chgBy").value = c.requestedBy;
    document.getElementById("chgGroup").value = c.assignedGroup;
    document.getElementById("chgDate").value = c.plannedDate;
};
window.editChange = function(num) { viewChange(num); };
window.completeChange = function(num) {
    if(!confirm("Mark change "+num+" as completed?")) return;
    const i = allChanges.findIndex(c=>c.number===num);
    if(i!==-1){ allChanges[i].status="completed"; localStorage.setItem("serviceDeskChanges",JSON.stringify(allChanges)); renderTable(allChanges); showToast("Change completed."); }
};
window.cancelChange = function(num) {
    if(!confirm("Cancel change "+num+"?")) return;
    const i = allChanges.findIndex(c=>c.number===num);
    if(i!==-1){ allChanges[i].status="cancelled"; localStorage.setItem("serviceDeskChanges",JSON.stringify(allChanges)); renderTable(allChanges); showToast("Change cancelled."); }
};
