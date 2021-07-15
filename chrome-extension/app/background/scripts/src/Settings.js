export default class Settings {
    
    markItemsPlayed = true;
    player = "default";

    constructor () {}

    get() {
        return {
            "markItemsPlayed": this.markItemsPlayed,
            "player": this.player
        };
    }

    save() {
        let settings = {
            markItemsPlayed: this.markItemsPlayed,
            player: this.player
        };
        chrome.storage.local.set(settings);
    }

    load() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(null, (items) => {
                
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                
                let saveSettings = false;
                if (items.markItemsPlayed === undefined) {
                    items.markItemsPlayed = this.markItemsPlayed;
                    saveSettings = true;
                }
                if (!items.player === undefined) {
                    items.player = this.player;
                    saveSettings = true;
                }
        
                if (saveSettings) {
                    this.save(items);
                }
        
                this.markItemsPlayed = items.markItemsPlayed;
                this.player = items.player;

                resolve(this);
            });
        });
    }
}