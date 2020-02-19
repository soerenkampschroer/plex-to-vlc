export default class PlayerButton {
    
    constructor(clickCallback) {
        this.callback = clickCallback;
        this.interval = null;
        this.toolbarSelector = ".measuredPageHeaderToolbar-toolbar-2vtgM4";
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
            el.classList = "ptvlc-launch ToolbarButton-toolbarButton-2i2nnD Link-link-2n0yJn Link-default-2XA2bN";
            el.innerHTML = "VLC";
            document.querySelector(this.toolbarSelector).insertAdjacentElement("afterbegin", el);
            document.querySelector(".ptvlc-launch").addEventListener("mousedown", this.callback);
        }
    }
}