function injectTemplatesSection(showTemplates) {
    let templatesSection = document.getElementById('extension-templates-section');

    if (showTemplates) {
        if (!templatesSection) {
            // Create the templates section
            templatesSection = document.createElement('div');
            templatesSection.id = 'extension-templates-section';

            // Create the "Templates" text
            const templatesTitle = document.createElement('h3');
            templatesTitle.textContent = 'Templates';
            templatesSection.appendChild(templatesTitle);

            // Create the templates container
            const templatesContainer = document.createElement('div');
            templatesContainer.id = 'templates-container';
            templatesSection.appendChild(templatesContainer);

            // Append the templates section to the body (fixed position)
            document.body.appendChild(templatesSection);
        }

        displayTemplates();
    } else {
        if (templatesSection) {
            templatesSection.remove();
        }
    }
}

function displayTemplates() {
    chrome.storage.local.get('coinTemplates', (data) => {
        const templates = data.coinTemplates || [];

        const templatesContainer = document.getElementById('templates-container');
        if (templatesContainer) {
            templatesContainer.innerHTML = '';

            if (templates.length === 0) {
                const noTemplates = document.createElement('p');
                noTemplates.textContent = 'No templates available';
                templatesContainer.appendChild(noTemplates);
            } else {
                templates.forEach(template => {
                    const templateDiv = document.createElement('div');
                    templateDiv.className = 'template-card';

                    // Template image container
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'template-image-container';

                    // Template image
                    const img = document.createElement('img');
                    img.src = template.image;
                    img.alt = template.name;

                    // Dark overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'template-overlay';

                    // Template name over the image
                    const name = document.createElement('span');
                    name.textContent = template.name;
                    name.className = 'template-image-text';

                    // Append name to overlay
                    overlay.appendChild(name);

                    // Append image and overlay to imgContainer
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(overlay);

                    // Append imgContainer to templateDiv
                    templateDiv.appendChild(imgContainer);

                    // Add click event to apply the template
                    templateDiv.addEventListener('click', () => {
                        applyTemplate(template);
                    });

                    templatesContainer.appendChild(templateDiv);
                });
            }
        } else {
            console.error('Templates container not found.');
        }
    });
}

function applyTemplate(template) {
    // Simulate click on "Show more options" if the fields are hidden
    const showMoreButton = document.querySelector('.cursor-pointer.hover\\:underline.text-blue-400.w-fit');
    if (showMoreButton && showMoreButton.textContent.includes('Show more options')) {
        showMoreButton.click();
    }

    // Delay to allow the fields to render
    setTimeout(() => {
        // Twitter input field
        let twitterInput = document.querySelector('input#twitter') ||
            document.querySelector('input[name="twitter"]') ||
            document.querySelector('input[placeholder*="Twitter"]') ||
            document.querySelector('input[aria-label="twitter"]');

        if (twitterInput) {
            twitterInput.value = template.twitter || '';
            twitterInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.error('Twitter input not found.');
        }

        // Telegram input field
        let telegramInput = document.querySelector('input#telegram') ||
            document.querySelector('input[name="telegram"]') ||
            document.querySelector('input[placeholder*="Telegram"]') ||
            document.querySelector('input[aria-label="telegram"]');

        if (telegramInput) {
            telegramInput.value = template.telegram || '';
            telegramInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.error('Telegram input not found.');
        }

        // Website input field
        let websiteInput = document.querySelector('input#website') ||
            document.querySelector('input[name="website"]') ||
            document.querySelector('input[placeholder*="Website"]') ||
            document.querySelector('input[aria-label="website"]');

        if (websiteInput) {
            websiteInput.value = template.website || '';
            websiteInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.error('Website input not found.');
        }

        // Upload the image
        const imageInput = document.querySelector('input[type="file"]');
        if (imageInput) {
            // Create a Blob from the data URL
            const arr = template.image.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], 'template-image.png', { type: mime });

            // Create a DataTransfer to simulate file selection
            const dt = new DataTransfer();
            dt.items.add(file);
            imageInput.files = dt.files;

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            imageInput.dispatchEvent(event);
        } else {
            console.error('Image input not found.');
        }
    }, 500); // Adjust delay as needed
}

// On page load, get the setting and inject templates if enabled
chrome.storage.sync.get("coinTemplatesEnabled", (data) => {
    const isEnabled = data.coinTemplatesEnabled || false;
    injectTemplatesSection(isEnabled);
});

// Listen for messages from popup or template editor
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleTemplates") {
        injectTemplatesSection(request.showTemplates);
    } else if (request.action === "updateTemplates") {
        // Update the templates displayed
        displayTemplates();
    }
});
