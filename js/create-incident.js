// ========================================
// LOGIN CHECK
// ========================================

if (
    localStorage.getItem("serviceDeskLoggedIn") !== "true"
) {
    window.location.href = "index.html";
}


// ========================================
// USER
// ========================================

const username =
    localStorage.getItem("serviceDeskUser") || "Admin";


// ========================================
// ELEMENTS
// ========================================

const form =
    document.getElementById("incidentForm");

const toast =
    document.getElementById("toast");

const caller =
    document.getElementById("caller");

const locationField =
    document.getElementById("location");

const contactType =
    document.getElementById("contactType");

const category =
    document.getElementById("category");

const subcategory =
    document.getElementById("subcategory");

const assignmentGroup =
    document.getElementById("assignmentGroup");

const configurationItem =
    document.getElementById("configurationItem");

const assignedTo =
    document.getElementById("assignedTo");

const impact =
    document.getElementById("impact");

const urgency =
    document.getElementById("urgency");

const priority =
    document.getElementById("priority");

const state =
    document.getElementById("state");

const shortDescription =
    document.getElementById("shortDescription");

const errorMessage =
    document.getElementById("errorMessage");

const comments =
    document.getElementById("comments");

const workNotes =
    document.getElementById("workNotes");

const troubleshooting =
    document.getElementById("troubleshooting");

const opened =
    document.getElementById("opened");

const openedBy =
    document.getElementById("openedBy");

const numberField =
    document.getElementById("number");


// ========================================
// CURRENT DATE / TIME
// ========================================

const now = new Date();

const openedDate =
    now.toLocaleString();

opened.value = openedDate;

openedBy.value = username;


// ========================================
// PREVIEW INCIDENT NUMBER
// ========================================

function getNextIncidentNumber() {

    let lastNumber =
        parseInt(
            localStorage.getItem(
                "lastIncidentNumber"
            )
        ) || 1211;

    const nextNumber =
        lastNumber + 1;

    return "INC" +
        String(nextNumber).padStart(7, "0");
}

numberField.value =
    getNextIncidentNumber();


// ========================================
// TOAST
// ========================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// ========================================
// CANCEL
// ========================================

function cancelCreation() {

    window.location.href =
        "incidents.html";
}


document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        cancelCreation
    );


document
    .getElementById("cancelTopBtn")
    .addEventListener(
        "click",
        cancelCreation
    );


document
    .getElementById("cancelBottomBtn")
    .addEventListener(
        "click",
        cancelCreation
    );


// ========================================
// TOP CREATE BUTTON
// ========================================

document
    .getElementById("submitTopBtn")
    .addEventListener(
        "click",
        () => {

            form.requestSubmit();

        }
    );


// ========================================
// CATEGORY → SUBCATEGORY
// ========================================

category.addEventListener(
    "change",
    function () {

        const value =
            this.value;

        const options = {

            Hardware: [
                "CPU",
                "Memory",
                "Disk",
                "Boot / OS startup"
            ],

            Software: [
                "Application",
                "Login"
            ],

            Network: [
                "Connectivity"
            ],

            Database: [
                "Database"
            ],

            Application: [
                "Application",
                "Login"
            ],

            "EM Incident": [
                "CPU",
                "Memory",
                "Disk"
            ]

        };

        subcategory.innerHTML =
            '<option>-- None --</option>';

        if (!options[value]) {
            return;
        }

        options[value].forEach(
            item => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.textContent =
                    item;

                subcategory.appendChild(
                    option
                );

            }
        );

    }
);


// ========================================
// IMPACT + URGENCY → PRIORITY
// ========================================

function calculatePriority() {

    const impactValue =
        parseInt(impact.value);

    const urgencyValue =
        parseInt(urgency.value);

    let result;

    if (
        impactValue === 1 &&
        urgencyValue === 1
    ) {

        result = "critical";

    } else if (
        impactValue <= 2 &&
        urgencyValue <= 2
    ) {

        result = "high";

    } else {

        result = "medium";

    }

    priority.value =
        result;
}


impact.addEventListener(
    "change",
    calculatePriority
);

urgency.addEventListener(
    "change",
    calculatePriority
);


// ========================================
// NOTES COLLAPSE
// ========================================

const collapseBtn =
    document.getElementById(
        "collapseBtn"
    );

const notesContent =
    document.getElementById(
        "notesContent"
    );


collapseBtn.addEventListener(
    "click",
    () => {

        const hidden =
            notesContent.style.display ===
            "none";

        if (hidden) {

            notesContent.style.display =
                "";

            collapseBtn.textContent =
                "⌄";

        } else {

            notesContent.style.display =
                "none";

            collapseBtn.textContent =
                "›";

        }

    }
);


// ========================================
// ACTIVITY COLLAPSE
// ========================================

const activityToggle =
    document.getElementById(
        "activityToggle"
    );

const activityItem =
    document.getElementById(
        "activityItem"
    );


activityToggle.addEventListener(
    "click",
    () => {

        const hidden =
            activityItem.style.display ===
            "none";

        if (hidden) {

            activityItem.style.display =
                "";

            activityToggle.textContent =
                "−";

        } else {

            activityItem.style.display =
                "none";

            activityToggle.textContent =
                "+";

        }

    }
);


// ========================================
// RELATED SEARCH
// ========================================

document
    .getElementById("relatedBtn")
    .addEventListener(
        "click",
        () => {

            showToast(
                "No related search results found."
            );

        }
    );


// ========================================
// CREATE INCIDENT
// ========================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            !caller.value.trim()
        ) {

            caller.focus();

            showToast(
                "Caller is required."
            );

            return;

        }


        if (
            !category.value
        ) {

            category.focus();

            showToast(
                "Category is required."
            );

            return;

        }


        if (
            !shortDescription.value.trim()
        ) {

            shortDescription.focus();

            showToast(
                "Short description is required."
            );

            return;

        }


        // -------------------------------
        // INCIDENT NUMBER
        // -------------------------------

        let lastNumber =
            parseInt(
                localStorage.getItem(
                    "lastIncidentNumber"
                )
            ) || 1211;

        lastNumber++;

        const incidentNumber =
            "INC" +
            String(lastNumber).padStart(
                7,
                "0"
            );


        localStorage.setItem(
            "lastIncidentNumber",
            lastNumber
        );


        // -------------------------------
        // CREATED TIME
        // -------------------------------

        const createdAt =
            new Date().toLocaleString();


        // -------------------------------
        // INCIDENT OBJECT
        // -------------------------------

        const newIncident = {

            number:
                incidentNumber,

            caller:
                caller.value.trim(),

            location:
                locationField.value.trim(),

            contactType:
                contactType.value,

            category:
                category.value,

            subcategory:
                subcategory.value,

            assignmentGroup:
                assignmentGroup.value.trim(),

            configurationItem:
                configurationItem.value.trim(),

            assignedTo:
                assignedTo.value.trim(),

            impact:
                impact.value,

            urgency:
                urgency.value,

            priority:
                priority.value,

            state:
                state.value,

            status:
                "active",

            shortDescription:
                shortDescription.value.trim(),

            errorMessage:
                errorMessage.value.trim(),

            description:
                comments.value.trim(),

            comments:
                comments.value.trim(),

            workNotes:
                workNotes.value.trim(),

            troubleshooting:
                troubleshooting.value.trim(),

            openedBy:
                username,

            opened:
                createdAt,

            createdAt:
                createdAt

        };


        // -------------------------------
        // GET EXISTING INCIDENTS
        // -------------------------------

        let incidents =
            JSON.parse(
                localStorage.getItem(
                    "serviceDeskIncidents"
                )
            ) || [];


        // -------------------------------
        // NEWEST FIRST
        // -------------------------------

        incidents.unshift(
            newIncident
        );


        // -------------------------------
        // SAVE
        // -------------------------------

        localStorage.setItem(
            "serviceDeskIncidents",
            JSON.stringify(
                incidents
            )
        );


        // -------------------------------
        // SELECT NEW INCIDENT
        // -------------------------------

        localStorage.setItem(
            "selectedIncidentNumber",
            incidentNumber
        );


        // -------------------------------
        // ACTIVITY
        // -------------------------------

        document.getElementById(
            "activityTime"
        ).textContent =
            createdAt;

        document.getElementById(
            "activityUser"
        ).textContent =
            username;

        document.getElementById(
            "activityMessage"
        ).textContent =
            shortDescription.value.trim();


        // -------------------------------
        // SUCCESS
        // -------------------------------

        showToast(
            "Incident " +
            incidentNumber +
            " created successfully."
        );


        // -------------------------------
        // REDIRECT
        // -------------------------------

        setTimeout(
            () => {

                window.location.href =
                    "incidents.html";

            },
            900
        );

    }
);