// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }
const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;
document.getElementById("mobileMenu").addEventListener("click", () => { document.getElementById("sidebar").classList.toggle("open"); });
document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("serviceDeskLoggedIn"); localStorage.removeItem("serviceDeskUser"); window.location.href = "index.html"; });

function loadReports() {
    const incidents = JSON.parse(localStorage.getItem("serviceDeskIncidents")) || [];

    // Stats
    const total = incidents.length;
    const open = incidents.filter(i => i.status === "active").length;
    const inProgress = incidents.filter(i => i.status === "progress").length;
    const resolved = incidents.filter(i => i.status === "resolved").length;
    const critical = incidents.filter(i => i.priority === "critical").length;

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statOpen").textContent = open;
    document.getElementById("statProgress").textContent = inProgress;
    document.getElementById("statResolved").textContent = resolved;
    document.getElementById("statCritical").textContent = critical;

    const maxVal = Math.max(total, 1);

    // Status Chart
    const statusChart = document.getElementById("statusChart");
    statusChart.innerHTML = `
        <div class="bar-chart">
            <div class="bar-row">
                <span class="bar-label">Open</span>
                <div class="bar-track"><div class="bar-fill blue" style="width:${(open/maxVal)*100}%"><span>${open}</span></div></div>
            </div>
            <div class="bar-row">
                <span class="bar-label">In Progress</span>
                <div class="bar-track"><div class="bar-fill orange" style="width:${(inProgress/maxVal)*100}%"><span>${inProgress}</span></div></div>
            </div>
            <div class="bar-row">
                <span class="bar-label">Resolved</span>
                <div class="bar-track"><div class="bar-fill green" style="width:${(resolved/maxVal)*100}%"><span>${resolved}</span></div></div>
            </div>
        </div>
    `;

    // Priority Chart
    const criticalCount = incidents.filter(i => i.priority === "critical").length;
    const highCount = incidents.filter(i => i.priority === "high").length;
    const mediumCount = incidents.filter(i => i.priority === "medium").length;
    const pMax = Math.max(criticalCount, highCount, mediumCount, 1);

    const priorityChart = document.getElementById("priorityChart");
    priorityChart.innerHTML = `
        <div class="bar-chart">
            <div class="bar-row">
                <span class="bar-label">Critical</span>
                <div class="bar-track"><div class="bar-fill red" style="width:${(criticalCount/pMax)*100}%"><span>${criticalCount}</span></div></div>
            </div>
            <div class="bar-row">
                <span class="bar-label">High</span>
                <div class="bar-track"><div class="bar-fill orange" style="width:${(highCount/pMax)*100}%"><span>${highCount}</span></div></div>
            </div>
            <div class="bar-row">
                <span class="bar-label">Medium</span>
                <div class="bar-track"><div class="bar-fill gray" style="width:${(mediumCount/pMax)*100}%"><span>${mediumCount}</span></div></div>
            </div>
        </div>
    `;

    // Category Chart
    const categories = {};
    incidents.forEach(i => {
        categories[i.category] = (categories[i.category] || 0) + 1;
    });
    const catMax = Math.max(...Object.values(categories), 1);
    const catColors = ["blue", "green", "orange", "purple", "red", "teal", "gray"];
    let catIdx = 0;

    const categoryChart = document.getElementById("categoryChart");
    let catHtml = '<div class="bar-chart">';
    for (const [cat, count] of Object.entries(categories).sort((a, b) => b[1] - a[1])) {
        const color = catColors[catIdx % catColors.length];
        catIdx++;
        catHtml += `
            <div class="bar-row">
                <span class="bar-label">${cat}</span>
                <div class="bar-track"><div class="bar-fill ${color}" style="width:${(count/catMax)*100}%"><span>${count}</span></div></div>
            </div>
        `;
    }
    catHtml += '</div>';
    categoryChart.innerHTML = catHtml || '<p style="color:#71808a;font-size:11px;">No data available</p>';

    // Recent Activity
    const recentActivity = document.getElementById("recentActivity");
    const recent = incidents.slice(0, 8);
    if (recent.length === 0) {
        recentActivity.innerHTML = '<p style="color:#71808a;font-size:11px;">No recent activity</p>';
    } else {
        let actHtml = '<div class="activity-list">';
        recent.forEach(inc => {
            let statusClass = inc.status;
            let statusLabel = "Active";
            if (inc.status === "progress") statusLabel = "In Progress";
            else if (inc.status === "resolved") statusLabel = "Resolved";

            actHtml += `
                <div class="activity-entry">
                    <span class="a-number">${inc.number}</span>
                    <span class="a-desc">${inc.shortDescription}</span>
                    <span class="a-status ${statusClass}">${statusLabel}</span>
                </div>
            `;
        });
        actHtml += '</div>';
        recentActivity.innerHTML = actHtml;
    }
}

loadReports();
