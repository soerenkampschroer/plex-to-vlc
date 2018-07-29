/**
 * This is the host app id.
 */
const hostName = "com.soerenkampschroer.plextovlc";

/**
 * Acceptable host version.
 */
const acceptableHostVersion = "1.1.1";

/**
 * Listen for messages from the content script.
 */
chrome.runtime.onMessage.addListener(function(request) {
    console.log("New request:", request);
    openNativeMessagePort(request, onDisconnected, onMessage);
});

/**
 * Fired when the app is first installed, updated or Chrome updated.
 */
chrome.runtime.onInstalled.addListener(function() {
    openNativeMessagePort({type: "version"}, onDisconnected, onCheckVersionMessage);
});

/**
 * Check if host app is reasonably up to date.
 * @param {object} request 
 * @param {Port} port 
 */
function onCheckVersionMessage(request, port) {
    if (!request.version || !compareVersion(acceptableHostVersion, request.version)) {
        displayHostUpdateDialog();
    }
    port.disconnect();
}

/**
 * Compare two version numbers and see which one is higher. Returns true if ver1 is higher.
 * @param {string} ver1 
 * @param {string} ver2 
 * @return {boolean}
 */
function compareVersion(ver1, ver2) {
    ver1 = ver1.split(".").map( s => s.padStart(10) ).join(".");
    ver2 = ver2.split(".").map( s => s.padStart(10) ).join(".");
    return ver1 <= ver2;
}

/**
 * Sends a native message to the host app. 
 * The host app will open the file and report back (error, success).
 * @param {object} request 
 */
function openNativeMessagePort(request, onDisconnectedCallback, onMessageCallback) {
    let port = chrome.runtime.connectNative(hostName);
    port.onDisconnect.addListener(onDisconnectedCallback);
    port.onMessage.addListener(onMessageCallback);
    port.postMessage(request);
}

/**
 * This function disconnects the native messaging port 
 * and sends the results to the content script.
 * @param {object} request 
 */
function onMessage(request, port) {
    console.log(request);
    sendMessageToContentScript(request);
    port.disconnect();
}

/**
 * Fired on port disconnect. Will point the user to the host app if 
 * it's not installed.
 */
function onDisconnected() {
    console.log(chrome.runtime.lastError.message);
    if (chrome.runtime.lastError.message == "Specified native messaging host not found."
        || chrome.runtime.lastError.message == "Access to the specified native messaging host is forbidden.") {
        displayHostUpdateDialog();
    }
}

/**
 * Display a promt to download and install the latest host app.
 */
function displayHostUpdateDialog() {
    if (confirm("You need to install latest native host application. Do you want to open the guide now?\n\nYou can also click on the extension icon to learn more.")) {
        window.open("https://github.com/soerenkampschroer/plex-to-vlc/releases/latest", "_blank");
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