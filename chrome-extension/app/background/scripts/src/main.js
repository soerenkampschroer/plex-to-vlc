import Settings from "./Settings.js";

class Main {

    /**
     * This is the host app id.
     */
    static HOST_NAME = "com.soerenkampschroer.plextovlc";
    
    /**
     * Minumum companion app version.
     */
    static ACCEPTABLE_HOST_VERSION = "1.4.0";

    constructor() {
        chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
        chrome.runtime.onInstalled.addListener(this.handleOnInstalled.bind(this));
    }

    handleMessage(request, caller, callback) {
        this.handleMessageWrapper(request, caller, callback).then(callback);
        return true;
    }

    async handleMessageWrapper(request, caller, callback) {
        
        let settings = new Settings();
        await settings.load();

        switch (request.type) {
            case "playback":
                request.player = settings.get().player;
                this.openNativeMessagePort(request, this.onDisconnected.bind(this), this.onMessage.bind(this));       
                return true;
            case "getSettings":
                return settings.get();
            case "saveSettings":
                settings.markItemsPlayed = request.settings.markItemsPlayed;
                settings.player = request.settings.player;
                settings.save(request.settings);
                return true;
            case "hostVersionCheck":
                this.openNativeMessagePort({type: "version"}, this.onDisconnected.bind(this), this.onCheckVersionMessage.bind(this));
                return true;
        }
    }

    handleOnInstalled() {
        // console.log('checking host app version');
        // this.openNativeMessagePort({type: "version"}, this.onDisconnected.bind(this), this.onCheckVersionMessage.bind(this));
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

    async onMessage(request, port) {
        let settings = new Settings();
        await settings.load();
        request.markItemsPlayed = settings.get().markItemsPlayed;
        this.sendMessageToContentScript(request);
        port.disconnect();
    }

    onDisconnected() {
        if (chrome.runtime.lastError.message == "Specified native messaging host not found."
            || chrome.runtime.lastError.message == "Access to the specified native messaging host is forbidden.") {
            this.displayHostUpdateDialog();
        }
    }

    displayHostUpdateDialog() {
        this.sendMessageToContentScript("installHost");
    }

    sendMessageToContentScript(message) {
        chrome.tabs.query({active: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }
}

new Main();