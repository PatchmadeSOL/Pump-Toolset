// image-paste.js

let imagePasteEnabled = false;

function handlePasteEvent(e) {
  if (!imagePasteEnabled) return;

  // Check if clipboard contains image
  const items = e.clipboardData && e.clipboardData.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.indexOf("image") !== -1) {
      const blob = item.getAsFile();

      // Read the blob as data URL
      const reader = new FileReader();
      reader.onload = function (event) {
        const dataURL = event.target.result;
        // Send the dataURL to the background script
        chrome.runtime.sendMessage({ action: "injectImage", imageData: dataURL });
      };
      reader.readAsDataURL(blob);

      e.preventDefault(); // Prevent any default paste action

      break; // Only handle one image
    }
  }
}

// Function to enable or disable the paste event listener
function updateImagePasteListener() {
  if (imagePasteEnabled) {
    document.addEventListener("paste", handlePasteEvent);
  } else {
    document.removeEventListener("paste", handlePasteEvent);
  }
}

// On page load, get the setting and set up the event listener
chrome.storage.sync.get("imagePasteEnabled", (data) => {
  imagePasteEnabled = data.imagePasteEnabled || false;
  updateImagePasteListener();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleImagePaste") {
    imagePasteEnabled = request.imagePasteEnabled;
    updateImagePasteListener();
  }
});
