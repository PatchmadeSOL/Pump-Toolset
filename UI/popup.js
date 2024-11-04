// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const websiteOptimizationToggle = document.getElementById('websiteOptimization');
    const coinTemplatesToggle = document.getElementById('coinTemplates');
    const autoExpandToggle = document.getElementById('autoExpand'); // New toggle

    if (websiteOptimizationToggle) {
        // Load the saved toggle state
        chrome.storage.sync.get("websiteOptimizationEnabled", (data) => {
            const isEnabled = data.websiteOptimizationEnabled || false;
            websiteOptimizationToggle.checked = isEnabled;
        });

        // Save the toggle state and send message to content script on change
        websiteOptimizationToggle.addEventListener('change', () => {
            const isEnabled = websiteOptimizationToggle.checked;
            chrome.storage.sync.set({ "websiteOptimizationEnabled": isEnabled });

            // Send message to content script to update hiding
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].url.includes("pump.fun")) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "updateHiding", hideContent: isEnabled });
                }
            });
        });
    } else {
        console.error("Optimization toggle element not found.");
    }

    if (coinTemplatesToggle) {
        // Load the saved toggle state
        chrome.storage.sync.get("coinTemplatesEnabled", (data) => {
            const isEnabled = data.coinTemplatesEnabled || false;
            coinTemplatesToggle.checked = isEnabled;
        });

        // Save the toggle state and send message to content script on change
        coinTemplatesToggle.addEventListener('change', () => {
            const isEnabled = coinTemplatesToggle.checked;
            chrome.storage.sync.set({ "coinTemplatesEnabled": isEnabled });

            // Send message to content script to update templates visibility
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].url.includes("pump.fun/create")) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleTemplates", showTemplates: isEnabled });
                }
            });
        });
    } else {
        console.error("Coin Templates toggle element not found.");
    }

    if (autoExpandToggle) {
        // Load the saved toggle state
        chrome.storage.sync.get("autoExpandEnabled", (data) => {
            const isEnabled = data.autoExpandEnabled || false;
            autoExpandToggle.checked = isEnabled;
        });

        // Save the toggle state and send message to content script on change
        autoExpandToggle.addEventListener('change', () => {
            const isEnabled = autoExpandToggle.checked;
            chrome.storage.sync.set({ "autoExpandEnabled": isEnabled });

            // Send message to content script to perform auto expand
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].url.includes("pump.fun/create")) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleAutoExpand", autoExpand: isEnabled });
                }
            });
        });
    } else {
        console.error("Auto Expand toggle element not found.");
    }
});
