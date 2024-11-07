document.addEventListener('DOMContentLoaded', () => {
    const websiteOptimizationToggle = document.getElementById('websiteOptimization');
    const coinTemplatesToggle = document.getElementById('coinTemplates');
    const autoExpandToggle = document.getElementById('autoExpand');
    const imagePasteToggle = document.getElementById('imagePaste'); // New toggle

    if (websiteOptimizationToggle) {
        // Existing code for websiteOptimizationToggle...
        chrome.storage.sync.get("websiteOptimizationEnabled", (data) => {
            const isEnabled = data.websiteOptimizationEnabled || false;
            websiteOptimizationToggle.checked = isEnabled;
        });

        websiteOptimizationToggle.addEventListener('change', () => {
            const isEnabled = websiteOptimizationToggle.checked;
            chrome.storage.sync.set({ "websiteOptimizationEnabled": isEnabled });

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
        // Existing code for coinTemplatesToggle...
        chrome.storage.sync.get("coinTemplatesEnabled", (data) => {
            const isEnabled = data.coinTemplatesEnabled || false;
            coinTemplatesToggle.checked = isEnabled;
        });

        coinTemplatesToggle.addEventListener('change', () => {
            const isEnabled = coinTemplatesToggle.checked;
            chrome.storage.sync.set({ "coinTemplatesEnabled": isEnabled });

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
        // Existing code for autoExpandToggle...
        chrome.storage.sync.get("autoExpandEnabled", (data) => {
            const isEnabled = data.autoExpandEnabled || false;
            autoExpandToggle.checked = isEnabled;
        });

        autoExpandToggle.addEventListener('change', () => {
            const isEnabled = autoExpandToggle.checked;
            chrome.storage.sync.set({ "autoExpandEnabled": isEnabled });

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].url.includes("pump.fun/create")) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleAutoExpand", autoExpand: isEnabled });
                }
            });
        });
    } else {
        console.error("Auto Expand toggle element not found.");
    }

    if (imagePasteToggle) {
        // New code for imagePasteToggle
        chrome.storage.sync.get("imagePasteEnabled", (data) => {
            const isEnabled = data.imagePasteEnabled || false;
            imagePasteToggle.checked = isEnabled;
        });

        imagePasteToggle.addEventListener('change', () => {
            const isEnabled = imagePasteToggle.checked;
            chrome.storage.sync.set({ "imagePasteEnabled": isEnabled });

            // Send message to content script to enable or disable image paste functionality
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].url.includes("pump.fun/create")) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleImagePaste", imagePasteEnabled: isEnabled });
                }
            });
        });
    } else {
        console.error("Image Paste toggle element not found.");
    }
});
