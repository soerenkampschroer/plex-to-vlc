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

            url = this.getServerUrl() + "/library/metadata/" + id + "?includeConcerts=1&includeExtras=1&includeOnDeck=1&includePopularLeaves=1&includePreferences=1&includeChapters=1&asyncCheckFiles=0&asyncRefreshAnalysis=0&asyncRefreshLocalMediaAgent=0";
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
     * Returns the correct server url. Useful if the Plex UI is not the same as the media server location.
     * @return {string}
     */
    getServerUrl() {
        let serverUrl = '';
        let users = JSON.parse(localStorage.users).users;

        users.forEach(user => {

            user.servers.forEach(server => {
                if (window.location.hash.includes(server.machineIdentifier)) {
                    let connection;
                    
                    // if it's a local server, try to find the direct connection
                    connection = server.connections.find(connection => connection.sources[0].id === 'internal' );
                    
                    // if there is no local connection, get any connection
                    if (!connection) {
                        connection = server.connections.find(connection => connection.uri !== undefined );
                    }

                    if (connection) {
                        serverUrl = connection.uri;
                    }
                    
                }
            });
        });

        // fallback in case we couldn't find a url
        if (serverUrl == '') {
            serverUrl = window.location.origin;
        }
        console.log(serverUrl);
        return serverUrl;
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
        let url = this.getServerUrl() + "/:/scrobble?key=" + id + "&identifier=com.plexapp.plugins.library";
        
        try {
            await this.makeRequest(url, false);
        } catch (error) {
            this.notification.display("Error: Could not mark item as played.", "error");
            console.log(error);
        }
    }
}