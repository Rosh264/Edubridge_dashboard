// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }
const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;
document.getElementById("mobileMenu").addEventListener("click", () => { document.getElementById("sidebar").classList.toggle("open"); });
document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("serviceDeskLoggedIn"); localStorage.removeItem("serviceDeskUser"); window.location.href = "index.html"; });

const defaultProblems = [
    { number: "PRB001001", shortDescription: "Repeated network outage in Block A", category: "Network", impact: "high", priority: "high", status: "investigation", assignedGroup: "Network Operations", assignedTo: "Ravi Kumar", createdAt: "7/1/2025, 10:00:00 AM" },
    { number: "PRB001002", shortDescription: "Intermittent database timeout errors", category: "Database", impact: "high", priority: "critical", status: "open", assignedGroup: "Database Team", assignedTo: "", createdAt: "6/28/2025, 2:30:00 PM" },
    { number: "PRB001003", shortDescription: "VPN connection drops for remote users", category: "Network", impact: "medium", priority: "medium", status: "open", assignedGroup: "Network Operations", assignedTo: "Amit Sharma", createdAt: "6/25/2025, 9:15:00 AM" },
    { number: "PRB001004", shortDescription: "Printer spooler service crashing", category: "Hardware", impact: "low", priority: "medium", status: "resolved", assignedGroup: "Hardware Team", assignedTo: "", createdAt: "6/20/2025, 11:45:00 AM" },
    { number: "PRB001005", shortDescription: "Email delivery delays exceeding 30 minutes", category: "Software", impact: "high", priority: "high", status: "investigation", assignedGroup: "Messaging Team", assignedTo: "", createdAt: "6/18/2025, 3:00:00 PM" }
];

function initialize() {
    const existing = JSON.parse(localStorage.getItem("serviceDeskProblems")) || [];
    if (existing.length === 0) {
        localStorage.setItem("serviceDeskProblems", JSON.stringify(defaultProblems));
        localStorage.setItem("lastProblemNumber", "1005");
        return defaultProblems;
    }
    return existing;
}
let allProblems = initialize();

const table = document.getElementById("problemTable");
const resultCount = document.getElementById("resultCount");
const totalCount = document.getElementById("totalCount");

function renderTable(problems) {
    table.innerHTML = "";
    problems.forEach(p => {
        const row = document.createElement("tr");
        row.dataset.status = p.status;
        row.dataset.priority = p.priority;
        row.dataset.search = `${p.number} ${p.shortDescription} ${p.category} ${p.assignedGroup}`.toLowerCase();
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td><span style="color:var(--primary);font-weight:600;cursor:pointer" onclick="viewProblem('${p.number}')">${p.number}</span></td>
            <td><div class="description"><strong>${p.shortDescription}</strong><span>${p.category}</span></div></td>
            <td>${p.category}</td>
            <td>${p.impact.charAt(0).toUpperCase()+p.impact.slice(1)}</td>
            <td><span class="priority ${p.priority}">${p.priority.charAt(0).toUpperCase()+p.priority.slice(1)}</span></td>
            <td><span class="status ${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
            <td>${p.assignedGroup}</td>
            <td>${p.createdAt}</td>
            <td><div class="action-btns"><button onclick="viewProblem('${p.number}')">View</button><button onclick="editProblem('${p.number}')">Edit</button><button class="danger" onclick="closeProblem('${p.number}')">Close</button></div></td>
        `;
        table.appendChild(row);
    });
    totalCount.textContent = problems.length;
    resultCount.textContent = problems.length;
}
renderTable(allProblems);

function filterProblems() {
    const s = document.getElementById("searchInput").value.toLowerCase().trim();
    const st = document.getElementById("statusFilter").value;
    const pr = document.getElementById("priorityFilter").value;
    let v = 0;
    table.querySelectorAll("tr").forEach(r => {
        const ok = (r.dataset.search||"").includes(s) && (st==="all"||r.dataset.status===st) && (pr==="all"||r.dataset.priority===pr);
        r.style.display = ok ? "" : "none";
        if (ok) v++;
    });
    resultCount.textContent = v;
}
document.getElementById("searchInput").addEventListener("input", filterProblems);
document.getElementById("statusFilter").addEventListener("change", filterProblems);
document.getElementById("priorityFilter").addEventListener("change", filterProblems);
document.getElementById("clearFilters").addEventListener("click", () => { document.getElementById("searchInput").value=""; document.getElementById("statusFilter").value="all"; document.getElementById("priorityFilter").value="all"; filterProblems(); });
document.getElementById("selectAll").addEventListener("change", function(){ table.querySelectorAll("td input[type='checkbox']").forEach(b=>{ if(b.closest("tr").style.display!=="none") b.checked=this.checked; }); });

function showToast(m){ const t=document.getElementById("toast"); t.textContent=m; t.classList.add("show"); clearTimeout(wt); wt=setTimeout(()=>t.classList.remove("show"),2200); }
let wt;

const overlay = document.getElementById("modalOverlay");
const form = document.getElementById("problemForm");
let editing = null;

function openModal(title, num) {
    document.getElementById("modalTitle").textContent = title;
    editing = num || null;
    document.getElementById("modalSubmitBtn").textContent = num ? "Update" : "Create Problem";
    overlay.classList.add("show");
}
function closeModal() { overlay.classList.remove("show"); form.reset(); editing = null; document.getElementById("prbGroup").value = "Service Desk"; }
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if(e.target===overlay) closeModal(); });

document.getElementById("createBtn").addEventListener("click", () => {
    let n = parseInt(localStorage.getItem("lastProblemNumber")) || 1005;
    n++;
    document.getElementById("prbNumber").value = "PRB" + String(n).padStart(6, "0");
    localStorage.setItem("lastProblemNumber", n);
    openModal("Create Problem");
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
        number: document.getElementById("prbNumber").value,
        shortDescription: document.getElementById("prbDesc").value.trim(),
        category: document.getElementById("prbCategory").value,
        impact: document.getElementById("prbImpact").value,
        priority: document.getElementById("prbPriority").value,
        status: document.getElementById("prbStatus").value,
        assignedGroup: document.getElementById("prbGroup").value.trim(),
        assignedTo: document.getElementById("prbAssigned").value.trim(),
        createdAt: editing ? allProblems.find(p=>p.number===editing).createdAt : new Date().toLocaleString()
    };
    if (editing) { const i = allProblems.findIndex(p=>p.number===editing); if(i!==-1) allProblems[i]={...allProblems[i],...data}; }
    else allProblems.unshift(data);
    localStorage.setItem("serviceDeskProblems", JSON.stringify(allProblems));
    renderTable(allProblems);
    closeModal();
    showToast(editing ? "Problem updated." : "Problem created: " + data.number);
});

window.viewProblem = function(num) {
    const p = allProblems.find(x=>x.number===num);
    if(!p) return;
    openModal("View Problem - " + num, num);
    document.getElementById("prbNumber").value = p.number;
    document.getElementById("prbDesc").value = p.shortDescription;
    document.getElementById("prbCategory").value = p.category;
    document.getElementById("prbImpact").value = p.impact;
    document.getElementById("prbPriority").value = p.priority;
    document.getElementById("prbStatus").value = p.status;
    document.getElementById("prbGroup").value = p.assignedGroup;
    document.getElementById("prbAssigned").value = p.assignedTo;
};
window.editProblem = function(num) { viewProblem(num); };
window.closeProblem = function(num) {
    if(!confirm("Close problem "+num+"?")) return;
    const i = allProblems.findIndex(p=>p.number===num);
    if(i!==-1){ allProblems[i].status="closed"; localStorage.setItem("serviceDeskProblems",JSON.stringify(allProblems)); renderTable(allProblems); showToast("Problem closed."); }
};
