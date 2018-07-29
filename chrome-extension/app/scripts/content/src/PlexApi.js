import Notification from "./Notification";

export default class PlexApi {
    constructor() {
        this.notification = new Notification();
    }

    getItemId() {
        let url = window.location.hash,
            id = null,
            idx;

        idx = url.indexOf("%2Fmetadata%2F");

        if (idx > -1) {
            id = url.substr(idx + 14);
        }

        return id;
    }

    async getItemMetadata(id) {
        
        let url,
            response;

        url = window.location.origin + "/library/metadata/" + id + "?includeConcerts=1&includeExtras=1&includeOnDeck=1&includePopularLeaves=1&includePreferences=1&includeChapters=1&asyncCheckFiles=0&asyncRefreshAnalysis=0&asyncRefreshLocalMediaAgent=0";

        try {
            response = await this.makeRequest(url);
        } catch (error) {
            this.notification.display("Error: Could not reach server.", "error");
            console.log(error);
        }

        return response;

    }

    getAccessToken() {
        return localStorage.myPlexAccessToken;
    }

    async makeRequest(url) {
        const accessToken = this.getAccessToken();

        url+= "&X-Plex-Token=" + accessToken;
        
        const response = await fetch(url,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );
        
        const json = await response.json();
        return json;
    }

    async markAsPlayed(id) {
        let url = window.location.origin + "/:/scrobble?key=" + id + "&identifier=com.plexapp.plugins.library";

        // this will throw an error but plex marks the file as played anyway..
        try {
            await this.makeRequest(url);
        } catch (error) {
            //this.notification.display("Error: Could not mark item as played.", "error");
            console.log(error);
        }
    }
}