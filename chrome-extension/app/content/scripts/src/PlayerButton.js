export default class PlayerButton {
    
    constructor(clickCallback) {
        this.callback = clickCallback;
        this.interval = null;
        this.toolbarSelector = "[class^='ActionButtonBar'],[class*=' ActionButtonBar'] > div";
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
            if (document.querySelector(this.toolbarSelector) !== null) {
                this.addVlcLink();
                clearInterval(this.interval);
            }
        }, 500);
    }

    addVlcLink() {
        if (!document.querySelector(".ptvlc-launch")) {
            var el = document.createElement("button");
            var toolbar = document.querySelector(this.toolbarSelector);
            var buttonLocation = document.querySelector(this.insertSelector);
            el.classList =  "ptvlc-launch " + buttonLocation.classList;
            el.innerHTML = "VLC";
            toolbar.insertBefore(el, buttonLocation);
            document.querySelector(".ptvlc-launch").addEventListener("mousedown", this.callback);
        }
    }
}