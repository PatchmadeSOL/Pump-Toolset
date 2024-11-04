// Function to apply or remove hiding
function applyOptimization(hideContent) {
    const element = document.querySelector(".hidden.md\\:flex.gap-2.ml-4");
    if (element) {
        element.style.display = hideContent ? "none" : "";
        console.log("Content visibility toggled:", hideContent);
    } else {
        console.warn("Element not found on page.");
    }
}

// On page load, get the setting and apply hiding
chrome.storage.sync.get("websiteOptimizationEnabled", (data) => {
    const isEnabled = data.websiteOptimizationEnabled || false;
    applyOptimization(isEnabled);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateHiding") {
        applyOptimization(request.hideContent);
    }
});
