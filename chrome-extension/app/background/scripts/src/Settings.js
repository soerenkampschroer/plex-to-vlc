export default class Settings {
    
    markItemsPlayed = true;
    player = "default";

    constructor () {
        this.load();
    }

    get() {
        console.log("get settings");
        return {
            markItemsPlayed: this.markItemsPlayed,
            player: this.player
        };
    }

    save() {
        console.log("saving");
        let settings = {
            markItemsPlayed: this.markItemsPlayed,
            player: this.player
        };
        console.log(settings);
        chrome.storage.local.set(settings);
    }

    load() {
        console.log("loading");
        chrome.storage.local.get((items) => {
            let saveSettings = false;
            console.log(items);
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
        });
    }
}