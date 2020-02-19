import Settings from "./Settings";

class Main {

    /**
     * This is the host app id.
     */
    static HOST_NAME = "com.soerenkampschroer.plextovlc";
    
    /**
     * Acceptable host version.
     */
    static ACCEPTABLE_HOST_VERSION = "1.2.1";

    constructor() {
        window.settings = new Settings();
        chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
        chrome.runtime.onInstalled.addListener(this.handleOnInstalled.bind(this));
    }

    handleMessage(request) {
        console.log("New request:", request);
        request.player = window.settings.get().player;
        console.log(request);
        this.openNativeMessagePort(request, this.onDisconnected.bind(this), this.onMessage.bind(this));
    }

    handleOnInstalled() {
        this.openNativeMessagePort({type: "version"}, this.onDisconnected.bind(this), this.onCheckVersionMessage.bind(this));
    }

    onCheckVersionMessage(request, port) {
        if (!request.version || !this.compareVersion(Main.ACCEPTABLE_HOST_VERSION, request.version)) {
            this.displayHostUpdateDialog();
        }
        port.disconnect();
    }

    compareVersion(ver1, ver2) {
        ver1 = ver1.split(".").map( s => s.padStart(10) ).join(".");
        ver2 = ver2.split(".").map( s => s.padStart(10) ).join(".");
        return ver1 <= ver2;
    }

    openNativeMessagePort(request, onDisconnectedCallback, onMessageCallback) {
        let port = chrome.runtime.connectNative(Main.HOST_NAME);
        port.onDisconnect.addListener(onDisconnectedCallback);
        port.onMessage.addListener(onMessageCallback);
        port.postMessage(request);
    }

    onMessage(request, port) {
        console.log(request);
        request.markItemsPlayed = window.settings.get().markItemsPlayed;
        this.sendMessageToContentScript(request);
        port.disconnect();
    }

    onDisconnected() {
        console.log(chrome.runtime.lastError.message);
        if (chrome.runtime.lastError.message == "Specified native messaging host not found."
            || chrome.runtime.lastError.message == "Access to the specified native messaging host is forbidden.") {
            this.displayHostUpdateDialog();
        }
    }

    displayHostUpdateDialog() {
        if (confirm("You need to install latest native host application. Do you want to open the guide now?\n\nYou can also click on the extension icon to learn more.")) {
            window.open("https://github.com/soerenkampschroer/plex-to-vlc/releases/latest", "_blank");
        }
    }

    sendMessageToContentScript(message) {
        chrome.tabs.query({active: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }
}

new Main();