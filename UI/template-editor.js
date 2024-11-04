document.addEventListener('DOMContentLoaded', () => {
    const templatesList = document.getElementById('templates-list');
    const templateForm = document.getElementById('templateForm');
    const addTemplateForm = document.getElementById('add-template-form');
    const showTemplateFormButton = document.getElementById('show-template-form');
    const logo = document.querySelector('.logo');
    const backButton = document.querySelector('.back-button');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const fileInput = document.getElementById('templateImage');

    // Show the Add New Template form and hide other content
    showTemplateFormButton.addEventListener('click', () => {
        addTemplateForm.style.display = 'block';
        showTemplateFormButton.style.display = 'none';
        templatesList.style.display = 'none';
        document.body.classList.add('show-add-template'); // Add class to body
    });

    // Open file selector when "Choose File" label is clicked
    document.querySelector('label[for="templateImage"]').addEventListener('click', () => {
        fileInput.click();
    });

    // Display the chosen file name
    fileInput.addEventListener('change', () => {
        fileNameDisplay.value = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
    });

    // Load existing templates and display them
    chrome.storage.local.get('coinTemplates', (data) => {
        const templates = data.coinTemplates || [];
        displayTemplates(templates);
    });

    // Handle form submission
    templateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const templateName = document.getElementById('templateName').value.trim();
        const templateTwitter = document.getElementById('templateTwitter').value.trim();
        const templateTelegram = document.getElementById('templateTelegram').value.trim();
        const templateWebsite = document.getElementById('templateWebsite').value.trim();

        if (templateName === '') {
            alert('Please enter a template name.');
            return;
        }

        if (fileInput.files.length === 0) {
            alert('Please select an image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const imageDataUrl = reader.result;

            // Get existing templates
            chrome.storage.local.get('coinTemplates', (data) => {
                const templates = data.coinTemplates || [];

                // Add new template
                templates.push({
                    name: templateName,
                    image: imageDataUrl,
                    twitter: templateTwitter,
                    telegram: templateTelegram,
                    website: templateWebsite
                });

                // Save templates
                chrome.storage.local.set({ 'coinTemplates': templates }, () => {
                    // Update the templates list
                    displayTemplates(templates);

                    // Reset the form and show other content again
                    templateForm.reset();
                    fileNameDisplay.value = 'No file chosen'; // Reset file display
                    addTemplateForm.style.display = 'none';
                    showTemplateFormButton.style.display = 'block';
                    templatesList.style.display = 'block';
                    document.body.classList.remove('show-add-template'); // Remove class from body
                });
            });
        };

        reader.readAsDataURL(fileInput.files[0]);
    });

    function displayTemplates(templates) {
        templatesList.innerHTML = '';

        if (templates.length === 0) {
            const noTemplates = document.createElement('p');
            noTemplates.textContent = 'No templates available.';
            noTemplates.className = 'no-templates-text';
            templatesList.appendChild(noTemplates);
        } else {
            templates.forEach((template, index) => {
                const templateItem = document.createElement('div');
                templateItem.className = 'template-item';

                const name = document.createElement('span');
                name.textContent = template.name;
                name.className = 'template-name';

                const deleteButton = document.createElement('img');
                deleteButton.src = 'icons/delete.png';
                deleteButton.className = 'delete-icon';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTemplate(index);
                });

                templateItem.appendChild(name);
                templateItem.appendChild(deleteButton);

                templatesList.appendChild(templateItem);
            });
        }
    }

    function deleteTemplate(index) {
        chrome.storage.local.get('coinTemplates', (data) => {
            const templates = data.coinTemplates || [];
            templates.splice(index, 1);

            chrome.storage.local.set({ 'coinTemplates': templates }, () => {
                displayTemplates(templates);
            });
        });
    }
});
