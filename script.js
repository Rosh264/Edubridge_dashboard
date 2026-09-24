const toast = document.getElementById("toast");


// SHOW MESSAGE

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);
}


// UPDATE BUTTON

document.getElementById("updateBtn").addEventListener("click", () => {

    showToast("Incident updated successfully.");

});


// RESOLVE INCIDENT

document.getElementById("resolveBtn").addEventListener("click", () => {

    const state = document.getElementById("state");

    state.value = "Resolved";

    showToast("Incident marked as resolved.");

});


// DELETE

document.getElementById("deleteBtn").addEventListener("click", () => {

    const confirmed = confirm(
        "Delete incident INC0011211?"
    );

    if (confirmed) {

        showToast("Incident deleted.");

    }

});


// RELATED SEARCH

document
    .querySelector(".related-btn")
    .addEventListener("click", () => {

        showToast("Related search results opened.");

    });


// COLLAPSE NOTES

document
    .getElementById("collapseBtn")
    .addEventListener("click", () => {

        const content =
            document.getElementById("notesContent");

        const button =
            document.getElementById("collapseBtn");


        if (content.style.display === "none") {

            content.style.display = "";

            button.textContent = "⌄";

        } else {

            content.style.display = "none";

            button.textContent = "›";

        }

    });