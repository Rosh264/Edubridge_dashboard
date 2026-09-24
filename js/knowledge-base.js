// LOGIN CHECK
const loggedIn = localStorage.getItem("serviceDeskLoggedIn");
if (loggedIn !== "true") { window.location.href = "index.html"; }
const username = localStorage.getItem("serviceDeskUser") || "Admin";
document.getElementById("profileName").textContent = username;
document.getElementById("mobileMenu").addEventListener("click", () => { document.getElementById("sidebar").classList.toggle("open"); });
document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("serviceDeskLoggedIn"); localStorage.removeItem("serviceDeskUser"); window.location.href = "index.html"; });

const categories = [
    { name: "Hardware", icon: "🖥", count: 4 },
    { name: "Software", icon: "💿", count: 3 },
    { name: "Network", icon: "🌐", count: 3 },
    { name: "Account & Access", icon: "🔑", count: 2 },
    { name: "Email", icon: "✉", count: 2 },
    { name: "Windows", icon: "⊞", count: 3 },
    { name: "General Troubleshooting", icon: "🔧", count: 2 }
];

const articles = [
    {
        id: "KB001001", title: "How to reset a Windows password", category: "Windows", author: "Service Desk Team",
        updated: "2025-07-01",
        content: `<h4>Steps to reset your Windows password</h4>
        <p>If you've forgotten your Windows password or need to reset it, follow these steps:</p>
        <ol>
            <li>Press <code>Ctrl + Alt + Delete</code> on the login screen</li>
            <li>Click "Change a password"</li>
            <li>Enter your current password</li>
            <li>Enter and confirm your new password</li>
            <li>Press Enter to save changes</li>
        </ol>
        <p><strong>For domain users:</strong> Contact the Service Desk if you cannot access the password reset option. Our team can perform a remote password reset through Active Directory.</p>
        <p><strong>Note:</strong> New passwords must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.</p>`
    },
    {
        id: "KB001002", title: "How to connect to company Wi-Fi", category: "Network", author: "Network Operations",
        updated: "2025-06-28",
        content: `<h4>Connecting to Corporate Wi-Fi</h4>
        <p>Follow these steps to connect your device to the company wireless network:</p>
        <ol>
            <li>Click the Wi-Fi icon in the system tray (bottom right corner)</li>
            <li>Select <strong>CORP-WIFI</strong> from the available networks</li>
            <li>Click "Connect"</li>
            <li>Enter your domain credentials (same as your email login)</li>
            <li>Accept the security certificate if prompted</li>
            <li>Wait for the connection to be established</li>
        </ol>
        <p><strong>Troubleshooting:</strong> If the connection fails, try forgetting the network and reconnecting. For persistent issues, contact Network Operations.</p>`
    },
    {
        id: "KB001003", title: "How to troubleshoot Bluetooth issues", category: "Hardware", author: "Hardware Team",
        updated: "2025-06-25",
        content: `<h4>Bluetooth Troubleshooting Guide</h4>
        <p>If your Bluetooth device isn't connecting or working properly:</p>
        <ol>
            <li>Ensure Bluetooth is turned on: Settings > Devices > Bluetooth</li>
            <li>Make sure the device is in pairing mode</li>
            <li>Remove the device from paired list and re-pair it</li>
            <li>Update Bluetooth drivers via Device Manager</li>
            <li>Run the Bluetooth troubleshooter: Settings > Update & Security > Troubleshoot</li>
        </ol>
        <p><strong>If issues persist:</strong> The Bluetooth adapter may need replacement. Submit a Hardware Request through the Service Desk portal.</p>`
    },
    {
        id: "KB001004", title: "VPN connection troubleshooting", category: "Network", author: "Network Operations",
        updated: "2025-07-05",
        content: `<h4>VPN Connection Issues</h4>
        <p>If you're having trouble connecting to the company VPN:</p>
        <ol>
            <li>Verify your internet connection is working</li>
            <li>Ensure the VPN client is up to date</li>
            <li>Check that your account is enabled for VPN access</li>
            <li>Try connecting to a different VPN server location</li>
            <li>Clear the VPN client cache and restart</li>
            <li>Disable any firewall/antivirus temporarily to test</li>
        </ol>
        <p><strong>Common error codes:</strong></p>
        <ul>
            <li>Error 789: L2TP connection attempt failed - restart the IKEEXT service</li>
            <li>Error 809: Cannot establish VPN connection - check firewall settings</li>
        </ul>`
    },
    {
        id: "KB001005", title: "DNS troubleshooting guide", category: "Network", author: "Network Operations",
        updated: "2025-06-20",
        content: `<h4>DNS Troubleshooting</h4>
        <p>If websites aren't loading but your internet connection appears fine:</p>
        <ol>
            <li>Open Command Prompt as Administrator</li>
            <li>Run <code>ipconfig /flushdns</code></li>
            <li>Run <code>ipconfig /registerdns</code></li>
            <li>Run <code>nslookup [website]</code> to test DNS resolution</li>
            <li>Try using Google DNS (8.8.8.8) as a temporary test</li>
        </ol>
        <p>Contact Network Operations if the issue persists across multiple devices.</p>`
    },
    {
        id: "KB001006", title: "Windows blue screen troubleshooting", category: "Windows", author: "Service Desk Team",
        updated: "2025-07-03",
        content: `<h4>Blue Screen of Death (BSOD) Recovery</h4>
        <p>If you encounter a blue screen error:</p>
        <ol>
            <li>Note the error code displayed on the blue screen</li>
            <li>Restart your computer</li>
            <li>Boot into Safe Mode if the system keeps crashing</li>
            <li>Check for Windows updates</li>
            <li>Run <code>sfc /scannow</code> in Command Prompt</li>
            <li>Check Event Viewer for error details</li>
        </ol>
        <p><strong>Important:</strong> If you cannot boot at all, contact the Service Desk immediately. We can perform remote diagnostics or schedule an on-site visit.</p>`
    },
    {
        id: "KB001007", title: "Software installation request process", category: "Software", author: "Service Desk Team",
        updated: "2025-06-15",
        content: `<h4>How to Request Software Installation</h4>
        <p>All software installations must go through the approval process:</p>
        <ol>
            <li>Submit a Service Request through the portal</li>
            <li>Select "Software Installation" as the request type</li>
            <li>Provide the software name, version, and business justification</li>
            <li>Wait for manager approval</li>
            <li>IT will install the software within 2-3 business days</li>
        </ol>
        <p><strong>Approved software:</strong> Check the approved software list in the portal before submitting a request. Pre-approved software can be installed immediately.</p>`
    },
    {
        id: "KB001008", title: "How to set up email on Outlook", category: "Email", author: "Messaging Team",
        updated: "2025-07-02",
        content: `<h4>Outlook Email Setup</h4>
        <p>To configure Microsoft Outlook for your corporate email:</p>
        <ol>
            <li>Open Microsoft Outlook</li>
            <li>Go to File > Add Account</li>
            <li>Enter your email address</li>
            <li>Outlook will auto-discover settings - allow it to proceed</li>
            <li>Enter your password when prompted</li>
            <li>Complete the setup wizard</li>
        </ol>
        <p><strong>Note:</strong> Outlook must be installed on your machine. If you need it installed, submit a Software Installation request.</p>`
    },
    {
        id: "KB001009", title: "How to request account access", category: "Account & Access", author: "Access Management",
        updated: "2025-06-30",
        content: `<h4>Account Access Requests</h4>
        <p>To request access to systems and applications:</p>
        <ol>
            <li>Submit a Service Request with type "Account Access"</li>
            <li>Specify the system/application name</li>
            <li>Provide the level of access needed</li>
            <li>Your manager will receive an approval request</li>
            <li>Once approved, access will be provisioned within 24 hours</li>
        </ol>
        <p><strong>Required information:</strong> System name, access level (read/write/admin), business justification, and duration (if temporary).</p>`
    },
    {
        id: "KB001010", title: "Printer troubleshooting guide", category: "Hardware", author: "Hardware Team",
        updated: "2025-06-22",
        content: `<h4>Common Printer Issues</h4>
        <p>If your printer isn't working:</p>
        <ol>
            <li>Check that the printer is powered on and connected</li>
            <li>Verify paper is loaded and no jams exist</li>
            <li>Check ink/toner levels</li>
            <li>Restart the print spooler service</li>
            <li>Remove and re-add the printer</li>
        </ol>
        <p><strong>Network printers:</strong> Ensure you're on the correct network segment. Contact Hardware Team for persistent connectivity issues.</p>`
    },
    {
        id: "KB001011", title: "How to enable remote desktop", category: "Windows", author: "Service Desk Team",
        updated: "2025-07-04",
        content: `<h4>Remote Desktop Setup</h4>
        <p>To enable Remote Desktop on your Windows machine:</p>
        <ol>
            <li>Right-click "This PC" > Properties</li>
            <li>Click "Remote settings"</li>
            <li>Select "Allow remote connections to this computer"</li>
            <li>Uncheck "Allow connections only from computers running Remote Desktop with Network Level Authentication" (if needed)</li>
            <li>Click Apply and OK</li>
        </ol>
        <p><strong>Security note:</strong> Remote Desktop should only be enabled when needed. Disable it when not in use.</p>`
    },
    {
        id: "KB001012", title: "How to troubleshoot slow computer performance", category: "General Troubleshooting", author: "Service Desk Team",
        updated: "2025-07-06",
        content: `<h4>Computer Performance Issues</h4>
        <p>If your computer is running slowly:</p>
        <ol>
            <li>Restart your computer</li>
            <li>Check Task Manager for high CPU/memory usage</li>
            <li>Uninstall unnecessary programs</li>
            <li>Run Disk Cleanup to free up space</li>
            <li>Check for malware with Windows Defender</li>
            <li>Update Windows and drivers</li>
        </ol>
        <p><strong>Hardware check:</strong> If performance issues persist, you may need a hardware upgrade. Submit a Hardware Request through the portal.</p>`
    }
];

// Render categories
const catGrid = document.getElementById("categoriesGrid");
let activeCategory = null;

function renderCategories() {
    catGrid.innerHTML = "";
    // All category
    const allCard = document.createElement("div");
    allCard.className = "category-card" + (activeCategory === null ? " active" : "");
    allCard.innerHTML = `<div class="cat-icon">📋</div><div class="cat-name">All</div><div class="cat-count">${articles.length} articles</div>`;
    allCard.addEventListener("click", () => { activeCategory = null; renderCategories(); filterArticles(); });
    catGrid.appendChild(allCard);

    categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card" + (activeCategory === cat.name ? " active" : "");
        const count = articles.filter(a => a.category === cat.name).length;
        card.innerHTML = `<div class="cat-icon">${cat.icon}</div><div class="cat-name">${cat.name}</div><div class="cat-count">${count} articles</div>`;
        card.addEventListener("click", () => { activeCategory = cat.name; renderCategories(); filterArticles(); });
        catGrid.appendChild(card);
    });
}
renderCategories();

// Render articles
const articlesList = document.getElementById("articlesList");
const articlesTitle = document.getElementById("articlesTitle");
const articleCount = document.getElementById("articleCount");

function renderArticles(list) {
    articlesList.innerHTML = "";
    list.forEach(art => {
        const item = document.createElement("div");
        item.className = "article-item";
        item.innerHTML = `
            <div class="art-title">${art.title}</div>
            <div class="art-excerpt">${art.content.replace(/<[^>]+>/g, '').substring(0, 120)}...</div>
            <div class="art-meta">
                <span class="art-cat">${art.category}</span>
                <span>By ${art.author}</span>
                <span>Updated: ${art.updated}</span>
                <span>${art.id}</span>
            </div>
        `;
        item.addEventListener("click", () => openArticle(art));
        articlesList.appendChild(item);
    });

    articlesTitle.textContent = activeCategory || "All Articles";
    articleCount.textContent = list.length + " articles";
}

function filterArticles() {
    const search = document.getElementById("kbSearch").value.toLowerCase().trim();
    let filtered = articles;
    if (activeCategory) filtered = filtered.filter(a => a.category === activeCategory);
    if (search) filtered = filtered.filter(a => (a.title + " " + a.content + " " + a.category).toLowerCase().includes(search));
    renderArticles(filtered);
}

document.getElementById("kbSearch").addEventListener("input", filterArticles);
renderArticles(articles);

// Article modal
const articleModal = document.getElementById("articleModal");
document.getElementById("articleClose").addEventListener("click", () => articleModal.classList.remove("show"));
articleModal.addEventListener("click", e => { if (e.target === articleModal) articleModal.classList.remove("show"); });

function openArticle(art) {
    document.getElementById("articleTitle").textContent = art.title;
    document.getElementById("articleMeta").innerHTML = `
        <span><strong>ID:</strong> ${art.id}</span>
        <span><strong>Category:</strong> ${art.category}</span>
        <span><strong>Author:</strong> ${art.author}</span>
        <span><strong>Updated:</strong> ${art.updated}</span>
    `;
    document.getElementById("articleContent").innerHTML = art.content;
    articleModal.classList.add("show");
}
