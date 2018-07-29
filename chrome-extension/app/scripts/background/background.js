/**
 * This is the host app id.
 */
const hostName = "com.soerenkampschroer.plextovlc";

/**
 * Listen for messages from the content script.
 */
chrome.runtime.onMessage.addListener(function(request) {
    console.log("New request:", request);
    openFile(request);
});

/**
 * Sends a native message to the host app. 
 * The host app will open the file and report back (error, success).
 * @param {object} request 
 */
function openFile(request) {
    let port = chrome.runtime.connectNative(hostName);
    port.onDisconnect.addListener(onDisconnected);
    port.onMessage.addListener(onMessage);
    port.postMessage(request);
}

/**
 * This function disconnects the native messaging port 
 * and sends the results to the content script.
 * @param {object} request 
 */
function onMessage(request, port) {
    sendMessageToContentScript(request);
    port.disconnect();
}

/**
 * Fired on port disconnect. Will point the user to the host app if 
 * it's not installed.
 */
function onDisconnected() {
    if (chrome.runtime.lastError.message == "Specified native messaging host not found.") {
        if (confirm("You need to install the native host application. Do you want to open the guide now?\n\nYou can also click on the extension icon to learn more.")) {
            window.open("https://github.com/soerenkampschroer/plex-to-vlc/releases/latest", "_blank");
        }
    }
}

/**
 * Sends a string or an object to the active tab.
 * @param {*} message
 */
function sendMessageToContentScript(message) {
    chrome.tabs.query({active: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}