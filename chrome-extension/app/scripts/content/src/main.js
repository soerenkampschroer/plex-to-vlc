import "babel-polyfill";
import PlayerButton from "./PlayerButton";
import Notification from "./Notification";
import PlexApi from "./PlexApi";

class Main {
    constructor() {
        this.button = new PlayerButton(this.handleButtonCLicked.bind(this));
        this.notification = new Notification();
        this.plexApi = new PlexApi();
        this.setupBackgroundPageListener();
    }

    setupBackgroundPageListener() {
        chrome.runtime.onMessage.addListener(this.handleBackgroundPageMessage.bind(this));
    }

    handleBackgroundPageMessage(response) {
        if (response.status == "error") {
            this.notification.display(response.message + ":<br>" + response.filePath, response.status);
        } else if (response.status == "success") {
            this.notification.display(response.message + ": " + response.title, response.status);
            this.plexApi.markAsPlayed(response.id);
        }
    }

    handleButtonCLicked() {
        var id = this.plexApi.getItemId();
        
        if (id) {
            this.plexApi.getItemMetadata(id).then((metadata) => {
                let request = {
                    "filePath": metadata.MediaContainer.Metadata[0].Media[0].Part[0].file,
                    "title": metadata.MediaContainer.Metadata[0].title,
                    "id": id
                };
                this.sendPlaybackRequest(request);
            });
        } else {
            this.notification.display("Could not get media id.", "error");
        }
    }

    sendPlaybackRequest(request) {
        chrome.runtime.sendMessage(request);
    }

}

new Main();