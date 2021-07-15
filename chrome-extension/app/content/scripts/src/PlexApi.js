export default class PlexApi {
    
    /**
     * Reads the ratingKey (media id) from the url.
     * @return {int} id
     */
    getItemId() {
        let url = window.location.hash,
            id = null,
            idx,
            idEnd;

        idx = url.indexOf("%2Fmetadata%2F") + 14;
        idEnd = url.indexOf("&", idx) - idx;

        if (idx > -1) {
            id = url.substr(idx, idEnd);
        }

        return id;
    }

    /**
     * Requests metadata for id.
     * @param {int} id 
     */
    async getItemMetadata(id) {
        let url,
            response;

        url = window.location.origin + "/library/metadata/" + id + "?includeConcerts=1&includeExtras=1&includeOnDeck=1&includePopularLeaves=1&includePreferences=1&includeChapters=1&asyncCheckFiles=0&asyncRefreshAnalysis=0&asyncRefreshLocalMediaAgent=0";
        response = await this.makeRequest(url, true);

        return response;
    }

    /**
     * @return {string}
     */
    getAccessToken() {
        return localStorage.myPlexAccessToken;
    }

    /**
     * @param {string} url 
     */
    async makeRequest(url, returnJson) {
        const accessToken = this.getAccessToken();
        url+= "&X-Plex-Token=" + accessToken;
        let response = await fetch(url, { headers: { "Accept": "application/json" } });
        if (returnJson) {
            let json = await response.json();
            return json;
        }
    }

    /**
     * @param {int} id 
     */
    async markAsPlayed(id) {
        let url = window.location.origin + "/:/scrobble?key=" + id + "&identifier=com.plexapp.plugins.library";
        
        try {
            await this.makeRequest(url, false);
        } catch (error) {
            this.notification.display("Error: Could not mark item as played.", "error");
            console.log(error);
        }
    }
}