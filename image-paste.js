(function() {
    let imagePasteEnabled = false;
    let isOnCreatePage = location.pathname.startsWith('/create');
  
    function handlePasteEvent(e) {
      if (!imagePasteEnabled) return;
      if (!isOnCreatePage) return;
  
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
  
    function updateImagePasteListener() {
      if (imagePasteEnabled && isOnCreatePage) {
        document.addEventListener("paste", handlePasteEvent);
      } else {
        document.removeEventListener("paste", handlePasteEvent);
      }
    }
  
    function onURLChange() {
      const newIsOnCreatePage = location.pathname.startsWith('/create');
      if (isOnCreatePage !== newIsOnCreatePage) {
        isOnCreatePage = newIsOnCreatePage;
        updateImagePasteListener();
      }
    }
  
    // Override pushState and replaceState to detect URL changes
    (function(history) {
      const pushState = history.pushState;
      history.pushState = function() {
        const ret = pushState.apply(history, arguments);
        onURLChange();
        return ret;
      };
  
      const replaceState = history.replaceState;
      history.replaceState = function() {
        const ret = replaceState.apply(history, arguments);
        onURLChange();
        return ret;
      };
    })(window.history);
  
    // Listen to popstate event
    window.addEventListener('popstate', onURLChange);
  
    // Monitor hash changes and other URL changes
    const urlCheckInterval = setInterval(onURLChange, 1000);
  
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
  })();
  
