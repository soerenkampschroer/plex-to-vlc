export default class PlayerButton {
    
    constructor(clickCallback) {
        this.callback = clickCallback;
        this.interval = null;
        this.toolbarSelector = "[class^=PrePlayActionBar]";
        this.insertSelector = this.toolbarSelector + " button:nth-child(4)";
        this.handleButtonAdd();
        window.addEventListener("hashchange", this.handleButtonAdd.bind(this));
    }

    handleButtonAdd() {
        if (location.hash.indexOf("/server") > -1 && location.hash.indexOf("/details") > -1) {
            this.checkLoaded();
        }
    }

    checkLoaded() {
        this.interval = setInterval(() => {
            if (document.querySelector(this.toolbarSelector)) {
                this.addVlcLink();
                clearInterval(this.interval);
            }
        }, 500);
    }

    addVlcLink() {
        if (!document.querySelector(".ptvlc-launch")) {
            var el = document.createElement("button");
            el.classList = "ptvlc-launch ActionButton-iconActionButton-3RWDHb ActionButton-actionButton-392O1X Button-button-1q7C1V Link-link-2WGTd7 ActionButton-medium-2--fwJ Button-button-1q7C1V Link-link-2WGTd7 Button-default-37HUnP Button-medium-21zX8X Link-default-1Q-OS9";
            el.innerHTML = "VLC";
            var toolbar = document.querySelector(this.toolbarSelector);
            var buttonLocation = document.querySelector(this.insertSelector);
            toolbar.insertBefore(el, buttonLocation);
            document.querySelector(".ptvlc-launch").addEventListener("mousedown", this.callback);
        }
    }
}