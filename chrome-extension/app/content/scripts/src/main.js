import "babel-polyfill";
import PlayerButton from "./PlayerButton";
import Notification from "./Notification";
import PlexApi from "./PlexApi";

class Main {
    
    constructor() {
        this.plexApi = new PlexApi();
        this.notification = new Notification();
        this.button = new PlayerButton(this.handleButtonCLicked.bind(this));
        chrome.runtime.onMessage.addListener(this.handleBackgroundPageMessage.bind(this));
        chrome.runtime.sendMessage({"type": "hostVersionCheck"});
    }

    /**
     * Handles messages from background script (mainly callbacks from host app)
     * @param {object} response 
     */
    handleBackgroundPageMessage(response) {
        if (response == "installHost") {
            if (confirm("Plex to VLC\n\nYou need to install the latest Plex to VLC native host application. Do you want to open the guide now?\n\nYou can also click on the Plex to VLC extension icon to learn more.")) {
                window.open("https://github.com/soerenkampschroer/plex-to-vlc/releases/latest", "_blank");
            }
        } else if (response.status == "error") {
            this.notification.display(
                response.message + ":<br>" + response.filePath,
                Notification.Type.ERROR
            );
        } else if (response.status == "success") {
            this.notification.display(response.message + ": " + response.title);
            if (response.markItemsPlayed) {
                this.plexApi.markAsPlayed(response.id);
            }
        }
    }

    /**
     * Handles button press, loads item data and sends playback request.
     */
    handleButtonCLicked() {
        var id = this.plexApi.getItemId();
        
        if (id) {
            this.plexApi.getItemMetadata(id)
                .then(this.sendPlaybackRequest.bind(this))
                .catch (this.handleServerUnavailable.bind(this));
        } else {
            this.notification.display(
                "Could not get media id.", 
                Notification.Type.ERROR
            );
        }
    }

    /**
     * Handles error when server is unavailable.
     * @param {object} error 
     */
    handleServerUnavailable(error) {
        this.notification.display(
            "Could not reach server.",
            Notification.Type.ERROR
        );
    }

    /**
     * Send playback request to background page.
     * @param {object} metadata 
     */
    sendPlaybackRequest(metadata) {
        let request = {
            "filePath": metadata.MediaContainer.Metadata[0].Media[0].Part[0].file,
            "downloadUrl": window.location.origin + metadata.MediaContainer.Metadata[0].Media[0].Part[0].key + "?X-Plex-Token=" + this.plexApi.getAccessToken(),
            "title": metadata.MediaContainer.Metadata[0].title,
            "id": metadata.MediaContainer.Metadata[0].ratingKey,
            "type": "playback"
        };
        
        try {
            chrome.runtime.sendMessage(request);
        } catch (error) {
            this.notification.display(
                "Could not connect to extension. Please reload this page.",
                Notification.Type.ERROR
            );
        }
    }

}

// Start
new Main();