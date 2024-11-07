// background.js

console.log('Background script loaded.');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in background script:', message);
  if (message.action === "injectImage") {
    const tabId = sender.tab.id;
    const imageData = message.imageData;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      world: "MAIN",
      func: (imageData) => {
        console.log("Executing script in page context.");
        const dataURL = imageData;

        // Reconstruct the Blob without using fetch
        function dataURLtoBlob(dataurl) {
          const arr = dataurl.split(',');
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        }

        const blob = dataURLtoBlob(dataURL);
        const file = new File([blob], "pasted_image.png", { type: blob.type });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Find the input element
        const input = document.querySelector('input[type="file"]');

        if (input) {
          input.files = dataTransfer.files;

          // Trigger change event
          const event = new Event("change", { bubbles: true });
          input.dispatchEvent(event);

          console.log("Image pasted and uploaded.");
        } else {
          console.warn("Input element not found.");
        }
      },
      args: [imageData],
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error executing script:", chrome.runtime.lastError);
      } else {
        console.log("Script executed successfully.");
      }
    });

    sendResponse({ status: "Image injection initiated." });
  }
});
