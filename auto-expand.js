// auto-expand.js

// Function to perform auto expand
function autoExpand() {
    const showMoreButton = document.querySelector('.cursor-pointer.hover\\:underline.text-blue-400.w-fit');
    if (showMoreButton && showMoreButton.textContent.includes('Show more options')) {
        showMoreButton.click();
    }
}

// On page load, check if auto-expand is enabled and perform auto expand
chrome.storage.sync.get("autoExpandEnabled", (data) => {
    const isEnabled = data.autoExpandEnabled || false;
    if (isEnabled) {
        // Wait for the DOM to fully load
        window.addEventListener('load', () => {
            // Slight delay to ensure elements are rendered
            setTimeout(() => {
                autoExpand();
            }, 500);
        });
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleAutoExpand") {
        if (request.autoExpand) {
            autoExpand();
        }
    }
});
